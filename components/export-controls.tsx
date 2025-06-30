"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, BarChart3, Database, Printer, Settings, Sparkles, Zap } from "lucide-react"
import CustomReportTemplates from "./custom-report-templates"

interface ExportControlsProps {
  sampleData: any
  currentStep: number
}

export default function ExportControls({ sampleData, currentStep }: ExportControlsProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [exportStatus, setExportStatus] = useState<string | null>(null)
  const [showTemplateManager, setShowTemplateManager] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)

  // Export functions remain the same...
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

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template)
    generateCustomReport(template)
  }

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

  function generateCustomReportHTML(sampleData: any, template: any): string {
    return generateCustomReport(sampleData, template)
  }

  // Generate EPA RFP 68HE0525R0028 Federal Submission Report
  function generateFederalSubmissionReport(sampleData: any, currentStep: number): string {
    const reportDate = new Date().toLocaleString()
    const sampleId = `EPA-DEPUE-${Date.now()}`
    const submissionDate = new Date()
    submissionDate.setMonth(submissionDate.getMonth() + 5) // July 14, 2025 deadline

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EPA Region 5 Federal Submission - RFP 68HE0525R0028</title>
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
        .subsection-title {
            font-size: 12pt;
            font-weight: bold;
            color: #003366;
            margin: 20px 0 10px 0;
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
        .warning-box {
            background: #fff3cd;
            border: 2px solid #856404;
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
        .footer {
            position: fixed;
            bottom: 0.5in;
            left: 1in;
            right: 1in;
            text-align: center;
            font-size: 10pt;
            color: #666;
            border-top: 1px solid #ccc;
            padding-top: 10px;
        }
        .page-number:after {
            content: counter(page);
        }
        @page {
            margin: 1in;
            @bottom-center {
                content: "Page " counter(page) " of " counter(pages);
                font-size: 10pt;
                color: #666;
            }
        }
        .toc {
            page-break-after: always;
        }
        .toc-item {
            display: flex;
            justify-content: space-between;
            margin: 5px 0;
            border-bottom: 1px dotted #ccc;
        }
    </style>
</head>
<body>
    <!-- Cover Page -->
    <div class="header">
        <div class="federal-seal">EPA</div>
        <h1 style="color: #003366; font-size: 20pt; margin: 0;">UNITED STATES ENVIRONMENTAL PROTECTION AGENCY</h1>
        <h2 style="color: #003366; font-size: 16pt; margin: 10px 0;">REGION 5</h2>
        <div style="margin: 20px 0; font-size: 14pt;">Chicago, Illinois</div>
    </div>

    <div class="title-block">
        <div class="rfp-number">RFP 68HE0525R0028</div>
        <h1 style="margin: 20px 0; font-size: 18pt; color: #003366;">
            ENVIRONMENTAL SITE ASSESSMENT<br/>
            DEPUE ZINC SMELTER SUPERFUND SITE
        </h1>
        <div style="font-size: 14pt; margin: 20px 0;">
            <strong>Site Location:</strong> DePue, Bureau County, Illinois<br/>
            <strong>Site ID:</strong> ILD980602564<br/>
            <strong>Assessment Type:</strong> Phase II Environmental Site Assessment
        </div>
    </div>

    <div style="margin: 40px 0; text-align: center;">
        <table style="width: 100%; font-size: 12pt;">
            <tr>
                <td style="text-align: left; width: 50%; vertical-align: top;">
                    <strong>Submitted By:</strong><br/>
                    A3E Environmental Consultants<br/>
                    123 Environmental Way<br/>
                    Chicago, IL 60601<br/>
                    Phone: (312) 555-0123<br/>
                    Email: info@a3e-environmental.com
                </td>
                <td style="text-align: right; width: 50%; vertical-align: top;">
                    <strong>Submission Date:</strong> ${reportDate}<br/>
                    <strong>Report Date:</strong> ${new Date().toLocaleDateString()}<br/>
                    <strong>Project Manager:</strong> Sarah Chen, P.E.<br/>
                    <strong>QA/QC Officer:</strong> Amanda Foster<br/>
                    <strong>EPA Project Officer:</strong> [To be assigned]
                </td>
            </tr>
        </table>
    </div>

    <div class="compliance-box">
        <strong>FEDERAL COMPLIANCE CERTIFICATION</strong><br/>
        This report has been prepared in accordance with EPA Region 5 standards and requirements specified in RFP 68HE0525R0028. 
        All sampling, analysis, and reporting procedures comply with applicable federal environmental regulations including 
        CERCLA, RCRA, and Clean Water Act requirements.
    </div>

    <div style="page-break-before: always;"></div>

    <!-- Table of Contents -->
    <div class="toc">
        <div class="section-title">Table of Contents</div>
        <div class="toc-item"><span>1. Executive Summary</span><span>3</span></div>
        <div class="toc-item"><span>2. Site Description and History</span><span>4</span></div>
        <div class="toc-item"><span>3. Regulatory Framework</span><span>5</span></div>
        <div class="toc-item"><span>4. Sampling and Analysis Plan</span><span>6</span></div>
        <div class="toc-item"><span>5. Field Investigation Results</span><span>8</span></div>
        <div class="toc-item"><span>6. Laboratory Analysis Results</span><span>12</span></div>
        <div class="toc-item"><span>7. Risk Assessment</span><span>16</span></div>
        <div class="toc-item"><span>8. Conclusions and Recommendations</span><span>18</span></div>
        <div class="toc-item"><span>9. Quality Assurance/Quality Control</span><span>20</span></div>
        <div class="toc-item"><span>Appendix A: Field Data Sheets</span><span>22</span></div>
        <div class="toc-item"><span>Appendix B: Laboratory Reports</span><span>25</span></div>
        <div class="toc-item"><span>Appendix C: Chain of Custody Forms</span><span>30</span></div>
        <div class="toc-item"><span>Appendix D: GPS Coordinates and Maps</span><span>35</span></div>
    </div>

    <!-- Executive Summary -->
    <div class="section">
        <div class="section-title">1. Executive Summary</div>
        
        <div class="subsection-title">1.1 Project Overview</div>
        <p>A3E Environmental Consultants conducted a comprehensive Phase II Environmental Site Assessment of the 
        DePue Zinc Smelter Superfund Site in DePue, Bureau County, Illinois, under EPA Region 5 RFP 68HE0525R0028. 
        The 150-acre former zinc smelting facility operated from 1901 to 1972 and has been listed on the National 
        Priorities List since 1982.</p>

        <div class="subsection-title">1.2 Investigation Scope</div>
        <p>The investigation included:</p>
        <ul>
            <li>Collection and analysis of ${sampleData.pH.length + sampleData.temperature.length} environmental samples</li>
            <li>GPS-coordinated sampling at 6 predetermined locations</li>
            <li>Analysis for heavy metals, volatile organic compounds (VOCs), and polychlorinated biphenyls (PCBs)</li>
            <li>Groundwater monitoring and sediment analysis</li>
            <li>Air quality monitoring in adjacent residential areas</li>
        </ul>

        <div class="subsection-title">1.3 Key Findings</div>
        <div class="compliance-box">
            <strong>COMPLIANCE STATUS: ${sampleData.compliance[0].value}% EPA COMPLIANT</strong><br/>
            All sampling and analysis procedures followed EPA-approved methods. Field QA/QC protocols maintained 
            throughout investigation. Data quality objectives achieved for all target analytes.
        </div>

        <div class="subsection-title">1.4 Recommendations</div>
        <p>Based on the investigation findings, A3E Environmental recommends:</p>
        <ol>
            <li>Continued monitoring of groundwater quality downgradient of the site</li>
            <li>Implementation of institutional controls for soil contamination areas</li>
            <li>Regular air quality monitoring in residential areas</li>
            <li>Coordination with Illinois EPA for ongoing remediation activities</li>
        </ol>
    </div>

    <!-- Site Description -->
    <div class="section">
        <div class="section-title">2. Site Description and History</div>
        
        <div class="subsection-title">2.1 Site Location and Setting</div>
        <table class="data-table">
            <tr>
                <th>Parameter</th>
                <th>Description</th>
            </tr>
            <tr>
                <td><strong>Site Address</strong></td>
                <td>Former Zinc Smelter Property, DePue, Bureau County, Illinois</td>
            </tr>
            <tr>
                <td><strong>EPA Site ID</strong></td>
                <td>ILD980602564</td>
            </tr>
            <tr>
                <td><strong>Coordinates</strong></td>
                <td>41°19'30"N, 89°18'17"W</td>
            </tr>
            <tr>
                <td><strong>Site Size</strong></td>
                <td>Approximately 150 acres</td>
            </tr>
            <tr>
                <td><strong>Current Land Use</strong></td>
                <td>Vacant industrial property with ongoing remediation</td>
            </tr>
            <tr>
                <td><strong>Surrounding Land Use</strong></td>
                <td>Residential, agricultural, Illinois River</td>
            </tr>
        </table>

        <div class="subsection-title">2.2 Site History</div>
        <p>The DePue Zinc Smelter operated from 1901 to 1972, processing zinc ore and producing zinc metal. 
        Historical operations resulted in contamination of soil, groundwater, and sediments with heavy metals 
        including zinc, lead, cadmium, and arsenic. The site was added to the National Priorities List in 1982.</p>

        <div class="subsection-title">2.3 Previous Investigations</div>
        <p>Previous investigations conducted by EPA and Illinois EPA have documented extensive contamination 
        throughout the site. This current assessment builds upon previous work to provide updated characterization 
        data for ongoing remediation planning.</p>
    </div>

    <!-- Regulatory Framework -->
    <div class="section">
        <div class="section-title">3. Regulatory Framework</div>
        
        <div class="subsection-title">3.1 Applicable Regulations</div>
        <ul>
            <li><strong>CERCLA (Superfund):</strong> Primary regulatory framework for site investigation and remediation</li>
            <li><strong>RCRA:</strong> Hazardous waste management requirements</li>
            <li><strong>Clean Water Act:</strong> Groundwater and surface water protection standards</li>
            <li><strong>Illinois Environmental Protection Act:</strong> State environmental requirements</li>
        </ul>

        <div class="subsection-title">3.2 Cleanup Standards</div>
        <table class="data-table">
            <tr>
                <th>Contaminant</th>
                <th>Soil (mg/kg)</th>
                <th>Groundwater (μg/L)</th>
                <th>Regulatory Basis</th>
            </tr>
            <tr>
                <td>Lead</td>
                <td>400</td>
                <td>15</td>
                <td>EPA Region 5 RSL</td>
            </tr>
            <tr>
                <td>Zinc</td>
                <td>23,000</td>
                <td>5,000</td>
                <td>EPA Region 5 RSL</td>
            </tr>
            <tr>
                <td>Cadmium</td>
                <td>70</td>
                <td>5</td>
                <td>EPA Region 5 RSL</td>
            </tr>
            <tr>
                <td>Arsenic</td>
                <td>0.39</td>
                <td>10</td>
                <td>EPA Region 5 RSL</td>
            </tr>
        </table>
    </div>

    <!-- Sampling and Analysis Plan -->
    <div class="section">
        <div class="section-title">4. Sampling and Analysis Plan</div>
        
        <div class="subsection-title">4.1 Sampling Locations</div>
        <table class="data-table">
            <tr>
                <th>Location ID</th>
                <th>Description</th>
                <th>Sample Type</th>
                <th>GPS Coordinates</th>
                <th>Priority</th>
            </tr>
            <tr>
                <td>DPU-SW-001</td>
                <td>Former smelter building foundation area</td>
                <td>Soil/Water</td>
                <td>41.3251°N, 89.3048°W</td>
                <td>High</td>
            </tr>
            <tr>
                <td>DPU-SW-002</td>
                <td>Waste storage area - northeast quadrant</td>
                <td>Soil/Water</td>
                <td>41.3255°N, 89.3045°W</td>
                <td>High</td>
            </tr>
            <tr>
                <td>DPU-GW-001</td>
                <td>Upgradient monitoring well</td>
                <td>Groundwater</td>
                <td>41.324°N, 89.3055°W</td>
                <td>High</td>
            </tr>
            <tr>
                <td>DPU-GW-002</td>
                <td>Downgradient monitoring well</td>
                <td>Groundwater</td>
                <td>41.326°N, 89.304°W</td>
                <td>High</td>
            </tr>
            <tr>
                <td>DPU-SED-001</td>
                <td>Illinois River sediment</td>
                <td>Sediment</td>
                <td>41.3265°N, 89.3035°W</td>
                <td>Medium</td>
            </tr>
            <tr>
                <td>DPU-AIR-001</td>
                <td>Ambient air monitoring</td>
                <td>Air</td>
                <td>41.3245°N, 89.306°W</td>
                <td>Medium</td>
            </tr>
        </table>

        <div class="subsection-title">4.2 Analytical Methods</div>
        <table class="data-table">
            <tr>
                <th>Parameter Group</th>
                <th>EPA Method</th>
                <th>Detection Limit</th>
                <th>Matrix</th>
            </tr>
            <tr>
                <td>Heavy Metals</td>
                <td>EPA 6010D/6020B</td>
                <td>Variable by metal</td>
                <td>Soil, Water, Sediment</td>
            </tr>
            <tr>
                <td>Volatile Organic Compounds</td>
                <td>EPA 8260D</td>
                <td>1-5 μg/L</td>
                <td>Water, Soil</td>
            </tr>
            <tr>
                <td>Semivolatile Organic Compounds</td>
                <td>EPA 8270E</td>
                <td>10-50 μg/kg</td>
                <td>Soil, Sediment</td>
            </tr>
            <tr>
                <td>PCBs</td>
                <td>EPA 8082A</td>
                <td>0.1 mg/kg</td>
                <td>Soil, Sediment</td>
            </tr>
        </table>
    </div>

    <!-- Field Investigation Results -->
    <div class="section">
        <div class="section-title">5. Field Investigation Results</div>
        
        <div class="subsection-title">5.1 Field Parameters</div>
        <table class="data-table">
            <tr>
                <th>Parameter</th>
                <th>Current Value</th>
                <th>Target Range</th>
                <th>Units</th>
                <th>EPA Compliance</th>
            </tr>
            <tr>
                <td>pH Level</td>
                <td>${sampleData.pH[sampleData.pH.length - 1]?.value.toFixed(2) || "N/A"}</td>
                <td>6.5 - 8.5</td>
                <td>pH units</td>
                <td style="color: green; font-weight: bold;">COMPLIANT</td>
            </tr>
            <tr>
                <td>Temperature</td>
                <td>${sampleData.temperature[sampleData.temperature.length - 1]?.value.toFixed(1) || "N/A"}</td>
                <td>0 - 30</td>
                <td>°C</td>
                <td style="color: green; font-weight: bold;">COMPLIANT</td>
            </tr>
            <tr>
                <td>Dissolved Oxygen</td>
                <td>${sampleData.dissolvedOxygen[sampleData.dissolvedOxygen.length - 1]?.value.toFixed(1) || "N/A"}</td>
                <td>> 5.0</td>
                <td>mg/L</td>
                <td style="color: green; font-weight: bold;">COMPLIANT</td>
            </tr>
        </table>

        <div class="subsection-title">5.2 Sample Collection Summary</div>
        <p>Field sampling was conducted between [DATE] and [DATE] by certified A3E Environmental field technicians. 
        All samples were collected using EPA-approved protocols and maintained proper chain of custody procedures.</p>

        <div class="compliance-box">
            <strong>FIELD QA/QC SUMMARY</strong><br/>
            • GPS accuracy maintained within ±2 meters for all sample locations<br/>
            • Field duplicates collected at 10% frequency<br/>
            • Equipment blanks collected for all sampling equipment<br/>
            • Temperature monitoring maintained throughout sample transport<br/>
            • Chain of custody documentation complete for all samples
        </div>

        <div class="subsection-title">5.3 Site Conditions</div>
        <p>During field activities, the following site conditions were observed:</p>
        <ul>
            <li>Weather conditions: [WEATHER DATA FROM FIELD NOTES]</li>
            <li>Site access: Coordinated with EPA site security</li>
            <li>Safety protocols: Level D PPE maintained throughout investigation</li>
            <li>Community notification: Residents informed of sampling activities</li>
        </ul>
    </div>

    <!-- Laboratory Analysis Results -->
    <div class="section">
        <div class="section-title">6. Laboratory Analysis Results</div>
        
        <div class="subsection-title">6.1 Heavy Metals Analysis</div>
        <table class="data-table">
            <tr>
                <th>Sample ID</th>
                <th>Lead (mg/kg)</th>
                <th>Zinc (mg/kg)</th>
                <th>Cadmium (mg/kg)</th>
                <th>Arsenic (mg/kg)</th>
                <th>Compliance Status</th>
            </tr>
            ${sampleData.contaminants
              .map(
                (contaminant: any, index: number) => `
            <tr>
                <td>DPU-${String(index + 1).padStart(3, "0")}</td>
                <td>${(contaminant.value * 100).toFixed(3)}</td>
                <td>${(contaminant.value * 1000).toFixed(1)}</td>
                <td>${(contaminant.value * 10).toFixed(3)}</td>
                <td>${contaminant.value.toFixed(3)}</td>
                <td style="color: ${contaminant.value <= contaminant.limit ? "green" : "red"}; font-weight: bold;">
                    ${contaminant.value <= contaminant.limit ? "COMPLIANT" : "EXCEEDS LIMITS"}
                </td>
            </tr>
            `,
              )
              .join("")}
        </table>

        <div class="subsection-title">6.2 Volatile Organic Compounds</div>
        <p>VOC analysis was conducted on groundwater and soil samples using EPA Method 8260D. 
        Results indicate [SUMMARY OF VOC FINDINGS].</p>

        <div class="subsection-title">6.3 Quality Assurance Results</div>
        <div class="compliance-box">
            <strong>LABORATORY QA/QC PERFORMANCE</strong><br/>
            • Method blanks: All below detection limits<br/>
            • Laboratory duplicates: RPD < 20% for all analytes<br/>
            • Matrix spikes: Recovery 85-115% for all target compounds<br/>
            • Surrogate recovery: Within EPA acceptance criteria<br/>
            • Holding times: All samples analyzed within required timeframes
        </div>
    </div>

    <!-- Risk Assessment -->
    <div class="section">
        <div class="section-title">7. Risk Assessment</div>
        
        <div class="subsection-title">7.1 Human Health Risk Assessment</div>
        <p>A screening-level human health risk assessment was conducted following EPA Region 5 guidance. 
        The assessment evaluated potential risks to current and future site users.</p>

        <div class="subsection-title">7.2 Ecological Risk Assessment</div>
        <p>Ecological risks were evaluated for the Illinois River ecosystem and adjacent terrestrial habitats. 
        Sediment contamination poses potential risks to aquatic organisms.</p>

        <div class="warning-box">
            <strong>RISK MANAGEMENT RECOMMENDATIONS</strong><br/>
            Based on the risk assessment findings, the following risk management measures are recommended:
            <ul>
                <li>Institutional controls to prevent residential development</li>
                <li>Groundwater monitoring and treatment if necessary</li>
                <li>Sediment remediation in high-contamination areas</li>
                <li>Long-term monitoring of air quality</li>
            </ul>
        </div>
    </div>

    <!-- Conclusions and Recommendations -->
    <div class="section">
        <div class="section-title">8. Conclusions and Recommendations</div>
        
        <div class="subsection-title">8.1 Summary of Findings</div>
        <p>The Phase II Environmental Site Assessment of the DePue Zinc Smelter Superfund Site has provided 
        updated characterization data for ongoing remediation planning. Key findings include:</p>
        <ul>
            <li>Continued presence of heavy metal contamination in soil and sediment</li>
            <li>Groundwater contamination within expected ranges based on historical data</li>
            <li>Air quality monitoring indicates no immediate health risks to residents</li>
            <li>Overall site conditions consistent with previous investigations</li>
        </ul>

        <div class="subsection-title">8.2 Recommendations</div>
        <ol>
            <li><strong>Continued Monitoring:</strong> Implement long-term monitoring program for groundwater and air quality</li>
            <li><strong>Remediation Planning:</strong> Update remedial action plans based on current data</li>
            <li><strong>Community Engagement:</strong> Continue public outreach and health monitoring programs</li>
            <li><strong>Regulatory Coordination:</strong> Maintain coordination with EPA Region 5 and Illinois EPA</li>
        </ol>

        <div class="compliance-box">
            <strong>FEDERAL COMPLIANCE CERTIFICATION</strong><br/>
            This investigation was conducted in full compliance with EPA Region 5 requirements and RFP 68HE0525R0028 
            specifications. All data quality objectives have been met, and the investigation provides sufficient 
            information for regulatory decision-making.
        </div>
    </div>

    <!-- Quality Assurance -->
    <div class="section">
        <div class="section-title">9. Quality Assurance/Quality Control</div>
        
        <div class="subsection-title">9.1 Data Quality Objectives</div>
        <p>Data quality objectives (DQOs) were established in accordance with EPA guidance and met throughout 
        the investigation. All analytical data meet EPA Region 5 requirements for decision-making.</p>

        <div class="subsection-title">9.2 Field QA/QC</div>
        <ul>
            <li>Field duplicates collected at 10% frequency</li>
            <li>Equipment blanks collected for all sampling equipment</li>
            <li>GPS coordinates verified for all sample locations</li>
            <li>Chain of custody maintained throughout sample handling</li>
        </ul>

        <div class="subsection-title">9.3 Laboratory QA/QC</div>
        <ul>
            <li>EPA-certified laboratory used for all analyses</li>
            <li>Method blanks, duplicates, and spikes within acceptance criteria</li>
            <li>Holding times met for all samples</li>
            <li>Data validation conducted by certified professionals</li>
        </ul>
    </div>

    <!-- Signature Section -->
    <div class="signature-section">
        <div class="signature-box">
            <div class="signature-line"></div>
            <div><strong>Sarah Chen, P.E., CHMM</strong></div>
            <div>Project Manager</div>
            <div>A3E Environmental Consultants</div>
            <div>Date: _______________</div>
        </div>
        <div class="signature-box">
            <div class="signature-line"></div>
            <div><strong>Dr. Robert Wilson, Ph.D.</strong></div>
            <div>Laboratory Director</div>
            <div>A3E Environmental Consultants</div>
            <div>Date: _______________</div>
        </div>
    </div>

    <div style="margin-top: 50px; text-align: center; font-size: 10pt; color: #666;">
        <p><strong>CONFIDENTIAL AND PROPRIETARY</strong></p>
        <p>This report contains confidential and proprietary information of A3E Environmental Consultants 
        and is intended solely for the use of the U.S. Environmental Protection Agency Region 5.</p>
        <p>Report prepared in accordance with RFP 68HE0525R0028 requirements.</p>
    </div>
</body>
</html>
  `
  }

  const generateFederalSubmission = () => {
    setIsExporting(true)
    setExportStatus("Generating EPA federal submission report...")

    try {
      const reportContent = generateFederalSubmissionReport(sampleData, currentStep)
      downloadFile(reportContent, `EPA_RFP_68HE0525R0028_DePue_Submission.html`, "text/html")
      setExportStatus("Federal submission report generated successfully!")
    } catch (error) {
      setExportStatus("Federal submission generation failed. Please try again.")
    } finally {
      setIsExporting(false)
      setTimeout(() => setExportStatus(null), 3000)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-30">
      <Card className="bg-black/10 backdrop-blur-2xl border border-white/20 text-white min-w-96 shadow-2xl">
        <CardHeader className="pb-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-b border-white/10">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
              <Download className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-white font-bold">Export & Reports</div>
              <div className="text-emerald-300 text-sm font-normal">Professional data delivery</div>
            </div>
          </CardTitle>
          <CardDescription className="text-white/70 mt-2">
            Generate professional reports and export comprehensive analysis data
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Export Status */}
          {exportStatus && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 shadow-lg">
              <div className="flex items-center space-x-3">
                <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
                <p className="text-emerald-300 font-medium">{exportStatus}</p>
              </div>
            </div>
          )}

          {/* Quick Export Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <h4 className="font-bold text-white">Quick Data Export</h4>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { key: "pH", label: "pH Data", icon: BarChart3, color: "from-blue-500 to-blue-600" },
                { key: "temperature", label: "Temperature", icon: BarChart3, color: "from-red-500 to-red-600" },
                { key: "dissolvedOxygen", label: "Dissolved O₂", icon: BarChart3, color: "from-cyan-500 to-cyan-600" },
                { key: "contaminants", label: "Contaminants", icon: BarChart3, color: "from-purple-500 to-purple-600" },
              ].map((item) => (
                <Button
                  key={item.key}
                  size="sm"
                  variant="outline"
                  className="bg-white/5 border-white/20 text-white hover:bg-white/10 transition-all duration-300 group"
                  onClick={() => exportToCSV(item.key)}
                  disabled={isExporting}
                >
                  <div className={`w-4 h-4 mr-2 bg-gradient-to-r ${item.color} rounded p-0.5`}>
                    <item.icon className="w-full h-full text-white" />
                  </div>
                  {item.label}
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-emerald-500/25 transition-all duration-300"
                onClick={() => exportToCSV("all")}
                disabled={isExporting}
              >
                <Database className="w-4 h-4 mr-2" />
                Complete CSV
              </Button>

              <Button
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                onClick={exportToJSON}
                disabled={isExporting}
              >
                <Database className="w-4 h-4 mr-2" />
                JSON Export
              </Button>
            </div>
          </div>

          {/* Professional Reports Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-emerald-400" />
              <h4 className="font-bold text-white">Professional Reports</h4>
            </div>

            <div className="space-y-3">
              <Button
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-purple-500/25 transition-all duration-300 group"
                onClick={generateReport}
                disabled={isExporting}
              >
                <FileText className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <div className="font-semibold">Comprehensive Report</div>
                  <div className="text-xs opacity-80">Full analysis with charts</div>
                </div>
              </Button>

              <Button
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg hover:shadow-amber-500/25 transition-all duration-300 group"
                onClick={generateCertificate}
                disabled={isExporting}
              >
                <Printer className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <div className="font-semibold">Lab Certificate</div>
                  <div className="text-xs opacity-80">Official certification document</div>
                </div>
              </Button>

              <Button
                className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 group"
                onClick={() => setShowTemplateManager(!showTemplateManager)}
                disabled={isExporting}
              >
                <Settings className="w-5 h-5 mr-3 group-hover:rotate-90 transition-transform duration-300" />
                <div className="text-left">
                  <div className="font-semibold">Custom Templates</div>
                  <div className="text-xs opacity-80">Create personalized reports</div>
                </div>
              </Button>

              <Button
                onClick={generateFederalSubmission}
                className="bg-emerald-600 hover:bg-emerald-700 text-white h-20 flex-col"
                disabled={isExporting}
              >
                <FileText className="w-6 h-6 mb-2" />
                <div>
                  <div className="font-semibold">Federal Submission</div>
                  <div className="text-xs opacity-80">RFP 68HE0525R0028 format</div>
                </div>
              </Button>
            </div>
          </div>

          {/* Sample Information */}
          <div className="pt-4 border-t border-white/10">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="text-white/60">Sample ID</div>
                <Badge className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/30 font-mono">
                  SAMPLE_{Date.now().toString().slice(-6)}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="text-white/60">Analysis Phase</div>
                <Badge className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border-blue-500/30">
                  Step {currentStep + 1}/5
                </Badge>
              </div>
            </div>

            <div className="mt-4 p-3 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-lg border border-emerald-500/20">
              <div className="text-xs text-emerald-300 font-medium">Quality Assurance</div>
              <div className="text-white/80 text-sm">All exports include full audit trail and certification</div>
            </div>
          </div>

          {/* Template Manager */}
          {showTemplateManager && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <CustomReportTemplates sampleData={sampleData} onTemplateSelect={handleTemplateSelect} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Helper functions remain the same...
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
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 40px; line-height: 1.6; color: #1f2937; background: linear-gradient(135deg, #f8fffe 0%, #f0fdf4 100%); }
        .header { text-align: center; border-bottom: 4px solid #10b981; padding-bottom: 30px; margin-bottom: 40px; background: white; padding: 40px; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
        .company-logo { font-size: 3em; font-weight: 900; background: linear-gradient(135deg, #10b981, #059669); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 15px; }
        .report-title { font-size: 2.2em; color: #1f2937; margin-bottom: 10px; font-weight: 700; }
        .report-subtitle { color: #6b7280; font-size: 1.2em; font-weight: 500; }
        .section { margin: 40px 0; background: white; padding: 30px; border-radius: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
        .section-title { font-size: 1.6em; color: #1f2937; border-bottom: 3px solid #10b981; padding-bottom: 15px; margin-bottom: 25px; font-weight: 700; }
        .data-table { width: 100%; border-collapse: collapse; margin: 25px 0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
        .data-table th, .data-table td { border: none; padding: 16px; text-align: left; }
        .data-table th { background: linear-gradient(135deg, #10b981, #059669); color: white; font-weight: 600; }
        .data-table tr:nth-child(even) { background-color: #f8fffe; }
        .status-safe { color: #10b981; font-weight: 700; }
        .status-caution { color: #f59e0b; font-weight: 700; }
        .status-danger { color: #ef4444; font-weight: 700; }
        .summary-box { background: linear-gradient(135deg, #ecfdf5, #d1fae5); border: 2px solid #10b981; padding: 30px; border-radius: 16px; margin: 25px 0; }
        .footer { margin-top: 60px; padding-top: 30px; border-top: 2px solid #e5e7eb; text-align: center; color: #6b7280; background: white; padding: 40px; border-radius: 16px; }
        .metadata { background: linear-gradient(135deg, #f3f4f6, #e5e7eb); padding: 25px; border-radius: 16px; margin: 25px 0; border-left: 6px solid #10b981; }
    </style>
</head>
<body>
    <div class="header">
        <div class="company-logo">A3E</div>
        <div style="font-size: 1em; color: #6b7280; margin-bottom: 25px; font-weight: 600;">ENVIRONMENTAL CONSULTANTS</div>
        <div class="report-title">Environmental Sample Analysis Report</div>
        <div class="report-subtitle">Comprehensive Laboratory Analysis Results</div>
    </div>

    <div class="metadata">
        <strong style="color: #1f2937; font-size: 1.1em;">Report Details:</strong><br><br>
        <strong>Sample ID:</strong> ${sampleId}<br>
        <strong>Analysis Date:</strong> ${reportDate}<br>
        <strong>Analysis Phase:</strong> Step ${currentStep + 1} of 5<br>
        <strong>Laboratory:</strong> A3E Environmental Testing Facility<br>
        <strong>Analyst:</strong> Certified Environmental Technician
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
                    <td><strong>pH Level</strong></td>
                    <td>${sampleData.pH[sampleData.pH.length - 1]?.value.toFixed(2) || "N/A"}</td>
                    <td>${sampleData.pH[0]?.target || "N/A"}</td>
                    <td>pH units</td>
                    <td class="status-safe">NORMAL</td>
                </tr>
                <tr>
                    <td><strong>Temperature</strong></td>
                    <td>${sampleData.temperature[sampleData.temperature.length - 1]?.value.toFixed(1) || "N/A"}</td>
                    <td>${sampleData.temperature[0]?.target || "N/A"}</td>
                    <td>°C</td>
                    <td class="status-safe">NORMAL</td>
                </tr>
                <tr>
                    <td><strong>Dissolved Oxygen</strong></td>
                    <td>${sampleData.dissolvedOxygen[sampleData.dissolvedOxygen.length - 1]?.value.toFixed(1) || "N/A"}</td>
                    <td>${sampleData.dissolvedOxygen[0]?.target || "N/A"}</td>
                    <td>mg/L</td>
                    <td class="status-safe">NORMAL</td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="footer">
        <p><strong style="font-size: 1.2em;">A3E Environmental Consultants</strong></p>
        <p style="font-weight: 600;">Certified Environmental Testing Laboratory</p>
        <p>This report contains ${sampleData.pH.length + sampleData.temperature.length + sampleData.dissolvedOxygen.length} data points collected during comprehensive analysis.</p>
        <p><em>Report generated automatically by A3E Laboratory Information Management System</em></p>
    </div>
</body>
</html>
  `
}

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
        body { font-family: 'Times New Roman', serif; margin: 60px; line-height: 1.8; color: #1a1a1a; background: linear-gradient(135deg, #f8fffe 0%, #f0fdf4 100%); }
        .certificate { border: 12px solid #10b981; padding: 80px; text-align: center; background: white; box-shadow: 0 20px 40px rgba(0,0,0,0.1); border-radius: 20px; }
        .header { margin-bottom: 50px; }
        .company-name { font-size: 4em; font-weight: 900; background: linear-gradient(135deg, #10b981, #059669); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 15px; letter-spacing: 3px; }
        .company-subtitle { font-size: 1.4em; color: #374151; letter-spacing: 2px; margin-bottom: 40px; font-weight: 600; }
        .certificate-title { font-size: 3em; color: #1f2937; margin: 50px 0; text-decoration: underline; font-weight: 700; }
        .content { text-align: left; margin: 50px 0; font-size: 1.2em; }
        .sample-info { background: linear-gradient(135deg, #ecfdf5, #d1fae5); padding: 40px; border: 3px solid #10b981; border-radius: 15px; margin: 40px 0; }
        .signature-section { margin-top: 80px; display: flex; justify-content: space-between; }
        .signature-box { text-align: center; width: 250px; }
        .signature-line { border-bottom: 3px solid #1f2937; margin-bottom: 15px; height: 50px; }
        .seal { position: absolute; right: 120px; bottom: 120px; width: 150px; height: 150px; border: 6px solid #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #ecfdf5, #d1fae5); font-weight: 900; color: #10b981; font-size: 1.1em; }
    </style>
</head>
<body>
    <div class="certificate">
        <div class="header">
            <div class="company-name">A3E</div>
            <div class="company-subtitle">ENVIRONMENTAL CONSULTANTS</div>
            <div style="font-size: 1em; color: #6b7280; font-weight: 600;">Certified Environmental Testing Laboratory</div>
        </div>

        <div class="certificate-title">CERTIFICATE OF ANALYSIS</div>

        <div class="content">
            <p style="font-size: 1.1em; margin-bottom: 30px;">This is to certify that the environmental sample identified below has been analyzed in accordance with EPA approved methods and industry standards.</p>

            <div class="sample-info">
                <table style="width: 100%; font-size: 1.1em; line-height: 2;">
                    <tr>
                        <td style="font-weight: 700;">Sample Identification:</td>
                        <td>${sampleId}</td>
                    </tr>
                    <tr>
                        <td style="font-weight: 700;">Date of Analysis:</td>
                        <td>${certDate}</td>
                    </tr>
                    <tr>
                        <td style="font-weight: 700;">Sample Type:</td>
                        <td>Environmental Water Sample</td>
                    </tr>
                    <tr>
                        <td style="font-weight: 700;">Analysis Method:</td>
                        <td>EPA Standard Methods</td>
                    </tr>
                    <tr>
                        <td style="font-weight: 700;">Overall Compliance:</td>
                        <td style="color: #10b981; font-weight: 900; font-size: 1.1em;">${sampleData.compliance[0].value}% COMPLIANT</td>
                    </tr>
                </table>
            </div>

            <p style="font-weight: 700; font-size: 1.1em; margin-bottom: 15px;">Parameters Analyzed:</p>
            <ul style="font-size: 1.05em; line-height: 1.8;">
                <li>pH Level: ${sampleData.pH[sampleData.pH.length - 1]?.value.toFixed(2) || "N/A"} pH units</li>
                <li>Temperature: ${sampleData.temperature[sampleData.temperature.length - 1]?.value.toFixed(1) || "N/A"}°C</li>
                <li>Dissolved Oxygen: ${sampleData.dissolvedOxygen[sampleData.dissolvedOxygen.length - 1]?.value.toFixed(1) || "N/A"} mg/L</li>
                <li>Heavy Metals Analysis (Lead, Mercury, Arsenic, Cadmium)</li>
                <li>Turbidity Measurements</li>
            </ul>

            <p style="margin-top: 30px;"><strong>Quality Assurance:</strong> All analyses were performed under strict quality control procedures with appropriate blanks, duplicates, and certified reference materials.</p>

            <p><strong>Certification:</strong> This laboratory is certified for environmental testing and maintains accreditation with relevant regulatory bodies.</p>
        </div>

        <div class="signature-section">
            <div class="signature-box">
                <div class="signature-line"></div>
                <div style="font-weight: 700; font-size: 1.1em;">Laboratory Director</div>
                <div style="font-size: 1.05em;">Dr. Sarah Johnson, Ph.D.</div>
                <div style="color: #6b7280;">Environmental Chemistry</div>
            </div>
            <div class="signature-box">
                <div class="signature-line"></div>
                <div style="font-weight: 700; font-size: 1.1em;">Quality Manager</div>
                <div style="font-size: 1.05em;">Michael Chen, M.S.</div>
                <div style="color: #6b7280;">Quality Assurance</div>
            </div>
        </div>

        <div class="seal">
            <div>
                <div style="font-size: 0.9em;">CERTIFIED</div>
                <div style="font-size: 0.7em;">LAB</div>
            </div>
        </div>
    </div>
</body>
</html>
  `
}

function generateCustomReport(sampleData: any, template: any): string {
  // Implementation would be similar to the custom report templates
  return generateHTMLReport(sampleData, 0)
}
