"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Copy, Eye, Save, FileText, Download } from "lucide-react"

interface ReportTemplate {
  id: string
  name: string
  description: string
  createdAt: string
  lastModified: string
  sections: {
    executiveSummary: boolean
    sampleInfo: boolean
    waterQuality: boolean
    contaminants: boolean
    compliance: boolean
    qualityAssurance: boolean
    charts: boolean
    recommendations: boolean
  }
  styling: {
    colorScheme: "professional" | "environmental" | "minimal" | "corporate"
    logoPosition: "left" | "center" | "right"
    fontSize: "small" | "medium" | "large"
    includeCharts: boolean
    includeSignatures: boolean
    includeCertification: boolean
  }
  customFields: {
    companyName: string
    labDirector: string
    qualityManager: string
    customHeader: string
    customFooter: string
    additionalNotes: string
  }
}

interface CustomReportTemplatesProps {
  sampleData: any
  onTemplateSelect: (template: ReportTemplate) => void
}

const defaultTemplate: ReportTemplate = {
  id: "default",
  name: "Standard Environmental Report",
  description: "Default comprehensive environmental analysis report",
  createdAt: new Date().toISOString(),
  lastModified: new Date().toISOString(),
  sections: {
    executiveSummary: true,
    sampleInfo: true,
    waterQuality: true,
    contaminants: true,
    compliance: true,
    qualityAssurance: true,
    charts: true,
    recommendations: true,
  },
  styling: {
    colorScheme: "professional",
    logoPosition: "left",
    fontSize: "medium",
    includeCharts: true,
    includeSignatures: true,
    includeCertification: true,
  },
  customFields: {
    companyName: "A3E Environmental Consultants",
    labDirector: "Dr. Sarah Johnson, Ph.D.",
    qualityManager: "Michael Chen, M.S.",
    customHeader: "",
    customFooter: "",
    additionalNotes: "",
  },
}

export default function CustomReportTemplates({ sampleData, onTemplateSelect }: CustomReportTemplatesProps) {
  const [templates, setTemplates] = useState<ReportTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<ReportTemplate>(defaultTemplate)
  const [previewContent, setPreviewContent] = useState("")

  // Load templates from localStorage on component mount
  useEffect(() => {
    const savedTemplates = localStorage.getItem("reportTemplates")
    if (savedTemplates) {
      setTemplates(JSON.parse(savedTemplates))
    } else {
      setTemplates([defaultTemplate])
    }
  }, [])

  // Save templates to localStorage
  const saveTemplates = (newTemplates: ReportTemplate[]) => {
    setTemplates(newTemplates)
    localStorage.setItem("reportTemplates", JSON.stringify(newTemplates))
  }

  // Create new template
  const createNewTemplate = () => {
    const newTemplate: ReportTemplate = {
      ...defaultTemplate,
      id: `template_${Date.now()}`,
      name: "New Custom Template",
      description: "Custom report template",
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    }
    setEditingTemplate(newTemplate)
    setIsEditing(true)
  }

  // Edit existing template
  const editTemplate = (template: ReportTemplate) => {
    setEditingTemplate({ ...template })
    setIsEditing(true)
  }

  // Save template
  const saveTemplate = () => {
    const updatedTemplate = {
      ...editingTemplate,
      lastModified: new Date().toISOString(),
    }

    const existingIndex = templates.findIndex((t) => t.id === updatedTemplate.id)
    let newTemplates: ReportTemplate[]

    if (existingIndex >= 0) {
      newTemplates = [...templates]
      newTemplates[existingIndex] = updatedTemplate
    } else {
      newTemplates = [...templates, updatedTemplate]
    }

    saveTemplates(newTemplates)
    setIsEditing(false)
    setSelectedTemplate(updatedTemplate)
  }

  // Delete template
  const deleteTemplate = (templateId: string) => {
    if (templateId === "default") return // Prevent deleting default template
    const newTemplates = templates.filter((t) => t.id !== templateId)
    saveTemplates(newTemplates)
    if (selectedTemplate?.id === templateId) {
      setSelectedTemplate(null)
    }
  }

  // Duplicate template
  const duplicateTemplate = (template: ReportTemplate) => {
    const duplicatedTemplate: ReportTemplate = {
      ...template,
      id: `template_${Date.now()}`,
      name: `${template.name} (Copy)`,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    }
    const newTemplates = [...templates, duplicatedTemplate]
    saveTemplates(newTemplates)
  }

  // Generate preview
  const generatePreview = (template: ReportTemplate) => {
    const preview = generateCustomReport(sampleData, template)
    setPreviewContent(preview)
  }

  // Apply template and generate report
  const applyTemplate = (template: ReportTemplate) => {
    onTemplateSelect(template)
    setSelectedTemplate(template)
  }

  return (
    <div className="space-y-4">
      <Card className="bg-black/80 backdrop-blur-md border-white/20 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Custom Report Templates
          </CardTitle>
          <CardDescription className="text-white/70">
            Create and manage custom report formats for different clients and requirements
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="templates" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/10">
              <TabsTrigger value="templates" className="text-white">
                Templates
              </TabsTrigger>
              <TabsTrigger value="editor" className="text-white">
                Editor
              </TabsTrigger>
              <TabsTrigger value="preview" className="text-white">
                Preview
              </TabsTrigger>
            </TabsList>

            {/* Templates Tab */}
            <TabsContent value="templates" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Saved Templates</h3>
                <Button onClick={createNewTemplate} size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="w-4 h-4 mr-2" />
                  New Template
                </Button>
              </div>

              <div className="grid gap-3 max-h-60 overflow-y-auto">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={`p-4 rounded-lg border transition-all ${
                      selectedTemplate?.id === template.id
                        ? "border-emerald-500 bg-emerald-500/10"
                        : "border-white/20 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold">{template.name}</h4>
                        <p className="text-sm text-white/70">{template.description}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => generatePreview(template)}
                          className="text-white hover:bg-white/20"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => editTemplate(template)}
                          className="text-white hover:bg-white/20"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => duplicateTemplate(template)}
                          className="text-white hover:bg-white/20"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        {template.id !== "default" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteTemplate(template.id)}
                            className="text-red-400 hover:bg-red-500/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <Badge variant="outline" className="border-white/20 text-white text-xs">
                          {Object.values(template.sections).filter(Boolean).length} sections
                        </Badge>
                        <Badge variant="outline" className="border-white/20 text-white text-xs">
                          {template.styling.colorScheme}
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => applyTemplate(template)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Use Template
                      </Button>
                    </div>

                    <div className="text-xs text-white/50 mt-2">
                      Modified: {new Date(template.lastModified).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Editor Tab */}
            <TabsContent value="editor" className="space-y-4">
              {isEditing ? (
                <TemplateEditor
                  template={editingTemplate}
                  onChange={setEditingTemplate}
                  onSave={saveTemplate}
                  onCancel={() => setIsEditing(false)}
                />
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 mx-auto text-white/50 mb-4" />
                  <p className="text-white/70 mb-4">Select a template to edit or create a new one</p>
                  <Button onClick={createNewTemplate} className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Template
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Preview Tab */}
            <TabsContent value="preview" className="space-y-4">
              {previewContent ? (
                <div className="bg-white text-black p-4 rounded-lg max-h-96 overflow-y-auto">
                  <div dangerouslySetInnerHTML={{ __html: previewContent }} />
                </div>
              ) : (
                <div className="text-center py-8">
                  <Eye className="w-12 h-12 mx-auto text-white/50 mb-4" />
                  <p className="text-white/70">Select a template and click preview to see the report format</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

// Template Editor Component
function TemplateEditor({
  template,
  onChange,
  onSave,
  onCancel,
}: {
  template: ReportTemplate
  onChange: (template: ReportTemplate) => void
  onSave: () => void
  onCancel: () => void
}) {
  const updateTemplate = (updates: Partial<ReportTemplate>) => {
    onChange({ ...template, ...updates })
  }

  const updateSections = (sectionUpdates: Partial<ReportTemplate["sections"]>) => {
    onChange({
      ...template,
      sections: { ...template.sections, ...sectionUpdates },
    })
  }

  const updateStyling = (stylingUpdates: Partial<ReportTemplate["styling"]>) => {
    onChange({
      ...template,
      styling: { ...template.styling, ...stylingUpdates },
    })
  }

  const updateCustomFields = (fieldUpdates: Partial<ReportTemplate["customFields"]>) => {
    onChange({
      ...template,
      customFields: { ...template.customFields, ...fieldUpdates },
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Template Editor</h3>
        <div className="flex gap-2">
          <Button
            onClick={onCancel}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/20 bg-transparent"
          >
            Cancel
          </Button>
          <Button onClick={onSave} className="bg-emerald-600 hover:bg-emerald-700">
            <Save className="w-4 h-4 mr-2" />
            Save Template
          </Button>
        </div>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white/10">
          <TabsTrigger value="basic" className="text-white">
            Basic
          </TabsTrigger>
          <TabsTrigger value="sections" className="text-white">
            Sections
          </TabsTrigger>
          <TabsTrigger value="styling" className="text-white">
            Styling
          </TabsTrigger>
          <TabsTrigger value="custom" className="text-white">
            Custom
          </TabsTrigger>
        </TabsList>

        {/* Basic Settings */}
        <TabsContent value="basic" className="space-y-4">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="templateName" className="text-white">
                Template Name
              </Label>
              <Input
                id="templateName"
                value={template.name}
                onChange={(e) => updateTemplate({ name: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <div>
              <Label htmlFor="templateDescription" className="text-white">
                Description
              </Label>
              <Textarea
                id="templateDescription"
                value={template.description}
                onChange={(e) => updateTemplate({ description: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
                rows={3}
              />
            </div>
          </div>
        </TabsContent>

        {/* Sections Settings */}
        <TabsContent value="sections" className="space-y-4">
          <div className="grid gap-4">
            <h4 className="font-semibold text-white">Report Sections</h4>
            {Object.entries(template.sections).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <Label htmlFor={key} className="text-white capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </Label>
                <Switch
                  id={key}
                  checked={value}
                  onCheckedChange={(checked) => updateSections({ [key]: checked } as any)}
                />
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Styling Settings */}
        <TabsContent value="styling" className="space-y-4">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="colorScheme" className="text-white">
                Color Scheme
              </Label>
              <Select
                value={template.styling.colorScheme}
                onValueChange={(value: any) => updateStyling({ colorScheme: value })}
              >
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="environmental">Environmental</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="corporate">Corporate</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="logoPosition" className="text-white">
                Logo Position
              </Label>
              <Select
                value={template.styling.logoPosition}
                onValueChange={(value: any) => updateStyling({ logoPosition: value })}
              >
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="fontSize" className="text-white">
                Font Size
              </Label>
              <Select
                value={template.styling.fontSize}
                onValueChange={(value: any) => updateStyling({ fontSize: value })}
              >
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="includeCharts" className="text-white">
                  Include Charts
                </Label>
                <Switch
                  id="includeCharts"
                  checked={template.styling.includeCharts}
                  onCheckedChange={(checked) => updateStyling({ includeCharts: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="includeSignatures" className="text-white">
                  Include Signatures
                </Label>
                <Switch
                  id="includeSignatures"
                  checked={template.styling.includeSignatures}
                  onCheckedChange={(checked) => updateStyling({ includeSignatures: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="includeCertification" className="text-white">
                  Include Certification
                </Label>
                <Switch
                  id="includeCertification"
                  checked={template.styling.includeCertification}
                  onCheckedChange={(checked) => updateStyling({ includeCertification: checked })}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Custom Fields */}
        <TabsContent value="custom" className="space-y-4">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="companyName" className="text-white">
                Company Name
              </Label>
              <Input
                id="companyName"
                value={template.customFields.companyName}
                onChange={(e) => updateCustomFields({ companyName: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>

            <div>
              <Label htmlFor="labDirector" className="text-white">
                Lab Director
              </Label>
              <Input
                id="labDirector"
                value={template.customFields.labDirector}
                onChange={(e) => updateCustomFields({ labDirector: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>

            <div>
              <Label htmlFor="qualityManager" className="text-white">
                Quality Manager
              </Label>
              <Input
                id="qualityManager"
                value={template.customFields.qualityManager}
                onChange={(e) => updateCustomFields({ qualityManager: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>

            <div>
              <Label htmlFor="customHeader" className="text-white">
                Custom Header
              </Label>
              <Textarea
                id="customHeader"
                value={template.customFields.customHeader}
                onChange={(e) => updateCustomFields({ customHeader: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="customFooter" className="text-white">
                Custom Footer
              </Label>
              <Textarea
                id="customFooter"
                value={template.customFields.customFooter}
                onChange={(e) => updateCustomFields({ customFooter: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="additionalNotes" className="text-white">
                Additional Notes
              </Label>
              <Textarea
                id="additionalNotes"
                value={template.customFields.additionalNotes}
                onChange={(e) => updateCustomFields({ additionalNotes: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
                rows={3}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Generate custom report based on template
function generateCustomReport(sampleData: any, template: ReportTemplate): string {
  const reportDate = new Date().toLocaleString()
  const sampleId = `SAMPLE_${Date.now()}`

  // Color schemes
  const colorSchemes = {
    professional: {
      primary: "#1f2937",
      secondary: "#6b7280",
      accent: "#3b82f6",
      background: "#f9fafb",
    },
    environmental: {
      primary: "#065f46",
      secondary: "#047857",
      accent: "#22c55e",
      background: "#f0fdf4",
    },
    minimal: {
      primary: "#000000",
      secondary: "#6b7280",
      accent: "#374151",
      background: "#ffffff",
    },
    corporate: {
      primary: "#7c2d12",
      secondary: "#a16207",
      accent: "#dc2626",
      background: "#fef7ed",
    },
  }

  const colors = colorSchemes[template.styling.colorScheme]
  const fontSize =
    template.styling.fontSize === "small" ? "0.9em" : template.styling.fontSize === "large" ? "1.2em" : "1em"

  let html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Environmental Analysis Report - ${sampleId}</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 40px; 
            line-height: 1.6; 
            color: ${colors.primary}; 
            background-color: ${colors.background};
            font-size: ${fontSize};
        }
        .header { 
            text-align: ${template.styling.logoPosition}; 
            border-bottom: 3px solid ${colors.accent}; 
            padding-bottom: 20px; 
            margin-bottom: 30px; 
        }
        .company-logo { 
            font-size: 2.5em; 
            font-weight: bold; 
            color: ${colors.accent}; 
            margin-bottom: 10px; 
        }
        .report-title { 
            font-size: 1.8em; 
            color: ${colors.primary}; 
            margin-bottom: 5px; 
        }
        .section { margin: 30px 0; }
        .section-title { 
            font-size: 1.4em; 
            color: ${colors.primary}; 
            border-bottom: 2px solid ${colors.secondary}; 
            padding-bottom: 10px; 
            margin-bottom: 20px; 
        }
        .data-table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 20px 0; 
        }
        .data-table th, .data-table td { 
            border: 1px solid ${colors.secondary}; 
            padding: 12px; 
            text-align: left; 
        }
        .data-table th { 
            background-color: ${colors.accent}; 
            color: white; 
            font-weight: bold; 
        }
        .custom-header { 
            background-color: ${colors.accent}; 
            color: white; 
            padding: 15px; 
            border-radius: 8px; 
            margin: 20px 0; 
        }
        .custom-footer { 
            margin-top: 50px; 
            padding-top: 20px; 
            border-top: 1px solid ${colors.secondary}; 
            text-align: center; 
            color: ${colors.secondary}; 
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="company-logo">${template.customFields.companyName.split(" ")[0] || "A3E"}</div>
        <div style="font-size: 0.9em; color: ${colors.secondary}; margin-bottom: 20px;">
            ${template.customFields.companyName || "ENVIRONMENTAL CONSULTANTS"}
        </div>
        <div class="report-title">Environmental Sample Analysis Report</div>
        <div style="color: ${colors.secondary};">Comprehensive Laboratory Analysis Results</div>
    </div>

    ${template.customFields.customHeader ? `<div class="custom-header">${template.customFields.customHeader}</div>` : ""}

    <div style="background-color: ${colors.background}; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid ${colors.secondary};">
        <strong>Report Details:</strong><br>
        Sample ID: ${sampleId}<br>
        Analysis Date: ${reportDate}<br>
        Laboratory: ${template.customFields.companyName}<br>
        ${template.customFields.labDirector ? `Lab Director: ${template.customFields.labDirector}<br>` : ""}
        ${template.customFields.qualityManager ? `Quality Manager: ${template.customFields.qualityManager}<br>` : ""}
    </div>
  `

  // Add sections based on template configuration
  if (template.sections.executiveSummary) {
    html += `
    <div class="section">
        <div class="section-title">Executive Summary</div>
        <div style="background-color: ${colors.background}; border: 1px solid ${colors.accent}; padding: 20px; border-radius: 8px;">
            <p><strong>Overall Compliance Status:</strong> ${sampleData.compliance[0].value}% Compliant</p>
            <p><strong>Critical Parameters:</strong> All major environmental parameters analyzed according to standards.</p>
            <p><strong>Recommendations:</strong> Continue monitoring for parameters showing caution levels.</p>
        </div>
    </div>
    `
  }

  if (template.sections.waterQuality) {
    html += `
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
                    <td style="color: ${colors.accent}; font-weight: bold;">NORMAL</td>
                </tr>
                <tr>
                    <td>Temperature</td>
                    <td>${sampleData.temperature[sampleData.temperature.length - 1]?.value.toFixed(1) || "N/A"}</td>
                    <td>${sampleData.temperature[0]?.target || "N/A"}</td>
                    <td>°C</td>
                    <td style="color: ${colors.accent}; font-weight: bold;">NORMAL</td>
                </tr>
                <tr>
                    <td>Dissolved Oxygen</td>
                    <td>${sampleData.dissolvedOxygen[sampleData.dissolvedOxygen.length - 1]?.value.toFixed(1) || "N/A"}</td>
                    <td>${sampleData.dissolvedOxygen[0]?.target || "N/A"}</td>
                    <td>mg/L</td>
                    <td style="color: ${colors.accent}; font-weight: bold;">NORMAL</td>
                </tr>
            </tbody>
        </table>
    </div>
    `
  }

  if (template.sections.contaminants) {
    html += `
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
                    <td style="color: ${contaminant.value <= contaminant.limit ? colors.accent : "#dc2626"}; font-weight: bold;">
                        ${contaminant.value <= contaminant.limit ? "COMPLIANT" : "NON-COMPLIANT"}
                    </td>
                </tr>
                `,
                  )
                  .join("")}
            </tbody>
        </table>
    </div>
    `
  }

  if (template.customFields.additionalNotes) {
    html += `
    <div class="section">
        <div class="section-title">Additional Notes</div>
        <p>${template.customFields.additionalNotes}</p>
    </div>
    `
  }

  if (template.styling.includeSignatures) {
    html += `
    <div style="margin-top: 60px; display: flex; justify-content: space-between;">
        <div style="text-align: center; width: 200px;">
            <div style="border-bottom: 2px solid ${colors.primary}; margin-bottom: 10px; height: 40px;"></div>
            <div><strong>Laboratory Director</strong></div>
            <div>${template.customFields.labDirector}</div>
        </div>
        <div style="text-align: center; width: 200px;">
            <div style="border-bottom: 2px solid ${colors.primary}; margin-bottom: 10px; height: 40px;"></div>
            <div><strong>Quality Manager</strong></div>
            <div>${template.customFields.qualityManager}</div>
        </div>
    </div>
    `
  }

  html += `
    ${template.customFields.customFooter ? `<div class="custom-footer">${template.customFields.customFooter}</div>` : ""}
    
    <div class="custom-footer">
        <p><strong>${template.customFields.companyName}</strong></p>
        <p>Generated using custom template: ${template.name}</p>
        <p><em>Report generated automatically by Laboratory Information Management System</em></p>
    </div>
</body>
</html>
  `

  return html
}
