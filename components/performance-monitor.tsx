"use client"

import { useEffect, useState } from "react"

export default function PerformanceMonitor() {
  const [fps, setFps] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    let frameCount = 0
    let lastTime = performance.now()

    const measureFPS = () => {
      frameCount++
      const currentTime = performance.now()

      if (currentTime - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (currentTime - lastTime)))
        frameCount = 0
        lastTime = currentTime
      }

      requestAnimationFrame(measureFPS)
    }

    measureFPS()

    // Show monitor on key press (for development)
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "p" && e.ctrlKey) {
        setIsVisible(!isVisible)
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [isVisible])

  if (!isVisible) return null

  return <div className="fixed top-4 right-4 z-50 bg-black/80 text-white p-2 rounded text-sm font-mono">FPS: {fps}</div>
}
