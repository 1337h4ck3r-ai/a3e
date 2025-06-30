"use client"

import { Canvas } from "@react-three/fiber"
import { Suspense } from "react"
import LabSamplingScene from "@/components/lab-sampling-scene"
import WebsiteContent from "@/components/website-content"
import SamplingTimeline from "@/components/sampling-timeline"
import LoadingFallback from "@/components/loading-fallback"

export default function HomePage() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-slate-900 via-emerald-900 to-teal-800">
      {/* 3D Lab Sampling Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 3, 10], fov: 50 }} gl={{ antialias: true, alpha: true }} shadows>
          <Suspense fallback={<LoadingFallback />}>
            <LabSamplingScene />
          </Suspense>
        </Canvas>
      </div>

      {/* Sampling Timeline */}
      <div className="absolute top-20 left-0 right-0 z-20">
        <SamplingTimeline />
      </div>

      {/* Website Content Overlay */}
      <div className="relative z-10">
        <WebsiteContent />
      </div>
    </div>
  )
}
