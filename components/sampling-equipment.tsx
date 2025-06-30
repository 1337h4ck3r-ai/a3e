"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Float, Text3D } from "@react-three/drei"
import type * as THREE from "three"

interface SamplingEquipmentProps {
  animationPhase: number
}

// Sample Vial Component
function SampleVial({
  position,
  color,
  label,
}: {
  position: [number, number, number]
  color: string
  label: string
}) {
  const vialRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (vialRef.current) {
      vialRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.1
    }
  })

  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
      <group ref={vialRef} position={position}>
        {/* Vial Body */}
        <mesh castShadow>
          <cylinderGeometry args={[0.15, 0.15, 0.8, 16]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transparent
            opacity={0.8}
            roughness={0.1}
            transmission={0.9}
            thickness={0.1}
          />
        </mesh>

        {/* Sample Liquid */}
        <mesh position={[0, -0.2, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.12, 0.4, 16]} />
          <meshPhysicalMaterial color={color} transparent opacity={0.7} roughness={0.2} metalness={0.1} />
        </mesh>

        {/* Cap */}
        <mesh position={[0, 0.45, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.18, 0.1, 16]} />
          <meshStandardMaterial color="#333333" />
        </mesh>

        {/* Label */}
        <Text3D
          font="/fonts/Geist_Regular.json"
          size={0.05}
          height={0.01}
          position={[-0.1, 0, 0.16]}
          rotation={[0, 0, 0]}
        >
          {label}
          <meshStandardMaterial color="#000000" />
        </Text3D>
      </group>
    </Float>
  )
}

// Sampling Tool Component
function SamplingTool({ position }: { position: [number, number, number] }) {
  const toolRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (toolRef.current) {
      toolRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.5) * 0.2
      toolRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1
    }
  })

  return (
    <group ref={toolRef} position={position}>
      {/* Handle */}
      <mesh castShadow>
        <cylinderGeometry args={[0.05, 0.05, 1.5, 8]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>

      {/* Sampling Head */}
      <mesh position={[0, -0.8, 0]} castShadow>
        <coneGeometry args={[0.1, 0.3, 8]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  )
}

// pH Meter Component
function PHMeter({ position }: { position: [number, number, number] }) {
  const meterRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (meterRef.current) {
      meterRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3
    }
  })

  return (
    <Float speed={0.8} rotationIntensity={0.1} floatIntensity={0.2}>
      <group ref={meterRef} position={position}>
        {/* Device Body */}
        <mesh castShadow>
          <boxGeometry args={[0.4, 0.6, 0.1]} />
          <meshStandardMaterial color="#2d3748" />
        </mesh>

        {/* Screen */}
        <mesh position={[0, 0.1, 0.051]}>
          <boxGeometry args={[0.3, 0.2, 0.01]} />
          <meshStandardMaterial color="#00ff00" emissive="#004400" />
        </mesh>

        {/* Probe */}
        <mesh position={[0, -0.5, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
          <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
    </Float>
  )
}

export default function SamplingEquipment({ animationPhase }: SamplingEquipmentProps) {
  return (
    <group>
      {/* Sample Vials */}
      <SampleVial position={[-2, 0.5, 1]} color="#22c55e" label="H2O" />
      <SampleVial position={[-1.5, 0.5, 1.5]} color="#3b82f6" label="SOIL" />
      <SampleVial position={[-1, 0.5, 1]} color="#f59e0b" label="AIR" />

      {/* Sampling Tools */}
      <SamplingTool position={[2, 1, 0]} />
      <SamplingTool position={[2.5, 1, -0.5]} />

      {/* pH Meter */}
      <PHMeter position={[0, 1.2, 2]} />

      {/* Field Notebook */}
      <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.1}>
        <mesh position={[1.5, 0.6, 1.5]} rotation={[0, 0.3, 0]} castShadow>
          <boxGeometry args={[0.3, 0.4, 0.05]} />
          <meshStandardMaterial color="#8b4513" />
        </mesh>
      </Float>
    </group>
  )
}
