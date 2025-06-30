"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Brain, Activity, Zap, AlertTriangle, CheckCircle, X } from "lucide-react"

interface CognitiveOverlayProps {
  isActive: boolean
  onToggle: () => void
}

interface CognitiveMetrics {
  overallLoad: number
  visualComplexity: number
  informationDensity: number
  taskComplexity: number
  attentionFocus: number
  recommendations: string[]
}

export default function CognitiveOverlay({ isActive, onToggle }: CognitiveOverlayProps) {
  const [metrics, setMetrics] = useState<CognitiveMetrics>({
    overallLoad: 23,
    visualComplexity: 35,
    informationDensity: 42,
    taskComplexity: 18,
    attentionFocus: 78,
    recommendations: [
      "Consider reducing information density in the current view",
      "Visual complexity is optimal for current task",
      "Attention focus is excellent - maintain current layout",
    ],
  })

  const [isExpanded, setIsExpanded] = useState(false)
  const [adaptiveMode, setAdaptiveMode] = useState(true)

  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      setMetrics((prev) => ({
        overallLoad: Math.max(10, Math.min(90, prev.overallLoad + (Math.random() - 0.5) * 8)),
        visualComplexity: Math.max(15, Math.min(85, prev.visualComplexity + (Math.random() - 0.5) * 6)),
        informationDensity: Math.max(20, Math.min(80, prev.informationDensity + (Math.random() - 0.5) * 10)),
        taskComplexity: Math.max(10, Math.min(70, prev.taskComplexity + (Math.random() - 0.5) * 5)),
        attentionFocus: Math.max(40, Math.min(95, prev.attentionFocus + (Math.random() - 0.5) * 4)),
        recommendations: generateRecommendations(prev),
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [isActive])

  const generateRecommendations = (currentMetrics: CognitiveMetrics): string[] => {
    const recommendations = []

    if (currentMetrics.overallLoad > 60) {
      recommendations.push("🧠 High cognitive load detected - consider simplifying the interface")
    }

    if (currentMetrics.visualComplexity > 70) {
      recommendations.push("👁️ Visual complexity is high - reducing elements may improve focus")
    }

    if (currentMetrics.informationDensity > 65) {
      recommendations.push("📊 Information density is elevated - consider progressive disclosure")
    }

    if (currentMetrics.attentionFocus < 50) {
      recommendations.push("🎯 Attention focus is low - highlighting key elements may help")
    }

    if (recommendations.length === 0) {
      recommendations.push("✅ Cognitive load is optimal for current task")
      recommendations.push("🚀 Interface is well-balanced for efficient workflow")
    }

    return recommendations
  }

  const getCognitiveStatus = () => {
    if (metrics.overallLoad < 30) return { status: "Optimal", color: "text-emerald-400", icon: CheckCircle }
    if (metrics.overallLoad < 60) return { status: "Moderate", color: "text-yellow-400", icon: Activity }
    return { status: "High", color: "text-red-400", icon: AlertTriangle }
  }

  const cognitiveStatus = getCognitiveStatus()

  if (!isActive) return null

  return (
    <>
      {/* Floating Cognitive Indicator */}
      <div className="fixed top-20 right-6 z-40">
        <Card
          className={`bg-black/80 backdrop-blur-xl border-purple-500/30 shadow-lg cursor-pointer transition-all duration-300 ${
            isExpanded ? "w-80" : "w-16"
          }`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <CardContent className="p-3">
            {!isExpanded ? (
              <div className="flex items-center justify-center">
                <div className="relative">
                  <Brain className="w-8 h-8 text-purple-400" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{Math.round(metrics.overallLoad)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Brain className="w-5 h-5 text-purple-400" />
                    <span className="text-white font-semibold text-sm">Cognitive Overlay</span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation()
                      onToggle()
                    }}
                    className="text-white/60 hover:text-white p-1"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Overall Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <cognitiveStatus.icon className={`w-4 h-4 ${cognitiveStatus.color}`} />
                    <span className="text-white text-sm">Status: {cognitiveStatus.status}</span>
                  </div>
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                    {Math.round(metrics.overallLoad)}%
                  </Badge>
                </div>

                {/* Metrics */}
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-white/70">Visual Complexity</span>
                      <span className="text-white">{Math.round(metrics.visualComplexity)}%</span>
                    </div>
                    <Progress value={metrics.visualComplexity} className="h-1.5" />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-white/70">Information Density</span>
                      <span className="text-white">{Math.round(metrics.informationDensity)}%</span>
                    </div>
                    <Progress value={metrics.informationDensity} className="h-1.5" />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-white/70">Attention Focus</span>
                      <span className="text-emerald-400">{Math.round(metrics.attentionFocus)}%</span>
                    </div>
                    <Progress value={metrics.attentionFocus} className="h-1.5" />
                  </div>
                </div>

                {/* Adaptive Mode Toggle */}
                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <span className="text-white/70 text-xs">Adaptive Mode</span>
                  <Button
                    size="sm"
                    variant={adaptiveMode ? "default" : "outline"}
                    onClick={(e) => {
                      e.stopPropagation()
                      setAdaptiveMode(!adaptiveMode)
                    }}
                    className="h-6 px-2 text-xs"
                  >
                    {adaptiveMode ? "ON" : "OFF"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Recommendations Panel */}
      {isExpanded && (
        <div className="fixed top-20 right-96 z-40">
          <Card className="bg-black/80 backdrop-blur-xl border-purple-500/30 shadow-lg w-72">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-4">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-white font-semibold text-sm">AI Recommendations</span>
              </div>

              <div className="space-y-3">
                {metrics.recommendations.map((recommendation, index) => (
                  <div key={index} className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-white/90 text-xs">{recommendation}</p>
                  </div>
                ))}
              </div>

              {adaptiveMode && (
                <div className="mt-4 p-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg border border-purple-500/30">
                  <div className="flex items-center space-x-2 mb-2">
                    <Activity className="w-3 h-3 text-purple-400" />
                    <span className="text-purple-300 text-xs font-medium">Adaptive Adjustments</span>
                  </div>
                  <p className="text-white/80 text-xs">
                    Interface automatically optimizing based on cognitive load patterns
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Visual Overlay Indicators */}
      {isExpanded && (
        <div className="fixed inset-0 pointer-events-none z-30">
          {/* High complexity areas */}
          {metrics.visualComplexity > 60 && (
            <div className="absolute top-32 left-6 w-4 h-4 bg-yellow-400/30 border-2 border-yellow-400 rounded-full animate-pulse"></div>
          )}

          {/* Information density hotspots */}
          {metrics.informationDensity > 65 && (
            <div className="absolute bottom-32 right-96 w-4 h-4 bg-red-400/30 border-2 border-red-400 rounded-full animate-pulse"></div>
          )}

          {/* Attention focus areas */}
          {metrics.attentionFocus > 70 && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-emerald-400/20 border-2 border-emerald-400 rounded-full animate-pulse"></div>
          )}
        </div>
      )}
    </>
  )
}
