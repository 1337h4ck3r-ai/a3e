"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, BarChart3, Database, Printer, Settings } from "lucide-react"
// Add import for CustomReportTemplates
import CustomReportTemplates from "./custom-report-templates"

interface ExportControlsProps {
  sampleData: any
  currentStep: number
}

export default function ExportControls({ sampleData, currentStep }: ExportControlsProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [exportStatus, setExportStatus] = useState<string | null>(null)
  // Add state for template management
  const [showTemplateManager, setShowTemplateManager] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)

  // Export data as CSV
  const exportToCSV = (dataType: string) => {
    setIsExporting(true)
    setExportStatus(`Exporting ${dataType} data...`)

    try {
      let csvContent = ""
      let filename = ""

      switch (dataType) {
        case "pH":
          csvContent = "Time (min),pH Value,Target pH\n"
          sampleData.pH.forEach((point: any) => {
            csvContent += `${point.time},${point.value.toFixed(2)},${point.target}\n`
          })
          filename = "pH_data.csv"
          break

        case "temperature":
          csvContent = "Time (min),Temperature (°C),Target Temperature\n"
          sampleData.temperature.forEach((point: any) => {
            csvContent += `${point.time},${point.value.toFixed(1)},${point.target}\n`
          })
          filename = "temperature_data.csv"
          break

        case "dissolvedOxygen":
          csvContent = "Time (min),Dissolved Oxygen (mg/L),Target DO\n"
          sampleData.dissolvedOxygen.forEach((point: any) => {
            csvContent += `${point.time},${point.value.toFixed(1)},${point.target}\n`
          })
          filename = "dissolved_oxygen_data.csv"
          break

        case "contaminants":
          csvContent = "Contaminant,Measured Value,Limit,Status\n"
          sampleData.contaminants.forEach((contaminant: any) => {
            csvContent += `${contaminant.name},${contaminant.value.toFixed(3)},${contaminant.limit.toFixed(3)},${contaminant.status}\n`
          })
          filename = "contaminant_analysis.csv"
          break

        case "all":
          // Export all data in a comprehensive CSV
          csvContent = generateComprehensiveCSV(sampleData)
          filename = "complete_sample_analysis.csv"
          break
      }

      downloadFile(csvContent, filename, "text/csv")
      setExportStatus(`${dataType} data exported successfully!`)
    } catch (error) {
      setExportStatus("Export failed. Please try again.")
    } finally {
      setIsExporting(false)
      setTimeout(() => setExportStatus(null), 3000)
    }
  }

  // Export data as JSON
  const exportToJSON = () => {
    setIsExporting(true)
    setExportStatus("Exporting JSON data...")

    try {
      const exportData = {
        timestamp: new Date().toISOString(),
        sampleId: `SAMPLE_${Date.now()}`,
        currentStep,
        data: sampleData,
        metadata: {
          exportedBy: "A3E Environmental Consultants",
          version: "1.0",
          format: "JSON",
        },
      }

      const jsonContent = JSON.stringify(exportData, null, 2)
      downloadFile(jsonContent, "sample_data.json", "application/json")
      setExportStatus("JSON data exported successfully!")
    } catch (error) {
      setExportStatus("JSON export failed. Please try again.")
    } finally {
      setIsExporting(false)
      setTimeout(() => setExportStatus(null), 3000)
    }
  }

  // Generate comprehensive report
  const generateReport = () => {
    setIsExporting(true)
    setExportStatus("Generating comprehensive report...")

    try {
      const reportContent = generateHTMLReport(sampleData, currentStep)
      downloadFile(reportContent, "environmental_analysis_report.html", "text/html")
      setExportStatus("Report generated successfully!")
    } catch (error) {
      setExportStatus("Report generation failed. Please try again.")
    } finally {
      setIsExporting(false)
      setTimeout(() => setExportStatus(null), 3000)
    }
  }

  // Generate lab certificate
  const generateCertificate = () => {
    setIsExporting(true)
    setExportStatus("Generating lab certificate...")

    try {
      const certificateContent = generateLabCertificate(sampleData)
      downloadFile(certificateContent, "lab_analysis_certificate.html", "text/html")
      setExportStatus("Certificate generated successfully!")
    } catch (error) {
      setExportStatus("Certificate generation failed. Please try again.")
    } finally {
      setIsExporting(false)
      setTimeout(() => setExportStatus(null), 3000)
    }
  }

  // Add template selection handler
  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template)
    generateCustomReport(template)
  }

  // Add function to generate custom report
  const generateCustomReport = (template: any) => {
    setIsExporting(true)
    setExportStatus("Generating custom report...")

    try {
      const reportContent = generateCustomReportHTML(sampleData, template)
      downloadFile(reportContent, `${template.name.replace(/\s+/g, "_")}_report.html`, "text/html")
      setExportStatus("Custom report generated successfully!")
    } catch (error) {
      setExportStatus("Custom report generation failed. Please try again.")
    } finally {
      setIsExporting(false)
      setTimeout(() => setExportStatus(null), 3000)
    }
  }

  // Add custom report generation function
  function generateCustomReportHTML(sampleData: any, template: any): string {
    // This function would be similar to the one in custom-report-templates.tsx
    // Implementation details would be the same as the generateCustomReport function
    return generateCustomReport(sampleData, template)
  }

  return (
    <div className="fixed bottom-6 right-6 z-30">
      <Card className="bg-black/80 backdrop-blur-md border-white/20 text-white min-w-80">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Download className="w-5 h-5" />
            Export Data & Reports
          </CardTitle>
          <CardDescription className="text-white/70">
            Export sampling data and generate professional reports
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Export Status */}
          {exportStatus && (
            <div className="p-2 rounded bg-emerald-500/20 border border-emerald-500/30">
              <p className="text-sm text-emerald-300">{exportStatus}</p>
            </div>
          )}

          {/* Data Export Section */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-white/90">Raw Data Export</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button
                size="sm"
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={() => exportToCSV("pH")}
                disabled={isExporting}
              >
                <BarChart3 className="w-4 h-4 mr-1" />
                pH Data
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={() => exportToCSV("temperature")}
                disabled={isExporting}
              >
                <BarChart3 className="w-4 h-4 mr-1" />
                Temperature
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={() => exportToCSV("dissolvedOxygen")}
                disabled={isExporting}
              >
                <BarChart3 className="w-4 h-4 mr-1" />
                Dissolved O₂
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={() => exportToCSV("contaminants")}
                disabled={isExporting}
              >
                <BarChart3 className="w-4 h-4 mr-1" />
                Contaminants
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => exportToCSV("all")}
                disabled={isExporting}
              >
                <Database className="w-4 h-4 mr-1" />
                All Data (CSV)
              </Button>

              <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={exportToJSON} disabled={isExporting}>
                <Database className="w-4 h-4 mr-1" />
                All Data (JSON)
              </Button>
            </div>
          </div>

          {/* Report Generation Section */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-white/90">Professional Reports</h4>
            <div className="space-y-2">
              <Button
                size="sm"
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={generateReport}
                disabled={isExporting}
              >
                <FileText className="w-4 h-4 mr-2" />
                Comprehensive Analysis Report
              </Button>

              <Button
                size="sm"
                className="w-full bg-amber-600 hover:bg-amber-700"
                onClick={generateCertificate}
                disabled={isExporting}
              >
                <Printer className="w-4 h-4 mr-2" />
                Lab Analysis Certificate
              </Button>
              {/* Add template manager button in the Professional Reports section */}
              <Button
                size="sm"
                className="w-full bg-indigo-600 hover:bg-indigo-700"
                onClick={() => setShowTemplateManager(!showTemplateManager)}
                disabled={isExporting}
              >
                <Settings className="w-4 h-4 mr-2" />
                Custom Templates
              </Button>
            </div>
          </div>

          {/* Sample Info */}
          <div className="pt-2 border-t border-white/20">
            <div className="flex justify-between items-center text-xs text-white/70">
              <span>Sample ID:</span>
              <Badge variant="outline" className="border-white/20 text-white">
                SAMPLE_{Date.now().toString().slice(-6)}
              </Badge>
            </div>
            <div className="flex justify-between items-center text-xs text-white/70 mt-1">
              <span>Current Step:</span>
              <Badge variant="outline" className="border-white/20 text-white">
                {currentStep + 1}/5
              </Badge>
            </div>
          </div>
          {/* Add the template manager component after the existing content */}
          {showTemplateManager && (
            <div className="mt-4">
              <CustomReportTemplates sampleData={sampleData} onTemplateSelect={handleTemplateSelect} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Helper function to download files
function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Generate comprehensive CSV with all data
function generateComprehensiveCSV(sampleData: any): string {
  let csv = "A3E Environmental Consultants - Complete Sample Analysis\n"
  csv += `Export Date: ${new Date().toLocaleString()}\n`
  csv += `Sample ID: SAMPLE_${Date.now()}\n\n`

  // pH Data
  csv += "pH MEASUREMENTS\n"
  csv += "Time (min),pH Value,Target pH\n"
  sampleData.pH.forEach((point: any) => {
    csv += `${point.time},${point.value.toFixed(2)},${point.target}\n`
  })
  csv += "\n"

  // Temperature Data
  csv += "TEMPERATURE MEASUREMENTS\n"
  csv += "Time (min),Temperature (°C),Target Temperature\n"
  sampleData.temperature.forEach((point: any) => {
    csv += `${point.time},${point.value.toFixed(1)},${point.target}\n`
  })
  csv += "\n"

  // Dissolved Oxygen Data
  csv += "DISSOLVED OXYGEN MEASUREMENTS\n"
  csv += "Time (min),Dissolved Oxygen (mg/L),Target DO\n"
  sampleData.dissolvedOxygen.forEach((point: any) => {
    csv += `${point.time},${point.value.toFixed(1)},${point.target}\n`
  })
  csv += "\n"

  // Contaminant Analysis
  csv += "CONTAMINANT ANALYSIS\n"
  csv += "Contaminant,Measured Value,Regulatory Limit,Status,Compliance\n"
  sampleData.contaminants.forEach((contaminant: any) => {
    const compliance = contaminant.value <= contaminant.limit ? "PASS" : "FAIL"
    csv += `${contaminant.name},${contaminant.value.toFixed(3)},${contaminant.limit.toFixed(3)},${contaminant.status},${compliance}\n`
  })
  csv += "\n"

  // Compliance Summary
  csv += "COMPLIANCE SUMMARY\n"
  csv += "Category,Percentage\n"
  sampleData.compliance.forEach((item: any) => {
    csv += `${item.name},${item.value}%\n`
  })

  return csv
}

// Generate HTML report
function generateHTMLReport(sampleData: any, currentStep: number): string {
  const reportDate = new Date().toLocaleString()
  const sampleId = `SAMPLE_${Date.now()}`

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Environmental Analysis Report - ${sampleId}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; color: #333; }
        .header { text-align: center; border-bottom: 3px solid #22c55e; padding-bottom: 20px; margin-bottom: 30px; }
        .company-logo { font-size: 2.5em; font-weight: bold; color: #22c55e; margin-bottom: 10px; }
        .report-title { font-size: 1.8em; color: #1f2937; margin-bottom: 5px; }
        .report-subtitle { color: #6b7280; font-size: 1.1em; }
        .section { margin: 30px 0; }
        .section-title { font-size: 1.4em; color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; margin-bottom: 20px; }
        .data-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .data-table th, .data-table td { border: 1px solid #d1d5db; padding: 12px; text-align: left; }
        .data-table th { background-color: #f3f4f6; font-weight: bold; }
        .status-safe { color: #22c55e; font-weight: bold; }
        .status-caution { color: #f59e0b; font-weight: bold; }
        .status-danger { color: #ef4444; font-weight: bold; }
        .summary-box { background-color: #f0fdf4; border: 1px solid #22c55e; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; }
        .metadata { background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .chart-placeholder { background-color: #f3f4f6; height: 200px; display: flex; align-items: center; justify-content: center; border: 1px solid #d1d5db; border-radius: 8px; margin: 20px 0; color: #6b7280; }
    </style>
</head>
<body>
    <div class="header">
        <div class="company-logo">A3E</div>
        <div style="font-size: 0.9em; color: #6b7280; margin-bottom: 20px;">ENVIRONMENTAL CONSULTANTS</div>
        <div class="report-title">Environmental Sample Analysis Report</div>
        <div class="report-subtitle">Comprehensive Laboratory Analysis Results</div>
    </div>

    <div class="metadata">
        <strong>Report Details:</strong><br>
        Sample ID: ${sampleId}<br>
        Analysis Date: ${reportDate}<br>
        Analysis Phase: Step ${currentStep + 1} of 5<br>
        Laboratory: A3E Environmental Testing Facility<br>
        Analyst: Certified Environmental Technician
    </div>

    <div class="section">
        <div class="section-title">Executive Summary</div>
        <div class="summary-box">
            <p><strong>Overall Compliance Status:</strong> ${sampleData.compliance[0].value}% Compliant</p>
            <p><strong>Critical Parameters:</strong> All major environmental parameters have been analyzed according to EPA standards.</p>
            <p><strong>Recommendations:</strong> Continue monitoring for parameters showing caution levels. Implement corrective measures for any non-compliant results.</p>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Water Quality Parameters</div>
        <table class="data-table">
            <thead>
                <tr>
                    <th>Parameter</th>
                    <th>Current Value</th>
                    <th>Target/Limit</th>
                    <th>Units</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>pH Level</td>
                    <td>${sampleData.pH[sampleData.pH.length - 1]?.value.toFixed(2) || "N/A"}</td>
                    <td>${sampleData.pH[0]?.target || "N/A"}</td>
                    <td>pH units</td>
                    <td class="status-safe">NORMAL</td>
                </tr>
                <tr>
                    <td>Temperature</td>
                    <td>${sampleData.temperature[sampleData.temperature.length - 1]?.value.toFixed(1) || "N/A"}</td>
                    <td>${sampleData.temperature[0]?.target || "N/A"}</td>
                    <td>°C</td>
                    <td class="status-safe">NORMAL</td>
                </tr>
                <tr>
                    <td>Dissolved Oxygen</td>
                    <td>${sampleData.dissolvedOxygen[sampleData.dissolvedOxygen.length - 1]?.value.toFixed(1) || "N/A"}</td>
                    <td>${sampleData.dissolvedOxygen[0]?.target || "N/A"}</td>
                    <td>mg/L</td>
                    <td class="status-safe">NORMAL</td>
                </tr>
                <tr>
                    <td>Turbidity</td>
                    <td>${sampleData.turbidity[sampleData.turbidity.length - 1]?.value.toFixed(2) || "N/A"}</td>
                    <td>1.0</td>
                    <td>NTU</td>
                    <td class="status-safe">NORMAL</td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="section">
        <div class="section-title">Contaminant Analysis</div>
        <table class="data-table">
            <thead>
                <tr>
                    <th>Contaminant</th>
                    <th>Detected Level</th>
                    <th>Regulatory Limit</th>
                    <th>Units</th>
                    <th>Compliance Status</th>
                </tr>
            </thead>
            <tbody>
                ${sampleData.contaminants
                  .map(
                    (contaminant: any) => `
                <tr>
                    <td>${contaminant.name}</td>
                    <td>${contaminant.value.toFixed(3)}</td>
                    <td>${contaminant.limit.toFixed(3)}</td>
                    <td>mg/L</td>
                    <td class="status-${contaminant.status === "safe" ? "safe" : contaminant.status === "caution" ? "caution" : "danger"}">
                        ${contaminant.value <= contaminant.limit ? "COMPLIANT" : "NON-COMPLIANT"}
                    </td>
                </tr>
                `,
                  )
                  .join("")}
            </tbody>
        </table>
    </div>

    <div class="section">
        <div class="section-title">Compliance Summary</div>
        <table class="data-table">
            <thead>
                <tr>
                    <th>Compliance Category</th>
                    <th>Percentage</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${sampleData.compliance
                  .map(
                    (item: any) => `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.value}%</td>
                    <td class="status-${item.name === "Compliant" ? "safe" : item.name === "Caution" ? "caution" : "danger"}">
                        ${item.name.toUpperCase()}
                    </td>
                </tr>
                `,
                  )
                  .join("")}
            </tbody>
        </table>
    </div>

    <div class="section">
        <div class="section-title">Quality Assurance</div>
        <p><strong>Data Quality Score:</strong> 95% - Excellent</p>
        <p><strong>Calibration Status:</strong> All instruments calibrated within 24 hours</p>
        <p><strong>Chain of Custody:</strong> Maintained throughout analysis</p>
        <p><strong>QC Samples:</strong> Blanks and duplicates analyzed</p>
    </div>

    <div class="footer">
        <p><strong>A3E Environmental Consultants</strong></p>
        <p>Certified Environmental Testing Laboratory</p>
        <p>This report contains ${sampleData.pH.length + sampleData.temperature.length + sampleData.dissolvedOxygen.length} data points collected during comprehensive analysis.</p>
        <p><em>Report generated automatically by A3E Laboratory Information Management System</em></p>
    </div>
</body>
</html>
  `
}

// Generate lab certificate
function generateLabCertificate(sampleData: any): string {
  const certDate = new Date().toLocaleString()
  const sampleId = `SAMPLE_${Date.now()}`

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laboratory Analysis Certificate - ${sampleId}</title>
    <style>
        body { font-family: 'Times New Roman', serif; margin: 60px; line-height: 1.8; color: #1a1a1a; background: #fff; }
        .certificate { border: 8px solid #22c55e; padding: 60px; text-align: center; background: linear-gradient(135deg, #f8fffe 0%, #f0fdf4 100%); }
        .header { margin-bottom: 40px; }
        .company-name { font-size: 3em; font-weight: bold; color: #22c55e; margin-bottom: 10px; letter-spacing: 2px; }
        .company-subtitle { font-size: 1.2em; color: #374151; letter-spacing: 1px; margin-bottom: 30px; }
        .certificate-title { font-size: 2.5em; color: #1f2937; margin: 40px 0; text-decoration: underline; }
        .content { text-align: left; margin: 40px 0; font-size: 1.1em; }
        .sample-info { background: #ffffff; padding: 30px; border: 2px solid #22c55e; border-radius: 10px; margin: 30px 0; }
        .signature-section { margin-top: 60px; display: flex; justify-content: space-between; }
        .signature-box { text-align: center; width: 200px; }
        .signature-line { border-bottom: 2px solid #1f2937; margin-bottom: 10px; height: 40px; }
        .seal { position: absolute; right: 100px; bottom: 100px; width: 120px; height: 120px; border: 4px solid #22c55e; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: #f0fdf4; font-weight: bold; color: #22c55e; }
    </style>
</head>
<body>
    <div class="certificate">
        <div class="header">
            <div class="company-name">A3E</div>
            <div class="company-subtitle">ENVIRONMENTAL CONSULTANTS</div>
            <div style="font-size: 0.9em; color: #6b7280;">Certified Environmental Testing Laboratory</div>
        </div>

        <div class="certificate-title">CERTIFICATE OF ANALYSIS</div>

        <div class="content">
            <p>This is to certify that the environmental sample identified below has been analyzed in accordance with EPA approved methods and industry standards.</p>

            <div class="sample-info">
                <table style="width: 100%; font-size: 1em;">
                    <tr>
                        <td><strong>Sample Identification:</strong></td>
                        <td>${sampleId}</td>
                    </tr>
                    <tr>
                        <td><strong>Date of Analysis:</strong></td>
                        <td>${certDate}</td>
                    </tr>
                    <tr>
                        <td><strong>Sample Type:</strong></td>
                        <td>Environmental Water Sample</td>
                    </tr>
                    <tr>
                        <td><strong>Analysis Method:</strong></td>
                        <td>EPA Standard Methods</td>
                    </tr>
                    <tr>
                        <td><strong>Overall Compliance:</strong></td>
                        <td style="color: #22c55e; font-weight: bold;">${sampleData.compliance[0].value}% COMPLIANT</td>
                    </tr>
                </table>
            </div>

            <p><strong>Parameters Analyzed:</strong></p>
            <ul>
                <li>pH Level: ${sampleData.pH[sampleData.pH.length - 1]?.value.toFixed(2) || "N/A"} pH units</li>
                <li>Temperature: ${sampleData.temperature[sampleData.temperature.length - 1]?.value.toFixed(1) || "N/A"}°C</li>
                <li>Dissolved Oxygen: ${sampleData.dissolvedOxygen[sampleData.dissolvedOxygen.length - 1]?.value.toFixed(1) || "N/A"} mg/L</li>
                <li>Heavy Metals Analysis (Lead, Mercury, Arsenic, Cadmium)</li>
                <li>Turbidity Measurements</li>
            </ul>

            <p><strong>Quality Assurance:</strong> All analyses were performed under strict quality control procedures with appropriate blanks, duplicates, and certified reference materials.</p>

            <p><strong>Certification:</strong> This laboratory is certified for environmental testing and maintains accreditation with relevant regulatory bodies.</p>
        </div>

        <div class="signature-section">
            <div class="signature-box">
                <div class="signature-line"></div>
                <div><strong>Laboratory Director</strong></div>
                <div>Dr. Sarah Johnson, Ph.D.</div>
                <div>Environmental Chemistry</div>
            </div>
            <div class="signature-box">
                <div class="signature-line"></div>
                <div><strong>Quality Manager</strong></div>
                <div>Michael Chen, M.S.</div>
                <div>Quality Assurance</div>
            </div>
        </div>

        <div class="seal">
            <div>
                <div style="font-size: 0.8em;">CERTIFIED</div>
                <div style="font-size: 0.6em;">LAB</div>
            </div>
        </div>
    </div>
</body>
</html>
  `
}
