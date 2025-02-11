'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import { useGoalZilla } from '@/context/GoalZillaContext'
import Link from 'next/link'
import Navbar from '@/components/navbar'
import ReactMarkdown from 'react-markdown' // Import ReactMarkdown
import remarkGfm from 'remark-gfm'       // Import remarkGfm

interface CampaignDetails {
  title: string
  description: string
  proofOfWork: string
  beneficiaries: string
  media: string[]
}

export default function CampaignDetailPage() {
  const [campaignDetails, setCampaignDetails] = useState<CampaignDetails | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const params = useParams()
  const campaignId = params?.id as string;

  const router = useRouter()
  const { getCampaignById } = useGoalZilla()

  useEffect(() => {
    if (!campaignId) return

    const fetchDetails = async () => {
      try {
        setLoading(true)
        const details = await getCampaignById(campaignId)
        if (!details) {
          throw new Error('Campaign not found')
        }
        setCampaignDetails(details)
      } catch (error: any) {
        setError(error.message || 'Failed to fetch campaign details')
        console.error('Error fetching campaign details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDetails()
  }, [campaignId, getCampaignById])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-green-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-100">
        <div className="bg-white p-8 rounded shadow-lg border-2 border-red-600">
          <p className="text-red-600 font-bold">{error}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 bg-red-700 text-white px-6 py-2 rounded-lg hover:bg-red-800 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  if (!campaignDetails) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-700 font-bold">Campaign not found</p>
        <button
          onClick={() => router.back()}
          className="mt-4 bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-900 transition-colors"
        >
          Go Back
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto mt-8 px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white border-4 border-gray-800 p-8 rounded-xl shadow-2xl max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold text-center mb-8 border-b-4 border-yellow-500 pb-4 text-gray-900">
            {campaignDetails?.title}
          </h1>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="bg-yellow-300 px-4 py-1 rounded-full shadow-md text-yellow-800 font-medium">Description</span>
              </h2>
              <div className="text-gray-700 leading-relaxed prose">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {campaignDetails?.description}
                </ReactMarkdown>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="bg-yellow-300 px-4 py-1 rounded-full shadow-md text-yellow-800 font-medium">Proof of Work</span>
              </h2>
              <div className="text-gray-700 leading-relaxed prose">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {campaignDetails?.proofOfWork}
                </ReactMarkdown>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="bg-yellow-300 px-4 py-1 rounded-full shadow-md text-yellow-800 font-medium">Beneficiaries</span>
              </h2>
              <div className="text-gray-700 leading-relaxed prose">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {campaignDetails?.beneficiaries}
                </ReactMarkdown>
              </div>
            </section>

            {campaignDetails?.media && campaignDetails.media.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="bg-yellow-300 px-4 py-1 rounded-full shadow-md text-yellow-800 font-medium">Media</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {campaignDetails.media.map((mediaLink, index) => (
                    <div
                      key={index}
                      className="relative border-2 border-gray-700 rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105"
                    >
                      <img
                        src={mediaLink}
                        alt={`Campaign media ${index + 1}`}
                        className="w-full h-64 object-cover transition-opacity duration-300 ease-in-out opacity-90 hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-black opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <div className="flex justify-center mt-12">
              <Link href={`/fund-campaign/${campaignId}`}>
                <button
                  className="bg-yellow-400 px-8 py-3 rounded-full border-2 text-gray-900 border-gray-800 hover:bg-yellow-300 hover:-translate-y-1 transition-colors text-lg font-bold flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-1"
                >
                  I want to fund this campaign <span role="img" aria-label="money">💶</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}