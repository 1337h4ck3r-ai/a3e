"use client"

import { Float } from "@react-three/drei"

export default function SamplingWorkstation() {
  return (
    <group>
      {/* Main Lab Bench */}
      <mesh position={[0, 0.4, 0]} receiveShadow castShadow>
        <boxGeometry args={[8, 0.8, 3]} />
        <meshStandardMaterial color="#f8f9fa" roughness={0.1} metalness={0.1} />
      </mesh>

      {/* Lab Bench Legs */}
      {[
        [-3.5, -0.4, -1.2],
        [3.5, -0.4, -1.2],
        [-3.5, -0.4, 1.2],
        [3.5, -0.4, 1.2],
      ].map((position, index) => (
        <mesh key={index} position={position} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.8, 8]} />
          <meshStandardMaterial color="#6b7280" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}

      {/* Overhead Lighting */}
      <Float speed={0.1} rotationIntensity={0.02} floatIntensity={0.01}>
        <mesh position={[0, 3, 0]} castShadow>
          <cylinderGeometry args={[1, 1, 0.2, 16]} />
          <meshStandardMaterial color="#e5e7eb" emissive="#ffffff" emissiveIntensity={0.1} />
        </mesh>
      </Float>

      {/* Storage Cabinets */}
      <mesh position={[-4, 0.4, -2]} castShadow>
        <boxGeometry args={[1.5, 0.8, 0.6]} />
        <meshStandardMaterial color="#374151" />
      </mesh>

      <mesh position={[4, 0.4, -2]} castShadow>
        <boxGeometry args={[1.5, 0.8, 0.6]} />
        <meshStandardMaterial color="#374151" />
      </mesh>

      {/* Floor */}
      <mesh position={[0, -0.9, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#f3f4f6" roughness={0.8} />
      </mesh>

      {/* Wall Panels */}
      <mesh position={[0, 2, -4]} receiveShadow>
        <planeGeometry args={[20, 6]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>

      {/* Safety Equipment */}
      <Float speed={0.2} rotationIntensity={0.05} floatIntensity={0.03}>
        <group position={[-5, 1.5, -3.5]}>
          {/* Fire Extinguisher */}
          <mesh castShadow>
            <cylinderGeometry args={[0.1, 0.1, 0.6, 8]} />
            <meshStandardMaterial color="#dc2626" />
          </mesh>
        </group>
      </Float>

      {/* Ventilation Hood */}
      <mesh position={[0, 2.5, -1]} castShadow>
        <boxGeometry args={[3, 1, 1]} />
        <meshStandardMaterial color="#9ca3af" transparent opacity={0.7} />
      </mesh>
    </group>
  )
}
