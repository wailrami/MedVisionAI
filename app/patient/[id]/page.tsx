'use client'

import { useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Calendar,
  Clock,
  Activity,
  FileText,
  TrendingUp,
  TrendingDown,
  Minus,
  Brain,
  Heart,
  Bone,
  Eye,
  Download,
  Filter,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Info,
  ZoomIn,
} from 'lucide-react'
import { GlassCard, GlassButton } from '@/components/ui/glass-card'
import { toast } from 'sonner'

// Mock patient data with longitudinal history
const mockPatient = {
  id: 'P-2024-001234',
  name: 'John Smith',
  dateOfBirth: '1965-08-22',
  age: 59,
  gender: 'Male',
  bloodType: 'O+',
  allergies: ['Penicillin', 'Contrast dye (mild)'],
  conditions: ['Hypertension', 'Type 2 Diabetes'],
  primaryPhysician: 'Dr. Sarah Johnson',
  insurance: 'Blue Cross Blue Shield',
}

const mockScanHistory = [
  {
    id: 'scan-001',
    date: '2024-01-15',
    type: 'Brain MRI',
    modality: 'MRI',
    bodyPart: 'Brain',
    status: 'completed',
    findings: [
      { type: 'Normal', severity: 'normal', description: 'No significant abnormalities' },
    ],
    overallStatus: 'normal' as const,
    radiologist: 'Dr. Michael Chen',
    notes: 'Routine follow-up scan. No changes from previous study.',
  },
  {
    id: 'scan-002',
    date: '2023-10-05',
    type: 'Brain MRI',
    modality: 'MRI',
    bodyPart: 'Brain',
    status: 'completed',
    findings: [
      { type: 'Minor white matter changes', severity: 'mild', description: 'Small punctate foci noted' },
    ],
    overallStatus: 'mild' as const,
    radiologist: 'Dr. Michael Chen',
    notes: 'Slight increase in white matter changes compared to prior study.',
  },
  {
    id: 'scan-003',
    date: '2023-06-20',
    type: 'Chest CT',
    modality: 'CT',
    bodyPart: 'Chest',
    status: 'completed',
    findings: [
      { type: 'Normal', severity: 'normal', description: 'No pulmonary nodules or masses' },
    ],
    overallStatus: 'normal' as const,
    radiologist: 'Dr. Emily Watson',
    notes: 'Clear lungs. Heart size normal.',
  },
  {
    id: 'scan-004',
    date: '2023-03-12',
    type: 'Brain MRI',
    modality: 'MRI',
    bodyPart: 'Brain',
    status: 'completed',
    findings: [
      { type: 'Normal', severity: 'normal', description: 'No acute findings' },
    ],
    overallStatus: 'normal' as const,
    radiologist: 'Dr. Michael Chen',
    notes: 'Baseline brain MRI. Normal for age.',
  },
  {
    id: 'scan-005',
    date: '2022-11-08',
    type: 'Cardiac MRI',
    modality: 'MRI',
    bodyPart: 'Heart',
    status: 'completed',
    findings: [
      { type: 'Mild LV hypertrophy', severity: 'mild', description: 'Consistent with hypertension history' },
    ],
    overallStatus: 'mild' as const,
    radiologist: 'Dr. James Park',
    notes: 'Mild hypertrophy as expected. EF 55%.',
  },
  {
    id: 'scan-006',
    date: '2022-05-15',
    type: 'Spine MRI',
    modality: 'MRI',
    bodyPart: 'Spine',
    status: 'completed',
    findings: [
      { type: 'Degenerative changes', severity: 'moderate', description: 'L4-L5 disc herniation' },
    ],
    overallStatus: 'moderate' as const,
    radiologist: 'Dr. Lisa Wong',
    notes: 'Moderate disc herniation. Conservative treatment recommended.',
  },
]

// Trend data for visualization
const trendData = [
  { date: '2022-05', brain: 85, heart: 78, overall: 82 },
  { date: '2022-11', brain: 85, heart: 75, overall: 80 },
  { date: '2023-03', brain: 88, heart: 76, overall: 82 },
  { date: '2023-06', brain: 87, heart: 78, overall: 83 },
  { date: '2023-10', brain: 82, heart: 77, overall: 80 },
  { date: '2024-01', brain: 85, heart: 78, overall: 82 },
]

const bodyPartIcons: Record<string, React.ReactNode> = {
  Brain: <Brain className="h-5 w-5" />,
  Heart: <Heart className="h-5 w-5" />,
  Spine: <Bone className="h-5 w-5" />,
  Chest: <Activity className="h-5 w-5" />,
  Eye: <Eye className="h-5 w-5" />,
}

const statusColors = {
  normal: { bg: 'bg-success/20', text: 'text-success', border: 'border-success/30' },
  mild: { bg: 'bg-warning/20', text: 'text-warning', border: 'border-warning/30' },
  moderate: { bg: 'bg-orange-500/20', text: 'text-orange-500', border: 'border-orange-500/30' },
  severe: { bg: 'bg-destructive/20', text: 'text-destructive', border: 'border-destructive/30' },
}

const statusIcons = {
  normal: <CheckCircle2 className="h-4 w-4" />,
  mild: <Info className="h-4 w-4" />,
  moderate: <AlertTriangle className="h-4 w-4" />,
  severe: <AlertTriangle className="h-4 w-4" />,
}

function TrendIndicator({ current, previous }: { current: number; previous: number }) {
  const diff = current - previous
  if (Math.abs(diff) < 2) {
    return <Minus className="h-4 w-4 text-muted-foreground" />
  }
  if (diff > 0) {
    return <TrendingUp className="h-4 w-4 text-success" />
  }
  return <TrendingDown className="h-4 w-4 text-destructive" />
}

function SimpleTrendChart({ data }: { data: typeof trendData }) {
  const maxValue = 100
  const chartHeight = 120
  const chartWidth = 300
  const padding = 20
  
  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * (chartWidth - padding * 2)
    const y = chartHeight - padding - (d.overall / maxValue) * (chartHeight - padding * 2)
    return { x, y, ...d }
  })
  
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  
  return (
    <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-32">
      {/* Grid lines */}
      {[0, 25, 50, 75, 100].map((v) => {
        const y = chartHeight - padding - (v / maxValue) * (chartHeight - padding * 2)
        return (
          <g key={v}>
            <line
              x1={padding}
              y1={y}
              x2={chartWidth - padding}
              y2={y}
              stroke="currentColor"
              strokeOpacity={0.1}
            />
            <text x={5} y={y + 4} fontSize="8" fill="currentColor" fillOpacity={0.5}>
              {v}
            </text>
          </g>
        )
      })}
      
      {/* Trend line */}
      <path
        d={pathD}
        fill="none"
        stroke="url(#gradient)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Gradient definition */}
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
      
      {/* Data points */}
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={4} fill="#6366f1" />
          <text x={p.x} y={chartHeight - 5} fontSize="7" fill="currentColor" fillOpacity={0.5} textAnchor="middle">
            {p.date}
          </text>
        </g>
      ))}
    </svg>
  )
}

export default function PatientHistoryPage() {
  const params = useParams()
  const router = useRouter()
  const [selectedBodyPart, setSelectedBodyPart] = useState<string | null>(null)
  const [expandedScan, setExpandedScan] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  
  const patientId = params.id as string
  
  const filteredScans = useMemo(() => {
    if (!selectedBodyPart) return mockScanHistory
    return mockScanHistory.filter(scan => scan.bodyPart === selectedBodyPart)
  }, [selectedBodyPart])
  
  const bodyParts = useMemo(() => {
    const parts = new Set(mockScanHistory.map(scan => scan.bodyPart))
    return Array.from(parts)
  }, [])
  
  const stats = useMemo(() => {
    const total = mockScanHistory.length
    const normal = mockScanHistory.filter(s => s.overallStatus === 'normal').length
    const abnormal = total - normal
    return { total, normal, abnormal }
  }, [])

  const handleExportHistory = () => {
    toast.success('Patient history exported successfully!')
  }

  const handleViewScan = (scanId: string) => {
    router.push(`/viewer?scan=${scanId}`)
  }

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to History
        </motion.button>

        {/* Patient Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <GlassCard className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center text-2xl font-bold text-white">
                  {mockPatient.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{mockPatient.name}</h1>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span>ID: {mockPatient.id}</span>
                    <span>Age: {mockPatient.age}</span>
                    <span>DOB: {mockPatient.dateOfBirth}</span>
                    <span>{mockPatient.gender}</span>
                    <span>Blood: {mockPatient.bloodType}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {mockPatient.conditions.map(condition => (
                      <span key={condition} className="px-2 py-1 rounded-full bg-secondary text-xs">
                        {condition}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <GlassButton variant="secondary" onClick={handleExportHistory}>
                  <Download className="h-4 w-4" />
                  Export History
                </GlassButton>
                <GlassButton onClick={() => router.push('/upload')}>
                  <FileText className="h-4 w-4" />
                  New Scan
                </GlassButton>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Stats and Trend */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard className="p-6 h-full">
              <h3 className="text-sm font-medium text-muted-foreground mb-4">Scan Statistics</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{stats.total}</div>
                  <div className="text-xs text-muted-foreground">Total Scans</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-success">{stats.normal}</div>
                  <div className="text-xs text-muted-foreground">Normal</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-warning">{stats.abnormal}</div>
                  <div className="text-xs text-muted-foreground">Findings</div>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <GlassCard className="p-6 h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">Health Score Trend</h3>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Current:</span>
                  <span className="font-bold text-primary">82%</span>
                  <TrendIndicator current={82} previous={80} />
                </div>
              </div>
              <SimpleTrendChart data={trendData} />
            </GlassCard>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <div className="flex flex-wrap items-center gap-4">
            <GlassButton 
              variant="secondary" 
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
              Filter
              <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </GlassButton>
            
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="flex items-center gap-2 overflow-hidden"
                >
                  <button
                    onClick={() => setSelectedBodyPart(null)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                      !selectedBodyPart ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/80'
                    }`}
                  >
                    All
                  </button>
                  {bodyParts.map(part => (
                    <button
                      key={part}
                      onClick={() => setSelectedBodyPart(part)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-colors ${
                        selectedBodyPart === part ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/80'
                      }`}
                    >
                      {bodyPartIcons[part] || <Activity className="h-4 w-4" />}
                      {part}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Scan Timeline
          </h2>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-cyan-500 to-primary/20" />
            
            <div className="space-y-6">
              {filteredScans.map((scan, index) => (
                <motion.div
                  key={scan.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative pl-16"
                >
                  {/* Timeline dot */}
                  <div className={`absolute left-4 w-5 h-5 rounded-full border-2 ${statusColors[scan.overallStatus].border} ${statusColors[scan.overallStatus].bg} flex items-center justify-center`}>
                    <div className={`w-2 h-2 rounded-full ${statusColors[scan.overallStatus].text.replace('text-', 'bg-')}`} />
                  </div>
                  
                  <GlassCard className="p-4 hover:border-primary/50 transition-colors cursor-pointer" onClick={() => setExpandedScan(expandedScan === scan.id ? null : scan.id)}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-lg ${statusColors[scan.overallStatus].bg}`}>
                          {bodyPartIcons[scan.bodyPart] || <Activity className="h-5 w-5" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{scan.type}</h3>
                            <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${statusColors[scan.overallStatus].bg} ${statusColors[scan.overallStatus].text}`}>
                              {statusIcons[scan.overallStatus]}
                              {scan.overallStatus.charAt(0).toUpperCase() + scan.overallStatus.slice(1)}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {scan.date}
                            </span>
                            <span>{scan.modality}</span>
                            <span>Dr. {scan.radiologist.split(' ').pop()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <GlassButton 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleViewScan(scan.id)
                          }}
                        >
                          <ZoomIn className="h-4 w-4" />
                          View
                        </GlassButton>
                        <ChevronRight className={`h-5 w-5 text-muted-foreground transition-transform ${expandedScan === scan.id ? 'rotate-90' : ''}`} />
                      </div>
                    </div>
                    
                    <AnimatePresence>
                      {expandedScan === scan.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-4 pt-4 border-t border-border">
                            <h4 className="text-sm font-medium mb-2">Findings</h4>
                            <div className="space-y-2">
                              {scan.findings.map((finding, i) => (
                                <div key={i} className="flex items-start gap-2 text-sm">
                                  <div className={`mt-0.5 ${statusColors[finding.severity as keyof typeof statusColors]?.text || 'text-muted-foreground'}`}>
                                    {statusIcons[finding.severity as keyof typeof statusIcons] || <Info className="h-4 w-4" />}
                                  </div>
                                  <div>
                                    <span className="font-medium">{finding.type}:</span>{' '}
                                    <span className="text-muted-foreground">{finding.description}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            {scan.notes && (
                              <div className="mt-3 p-3 rounded-lg bg-secondary/30 text-sm">
                                <span className="font-medium">Notes: </span>
                                <span className="text-muted-foreground">{scan.notes}</span>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
