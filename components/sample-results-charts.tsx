"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { Float, Text3D, Html } from "@react-three/drei"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import type * as THREE from "three"
import ExportControls from "./export-controls"

interface SampleResultsChartsProps {
  currentStep: number
  timelineProgress: number
}

// Sample data for different environmental parameters
const generateSampleData = (progress: number) => {
  const dataPoints = Math.floor((progress / 100) * 10) + 1

  return {
    pH: Array.from({ length: dataPoints }, (_, i) => ({
      time: i * 5,
      value: 7.2 + Math.sin(i * 0.5) * 0.3 + (Math.random() - 0.5) * 0.1,
      target: 7.0,
    })),
    dissolvedOxygen: Array.from({ length: dataPoints }, (_, i) => ({
      time: i * 5,
      value: 8.5 + Math.cos(i * 0.3) * 0.8 + (Math.random() - 0.5) * 0.2,
      target: 8.0,
    })),
    temperature: Array.from({ length: dataPoints }, (_, i) => ({
      time: i * 5,
      value: 22 + Math.sin(i * 0.4) * 2 + (Math.random() - 0.5) * 0.5,
      target: 20,
    })),
    turbidity: Array.from({ length: dataPoints }, (_, i) => ({
      time: i * 5,
      value: Math.max(0.1, 1.2 + Math.sin(i * 0.6) * 0.5 + (Math.random() - 0.5) * 0.3),
      target: 1.0,
    })),
    contaminants: [
      { name: "Lead", value: 0.003, limit: 0.015, status: "safe" },
      { name: "Mercury", value: 0.001, limit: 0.002, status: "safe" },
      { name: "Arsenic", value: 0.008, limit: 0.01, status: "caution" },
      { name: "Cadmium", value: 0.004, limit: 0.005, status: "safe" },
    ],
    compliance: [
      { name: "Compliant", value: 85, color: "#22c55e" },
      { name: "Caution", value: 12, color: "#f59e0b" },
      { name: "Non-Compliant", value: 3, color: "#ef4444" },
    ],
  }
}

// 3D Chart Display Component
function Chart3D({
  position,
  title,
  children,
}: {
  position: [number, number, number]
  title: string
  children: React.ReactNode
}) {
  const chartRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (chartRef.current) {
      chartRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
    }
  })

  return (
    <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.2}>
      <group ref={chartRef} position={position}>
        {/* Chart Background Panel */}
        <mesh>
          <planeGeometry args={[4, 3]} />
          <meshPhysicalMaterial color="#1f2937" transparent opacity={0.9} roughness={0.1} transmission={0.1} />
        </mesh>

        {/* Chart Border */}
        <mesh position={[0, 0, 0.001]}>
          <planeGeometry args={[4.1, 3.1]} />
          <meshStandardMaterial color="#10b981" transparent opacity={0.3} />
        </mesh>

        {/* Chart Title */}
        <Text3D font="/fonts/Geist_Bold.json" size={0.15} height={0.02} position={[-1.8, 1.2, 0.01]}>
          {title}
          <meshStandardMaterial color="#ffffff" />
        </Text3D>

        {/* HTML Chart Content */}
        <Html
          position={[0, -0.2, 0.02]}
          transform
          occlude
          style={{
            width: "350px",
            height: "200px",
            pointerEvents: "none",
          }}
        >
          <div className="bg-transparent">{children}</div>
        </Html>

        {/* Glowing Effect */}
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[4.2, 3.2]} />
          <meshStandardMaterial color="#10b981" transparent opacity={0.1} emissive="#10b981" emissiveIntensity={0.2} />
        </mesh>
      </group>
    </Float>
  )
}

// Real-time Data Display
function RealTimeDataDisplay({
  position,
  data,
}: {
  position: [number, number, number]
  data: any
}) {
  const displayRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (displayRef.current) {
      displayRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.05
    }
  })

  return (
    <group ref={displayRef} position={position}>
      {/* Display Panel */}
      <mesh>
        <boxGeometry args={[2, 1.5, 0.1]} />
        <meshStandardMaterial color="#000000" emissive="#001100" emissiveIntensity={0.1} />
      </mesh>

      {/* Current Values */}
      <Text3D font="/fonts/Geist_Bold.json" size={0.08} height={0.01} position={[-0.9, 0.5, 0.06]}>
        LIVE DATA
        <meshStandardMaterial color="#00ff00" emissive="#004400" emissiveIntensity={0.3} />
      </Text3D>

      {/* pH Value */}
      <Text3D font="/fonts/Geist_Regular.json" size={0.06} height={0.01} position={[-0.9, 0.2, 0.06]}>
        {`pH: ${data.pH[data.pH.length - 1]?.value.toFixed(2) || "0.00"}`}
        <meshStandardMaterial color="#ffffff" />
      </Text3D>

      {/* Temperature */}
      <Text3D font="/fonts/Geist_Regular.json" size={0.06} height={0.01} position={[-0.9, 0.0, 0.06]}>
        {`TEMP: ${data.temperature[data.temperature.length - 1]?.value.toFixed(1) || "0.0"}°C`}
        <meshStandardMaterial color="#ffffff" />
      </Text3D>

      {/* Dissolved Oxygen */}
      <Text3D font="/fonts/Geist_Regular.json" size={0.06} height={0.01} position={[-0.9, -0.2, 0.06]}>
        {`DO: ${data.dissolvedOxygen[data.dissolvedOxygen.length - 1]?.value.toFixed(1) || "0.0"} mg/L`}
        <meshStandardMaterial color="#ffffff" />
      </Text3D>

      {/* Status Indicator */}
      <mesh position={[0.7, 0, 0.06]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.5} />
      </mesh>
    </group>
  )
}

// Animated Progress Bars for Contaminant Levels
function ContaminantBars({
  position,
  contaminants,
}: {
  position: [number, number, number]
  contaminants: any[]
}) {
  return (
    <group position={position}>
      {contaminants.map((contaminant, index) => {
        const yPos = 0.6 - index * 0.3
        const percentage = (contaminant.value / contaminant.limit) * 100
        const barColor =
          contaminant.status === "safe" ? "#22c55e" : contaminant.status === "caution" ? "#f59e0b" : "#ef4444"

        return (
          <group key={contaminant.name} position={[0, yPos, 0]}>
            {/* Label */}
            <Text3D font="/fonts/Geist_Regular.json" size={0.05} height={0.01} position={[-1.5, 0, 0]}>
              {contaminant.name}
              <meshStandardMaterial color="#ffffff" />
            </Text3D>

            {/* Background Bar */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[2, 0.1, 0.02]} />
              <meshStandardMaterial color="#374151" />
            </mesh>

            {/* Progress Bar */}
            <mesh position={[(-2 + (2 * percentage) / 100) / 2, 0, 0.01]}>
              <boxGeometry args={[(2 * percentage) / 100, 0.1, 0.02]} />
              <meshStandardMaterial color={barColor} emissive={barColor} emissiveIntensity={0.2} />
            </mesh>

            {/* Value Text */}
            <Text3D font="/fonts/Geist_Regular.json" size={0.04} height={0.01} position={[1.2, 0, 0]}>
              {`${contaminant.value.toFixed(3)}`}
              <meshStandardMaterial color="#ffffff" />
            </Text3D>
          </group>
        )
      })}
    </group>
  )
}

export default function SampleResultsCharts({ currentStep, timelineProgress }: SampleResultsChartsProps) {
  const [sampleData, setSampleData] = useState(() => generateSampleData(0))
  const [isVisible, setIsVisible] = useState(false)

  // Update data based on timeline progress
  useEffect(() => {
    if (currentStep >= 2) {
      // Show charts during sample collection and analysis
      setIsVisible(true)
      setSampleData(generateSampleData(timelineProgress))
    } else {
      setIsVisible(false)
    }
  }, [currentStep, timelineProgress])

  if (!isVisible) return null

  return (
    <group>
      {/* pH Level Chart */}
      <Chart3D position={[-6, 3, -2]} title="pH Levels">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sampleData.pH}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="time" stroke="#9ca3af" fontSize={10} />
            <YAxis domain={[6.5, 8.0]} stroke="#9ca3af" fontSize={10} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #10b981",
                borderRadius: "4px",
                color: "#ffffff",
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#22c55e"
              strokeWidth={2}
              dot={{ fill: "#22c55e", strokeWidth: 2, r: 3 }}
            />
            <Line type="monotone" dataKey="target" stroke="#f59e0b" strokeDasharray="5 5" strokeWidth={1} />
          </LineChart>
        </ResponsiveContainer>
      </Chart3D>

      {/* Temperature Chart */}
      <Chart3D position={[6, 3, -2]} title="Temperature">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sampleData.temperature}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="time" stroke="#9ca3af" fontSize={10} />
            <YAxis domain={[18, 26]} stroke="#9ca3af" fontSize={10} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #10b981",
                borderRadius: "4px",
                color: "#ffffff",
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: "#3b82f6", strokeWidth: 2, r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Chart3D>

      {/* Dissolved Oxygen Chart */}
      <Chart3D position={[-6, 3, 4]} title="Dissolved Oxygen">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sampleData.dissolvedOxygen}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="time" stroke="#9ca3af" fontSize={10} />
            <YAxis domain={[6, 11]} stroke="#9ca3af" fontSize={10} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #10b981",
                borderRadius: "4px",
                color: "#ffffff",
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#06b6d4"
              strokeWidth={2}
              dot={{ fill: "#06b6d4", strokeWidth: 2, r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Chart3D>

      {/* Compliance Pie Chart */}
      <Chart3D position={[6, 3, 4]} title="Compliance Status">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={sampleData.compliance}
              cx="50%"
              cy="50%"
              innerRadius={30}
              outerRadius={60}
              paddingAngle={5}
              dataKey="value"
            >
              {sampleData.compliance.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #10b981",
                borderRadius: "4px",
                color: "#ffffff",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </Chart3D>

      {/* Real-time Data Display */}
      <RealTimeDataDisplay position={[0, 4, 0]} data={sampleData} />

      {/* Contaminant Level Bars */}
      <Float speed={0.3} rotationIntensity={0.05} floatIntensity={0.1}>
        <group position={[0, 1, -5]}>
          {/* Background Panel */}
          <mesh>
            <planeGeometry args={[4, 2]} />
            <meshPhysicalMaterial color="#1f2937" transparent opacity={0.9} roughness={0.1} />
          </mesh>

          {/* Title */}
          <Text3D font="/fonts/Geist_Bold.json" size={0.1} height={0.02} position={[-1.5, 0.8, 0.01]}>
            CONTAMINANT LEVELS
            <meshStandardMaterial color="#ffffff" />
          </Text3D>

          <ContaminantBars position={[0, 0.2, 0.01]} contaminants={sampleData.contaminants} />
        </group>
      </Float>

      {/* Turbidity Bar Chart */}
      <Chart3D position={[0, 3, 6]} title="Turbidity Levels">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sampleData.turbidity.slice(-5)}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="time" stroke="#9ca3af" fontSize={10} />
            <YAxis stroke="#9ca3af" fontSize={10} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #10b981",
                borderRadius: "4px",
                color: "#ffffff",
              }}
            />
            <Bar dataKey="value" fill="#8b5cf6" />
          </BarChart>
        </ResponsiveContainer>
      </Chart3D>

      {/* Data Quality Indicators */}
      <Float speed={0.4} rotationIntensity={0.1} floatIntensity={0.15}>
        <group position={[-8, 2, 0]}>
          {/* Quality Score */}
          <mesh>
            <cylinderGeometry args={[0.5, 0.5, 0.1, 16]} />
            <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.3} />
          </mesh>

          <Text3D font="/fonts/Geist_Bold.json" size={0.15} height={0.02} position={[-0.2, 0.15, 0.06]}>
            95%
            <meshStandardMaterial color="#ffffff" />
          </Text3D>

          <Text3D font="/fonts/Geist_Regular.json" size={0.06} height={0.01} position={[-0.3, -0.8, 0]}>
            DATA QUALITY
            <meshStandardMaterial color="#ffffff" />
          </Text3D>
        </group>
      </Float>
      {/* Export Controls */}
      <Html position={[0, 0, 0]} style={{ pointerEvents: "auto" }}>
        <ExportControls sampleData={sampleData} currentStep={currentStep} />
      </Html>
    </group>
  )
}
