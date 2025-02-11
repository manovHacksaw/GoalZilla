"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Navbar from "@/components/navbar"
import { useGoalZilla } from "@/context/GoalZillaContext"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const markdownGuide = `
**Markdown Guide**

You can use Markdown to format your descriptions, proof of work, and beneficiary information. Here are some common examples:

*   **Headings:** Use # for main headings, ## for subheadings, and so on.
    \`# Main Heading\`
    \`## Subheading\`

*   **Bold & Italics:** Surround text with *asterisks* or _underscores_ for italics and **double asterisks** or __double underscores__ for bold.
    \`*Italics*\`  \`_Italics_\`
    \`**Bold**\` \`__Bold__\`

*   **Lists:** Use * or numbers for lists.
    \`* Item 1\`
    \`* Item 2\`

    \`1. First Item\`
    \`2. Second Item\`

*   **Links:** \`[Link Text](URL)\`

*   **Quotes:** Use > to create a blockquote.
    \`> This is a quote.\`

*   **Code:** Use backticks (\`) for inline code or triple backticks (\`\`\`) for code blocks.
    \`\`\`javascript
    console.log('Hello, world!');
    \`\`\`

*   **Tables:** (GFM)

    \`\`\`
    | Header 1 | Header 2 |
    | -------- | -------- |
    | Cell 1   | Cell 2   |
    \`\`\`

Learn more at [https://www.markdownguide.org/basic-syntax/](https://www.markdownguide.org/basic-syntax/)
`

export default function CreateCampaign() {
  const { loading, createCampaign } = useGoalZilla()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goal: "",
    duration: "",
    category: "",
    milestones: [{ name: "Initial Milestone", target: "" }],
    beneficiaries: "",
    proofOfWork: "",
    collateral: "",
    multimedia: "",
  })

  const [formErrors, setFormErrors] = useState({
    title: false,
    description: false,
    goal: false,
    duration: false,
    category: false,
    beneficiaries: false,
    proofOfWork: false,
    milestones: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleMilestoneChange = (index: number, field: string, value: string) => {
    const newMilestones = [...formData.milestones]
    newMilestones[index] = { ...newMilestones[index], [field]: value }
    setFormData((prevState) => ({
      ...prevState,
      milestones: newMilestones,
    }))
  }

  const addMilestone = () => {
    setFormData((prevState) => ({
      ...prevState,
      milestones: [...prevState.milestones, { name: "", target: "" }],
    }))
  }

  const removeMilestone = (index: number) => {
    if (formData.milestones.length <= 1) {
      return
    }
    const newMilestones = formData.milestones.filter((_, i) => i !== index)
    setFormData((prevState) => ({
      ...prevState,
      milestones: newMilestones,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Form validation
    const hasValidMilestones = formData.milestones.every((milestone) => milestone.name.trim() && milestone.target)
    const totalMilestoneTargets = formData.milestones.reduce((sum, milestone) => sum + Number(milestone.target), 0)

    if (
      !formData.title ||
      !formData.description ||
      !formData.goal ||
      !formData.duration ||
      !formData.category ||
      !formData.beneficiaries ||
      !formData.proofOfWork ||
      !hasValidMilestones ||
      totalMilestoneTargets > Number(formData.goal)
    ) {
      setFormErrors({
        title: !formData.title,
        description: !formData.description,
        goal: !formData.goal,
        duration: !formData.duration,
        category: !formData.category,
        beneficiaries: !formData.beneficiaries,
        proofOfWork: !formData.proofOfWork,
        milestones: !hasValidMilestones || totalMilestoneTargets > Number(formData.goal),
      })
      return
    }

    // Loading state
    setFormErrors({ ...formErrors, loading: true })

    try {
      await createCampaign(formData)
      // Success notification or redirect
      alert("Campaign created successfully!")
    } catch (error) {
      console.error("Campaign creation failed:", error)
      // Failure notification
      alert("An error occurred. Please try again later.")
    } finally {
      setFormErrors({ ...formErrors, loading: false })
    }
  }

  const getFormProgress = () => {
    const requiredFields = [
      formData.title,
      formData.description,
      formData.goal,
      formData.duration,
      formData.category,
      formData.beneficiaries,
      formData.proofOfWork,
    ]

    const filledFields = requiredFields.filter(Boolean).length
    const hasValidMilestones = formData.milestones.every((milestone) => milestone.name && milestone.target)

    return Math.round(((filledFields + (hasValidMilestones ? 1 : 0)) / (requiredFields.length + 1)) * 100)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="max-w-full md:max-w-3xl lg:max-w-4xl mx-auto">
          <Link href="/" className="inline-flex items-center text-black hover:text-[#3498db] mb-6 transition-colors">
            <ArrowLeft className="mr-2" />
            Back to Home
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-6 sm:p-8 md:p-10 border-4 border-indigo-600 shadow-[8px_8px_0px_0px_rgba(79,70,229,1)] hover:shadow-[12px_12px_0px_0px_rgba(79,70,229,0.8)] transition-all duration-300"
          >
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-indigo-700">Create Your Campaign</h1>
            <div className="mb-8">
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-indigo-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${getFormProgress()}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-2 text-center">
                Fill in all required fields to create your campaign
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
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
                  className={`w-full border-2 ${formErrors.title ? "border-red-500" : "border-indigo-600"} focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-colors`}
                />
                {formErrors.title && <span className="text-red-500 text-xs">Title is required</span>}
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description (Supports Markdown)
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className={`w-full border-2 border-indigo-600 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-colors`}
                  rows={4}
                />

                <Dialog>
                  <DialogTrigger asChild>
                    <Button type="button" className="mt-2 bg-gray-200 hover:bg-gray-300 text-gray-800">
                      Markdown Guide
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Markdown Guide</DialogTitle>
                      <DialogDescription>
                        <ReactMarkdown remarkPlugins={[remarkGfm]} className="markdown">
                          {markdownGuide}
                        </ReactMarkdown>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>

                {formData.description && (
                  <div className="mt-2 p-3 border border-indigo-300 rounded-md bg-gray-50 shadow-sm">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} className="markdown">
                      {formData.description}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-1">
                  Funding Goal (EDU )
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
                  className={`w-full border-2 border-indigo-600 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-colors`}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter the total amount of EDU you want to raise for this campaign.
                </p>
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
                  className={`w-full border-2 border-indigo-600 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-colors`}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Set the duration (in days) for your campaign. The maximum is 365 days.
                </p>
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
                  className="w-full border-2 border-indigo-600 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-colors"
                >
                  <option value="">Select a category</option>
                  <option value="technology">Technology & Innovation</option>
                  <option value="health">Health & Wellness</option>
                  <option value="education">Education & Learning</option>
                  <option value="social">Social Impact & Causes</option>
                  <option value="art">Art & Culture</option>
                  <option value="film">Film & Entertainment</option>
                  <option value="music">Music & Audio</option>
                  <option value="gaming">Gaming</option>
                  <option value="science">Science & Research</option>
                  <option value="food">Food & Culinary</option>
                  <option value="sports">Sports & Fitness</option>
                  <option value="travel">Travel & Adventure</option>
                  <option value="other">Other</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Choose a category that best describes your campaign.</p>
              </div>
              {/* Dynamic Milestones */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    Milestones <span className="text-red-500">*</span>
                  </label>
                  <span className="text-sm text-gray-500">At least one milestone required</span>
                </div>

                <div className="space-y-4 p-4 bg-gray-50 border-2 border-indigo-600 rounded-md">
                  {formData.milestones.map((milestone, index) => (
                    <div key={index} className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <label className="text-xs text-gray-500 mb-1 block">Milestone {index + 1} Name</label>
                        <Input
                          type="text"
                          placeholder="e.g., Development Phase 1"
                          value={milestone.name}
                          onChange={(e) => handleMilestoneChange(index, "name", e.target.value)}
                          required
                          className={`border-2 border-indigo-600 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-colors`}
                        />
                        <p className="text-xxs text-gray-500 mt-1">
                          A brief name or description of this specific milestone.
                        </p>
                      </div>
                      <div className="flex-1">
                        <label className="text-xs text-gray-500 mb-1 block">Target Amount (EDU )</label>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={milestone.target}
                          onChange={(e) => handleMilestoneChange(index, "target", e.target.value)}
                          required
                          min="0"
                          step="0.01"
                          className={`border-2 border-indigo-600 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-colors`}
                        />
                        <p className="text-xxs text-gray-500 mt-1">
                          The amount of EDU needed to achieve this milestone. Total should equal your Funding Goal.
                        </p>
                      </div>
                      <Button
                        type="button"
                        onClick={() => removeMilestone(index)}
                        className="self-end bg-red-500 hover:bg-red-600 text-white disabled:opacity-50"
                        disabled={formData.milestones.length <= 1}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={addMilestone}
                    className="w-full mt-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    Add Another Milestone
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Break down your campaign into achievable milestones to make it more transparent to funders.
                </p>
              </div>
              {/* Beneficiaries */}
              <div>
                <label htmlFor="beneficiaries" className="block text-sm font-medium text-gray-700 mb-1">
                  Target Audience/Beneficiaries (Supports Markdown)
                </label>
                <Textarea
                  id="beneficiaries"
                  name="beneficiaries"
                  value={formData.beneficiaries}
                  onChange={handleChange}
                  required
                  className={`w-full border-2 border-indigo-600 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-colors`}
                  rows={3}
                />
                <Dialog>
                  <DialogTrigger asChild>
                    <Button type="button" className="mt-2 bg-gray-200 hover:bg-gray-300 text-gray-800">
                      Markdown Guide
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Markdown Guide</DialogTitle>
                      <DialogDescription>
                        <ReactMarkdown remarkPlugins={[remarkGfm]} className="markdown">
                          {markdownGuide}
                        </ReactMarkdown>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>

                {formData.beneficiaries && (
                  <div className="mt-2 p-3 border border-indigo-300 rounded-md bg-gray-50 shadow-sm">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} className="markdown">
                      {formData.beneficiaries}
                    </ReactMarkdown>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">Describe who will benefit from this campaign's success.</p>
              </div>
              {/* Proof of Work */}
              <div>
                <label htmlFor="proofOfWork" className="block text-sm font-medium text-gray-700 mb-1">
                  Proof of Work (URL or Description) (Supports Markdown)
                </label>
                <Textarea
                  id="proofOfWork"
                  name="proofOfWork"
                  value={formData.proofOfWork}
                  onChange={handleChange}
                  required
                  className={`w-full border-2 border-indigo-600 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-colors`}
                  rows={3}
                />

                <Dialog>
                  <DialogTrigger asChild>
                    <Button type="button" className="mt-2 bg-gray-200 hover:bg-gray-300 text-gray-800">
                      Markdown Guide
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Markdown Guide</DialogTitle>
                      <DialogDescription>
                        <ReactMarkdown remarkPlugins={[remarkGfm]} className="markdown">
                          {markdownGuide}
                        </ReactMarkdown>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>

                {formData.proofOfWork && (
                  <div className="mt-2 p-3 border border-indigo-300 rounded-md bg-gray-50 shadow-sm">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} className="markdown">
                      {formData.proofOfWork}
                    </ReactMarkdown>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Provide links, descriptions, or documents demonstrating your capacity to deliver on the project.
                  Supports Markdown.
                </p>
              </div>
              {/* Collateral */}
              <div>
                <label htmlFor="collateral" className="block text-sm font-medium text-gray-700 mb-1">
                  Collateral (if applicable)
                </label>
                <Input
                  type="text"
                  id="collateral"
                  name="collateral"
                  value={formData.collateral}
                  onChange={handleChange}
                  className={`w-full border-2 border-indigo-600 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-colors`}
                />
                <p className="text-xs text-gray-500 mt-1">
                  If applicable, specify any collateral being offered to funders.
                </p>
              </div>
              {/* Multimedia */}
              <div>
                <label htmlFor="multimedia" className="block text-sm font-medium text-gray-700 mb-1">
                  Multimedia Link (URL)
                </label>
                <Input
                  type="text"
                  id="multimedia"
                  name="multimedia"
                  value={formData.multimedia}
                  onChange={handleChange}
                  placeholder="Enter a URL for multimedia (e.g., YouTube, Vimeo, etc.)"
                  className={`w-full border-2 border-indigo-600 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-colors`}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Link to a video, presentation, or other media showcasing your project.
                </p>
              </div>
              {/* Submit Button */}
              <Button
                type="submit"
                className={`w-full ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-yellow-400"} hover:bg-yellow-500 text-black font-bold border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-1 active:translate-y-1 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Create Campaign"}
              </Button>
            </form>
          </motion.div>
        </div>
      </main>
      <footer className="text-center py-4 text-gray-600">
        <p>© {new Date().getFullYear()} GoalZilla. All rights reserved.</p>
      </footer>
    </div>
  )
}