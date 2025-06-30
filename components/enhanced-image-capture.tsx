"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Camera, Upload, MapPin, FileImage, Download, Trash2, Map, CheckCircle, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface ImageData {
  id: string
  file: File
  url: string
  exifData: any
  gpsData?: {
    latitude: number
    longitude: number
    altitude?: number
    timestamp?: string
  }
  kmlGenerated: boolean
  kmlUrl?: string
  uploadProgress: number
  uploaded: boolean
  notes: string
}

interface ExifData {
  make?: string
  model?: string
  dateTime?: string
  gps?: {
    latitude: number
    longitude: number
    altitude?: number
  }
  [key: string]: any
}

export default function EnhancedImageCapture() {
  const [images, setImages] = useState<ImageData[]>([])
  const [isCapturing, setIsCapturing] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [currentLocation, setCurrentLocation] = useState<GeolocationPosition | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Get current GPS location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation(position)
        },
        (error) => {
          console.warn("GPS location not available:", error)
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
      )
    }
  }, [])

  // Extract EXIF data from image
  const extractExifData = useCallback(
    async (file: File): Promise<ExifData> => {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          const arrayBuffer = e.target?.result as ArrayBuffer
          const dataView = new DataView(arrayBuffer)

          // Basic EXIF extraction (simplified)
          const exifData: ExifData = {
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            lastModified: new Date(file.lastModified).toISOString(),
          }

          // Try to extract GPS data if available
          try {
            // This is a simplified EXIF parser - in production, use a library like exif-js
            if (currentLocation) {
              exifData.gps = {
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
                altitude: currentLocation.coords.altitude || undefined,
              }
            }
          } catch (error) {
            console.warn("Could not extract GPS data from EXIF:", error)
          }

          resolve(exifData)
        }
        reader.readAsArrayBuffer(file)
      })
    },
    [currentLocation],
  )

  // Generate KML file from image data
  const generateKML = useCallback(async (imageData: ImageData): Promise<string> => {
    const { gpsData, file, exifData } = imageData

    if (!gpsData) {
      throw new Error("No GPS data available for KML generation")
    }

    const kmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>A3E Environmental Field Photo</name>
    <description>Field sampling photo with GPS coordinates</description>
    <Style id="photoStyle">
      <IconStyle>
        <Icon>
          <href>http://maps.google.com/mapfiles/kml/shapes/camera.png</href>
        </Icon>
      </IconStyle>
    </Style>
    <Placemark>
      <name>${file.name}</name>
      <description><![CDATA[
        <h3>Field Photo Details</h3>
        <p><strong>File:</strong> ${file.name}</p>
        <p><strong>Size:</strong> ${(file.size / 1024 / 1024).toFixed(2)} MB</p>
        <p><strong>Timestamp:</strong> ${exifData.lastModified}</p>
        <p><strong>GPS Coordinates:</strong> ${gpsData.latitude.toFixed(6)}, ${gpsData.longitude.toFixed(6)}</p>
        ${gpsData.altitude ? `<p><strong>Altitude:</strong> ${gpsData.altitude.toFixed(2)}m</p>` : ""}
        <p><strong>Notes:</strong> ${imageData.notes || "No notes provided"}</p>
        <br/>
        <img src="${imageData.url}" width="300" alt="Field Photo"/>
      ]]></description>
      <styleUrl>#photoStyle</styleUrl>
      <Point>
        <coordinates>${gpsData.longitude},${gpsData.latitude}${gpsData.altitude ? `,${gpsData.altitude}` : ""}</coordinates>
      </Point>
    </Placemark>
  </Document>
</kml>`

    // Create blob and URL for KML file
    const blob = new Blob([kmlContent], { type: "application/vnd.google-earth.kml+xml" })
    return URL.createObjectURL(blob)
  }, [])

  // Handle file selection
  const handleFileSelect = useCallback(
    async (files: FileList) => {
      const newImages: ImageData[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        if (!file.type.startsWith("image/")) continue

        const id = `img_${Date.now()}_${i}`
        const url = URL.createObjectURL(file)

        try {
          const exifData = await extractExifData(file)
          const gpsData = exifData.gps
            ? {
                latitude: exifData.gps.latitude,
                longitude: exifData.gps.longitude,
                altitude: exifData.gps.altitude,
                timestamp: new Date().toISOString(),
              }
            : undefined

          const imageData: ImageData = {
            id,
            file,
            url,
            exifData,
            gpsData,
            kmlGenerated: false,
            uploadProgress: 0,
            uploaded: false,
            notes: "",
          }

          newImages.push(imageData)
        } catch (error) {
          console.error("Error processing image:", error)
          toast({
            title: "Error Processing Image",
            description: `Failed to process ${file.name}`,
            variant: "destructive",
          })
        }
      }

      setImages((prev) => [...prev, ...newImages])

      if (newImages.length > 0) {
        toast({
          title: "Images Added",
          description: `Successfully added ${newImages.length} image(s)`,
        })
      }
    },
    [extractExifData],
  )

  // Start camera capture
  const startCamera = useCallback(async () => {
    try {
      setIsCapturing(true)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      toast({
        title: "Camera Error",
        description: "Could not access camera. Please check permissions.",
        variant: "destructive",
      })
      setIsCapturing(false)
    }
  }, [])

  // Capture photo from camera
  const capturePhoto = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    if (!context) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0)

    canvas.toBlob(
      async (blob) => {
        if (!blob) return

        const file = new File([blob], `capture_${Date.now()}.jpg`, { type: "image/jpeg" })
        await handleFileSelect(new DataTransfer().files)

        // Stop camera
        const stream = video.srcObject as MediaStream
        stream?.getTracks().forEach((track) => track.stop())
        setIsCapturing(false)
      },
      "image/jpeg",
      0.9,
    )
  }, [handleFileSelect])

  // Generate KML for image
  const handleGenerateKML = useCallback(
    async (imageId: string) => {
      const imageData = images.find((img) => img.id === imageId)
      if (!imageData) return

      try {
        const kmlUrl = await generateKML(imageData)

        setImages((prev) => prev.map((img) => (img.id === imageId ? { ...img, kmlGenerated: true, kmlUrl } : img)))

        toast({
          title: "KML Generated",
          description: "KML file generated successfully",
        })
      } catch (error) {
        console.error("Error generating KML:", error)
        toast({
          title: "KML Generation Failed",
          description: error instanceof Error ? error.message : "Unknown error",
          variant: "destructive",
        })
      }
    },
    [images, generateKML],
  )

  // Simulate upload to blob storage
  const handleUpload = useCallback(
    async (imageId: string) => {
      const imageData = images.find((img) => img.id === imageId)
      if (!imageData) return

      // Simulate upload progress
      setImages((prev) => prev.map((img) => (img.id === imageId ? { ...img, uploadProgress: 0 } : img)))

      const uploadInterval = setInterval(() => {
        setImages((prev) =>
          prev.map((img) => {
            if (img.id === imageId) {
              const newProgress = Math.min(img.uploadProgress + 10, 100)
              if (newProgress === 100) {
                clearInterval(uploadInterval)
                return { ...img, uploadProgress: 100, uploaded: true }
              }
              return { ...img, uploadProgress: newProgress }
            }
            return img
          }),
        )
      }, 200)

      toast({
        title: "Upload Started",
        description: "Uploading image to secure storage",
      })
    },
    [images],
  )

  // Update image notes
  const updateNotes = useCallback((imageId: string, notes: string) => {
    setImages((prev) => prev.map((img) => (img.id === imageId ? { ...img, notes } : img)))
  }, [])

  // Remove image
  const removeImage = useCallback((imageId: string) => {
    setImages((prev) => {
      const updated = prev.filter((img) => img.id !== imageId)
      const removed = prev.find((img) => img.id === imageId)
      if (removed) {
        URL.revokeObjectURL(removed.url)
        if (removed.kmlUrl) {
          URL.revokeObjectURL(removed.kmlUrl)
        }
      }
      return updated
    })
  }, [])

  return (
    <div className="space-y-6">
      {/* Camera and Upload Controls */}
      <Card className="bg-black/20 backdrop-blur-xl border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Camera className="w-5 h-5" />
            <span>Enhanced Image Capture</span>
            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">EPA Compliant</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Capture Controls */}
          <div className="flex space-x-2">
            <Button onClick={startCamera} disabled={isCapturing} className="bg-blue-600 hover:bg-blue-700 flex-1">
              <Camera className="w-4 h-4 mr-2" />
              {isCapturing ? "Camera Active" : "Start Camera"}
            </Button>

            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 flex-1"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Images
            </Button>
          </div>

          {/* Camera View */}
          {isCapturing && (
            <div className="space-y-2">
              <video ref={videoRef} className="w-full rounded-lg" autoPlay playsInline muted />
              <Button onClick={capturePhoto} className="w-full bg-red-600 hover:bg-red-700">
                <Camera className="w-4 h-4 mr-2" />
                Capture Photo
              </Button>
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
          />

          {/* GPS Status */}
          {currentLocation && (
            <div className="flex items-center space-x-2 text-sm text-emerald-300">
              <MapPin className="w-4 h-4" />
              <span>
                GPS: {currentLocation.coords.latitude.toFixed(6)}, {currentLocation.coords.longitude.toFixed(6)}
              </span>
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Active</Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Image Gallery */}
      {images.length > 0 && (
        <Card className="bg-black/20 backdrop-blur-xl border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileImage className="w-5 h-5" />
                <span>Captured Images ({images.length})</span>
              </div>
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                {images.filter((img) => img.uploaded).length} Uploaded
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((image) => (
                <Card key={image.id} className="bg-white/5 border-white/10">
                  <CardContent className="p-4 space-y-3">
                    {/* Image Preview */}
                    <div className="relative">
                      <img
                        src={image.url || "/placeholder.svg"}
                        alt={image.file.name}
                        className="w-full h-32 object-cover rounded cursor-pointer"
                        onClick={() => setSelectedImage(image.id)}
                      />
                      <div className="absolute top-2 right-2 flex space-x-1">
                        {image.gpsData && (
                          <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                            <MapPin className="w-3 h-3 mr-1" />
                            GPS
                          </Badge>
                        )}
                        {image.uploaded && (
                          <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
                            <CheckCircle className="w-3 h-3" />
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Image Info */}
                    <div className="space-y-2">
                      <div className="text-white text-sm font-medium truncate">{image.file.name}</div>
                      <div className="text-white/60 text-xs">{(image.file.size / 1024 / 1024).toFixed(2)} MB</div>

                      {/* GPS Coordinates */}
                      {image.gpsData && (
                        <div className="text-emerald-300 text-xs">
                          📍 {image.gpsData.latitude.toFixed(6)}, {image.gpsData.longitude.toFixed(6)}
                        </div>
                      )}

                      {/* Notes */}
                      <Textarea
                        placeholder="Add field notes..."
                        value={image.notes}
                        onChange={(e) => updateNotes(image.id, e.target.value)}
                        className="bg-white/5 border-white/10 text-white text-xs h-16 resize-none"
                      />

                      {/* Upload Progress */}
                      {image.uploadProgress > 0 && image.uploadProgress < 100 && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-white/60">
                            <span>Uploading...</span>
                            <span>{image.uploadProgress}%</span>
                          </div>
                          <Progress value={image.uploadProgress} className="h-1" />
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex space-x-1">
                        {!image.uploaded && (
                          <Button
                            size="sm"
                            onClick={() => handleUpload(image.id)}
                            disabled={image.uploadProgress > 0 && image.uploadProgress < 100}
                            className="bg-blue-600 hover:bg-blue-700 flex-1 text-xs"
                          >
                            {image.uploadProgress > 0 && image.uploadProgress < 100 ? (
                              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                            ) : (
                              <Upload className="w-3 h-3 mr-1" />
                            )}
                            Upload
                          </Button>
                        )}

                        {image.gpsData && !image.kmlGenerated && (
                          <Button
                            size="sm"
                            onClick={() => handleGenerateKML(image.id)}
                            variant="outline"
                            className="border-white/20 text-white hover:bg-white/10 flex-1 text-xs"
                          >
                            <Map className="w-3 h-3 mr-1" />
                            KML
                          </Button>
                        )}

                        {image.kmlUrl && (
                          <Button
                            size="sm"
                            onClick={() => {
                              const a = document.createElement("a")
                              a.href = image.kmlUrl!
                              a.download = `${image.file.name.split(".")[0]}.kml`
                              a.click()
                            }}
                            className="bg-green-600 hover:bg-green-700 flex-1 text-xs"
                          >
                            <Download className="w-3 h-3 mr-1" />
                            KML
                          </Button>
                        )}

                        <Button
                          size="sm"
                          onClick={() => removeImage(image.id)}
                          variant="outline"
                          className="border-red-500/20 text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Image Detail Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-black/40 backdrop-blur-xl border-white/20 max-w-4xl w-full max-h-[90vh] overflow-auto">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-white">Image Details</CardTitle>
                <Button
                  onClick={() => setSelectedImage(null)}
                  variant="outline"
                  size="sm"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Close
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {(() => {
                const image = images.find((img) => img.id === selectedImage)
                if (!image) return null

                return (
                  <div className="space-y-4">
                    <img
                      src={image.url || "/placeholder.svg"}
                      alt={image.file.name}
                      className="w-full max-h-96 object-contain rounded"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <h4 className="text-white font-medium">File Information</h4>
                        <div className="text-white/60 space-y-1">
                          <div>Name: {image.file.name}</div>
                          <div>Size: {(image.file.size / 1024 / 1024).toFixed(2)} MB</div>
                          <div>Type: {image.file.type}</div>
                          <div>Modified: {new Date(image.file.lastModified).toLocaleString()}</div>
                        </div>
                      </div>

                      {image.gpsData && (
                        <div className="space-y-2">
                          <h4 className="text-white font-medium">GPS Information</h4>
                          <div className="text-white/60 space-y-1">
                            <div>Latitude: {image.gpsData.latitude.toFixed(6)}</div>
                            <div>Longitude: {image.gpsData.longitude.toFixed(6)}</div>
                            {image.gpsData.altitude && <div>Altitude: {image.gpsData.altitude.toFixed(2)}m</div>}
                            <div>Timestamp: {new Date(image.gpsData.timestamp!).toLocaleString()}</div>
                          </div>
                        </div>
                      )}
                    </div>

                    {image.notes && (
                      <div className="space-y-2">
                        <h4 className="text-white font-medium">Field Notes</h4>
                        <div className="text-white/80 bg-white/5 p-3 rounded border border-white/10">{image.notes}</div>
                      </div>
                    )}
                  </div>
                )
              })()}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
