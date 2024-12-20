"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Wallet } from 'lucide-react'

export default function Navbar() {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' })
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        setWalletAddress(accounts[0])
        setIsConnected(true)
      } catch (error) {
        console.error("Failed to connect wallet:", error)
      }
    } else {
      alert("Please install MetaMask!")
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#FFFDF6] border-b-4 border-black">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link 
            href="/" 
            className="text-2xl font-bold bg-yellow-400 px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            CrowdFund
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/campaigns"
              className="text-lg font-medium hover:bg-yellow-200 px-3 py-1 rounded-md transition-colors"
            >
              Campaigns
            </Link>
            {["About", "Solutions", "Customers"].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-lg font-medium hover:bg-yellow-200 px-3 py-1 rounded-md transition-colors"
              >
                {item}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/create-campaign">
              <Button 
                className="bg-[#00FF7F] hover:bg-[#00DD7F] text-black font-bold border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-md"
              >
                Create Campaign
              </Button>
            </Link>
            <Button 
              onClick={connectWallet}
              className="bg-[#00FF7F] hover:bg-[#00DD7F] text-black font-bold border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-md flex items-center gap-2"
            >
              <Wallet size={20} />
              {isConnected ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "Connect Wallet"}
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

