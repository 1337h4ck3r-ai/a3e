"use client"

export default function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#22c55e" />
    </mesh>
  )
}
