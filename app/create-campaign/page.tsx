"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Navbar from '@/components/navbar'

export default function CreateCampaign() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goal: '',
    duration: '',
    category: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData)
    // Reset form after submission
    setFormData({
      title: '',
      description: '',
      goal: '',
      duration: '',
      category: '',
    })
  }

  return (
    <div className="min-h-screen bg-[#FFFDF6]">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <Link href="/" className="inline-flex items-center text-black hover:text-[#3498db] mb-6 transition-colors">
          <ArrowLeft className="mr-2" />
          Back to Home
        </Link>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto bg-white p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
        >
          <h1 className="text-3xl font-bold mb-6 text-center">Create Your Campaign</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Campaign Title
              </label>
              <Input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full border-2 border-black"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                className="w-full border-2 border-black"
                rows={4}
              />
            </div>
            <div>
              <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-1">
                Funding Goal (ETH)
              </label>
              <Input
                type="number"
                id="goal"
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full border-2 border-black"
              />
            </div>
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                Campaign Duration (days)
              </label>
              <Input
                type="number"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                min="1"
                max="365"
                className="w-full border-2 border-black"
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full border-2 border-black rounded-md shadow-sm p-2"
              >
                <option value="">Select a category</option>
                <option value="tech">Technology</option>
                <option value="art">Art</option>
                <option value="music">Music</option>
                <option value="film">Film</option>
                <option value="games">Games</option>
                <option value="other">Other</option>
              </select>
            </div>
            <Button 
              type="submit"
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-1 active:translate-y-1 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              Create Campaign
            </Button>
          </form>
        </motion.div>
      </main>
    </div>
  )
}

