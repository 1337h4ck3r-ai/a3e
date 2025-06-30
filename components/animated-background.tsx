"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { Environment, Float, MeshDistortMaterial, Sparkles, Cloud } from "@react-three/drei"
import type * as THREE from "three"

// Animated Leaf Component
function AnimatedLeaf({
  position,
  scale,
  rotationSpeed,
}: {
  position: [number, number, number]
  scale: number
  rotationSpeed: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z += rotationSpeed
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.002
      meshRef.current.position.x += Math.cos(state.clock.elapsedTime * 0.3 + position[1]) * 0.001
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <planeGeometry args={[2, 3]} />
        <MeshDistortMaterial
          color="#22c55e"
          transparent
          opacity={0.7}
          distort={0.3}
          speed={2}
          roughness={0.1}
          metalness={0.2}
        />
      </mesh>
    </Float>
  )
}

// Flowing Particles Component
function FlowingParticles() {
  const particlesRef = useRef<THREE.Points>(null)

  const particleCount = 100
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    return pos
  }, [])

  useFrame((state) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += Math.sin(state.clock.elapsedTime + i) * 0.01
        positions[i * 3] += Math.cos(state.clock.elapsedTime * 0.5 + i) * 0.005
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#10b981" size={0.05} transparent opacity={0.6} sizeAttenuation />
    </points>
  )
}

// Organic Flowing Shapes
function OrganicShape({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2
      meshRef.current.rotation.y = Math.cos(state.clock.elapsedTime * 0.2) * 0.3
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 0.4) * 0.1)
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[1, 32, 32]} />
      <MeshDistortMaterial
        color="#059669"
        transparent
        opacity={0.3}
        distort={0.5}
        speed={3}
        roughness={0.2}
        metalness={0.1}
      />
    </mesh>
  )
}

// Main Animated Background Component
export default function AnimatedBackground() {
  const leafPositions: Array<[number, number, number]> = [
    [-8, 2, -2],
    [6, -1, -3],
    [-4, -3, -1],
    [8, 3, -4],
    [-6, 1, -2],
    [3, -4, -3],
    [-2, 4, -1],
    [7, -2, -2],
  ]

  return (
    <>
      {/* Environment and Lighting */}
      <Environment preset="forest" />
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} color="#ffffff" />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#22c55e" />

      {/* Animated Leaves */}
      {leafPositions.map((position, index) => (
        <AnimatedLeaf
          key={index}
          position={position}
          scale={0.8 + Math.random() * 0.4}
          rotationSpeed={0.005 + Math.random() * 0.01}
        />
      ))}

      {/* Organic Flowing Shapes */}
      <OrganicShape position={[-5, 0, -5]} />
      <OrganicShape position={[5, 2, -6]} />
      <OrganicShape position={[0, -3, -4]} />

      {/* Flowing Particles */}
      <FlowingParticles />

      {/* Sparkles for magical effect */}
      <Sparkles count={50} scale={[20, 20, 10]} size={2} speed={0.3} color="#10b981" opacity={0.4} />

      {/* Subtle clouds for depth */}
      <Cloud position={[-8, 4, -8]} speed={0.2} opacity={0.1} color="#22c55e" />
      <Cloud position={[8, -2, -6]} speed={0.3} opacity={0.15} color="#059669" />
    </>
  )
}
