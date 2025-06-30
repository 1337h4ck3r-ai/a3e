"use client"

import { useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { Environment, ContactShadows, Sky } from "@react-three/drei"
import * as THREE from "three"
import LabTechnician from "./lab-technician"
import LabEquipment from "./lab-equipment"
import SamplingWorkstation from "./sampling-workstation"
import EnvironmentalEffects from "./environmental-effects"
import { useSamplingStore } from "@/store/sampling-store"
import SampleResultsCharts from "./sample-results-charts"

export default function LabSamplingScene() {
  const sceneRef = useRef<THREE.Group>(null)
  const { camera } = useThree()
  const { currentStep, timelineProgress } = useSamplingStore()

  // Cinematic camera movement based on sampling step
  useFrame((state) => {
    const time = state.clock.elapsedTime

    // Camera positions for different sampling steps
    const cameraPositions = [
      { x: 8, y: 4, z: 8, lookAt: [0, 1, 0] }, // Overview
      { x: 3, y: 2, z: 5, lookAt: [-1, 1, 0] }, // Equipment setup
      { x: -2, y: 3, z: 4, lookAt: [0, 1.5, 0] }, // Sample collection
      { x: 2, y: 2, z: 3, lookAt: [1, 1, -1] }, // Analysis
      { x: 0, y: 5, z: 8, lookAt: [0, 0, 0] }, // Documentation
    ]

    const targetPos = cameraPositions[currentStep] || cameraPositions[0]

    // Smooth camera interpolation
    camera.position.lerp(new THREE.Vector3(targetPos.x, targetPos.y, targetPos.z), 0.02)

    // Look at target with smooth transition
    const lookAtTarget = new THREE.Vector3(...targetPos.lookAt)
    const currentLookAt = new THREE.Vector3()
    camera.getWorldDirection(currentLookAt)
    camera.lookAt(lookAtTarget)

    // Add subtle camera shake for realism
    camera.position.x += Math.sin(time * 2) * 0.01
    camera.position.y += Math.cos(time * 1.5) * 0.005
  })

  return (
    <group ref={sceneRef}>
      {/* Environment Setup */}
      <Sky sunPosition={[100, 20, 100]} />
      <Environment preset="studio" />

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[4096, 4096]}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        color="#ffffff"
      />
      <pointLight position={[-5, 3, -5]} intensity={0.8} color="#22c55e" />
      <spotLight position={[0, 8, 0]} angle={0.4} penumbra={1} intensity={1.2} castShadow color="#10b981" />

      {/* Lab Environment */}
      <SamplingWorkstation />

      {/* Lab Technician */}
      <LabTechnician currentStep={currentStep} />

      {/* Lab Equipment */}
      <LabEquipment currentStep={currentStep} />

      {/* Sample Results Charts */}
      <SampleResultsCharts currentStep={currentStep} timelineProgress={timelineProgress} />

      {/* Environmental Effects */}
      <EnvironmentalEffects />

      {/* Ground Shadows */}
      <ContactShadows position={[0, -0.1, 0]} opacity={0.6} scale={15} blur={2} far={4} />
    </group>
  )
}
