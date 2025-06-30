"use client"

import { useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useSamplingStore } from "@/store/sampling-store"

const samplingSteps = [
  {
    id: 0,
    title: "Setup & Preparation",
    description: "Preparing equipment and workspace",
    duration: 8000,
    icon: "🔧",
  },
  {
    id: 1,
    title: "Equipment Calibration",
    description: "Calibrating instruments and sensors",
    duration: 6000,
    icon: "⚙️",
  },
  {
    id: 2,
    title: "Sample Collection",
    description: "Collecting environmental samples",
    duration: 10000,
    icon: "🧪",
  },
  {
    id: 3,
    title: "Analysis & Testing",
    description: "Running tests and measurements",
    duration: 8000,
    icon: "📊",
  },
  {
    id: 4,
    title: "Documentation",
    description: "Recording results and data",
    duration: 5000,
    icon: "📝",
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

  return (
    <div className="max-w-6xl mx-auto px-6">
      <div className="bg-black/40 backdrop-blur-md rounded-xl border border-white/10 p-6">
        <h2 className="text-white text-xl font-bold mb-4 text-center">Sampling Process Timeline</h2>

        {/* Progress Bar */}
        <div className="mb-6">
          <Progress value={(currentStep * 100 + timelineProgress) / samplingSteps.length} className="h-2 bg-white/20" />
        </div>

        {/* Timeline Steps */}
        <div className="flex justify-between items-center relative">
          {/* Connection Line */}
          <div className="absolute top-6 left-0 right-0 h-0.5 bg-white/20 z-0" />

          {samplingSteps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center relative z-10">
              {/* Step Circle */}
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all duration-500 ${
                  index === currentStep
                    ? "bg-emerald-500 scale-110 shadow-lg shadow-emerald-500/50"
                    : index < currentStep
                      ? "bg-emerald-600"
                      : "bg-white/20"
                }`}
              >
                {step.icon}
              </div>

              {/* Step Info */}
              <div className="mt-3 text-center max-w-32">
                <Badge
                  variant={index === currentStep ? "default" : index < currentStep ? "secondary" : "outline"}
                  className={`mb-2 ${index === currentStep ? "bg-emerald-500" : ""}`}
                >
                  Step {index + 1}
                </Badge>
                <h3 className="text-white text-sm font-semibold mb-1">{step.title}</h3>
                <p className="text-white/70 text-xs">{step.description}</p>

                {/* Current Step Progress */}
                {index === currentStep && (
                  <div className="mt-2">
                    <Progress value={timelineProgress} className="h-1 bg-white/20" />
                    <span className="text-white/60 text-xs mt-1 block">{Math.round(timelineProgress)}%</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Current Step Details */}
        <div className="mt-6 text-center">
          <div className="bg-emerald-500/20 rounded-lg p-4 border border-emerald-500/30">
            <h3 className="text-emerald-300 font-semibold text-lg mb-2">
              Currently: {samplingSteps[currentStep].title}
            </h3>
            <p className="text-white/80">{samplingSteps[currentStep].description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
