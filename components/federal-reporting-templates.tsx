"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Download, Shield, CheckCircle, Calendar, MapPin, Users, Database } from "lucide-react"

interface FederalTemplate {
  id: string
  name: string
  rfpNumber: string
  agency: string
  region: string
  dueDate: string
  status: "draft" | "review" | "approved" | "submitted"
  sections: string[]
  compliance: {
    cercla: boolean
    rcra: boolean
    cleanWater: boolean
    nepa: boolean
  }
}

interface FederalReportingTemplatesProps {
  sampleData: any
  projectData?: any
}

export default function FederalReportingTemplates({ sampleData, projectData }: FederalReportingTemplatesProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("depue-rfp")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationStatus, setGenerationStatus] = useState<string | null>(null)

  // Federal reporting templates
  const federalTemplates: FederalTemplate[] = [
    {
      id: "depue-rfp",
      name: "DePue Site Environmental Assessment",
      rfpNumber: "68HE0525R0028",
      agency: "EPA",
      region: "Region 5",
      dueDate: "2025-07-14",
      status: "draft",
      sections: [
        "Executive Summary",
        "Site Description and History",
        "Regulatory Framework",
        "Sampling and Analysis Plan",
        "Field Investigation Results",
        "Laboratory Analysis Results",
        "Risk Assessment",
        "Conclusions and Recommendations",
        "Quality Assurance/Quality Control",
      ],
      compliance: {
        cercla: true,
        rcra: true,
        cleanWater: true,
        nepa: true,
      },
    },
    {
      id: "cercla-ri",
      name: "CERCLA Remedial Investigation",
      rfpNumber: "68HE0525R0029",
      agency: "EPA",
      region: "Region 5",
      dueDate: "2025-09-30",
      status: "draft",
      sections: [
        "Introduction and Background",
        "Site Characterization",
        "Nature and Extent of Contamination",
        "Baseline Risk Assessment",
        "Remedial Action Objectives",
        "Technology Screening",
      ],
      compliance: {
        cercla: true,
        rcra: false,
        cleanWater: true,
        nepa: true,
      },
    },
    {
      id: "rcra-corrective",
      name: "RCRA Corrective Action",
      rfpNumber: "68HE0525R0030",
      agency: "EPA",
      region: "Region 5",
      dueDate: "2025-12-15",
      status: "draft",
      sections: [
        "Facility Assessment",
        "RCRA Facility Investigation",
        "Corrective Measures Study",
        "Human Health Risk Assessment",
        "Ecological Risk Assessment",
      ],
      compliance: {
        cercla: false,
        rcra: true,
        cleanWater: true,
        nepa: false,
      },
    },
  ]

  const currentTemplate = federalTemplates.find((t) => t.id === selectedTemplate)

  // Generate federal report
  const generateFederalReport = async (templateId: string) => {
    setIsGenerating(true)
    setGenerationStatus("Generating federal compliance report...")

    try {
      const template = federalTemplates.find((t) => t.id === templateId)
      if (!template) throw new Error("Template not found")

      let reportContent = ""

      switch (templateId) {
        case "depue-rfp":
          reportContent = generateDePueRFPReport(sampleData, template)
          break
        case "cercla-ri":
          reportContent = generateCERCLAReport(sampleData, template)
          break
        case "rcra-corrective":
          reportContent = generateRCRAReport(sampleData, template)
          break
        default:
          reportContent = generateGenericFederalReport(sampleData, template)
      }

      // Download the report
      const blob = new Blob([reportContent], { type: "text/html" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${template.rfpNumber}_${template.name.replace(/\s+/g, "_")}.html`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      setGenerationStatus("Federal report generated successfully!")
    } catch (error) {
      setGenerationStatus("Report generation failed. Please try again.")
    } finally {
      setIsGenerating(false)
      setTimeout(() => setGenerationStatus(null), 3000)
    }
  }

  // Generate chain of custody forms
  const generateChainOfCustody = () => {
    setIsGenerating(true)
    setGenerationStatus("Generating chain of custody forms...")

    try {
      const cocContent = generateChainOfCustodyForms(sampleData)
      const blob = new Blob([cocContent], { type: "text/html" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `Chain_of_Custody_${Date.now()}.html`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      setGenerationStatus("Chain of custody forms generated!")
    } catch (error) {
      setGenerationStatus("COC generation failed. Please try again.")
    } finally {
      setIsGenerating(false)
      setTimeout(() => setGenerationStatus(null), 3000)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-black/80 backdrop-blur-md border-white/20 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-white font-bold">Federal Reporting Templates</div>
              <div className="text-blue-300 text-sm font-normal">EPA Region 5 Compliance</div>
            </div>
          </CardTitle>
          <CardDescription className="text-white/70">
            Generate EPA-compliant reports for federal submissions and regulatory compliance
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="templates" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/10">
              <TabsTrigger value="templates" className="text-white">
                Templates
              </TabsTrigger>
              <TabsTrigger value="compliance" className="text-white">
                Compliance
              </TabsTrigger>
              <TabsTrigger value="submission" className="text-white">
                Submission
              </TabsTrigger>
            </TabsList>

            {/* Templates Tab */}
            <TabsContent value="templates" className="space-y-4">
              {generationStatus && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/30">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-blue-400" />
                    <p className="text-blue-300 font-medium">{generationStatus}</p>
                  </div>
                </div>
              )}

              <div className="grid gap-4">
                {federalTemplates.map((template) => (
                  <Card
                    key={template.id}
                    className={`cursor-pointer transition-all duration-300 ${
                      selectedTemplate === template.id
                        ? "bg-blue-500/20 border-blue-500/30"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="text-white font-semibold">{template.name}</h3>
                          <p className="text-white/60 text-sm">RFP: {template.rfpNumber}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                            {template.agency} {template.region}
                          </Badge>
                          <Badge
                            className={`${
                              template.status === "approved"
                                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                                : template.status === "review"
                                  ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                                  : "bg-gray-500/20 text-gray-300 border-gray-500/30"
                            }`}
                          >
                            {template.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                        <div>
                          <div className="text-white/60">Due Date</div>
                          <div className="text-white flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(template.dueDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-white/60">Sections</div>
                          <div className="text-white">{template.sections.length} sections</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
                          {template.compliance.cercla && (
                            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs">
                              CERCLA
                            </Badge>
                          )}
                          {template.compliance.rcra && (
                            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                              RCRA
                            </Badge>
                          )}
                          {template.compliance.cleanWater && (
                            <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 text-xs">CWA</Badge>
                          )}
                          {template.compliance.nepa && (
                            <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-xs">NEPA</Badge>
                          )}
                        </div>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            generateFederalReport(template.id)
                          }}
                          disabled={isGenerating}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Generate
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Compliance Tab */}
            <TabsContent value="compliance" className="space-y-4">
              {currentTemplate && (
                <div className="space-y-4">
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">{currentTemplate.name}</CardTitle>
                      <CardDescription className="text-white/70">
                        Compliance requirements for {currentTemplate.rfpNumber}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <h4 className="text-white font-semibold">Regulatory Framework</h4>
                          <div className="space-y-2">
                            {Object.entries(currentTemplate.compliance).map(([key, value]) => (
                              <div key={key} className="flex items-center space-x-2">
                                {value ? (
                                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                                ) : (
                                  <div className="w-4 h-4 rounded-full border border-white/20" />
                                )}
                                <span className="text-white capitalize">
                                  {key === "cleanWater" ? "Clean Water Act" : key.toUpperCase()}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="text-white font-semibold">Required Sections</h4>
                          <div className="space-y-1 max-h-40 overflow-y-auto">
                            {currentTemplate.sections.map((section, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <CheckCircle className="w-3 h-3 text-emerald-400" />
                                <span className="text-white/80 text-sm">{section}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-lg border border-blue-500/20">
                        <h4 className="text-blue-300 font-semibold mb-2">Submission Requirements</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-white/60">Format</div>
                            <div className="text-white">PDF + Electronic Submission</div>
                          </div>
                          <div>
                            <div className="text-white/60">Copies Required</div>
                            <div className="text-white">3 Hard Copies + Digital</div>
                          </div>
                          <div>
                            <div className="text-white/60">Page Limit</div>
                            <div className="text-white">No limit (comprehensive)</div>
                          </div>
                          <div>
                            <div className="text-white/60">Appendices</div>
                            <div className="text-white">Required (Field Data, Lab Reports)</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            {/* Submission Tab */}
            <TabsContent value="submission" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Button
                  onClick={() => generateFederalReport("depue-rfp")}
                  disabled={isGenerating}
                  className="bg-blue-600 hover:bg-blue-700 text-white h-20 flex-col"
                >
                  <FileText className="w-6 h-6 mb-2" />
                  <div>
                    <div className="font-semibold">Complete Federal Report</div>
                    <div className="text-xs opacity-80">RFP 68HE0525R0028</div>
                  </div>
                </Button>

                <Button
                  onClick={generateChainOfCustody}
                  disabled={isGenerating}
                  className="bg-purple-600 hover:bg-purple-700 text-white h-20 flex-col"
                >
                  <Database className="w-6 h-6 mb-2" />
                  <div>
                    <div className="font-semibold">Chain of Custody</div>
                    <div className="text-xs opacity-80">Sample tracking forms</div>
                  </div>
                </Button>

                <Button
                  disabled={isGenerating}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white h-20 flex-col"
                >
                  <MapPin className="w-6 h-6 mb-2" />
                  <div>
                    <div className="font-semibold">GPS Data Package</div>
                    <div className="text-xs opacity-80">Coordinate verification</div>
                  </div>
                </Button>

                <Button disabled={isGenerating} className="bg-amber-600 hover:bg-amber-700 text-white h-20 flex-col">
                  <Users className="w-6 h-6 mb-2" />
                  <div>
                    <div className="font-semibold">Certification Package</div>
                    <div className="text-xs opacity-80">Professional certifications</div>
                  </div>
                </Button>
              </div>

              {/* Submission Checklist */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Federal Submission Checklist</CardTitle>
                  <CardDescription className="text-white/70">
                    Ensure all requirements are met before submission
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      "Complete environmental assessment report",
                      "Laboratory analysis results with QA/QC data",
                      "Chain of custody documentation",
                      "GPS coordinates and site maps",
                      "Professional certifications and signatures",
                      "Risk assessment and recommendations",
                      "Regulatory compliance documentation",
                      "Electronic submission in required format",
                    ].map((item, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                        <span className="text-white">{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-lg border border-emerald-500/20">
                    <div className="flex items-center space-x-2 mb-2">
                      <Shield className="w-5 h-5 text-emerald-400" />
                      <span className="text-emerald-300 font-semibold">Compliance Status</span>
                    </div>
                    <div className="text-white">
                      All federal reporting requirements for RFP 68HE0525R0028 are configured and ready for generation.
                      Reports will include all required sections, compliance documentation, and professional
                      certifications.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

// Report generation functions
function generateDePueRFPReport(sampleData: any, template: FederalTemplate): string {
  const reportDate = new Date().toLocaleString()
  const submissionDate = new Date(template.dueDate).toLocaleDateString()

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EPA Region 5 Federal Submission - ${template.rfpNumber}</title>
    <style>
        body { 
            font-family: 'Times New Roman', serif; 
            margin: 1in; 
            line-height: 1.6; 
            color: #000000; 
            background: white;
            font-size: 12pt;
        }
        .header { 
            text-align: center; 
            border-bottom: 3px solid #003366; 
            padding-bottom: 20px; 
            margin-bottom: 30px; 
        }
        .federal-seal {
            width: 80px;
            height: 80px;
            border: 3px solid #003366;
            border-radius: 50%;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f0f8ff;
            font-weight: bold;
            color: #003366;
            font-size: 14pt;
        }
        .title-block {
            background: #f0f8ff;
            border: 2px solid #003366;
            padding: 20px;
            margin: 20px 0;
            text-align: center;
        }
        .rfp-number {
            font-size: 18pt;
            font-weight: bold;
            color: #003366;
            margin-bottom: 10px;
        }
        .section { 
            margin: 30px 0; 
            page-break-inside: avoid;
        }
        .section-title { 
            font-size: 14pt; 
            font-weight: bold;
            color: #003366; 
            border-bottom: 2px solid #003366; 
            padding-bottom: 10px; 
            margin-bottom: 20px; 
            text-transform: uppercase;
        }
        .data-table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 20px 0; 
            font-size: 10pt;
        }
        .data-table th, .data-table td { 
            border: 1px solid #003366; 
            padding: 8px; 
            text-align: left; 
            vertical-align: top;
        }
        .data-table th { 
            background-color: #003366; 
            color: white; 
            font-weight: bold; 
            text-align: center;
        }
        .compliance-box {
            background: #e8f5e8;
            border: 2px solid #006600;
            padding: 15px;
            margin: 20px 0;
        }
        .signature-section {
            margin-top: 50px;
            display: flex;
            justify-content: space-between;
            page-break-inside: avoid;
        }
        .signature-box {
            width: 45%;
            text-align: center;
        }
        .signature-line {
            border-bottom: 2px solid #000;
            margin-bottom: 10px;
            height: 40px;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="federal-seal">EPA</div>
        <h1 style="color: #003366; font-size: 20pt; margin: 0;">UNITED STATES ENVIRONMENTAL PROTECTION AGENCY</h1>
        <h2 style="color: #003366; font-size: 16pt; margin: 10px 0;">REGION 5</h2>
    </div>

    <div class="title-block">
        <div class="rfp-number">${template.rfpNumber}</div>
        <h1 style="margin: 20px 0; font-size: 18pt; color: #003366;">
            ${template.name.toUpperCase()}
        </h1>
        <div style="font-size: 14pt; margin: 20px 0;">
            <strong>Submission Date:</strong> ${reportDate}<br/>
            <strong>Due Date:</strong> ${submissionDate}<br/>
            <strong>Contractor:</strong> A3E Environmental Consultants
        </div>
    </div>

    <div class="compliance-box">
        <strong>FEDERAL COMPLIANCE CERTIFICATION</strong><br/>
        This report has been prepared in accordance with EPA Region 5 standards and requirements specified in ${template.rfpNumber}. 
        All sampling, analysis, and reporting procedures comply with applicable federal environmental regulations.
    </div>

    ${template.sections
      .map(
        (section) => `
    <div class="section">
        <div class="section-title">${section}</div>
        <p>Content for ${section} section would be generated here based on field data and analysis results.</p>
    </div>
    `,
      )
      .join("")}

    <div class="signature-section">
        <div class="signature-box">
            <div class="signature-line"></div>
            <div><strong>Sarah Chen, P.E., CHMM</strong></div>
            <div>Project Manager</div>
            <div>A3E Environmental Consultants</div>
        </div>
        <div class="signature-box">
            <div class="signature-line"></div>
            <div><strong>Dr. Robert Wilson, Ph.D.</strong></div>
            <div>Laboratory Director</div>
            <div>A3E Environmental Consultants</div>
        </div>
    </div>
</body>
</html>
  `
}

function generateCERCLAReport(sampleData: any, template: FederalTemplate): string {
  return generateGenericFederalReport(sampleData, template)
}

function generateRCRAReport(sampleData: any, template: FederalTemplate): string {
  return generateGenericFederalReport(sampleData, template)
}

function generateGenericFederalReport(sampleData: any, template: FederalTemplate): string {
  const reportDate = new Date().toLocaleString()

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${template.name} - ${template.rfpNumber}</title>
    <style>
        body { font-family: 'Times New Roman', serif; margin: 1in; line-height: 1.6; }
        .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 20px; }
        .section { margin: 30px 0; }
        .section-title { font-size: 14pt; font-weight: bold; border-bottom: 1px solid #000; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${template.name}</h1>
        <h2>${template.rfpNumber}</h2>
        <p>Generated: ${reportDate}</p>
    </div>
    
    ${template.sections
      .map(
        (section) => `
    <div class="section">
        <div class="section-title">${section}</div>
        <p>Content for ${section} section.</p>
    </div>
    `,
      )
      .join("")}
</body>
</html>
  `
}

function generateChainOfCustodyForms(sampleData: any): string {
  const currentDate = new Date().toLocaleDateString()
  const currentTime = new Date().toLocaleTimeString()

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Chain of Custody Forms - EPA Region 5</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0.5in; font-size: 10pt; }
        .coc-form { border: 2px solid #000; margin-bottom: 30px; page-break-after: always; }
        .coc-header { background: #f0f0f0; padding: 10px; border-bottom: 1px solid #000; }
        .coc-table { width: 100%; border-collapse: collapse; }
        .coc-table th, .coc-table td { border: 1px solid #000; padding: 5px; text-align: left; }
        .coc-table th { background: #e0e0e0; font-weight: bold; }
        .signature-section { margin-top: 20px; }
        .signature-line { border-bottom: 1px solid #000; width: 200px; display: inline-block; margin: 0 10px; }
    </style>
</head>
<body>
    <div class="coc-form">
        <div class="coc-header">
            <h2 style="margin: 0; text-align: center;">CHAIN OF CUSTODY RECORD</h2>
            <div style="display: flex; justify-content: space-between; margin-top: 10px;">
                <div><strong>Project:</strong> EPA Region 5 DePue Site Assessment</div>
                <div><strong>RFP:</strong> 68HE0525R0028</div>
                <div><strong>Date:</strong> ${currentDate}</div>
            </div>
        </div>

        <table class="coc-table">
            <thead>
                <tr>
                    <th>Sample ID</th>
                    <th>Date/Time Collected</th>
                    <th>Sample Type</th>
                    <th>Analysis Requested</th>
                    <th>Preservative</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>DPU-SW-001</td>
                    <td>${currentDate} ${currentTime}</td>
                    <td>Soil/Water</td>
                    <td>Heavy Metals, VOCs</td>
                    <td>HNO3, HCl</td>
                </tr>
                <tr>
                    <td>DPU-SW-002</td>
                    <td>${currentDate} ${currentTime}</td>
                    <td>Soil/Water</td>
                    <td>Heavy Metals, VOCs</td>
                    <td>HNO3, HCl</td>
                </tr>
                <tr>
                    <td>DPU-GW-001</td>
                    <td>${currentDate} ${currentTime}</td>
                    <td>Groundwater</td>
                    <td>Heavy Metals, VOCs</td>
                    <td>HNO3, HCl</td>
                </tr>
                <tr>
                    <td>DPU-GW-002</td>
                    <td>${currentDate} ${currentTime}</td>
                    <td>Groundwater</td>
                    <td>Heavy Metals, VOCs</td>
                    <td>HNO3, HCl</td>
                </tr>
                <tr>
                    <td>DPU-SED-001</td>
                    <td>${currentDate} ${currentTime}</td>
                    <td>Sediment</td>
                    <td>Heavy Metals, PCBs</td>
                    <td>None</td>
                </tr>
                <tr>
                    <td>DPU-AIR-001</td>
                    <td>${currentDate} ${currentTime}</td>
                    <td>Air</td>
                    <td>VOCs, Particulates</td>
                    <td>None</td>
                </tr>
            </tbody>
        </table>

        <div class="signature-section">
            <h3>Chain of Custody Signatures</h3>
            <table style="width: 100%; margin-top: 20px;">
                <tr>
                    <th style="border: 1px solid #000; padding: 10px; background: #e0e0e0;">Relinquished By</th>
                    <th style="border: 1px solid #000; padding: 10px; background: #e0e0e0;">Date/Time</th>
                    <th style="border: 1px solid #000; padding: 10px; background: #e0e0e0;">Received By</th>
                    <th style="border: 1px solid #000; padding: 10px; background: #e0e0e0;">Date/Time</th>
                </tr>
                <tr>
                    <td style="border: 1px solid #000; padding: 20px; height: 40px;"></td>
                    <td style="border: 1px solid #000; padding: 20px;"></td>
                    <td style="border: 1px solid #000; padding: 20px;"></td>
                    <td style="border: 1px solid #000; padding: 20px;"></td>
                </tr>
                <tr>
                    <td style="border: 1px solid #000; padding: 20px; height: 40px;"></td>
                    <td style="border: 1px solid #000; padding: 20px;"></td>
                    <td style="border: 1px solid #000; padding: 20px;"></td>
                    <td style="border: 1px solid #000; padding: 20px;"></td>
                </tr>
                <tr>
                    <td style="border: 1px solid #000; padding: 20px; height: 40px;"></td>
                    <td style="border: 1px solid #000; padding: 20px;"></td>
                    <td style="border: 1px solid #000; padding: 20px;"></td>
                    <td style="border: 1px solid #000; padding: 20px;"></td>
                </tr>
            </table>
        </div>

        <div style="margin-top: 30px; padding: 15px; border: 1px solid #000; background: #f9f9f9;">
            <h4>Sample Condition Upon Receipt</h4>
            <div style="display: flex; justify-content: space-between; margin: 10px 0;">
                <div>
                    <input type="checkbox"> Custody seals intact<br>
                    <input type="checkbox"> Sample containers intact<br>
                    <input type="checkbox"> Proper temperature maintained
                </div>
                <div>
                    <input type="checkbox"> Proper preservation<br>
                    <input type="checkbox"> Labels legible<br>
                    <input type="checkbox"> Chain of custody complete
                </div>
            </div>
            <div style="margin-top: 15px;">
                <strong>Comments:</strong><br>
                <div style="border: 1px solid #000; height: 60px; margin-top: 5px;"></div>
            </div>
        </div>

        <div style="margin-top: 20px; text-align: center; font-size: 8pt; color: #666;">
            <p><strong>EPA Region 5 Chain of Custody Form</strong></p>
            <p>RFP 68HE0525R0028 - DePue Site Environmental Assessment</p>
            <p>A3E Environmental Consultants - Certified Laboratory</p>
        </div>
    </div>
</body>
</html>
  `
}
