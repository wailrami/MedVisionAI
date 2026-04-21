"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useDropzone } from "react-dropzone"
import { 
  Upload, 
  FileVolume2, 
  Brain, 
  Scan,
  CheckCircle2,
  Loader2,
  Layers,
  Box,
  FileText,
  Activity,
  Target,
  Sparkles,
  User,
  Calendar,
  Languages
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GlassCard } from "@/components/ui/glass-card"
import { AILoader } from "@/components/ui/ai-loader"
import { MRI2DViewer } from "@/components/analysis/mri-2d-viewer"
import { Viewer3D } from "@/components/analysis/viewer-3d"
import { ReportPanel } from "@/components/analysis/report-panel"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type AnalysisStage = "upload" | "processing" | "results"

interface PatientInfo {
  fullName: string
  age: string
  gender: "male" | "female" | ""
  modality: string
  bodyRegion: string
  reportLanguage: "fr" | "en" | "ar"
}

interface Finding {
  id: string
  title: string
  description: string
  severity: "normal" | "mild" | "moderate" | "severe"
  location: string
}

interface Disease {
  name: string
  confidence: number
  description: string
}

interface AnalysisResult {
  findings: Finding[]
  impression: string
  diseases: Disease[]
  metadata: {
    scanType: string
    sliceCount: number
    dimensions: string
    patientId: string
    studyDate: string
  }
  patientInfo?: PatientInfo
}

// Fake analysis results for demo
const fakeAnalysisResult: AnalysisResult = {
  findings: [
    {
      id: "f1",
      title: "White Matter Hyperintensities",
      description: "Multiple small foci of T2/FLAIR hyperintensity in the periventricular white matter, likely representing chronic microvascular ischemic changes.",
      severity: "mild",
      location: "Periventricular white matter"
    },
    {
      id: "f2", 
      title: "Mild Ventricular Enlargement",
      description: "Lateral ventricles appear mildly prominent, likely age-related volume loss.",
      severity: "mild",
      location: "Lateral ventricles"
    },
    {
      id: "f3",
      title: "No Acute Infarct",
      description: "No evidence of acute ischemic changes on diffusion-weighted imaging.",
      severity: "normal",
      location: "Global"
    },
    {
      id: "f4",
      title: "No Hemorrhage",
      description: "No evidence of intracranial hemorrhage or mass effect.",
      severity: "normal",
      location: "Global"
    }
  ],
  impression: "MRI brain demonstrates mild chronic microvascular ischemic changes in the periventricular white matter, consistent with patient age and clinical history. No acute intracranial abnormality. No mass, hemorrhage, or midline shift. Recommend clinical correlation and follow-up as clinically indicated.",
  diseases: [
    {
      name: "Chronic Microvascular Ischemia",
      confidence: 0.89,
      description: "Small vessel disease affecting the white matter"
    },
    {
      name: "Age-Related Volume Loss",
      confidence: 0.76,
      description: "Expected cerebral atrophy for patient age"
    },
    {
      name: "Acute Stroke",
      confidence: 0.02,
      description: "No evidence of acute ischemic event"
    }
  ],
  metadata: {
    scanType: "MRI Brain with Contrast",
    sliceCount: 120,
    dimensions: "256 x 256 x 120",
    patientId: "PT-2024-0847",
    studyDate: new Date().toLocaleDateString()
  }
}

const modalities = [
  { value: "mri", label: "IRM (MRI)" },
  { value: "ct", label: "Scanner (CT)" },
  { value: "xray", label: "Radiographie (X-Ray)" },
  { value: "pet", label: "PET Scan" },
  { value: "ultrasound", label: "Echographie" },
]

const bodyRegions = [
  { value: "brain", label: "Cerveau / Brain" },
  { value: "chest", label: "Thorax / Chest" },
  { value: "abdomen", label: "Abdomen" },
  { value: "spine", label: "Colonne Vertebrale / Spine" },
  { value: "pelvis", label: "Bassin / Pelvis" },
  { value: "knee", label: "Genou / Knee" },
  { value: "shoulder", label: "Epaule / Shoulder" },
  { value: "whole-body", label: "Corps Entier / Whole Body" },
]

const reportLanguages = [
  { value: "fr", label: "Francais" },
  { value: "en", label: "English" },
  { value: "ar", label: "العربية" },
]

function UploadStage({ onUpload }: { onUpload: (files: File[], patientInfo: PatientInfo) => void }) {
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    fullName: "",
    age: "",
    gender: "",
    modality: "",
    bodyRegion: "",
    reportLanguage: "fr",
  })

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0 && patientInfo.fullName && patientInfo.modality && patientInfo.bodyRegion) {
      onUpload(acceptedFiles, patientInfo)
    }
  }, [onUpload, patientInfo])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/dicom': ['.dcm', '.dicom'],
      'application/x-nifti': ['.nii', '.nii.gz'],
      'application/zip': ['.zip']
    },
    multiple: true
  })

  const canUpload = patientInfo.fullName && patientInfo.modality && patientInfo.bodyRegion

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 mb-4">
            <Brain className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Analyse IA des Images Medicales</h1>
          <p className="text-muted-foreground">
            Remplissez les informations patient puis televersez vos fichiers
          </p>
        </div>

        {/* Patient Information Form */}
        <GlassCard className="mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Informations du Patient
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nom Complet *</Label>
              <Input
                id="fullName"
                placeholder="Ex: Ahmed Benali"
                value={patientInfo.fullName}
                onChange={(e) => setPatientInfo(prev => ({ ...prev, fullName: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Ex: 45"
                  value={patientInfo.age}
                  onChange={(e) => setPatientInfo(prev => ({ ...prev, age: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Sexe</Label>
                <Select
                  value={patientInfo.gender}
                  onValueChange={(value) => setPatientInfo(prev => ({ ...prev, gender: value as "male" | "female" }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Homme</SelectItem>
                    <SelectItem value="female">Femme</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="modality">Modalite *</Label>
              <Select
                value={patientInfo.modality}
                onValueChange={(value) => setPatientInfo(prev => ({ ...prev, modality: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir la modalite" />
                </SelectTrigger>
                <SelectContent>
                  {modalities.map((m) => (
                    <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bodyRegion">Region Anatomique *</Label>
              <Select
                value={patientInfo.bodyRegion}
                onValueChange={(value) => setPatientInfo(prev => ({ ...prev, bodyRegion: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir la region" />
                </SelectTrigger>
                <SelectContent>
                  {bodyRegions.map((r) => (
                    <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reportLanguage" className="flex items-center gap-2">
                <Languages className="w-4 h-4" />
                Langue du Rapport
              </Label>
              <Select
                value={patientInfo.reportLanguage}
                onValueChange={(value) => setPatientInfo(prev => ({ ...prev, reportLanguage: value as "fr" | "en" | "ar" }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir la langue" />
                </SelectTrigger>
                <SelectContent>
                  {reportLanguages.map((l) => (
                    <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </GlassCard>

        <div
          {...getRootProps()}
          className={cn(
            "relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300",
            !canUpload && "opacity-50 cursor-not-allowed",
            isDragActive 
              ? "border-primary bg-primary/10 scale-[1.02]" 
              : "border-white/20 hover:border-primary/50 hover:bg-white/5"
          )}
        >
          <input {...getInputProps()} disabled={!canUpload} />
          
          <motion.div
            animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
            className="flex flex-col items-center"
          >
            <div className={cn(
              "w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-colors",
              isDragActive ? "bg-primary/20" : "bg-white/10"
            )}>
              <Upload className={cn(
                "w-10 h-10 transition-colors",
                isDragActive ? "text-primary" : "text-muted-foreground"
              )} />
            </div>
            
            <h3 className="text-xl font-semibold mb-2">
              {!canUpload 
                ? "Remplissez les champs obligatoires (*)" 
                : isDragActive 
                  ? "Deposez les fichiers ici" 
                  : "Glissez-deposez vos fichiers"
              }
            </h3>
            <p className="text-muted-foreground mb-4">
              ou cliquez pour parcourir vos fichiers
            </p>
            
            <div className="flex flex-wrap justify-center gap-2">
              {["DICOM", "NIfTI", "ZIP Archive"].map((format) => (
                <span 
                  key={format}
                  className="px-3 py-1 text-xs bg-white/10 rounded-full text-muted-foreground"
                >
                  {format}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Quick demo button */}
        <div className="mt-6 text-center">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => onUpload([new File(["demo"], "demo_scan.dcm")], {
              fullName: "Patient Demo",
              age: "45",
              gender: "male",
              modality: "mri",
              bodyRegion: "brain",
              reportLanguage: "fr"
            })}
          >
            <Sparkles className="w-4 h-4" />
            Charger un Scan Demo
          </Button>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {[
            { icon: FileVolume2, title: "Formats Multiples", desc: "DICOM, NIfTI, et plus" },
            { icon: Brain, title: "Analyse IA", desc: "Resultats diagnostiques instantanes" },
            { icon: Scan, title: "Visualisation 3D", desc: "Rendu volumetrique interactif" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-sm">{item.title}</h4>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

function ProcessingStage({ progress }: { progress: number }) {
  const stages = [
    { name: "Analyse des donnees DICOM", threshold: 20 },
    { name: "Reconstruction du volume", threshold: 40 },
    { name: "Analyse IA en cours", threshold: 70 },
    { name: "Generation du rapport", threshold: 90 },
    { name: "Finalisation", threshold: 100 },
  ]
  
  const currentStage = stages.find(s => progress < s.threshold) || stages[stages.length - 1]
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <AILoader size="lg" className="mx-auto mb-8" />
        
        <h2 className="text-2xl font-bold mb-2">Analyse en Cours</h2>
        <p className="text-muted-foreground mb-6">{currentStage.name}...</p>
        
        <div className="w-full max-w-sm mx-auto mb-4">
          <Progress value={progress} className="h-2" />
        </div>
        <p className="text-sm text-muted-foreground">{progress}% complete</p>
        
        {/* Processing steps */}
        <div className="mt-8 space-y-2">
          {stages.map((stage, i) => {
            const isComplete = progress >= stage.threshold
            const isCurrent = currentStage.name === stage.name
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "flex items-center gap-3 text-sm",
                  isComplete ? "text-primary" : isCurrent ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {isComplete ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-current" />
                )}
                <span>{stage.name}</span>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}

function ResultsStage({ result }: { result: AnalysisResult }) {
  const [activeViewer, setActiveViewer] = useState<"2d" | "3d">("2d")
  
  return (
    <div className="space-y-6">
      {/* Header with metadata */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-green-400" />
            Analyse Terminee
          </h1>
          <p className="text-muted-foreground">
            {result.metadata.scanType} - {result.metadata.studyDate}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ReportPanel result={result} />
        </div>
      </div>
      
      {/* Patient & Scan metadata */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "ID Patient", value: result.metadata.patientId },
          { label: "Type de Scan", value: result.metadata.scanType },
          { label: "Coupes", value: result.metadata.sliceCount.toString() },
          { label: "Dimensions", value: result.metadata.dimensions },
        ].map((item, i) => (
          <GlassCard key={i} className="p-4">
            <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
            <p className="font-medium">{item.value}</p>
          </GlassCard>
        ))}
      </div>
      
      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Viewer section */}
        <div className="lg:col-span-2 space-y-4">
          {/* Viewer tabs */}
          <Tabs value={activeViewer} onValueChange={(v) => setActiveViewer(v as "2d" | "3d")}>
            <TabsList className="grid w-full max-w-sm grid-cols-2">
              <TabsTrigger value="2d" className="gap-2">
                <Layers className="w-4 h-4" />
                Visualiseur 2D
              </TabsTrigger>
              <TabsTrigger value="3d" className="gap-2">
                <Box className="w-4 h-4" />
                Visualiseur 3D
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="2d" className="mt-4">
              <GlassCard className="p-4 relative">
                <MRI2DViewer totalSlices={result.metadata.sliceCount} />
                {/* Coming Soon Overlay */}
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-xl">
                  <div className="text-center p-6">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                      <Layers className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Bientot Disponible</h3>
                    <p className="text-muted-foreground text-sm max-w-xs">
                      Le visualiseur 2D multi-plans sera disponible dans une prochaine mise a jour.
                    </p>
                  </div>
                </div>
              </GlassCard>
            </TabsContent>
            
            <TabsContent value="3d" className="mt-4">
              <GlassCard className="p-4">
                <Viewer3D />
              </GlassCard>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Findings sidebar */}
        <div className="space-y-4">
          {/* Disease detection */}
          <GlassCard className="p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              Resultats de Detection IA
            </h3>
            <div className="space-y-3">
              {result.diseases.map((disease, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{disease.name}</span>
                    <span className={cn(
                      "text-xs font-medium px-2 py-1 rounded-full",
                      disease.confidence > 0.7 
                        ? "bg-red-500/20 text-red-400"
                        : disease.confidence > 0.3
                        ? "bg-yellow-500/20 text-yellow-400" 
                        : "bg-green-500/20 text-green-400"
                    )}>
                      {Math.round(disease.confidence * 100)}%
                    </span>
                  </div>
                  <Progress 
                    value={disease.confidence * 100} 
                    className="h-1.5"
                  />
                  <p className="text-xs text-muted-foreground">{disease.description}</p>
                </div>
              ))}
            </div>
          </GlassCard>
          
          {/* Findings - Plain text block */}
          <GlassCard className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              Resultats (Findings)
            </h3>
            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              {result.findings.map((finding, index) => (
                <p key={finding.id}>
                  <span className="font-medium text-foreground">{index + 1}. {finding.title}:</span>{" "}
                  {finding.description} ({finding.location})
                </p>
              ))}
            </div>
          </GlassCard>
          
          {/* Impression */}
          <GlassCard className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              Impression
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {result.impression}
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}

export default function AnalysisPage() {
  const [stage, setStage] = useState<AnalysisStage>("upload")
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  
  const handleUpload = useCallback((files: File[], patientInfo: PatientInfo) => {
    setStage("processing")
    setProgress(0)
    
    // Simulate processing
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval)
          // Add patient info to result
          const resultWithPatient = {
            ...fakeAnalysisResult,
            patientInfo,
            metadata: {
              ...fakeAnalysisResult.metadata,
              scanType: modalities.find(m => m.value === patientInfo.modality)?.label || fakeAnalysisResult.metadata.scanType
            }
          }
          setResult(resultWithPatient)
          setStage("results")
          return 100
        }
        return p + Math.random() * 15
      })
    }, 500)
  }, [])
  
  return (
    <div className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {stage === "upload" && (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <UploadStage onUpload={handleUpload} />
            </motion.div>
          )}
          
          {stage === "processing" && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ProcessingStage progress={Math.min(progress, 100)} />
            </motion.div>
          )}
          
          {stage === "results" && result && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ResultsStage result={result} />
            </motion.div>
          )}
        </AnimatePresence>
    </div>
  )
}
