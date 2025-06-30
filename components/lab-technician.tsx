"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Float } from "@react-three/drei"
import type * as THREE from "three"

interface LabTechnicianProps {
  currentStep: number
}

export default function LabTechnician({ currentStep }: LabTechnicianProps) {
  const technicianRef = useRef<THREE.Group>(null)
  const armRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (technicianRef.current) {
      // Subtle breathing animation
      technicianRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.02
    }

    if (armRef.current) {
      // Arm movements based on current step
      switch (currentStep) {
        case 0: // Setup
          armRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 1.5) * 0.3
          break
        case 1: // Calibration
          armRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.2
          break
        case 2: // Collection
          armRef.current.rotation.x = -0.5 + Math.sin(state.clock.elapsedTime * 3) * 0.2
          break
        case 3: // Analysis
          armRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 1) * 0.1
          break
        case 4: // Documentation
          armRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
          break
      }
    }
  })

  return (
    <group ref={technicianRef} position={[-1, 0, 0]}>
      {/* Body */}
      <mesh castShadow>
        <cylinderGeometry args={[0.4, 0.3, 1.6, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#fdbcbc" />
      </mesh>

      {/* Lab Coat Details */}
      <mesh position={[0, 0.2, 0.31]} castShadow>
        <boxGeometry args={[0.6, 1.2, 0.05]} />
        <meshStandardMaterial color="#f8f9fa" />
      </mesh>

      {/* Arms */}
      <group ref={armRef}>
        {/* Left Arm */}
        <mesh position={[-0.5, 0.5, 0]} rotation={[0, 0, -0.3]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.8, 8]} />
          <meshStandardMaterial color="#fdbcbc" />
        </mesh>

        {/* Right Arm */}
        <mesh position={[0.5, 0.5, 0]} rotation={[0, 0, 0.3]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.8, 8]} />
          <meshStandardMaterial color="#fdbcbc" />
        </mesh>
      </group>

      {/* Legs */}
      <mesh position={[-0.15, -1.2, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.8, 8]} />
        <meshStandardMaterial color="#2563eb" />
      </mesh>
      <mesh position={[0.15, -1.2, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.8, 8]} />
        <meshStandardMaterial color="#2563eb" />
      </mesh>

      {/* Safety Goggles */}
      <mesh position={[0, 1.25, 0.2]} castShadow>
        <boxGeometry args={[0.3, 0.1, 0.05]} />
        <meshPhysicalMaterial color="#333333" transparent opacity={0.8} />
      </mesh>

      {/* Gloves */}
      <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.05}>
        <mesh position={[-0.5, 0.1, 0.3]} castShadow>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshStandardMaterial color="#00ff00" />
        </mesh>
        <mesh position={[0.5, 0.1, 0.3]} castShadow>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshStandardMaterial color="#00ff00" />
        </mesh>
      </Float>
    </group>
  )
}
