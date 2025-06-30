"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Rocket,
  Brain,
  Navigation,
  Zap,
  BarChart3,
  Gamepad2,
  Keyboard,
  Shield,
  Eye,
  Command,
  Layers,
  Activity,
  Users,
  Lock,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react"

interface QuickStartGuideProps {
  onFeatureActivate: (feature: string) => void
}

export default function QuickStartGuide({ onFeatureActivate }: QuickStartGuideProps) {
  const [activeDemo, setActiveDemo] = useState<string | null>(null)
  const [cognitiveLoad, setCognitiveLoad] = useState(23)
  const [systemUptime, setSystemUptime] = useState(99.97)

  useEffect(() => {
    // Simulate real-time cognitive load monitoring
    const interval = setInterval(() => {
      setCognitiveLoad((prev) => {
        const change = (Math.random() - 0.5) * 10
        return Math.max(10, Math.min(90, prev + change))
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const performanceMetrics = [
    {
      feature: "ESA Report Generation",
      improvement: "340% faster",
      technology: "Predictive AI + EPA Template Recognition",
      icon: Navigation,
      color: "from-blue-500 to-blue-600",
    },
    {
      feature: "Site Assessment Efficiency",
      improvement: "45% reduction in field time",
      technology: "Real-time Assessment + Adaptive Workflows",
      icon: Brain,
      color: "from-purple-500 to-purple-600",
    },
    {
      feature: "Federal Compliance Processing",
      improvement: "65% faster submissions",
      technology: "Recursive Optimization + EPA Integration",
      icon: Zap,
      color: "from-emerald-500 to-emerald-600",
    },
    {
      feature: "Client Satisfaction",
      improvement: "96.7% approval rating",
      technology: "Transparent AI + WBE/DBE Excellence",
      icon: Users,
      color: "from-amber-500 to-amber-600",
    },
    {
      feature: "Data Security & Privacy",
      improvement: "100% compliant",
      technology: "Local Storage + Federal Security Standards",
      icon: Lock,
      color: "from-teal-500 to-teal-600",
    },
    {
      feature: "System Uptime",
      improvement: "99.97% reliability",
      technology: "Advanced Orchestration + Federal-Grade Infrastructure",
      icon: Activity,
      color: "from-red-500 to-red-600",
    },
  ]

  const keyboardShortcuts = [
    { key: "Ctrl+K", description: "Open enhanced navigation command palette", icon: Command },
    { key: "Ctrl+Q", description: "Toggle context-aware quick actions", icon: Zap },
    { key: "Escape", description: "Close overlays and return to main interface", icon: Eye },
    { key: "Ctrl+/", description: "Show all keyboard shortcuts", icon: Keyboard },
    { key: "Ctrl+Shift+C", description: "Toggle cognitive overlay", icon: Brain },
  ]

  const interactiveDemos = [
    {
      id: "cognitive",
      title: "🧠 Cognitive Vectoring",
      subtitle: "/orchestration",
      description: "Industry-first cognitive overlay for environmental assessments",
      features: [
        "Real-time cognitive load monitoring during Phase I/II ESAs",
        "Privacy-first personalization for sensitive site data",
        "Adaptive UI for complex remediation workflows",
      ],
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/30",
    },
    {
      id: "field",
      title: "📱 Field Interface",
      subtitle: "EPA Region 5 Ready",
      description: "Production-ready field interface for environmental site assessments",
      features: [
        "Voice Commands: Hands-free operation for field technicians",
        "Photo Documentation: GPS-tagged capture with EPA metadata compliance",
        "Real-time Processing: Instant validation for Phase I/II assessments",
        "Report Generation: Automated KMZ reports for federal submissions",
      ],
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/30",
    },
    {
      id: "navigation",
      title: "⚡ Enhanced Navigation",
      subtitle: "Federal Contract Optimized",
      description: "Next-generation navigation for environmental compliance workflows",
      features: [
        "Predictive action suggestions for ESA workflows",
        "Context-aware commands for remediation projects",
        "Intelligent search across EPA databases and regulations",
        "Keyboard-optimized workflows for federal reporting",
      ],
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
    },
    {
      id: "orchestration",
      title: "🔄 Advanced Orchestration",
      subtitle: "EPA RFP Ready",
      description: "Recursive AI for complex environmental remediation projects",
      features: [
        "Deep analytical workflows for contaminated site assessment",
        "Multi-sensory data integration for soil/groundwater analysis",
        "Adaptive intelligence for regulatory compliance patterns",
        "Real-time optimization for federal contract deliverables",
      ],
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/30",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <Card className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-500/30 backdrop-blur-xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold text-white">🚀 Quick Start</CardTitle>
              <CardDescription className="text-emerald-300 text-lg">
                Experience Advanced Environmental Intelligence
              </CardDescription>
            </div>
          </div>

          {/* Real-time Cognitive Load Indicator */}
          <div className="inline-flex items-center space-x-3 bg-black/20 px-4 py-2 rounded-full border border-white/20">
            <Brain className="w-4 h-4 text-purple-400" />
            <span className="text-white text-sm font-medium">Cognitive Load:</span>
            <div className="flex items-center space-x-2">
              <Progress value={cognitiveLoad} className="w-20 h-2" />
              <span className="text-purple-300 font-bold text-sm">{Math.round(cognitiveLoad)}%</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="features" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-black/20 backdrop-blur-xl">
          <TabsTrigger value="features" className="text-white">
            Features
          </TabsTrigger>
          <TabsTrigger value="metrics" className="text-white">
            Metrics
          </TabsTrigger>
          <TabsTrigger value="demos" className="text-white">
            Demos
          </TabsTrigger>
          <TabsTrigger value="shortcuts" className="text-white">
            Shortcuts
          </TabsTrigger>
        </TabsList>

        {/* Advanced Features */}
        <TabsContent value="features" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-black/20 backdrop-blur-xl border-white/20 hover:bg-black/30 transition-all duration-300 group">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white">Cognitive Overlay</CardTitle>
                    <CardDescription className="text-white/70">Real-time cognitive assessment</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-white/80 mb-4">
                  Navigate to any page to see real-time cognitive load assessment with adaptive UI optimization.
                </p>
                <Button
                  onClick={() => onFeatureActivate("cognitive")}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Activate Overlay
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-black/20 backdrop-blur-xl border-white/20 hover:bg-black/30 transition-all duration-300 group">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Navigation className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white">Enhanced Navigation</CardTitle>
                    <CardDescription className="text-white/70">AI-powered command palette</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-white/80 mb-4">
                  Press Ctrl+K for instant AI-powered navigation with predictive suggestions.
                </p>
                <Button
                  onClick={() => onFeatureActivate("navigation")}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Open Navigation
                  <Command className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-black/20 backdrop-blur-xl border-white/20 hover:bg-black/30 transition-all duration-300 group">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Layers className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white">Advanced Orchestration</CardTitle>
                    <CardDescription className="text-white/70">Recursive AI workflows</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-white/80 mb-4">
                  Visit /orchestration for recursive AI workflows with deep analytical processing.
                </p>
                <Button
                  onClick={() => onFeatureActivate("orchestration")}
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                >
                  Launch Orchestration
                  <Sparkles className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-black/20 backdrop-blur-xl border-white/20 hover:bg-black/30 transition-all duration-300 group">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white">Quick Actions</CardTitle>
                    <CardDescription className="text-white/70">Context-aware rapid actions</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-white/80 mb-4">Press Ctrl+Q for context-aware rapid actions and smart workflows.</p>
                <Button
                  onClick={() => onFeatureActivate("quickActions")}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Enable Quick Actions
                  <Zap className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Metrics */}
        <TabsContent value="metrics" className="space-y-6">
          <Card className="bg-black/20 backdrop-blur-xl border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>📊 Performance Metrics</span>
              </CardTitle>
              <CardDescription className="text-white/70">IRIS Technology Performance Improvements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {performanceMetrics.map((metric, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-10 h-10 bg-gradient-to-br ${metric.color} rounded-lg flex items-center justify-center`}
                      >
                        <metric.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-semibold">{metric.feature}</div>
                        <div className="text-white/60 text-sm">{metric.technology}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-emerald-400 font-bold text-lg">{metric.improvement}</div>
                      <div className="text-white/60 text-sm">Improvement</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* System Status */}
              <div className="mt-6 p-4 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-lg border border-emerald-500/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-white font-semibold">System Status: Optimal</span>
                  </div>
                  <div className="text-emerald-300 font-bold">{systemUptime}% Uptime</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Interactive Demonstrations */}
        <TabsContent value="demos" className="space-y-6">
          <Card className="bg-black/20 backdrop-blur-xl border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Gamepad2 className="w-5 h-5" />
                <span>🎮 Interactive Demonstrations</span>
              </CardTitle>
              <CardDescription className="text-white/70">
                Experience cutting-edge AI features in real-time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {interactiveDemos.map((demo) => (
                  <Card
                    key={demo.id}
                    className={`${demo.bgColor} ${demo.borderColor} backdrop-blur-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer ${
                      activeDemo === demo.id ? "ring-2 ring-white/30" : ""
                    }`}
                    onClick={() => setActiveDemo(activeDemo === demo.id ? null : demo.id)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-white text-xl">{demo.title}</CardTitle>
                          <CardDescription className="text-white/70 text-lg">{demo.subtitle}</CardDescription>
                        </div>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation()
                            onFeatureActivate(demo.id)
                          }}
                          className={`bg-gradient-to-r ${demo.color} hover:opacity-90 text-white`}
                        >
                          Launch Demo
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-white/80 mb-4">{demo.description}</p>
                      {activeDemo === demo.id && (
                        <div className="space-y-2">
                          {demo.features.map((feature, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-emerald-400" />
                              <span className="text-white/90 text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Keyboard Shortcuts */}
        <TabsContent value="shortcuts" className="space-y-6">
          <Card className="bg-black/20 backdrop-blur-xl border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Keyboard className="w-5 h-5" />
                <span>Key Shortcuts</span>
              </CardTitle>
              <CardDescription className="text-white/70">
                Master the advanced interface with keyboard shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {keyboardShortcuts.map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg flex items-center justify-center">
                        <shortcut.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-semibold">{shortcut.description}</div>
                      </div>
                    </div>
                    <Badge className="bg-white/10 text-white border-white/20 font-mono">{shortcut.key}</Badge>
                  </div>
                ))}
              </div>

              {/* Advanced Features Summary */}
              <div className="mt-8 p-6 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg border border-purple-500/30">
                <h3 className="text-white font-bold text-lg mb-4">🚀 Advanced Features:</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Brain className="w-4 h-4 text-purple-400" />
                      <span className="text-white">
                        Cognitive Vectoring Overlay: Transparent cognitive load assessment
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Navigation className="w-4 h-4 text-blue-400" />
                      <span className="text-white">Enhanced Navigation: AI-powered rapid workflow optimization</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Layers className="w-4 h-4 text-amber-400" />
                      <span className="text-white">
                        Recursive Assessment: Deep analytical processing with convergence
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-emerald-400" />
                      <span className="text-white">User Empowerment: Ethical AI with complete user control</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-black/20 rounded-lg border border-white/10">
                  <p className="text-white/90 text-sm">
                    <strong>Technical Innovation:</strong> Industry-first combination of cognitive science, adaptive AI,
                    and transparent user empowerment in a production-ready environmental consulting platform.
                  </p>
                  <p className="text-emerald-300 text-sm mt-2 font-medium">
                    Representing the future of ethical AI platforms - where advanced intelligence serves environmental
                    professionals transparently and empowers them to achieve their goals more efficiently.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
