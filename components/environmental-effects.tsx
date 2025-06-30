"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { Sparkles } from "@react-three/drei"
import type * as THREE from "three"

export default function EnvironmentalEffects() {
  const steamRef = useRef<THREE.Points>(null)
  const dustRef = useRef<THREE.Points>(null)

  // Steam particles from equipment
  const steamCount = 50
  const steamPositions = useMemo(() => {
    const positions = new Float32Array(steamCount * 3)
    for (let i = 0; i < steamCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 2
      positions[i * 3 + 1] = Math.random() * 2
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2
    }
    return positions
  }, [])

  // Dust particles in air
  const dustCount = 100
  const dustPositions = useMemo(() => {
    const positions = new Float32Array(dustCount * 3)
    for (let i = 0; i < dustCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15
      positions[i * 3 + 1] = Math.random() * 5
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    return positions
  }, [])

  useFrame((state) => {
    // Animate steam particles
    if (steamRef.current) {
      const positions = steamRef.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < steamCount; i++) {
        positions[i * 3 + 1] += 0.02
        positions[i * 3] += Math.sin(state.clock.elapsedTime + i) * 0.001
        positions[i * 3 + 2] += Math.cos(state.clock.elapsedTime + i) * 0.001

        // Reset steam particles
        if (positions[i * 3 + 1] > 4) {
          positions[i * 3 + 1] = 0
        }
      }
      steamRef.current.geometry.attributes.position.needsUpdate = true
    }

    // Animate dust particles
    if (dustRef.current) {
      const positions = dustRef.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < dustCount; i++) {
        positions[i * 3] += Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.002
        positions[i * 3 + 1] += Math.sin(state.clock.elapsedTime + i) * 0.001
        positions[i * 3 + 2] += Math.cos(state.clock.elapsedTime * 0.3 + i) * 0.002
      }
      dustRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <group>
      {/* Steam Particles */}
      <points ref={steamRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={steamCount} array={steamPositions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial color="#ffffff" size={0.05} transparent opacity={0.4} sizeAttenuation />
      </points>

      {/* Dust Particles */}
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={dustCount} array={dustPositions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial color="#d4a574" size={0.02} transparent opacity={0.3} sizeAttenuation />
      </points>

      {/* Sparkles for magical lab effect */}
      <Sparkles count={30} scale={[10, 5, 8]} size={1} speed={0.2} color="#10b981" opacity={0.2} />
    </group>
  )
}
