"use client"

import { Suspense, useState, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera } from "@react-three/drei"
import AnimatedBackground from "@/components/animated-background"
import LoadingFallback from "@/components/loading-fallback"
import PerformanceMonitor from "@/components/performance-monitor"
import FieldSamplingScene from "@/components/field-sampling-scene"
import LabSamplingScene from "@/components/lab-sampling-scene"
import SamplingTimeline from "@/components/sampling-timeline"
import SampleResultsCharts from "@/components/sample-results-charts"
import ExportControls from "@/components/export-controls"
import CognitiveOverlay from "@/components/cognitive-overlay"
import QuickStartGuide from "@/components/quick-start-guide"
import FederalContractTracker from "@/components/federal-contract-tracker"
import WebsiteContent from "@/components/website-content"
import EnhancedNavigation from "@/components/enhanced-navigation"
import FederalReportingTemplates from "@/components/federal-reporting-templates"
import { useSamplingStore } from "@/store/sampling-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Play,
  Pause,
  RotateCcw,
  Settings,
  Zap,
  Beaker,
  FileText,
  BarChart3,
  Shield,
  Globe,
  Smartphone,
} from "lucide-react"

export default function Home() {
  const { currentStep, isPlaying, setIsPlaying, resetSimulation, sampleData } = useSamplingStore()

  const [activeView, setActiveView] = useState<"field" | "lab" | "analysis" | "website">("field")
  const [showControls, setShowControls] = useState(true)
  const [performanceMode, setPerformanceMode] = useState<"high" | "balanced" | "performance">("balanced")
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Auto-adjust performance based on device
  useEffect(() => {
    if (isMobile) {
      setPerformanceMode("performance")
    }
  }, [isMobile])

  const getSceneComponent = () => {
    switch (activeView) {
      case "field":
        return <FieldSamplingScene />
      case "lab":
        return <LabSamplingScene />
      case "analysis":
        return <SampleResultsCharts sampleData={sampleData} />
      case "website":
        return <WebsiteContent />
      default:
        return <FieldSamplingScene />
    }
  }

  const getPerformanceSettings = () => {
    switch (performanceMode) {
      case "high":
        return {
          antialias: true,
          shadows: true,
          pixelRatio: Math.min(window.devicePixelRatio, 2),
          powerPreference: "high-performance" as const,
        }
      case "balanced":
        return {
          antialias: true,
          shadows: isMobile ? false : true,
          pixelRatio: Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2),
          powerPreference: "default" as const,
        }
      case "performance":
        return {
          antialias: false,
          shadows: false,
          pixelRatio: 1,
          powerPreference: "low-power" as const,
        }
    }
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-800">
      {/* Enhanced Navigation */}
      <EnhancedNavigation activeView={activeView} onViewChange={setActiveView} isMobile={isMobile} />

      {/* Main 3D Canvas with Enhanced Background */}
      <Canvas
        className="absolute inset-0"
        gl={{
          antialias: getPerformanceSettings().antialias,
          preserveDrawingBuffer: true,
          alpha: true,
          powerPreference: getPerformanceSettings().powerPreference,
        }}
        dpr={getPerformanceSettings().pixelRatio}
        shadows={getPerformanceSettings().shadows}
        camera={{ position: [0, 0, 10], fov: 75 }}
        onCreated={({ gl }) => {
          gl.setClearColor("#0a0f0a", 0.1)
        }}
      >
        <Suspense fallback={null}>
          {/* Enhanced Animated Background with A3E Logo */}
          <AnimatedBackground />

          {/* Scene Content */}
          {getSceneComponent()}

          {/* Camera Controls - Optimized for mobile */}
          <OrbitControls
            enablePan={!isMobile}
            enableZoom={true}
            enableRotate={true}
            autoRotate={activeView === "website"}
            autoRotateSpeed={0.5}
            maxDistance={20}
            minDistance={5}
            maxPolarAngle={Math.PI / 1.8}
            minPolarAngle={Math.PI / 6}
            dampingFactor={0.05}
            enableDamping={true}
          />

          {/* Performance Camera */}
          <PerspectiveCamera makeDefault position={[0, 5, 15]} fov={isMobile ? 85 : 75} />
        </Suspense>
      </Canvas>

      {/* Performance Monitor */}
      <PerformanceMonitor />

      {/* Loading Fallback */}
      <Suspense fallback={<LoadingFallback />}>
        {/* Cognitive Overlay */}
        <CognitiveOverlay />

        {/* Control Panel */}
        {showControls && (
          <div className="absolute top-20 left-4 z-20">
            <Card className="bg-black/20 backdrop-blur-xl border-white/20 text-white min-w-80">
              <CardContent className="p-4 space-y-4">
                {/* View Controls */}
                <div className="space-y-3">
                  <h3 className="text-white font-semibold flex items-center space-x-2">
                    <Zap className="w-4 h-4" />
                    <span>A3E Environmental Interface</span>
                  </h3>

                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: "field", label: "Field Sampling", icon: Beaker },
                      { key: "lab", label: "Laboratory", icon: FileText },
                      { key: "analysis", label: "Data Analysis", icon: BarChart3 },
                      { key: "website", label: "Company Site", icon: Globe },
                    ].map(({ key, label, icon: Icon }) => (
                      <Button
                        key={key}
                        size="sm"
                        variant={activeView === key ? "default" : "outline"}
                        onClick={() => setActiveView(key as any)}
                        className={`${
                          activeView === key
                            ? "bg-emerald-600 hover:bg-emerald-700"
                            : "border-white/20 text-white hover:bg-white/10"
                        } transition-all duration-300`}
                      >
                        <Icon className="w-3 h-3 mr-1" />
                        {isMobile ? "" : label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Simulation Controls */}
                <div className="space-y-3">
                  <h4 className="text-white/80 font-medium text-sm">Simulation Controls</h4>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="bg-blue-600 hover:bg-blue-700 flex-1"
                    >
                      {isPlaying ? <Pause className="w-3 h-3 mr-1" /> : <Play className="w-3 h-3 mr-1" />}
                      {isPlaying ? "Pause" : "Play"}
                    </Button>
                    <Button
                      size="sm"
                      onClick={resetSimulation}
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {/* Performance Mode */}
                <div className="space-y-2">
                  <h4 className="text-white/80 font-medium text-sm">Performance Mode</h4>
                  <div className="flex space-x-1">
                    {[
                      { key: "performance", label: "Fast", color: "bg-green-600" },
                      { key: "balanced", label: "Balanced", color: "bg-yellow-600" },
                      { key: "high", label: "Quality", color: "bg-red-600" },
                    ].map(({ key, label, color }) => (
                      <Button
                        key={key}
                        size="sm"
                        variant={performanceMode === key ? "default" : "outline"}
                        onClick={() => setPerformanceMode(key as any)}
                        className={`${
                          performanceMode === key ? color : "border-white/20 text-white hover:bg-white/10"
                        } flex-1 text-xs`}
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Status Indicators */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/60">Current Step:</span>
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                      {currentStep + 1}/5
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/60">Device:</span>
                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                      {isMobile ? <Smartphone className="w-3 h-3" /> : "Desktop"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Start Guide */}
        <QuickStartGuide />

        {/* Federal Contract Tracker */}
        <FederalContractTracker />

        {/* Sampling Timeline */}
        {activeView === "field" && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 w-full max-w-7xl px-4">
            <SamplingTimeline />
          </div>
        )}

        {/* Export Controls */}
        {(activeView === "lab" || activeView === "analysis") && (
          <ExportControls sampleData={sampleData} currentStep={currentStep} />
        )}

        {/* Federal Reporting Templates */}
        {activeView === "analysis" && (
          <div className="absolute top-20 right-4 z-20 max-w-md">
            <FederalReportingTemplates sampleData={sampleData} />
          </div>
        )}

        {/* Mobile-Optimized Controls Toggle */}
        {isMobile && (
          <Button
            onClick={() => setShowControls(!showControls)}
            className="absolute top-4 left-4 z-30 bg-black/40 backdrop-blur-xl border-white/20 text-white"
            size="sm"
          >
            <Settings className="w-4 h-4" />
          </Button>
        )}

        {/* EPA Compliance Badge */}
        <div className="absolute top-4 right-4 z-20">
          <Card className="bg-black/20 backdrop-blur-xl border-white/20">
            <CardContent className="p-3">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <div className="text-xs">
                  <div className="text-emerald-300 font-medium">EPA Compliant</div>
                  <div className="text-white/60">Region 5 Certified</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Status */}
        <div className="absolute bottom-4 right-4 z-20">
          <div className="bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full border border-emerald-500/30">
            <div className="flex items-center space-x-2 text-xs">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-emerald-300 font-medium">A3E IRIS AI: Active</span>
            </div>
          </div>
        </div>
      </Suspense>
    </div>
  )
}
