export default function Stats() {
  return (
    <section className="py-20 bg-yellow-400 border-y-4 border-black">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-4xl font-bold mb-2">$10M+</div>
            <div className="text-xl">Total Funds Raised</div>
          </div>
          <div className="bg-white p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-4xl font-bold mb-2">1,000+</div>
            <div className="text-xl">Successful Projects</div>
          </div>
          <div className="bg-white p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-4xl font-bold mb-2">50K+</div>
            <div className="text-xl">Community Members</div>
          </div>
        </div>
      </div>
    </section>
  )
}

