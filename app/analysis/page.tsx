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
  Languages,
  X,
  FileImage,
  Play,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GlassCard } from "@/components/ui/glass-card"
import { AILoader } from "@/components/ui/ai-loader"
import { PapayaViewer, type AnalysedFile } from "@/components/analysis/papaya-viewer"
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

interface UploadedFile {
  id: string
  file: File
  sequence: string
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
  analysedFiles?: AnalysedFile[]
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

const getModalities = (t: (key: any) => string) => [
  { value: "mri", label: t('analysis.mri') },
  { value: "ct", label: t('analysis.ct') },
  { value: "xray", label: t('analysis.xray') },
  { value: "pet", label: t('analysis.pet') },
  { value: "ultrasound", label: t('analysis.ultrasound') },
]

const getBodyRegions = (t: (key: any) => string) => [
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

const mriSequences = [
  { value: "t1", label: "T1" },
  { value: "t1c", label: "T1c (avec contraste)" },
  { value: "t2", label: "T2" },
  { value: "t2w", label: "T2w (pondere)" },
  { value: "flair", label: "FLAIR" },
  { value: "dwi", label: "DWI (Diffusion)" },
  { value: "adc", label: "ADC" },
  { value: "swi", label: "SWI" },
  { value: "other", label: "Autre" },
]


function UploadStage({ onAnalyse, t }: { onAnalyse: (files: UploadedFile[], patientInfo: PatientInfo) => void, t: ReturnType<typeof useLanguage>["t"] }) {
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    fullName: "",
    age: "",
    gender: "",
    modality: "",
    bodyRegion: "",
    reportLanguage: "fr",
  })

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map((file, index) => ({
      id: `file-${Date.now()}-${index}`,
      file,
      sequence: ""
    }))
    setUploadedFiles(prev => [...prev, ...newFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/dicom': ['.dcm', '.dicom'],
      'application/x-nifti': ['.nii', '.nii.gz'],
      'application/zip': ['.zip']
    },
    multiple: true
  })

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const updateFileSequence = (fileId: string, sequence: string) => {
    setUploadedFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, sequence } : f
    ))
  }

  const canAnalyse = patientInfo.fullName && 
                     patientInfo.modality && 
                     patientInfo.bodyRegion && 
                     uploadedFiles.length > 0 &&
                     (patientInfo.modality !== "mri" || uploadedFiles.every(f => f.sequence))

  const handleAnalyse = () => {
    if (canAnalyse) {
      onAnalyse(uploadedFiles, patientInfo)
    }
  }

  const handleDemoLoad = () => {
    const demoFiles: UploadedFile[] = [
      { id: "demo-1", file: new File(["demo"], "brain_t1c.nii.gz"), sequence: "t1c" },
      { id: "demo-2", file: new File(["demo"], "brain_t2w.nii.gz"), sequence: "t2w" },
      { id: "demo-3", file: new File(["demo"], "brain_flair.nii.gz"), sequence: "flair" },
    ]
    onAnalyse(demoFiles, {
      fullName: "Patient Demo",
      age: "45",
      gender: "male",
      modality: "mri",
      bodyRegion: "brain",
      reportLanguage: "fr"
    })
  }

  const isMri = patientInfo.modality === "mri"

  // const canUpload = patientInfo.fullName && patientInfo.modality && patientInfo.bodyRegion

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
          <h1 className="text-3xl font-bold mb-2">{t('analysis.title')}</h1>
          <p className="text-muted-foreground">
            {/* TODO: apply translation */}
            Remplissez les informations patient puis televersez vos fichiers 
          </p>
        </div>

        {/* Patient Information Form */}
        <GlassCard className="mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            {t('analysis.step1')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">{t('analysis.patientName')} *</Label>
              <Input
                id="fullName"
                placeholder="Ex: Ahmed Benali"
                value={patientInfo.fullName}
                onChange={(e) => setPatientInfo(prev => ({ ...prev, fullName: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">{t('analysis.patientAge')}</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Ex: 45"
                  value={patientInfo.age}
                  onChange={(e) => setPatientInfo(prev => ({ ...prev, age: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">{t('analysis.gender')}</Label>
                <Select
                  value={patientInfo.gender}
                  onValueChange={(value) => setPatientInfo(prev => ({ ...prev, gender: value as "male" | "female" }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">{t('analysis.male')}</SelectItem>
                    <SelectItem value="female">{t('analysis.female')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="modality">{t('analysis.modality')} *</Label>
              <Select
                value={patientInfo.modality}
                onValueChange={(value) => setPatientInfo(prev => ({ ...prev, modality: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir la modalite" />
                </SelectTrigger>
                <SelectContent>
                  {getModalities(t).map((m) => (
                    <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bodyRegion">{t('analysis.bodyRegion')} *</Label>
              <Select
                value={patientInfo.bodyRegion}
                onValueChange={(value) => setPatientInfo(prev => ({ ...prev, bodyRegion: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir la region" />
                </SelectTrigger>
                <SelectContent>
                  {getBodyRegions(t).map((r) => (
                    <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reportLanguage" className="flex items-center gap-2">
                <Languages className="w-4 h-4" />
                {t('analysis.reportLanguage')}
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

        {/* Drop zone */}
        <div
          {...getRootProps()}
          className={cn(
            "relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300",
            // !canUpload && "opacity-50 cursor-not-allowed",
            isDragActive 
              ? "border-primary bg-primary/10 scale-[1.02]" 
              : "border-white/20 hover:border-primary/50 hover:bg-white/5"
          )}
        >
          {/* <input {...getInputProps()} disabled={!canUpload} /> */}
          <input {...getInputProps()} />
          
          <motion.div
            animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
            className="flex flex-col items-center"
          >
            <div className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors",
              isDragActive ? "bg-primary/20" : "bg-white/10"
            )}>
              <Upload className={cn(
                "w-8 h-8 transition-colors",
                isDragActive ? "text-primary" : "text-muted-foreground"
              )} />
            </div>
            
            <h3 className="text-xl font-semibold mb-2">
              {
                // !canUpload 
                // ? "Remplissez les champs obligatoires (*)" :
                isDragActive 
                  ? t('analysis.dragDrop')
                  : t('analysis.dragDrop')
              }
            </h3>
            <p className="text-muted-foreground text-sm mb-3">
              {t('analysis.orClick')}
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

        {/* Uploaded files list */}
        {uploadedFiles.length > 0 && (
          <GlassCard className="mt-4">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <FileImage className="w-4 h-4 text-primary" />
              Fichiers telecharges ({uploadedFiles.length})
            </h3>
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {uploadedFiles.map((uploadedFile) => (
                <div 
                  key={uploadedFile.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10"
                >
                  <FileVolume2 className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-sm flex-1 truncate">{uploadedFile.file.name}</span>
                  
                  {isMri && (
                    <Select
                      value={uploadedFile.sequence}
                      onValueChange={(value) => updateFileSequence(uploadedFile.id, value)}
                    >
                      <SelectTrigger className="w-[140px] h-8 text-xs">
                        <SelectValue placeholder="Sequence *" />
                      </SelectTrigger>
                      <SelectContent>
                        {mriSequences.map((seq) => (
                          <SelectItem key={seq.value} value={seq.value}>{seq.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    onClick={() => removeFile(uploadedFile.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            {isMri && !uploadedFiles.every(f => f.sequence) && (
              <p className="text-xs text-amber-400 mt-3 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-amber-400" />
                Selectionnez une sequence pour chaque fichier IRM
              </p>
            )}
          </GlassCard>
        )}

        {/* Analyse button */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button 
            size="lg"
            className="gap-2 w-full sm:w-auto"
            onClick={handleAnalyse}
            disabled={!canAnalyse}
          >
            <Play className="w-5 h-5" />
            Analyser les images
          </Button>

        {/* Quick demo button */}
        
          <Button 
            variant="outline" 
            className="gap-2  w-full sm:w-auto"
            onClick={handleDemoLoad}
            // onClick={() => onUpload([new File(["demo"], "demo_scan.dcm")], {
            //   fullName: "Patient Demo",
            //   age: "45",
            //   gender: "male",
            //   modality: "mri",
            //   bodyRegion: "brain",
            //   reportLanguage: "fr"
            // })}
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

function ProcessingStage({ progress, t }: { progress: number; t: any }) {
  const stages = [
    { name: t('analysis.processing.extracting'), threshold: 20 },
    { name: t('analysis.processing.analyzing'), threshold: 40 },
    { name: t('analysis.processing.detecting'), threshold: 70 },
    { name: t('analysis.processing.generating'), threshold: 90 },
    { name: t('analysis.processing.complete'), threshold: 100 },
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
        
        <h2 className="text-2xl font-bold mb-2">{t('analysis.processing')}</h2>
        <p className="text-muted-foreground mb-6">{currentStage.name}...</p>
        
        <div className="w-full max-w-sm mx-auto mb-4">
          <Progress value={progress} className="h-2" />
        </div>
        <p className="text-sm text-muted-foreground">{progress}{t('analysis.processing.complete')}</p>
        
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

function ResultsStage({ result, t }: { result: AnalysisResult; t: any }) {
  const [activeViewer, setActiveViewer] = useState<"2d" | "3d">("2d")
  const [activeFileId, setActiveFileId] = useState<string | null>(
    result.analysedFiles?.[0]?.id || null
  )

  const getSeverityColor = (severity: Finding["severity"]) => {
    switch (severity) {
      case "normal": return "text-green-400 bg-green-500/20"
      case "mild": return "text-yellow-400 bg-yellow-500/20"
      case "moderate": return "text-orange-400 bg-orange-500/20"
      case "severe": return "text-red-400 bg-red-500/20"
    }
  }

  const getSeverityLabel = (severity: Finding["severity"]) => {
    switch (severity) {
      case "normal": return "Normal"
      case "mild": return "Leger"
      case "moderate": return "Modere"
      case "severe": return "Severe"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with metadata */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-green-400" />
            {t('analysis.results.title')}
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
          { label: t('analysis.results.patientId'), value: result.metadata.patientId },
          { label: t('analysis.results.scanType'), value: result.metadata.scanType },
          { label: t('analysis.results.slices'), value: result.metadata.sliceCount.toString() },
          { label: t('analysis.results.dimensions'), value: result.metadata.dimensions },
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
                {t('analysis.results.viewer2D')}
              </TabsTrigger>
              <TabsTrigger value="3d" className="gap-2">
                <Box className="w-4 h-4" />
                {t('analysis.results.viewer3D')}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="2d" className="mt-4">
              <GlassCard className="p-4">
                {/* <MRI2DViewer totalSlices={result.metadata.sliceCount} />
                {/* Coming Soon Overlay
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-xl">
                  <div className="text-center p-6">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                      <Layers className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{t('analysis.results.comingSoon')}</h3>
                    <p className="text-muted-foreground text-sm max-w-xs">
                      {t('analysis.results.2DViewerSoon')}
                    </p>
                  </div>
                </div> */}
                <PapayaViewer 
                  files={result.analysedFiles || []}
                  activeFileId={activeFileId}
                  onFileSelect={setActiveFileId}
                />
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
              {t('analysis.results.aiDetection')}
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
              {t('analysis.results.clinicalNotes')}
            </h3>
            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              {result.findings.map((finding, index) => (
                <p key={finding.id}>
                  <span className="font-medium text-foreground">{index + 1}. {finding.title}</span>
                  {" - "}
                  <span className={cn(
                    "text-xs px-1.5 py-0.5 rounded",
                    getSeverityColor(finding.severity)
                  )}>
                    {getSeverityLabel(finding.severity)}
                  </span>
                  {": "}
                  {finding.description}
                  {" "}
                  <span className="text-xs italic">({finding.location})</span>
                </p>
              ))}
            </div>
          </GlassCard>
          
          {/* Impression */}
          <GlassCard className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              {t('analysis.results.recommendations')}
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

import { useLanguage } from '@/components/providers/language-provider'

export default function AnalysisPage() {
  const { t } = useLanguage()
  const [stage, setStage] = useState<AnalysisStage>("upload")
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  
  const handleAnalyse = useCallback((files: UploadedFile[], patientInfo: PatientInfo) => {
    setStage("processing")
    setProgress(0)
    
    // Convert uploaded files to analysed files format
    const analysedFiles: AnalysedFile[] = files.map(f => ({
      id: f.id,
      name: f.file.name,
      sequence: f.sequence || undefined,
      file: f.file,
      url: URL.createObjectURL(f.file)
    }))

    // Simulate processing
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval)
          // Add patient info and files to result
          const resultWithPatient: AnalysisResult = {
            ...fakeAnalysisResult,
            patientInfo,
            analysedFiles,
            metadata: {
              ...fakeAnalysisResult.metadata,
              scanType: getModalities(t).find(m => m.value === patientInfo.modality)?.label || fakeAnalysisResult.metadata.scanType
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
              <UploadStage onAnalyse={handleAnalyse} t={t} />
            </motion.div>
          )}
          
          {stage === "processing" && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ProcessingStage progress={Math.min(progress, 100)} t={t} />
            </motion.div>
          )}
          
          {stage === "results" && result && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ResultsStage result={result} t={t} />
            </motion.div>
          )}
        </AnimatePresence>
    </div>
  )
}
