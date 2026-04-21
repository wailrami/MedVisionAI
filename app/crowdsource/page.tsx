'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import {
  Users,
  Trophy,
  Star,
  CheckCircle2,
  Clock,
  Award,
  TrendingUp,
  Gift,
  ChevronRight,
  Brain,
  Target,
  Zap,
  Upload,
  FileVolume2,
  Languages,
  Send,
  Plus,
  X,
  Image as ImageIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GlassCard, GlassButton } from '@/components/ui/glass-card'
import { CircularProgress } from '@/components/ui/ai-loader'
import { StaggerContainer, StaggerItem } from '@/components/layout/page-transition'
import { cn } from '@/lib/utils'

interface Task {
  id: string
  title: string
  type: 'annotation' | 'validation' | 'review'
  modality: string
  difficulty: 'easy' | 'medium' | 'hard'
  reward: number
  timeEstimate: string
  progress?: number
}

type Language = 'en' | 'fr' | 'ar'

const languageLabels: Record<Language, { name: string; flag: string; placeholder: { findings: string; impression: string } }> = {
  en: { 
    name: "English", 
    flag: "EN",
    placeholder: {
      findings: "Describe your findings here... (e.g., 'Multiple small foci of T2/FLAIR hyperintensity in the periventricular white matter...')",
      impression: "Write your overall impression... (e.g., 'MRI brain demonstrates mild chronic microvascular ischemic changes...')"
    }
  },
  fr: { 
    name: "Français", 
    flag: "FR",
    placeholder: {
      findings: "Décrivez vos résultats ici... (ex: 'Foyers multiples d'hyperintensité T2/FLAIR dans la substance blanche périventriculaire...')",
      impression: "Écrivez votre impression générale... (ex: 'L'IRM cérébrale démontre des modifications ischémiques microvasculaires chroniques légères...')"
    }
  },
  ar: { 
    name: "العربية", 
    flag: "ع",
    placeholder: {
      findings: "صف نتائجك هنا... (مثال: 'بؤر متعددة صغيرة من فرط الكثافة T2/FLAIR في المادة البيضاء حول البطينين...')",
      impression: "اكتب انطباعك العام... (مثال: 'يُظهر التصوير بالرنين المغناطيسي للدماغ تغيرات إقفارية وعائية دقيقة مزمنة خفيفة...')"
    }
  }
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Annotate lung nodules in chest CT',
    type: 'annotation',
    modality: 'CT',
    difficulty: 'medium',
    reward: 25,
    timeEstimate: '5-10 min',
  },
  {
    id: '2',
    title: 'Validate AI brain MRI findings',
    type: 'validation',
    modality: 'MRI',
    difficulty: 'easy',
    reward: 15,
    timeEstimate: '2-5 min',
    progress: 60,
  },
  {
    id: '3',
    title: 'Review liver segmentation masks',
    type: 'review',
    modality: 'CT',
    difficulty: 'hard',
    reward: 40,
    timeEstimate: '10-15 min',
  },
  {
    id: '4',
    title: 'Mark cardiac structures in echo',
    type: 'annotation',
    modality: 'Ultrasound',
    difficulty: 'medium',
    reward: 30,
    timeEstimate: '5-10 min',
  },
]

const leaderboard = [
  { rank: 1, name: 'Dr. Sarah Chen', credits: 12450, badges: ['Expert', 'Top Contributor'] },
  { rank: 2, name: 'Dr. Michael Park', credits: 10890, badges: ['Expert'] },
  { rank: 3, name: 'Dr. Emily Rodriguez', credits: 9750, badges: ['Rising Star'] },
  { rank: 4, name: 'Dr. James Wilson', credits: 8920, badges: [] },
  { rank: 5, name: 'Dr. Lisa Anderson', credits: 7680, badges: [] },
]

const stats = [
  { label: 'Your Credits', value: '2,450', icon: Star, color: 'text-yellow-500' },
  { label: 'Tasks Completed', value: '127', icon: CheckCircle2, color: 'text-success' },
  { label: 'Global Rank', value: '#42', icon: Trophy, color: 'text-primary' },
  { label: 'This Week', value: '+340', icon: TrendingUp, color: 'text-success' },
]

// Contribution reward tiers
const rewardTiers = [
  { quality: 'Standard', reward: 50, description: 'Basic scan with findings' },
  { quality: 'Detailed', reward: 100, description: 'Comprehensive findings with measurements' },
  { quality: 'Expert', reward: 200, description: 'Expert-level analysis with differential diagnosis' },
]

function ContributeScansTab() {
  const [language, setLanguage] = useState<Language>('en')
  const [scanType, setScanType] = useState<string>('')
  const [findings, setFindings] = useState('')
  const [impression, setImpression] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadedFiles(prev => [...prev, ...acceptedFiles])
  }, [])
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/dicom': ['.dcm', '.dicom'],
      'application/x-nifti': ['.nii', '.nii.gz'],
      'image/*': ['.jpg', '.jpeg', '.png'],
      'application/zip': ['.zip']
    },
    multiple: true
  })
  
  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }
  
  const handleSubmit = async () => {
    if (!uploadedFiles.length || !findings || !impression || !scanType) return
    
    setIsSubmitting(true)
    
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    setSubmitted(true)
    
    // Reset after showing success
    setTimeout(() => {
      setSubmitted(false)
      setUploadedFiles([])
      setFindings('')
      setImpression('')
      setScanType('')
    }, 3000)
  }
  
  const estimatedReward = findings.length > 500 && impression.length > 200 
    ? rewardTiers[2] 
    : findings.length > 200 
    ? rewardTiers[1] 
    : rewardTiers[0]
  
  const dir = language === 'ar' ? 'rtl' : 'ltr'
  
  return (
    <div className="space-y-6">
      {/* Reward Info Banner */}
      <GlassCard className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-primary/20">
            <Gift className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-2">Earn Rewards for Your Contributions</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Upload your scans with expert findings and impressions to help train our AI models.
            </p>
            <div className="grid grid-cols-3 gap-3">
              {rewardTiers.map((tier, i) => (
                <div 
                  key={tier.quality}
                  className={cn(
                    "p-2 rounded-lg text-center transition-all",
                    estimatedReward.quality === tier.quality 
                      ? "bg-primary/20 ring-2 ring-primary" 
                      : "bg-secondary/30"
                  )}
                >
                  <div className="flex items-center justify-center gap-1 text-yellow-500 font-bold">
                    <Star className="h-4 w-4" />
                    {tier.reward}
                  </div>
                  <p className="text-xs font-medium mt-1">{tier.quality}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>
      
      {/* Language Selector */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Upload className="h-5 w-5 text-primary" />
          Upload Your Scan
        </h3>
        <div className="flex items-center gap-2">
          <Languages className="h-4 w-4 text-muted-foreground" />
          <Select value={language} onValueChange={(v) => setLanguage(v as Language)}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(languageLabels) as Language[]).map((lang) => (
                <SelectItem key={lang} value={lang}>
                  <span className="flex items-center gap-2">
                    <span className="text-xs font-bold">{languageLabels[lang].flag}</span>
                    <span>{languageLabels[lang].name}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300",
          isDragActive 
            ? "border-primary bg-primary/10 scale-[1.02]" 
            : "border-white/20 hover:border-primary/50 hover:bg-white/5"
        )}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center">
          <div className={cn(
            "w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-colors",
            isDragActive ? "bg-primary/20" : "bg-white/10"
          )}>
            <FileVolume2 className={cn(
              "w-7 h-7 transition-colors",
              isDragActive ? "text-primary" : "text-muted-foreground"
            )} />
          </div>
          
          <h4 className="text-lg font-medium mb-1">
            {isDragActive ? "Drop files here" : "Drag & drop scan files"}
          </h4>
          <p className="text-sm text-muted-foreground mb-3">
            or click to browse your files
          </p>
          
          <div className="flex flex-wrap justify-center gap-2">
            {["DICOM", "NIfTI", "JPEG/PNG", "ZIP"].map((format) => (
              <span 
                key={format}
                className="px-2 py-1 text-xs bg-white/10 rounded-full text-muted-foreground"
              >
                {format}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <Label>Uploaded Files ({uploadedFiles.length})</Label>
          <div className="flex flex-wrap gap-2">
            {uploadedFiles.map((file, index) => (
              <div 
                key={index}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/30 border border-white/10"
              >
                <ImageIcon className="h-4 w-4 text-primary" />
                <span className="text-sm truncate max-w-[150px]">{file.name}</span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile(index)
                  }}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Scan Type */}
      <div className="space-y-2">
        <Label>Scan Type</Label>
        <Select value={scanType} onValueChange={setScanType}>
          <SelectTrigger>
            <SelectValue placeholder="Select scan modality" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mri-brain">MRI - Brain</SelectItem>
            <SelectItem value="mri-spine">MRI - Spine</SelectItem>
            <SelectItem value="ct-chest">CT - Chest</SelectItem>
            <SelectItem value="ct-abdomen">CT - Abdomen</SelectItem>
            <SelectItem value="xray-chest">X-Ray - Chest</SelectItem>
            <SelectItem value="ultrasound">Ultrasound</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Findings */}
      <div className="space-y-2" dir={dir}>
        <div className="flex items-center justify-between">
          <Label className={language === 'ar' ? 'text-right w-full' : ''}>
            {language === 'en' ? 'Findings' : language === 'fr' ? 'Résultats' : 'النتائج'}
          </Label>
          <span className="text-xs text-muted-foreground">
            {findings.length} characters
          </span>
        </div>
        <Textarea
          value={findings}
          onChange={(e) => setFindings(e.target.value)}
          placeholder={languageLabels[language].placeholder.findings}
          className={cn(
            "min-h-[120px] resize-none",
            language === 'ar' && "text-right"
          )}
          dir={dir}
        />
      </div>
      
      {/* Impression */}
      <div className="space-y-2" dir={dir}>
        <div className="flex items-center justify-between">
          <Label className={language === 'ar' ? 'text-right w-full' : ''}>
            {language === 'en' ? 'Impression' : language === 'fr' ? 'Impression' : 'الانطباع'}
          </Label>
          <span className="text-xs text-muted-foreground">
            {impression.length} characters
          </span>
        </div>
        <Textarea
          value={impression}
          onChange={(e) => setImpression(e.target.value)}
          placeholder={languageLabels[language].placeholder.impression}
          className={cn(
            "min-h-[100px] resize-none",
            language === 'ar' && "text-right"
          )}
          dir={dir}
        />
      </div>
      
      {/* Estimated Reward */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-white/10">
        <div>
          <p className="text-sm text-muted-foreground">Estimated Reward</p>
          <p className="font-medium">{estimatedReward.quality} Quality</p>
          <p className="text-xs text-muted-foreground">{estimatedReward.description}</p>
        </div>
        <div className="flex items-center gap-2 text-2xl font-bold text-yellow-500">
          <Star className="h-6 w-6" />
          {estimatedReward.reward}
        </div>
      </div>
      
      {/* Submit Button */}
      <Button 
        className="w-full gap-2" 
        size="lg"
        onClick={handleSubmit}
        disabled={!uploadedFiles.length || !findings || !impression || !scanType || isSubmitting}
      >
        {isSubmitting ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Send className="h-5 w-5" />
            </motion.div>
            Submitting...
          </>
        ) : submitted ? (
          <>
            <CheckCircle2 className="h-5 w-5" />
            Submitted Successfully!
          </>
        ) : (
          <>
            <Send className="h-5 w-5" />
            Submit Contribution
          </>
        )}
      </Button>
      
      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-success/20 border border-success/30 text-center"
        >
          <CheckCircle2 className="h-8 w-8 text-success mx-auto mb-2" />
          <p className="font-medium text-success">Thank you for your contribution!</p>
          <p className="text-sm text-muted-foreground">
            Your submission is being reviewed. You will receive {estimatedReward.reward} credits upon approval.
          </p>
        </motion.div>
      )}
    </div>
  )
}

function TasksTab() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')

  const filteredTasks = selectedDifficulty === 'all'
    ? mockTasks
    : mockTasks.filter((t) => t.difficulty === selectedDifficulty)

  const difficultyColors = {
    easy: 'bg-success/20 text-success',
    medium: 'bg-warning/20 text-warning',
    hard: 'bg-destructive/20 text-destructive',
  }

  const typeIcons = {
    annotation: Target,
    validation: CheckCircle2,
    review: Brain,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Available Tasks</h3>
        <div className="flex gap-2">
          {['all', 'easy', 'medium', 'hard'].map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                selectedDifficulty === diff
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary/50 text-muted-foreground hover:text-foreground'
              }`}
            >
              {diff.charAt(0).toUpperCase() + diff.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredTasks.map((task, index) => {
          const TypeIcon = typeIcons[task.type]
          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors group"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <TypeIcon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-medium mb-1">{task.title}</h3>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{task.modality}</span>
                        <span>-</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {task.timeEstimate}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-yellow-500 font-bold">
                        <Star className="h-4 w-4" />
                        {task.reward}
                      </div>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs ${difficultyColors[task.difficulty]}`}>
                        {task.difficulty}
                      </span>
                    </div>
                  </div>

                  {task.progress !== undefined && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground">In Progress</span>
                        <span>{task.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-primary rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${task.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="mt-3 flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <GlassButton size="sm">
                      {task.progress !== undefined ? 'Continue' : 'Start Task'}
                      <ChevronRight className="h-4 w-4" />
                    </GlassButton>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* How It Works */}
      <GlassCard className="mt-6">
        <h2 className="text-xl font-semibold mb-6">How It Works</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            {
              icon: Target,
              title: 'Pick a Task',
              description: 'Choose from annotation, validation, or review tasks based on your expertise.',
            },
            {
              icon: Brain,
              title: 'Contribute',
              description: 'Use your medical knowledge to annotate scans or validate AI findings.',
            },
            {
              icon: Gift,
              title: 'Earn Rewards',
              description: 'Get credits for each completed task. Redeem for premium features or gift cards.',
            },
          ].map((step, index) => (
            <div key={step.title} className="text-center">
              <div className="relative inline-flex items-center justify-center mb-4">
                <div className="p-4 rounded-full bg-primary/10">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                  {index + 1}
                </span>
              </div>
              <h3 className="font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}

export default function CrowdsourcePage() {
  const [activeTab, setActiveTab] = useState('tasks')

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Users className="h-8 w-8 text-primary" />
          Radiologist Crowdsourcing
        </h1>
        <p className="text-muted-foreground">
          Contribute to AI training, validate findings, and earn rewards
        </p>
      </motion.div>

      {/* Stats Grid */}
      <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <StaggerItem key={stat.label}>
            <GlassCard className="flex items-center gap-4">
              <div className={`p-3 rounded-lg bg-secondary/50 ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </GlassCard>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content with Tabs */}
        <div className="lg:col-span-2">
          <GlassCard>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="tasks" className="gap-2">
                  <Target className="h-4 w-4" />
                  Tasks
                </TabsTrigger>
                <TabsTrigger value="contribute" className="gap-2">
                  <Upload className="h-4 w-4" />
                  Contribute Scans
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="tasks">
                <TasksTab />
              </TabsContent>
              
              <TabsContent value="contribute">
                <ContributeScansTab />
              </TabsContent>
            </Tabs>
          </GlassCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Your Progress */}
          <GlassCard>
            <h2 className="text-lg font-semibold mb-4">Your Progress</h2>
            <div className="flex justify-center mb-4">
              <CircularProgress value={68} size={140} strokeWidth={10} />
            </div>
            <div className="text-center mb-4">
              <p className="text-sm text-muted-foreground">Level Progress</p>
              <p className="font-medium">Expert Radiologist - Tier 3</p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Next level at</span>
                <span className="font-medium">3,000 credits</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Credits needed</span>
                <span className="font-medium text-primary">550 more</span>
              </div>
            </div>
          </GlassCard>

          {/* Leaderboard */}
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Leaderboard
              </h2>
              <span className="text-sm text-muted-foreground">This Month</span>
            </div>
            <div className="space-y-3">
              {leaderboard.map((user, index) => (
                <motion.div
                  key={user.rank}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-3 p-2 rounded-lg ${
                    index < 3 ? 'bg-secondary/30' : ''
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-yellow-500 text-yellow-950' :
                    index === 1 ? 'bg-gray-400 text-gray-950' :
                    index === 2 ? 'bg-orange-400 text-orange-950' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {user.rank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{user.name}</p>
                    <div className="flex gap-1">
                      {user.badges.map((badge) => (
                        <span key={badge} className="text-xs text-primary">{badge}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="h-3 w-3" />
                    <span className="text-sm font-medium">{user.credits.toLocaleString()}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>

          {/* Rewards Store */}
          <GlassCard>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Gift className="h-5 w-5 text-primary" />
              Rewards Store
            </h2>
            <div className="space-y-3">
              {[
                { name: '1 Month Premium', cost: 5000 },
                { name: 'Priority Support', cost: 2500 },
                { name: '$50 Amazon Gift Card', cost: 10000 },
              ].map((reward) => (
                <div key={reward.name} className="flex items-center justify-between p-2 rounded-lg bg-secondary/30">
                  <span className="text-sm">{reward.name}</span>
                  <div className="flex items-center gap-1 text-yellow-500 text-sm">
                    <Star className="h-3 w-3" />
                    {reward.cost.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
            <GlassButton variant="secondary" className="w-full mt-4" size="sm">
              View All Rewards
              <ChevronRight className="h-4 w-4" />
            </GlassButton>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
