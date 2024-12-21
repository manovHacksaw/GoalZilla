import { ReactNode } from 'react';

export interface Campaign {
  id: string;
  title: string;
  description: string;
  goal: number;
  currentAmount: number;
  deadline: Date;
  creator: string;
  milestones: Milestone[];
  category: string;
  beneficiaries: string;
  proofOfWork: string;
  collateral?: string;
  multimedia?: File | null;
}

export interface Milestone {
  id: string;
  name: string;
  target: number;
  completed: boolean;
  dueDate?: Date;
}

export interface GoalZillaContextType {
  // Wallet
  isConnected: boolean;
  connectedAccount: string | null;
  accountBalance: number;
  
  // State
  campaigns: Campaign[];
  userCampaigns: Campaign[];
  loading: boolean;
  error: string | null;
  
  // Campaign actions
  createCampaign: (campaign: Omit<Campaign, 'id' | 'currentAmount'>) => Promise<void>;
  contributeToCampaign: (campaignId: string, amount: number) => Promise<void>;
  withdrawFromCampaign: (campaignId: string, amount: number) => Promise<void>;

  // Milestone actions
  completeMilestone: (campaignId: string, milestoneId: string) => Promise<void>;
  updateMilestone: (campaignId: string, milestoneId: string, updates: Partial<Milestone>) => Promise<void>;

  // User actions
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;

  // State getters
  getCampaign: (campaignId: string) => Campaign | undefined;
  getUserContributions: (address: string) => Promise<{ campaignId: string; amount: number }[]>;
  getCampaignById: (id: string) => Promise<Campaign | null>;  // Ensure correct return type
}

// GoalZillaProviderProps interface
export interface GoalZillaProviderProps {
  children: ReactNode;
}

export interface GoalZillaProviderProps {
  children: ReactNode;
}