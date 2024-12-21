"use client"
import { createContext, useContext, useState } from "react";
import type { 
  GoalZillaContextType, 
  GoalZillaProviderProps,
  Campaign,
  Milestone 
} from "@/utils/contextInterfaces"
import { chainIdHex, contractABI, contractAddress } from "@/utils/constants";

import { switchNetwork } from "@/utils/addCurrentNetwork";
import { ethers } from "ethers";

// Create context with a default value
const defaultContextValue: GoalZillaContextType = {
    isConnected: false,
    connectedAccount: null,
    accountBalance: 0,
    campaigns: [],
    userCampaigns: [],
    loading: false,
    error: null,
    createCampaign: async () => {},
    contributeToCampaign: async () => {},
    withdrawFromCampaign: async () => {},
    completeMilestone: async () => {},
    updateMilestone: async () => {},
    connectWallet: async () => {},
    disconnectWallet: async () => {},
    getCampaign: () => undefined,
    getUserContributions: async () => []
};

// Create the context with type
export const GoalZillaContext = createContext<GoalZillaContextType>(defaultContextValue);

// Create the provider component
export const GoalZillaProvider: React.FC<GoalZillaProviderProps> = ({ children }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [connectedAccount, setConnectedAccount] = useState<string | null>(null);
    const [accountBalance, setAccountBalance] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [userCampaigns, setUserCampaigns] = useState<Campaign[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Connect to MetaMask and retrieve account info
    async function connectWallet() {
        if (typeof window.ethereum !== "undefined") {
            try {
                setLoading(true);
                const providerInstance = new ethers.BrowserProvider(window.ethereum);

                // Check and switch network if necessary
                const chainId = await window.ethereum.request({
                    method: "eth_chainId"
                });

                if (chainId !== chainIdHex) {
                    await switchNetwork(chainIdHex);
                }

                const accounts = await providerInstance.send("eth_requestAccounts", []);
                const balance = await providerInstance.getBalance(accounts[0]);

                setConnectedAccount(accounts[0]);
                setAccountBalance(Number(ethers.formatEther(balance)));  // Ensure it's a number
                setIsConnected(true);
            } catch (error) {
                console.error("Error connecting to wallet: ", error);
                setError("Error connecting to wallet.");
            } finally {
                setLoading(false);
            }
        } else {
            alert("MetaMask is required to use this app.");
            window.open("https://metamask.io/download.html", "_blank");
        }
    }

    // Create a campaign on the blockchain
    async function createCampaignOnBlockchain(formData: {
      title: string;
      description: string;
      goal: string;
      duration: string;
      category: string;
      milestones: { name: string; target: string }[];
      beneficiaries: string;
      proofOfWork: string;
      collateral: string;
      multimedia: string[];
    }) {
      try {
        if (!window.ethereum) {
          alert("Please install MetaMask or use a web3-enabled browser.");
          return;
        }
    
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
    
        // Parse milestone data into arrays
        const milestoneNames = formData.milestones.map(milestone => milestone.name);
        const milestoneTargets = formData.milestones.map(milestone => 
          ethers.parseUnits(milestone.target || '0', 18)
        );
    
        // Ensure multimedia is an array
        const mediaArray = Array.isArray(formData.multimedia) ? formData.multimedia : [];
    
        // Call the createCampaign function on the blockchain
        const tx = await contract.createCampaign(
          formData.title,
          formData.description,
          formData.category,
          ethers.parseUnits(formData.goal, 18),
          parseInt(formData.duration),
          milestoneNames,
          milestoneTargets,
          formData.proofOfWork,
          formData.beneficiaries,
          mediaArray // Pass the array directly
        );
    
        const receipt = await tx.wait();
        console.log("Campaign created successfully", receipt);
        alert("Campaign created successfully!");
    
      } catch (error) {
        console.error("Error creating campaign:", error);
        alert("There was an error creating the campaign. Please try again.");
      }
    }

    async function fetchCampaigns() {
      try {
        // Set loading state to true while fetching data
        setLoading(true);
        
        // Set up the provider using the browser's Ethereum provider
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        
        // Create a contract instance with the signer
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        
        // Get the total number of campaigns from the contract
        const campaignCounter = await contract.campaignCounter();
        console.log("Total number of campaigns:", campaignCounter.toString());
        
        // Array to store promises for fetching individual campaigns
        const campaignPromises = [];
        
        // Fetch each campaign's data using the contract's function
        for (let i = 0; i < Number(campaignCounter); i++) {
          campaignPromises.push(contract.getCampaignMetadata(i));  // Assuming the function is getCampaignMetadata
        }
        
        // Wait for all campaign data to be fetched
        const rawCampaigns = await Promise.all(campaignPromises);
        
        // Map over the raw campaign data to parse it into a more usable format
        const parsedCampaigns = rawCampaigns.map(campaign => ({
          id: campaign.id.toString(),
          creator: campaign.creator,
          title: campaign.title,
          category: campaign.category,
          goalAmount: ethers.formatEther(campaign.goalAmount),
          totalFunded: ethers.formatEther(campaign.totalFunded),
          isActive: campaign.isActive,
          createdAt: campaign.createdAt, // Assuming timestamp
          duration: campaign.duration.toString()
        }));
    
        // Update state with all fetched campaigns
        setCampaigns(parsedCampaigns);
        console.log(parsedCampaigns[0])
    
        // If a user is connected, filter the campaigns to show only those created by the connected account
        if (connectedAccount) {
          const userCampaigns = parsedCampaigns.filter(
            campaign => campaign.creator.toLowerCase() === connectedAccount.toLowerCase()
          );
          setUserCampaigns(userCampaigns);
        }
        
        return parsedCampaigns;
        
      } catch (error) {
        console.error('Error fetching campaigns:', error);
        setError('Failed to fetch campaigns');
        return [];
      } finally {
        // Set loading state to false once the operation is complete
        setLoading(false);
      }
    }

    async function getCampaignById(id:string) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const campaignDetails = await contract.getCampaignDetails(id);
      console.log(campaignDetails)
      return campaignDetails;
    }
    
    

    // Define context value
    const value: GoalZillaContextType = {
        isConnected,
        loading,
        connectedAccount,
        accountBalance,
        connectWallet,
        fetchCampaigns,
        campaigns,
        userCampaigns,
        getCampaignById,
        error,
        createCampaign: createCampaignOnBlockchain,
        contributeToCampaign: async () => {},
        withdrawFromCampaign: async () => {},
        completeMilestone: async () => {},
        updateMilestone: async () => {},
        getCampaign: () => undefined,
        getUserContributions: async () => []
    };

    return (
        <GoalZillaContext.Provider value={value}>
            {children}
        </GoalZillaContext.Provider>
    );
};

// Custom hook for using the context
export const useGoalZilla = () => {
    const context = useContext(GoalZillaContext);
    if (!context) {
        throw new Error('useGoalZilla must be used within a GoalZillaProvider');
    }
    return context;
};

// Export types
export type { 
  GoalZillaContextType, 
  GoalZillaProviderProps, 
  Campaign, 
  Milestone 
};
