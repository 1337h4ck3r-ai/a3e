"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Float, Text3D } from "@react-three/drei"
import type * as THREE from "three"

interface LabEquipmentProps {
  currentStep: number
}

// Microscope Component
function Microscope({ position }: { position: [number, number, number] }) {
  const microscopeRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (microscopeRef.current) {
      microscopeRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <group ref={microscopeRef} position={position}>
      {/* Base */}
      <mesh castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.1, 16]} />
        <meshStandardMaterial color="#2d3748" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Arm */}
      <mesh position={[0, 0.4, 0]} rotation={[0, 0, 0.2]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.6, 8]} />
        <meshStandardMaterial color="#4a5568" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Eyepiece */}
      <mesh position={[0.15, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.2, 8]} />
        <meshStandardMaterial color="#1a202c" />
      </mesh>

      {/* Objective Lens */}
      <mesh position={[-0.1, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.1, 8]} />
        <meshStandardMaterial color="#2d3748" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  )
}

// Centrifuge Component
function Centrifuge({ position, isActive }: { position: [number, number, number]; isActive: boolean }) {
  const centrifugeRef = useRef<THREE.Group>(null)
  const rotorRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (rotorRef.current && isActive) {
      rotorRef.current.rotation.y += 0.3
    }
  })

  return (
    <group ref={centrifugeRef} position={position}>
      {/* Main Body */}
      <mesh castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.6, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Rotor */}
      <mesh ref={rotorRef} position={[0, 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.25, 0.1, 8]} />
        <meshStandardMaterial color="#4a5568" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Sample Tubes */}
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={i}
          position={[Math.cos((i * Math.PI) / 2) * 0.15, 0.15, Math.sin((i * Math.PI) / 2) * 0.15]}
          castShadow
        >
          <cylinderGeometry args={[0.02, 0.02, 0.2, 8]} />
          <meshStandardMaterial color="#22c55e" transparent opacity={0.8} />
        </mesh>
      ))}

      {/* Control Panel */}
      <mesh position={[0, 0, 0.41]} castShadow>
        <boxGeometry args={[0.3, 0.2, 0.02]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>

      {/* Status Light */}
      <mesh position={[0.1, 0.05, 0.42]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial color={isActive ? "#00ff00" : "#ff0000"} emissive={isActive ? "#004400" : "#440000"} />
      </mesh>
    </group>
  )
}

// Spectrometer Component
function Spectrometer({ position }: { position: [number, number, number] }) {
  return (
    <Float speed={0.3} rotationIntensity={0.1} floatIntensity={0.05}>
      <group position={position}>
        {/* Main Unit */}
        <mesh castShadow>
          <boxGeometry args={[0.8, 0.4, 0.6]} />
          <meshStandardMaterial color="#e5e7eb" />
        </mesh>

        {/* Display Screen */}
        <mesh position={[0, 0.1, 0.31]} castShadow>
          <boxGeometry args={[0.4, 0.2, 0.02]} />
          <meshStandardMaterial color="#000000" emissive="#001100" />
        </mesh>

        {/* Sample Chamber */}
        <mesh position={[0, -0.1, 0.31]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.1, 8]} />
          <meshStandardMaterial color="#4a5568" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
    </Float>
  )
}

export default function LabEquipment({ currentStep }: LabEquipmentProps) {
  return (
    <group>
      {/* Microscope */}
      <Microscope position={[2, 0.9, -1]} />

      {/* Centrifuge - Active during analysis step */}
      <Centrifuge position={[3, 0.9, 1]} isActive={currentStep === 3} />

      {/* Spectrometer */}
      <Spectrometer position={[-3, 0.9, 0]} />

      {/* Sample Rack */}
      <Float speed={0.2} rotationIntensity={0.05} floatIntensity={0.02}>
        <group position={[1, 0.9, 2]}>
          <mesh castShadow>
            <boxGeometry args={[0.6, 0.1, 0.4]} />
            <meshStandardMaterial color="#8b4513" />
          </mesh>

          {/* Sample Vials in Rack */}
          {Array.from({ length: 12 }).map((_, i) => (
            <mesh key={i} position={[-0.25 + (i % 4) * 0.15, 0.15, -0.15 + Math.floor(i / 4) * 0.15]} castShadow>
              <cylinderGeometry args={[0.02, 0.02, 0.2, 8]} />
              <meshStandardMaterial color={i < currentStep * 2 ? "#22c55e" : "#ffffff"} transparent opacity={0.8} />
            </mesh>
          ))}
        </group>
      </Float>

      {/* Computer Terminal */}
      <group position={[-2, 0.9, 2]}>
        <mesh castShadow>
          <boxGeometry args={[0.4, 0.3, 0.05]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>

        {/* Screen Content */}
        <mesh position={[0, 0, 0.026]}>
          <boxGeometry args={[0.35, 0.25, 0.001]} />
          <meshStandardMaterial color="#000000" emissive="#002200" />
        </mesh>

        {/* Data Visualization */}
        <Text3D font="/fonts/Geist_Regular.json" size={0.02} height={0.001} position={[-0.15, 0.05, 0.027]}>
          {`Step ${currentStep + 1}/5`}
          <meshStandardMaterial color="#00ff00" />
        </Text3D>
      </group>
    </group>
  )
}
