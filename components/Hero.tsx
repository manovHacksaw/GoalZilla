"use client"

import { motion } from "framer-motion"
import { Search } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Hero() {
  return (
    <section className="pt-32 pb-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-[#3498db] p-8 rounded-lg shadow-lg"
          >
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-6xl font-bold mb-6 text-black"
            >
              Unlock the power of Web3 Crowdfunding 🚀
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl mb-8 text-black"
            >
              Apply for our milestone-based funding and set your project up for success with transparent, decentralized crowdfunding.
            </motion.p>
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex gap-4"
            >
              <Link href="/campaigns" className="flex-1">
                <Button 
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-1 active:translate-y-1 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  Explore Campaigns
                </Button>
              </Link>
              <Link href="/create-campaign" className="flex-1">
                <Button 
                  className="w-full bg-[#00FF7F] hover:bg-[#00DD7F] text-black font-bold border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-1 active:translate-y-1 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  Create Campaign
                </Button>
              </Link>
            </motion.div>
          </motion.div>
          
          <motion.div 
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-[#FF69B4] p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            <div className="relative">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7, type: "spring" }}
                className="absolute -top-4 -right-4 bg-yellow-400 rounded-full px-4 py-2 border-4 border-black"
              >
                <span className="text-2xl font-bold text-[#2c3e50]">100K+</span>
                <div className="text-sm font-bold text-[#2c3e50]">Active Projects</div>
              </motion.div>
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: "spring" }}
                className="absolute -bottom-4 -right-4 bg-[#00FF7F] rounded-full px-4 py-2 border-4 border-black"
              >
                <span className="text-2xl font-bold text-[#ecf0f1]">500+</span>
                <div className="text-sm font-bold text-[#ecf0f1]">Successful Funds</div>
              </motion.div>
              <div className="h-80 bg-white border-4 border-black p-4">
                <motion.div
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    y: [0, -10, 0]
                  }}
                  transition={{ 
                    duration: 5,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  className="w-32 h-32 bg-[#f39c12] rounded-lg mx-auto"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

