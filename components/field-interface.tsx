"use client"

import { SelectTrigger } from "@/components/ui/select"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import {
  MapPin,
  Mic,
  MicOff,
  Save,
  Download,
  Thermometer,
  Droplets,
  Wind,
  Activity,
  FileText,
  Navigation,
  Smartphone,
  Wifi,
  WifiOff,
  Battery,
  Signal,
  Eye,
  Layers,
  Target,
  Zap,
  Shield,
  AlertTriangle,
} from "lucide-react"
import EnhancedImageCapture from "./enhanced-image-capture"
import SubmissionTimeline from "./submission-timeline"

interface GPSCoordinates {
  latitude: number
  longitude: number
  accuracy: number
  timestamp: Date
}

interface FieldSample {
  id: string
  type: "soil" | "water" | "air" | "sediment"
  location: GPSCoordinates
  depth?: string
  description: string
  photos: string[]
  measurements: {
    temperature?: number
    pH?: number
    conductivity?: number
    turbidity?: number
    dissolvedOxygen?: number
  }
  notes: string
  timestamp: Date
  technician: string
  status: "pending" | "validated" | "uploaded"
  projectId?: string
  sampleLocationId?: string
}

interface FieldProject {
  id: string
  name: string
  type: "Phase I ESA" | "Phase II ESA" | "Remediation" | "UST Assessment" | "Industrial Hygiene"
  client: string
  location: string
  startDate: Date
  samples: FieldSample[]
  status: "active" | "completed" | "on-hold"
  samplingLocations?: Array<{
    id: string
    description: string
    coordinates: { lat: number; lng: number }
    type: string
    priority: string
    contaminants: string[]
  }>
}

export default function FieldInterface() {
  const [currentProject, setCurrentProject] = useState<FieldProject | null>(null)
  const [gpsLocation, setGpsLocation] = useState<GPSCoordinates | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [batteryLevel, setBatteryLevel] = useState(100)
  const [signalStrength, setSignalStrength] = useState(4)
  const [currentSample, setCurrentSample] = useState<Partial<FieldSample>>({})
  const [voiceNotes, setVoiceNotes] = useState<string[]>([])
  const [photos, setPhotos] = useState<string[]>([])
  const [syncProgress, setSyncProgress] = useState(0)
  const [validationStatus, setValidationStatus] = useState<"pending" | "valid" | "invalid">("pending")
  const [nearbyLocations, setNearbyLocations] = useState<any[]>([])
  const [capturedImages, setCapturedImages] = useState<any[]>([])

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Enhanced projects with DePue site assessment
  const projects: FieldProject[] = [
    {
      id: "epa-depue-2025-001",
      name: "EPA Region 5 - ESO DePue Site Environmental Assessment",
      type: "Phase II ESA",
      client: "US EPA Region 5",
      location: "DePue, Bureau County, Illinois",
      startDate: new Date("2025-02-01"),
      samples: [],
      status: "active",
      samplingLocations: [
        {
          id: "DPU-SW-001",
          description: "Former smelter building foundation area",
          coordinates: { lat: 41.3251, lng: -89.3048 },
          type: "Soil/Water",
          priority: "High",
          contaminants: ["Heavy Metals", "PCBs"],
        },
        {
          id: "DPU-SW-002",
          description: "Waste storage area - northeast quadrant",
          coordinates: { lat: 41.3255, lng: -89.3045 },
          type: "Soil/Water",
          priority: "High",
          contaminants: ["Heavy Metals", "VOCs"],
        },
        {
          id: "DPU-GW-001",
          description: "Upgradient monitoring well",
          coordinates: { lat: 41.324, lng: -89.3055 },
          type: "Groundwater",
          priority: "High",
          contaminants: ["Heavy Metals", "VOCs"],
        },
        {
          id: "DPU-GW-002",
          description: "Downgradient monitoring well - Illinois River direction",
          coordinates: { lat: 41.326, lng: -89.304 },
          type: "Groundwater",
          priority: "High",
          contaminants: ["Heavy Metals", "VOCs"],
        },
        {
          id: "DPU-SED-001",
          description: "Illinois River sediment - adjacent to site",
          coordinates: { lat: 41.3265, lng: -89.3035 },
          type: "Sediment",
          priority: "Medium",
          contaminants: ["Heavy Metals", "PCBs"],
        },
        {
          id: "DPU-AIR-001",
          description: "Ambient air monitoring - residential area",
          coordinates: { lat: 41.3245, lng: -89.306 },
          type: "Air",
          priority: "Medium",
          contaminants: ["VOCs", "Particulates"],
        },
      ],
    },
    {
      id: "industrial-chicago-002",
      name: "Chicago Industrial Complex - Phase I",
      type: "Phase I ESA",
      client: "Midwest Manufacturing Corp",
      location: "Chicago, IL",
      startDate: new Date("2025-01-10"),
      samples: [],
      status: "active",
    },
  ]

  // Initialize GPS and device monitoring
  useEffect(() => {
    // Get current location with high accuracy
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const newLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date(),
          }
          setGpsLocation(newLocation)

          // Check for nearby sampling locations
          if (currentProject?.samplingLocations) {
            const nearby = currentProject.samplingLocations.filter((loc) => {
              const distance = calculateDistance(
                newLocation.latitude,
                newLocation.longitude,
                loc.coordinates.lat,
                loc.coordinates.lng,
              )
              return distance < 100 // Within 100 meters
            })
            setNearbyLocations(nearby)
          }
        },
        (error) => {
          console.error("GPS Error:", error)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 30000,
        },
      )

      return () => navigator.geolocation.clearWatch(watchId)
    }
  }, [currentProject])

  // Monitor online status and battery
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Simulate battery monitoring
    const batteryInterval = setInterval(() => {
      setBatteryLevel((prev) => Math.max(10, prev - Math.random() * 0.5))
    }, 60000)

    // Set default project to DePue
    setCurrentProject(projects[0])

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
      clearInterval(batteryInterval)
    }
  }, [])

  // Calculate distance between two GPS coordinates
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3 // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180
    const φ2 = (lat2 * Math.PI) / 180
    const Δφ = ((lat2 - lat1) * Math.PI) / 180
    const Δλ = ((lon2 - lon1) * Math.PI) / 180

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c // Distance in meters
  }

  // Voice recording functionality
  const toggleVoiceRecording = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        setIsRecording(true)
        // In a real implementation, you would start recording here
        setTimeout(() => {
          setIsRecording(false)
          setVoiceNotes((prev) => [...prev, `Voice note recorded at ${new Date().toLocaleTimeString()}`])
        }, 3000) // Auto-stop after 3 seconds for demo
      } catch (error) {
        console.error("Microphone access denied:", error)
      }
    } else {
      setIsRecording(false)
    }
  }

  // Enhanced validation for DePue project
  const validateSample = () => {
    const { type, description, measurements } = currentSample

    if (!type || !description || !gpsLocation) {
      setValidationStatus("invalid")
      return
    }

    // EPA-specific validation rules for DePue site
    if (currentProject?.id === "epa-depue-2025-001") {
      // Heavy metals sampling requires specific temperature range
      if (
        type === "soil" &&
        measurements?.temperature &&
        (measurements.temperature < -5 || measurements.temperature > 40)
      ) {
        setValidationStatus("invalid")
        return
      }

      // Groundwater sampling requires pH measurement
      if (type === "water" && !measurements?.pH) {
        setValidationStatus("invalid")
        return
      }

      // Air sampling requires specific conditions
      if (type === "air" && (!measurements?.temperature || !description.includes("wind"))) {
        setValidationStatus("invalid")
        return
      }
    }

    // Standard EPA validation
    if (type === "water" && measurements?.pH && (measurements.pH < 0 || measurements.pH > 14)) {
      setValidationStatus("invalid")
      return
    }

    setValidationStatus("valid")
  }

  useEffect(() => {
    validateSample()
  }, [currentSample, gpsLocation])

  // Save sample with DePue-specific metadata
  const saveSample = () => {
    if (validationStatus !== "valid" || !currentProject || !gpsLocation) return

    // Find nearest sampling location for DePue project
    let nearestLocation = null
    if (currentProject.samplingLocations && nearbyLocations.length > 0) {
      nearestLocation = nearbyLocations[0]
    }

    const newSample: FieldSample = {
      id: `${currentProject.id}_${Date.now()}`,
      type: currentSample.type as any,
      location: gpsLocation,
      depth: currentSample.depth,
      description: currentSample.description || "",
      photos: capturedImages.map((img) => img.id),
      measurements: currentSample.measurements || {},
      notes: currentSample.notes || "",
      timestamp: new Date(),
      technician: "Field Technician", // In real app, get from auth
      status: "pending",
      projectId: currentProject.id,
      sampleLocationId: nearestLocation?.id,
    }

    // Add to current project
    currentProject.samples.push(newSample)

    // Reset form
    setCurrentSample({})
    setCapturedImages([])
    setVoiceNotes([])

    // Simulate sync
    setSyncProgress(0)
    const syncInterval = setInterval(() => {
      setSyncProgress((prev) => {
        if (prev >= 100) {
          clearInterval(syncInterval)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  // Generate EPA-compliant KMZ report
  const generateKMZReport = () => {
    if (!currentProject) return

    const kmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>${currentProject.name}</name>
    <description>A3E Environmental Field Assessment Report - EPA Region 5 Compliant</description>
    <Style id="samplePoint">
      <IconStyle>
        <Icon>
          <href>http://maps.google.com/mapfiles/kml/pushpin/ylw-pushpin.png</href>
        </Icon>
      </IconStyle>
    </Style>
    ${currentProject.samples
      .map(
        (sample) => `
    <Placemark>
      <name>Sample ${sample.id}</name>
      <description><![CDATA[
        <b>EPA Region 5 Sample Data</b><br/>
        <b>Project:</b> ${currentProject.name}<br/>
        <b>RFP:</b> 68HE0525R0028<br/>
        <b>Sample ID:</b> ${sample.id}<br/>
        <b>Type:</b> ${sample.type}<br/>
        <b>Depth:</b> ${sample.depth || "Surface"}<br/>
        <b>Description:</b> ${sample.description}<br/>
        <b>Technician:</b> ${sample.technician}<br/>
        <b>Timestamp:</b> ${sample.timestamp.toISOString()}<br/>
        <b>GPS Accuracy:</b> ±${sample.location.accuracy.toFixed(1)}m<br/>
        ${sample.sampleLocationId ? `<b>Planned Location:</b> ${sample.sampleLocationId}<br/>` : ""}
        <b>Measurements:</b><br/>
        ${Object.entries(sample.measurements)
          .map(([key, value]) => `&nbsp;&nbsp;${key}: ${value}`)
          .join("<br/>")}
      ]]></description>
      <styleUrl>#samplePoint</styleUrl>
      <Point>
        <coordinates>${sample.location.longitude},${sample.location.latitude},0</coordinates>
      </Point>
    </Placemark>`,
      )
      .join("")}
  </Document>
</kml>`

    const blob = new Blob([kmlContent], { type: "application/vnd.google-earth.kml+xml" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${currentProject.id}_EPA_field_report.kml`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Handle image capture callback
  const handleImageCaptured = (image: any) => {
    setCapturedImages((prev) => [...prev, image])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-800 p-4">
      {/* Enhanced Status Bar for DePue Project */}
      <div className="mb-4">
        <Card className="bg-black/40 backdrop-blur-xl border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Smartphone className="w-4 h-4 text-blue-400" />
                  <span className="text-white text-sm font-medium">A3E Field Interface</span>
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">EPA Region 5 Ready</Badge>
                {currentProject?.id === "epa-depue-2025-001" && (
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">DePue Site Active</Badge>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  {isOnline ? (
                    <Wifi className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <WifiOff className="w-4 h-4 text-red-400" />
                  )}
                  <span className="text-white text-xs">{isOnline ? "Online" : "Offline"}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Signal className="w-4 h-4 text-blue-400" />
                  <div className="flex space-x-0.5">
                    {[1, 2, 3, 4].map((bar) => (
                      <div
                        key={bar}
                        className={`w-1 h-3 ${bar <= signalStrength ? "bg-blue-400" : "bg-white/20"} rounded-sm`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Battery className="w-4 h-4 text-emerald-400" />
                  <span className="text-white text-xs">{Math.round(batteryLevel)}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sampling" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-black/20 backdrop-blur-xl mb-6">
          <TabsTrigger value="sampling" className="text-white">
            Sampling
          </TabsTrigger>
          <TabsTrigger value="projects" className="text-white">
            Projects
          </TabsTrigger>
          <TabsTrigger value="data" className="text-white">
            Data Review
          </TabsTrigger>
          <TabsTrigger value="reports" className="text-white">
            Reports
          </TabsTrigger>
          <TabsTrigger value="timeline" className="text-white">
            Timeline
          </TabsTrigger>
        </TabsList>

        {/* Enhanced Sampling Interface for DePue */}
        <TabsContent value="sampling" className="space-y-6">
          {/* GPS Status with Nearby Locations */}
          <Card className="bg-black/20 backdrop-blur-xl border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-emerald-400" />
                <span>GPS Location & Nearby Sampling Points</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {gpsLocation ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-white/60 text-sm">Current Position</div>
                      <div className="text-white font-mono">
                        {gpsLocation.latitude.toFixed(6)}°N, {gpsLocation.longitude.toFixed(6)}°W
                      </div>
                      <div className="text-emerald-400 text-sm">±{gpsLocation.accuracy.toFixed(1)}m accuracy</div>
                    </div>
                    <div>
                      <div className="text-white/60 text-sm">Timestamp</div>
                      <div className="text-white">{gpsLocation.timestamp.toLocaleTimeString()}</div>
                      <div className="text-blue-400 text-sm">{gpsLocation.timestamp.toLocaleDateString()}</div>
                    </div>
                  </div>

                  {/* Nearby Sampling Locations */}
                  {nearbyLocations.length > 0 && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-lg border border-emerald-500/30">
                      <h4 className="text-white font-semibold mb-3 flex items-center space-x-2">
                        <Target className="w-4 h-4" />
                        <span>Nearby Planned Sampling Locations</span>
                      </h4>
                      <div className="space-y-2">
                        {nearbyLocations.map((location) => (
                          <div key={location.id} className="flex items-center justify-between p-2 bg-white/10 rounded">
                            <div>
                              <div className="text-white font-medium">{location.id}</div>
                              <div className="text-white/70 text-sm">{location.description}</div>
                            </div>
                            <div className="text-right">
                              <Badge
                                className={`${
                                  location.priority === "High"
                                    ? "bg-red-500/20 text-red-300 border-red-500/30"
                                    : "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                                }`}
                              >
                                {location.priority}
                              </Badge>
                              <div className="text-white/60 text-xs mt-1">
                                {calculateDistance(
                                  gpsLocation.latitude,
                                  gpsLocation.longitude,
                                  location.coordinates.lat,
                                  location.coordinates.lng,
                                ).toFixed(0)}
                                m away
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <Navigation className="w-8 h-8 text-white/40 mx-auto mb-2 animate-spin" />
                  <p className="text-white/60">Acquiring GPS signal...</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Enhanced Image Capture Component */}
          <EnhancedImageCapture
            onImageCaptured={handleImageCaptured}
            currentGPS={
              gpsLocation
                ? {
                    lat: gpsLocation.latitude,
                    lng: gpsLocation.longitude,
                    accuracy: gpsLocation.accuracy,
                  }
                : undefined
            }
            sampleId={currentSample.id}
          />

          {/* Enhanced Sample Collection Form */}
          <Card className="bg-black/20 backdrop-blur-xl border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-blue-400" />
                  <span>EPA Region 5 Sample Collection</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge
                    className={`${
                      validationStatus === "valid"
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                        : validationStatus === "invalid"
                          ? "bg-red-500/20 text-red-300 border-red-500/30"
                          : "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                    }`}
                  >
                    {validationStatus === "valid"
                      ? "EPA Valid"
                      : validationStatus === "invalid"
                        ? "Invalid"
                        : "Pending"}
                  </Badge>
                  {currentProject?.id === "epa-depue-2025-001" && (
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">DePue Protocol</Badge>
                  )}
                </div>
              </CardTitle>
              <CardDescription className="text-white/70">
                EPA-compliant field data collection with real-time validation for DePue site assessment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Sample Type with DePue-specific options */}
              <div>
                <label className="text-white text-sm font-medium mb-2 block">Sample Type</label>
                <Select
                  value={currentSample.type}
                  onValueChange={(value) => setCurrentSample({ ...currentSample, type: value as any })}
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select sample type for DePue site" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="soil">Soil Sample (Heavy Metals Analysis)</SelectItem>
                    <SelectItem value="water">Groundwater Sample (VOCs + Metals)</SelectItem>
                    <SelectItem value="air">Air Sample (VOCs Monitoring)</SelectItem>
                    <SelectItem value="sediment">Sediment Sample (Illinois River)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sample Location ID for DePue */}
              {nearbyLocations.length > 0 && (
                <div>
                  <label className="text-white text-sm font-medium mb-2 block">Planned Sample Location</label>
                  <Select
                    value={currentSample.sampleLocationId}
                    onValueChange={(value) => setCurrentSample({ ...currentSample, sampleLocationId: value })}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Select planned location (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {nearbyLocations.map((location) => (
                        <SelectItem key={location.id} value={location.id}>
                          {location.id} - {location.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Sample Depth */}
              <div>
                <label className="text-white text-sm font-medium mb-2 block">Depth (if applicable)</label>
                <Input
                  value={currentSample.depth || ""}
                  onChange={(e) => setCurrentSample({ ...currentSample, depth: e.target.value })}
                  placeholder="e.g., 0-2 ft, Surface, 5-7 ft (DePue protocol)"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-white text-sm font-medium mb-2 block">Description</label>
                <Textarea
                  value={currentSample.description || ""}
                  onChange={(e) => setCurrentSample({ ...currentSample, description: e.target.value })}
                  placeholder="Describe sample location, visual observations, weather conditions, etc."
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  rows={3}
                />
              </div>

              {/* Enhanced Field Measurements for DePue */}
              <div>
                <label className="text-white text-sm font-medium mb-3 block">Field Measurements (EPA Required)</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/70 text-xs mb-1 block">Temperature (°C) *</label>
                    <div className="relative">
                      <Thermometer className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-400" />
                      <Input
                        type="number"
                        value={currentSample.measurements?.temperature || ""}
                        onChange={(e) =>
                          setCurrentSample({
                            ...currentSample,
                            measurements: {
                              ...currentSample.measurements,
                              temperature: Number.parseFloat(e.target.value),
                            },
                          })
                        }
                        placeholder="20.5"
                        className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-white/70 text-xs mb-1 block">pH (Water samples) *</label>
                    <div className="relative">
                      <Droplets className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-400" />
                      <Input
                        type="number"
                        step="0.1"
                        value={currentSample.measurements?.pH || ""}
                        onChange={(e) =>
                          setCurrentSample({
                            ...currentSample,
                            measurements: {
                              ...currentSample.measurements,
                              pH: Number.parseFloat(e.target.value),
                            },
                          })
                        }
                        placeholder="7.0"
                        className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-white/70 text-xs mb-1 block">Conductivity (μS/cm)</label>
                    <div className="relative">
                      <Zap className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-yellow-400" />
                      <Input
                        type="number"
                        value={currentSample.measurements?.conductivity || ""}
                        onChange={(e) =>
                          setCurrentSample({
                            ...currentSample,
                            measurements: {
                              ...currentSample.measurements,
                              conductivity: Number.parseFloat(e.target.value),
                            },
                          })
                        }
                        placeholder="500"
                        className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-white/70 text-xs mb-1 block">Dissolved O₂ (mg/L)</label>
                    <div className="relative">
                      <Wind className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-cyan-400" />
                      <Input
                        type="number"
                        step="0.1"
                        value={currentSample.measurements?.dissolvedOxygen || ""}
                        onChange={(e) =>
                          setCurrentSample({
                            ...currentSample,
                            measurements: {
                              ...currentSample.measurements,
                              dissolvedOxygen: Number.parseFloat(e.target.value),
                            },
                          })
                        }
                        placeholder="8.5"
                        className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>
                  </div>
                </div>
                {currentProject?.id === "epa-depue-2025-001" && (
                  <div className="mt-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-300 text-sm font-medium">DePue Site Requirements</span>
                    </div>
                    <div className="text-white/80 text-xs space-y-1">
                      <div>• Temperature required for all soil samples</div>
                      <div>• pH measurement mandatory for groundwater samples</div>
                      <div>• Air samples require wind direction in description</div>
                      <div>• Heavy metals analysis requires chain of custody</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Voice Notes */}
              <div>
                <label className="text-white text-sm font-medium mb-3 block">Voice Notes</label>
                <div className="flex space-x-3 mb-3">
                  <Button
                    onClick={toggleVoiceRecording}
                    className={`${
                      isRecording ? "bg-red-600 hover:bg-red-700" : "bg-emerald-600 hover:bg-emerald-700"
                    } text-white`}
                  >
                    {isRecording ? (
                      <>
                        <MicOff className="w-4 h-4 mr-2" />
                        Stop Recording
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4 mr-2" />
                        Start Recording
                      </>
                    )}
                  </Button>
                </div>
                {voiceNotes.length > 0 && (
                  <div className="space-y-2">
                    {voiceNotes.map((note, index) => (
                      <div key={index} className="p-2 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-center space-x-2">
                          <Activity className="w-4 h-4 text-emerald-400" />
                          <span className="text-white text-sm">{note}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Additional Notes */}
              <div>
                <label className="text-white text-sm font-medium mb-2 block">Additional Notes</label>
                <Textarea
                  value={currentSample.notes || ""}
                  onChange={(e) => setCurrentSample({ ...currentSample, notes: e.target.value })}
                  placeholder="Weather conditions, site observations, safety notes, etc."
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  rows={3}
                />
              </div>

              {/* Save Button */}
              <Button
                onClick={saveSample}
                disabled={validationStatus !== "valid"}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                Save EPA Sample
              </Button>

              {/* Sync Progress */}
              {syncProgress > 0 && syncProgress < 100 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Syncing to EPA cloud...</span>
                    <span className="text-white">{syncProgress}%</span>
                  </div>
                  <Progress value={syncProgress} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-6">
          <Card className="bg-black/20 backdrop-blur-xl border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Active Projects</CardTitle>
              <CardDescription className="text-white/70">
                Select a project to begin field data collection
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {projects.map((project) => (
                <Card
                  key={project.id}
                  className={`cursor-pointer transition-all duration-300 ${
                    currentProject?.id === project.id
                      ? "bg-emerald-500/20 border-emerald-500/30"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                  onClick={() => setCurrentProject(project)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-semibold">{project.name}</h3>
                      <div className="flex items-center space-x-2">
                        <Badge
                          className={`${
                            project.status === "active"
                              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                              : "bg-gray-500/20 text-gray-300 border-gray-500/30"
                          }`}
                        >
                          {project.status}
                        </Badge>
                        {project.id === "epa-depue-2025-001" && (
                          <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">EPA Region 5</Badge>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-white/60">Type</div>
                        <div className="text-white">{project.type}</div>
                      </div>
                      <div>
                        <div className="text-white/60">Client</div>
                        <div className="text-white">{project.client}</div>
                      </div>
                      <div>
                        <div className="text-white/60">Location</div>
                        <div className="text-white">{project.location}</div>
                      </div>
                      <div>
                        <div className="text-white/60">Samples</div>
                        <div className="text-white">{project.samples.length}</div>
                      </div>
                    </div>
                    {project.samplingLocations && (
                      <div className="mt-3 p-2 bg-white/5 rounded">
                        <div className="text-white/60 text-xs">Planned Locations</div>
                        <div className="text-emerald-400 font-semibold">
                          {project.samplingLocations.length} GPS points
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Review Tab */}
        <TabsContent value="data" className="space-y-6">
          <Card className="bg-black/20 backdrop-blur-xl border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Collected Samples</CardTitle>
              <CardDescription className="text-white/70">
                Review and validate field data before EPA submission
              </CardDescription>
            </CardHeader>
            <CardContent>
              {currentProject?.samples.length ? (
                <div className="space-y-4">
                  {currentProject.samples.map((sample) => (
                    <Card key={sample.id} className="bg-white/5 border-white/10">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">{sample.type}</Badge>
                            <span className="text-white font-medium">{sample.id}</span>
                            {sample.sampleLocationId && (
                              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                                {sample.sampleLocationId}
                              </Badge>
                            )}
                          </div>
                          <Badge
                            className={`${
                              sample.status === "validated"
                                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                                : sample.status === "uploaded"
                                  ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                                  : "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                            }`}
                          >
                            {sample.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-white/60">Location</div>
                            <div className="text-white font-mono">
                              {sample.location.latitude.toFixed(6)}, {sample.location.longitude.toFixed(6)}
                            </div>
                            <div className="text-emerald-400 text-xs">±{sample.location.accuracy.toFixed(1)}m</div>
                          </div>
                          <div>
                            <div className="text-white/60">Timestamp</div>
                            <div className="text-white">{sample.timestamp.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-white/60">Depth</div>
                            <div className="text-white">{sample.depth || "Surface"}</div>
                          </div>
                          <div>
                            <div className="text-white/60">Photos</div>
                            <div className="text-white">{sample.photos.length}</div>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="text-white/60 text-sm">Description</div>
                          <div className="text-white">{sample.description}</div>
                        </div>
                        {Object.keys(sample.measurements).length > 0 && (
                          <div className="mt-3">
                            <div className="text-white/60 text-sm mb-2">Measurements</div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              {Object.entries(sample.measurements).map(([key, value]) => (
                                <div key={key} className="flex justify-between">
                                  <span className="text-white/70 capitalize">{key}:</span>
                                  <span className="text-white">{value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Eye className="w-12 h-12 text-white/30 mx-auto mb-4" />
                  <p className="text-white/60">No samples collected yet</p>
                  <p className="text-white/40 text-sm">Start collecting samples in the Sampling tab</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <Card className="bg-black/20 backdrop-blur-xl border-white/20">
            <CardHeader>
              <CardTitle className="text-white">EPA Region 5 Reports</CardTitle>
              <CardDescription className="text-white/70">
                Generate EPA-compliant reports and federal submissions for DePue site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <Button
                  onClick={generateKMZReport}
                  className="bg-blue-600 hover:bg-blue-700 text-white h-20 flex-col"
                  disabled={!currentProject?.samples.length}
                >
                  <Download className="w-6 h-6 mb-2" />
                  <div>
                    <div className="font-semibold">EPA KMZ Report</div>
                    <div className="text-xs opacity-80">GPS-tagged field data</div>
                  </div>
                </Button>

                <Button
                  className="bg-emerald-600 hover:bg-emerald-700 text-white h-20 flex-col"
                  disabled={!currentProject?.samples.length}
                >
                  <FileText className="w-6 h-6 mb-2" />
                  <div>
                    <div className="font-semibold">Federal Submission</div>
                    <div className="text-xs opacity-80">RFP 68HE0525R0028 format</div>
                  </div>
                </Button>

                <Button
                  className="bg-purple-600 hover:bg-purple-700 text-white h-20 flex-col"
                  disabled={!currentProject?.samples.length}
                >
                  <Layers className="w-6 h-6 mb-2" />
                  <div>
                    <div className="font-semibold">Chain of Custody</div>
                    <div className="text-xs opacity-80">EPA sample tracking</div>
                  </div>
                </Button>

                <Button
                  className="bg-amber-600 hover:bg-amber-700 text-white h-20 flex-col"
                  disabled={!currentProject?.samples.length}
                >
                  <Shield className="w-6 h-6 mb-2" />
                  <div>
                    <div className="font-semibold">QA/QC Report</div>
                    <div className="text-xs opacity-80">Quality assurance summary</div>
                  </div>
                </Button>
              </div>

              {/* Enhanced Project Summary for DePue */}
              {currentProject && (
                <div className="p-4 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-lg border border-emerald-500/20">
                  <h3 className="text-white font-semibold mb-3">
                    {currentProject.id === "epa-depue-2025-001" ? "DePue Site Summary" : "Project Summary"}
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-white/60">Total Samples</div>
                      <div className="text-white font-bold text-lg">{currentProject.samples.length}</div>
                    </div>
                    <div>
                      <div className="text-white/60">Photos Captured</div>
                      <div className="text-white font-bold text-lg">{capturedImages.length}</div>
                    </div>
                    <div>
                      <div className="text-white/60">GPS Accuracy</div>
                      <div className="text-white font-bold text-lg">±{gpsLocation?.accuracy.toFixed(1) || "0"}m</div>
                    </div>
                    <div>
                      <div className="text-white/60">Compliance Status</div>
                      <div className="text-emerald-400 font-bold text-lg">EPA Ready</div>
                    </div>
                  </div>
                  {currentProject.id === "epa-depue-2025-001" && (
                    <div className="mt-4 p-3 bg-blue-500/10 rounded border border-blue-500/20">
                      <div className="text-blue-300 font-medium text-sm mb-2">DePue Site Specific</div>
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <div className="text-white/60">RFP Number</div>
                          <div className="text-white font-mono">68HE0525R0028</div>
                        </div>
                        <div>
                          <div className="text-white/60">Submission Due</div>
                          <div className="text-red-300 font-semibold">July 14, 2025</div>
                        </div>
                        <div>
                          <div className="text-white/60">Planned Locations</div>
                          <div className="text-white">{currentProject.samplingLocations?.length || 0} GPS points</div>
                        </div>
                        <div>
                          <div className="text-white/60">Target Contaminants</div>
                          <div className="text-white">Heavy Metals, VOCs, PCBs</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-6">
          <SubmissionTimeline projectId={currentProject?.id} rfpNumber="68HE0525R0028" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
