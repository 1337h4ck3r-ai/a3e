"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Float } from "@react-three/drei"
import type * as THREE from "three"

export default function FieldTerrain() {
  const terrainRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (terrainRef.current) {
      // Subtle terrain animation
      const positions = terrainRef.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] = Math.sin(state.clock.elapsedTime * 0.5 + positions[i] * 0.1) * 0.1
      }
      terrainRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <group>
      {/* Ground Terrain */}
      <mesh ref={terrainRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[40, 40, 32, 32]} />
        <meshStandardMaterial color="#4a5d23" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Rocks */}
      <Float speed={0.2} rotationIntensity={0.1} floatIntensity={0.05}>
        <mesh position={[3, 0, -2]} castShadow>
          <sphereGeometry args={[0.3, 8, 6]} />
          <meshStandardMaterial color="#6b7280" roughness={0.9} />
        </mesh>
      </Float>

      <Float speed={0.15} rotationIntensity={0.1} floatIntensity={0.05}>
        <mesh position={[-4, 0, 1]} castShadow>
          <sphereGeometry args={[0.4, 8, 6]} />
          <meshStandardMaterial color="#9ca3af" roughness={0.9} />
        </mesh>
      </Float>

      {/* Vegetation Patches */}
      <Float speed={0.3} rotationIntensity={0.2} floatIntensity={0.1}>
        <mesh position={[1, 0.2, 3]} castShadow>
          <coneGeometry args={[0.5, 1, 8]} />
          <meshStandardMaterial color="#22c55e" />
        </mesh>
      </Float>

      <Float speed={0.25} rotationIntensity={0.2} floatIntensity={0.1}>
        <mesh position={[-2, 0.15, -3]} castShadow>
          <coneGeometry args={[0.4, 0.8, 8]} />
          <meshStandardMaterial color="#16a34a" />
        </mesh>
      </Float>

      {/* Water Sample Area */}
      <mesh position={[0, -0.45, -5]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2, 32]} />
        <meshPhysicalMaterial color="#0ea5e9" transparent opacity={0.8} roughness={0.1} transmission={0.5} />
      </mesh>
    </group>
  )
}
