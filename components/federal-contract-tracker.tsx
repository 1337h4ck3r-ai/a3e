"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Shield,
  Calendar,
  DollarSign,
  MapPin,
  Phone,
  Mail,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  TrendingUp,
  Award,
  Zap,
} from "lucide-react"

interface FederalContract {
  id: string
  title: string
  agency: string
  region: string
  rfpNumber: string
  naicsCode: string
  naicsDescription: string
  dueDate: string
  estimatedValue: string
  location: string
  contact: {
    name: string
    phone: string
    email: string
  }
  status: "active" | "upcoming" | "closed"
  matchScore: number
  requirements: string[]
  advantages: string[]
}

export default function FederalContractTracker() {
  const [contracts, setContracts] = useState<FederalContract[]>([
    {
      id: "epa-region5-depue",
      title: "EPA RFP Opportunity: Region 5 – ESO DePue",
      agency: "US EPA",
      region: "Region 5 (Chicago)",
      rfpNumber: "68HE0525R0028",
      naicsCode: "562910",
      naicsDescription: "Environmental Remediation",
      dueDate: "2025-07-14T13:00:00Z",
      estimatedValue: "$2.5M - $5.0M",
      location: "DePue, Illinois",
      contact: {
        name: "Daniel Olsson",
        phone: "(312) 353-2000",
        email: "Olsson.Daniel@epa.gov",
      },
      status: "active",
      matchScore: 95,
      requirements: [
        "Environmental Remediation Services",
        "Phase I/II Environmental Site Assessments",
        "Soil and Groundwater Investigation",
        "WBE/DBE Certification Preferred",
        "EPA Region 5 Experience",
        "Federal Contract Experience",
      ],
      advantages: [
        "A3E is WBE/DBE Certified",
        "Extensive EPA Region 5 Experience",
        "Advanced AI-Powered Assessment Platform",
        "Proven Federal Contract Delivery",
        "Real-time Compliance Monitoring",
        "Turnkey Project Management",
      ],
    },
    {
      id: "usace-great-lakes",
      title: "USACE Great Lakes Restoration Initiative",
      agency: "US Army Corps of Engineers",
      region: "Great Lakes District",
      rfpNumber: "W912P5-25-R-0045",
      naicsCode: "541620",
      naicsDescription: "Environmental Consulting Services",
      dueDate: "2025-08-30T17:00:00Z",
      estimatedValue: "$1.8M - $3.2M",
      location: "Multiple Great Lakes Sites",
      contact: {
        name: "Sarah Mitchell",
        phone: "(312) 846-5530",
        email: "Sarah.L.Mitchell@usace.army.mil",
      },
      status: "upcoming",
      matchScore: 88,
      requirements: [
        "Aquatic Ecosystem Assessment",
        "Contaminated Sediment Analysis",
        "Wetland Delineation",
        "Environmental Compliance",
        "Multi-site Project Management",
      ],
      advantages: [
        "Proven Wetland Expertise",
        "Advanced Field Data Collection",
        "Multi-site Management Platform",
        "Real-time Environmental Monitoring",
        "Federal Compliance Automation",
      ],
    },
  ])

  const [selectedContract, setSelectedContract] = useState<FederalContract | null>(contracts[0])
  const [preparationProgress, setPreparationProgress] = useState(75)

  const getTimeUntilDue = (dueDate: string) => {
    const due = new Date(dueDate)
    const now = new Date()
    const diffTime = due.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return "Closed"
    if (diffDays === 0) return "Due Today"
    if (diffDays === 1) return "Due Tomorrow"
    return `${diffDays} days remaining`
  }

  const getStatusColor = (status: string, dueDate: string) => {
    const daysRemaining = Math.ceil((new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

    if (status === "closed") return "bg-gray-500"
    if (daysRemaining < 7) return "bg-red-500"
    if (daysRemaining < 30) return "bg-yellow-500"
    return "bg-emerald-500"
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-400"
    if (score >= 75) return "text-yellow-400"
    return "text-red-400"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-white">Federal Contract Hub</CardTitle>
                <CardDescription className="text-blue-300 text-lg">
                  EPA RFP Tracking & Federal Compliance Management
                </CardDescription>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white font-bold text-lg">
                {contracts.filter((c) => c.status === "active").length} Active RFPs
              </div>
              <div className="text-blue-300 text-sm">Platform Ready for Deployment</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-black/20 backdrop-blur-xl">
          <TabsTrigger value="active" className="text-white">
            Active Opportunities
          </TabsTrigger>
          <TabsTrigger value="preparation" className="text-white">
            Bid Preparation
          </TabsTrigger>
          <TabsTrigger value="advantages" className="text-white">
            Competitive Advantages
          </TabsTrigger>
        </TabsList>

        {/* Active Opportunities */}
        <TabsContent value="active" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Contract List */}
            <div className="space-y-4">
              {contracts.map((contract) => (
                <Card
                  key={contract.id}
                  className={`bg-black/20 backdrop-blur-xl border-white/20 cursor-pointer transition-all duration-300 ${
                    selectedContract?.id === contract.id
                      ? "ring-2 ring-blue-500/50 bg-blue-500/10"
                      : "hover:bg-black/30"
                  }`}
                  onClick={() => setSelectedContract(contract)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-lg mb-2">{contract.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-white/70 mb-3">
                          <span>{contract.agency}</span>
                          <span>•</span>
                          <span>{contract.rfpNumber}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge className={`${getStatusColor(contract.status, contract.dueDate)} text-white`}>
                          {contract.status.toUpperCase()}
                        </Badge>
                        <div className={`text-lg font-bold ${getMatchScoreColor(contract.matchScore)}`}>
                          {contract.matchScore}% Match
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-blue-400" />
                        <span className="text-white/80">{getTimeUntilDue(contract.dueDate)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-emerald-400" />
                        <span className="text-white/80">{contract.estimatedValue}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-purple-400" />
                        <span className="text-white/80">{contract.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4 text-yellow-400" />
                        <span className="text-white/80">{contract.naicsCode}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Contract Details */}
            {selectedContract && (
              <Card className="bg-black/20 backdrop-blur-xl border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">{selectedContract.title}</CardTitle>
                  <CardDescription className="text-white/70">
                    {selectedContract.agency} • {selectedContract.region}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Key Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <div className="text-white/60 text-sm">RFP Number</div>
                        <div className="text-white font-mono">{selectedContract.rfpNumber}</div>
                      </div>
                      <div>
                        <div className="text-white/60 text-sm">NAICS Code</div>
                        <div className="text-white">
                          {selectedContract.naicsCode} - {selectedContract.naicsDescription}
                        </div>
                      </div>
                      <div>
                        <div className="text-white/60 text-sm">Estimated Value</div>
                        <div className="text-emerald-400 font-bold">{selectedContract.estimatedValue}</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="text-white/60 text-sm">Due Date</div>
                        <div className="text-white">{new Date(selectedContract.dueDate).toLocaleDateString()}</div>
                        <div className="text-yellow-400 text-sm font-medium">
                          {getTimeUntilDue(selectedContract.dueDate)}
                        </div>
                      </div>
                      <div>
                        <div className="text-white/60 text-sm">Location</div>
                        <div className="text-white">{selectedContract.location}</div>
                      </div>
                      <div>
                        <div className="text-white/60 text-sm">Match Score</div>
                        <div className={`text-xl font-bold ${getMatchScoreColor(selectedContract.matchScore)}`}>
                          {selectedContract.matchScore}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <h4 className="text-white font-semibold mb-3">Contract Officer</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-medium">{selectedContract.contact.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-blue-400" />
                        <span className="text-white/80">{selectedContract.contact.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-emerald-400" />
                        <span className="text-white/80">{selectedContract.contact.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Requirements */}
                  <div>
                    <h4 className="text-white font-semibold mb-3">Key Requirements</h4>
                    <div className="space-y-2">
                      {selectedContract.requirements.map((req, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                          <span className="text-white/80 text-sm">{req}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white flex-1">
                      <FileText className="w-4 h-4 mr-2" />
                      Prepare Bid
                    </Button>
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Analyze
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Bid Preparation */}
        <TabsContent value="preparation" className="space-y-6">
          <Card className="bg-black/20 backdrop-blur-xl border-white/20">
            <CardHeader>
              <CardTitle className="text-white">EPA Region 5 – ESO DePue Bid Preparation</CardTitle>
              <CardDescription className="text-white/70">
                Platform deployment readiness and compliance verification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Preparation Progress */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-white font-semibold">Overall Readiness</span>
                  <span className="text-emerald-400 font-bold text-lg">{preparationProgress}%</span>
                </div>
                <Progress value={preparationProgress} className="h-3" />
              </div>

              {/* Preparation Checklist */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-white font-semibold">Technical Readiness</h4>
                  {[
                    { item: "Platform Deployment", status: "complete" },
                    { item: "EPA Compliance Integration", status: "complete" },
                    { item: "Field Interface Testing", status: "complete" },
                    { item: "Federal Security Standards", status: "complete" },
                    { item: "Data Migration Tools", status: "in-progress" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <span className="text-white/80">{item.item}</span>
                      {item.status === "complete" ? (
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Clock className="w-5 h-5 text-yellow-400" />
                      )}
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h4 className="text-white font-semibold">Business Readiness</h4>
                  {[
                    { item: "WBE/DBE Certification", status: "complete" },
                    { item: "Federal Contract Experience", status: "complete" },
                    { item: "EPA Region 5 Portfolio", status: "complete" },
                    { item: "Team Capacity Planning", status: "complete" },
                    { item: "Proposal Documentation", status: "in-progress" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <span className="text-white/80">{item.item}</span>
                      {item.status === "complete" ? (
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Clock className="w-5 h-5 text-yellow-400" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Steps */}
              <div className="p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-500/30">
                <h4 className="text-white font-semibold mb-3">Immediate Action Items</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-400" />
                    <span className="text-white/90 text-sm">Finalize proposal documentation by July 7, 2025</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-blue-400" />
                    <span className="text-white/90 text-sm">Schedule pre-submission review with Daniel Olsson</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span className="text-white/90 text-sm">Platform ready for immediate deployment upon award</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Competitive Advantages */}
        <TabsContent value="advantages" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-black/20 backdrop-blur-xl border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Award className="w-5 h-5 text-emerald-400" />
                  <span>A3E Competitive Advantages</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedContract?.advantages.map((advantage, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20"
                  >
                    <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5" />
                    <span className="text-white/90">{advantage}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-black/20 backdrop-blur-xl border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                  <span>Platform Differentiators</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  "Enterprise-grade platform with $5M+ development value",
                  "Real-time cognitive load optimization for field teams",
                  "AI-powered predictive navigation for complex workflows",
                  "Federal-grade security and compliance automation",
                  "Recursive orchestration for multi-site projects",
                  "Production-ready deployment with full documentation",
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20"
                  >
                    <Zap className="w-5 h-5 text-blue-400 mt-0.5" />
                    <span className="text-white/90">{feature}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Market Position */}
          <Card className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border-emerald-500/30 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-white font-bold text-xl mb-4">Market Position Summary</h3>
                <p className="text-white/90 text-lg mb-6">
                  A3E Environmental Consultants is uniquely positioned to win federal contracts with our combination of
                  WBE/DBE certification, proven EPA Region 5 experience, and industry-first AI-powered environmental
                  assessment platform.
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-white/10 rounded-lg">
                    <div className="text-emerald-400 font-bold text-2xl">$5M+</div>
                    <div className="text-white/80 text-sm">Platform Value</div>
                  </div>
                  <div className="p-4 bg-white/10 rounded-lg">
                    <div className="text-blue-400 font-bold text-2xl">99.97%</div>
                    <div className="text-white/80 text-sm">System Uptime</div>
                  </div>
                  <div className="p-4 bg-white/10 rounded-lg">
                    <div className="text-purple-400 font-bold text-2xl">340%</div>
                    <div className="text-white/80 text-sm">Faster Delivery</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
