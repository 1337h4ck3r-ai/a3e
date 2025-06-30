"use client"

import { useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useSamplingStore } from "@/store/sampling-store"
import { CheckCircle, Clock, Play, Pause } from "lucide-react"

const samplingSteps = [
  {
    id: 0,
    title: "Setup & Preparation",
    description: "Preparing equipment and workspace",
    duration: 8000,
    icon: "🔧",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
  },
  {
    id: 1,
    title: "Equipment Calibration",
    description: "Calibrating instruments and sensors",
    duration: 6000,
    icon: "⚙️",
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
  },
  {
    id: 2,
    title: "Sample Collection",
    description: "Collecting environmental samples",
    duration: 10000,
    icon: "🧪",
    color: "from-emerald-500 to-emerald-600",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
  },
  {
    id: 3,
    title: "Analysis & Testing",
    description: "Running tests and measurements",
    duration: 8000,
    icon: "📊",
    color: "from-amber-500 to-amber-600",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
  },
  {
    id: 4,
    title: "Documentation",
    description: "Recording results and data",
    duration: 5000,
    icon: "📝",
    color: "from-teal-500 to-teal-600",
    bgColor: "bg-teal-500/10",
    borderColor: "border-teal-500/30",
  },
]

export default function SamplingTimeline() {
  const { currentStep, timelineProgress, setCurrentStep, setTimelineProgress } = useSamplingStore()

  useEffect(() => {
    const interval = setInterval(() => {
      const currentStepData = samplingSteps[currentStep]
      const increment = 100 / (currentStepData.duration / 100)

      setTimelineProgress((prev) => {
        const newProgress = prev + increment

        if (newProgress >= 100) {
          // Move to next step
          const nextStep = (currentStep + 1) % samplingSteps.length
          setCurrentStep(nextStep)
          return 0
        }

        return newProgress
      })
    }, 100)

    return () => clearInterval(interval)
  }, [currentStep, setCurrentStep, setTimelineProgress])

  const overallProgress = (currentStep * 100 + timelineProgress) / samplingSteps.length

  return (
    <div className="max-w-7xl mx-auto px-6">
      <Card className="bg-black/20 backdrop-blur-xl border-white/10 shadow-2xl">
        <CardContent className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 px-4 py-2 rounded-full border border-emerald-500/30 mb-4">
              <Play className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-300 font-medium text-sm">Live Process Monitoring</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Environmental Sampling Process</h2>
            <p className="text-white/70 text-lg">Real-time visualization of our advanced analysis workflow</p>
          </div>

          {/* Overall Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <span className="text-white font-semibold">Overall Progress</span>
              <span className="text-emerald-400 font-bold text-lg">{Math.round(overallProgress)}%</span>
            </div>
            <div className="relative">
              <Progress
                value={overallProgress}
                className="h-3 bg-white/10 border border-white/20 rounded-full overflow-hidden"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full"></div>
            </div>
          </div>

          {/* Timeline Steps */}
          <div className="relative">
            {/* Connection Line */}
            <div className="absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-white/20 via-white/40 to-white/20 z-0" />

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
              {samplingSteps.map((step, index) => {
                const isActive = index === currentStep
                const isCompleted = index < currentStep
                const isPending = index > currentStep

                return (
                  <div key={step.id} className="flex flex-col items-center relative">
                    {/* Step Circle */}
                    <div
                      className={`relative mb-4 transition-all duration-500 ${isActive ? "scale-110" : "scale-100"}`}
                    >
                      <div
                        className={`w-24 h-24 rounded-2xl flex items-center justify-center text-2xl transition-all duration-500 shadow-lg ${
                          isCompleted
                            ? "bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-emerald-500/25"
                            : isActive
                              ? `bg-gradient-to-br ${step.color} shadow-lg`
                              : "bg-white/10 border border-white/20"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-8 h-8 text-white" />
                        ) : isActive ? (
                          <div className="relative">
                            {step.icon}
                            <div className="absolute -inset-2 bg-white/20 rounded-full animate-ping"></div>
                          </div>
                        ) : (
                          <div className="text-white/50">{step.icon}</div>
                        )}
                      </div>

                      {/* Active Step Glow */}
                      {isActive && (
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${step.color} rounded-2xl opacity-30 animate-pulse -z-10`}
                        ></div>
                      )}
                    </div>

                    {/* Step Info Card */}
                    <Card
                      className={`w-full transition-all duration-500 ${
                        isActive
                          ? `${step.bgColor} ${step.borderColor} shadow-lg scale-105`
                          : isCompleted
                            ? "bg-emerald-500/5 border-emerald-500/20"
                            : "bg-white/5 border-white/10"
                      }`}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="flex items-center justify-center mb-2">
                          <Badge
                            variant={isCompleted ? "default" : isActive ? "secondary" : "outline"}
                            className={`text-xs ${
                              isCompleted
                                ? "bg-emerald-500 text-white"
                                : isActive
                                  ? `bg-gradient-to-r ${step.color} text-white`
                                  : "border-white/20 text-white/60"
                            }`}
                          >
                            {isCompleted ? "Complete" : isActive ? "Active" : "Pending"}
                          </Badge>
                        </div>

                        <h3
                          className={`font-bold mb-2 transition-colors ${
                            isActive ? "text-white" : isCompleted ? "text-emerald-300" : "text-white/70"
                          }`}
                        >
                          {step.title}
                        </h3>

                        <p
                          className={`text-sm transition-colors ${
                            isActive ? "text-white/90" : isCompleted ? "text-emerald-200/80" : "text-white/50"
                          }`}
                        >
                          {step.description}
                        </p>

                        {/* Current Step Progress */}
                        {isActive && (
                          <div className="mt-3 space-y-2">
                            <Progress value={timelineProgress} className="h-2 bg-white/20" />
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-white/60">Progress</span>
                              <span className="text-white font-semibold">{Math.round(timelineProgress)}%</span>
                            </div>
                          </div>
                        )}

                        {/* Status Icon */}
                        <div className="mt-3 flex justify-center">
                          {isCompleted ? (
                            <CheckCircle className="w-5 h-5 text-emerald-400" />
                          ) : isActive ? (
                            <Clock className="w-5 h-5 text-white animate-spin" />
                          ) : (
                            <Pause className="w-5 h-5 text-white/40" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Current Step Highlight */}
          <div className="mt-8 text-center">
            <Card
              className={`inline-block ${samplingSteps[currentStep].bgColor} ${samplingSteps[currentStep].borderColor} shadow-lg`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-center space-x-3">
                  <div
                    className={`w-3 h-3 rounded-full bg-gradient-to-r ${samplingSteps[currentStep].color} animate-pulse`}
                  ></div>
                  <h3 className="text-white font-bold text-xl">Currently: {samplingSteps[currentStep].title}</h3>
                  <div
                    className={`w-3 h-3 rounded-full bg-gradient-to-r ${samplingSteps[currentStep].color} animate-pulse`}
                  ></div>
                </div>
                <p className="text-white/80 mt-2">{samplingSteps[currentStep].description}</p>
                <div className="mt-4 flex items-center justify-center space-x-4 text-sm text-white/60">
                  <span>
                    Step {currentStep + 1} of {samplingSteps.length}
                  </span>
                  <span>•</span>
                  <span>ETA: {Math.round((100 - timelineProgress) / 10)} seconds</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
