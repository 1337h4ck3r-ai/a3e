"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Send,
  Download,
  Eye,
  MapPin,
  Beaker,
  BarChart3,
  Shield,
} from "lucide-react"

interface TimelineStep {
  id: string
  title: string
  description: string
  status: "completed" | "in-progress" | "pending" | "overdue"
  dueDate: Date
  completedDate?: Date
  assignee: string
  documents: string[]
  dependencies: string[]
  priority: "high" | "medium" | "low"
  epaRequirement: boolean
}

const mockTimelineData: TimelineStep[] = [
  {
    id: "field-sampling",
    title: "Field Sampling Collection",
    description: "Collect soil and water samples from designated EPA Region 5 DePue site locations",
    status: "completed",
    dueDate: new Date("2024-01-15"),
    completedDate: new Date("2024-01-14"),
    assignee: "Field Team Alpha",
    documents: ["Field Data Sheets", "Chain of Custody", "GPS Coordinates"],
    dependencies: [],
    priority: "high",
    epaRequirement: true,
  },
  {
    id: "lab-analysis",
    title: "Laboratory Analysis",
    description: "Analyze samples for heavy metals, PCBs, and other contaminants per EPA protocols",
    status: "in-progress",
    dueDate: new Date("2024-01-25"),
    assignee: "Lab Team Beta",
    documents: ["Lab Results", "QA/QC Reports", "Analytical Methods"],
    dependencies: ["field-sampling"],
    priority: "high",
    epaRequirement: true,
  },
  {
    id: "data-validation",
    title: "Data Validation & QC",
    description: "Validate analytical results and perform quality control checks",
    status: "pending",
    dueDate: new Date("2024-01-30"),
    assignee: "QC Manager",
    documents: ["Validation Report", "QC Checklist", "Data Review"],
    dependencies: ["lab-analysis"],
    priority: "high",
    epaRequirement: true,
  },
  {
    id: "report-preparation",
    title: "EPA Report Preparation",
    description: "Prepare comprehensive environmental assessment report for EPA submission",
    status: "pending",
    dueDate: new Date("2024-02-05"),
    assignee: "Report Team",
    documents: ["Draft Report", "Executive Summary", "Appendices"],
    dependencies: ["data-validation"],
    priority: "high",
    epaRequirement: true,
  },
  {
    id: "regulatory-review",
    title: "Regulatory Review",
    description: "Internal regulatory compliance review before EPA submission",
    status: "pending",
    dueDate: new Date("2024-02-10"),
    assignee: "Compliance Officer",
    documents: ["Review Checklist", "Compliance Certificate"],
    dependencies: ["report-preparation"],
    priority: "medium",
    epaRequirement: true,
  },
  {
    id: "epa-submission",
    title: "EPA Submission",
    description: "Submit final report to EPA Region 5 through official channels",
    status: "pending",
    dueDate: new Date("2024-02-15"),
    assignee: "Project Manager",
    documents: ["Final Report", "Submission Receipt", "Cover Letter"],
    dependencies: ["regulatory-review"],
    priority: "high",
    epaRequirement: true,
  },
]

export default function SubmissionTimeline() {
  const [timelineData, setTimelineData] = useState<TimelineStep[]>(mockTimelineData)
  const [selectedStep, setSelectedStep] = useState<string | null>(null)
  const [currentDate] = useState(new Date())

  // Calculate overall progress
  const completedSteps = timelineData.filter((step) => step.status === "completed").length
  const totalSteps = timelineData.length
  const overallProgress = (completedSteps / totalSteps) * 100

  // Get status color
  const getStatusColor = (status: TimelineStep["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      case "in-progress":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30"
      case "pending":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      case "overdue":
        return "bg-red-500/20 text-red-300 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  // Get status icon
  const getStatusIcon = (status: TimelineStep["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      case "in-progress":
        return <Clock className="w-4 h-4" />
      case "pending":
        return <Calendar className="w-4 h-4" />
      case "overdue":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  // Get step icon
  const getStepIcon = (stepId: string) => {
    switch (stepId) {
      case "field-sampling":
        return <MapPin className="w-5 h-5" />
      case "lab-analysis":
        return <Beaker className="w-5 h-5" />
      case "data-validation":
        return <BarChart3 className="w-5 h-5" />
      case "report-preparation":
        return <FileText className="w-5 h-5" />
      case "regulatory-review":
        return <Shield className="w-5 h-5" />
      case "epa-submission":
        return <Send className="w-5 h-5" />
      default:
        return <FileText className="w-5 h-5" />
    }
  }

  // Check if step is overdue
  const isOverdue = (step: TimelineStep) => {
    return step.status !== "completed" && step.dueDate < currentDate
  }

  // Update overdue status
  useEffect(() => {
    setTimelineData((prev) =>
      prev.map((step) => ({
        ...step,
        status: isOverdue(step) ? "overdue" : step.status,
      })),
    )
  }, [currentDate])

  return (
    <div className="space-y-6">
      {/* Timeline Header */}
      <Card className="bg-black/20 backdrop-blur-xl border-white/20">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-white flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>EPA Submission Timeline</span>
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">DePue Project</Badge>
            </CardTitle>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-white text-sm font-medium">
                  {completedSteps}/{totalSteps} Steps Complete
                </div>
                <div className="text-white/60 text-xs">{overallProgress.toFixed(0)}% Progress</div>
              </div>
              <div className="w-24">
                <Progress value={overallProgress} className="h-2" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-green-300 font-medium">
                {timelineData.filter((s) => s.status === "completed").length}
              </div>
              <div className="text-white/60">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-blue-300 font-medium">
                {timelineData.filter((s) => s.status === "in-progress").length}
              </div>
              <div className="text-white/60">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-yellow-300 font-medium">
                {timelineData.filter((s) => s.status === "pending").length}
              </div>
              <div className="text-white/60">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-red-300 font-medium">
                {timelineData.filter((s) => s.status === "overdue").length}
              </div>
              <div className="text-white/60">Overdue</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline Steps */}
      <div className="space-y-4">
        {timelineData.map((step, index) => (
          <Card
            key={step.id}
            className={`bg-black/20 backdrop-blur-xl border-white/20 transition-all duration-300 ${
              selectedStep === step.id ? "ring-2 ring-emerald-500/50" : ""
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                {/* Step Number & Icon */}
                <div className="flex flex-col items-center space-y-2">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      step.status === "completed"
                        ? "bg-green-500/20 border-2 border-green-500"
                        : step.status === "in-progress"
                          ? "bg-blue-500/20 border-2 border-blue-500"
                          : step.status === "overdue"
                            ? "bg-red-500/20 border-2 border-red-500"
                            : "bg-gray-500/20 border-2 border-gray-500"
                    }`}
                  >
                    {getStepIcon(step.id)}
                  </div>
                  {index < timelineData.length - 1 && (
                    <div className={`w-0.5 h-16 ${step.status === "completed" ? "bg-green-500" : "bg-gray-500/30"}`} />
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-white font-semibold">{step.title}</h3>
                        <Badge className={getStatusColor(step.status)}>
                          {getStatusIcon(step.status)}
                          <span className="ml-1 capitalize">{step.status.replace("-", " ")}</span>
                        </Badge>
                        {step.epaRequirement && (
                          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                            EPA Required
                          </Badge>
                        )}
                        <Badge
                          className={`${
                            step.priority === "high"
                              ? "bg-red-500/20 text-red-300 border-red-500/30"
                              : step.priority === "medium"
                                ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                                : "bg-gray-500/20 text-gray-300 border-gray-500/30"
                          }`}
                        >
                          {step.priority} priority
                        </Badge>
                      </div>
                      <p className="text-white/70 text-sm">{step.description}</p>
                    </div>

                    <Button
                      onClick={() => setSelectedStep(selectedStep === step.id ? null : step.id)}
                      variant="outline"
                      size="sm"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      {selectedStep === step.id ? "Hide" : "Details"}
                    </Button>
                  </div>

                  {/* Step Metadata */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="space-y-1">
                      <div className="text-white/60">Due Date</div>
                      <div className={`text-white ${isOverdue(step) ? "text-red-300" : ""}`}>
                        {step.dueDate.toLocaleDateString()}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-white/60">Assignee</div>
                      <div className="text-white">{step.assignee}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-white/60">Documents</div>
                      <div className="text-white">{step.documents.length} files</div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {selectedStep === step.id && (
                    <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10 space-y-4">
                      {/* Documents */}
                      <div className="space-y-2">
                        <h4 className="text-white font-medium">Required Documents</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {step.documents.map((doc, docIndex) => (
                            <div
                              key={docIndex}
                              className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/10"
                            >
                              <div className="flex items-center space-x-2">
                                <FileText className="w-4 h-4 text-white/60" />
                                <span className="text-white text-sm">{doc}</span>
                              </div>
                              <div className="flex space-x-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-white/20 text-white hover:bg-white/10 h-6 px-2 bg-transparent"
                                >
                                  <Eye className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-white/20 text-white hover:bg-white/10 h-6 px-2 bg-transparent"
                                >
                                  <Download className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Dependencies */}
                      {step.dependencies.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-white font-medium">Dependencies</h4>
                          <div className="flex flex-wrap gap-2">
                            {step.dependencies.map((dep, depIndex) => {
                              const depStep = timelineData.find((s) => s.id === dep)
                              return (
                                <Badge
                                  key={depIndex}
                                  className={
                                    depStep?.status === "completed"
                                      ? "bg-green-500/20 text-green-300 border-green-500/30"
                                      : "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                                  }
                                >
                                  {depStep?.title || dep}
                                </Badge>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      {/* Completion Date */}
                      {step.completedDate && (
                        <div className="space-y-1">
                          <div className="text-white/60 text-sm">Completed On</div>
                          <div className="text-green-300">{step.completedDate.toLocaleDateString()}</div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex space-x-2 pt-2">
                        {step.status === "pending" && (
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            Start Task
                          </Button>
                        )}
                        {step.status === "in-progress" && (
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            Mark Complete
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                        >
                          Add Note
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                        >
                          Upload File
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="bg-black/20 backdrop-blur-xl border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="bg-emerald-600 hover:bg-emerald-700 justify-start">
              <Download className="w-4 h-4 mr-2" />
              Export Timeline
            </Button>
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 justify-start bg-transparent"
            >
              <Send className="w-4 h-4 mr-2" />
              Send Update
            </Button>
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 justify-start bg-transparent"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Review
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
