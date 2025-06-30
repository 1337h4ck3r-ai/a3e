"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, MapPin, FileText, Users, Calendar, Target, CheckCircle, Clock, Zap, Navigation } from "lucide-react"

interface DePueProject {
  id: string
  name: string
  rfpNumber: string
  client: string
  location: {
    address: string
    coordinates: {
      latitude: number
      longitude: number
    }
    siteArea: string
    accessPoints: string[]
  }
  timeline: {
    startDate: Date
    fieldWorkStart: Date
    fieldWorkEnd: Date
    reportDeadline: Date
    submissionDeadline: Date
  }
  scope: {
    phaseI: boolean
    phaseII: boolean
    soilSampling: boolean
    groundwaterSampling: boolean
    airSampling: boolean
    sedimentSampling: boolean
  }
  samplingPlan: {
    soilLocations: number
    groundwaterWells: number
    airMonitoringPoints: number
    sedimentLocations: number
    totalSamples: number
  }
  regulations: {
    epaRegion: string
    applicableStandards: string[]
    reportingRequirements: string[]
  }
  team: {
    projectManager: string
    fieldTechnicians: string[]
    labAnalyst: string
    qaOfficer: string
  }
  status: "setup" | "approved" | "active" | "fieldwork" | "analysis" | "reporting" | "submitted"
}

export default function DePueProjectSetup() {
  const [project, setProject] = useState<DePueProject>({
    id: "epa-depue-2025-001",
    name: "EPA Region 5 - ESO DePue Site Environmental Assessment",
    rfpNumber: "68HE0525R0028",
    client: "US EPA Region 5",
    location: {
      address: "DePue, Bureau County, Illinois 61322",
      coordinates: {
        latitude: 41.3247,
        longitude: -89.3051,
      },
      siteArea: "Approximately 150 acres - Former zinc smelting facility",
      accessPoints: [
        "Main Gate - Route 6 entrance",
        "North Access - Industrial Road",
        "South Perimeter - Railroad access",
        "Emergency Access - County Road 2600N",
      ],
    },
    timeline: {
      startDate: new Date("2025-01-20"),
      fieldWorkStart: new Date("2025-02-01"),
      fieldWorkEnd: new Date("2025-03-15"),
      reportDeadline: new Date("2025-06-01"),
      submissionDeadline: new Date("2025-07-14"),
    },
    scope: {
      phaseI: true,
      phaseII: true,
      soilSampling: true,
      groundwaterSampling: true,
      airSampling: true,
      sedimentSampling: true,
    },
    samplingPlan: {
      soilLocations: 45,
      groundwaterWells: 12,
      airMonitoringPoints: 8,
      sedimentLocations: 15,
      totalSamples: 180, // Including duplicates and QA/QC samples
    },
    regulations: {
      epaRegion: "Region 5 (Chicago)",
      applicableStandards: [
        "CERCLA Comprehensive Environmental Response",
        "RCRA Resource Conservation and Recovery Act",
        "Illinois Environmental Protection Act",
        "EPA Region 5 Superfund Guidelines",
        "ASTM E1527-21 Phase I ESA Standard",
        "ASTM E1903-11 Phase II ESA Standard",
      ],
      reportingRequirements: [
        "Phase I ESA Report (ASTM E1527-21 compliant)",
        "Phase II ESA Report with sampling results",
        "Risk Assessment and Site Characterization",
        "Remedial Investigation Report",
        "Quality Assurance Project Plan (QAPP)",
        "Health and Safety Plan (HASP)",
        "Community Relations Plan",
      ],
    },
    team: {
      projectManager: "Sarah Chen, P.E., CHMM",
      fieldTechnicians: [
        "Michael Rodriguez, Environmental Technician III",
        "Jennifer Kim, Field Sampling Specialist",
        "David Thompson, Hydrogeologist",
        "Lisa Martinez, Industrial Hygienist",
      ],
      labAnalyst: "Dr. Robert Wilson, Laboratory Director",
      qaOfficer: "Amanda Foster, QA/QC Manager",
    },
    status: "setup",
  })

  const [setupProgress, setSetupProgress] = useState(0)
  const [activeSetupStep, setActiveSetupStep] = useState(0)

  const setupSteps = [
    {
      id: "project-config",
      title: "Project Configuration",
      description: "Basic project setup and EPA compliance verification",
      completed: true,
    },
    {
      id: "sampling-plan",
      title: "Sampling Plan Development",
      description: "Detailed sampling locations and analytical requirements",
      completed: true,
    },
    {
      id: "field-protocols",
      title: "Field Protocols Setup",
      description: "EPA-specific field procedures and safety protocols",
      completed: true,
    },
    {
      id: "team-assignment",
      title: "Team Assignment",
      description: "Certified personnel assignment and role definitions",
      completed: true,
    },
    {
      id: "equipment-config",
      title: "Equipment Configuration",
      description: "Field equipment calibration and mobile interface setup",
      completed: false,
    },
    {
      id: "compliance-check",
      title: "Compliance Verification",
      description: "Final EPA Region 5 compliance and approval",
      completed: false,
    },
  ]

  // Simulate setup progress
  useEffect(() => {
    const completedSteps = setupSteps.filter((step) => step.completed).length
    const progress = (completedSteps / setupSteps.length) * 100
    setSetupProgress(progress)
    setActiveSetupStep(completedSteps)
  }, [])

  const contaminantsOfConcern = [
    {
      category: "Heavy Metals",
      compounds: ["Lead", "Zinc", "Cadmium", "Arsenic", "Mercury"],
      priority: "High",
      epaMethod: "EPA 6010D/6020B",
    },
    {
      category: "Volatile Organic Compounds",
      compounds: ["Benzene", "Toluene", "Xylenes", "TCE", "PCE"],
      priority: "Medium",
      epaMethod: "EPA 8260D",
    },
    {
      category: "Semi-Volatile Organic Compounds",
      compounds: ["PAHs", "Phenols", "Phthalates"],
      priority: "Medium",
      epaMethod: "EPA 8270E",
    },
    {
      category: "PCBs",
      compounds: ["Aroclor 1016", "Aroclor 1221", "Aroclor 1232", "Aroclor 1242", "Aroclor 1248", "Aroclor 1254"],
      priority: "High",
      epaMethod: "EPA 8082A",
    },
  ]

  const samplingLocations = [
    {
      id: "DPU-SW-001",
      type: "Soil/Water",
      description: "Former smelter building foundation area",
      coordinates: { lat: 41.3251, lng: -89.3048 },
      depth: "0-2 ft, 2-4 ft, 4-6 ft",
      priority: "High",
      contaminants: ["Heavy Metals", "PCBs"],
    },
    {
      id: "DPU-SW-002",
      type: "Soil/Water",
      description: "Waste storage area - northeast quadrant",
      coordinates: { lat: 41.3255, lng: -89.3045 },
      depth: "0-2 ft, 2-4 ft, 4-8 ft",
      priority: "High",
      contaminants: ["Heavy Metals", "VOCs"],
    },
    {
      id: "DPU-GW-001",
      type: "Groundwater",
      description: "Upgradient monitoring well",
      coordinates: { lat: 41.324, lng: -89.3055 },
      depth: "15-25 ft",
      priority: "High",
      contaminants: ["Heavy Metals", "VOCs"],
    },
    {
      id: "DPU-GW-002",
      type: "Groundwater",
      description: "Downgradient monitoring well - Illinois River direction",
      coordinates: { lat: 41.326, lng: -89.304 },
      depth: "12-22 ft",
      priority: "High",
      contaminants: ["Heavy Metals", "VOCs"],
    },
    {
      id: "DPU-SED-001",
      type: "Sediment",
      description: "Illinois River sediment - adjacent to site",
      coordinates: { lat: 41.3265, lng: -89.3035 },
      depth: "0-6 inches, 6-12 inches",
      priority: "Medium",
      contaminants: ["Heavy Metals", "PCBs"],
    },
    {
      id: "DPU-AIR-001",
      type: "Air",
      description: "Ambient air monitoring - residential area",
      coordinates: { lat: 41.3245, lng: -89.306 },
      depth: "Surface",
      priority: "Medium",
      contaminants: ["VOCs", "Particulates"],
    },
  ]

  const activateProject = () => {
    setProject({ ...project, status: "active" })
    // In a real implementation, this would sync with the field interface
    console.log("DePue project activated and synced to field interface")
  }

  const deployToField = () => {
    // Simulate deployment to field technicians
    console.log("Deploying DePue project configuration to field teams")
  }

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-white">{project.name}</CardTitle>
                <CardDescription className="text-blue-300 text-lg">
                  RFP {project.rfpNumber} • {project.client}
                </CardDescription>
              </div>
            </div>
            <div className="text-right">
              <Badge
                className={`text-lg px-4 py-2 ${
                  project.status === "active"
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                    : "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                }`}
              >
                {project.status.toUpperCase()}
              </Badge>
              <div className="text-white/70 text-sm mt-2">Due: July 14, 2025</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Setup Progress */}
      <Card className="bg-black/20 backdrop-blur-xl border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Project Setup Progress</CardTitle>
          <CardDescription className="text-white/70">EPA Region 5 compliance configuration status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-white font-semibold">Overall Progress</span>
              <span className="text-emerald-400 font-bold text-lg">{Math.round(setupProgress)}%</span>
            </div>
            <Progress value={setupProgress} className="h-3" />
          </div>

          <div className="grid gap-4">
            {setupSteps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-300 ${
                  step.completed
                    ? "bg-emerald-500/10 border-emerald-500/30"
                    : index === activeSetupStep
                      ? "bg-blue-500/10 border-blue-500/30"
                      : "bg-white/5 border-white/10"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step.completed ? "bg-emerald-500" : index === activeSetupStep ? "bg-blue-500" : "bg-white/20"
                    }`}
                  >
                    {step.completed ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : index === activeSetupStep ? (
                      <Clock className="w-5 h-5 text-white animate-spin" />
                    ) : (
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    )}
                  </div>
                  <div>
                    <div className="text-white font-semibold">{step.title}</div>
                    <div className="text-white/70 text-sm">{step.description}</div>
                  </div>
                </div>
                <Badge
                  className={`${
                    step.completed
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                      : index === activeSetupStep
                        ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                        : "bg-white/10 text-white/60 border-white/20"
                  }`}
                >
                  {step.completed ? "Complete" : index === activeSetupStep ? "In Progress" : "Pending"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-black/20 backdrop-blur-xl">
          <TabsTrigger value="overview" className="text-white">
            Overview
          </TabsTrigger>
          <TabsTrigger value="sampling" className="text-white">
            Sampling Plan
          </TabsTrigger>
          <TabsTrigger value="locations" className="text-white">
            Locations
          </TabsTrigger>
          <TabsTrigger value="team" className="text-white">
            Team
          </TabsTrigger>
          <TabsTrigger value="compliance" className="text-white">
            Compliance
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-black/20 backdrop-blur-xl border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-emerald-400" />
                  <span>Site Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-white/60 text-sm">Location</div>
                  <div className="text-white">{project.location.address}</div>
                </div>
                <div>
                  <div className="text-white/60 text-sm">Coordinates</div>
                  <div className="text-white font-mono">
                    {project.location.coordinates.latitude.toFixed(4)}°N,{" "}
                    {project.location.coordinates.longitude.toFixed(4)}°W
                  </div>
                </div>
                <div>
                  <div className="text-white/60 text-sm">Site Description</div>
                  <div className="text-white">{project.location.siteArea}</div>
                </div>
                <div>
                  <div className="text-white/60 text-sm">Access Points</div>
                  <div className="space-y-1">
                    {project.location.accessPoints.map((point, index) => (
                      <div key={index} className="text-white text-sm">
                        • {point}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/20 backdrop-blur-xl border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  <span>Project Timeline</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-white/60 text-sm">Project Start</div>
                    <div className="text-white">{project.timeline.startDate.toLocaleDateString()}</div>
                  </div>
                  <div>
                    <div className="text-white/60 text-sm">Field Work</div>
                    <div className="text-white">
                      {project.timeline.fieldWorkStart.toLocaleDateString()} -{" "}
                      {project.timeline.fieldWorkEnd.toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-white/60 text-sm">Report Due</div>
                    <div className="text-white">{project.timeline.reportDeadline.toLocaleDateString()}</div>
                  </div>
                  <div>
                    <div className="text-white/60 text-sm">Final Submission</div>
                    <div className="text-emerald-400 font-semibold">
                      {project.timeline.submissionDeadline.toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-lg border border-emerald-500/30">
                  <div className="text-white font-semibold mb-2">Critical Milestones</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/80">Field mobilization</span>
                      <span className="text-emerald-300">Feb 1, 2025</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/80">Sampling completion</span>
                      <span className="text-blue-300">Mar 15, 2025</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/80">Lab results received</span>
                      <span className="text-yellow-300">Apr 30, 2025</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/80">EPA submission</span>
                      <span className="text-red-300 font-semibold">Jul 14, 2025</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-black/20 backdrop-blur-xl border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Target className="w-5 h-5 text-purple-400" />
                <span>Project Scope & Objectives</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-white font-semibold mb-3">Assessment Phases</h4>
                  <div className="space-y-2">
                    {Object.entries(project.scope).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-white/80 capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                        {value ? (
                          <CheckCircle className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-white/20"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-3">Sampling Summary</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-white/5 rounded-lg">
                      <div className="text-2xl font-bold text-emerald-400">{project.samplingPlan.soilLocations}</div>
                      <div className="text-white/70 text-sm">Soil Locations</div>
                    </div>
                    <div className="text-center p-3 bg-white/5 rounded-lg">
                      <div className="text-2xl font-bold text-blue-400">{project.samplingPlan.groundwaterWells}</div>
                      <div className="text-white/70 text-sm">Groundwater Wells</div>
                    </div>
                    <div className="text-center p-3 bg-white/5 rounded-lg">
                      <div className="text-2xl font-bold text-purple-400">
                        {project.samplingPlan.airMonitoringPoints}
                      </div>
                      <div className="text-white/70 text-sm">Air Monitoring</div>
                    </div>
                    <div className="text-center p-3 bg-white/5 rounded-lg">
                      <div className="text-2xl font-bold text-amber-400">{project.samplingPlan.totalSamples}</div>
                      <div className="text-white/70 text-sm">Total Samples</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sampling Plan Tab */}
        <TabsContent value="sampling" className="space-y-6">
          <Card className="bg-black/20 backdrop-blur-xl border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Contaminants of Concern</CardTitle>
              <CardDescription className="text-white/70">
                EPA-specified analytes based on historical site operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {contaminantsOfConcern.map((category, index) => (
                  <Card key={index} className="bg-white/5 border-white/10">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-white font-semibold">{category.category}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge
                            className={`${
                              category.priority === "High"
                                ? "bg-red-500/20 text-red-300 border-red-500/30"
                                : "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                            }`}
                          >
                            {category.priority} Priority
                          </Badge>
                          <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 font-mono text-xs">
                            {category.epaMethod}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {category.compounds.map((compound, compoundIndex) => (
                          <Badge key={compoundIndex} className="bg-white/10 text-white/80 border-white/20 text-xs">
                            {compound}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Locations Tab */}
        <TabsContent value="locations" className="space-y-6">
          <Card className="bg-black/20 backdrop-blur-xl border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Sampling Locations</CardTitle>
              <CardDescription className="text-white/70">
                GPS-coordinated sampling points with field interface integration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {samplingLocations.map((location, index) => (
                  <Card key={index} className="bg-white/5 border-white/10">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 font-mono">
                            {location.id}
                          </Badge>
                          <h4 className="text-white font-semibold">{location.description}</h4>
                        </div>
                        <Badge
                          className={`${
                            location.priority === "High"
                              ? "bg-red-500/20 text-red-300 border-red-500/30"
                              : "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                          }`}
                        >
                          {location.priority}
                        </Badge>
                      </div>
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-white/60">Type</div>
                          <div className="text-white">{location.type}</div>
                        </div>
                        <div>
                          <div className="text-white/60">Coordinates</div>
                          <div className="text-white font-mono">
                            {location.coordinates.lat.toFixed(4)}, {location.coordinates.lng.toFixed(4)}
                          </div>
                        </div>
                        <div>
                          <div className="text-white/60">Depth</div>
                          <div className="text-white">{location.depth}</div>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="text-white/60 text-sm">Target Contaminants</div>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {location.contaminants.map((contaminant, contIndex) => (
                            <Badge
                              key={contIndex}
                              className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs"
                            >
                              {contaminant}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team" className="space-y-6">
          <Card className="bg-black/20 backdrop-blur-xl border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Users className="w-5 h-5 text-emerald-400" />
                <span>Project Team</span>
              </CardTitle>
              <CardDescription className="text-white/70">
                Certified professionals assigned to DePue site assessment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-white font-semibold mb-4">Leadership Team</h4>
                  <div className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="text-white font-semibold">Project Manager</div>
                      <div className="text-emerald-300">{project.team.projectManager}</div>
                      <div className="text-white/60 text-sm mt-1">
                        Professional Engineer, Certified Hazardous Materials Manager
                      </div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="text-white font-semibold">QA/QC Officer</div>
                      <div className="text-blue-300">{project.team.qaOfficer}</div>
                      <div className="text-white/60 text-sm mt-1">Quality Assurance and EPA Compliance</div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="text-white font-semibold">Laboratory Director</div>
                      <div className="text-purple-300">{project.team.labAnalyst}</div>
                      <div className="text-white/60 text-sm mt-1">Ph.D. Environmental Chemistry, EPA Certified</div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-4">Field Team</h4>
                  <div className="space-y-3">
                    {project.team.fieldTechnicians.map((technician, index) => (
                      <div key={index} className="p-3 bg-white/5 rounded-lg border border-white/10">
                        <div className="text-white font-medium">{technician}</div>
                        <div className="text-white/60 text-sm">
                          {index === 0 && "Lead Field Technician, 40-Hour HAZWOPER"}
                          {index === 1 && "Sampling Specialist, EPA Certified"}
                          {index === 2 && "Licensed Hydrogeologist"}
                          {index === 3 && "Certified Industrial Hygienist"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-lg border border-emerald-500/30">
                <h4 className="text-white font-semibold mb-3">Team Certifications</h4>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-emerald-300 font-medium">Safety Certifications</div>
                    <div className="text-white/80">
                      • 40-Hour HAZWOPER Training
                      <br />• 8-Hour HAZWOPER Refresher
                      <br />• First Aid/CPR Certified
                    </div>
                  </div>
                  <div>
                    <div className="text-blue-300 font-medium">Technical Certifications</div>
                    <div className="text-white/80">
                      • EPA Sampling Protocols
                      <br />• ASTM E1527/E1903 Certified
                      <br />• Professional Engineer (PE)
                    </div>
                  </div>
                  <div>
                    <div className="text-purple-300 font-medium">Quality Assurance</div>
                    <div className="text-white/80">
                      • EPA QA/QC Protocols
                      <br />• Chain of Custody Certified
                      <br />• Laboratory QA Manager
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-6">
          <Card className="bg-black/20 backdrop-blur-xl border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Shield className="w-5 h-5 text-emerald-400" />
                <span>EPA Region 5 Compliance</span>
              </CardTitle>
              <CardDescription className="text-white/70">
                Federal regulations and reporting requirements verification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-white font-semibold mb-4">Applicable Regulations</h4>
                <div className="grid gap-3">
                  {project.regulations.applicableStandards.map((standard, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <span className="text-white">{standard}</span>
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-4">Required Deliverables</h4>
                <div className="grid gap-3">
                  {project.regulations.reportingRequirements.map((requirement, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <span className="text-white">{requirement}</span>
                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Required</Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-lg border border-emerald-500/30">
                <h4 className="text-white font-semibold mb-3">Compliance Status</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-400">100%</div>
                    <div className="text-white/70 text-sm">EPA Compliance</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">7</div>
                    <div className="text-white/70 text-sm">Required Reports</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">Region 5</div>
                    <div className="text-white/70 text-sm">EPA Region</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <Button
          onClick={activateProject}
          disabled={project.status === "active"}
          className="bg-emerald-600 hover:bg-emerald-700 text-white flex-1"
        >
          <Zap className="w-4 h-4 mr-2" />
          {project.status === "active" ? "Project Active" : "Activate Project"}
        </Button>
        <Button onClick={deployToField} className="bg-blue-600 hover:bg-blue-700 text-white flex-1">
          <Navigation className="w-4 h-4 mr-2" />
          Deploy to Field Interface
        </Button>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white flex-1">
          <FileText className="w-4 h-4 mr-2" />
          Generate Field Protocols
        </Button>
      </div>
    </div>
  )
}
