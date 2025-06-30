"use client"

import { useRef, useMemo } from "react"
import { useFrame, useLoader } from "@react-three/fiber"
import { Environment, Float, MeshDistortMaterial, Sparkles, Cloud, Text3D } from "@react-three/drei"
import { TextureLoader } from "three"
import * as THREE from "three"

// A3E Logo 3D Component
function A3ELogo3D({ position }: { position: [number, number, number] }) {
  const logoRef = useRef<THREE.Group>(null)
  const logoTexture = useLoader(TextureLoader, "/images/a3e-logo.png")

  useFrame((state) => {
    if (logoRef.current) {
      // Gentle floating animation
      logoRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.3
      logoRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
      logoRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.2) * 0.05
    }
  })

  return (
    <group ref={logoRef} position={position}>
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
        {/* Main A3E Logo Plane */}
        <mesh>
          <planeGeometry args={[4, 2]} />
          <meshStandardMaterial
            map={logoTexture}
            transparent
            opacity={0.9}
            emissive="#10b981"
            emissiveIntensity={0.1}
          />
        </mesh>

        {/* 3D Text */}
        <Text3D font="/fonts/Geist_Bold.json" size={0.5} height={0.1} position={[0, -1.5, 0]} curveSegments={12}>
          ENVIRONMENTAL
          <meshStandardMaterial
            color="#10b981"
            emissive="#059669"
            emissiveIntensity={0.2}
            metalness={0.3}
            roughness={0.4}
          />
        </Text3D>

        {/* Glowing ring around logo */}
        <mesh rotation={[0, 0, 0]}>
          <torusGeometry args={[2.5, 0.05, 8, 32]} />
          <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.5} transparent opacity={0.6} />
        </mesh>

        {/* Particle effects around logo */}
        <Sparkles count={30} scale={[6, 6, 2]} size={3} speed={0.2} color="#10b981" opacity={0.6} />
      </Float>
    </group>
  )
}

// Enhanced Environmental Particles
function EnvironmentalParticles() {
  const particlesRef = useRef<THREE.Points>(null)
  const particleCount = 200

  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15
    }
    return pos
  }, [])

  const colors = useMemo(() => {
    const col = new Float32Array(particleCount * 3)
    const environmentalColors = [
      [0.06, 0.73, 0.51], // Emerald
      [0.02, 0.4, 0.41], // Teal
      [0.13, 0.55, 0.13], // Forest Green
      [0.0, 0.5, 1.0], // Sky Blue
    ]

    for (let i = 0; i < particleCount; i++) {
      const colorIndex = Math.floor(Math.random() * environmentalColors.length)
      const color = environmentalColors[colorIndex]
      col[i * 3] = color[0]
      col[i * 3 + 1] = color[1]
      col[i * 3 + 2] = color[2]
    }
    return col
  }, [])

  useFrame((state) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3

        // Organic movement patterns
        positions[i3 + 1] += Math.sin(state.clock.elapsedTime * 0.5 + i * 0.1) * 0.01
        positions[i3] += Math.cos(state.clock.elapsedTime * 0.3 + i * 0.05) * 0.008
        positions[i3 + 2] += Math.sin(state.clock.elapsedTime * 0.4 + i * 0.08) * 0.006

        // Boundary wrapping
        if (positions[i3 + 1] > 15) positions[i3 + 1] = -15
        if (positions[i3 + 1] < -15) positions[i3 + 1] = 15
        if (positions[i3] > 15) positions[i3] = -15
        if (positions[i3] < -15) positions[i3] = 15
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true
      particlesRef.current.rotation.y += 0.001
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={particleCount} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        transparent
        opacity={0.7}
        sizeAttenuation
        vertexColors
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// Animated Environmental Leaves
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

// Data Flow Visualization
function DataFlowStreams() {
  const streamRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (streamRef.current) {
      streamRef.current.rotation.y += 0.005
      streamRef.current.children.forEach((child, index) => {
        child.position.y = Math.sin(state.clock.elapsedTime * 2 + index) * 2
      })
    }
  })

  return (
    <group ref={streamRef}>
      {Array.from({ length: 8 }, (_, i) => (
        <mesh key={i} position={[Math.cos((i * Math.PI) / 4) * 8, 0, Math.sin((i * Math.PI) / 4) * 8]}>
          <cylinderGeometry args={[0.02, 0.02, 4]} />
          <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.3} transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
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
    [-10, 0, -5],
    [10, -3, -6],
  ]

  return (
    <>
      {/* Enhanced Environment and Lighting */}
      <Environment preset="forest" />
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} color="#ffffff" />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#22c55e" />
      <spotLight
        position={[0, 15, 0]}
        angle={0.3}
        penumbra={1}
        intensity={0.5}
        color="#10b981"
        target-position={[0, 0, 0]}
      />

      {/* A3E Logo 3D - Main focal point */}
      <A3ELogo3D position={[0, 2, -8]} />

      {/* Enhanced Environmental Particles */}
      <EnvironmentalParticles />

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
      <OrganicShape position={[-8, 1, -7]} />
      <OrganicShape position={[8, -1, -3]} />

      {/* Data Flow Visualization */}
      <DataFlowStreams />

      {/* Enhanced Sparkles for magical effect */}
      <Sparkles count={100} scale={[25, 25, 15]} size={2} speed={0.3} color="#10b981" opacity={0.4} />

      {/* Additional sparkles with different colors */}
      <Sparkles count={50} scale={[20, 20, 10]} size={1.5} speed={0.2} color="#059669" opacity={0.3} />

      {/* Environmental clouds for depth */}
      <Cloud position={[-12, 6, -10]} speed={0.2} opacity={0.1} color="#22c55e" />
      <Cloud position={[12, -2, -8]} speed={0.3} opacity={0.15} color="#059669" />
      <Cloud position={[0, 8, -12]} speed={0.1} opacity={0.08} color="#10b981" />

      {/* Atmospheric fog effect */}
      <fog attach="fog" args={["#0a0f0a", 15, 35]} />
    </>
  )
}
