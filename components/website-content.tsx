"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Shield, Users, ChevronDown, Command, Brain } from "lucide-react"
import QuickStartGuide from "./quick-start-guide"
import EnhancedNavigation from "./enhanced-navigation"
import CognitiveOverlay from "./cognitive-overlay"

export default function WebsiteContent() {
  const [showQuickStart, setShowQuickStart] = useState(false)
  const [showNavigation, setShowNavigation] = useState(false)
  const [showCognitiveOverlay, setShowCognitiveOverlay] = useState(false)

  // Keyboard shortcuts
  useState(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "k") {
        e.preventDefault()
        setShowNavigation(true)
      }
      if (e.ctrlKey && e.key === "q") {
        e.preventDefault()
        // Quick actions would be implemented here
        console.log("Quick actions activated")
      }
      if (e.ctrlKey && e.shiftKey && e.key === "C") {
        e.preventDefault()
        setShowCognitiveOverlay(!showCognitiveOverlay)
      }
      if (e.key === "Escape") {
        setShowNavigation(false)
        setShowQuickStart(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  })

  const handleFeatureActivate = (feature: string) => {
    switch (feature) {
      case "cognitive":
        setShowCognitiveOverlay(true)
        break
      case "navigation":
        setShowNavigation(true)
        break
      case "orchestration":
        // Navigate to orchestration page
        console.log("Navigating to /orchestration")
        break
      case "quickActions":
        // Activate quick actions
        console.log("Quick actions activated")
        break
      default:
        console.log(`Feature ${feature} activated`)
    }
  }

  const handleNavigate = (path: string) => {
    console.log(`Navigating to ${path}`)
    // Implement actual navigation logic here
  }

  return (
    <div className="relative w-full h-screen">
      {/* Enhanced Header */}
      <header className="absolute top-0 left-0 right-0 z-20 backdrop-blur-xl bg-black/20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-black text-xl">A3E</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
              </div>
              <div className="text-white">
                <div className="text-xl font-bold tracking-tight">A3E Environmental</div>
                <div className="text-xs font-medium text-emerald-300 tracking-wider">ADVANCED CONSULTING SOLUTIONS</div>
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <a href="#services" className="text-white/80 hover:text-white transition-colors font-medium">
                Services
              </a>
              <a href="#technology" className="text-white/80 hover:text-white transition-colors font-medium">
                Technology
              </a>
              <a href="#about" className="text-white/80 hover:text-white transition-colors font-medium">
                About
              </a>
              <a href="#contact" className="text-white/80 hover:text-white transition-colors font-medium">
                Contact
              </a>
            </nav>

            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                onClick={() => setShowNavigation(true)}
                className="text-white hover:bg-white/10 border border-white/20 backdrop-blur-sm"
              >
                <Command className="w-4 h-4 mr-2" />
                Navigate (Ctrl+K)
              </Button>
              <Button
                onClick={() => setShowQuickStart(true)}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg"
              >
                🚀 Quick Start
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="max-w-6xl mx-auto px-6 text-center">
          {/* Value Proposition Badge */}
          <div className="mb-8">
            <Badge className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/30 px-4 py-2 text-sm font-medium backdrop-blur-sm">
              <Shield className="w-4 h-4 mr-2" />
              WBE/DBE Certified • EPA Region 5 Ready • Federal Contract Capable
            </Badge>
          </div>

          {/* Main Headline */}
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-emerald-100 to-teal-200 bg-clip-text text-transparent">
                A3E
              </span>
              <br />
              <span className="text-white">Environmental</span>
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Consultants
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed font-light">
              Woman-owned environmental consulting firm delivering{" "}
              <span className="text-emerald-300 font-semibold">EPA-compliant solutions</span>,{" "}
              <span className="text-blue-300 font-semibold">federal contract expertise</span>, and{" "}
              <span className="text-teal-300 font-semibold">turnkey environmental projects</span>
            </p>
          </div>

          {/* Advanced Features Preview */}
          <div className="grid md:grid-cols-4 gap-4 mb-12 max-w-5xl mx-auto">
            <Card
              className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300 group cursor-pointer"
              onClick={() => setShowCognitiveOverlay(true)}
            >
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-white font-semibold text-sm mb-1">Cognitive Overlay</h3>
                <p className="text-white/70 text-xs">Real-time load assessment</p>
              </CardContent>
            </Card>

            <Card
              className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300 group cursor-pointer"
              onClick={() => setShowNavigation(true)}
            >
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Command className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-white font-semibold text-sm mb-1">Enhanced Navigation</h3>
                <p className="text-white/70 text-xs">AI-powered command palette</p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300 group">
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-white font-semibold text-sm mb-1">EPA Compliant</h3>
                <p className="text-white/70 text-xs">Certified processes</p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300 group">
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-white font-semibold text-sm mb-1">Trusted Partner</h3>
                <p className="text-white/70 text-xs">500+ successful projects</p>
              </CardContent>
            </Card>
          </div>

          {/* Call to Action */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={() => setShowQuickStart(true)}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 group"
            >
              🚀 Experience Quick Start
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setShowNavigation(true)}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm px-8 py-4 text-lg font-semibold"
            >
              <Command className="w-5 h-5 mr-2" />
              Try Navigation (Ctrl+K)
            </Button>
          </div>

          {/* Keyboard Shortcuts Hint */}
          <div className="mt-8 p-4 bg-black/20 backdrop-blur-sm rounded-lg border border-white/10 max-w-2xl mx-auto">
            <p className="text-white/70 text-sm mb-2">⌨️ Keyboard Shortcuts:</p>
            <div className="flex flex-wrap justify-center gap-4 text-xs">
              <Badge className="bg-white/10 text-white border-white/20">Ctrl+K - Navigation</Badge>
              <Badge className="bg-white/10 text-white border-white/20">Ctrl+Q - Quick Actions</Badge>
              <Badge className="bg-white/10 text-white border-white/20">Ctrl+Shift+C - Cognitive Overlay</Badge>
              <Badge className="bg-white/10 text-white border-white/20">Esc - Close</Badge>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 pt-8 border-t border-white/10">
            <p className="text-white/60 text-sm mb-4 font-medium">Certified & Trusted by Federal Agencies</p>
            <div className="flex justify-center items-center space-x-8 opacity-60">
              <div className="text-white font-bold text-lg">EPA Region 5</div>
              <div className="text-white font-bold text-lg">WBE/DBE</div>
              <div className="text-white font-bold text-lg">USACE</div>
              <div className="text-white font-bold text-lg">ISO 14001</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Status Indicators */}
      <div className="absolute bottom-6 left-6 z-20 space-y-3">
        <Card className="bg-black/40 backdrop-blur-xl border-emerald-500/30 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-3 h-3 bg-emerald-400 rounded-full animate-ping opacity-75"></div>
              </div>
              <div>
                <div className="text-white font-semibold text-sm">EPA Region 5 Ready</div>
                <div className="text-emerald-300 text-xs">Federal contract platform deployed</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-xl border-blue-500/30 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-3 h-3 bg-blue-400 rounded-full animate-ping opacity-75"></div>
              </div>
              <div>
                <div className="text-white font-semibold text-sm">WBE/DBE Certified</div>
                <div className="text-blue-300 text-xs">Woman-owned small business</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-xl border-purple-500/30 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-3 h-3 bg-purple-400 rounded-full animate-ping opacity-75"></div>
              </div>
              <div>
                <div className="text-white font-semibold text-sm">RFP 68HE0525R0028</div>
                <div className="text-purple-300 text-xs">Due July 14, 2025 - Platform ready</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex flex-col items-center space-y-2 animate-bounce">
          <div className="text-white/60 text-xs font-medium">Explore Advanced Features</div>
          <ChevronDown className="w-5 h-5 text-white/60" />
        </div>
      </div>

      {/* Enhanced Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/50 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />

      {/* Quick Start Guide Modal */}
      {showQuickStart && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 overflow-y-auto">
          <div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <Card className="bg-black/90 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardContent className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">🚀 Advanced Environmental Intelligence Platform</h2>
                  <Button
                    variant="ghost"
                    onClick={() => setShowQuickStart(false)}
                    className="text-white hover:bg-white/10"
                  >
                    ✕
                  </Button>
                </div>
                <QuickStartGuide onFeatureActivate={handleFeatureActivate} />
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Enhanced Navigation */}
      <EnhancedNavigation
        isOpen={showNavigation}
        onClose={() => setShowNavigation(false)}
        onNavigate={handleNavigate}
      />

      {/* Cognitive Overlay */}
      <CognitiveOverlay
        isActive={showCognitiveOverlay}
        onToggle={() => setShowCognitiveOverlay(!showCognitiveOverlay)}
      />
    </div>
  )
}
