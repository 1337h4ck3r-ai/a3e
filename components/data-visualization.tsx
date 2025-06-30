"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Text3D, Float } from "@react-three/drei"
import type * as THREE from "three"

interface DataVisualizationProps {
  animationPhase: number
}

export default function DataVisualization({ animationPhase }: DataVisualizationProps) {
  const dataRef = useRef<THREE.Group>(null)

  const sampleData = [
    { label: "pH", value: "7.2", color: "#22c55e" },
    { label: "DO", value: "8.4", color: "#3b82f6" },
    { label: "TEMP", value: "22°C", color: "#f59e0b" },
    { label: "TURB", value: "1.2", color: "#ef4444" },
  ]

  useFrame((state) => {
    if (dataRef.current) {
      dataRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2
    }
  })

  return (
    <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.2}>
      <group ref={dataRef} position={[-3, 3, -2]}>
        {/* Holographic Data Panel */}
        <mesh>
          <planeGeometry args={[3, 2]} />
          <meshPhysicalMaterial color="#1f2937" transparent opacity={0.7} roughness={0.1} transmission={0.3} />
        </mesh>

        {/* Data Points */}
        {sampleData.map((data, index) => (
          <group key={data.label} position={[-1 + index * 0.5, 0.5 - index * 0.2, 0.01]}>
            <Text3D font="/fonts/Geist_Regular.json" size={0.08} height={0.01}>
              {data.label}
              <meshStandardMaterial color={data.color} />
            </Text3D>

            <Text3D font="/fonts/Geist_Bold.json" size={0.06} height={0.01} position={[0, -0.15, 0]}>
              {data.value}
              <meshStandardMaterial color="#ffffff" />
            </Text3D>
          </group>
        ))}

        {/* Scanning Line Effect */}
        <mesh position={[0, Math.sin(animationPhase * 2) * 0.5, 0.02]}>
          <planeGeometry args={[3, 0.05]} />
          <meshStandardMaterial color="#00ff00" transparent opacity={0.6} emissive="#004400" />
        </mesh>
      </group>
    </Float>
  )
}
