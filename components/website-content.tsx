"use client"

import { Button } from "@/components/ui/button"

export default function WebsiteContent() {
  return (
    <div className="relative w-full h-screen">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-6">
        <div className="flex items-center space-x-2">
          <div className="text-white font-bold text-2xl">
            <div className="text-3xl font-black">A3E</div>
            <div className="text-xs font-light tracking-wider">
              ENVIRONMENTAL
              <br />
              CONSULTANTS
            </div>
          </div>
        </div>

        <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm">
          LOGIN
        </Button>
      </header>

      {/* Main Content */}
      <div className="absolute bottom-32 left-0 right-0 z-10">
        <div className="text-center max-w-4xl mx-auto px-6">
          <div className="bg-black/30 backdrop-blur-md px-8 py-6 rounded-xl border border-white/10">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Advanced Lab Analysis</h1>
            <p className="text-white/90 text-lg md:text-xl mb-6 max-w-2xl mx-auto">
              Watch our certified technicians perform comprehensive environmental sampling with precision and expertise
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                View Services
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                Contact Lab
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Lab Status */}
      <div className="absolute bottom-6 left-6 z-20">
        <div className="bg-black/40 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10">
          <div className="flex items-center space-x-2 text-white text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Lab Equipment Online</span>
          </div>
        </div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />
    </div>
  )
}
