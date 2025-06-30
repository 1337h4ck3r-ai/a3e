"use client"

import { useRef, useState } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { Environment, Sparkles, Cloud, Sky, ContactShadows } from "@react-three/drei"
import type * as THREE from "three"
import SamplingEquipment from "./sampling-equipment"
import EnvironmentalParticles from "./environmental-particles"
import FieldTerrain from "./field-terrain"
import DataVisualization from "./data-visualization"

export default function FieldSamplingScene() {
  const sceneRef = useRef<THREE.Group>(null)
  const { camera } = useThree()
  const [animationPhase, setAnimationPhase] = useState(0)

  // Cinematic camera movement
  useFrame((state) => {
    const time = state.clock.elapsedTime

    // Smooth orbital camera movement
    camera.position.x = Math.sin(time * 0.1) * 12
    camera.position.z = Math.cos(time * 0.1) * 12 + 5
    camera.position.y = 3 + Math.sin(time * 0.05) * 2
    camera.lookAt(0, 0, 0)

    // Update animation phase every 10 seconds
    const newPhase = Math.floor(time / 10) % 4
    if (newPhase !== animationPhase) {
      setAnimationPhase(newPhase)
    }
  })

  return (
    <group ref={sceneRef}>
      {/* Environment Setup */}
      <Sky sunPosition={[100, 20, 100]} />
      <Environment preset="forest" />

      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        color="#ffffff"
      />
      <pointLight position={[-5, 3, -5]} intensity={0.5} color="#22c55e" />
      <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={0.8} castShadow color="#10b981" />

      {/* Field Terrain */}
      <FieldTerrain />

      {/* Sampling Equipment */}
      <SamplingEquipment animationPhase={animationPhase} />

      {/* Environmental Effects */}
      <EnvironmentalParticles />

      {/* Data Visualization */}
      <DataVisualization animationPhase={animationPhase} />

      {/* Atmospheric Effects */}
      <Sparkles count={100} scale={[20, 10, 20]} size={1} speed={0.2} color="#10b981" opacity={0.3} />

      {/* Floating Clouds */}
      <Cloud position={[-15, 8, -10]} speed={0.1} opacity={0.2} color="#ffffff" />
      <Cloud position={[15, 6, -8]} speed={0.15} opacity={0.15} color="#e5e7eb" />

      {/* Ground Shadows */}
      <ContactShadows position={[0, -0.5, 0]} opacity={0.4} scale={20} blur={2} far={4} />
    </group>
  )
}
