"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import type * as THREE from "three"

export default function EnvironmentalParticles() {
  const dustRef = useRef<THREE.Points>(null)
  const pollenRef = useRef<THREE.Points>(null)
  const mistRef = useRef<THREE.Points>(null)

  // Dust particles
  const dustCount = 200
  const dustPositions = useMemo(() => {
    const positions = new Float32Array(dustCount * 3)
    for (let i = 0; i < dustCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30
      positions[i * 3 + 1] = Math.random() * 10
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30
    }
    return positions
  }, [])

  // Pollen particles
  const pollenCount = 50
  const pollenPositions = useMemo(() => {
    const positions = new Float32Array(pollenCount * 3)
    for (let i = 0; i < pollenCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = Math.random() * 8 + 1
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20
    }
    return positions
  }, [])

  // Mist particles
  const mistCount = 100
  const mistPositions = useMemo(() => {
    const positions = new Float32Array(mistCount * 3)
    for (let i = 0; i < mistCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 25
      positions[i * 3 + 1] = Math.random() * 3
      positions[i * 3 + 2] = (Math.random() - 0.5) * 25
    }
    return positions
  }, [])

  useFrame((state) => {
    // Animate dust particles
    if (dustRef.current) {
      const positions = dustRef.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < dustCount; i++) {
        positions[i * 3] += Math.sin(state.clock.elapsedTime + i) * 0.002
        positions[i * 3 + 1] += 0.01
        positions[i * 3 + 2] += Math.cos(state.clock.elapsedTime + i) * 0.002

        // Reset particles that go too high
        if (positions[i * 3 + 1] > 10) {
          positions[i * 3 + 1] = 0
        }
      }
      dustRef.current.geometry.attributes.position.needsUpdate = true
    }

    // Animate pollen particles
    if (pollenRef.current) {
      const positions = pollenRef.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < pollenCount; i++) {
        positions[i * 3] += Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.005
        positions[i * 3 + 1] += Math.sin(state.clock.elapsedTime + i) * 0.003
        positions[i * 3 + 2] += Math.cos(state.clock.elapsedTime * 0.3 + i) * 0.004
      }
      pollenRef.current.geometry.attributes.position.needsUpdate = true
    }

    // Animate mist particles
    if (mistRef.current) {
      const positions = mistRef.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < mistCount; i++) {
        positions[i * 3] += Math.sin(state.clock.elapsedTime * 0.2 + i) * 0.001
        positions[i * 3 + 1] += 0.005
        positions[i * 3 + 2] += Math.cos(state.clock.elapsedTime * 0.2 + i) * 0.001

        // Reset mist particles
        if (positions[i * 3 + 1] > 5) {
          positions[i * 3 + 1] = 0
        }
      }
      mistRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <group>
      {/* Dust Particles */}
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={dustCount} array={dustPositions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial color="#d4a574" size={0.02} transparent opacity={0.6} sizeAttenuation />
      </points>

      {/* Pollen Particles */}
      <points ref={pollenRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={pollenCount} array={pollenPositions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial color="#fbbf24" size={0.05} transparent opacity={0.8} sizeAttenuation />
      </points>

      {/* Mist Particles */}
      <points ref={mistRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={mistCount} array={mistPositions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial color="#e5e7eb" size={0.08} transparent opacity={0.3} sizeAttenuation />
      </points>
    </group>
  )
}
