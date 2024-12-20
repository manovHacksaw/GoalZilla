import { Shield, Zap, Clock, Users } from 'lucide-react'

const features = [
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Growing Revenue",
    description: "Start with signing up for milestone-based funding"
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Best in Class Security",
    description: "Multi-sig wallets and quadratic voting"
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Community Power",
    description: "Decentralized decision making"
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: "Growth Potential",
    description: "Build reputation for future funding"
  }
]

export default function Features() {
  return (
    <section className="py-20 bg-[#34495e]">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 transition-transform"
            >
              <div className="w-16 h-16 bg-yellow-400 rounded-full border-4 border-black flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

