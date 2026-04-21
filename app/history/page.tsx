'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  FileImage,
  User,
  MoreHorizontal,
  X,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowUpDown,
} from 'lucide-react'
import { GlassCard, GlassButton, GlassInput, GlassSelect } from '@/components/ui/glass-card'
import { TableSkeleton } from '@/components/ui/ai-loader'
import { format } from 'date-fns'

interface ScanRecord {
  id: string
  patientId: string
  patientName: string
  modality: string
  bodyPart: string
  scanDate: string
  uploadDate: string
  status: 'completed' | 'pending' | 'processing' | 'failed'
  diagnosis: string | null
  confidence: number | null
  severity: 'normal' | 'mild' | 'moderate' | 'severe' | null
}

const mockData: ScanRecord[] = [
  {
    id: '1',
    patientId: 'P-12345',
    patientName: 'Ahmed Benali',
    modality: 'CT',
    bodyPart: 'Thorax',
    scanDate: '2024-01-15',
    uploadDate: '2024-01-15T10:30:00',
    status: 'completed',
    diagnosis: 'Pas d\'anomalie significative',
    confidence: 93.8,
    severity: 'normal',
  },
  {
    id: '2',
    patientId: 'P-12346',
    patientName: 'Fatima Mansouri',
    modality: 'MRI',
    bodyPart: 'Cerveau',
    scanDate: '2024-01-14',
    uploadDate: '2024-01-14T14:15:00',
    status: 'completed',
    diagnosis: 'Modifications mineures de la substance blanche',
    confidence: 89.2,
    severity: 'mild',
  },
  {
    id: '3',
    patientId: 'P-12347',
    patientName: 'Karim Bouzid',
    modality: 'X-Ray',
    bodyPart: 'Colonne',
    scanDate: '2024-01-14',
    uploadDate: '2024-01-14T09:45:00',
    status: 'pending',
    diagnosis: null,
    confidence: null,
    severity: null,
  },
  {
    id: '4',
    patientId: 'P-12348',
    patientName: 'Amina Hadj',
    modality: 'CT',
    bodyPart: 'Abdomen',
    scanDate: '2024-01-13',
    uploadDate: '2024-01-13T16:20:00',
    status: 'completed',
    diagnosis: 'Steatose hepatique moderee',
    confidence: 91.5,
    severity: 'moderate',
  },
  {
    id: '5',
    patientId: 'P-12349',
    patientName: 'Youssef Khelifi',
    modality: 'PET',
    bodyPart: 'Corps Entier',
    scanDate: '2024-01-12',
    uploadDate: '2024-01-12T11:00:00',
    status: 'processing',
    diagnosis: null,
    confidence: null,
    severity: null,
  },
  {
    id: '6',
    patientId: 'P-12350',
    patientName: 'Nadia Cherif',
    modality: 'MRI',
    bodyPart: 'Genou',
    scanDate: '2024-01-11',
    uploadDate: '2024-01-11T13:30:00',
    status: 'completed',
    diagnosis: 'Rupture LCA suspectee',
    confidence: 88.3,
    severity: 'severe',
  },
  {
    id: '7',
    patientId: 'P-12351',
    patientName: 'Omar Boudiaf',
    modality: 'CT',
    bodyPart: 'Tete',
    scanDate: '2024-01-10',
    uploadDate: '2024-01-10T08:45:00',
    status: 'completed',
    diagnosis: 'Resultats normaux',
    confidence: 95.1,
    severity: 'normal',
  },
  {
    id: '8',
    patientId: 'P-12352',
    patientName: 'Samira Mebarki',
    modality: 'Ultrasound',
    bodyPart: 'Abdomen',
    scanDate: '2024-01-09',
    uploadDate: '2024-01-09T15:15:00',
    status: 'failed',
    diagnosis: null,
    confidence: null,
    severity: null,
  },
]

const modalityFilters = [
  { value: 'all', label: 'Toutes Modalites' },
  { value: 'CT', label: 'Scanner (CT)' },
  { value: 'MRI', label: 'IRM' },
  { value: 'X-Ray', label: 'Radiographie' },
  { value: 'PET', label: 'PET Scan' },
  { value: 'Ultrasound', label: 'Echographie' },
]

const statusFilters = [
  { value: 'all', label: 'Tous Statuts' },
  { value: 'completed', label: 'Termine' },
  { value: 'pending', label: 'En attente' },
  { value: 'processing', label: 'En cours' },
  { value: 'failed', label: 'Echoue' },
]

export default function HistoryPage() {
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [modalityFilter, setModalityFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortField, setSortField] = useState<keyof ScanRecord>('uploadDate')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [selectedRecord, setSelectedRecord] = useState<ScanRecord | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const filteredData = useMemo(() => {
    let result = [...mockData]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (r) =>
          r.patientName.toLowerCase().includes(query) ||
          r.patientId.toLowerCase().includes(query) ||
          r.diagnosis?.toLowerCase().includes(query)
      )
    }

    // Modality filter
    if (modalityFilter !== 'all') {
      result = result.filter((r) => r.modality === modalityFilter)
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((r) => r.status === statusFilter)
    }

    // Sort
    result.sort((a, b) => {
      const aVal = a[sortField]
      const bVal = b[sortField]
      if (aVal === null) return 1
      if (bVal === null) return -1
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    return result
  }, [searchQuery, modalityFilter, statusFilter, sortField, sortDirection])

  const handleSort = (field: keyof ScanRecord) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const statusStyles = {
    completed: { bg: 'bg-success/20', text: 'text-success', icon: CheckCircle2 },
    pending: { bg: 'bg-warning/20', text: 'text-warning', icon: Clock },
    processing: { bg: 'bg-primary/20', text: 'text-primary', icon: Clock },
    failed: { bg: 'bg-destructive/20', text: 'text-destructive', icon: AlertTriangle },
  }

  const severityStyles = {
    normal: 'bg-success/20 text-success',
    mild: 'bg-warning/20 text-warning',
    moderate: 'bg-orange-500/20 text-orange-500',
    severe: 'bg-destructive/20 text-destructive',
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <div className="h-8 w-48 bg-muted/50 rounded animate-pulse mb-2" />
          <div className="h-4 w-64 bg-muted/50 rounded animate-pulse" />
        </div>
        <TableSkeleton rows={8} />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Historique des Scans</h1>
        <p className="text-muted-foreground">
          Consultez et gerez vos dossiers d&apos;imagerie medicale
        </p>
      </motion.div>

      {/* Search and Filters */}
      <GlassCard className="mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher par nom, ID, ou diagnostic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg glass-subtle bg-input/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          
          <div className="flex gap-2">
            <GlassButton
              variant="secondary"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden"
            >
              <Filter className="h-4 w-4" />
              Filters
            </GlassButton>
            
            <div className={`${showFilters ? 'flex' : 'hidden'} lg:flex gap-2 flex-wrap`}>
              <GlassSelect
                value={modalityFilter}
                onChange={(e) => setModalityFilter(e.target.value)}
                options={modalityFilters}
              />
              <GlassSelect
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={statusFilters}
              />
            </div>
            
            <GlassButton 
              variant="secondary"
              onClick={() => {
                const csv = filteredData.map(r => 
                  `${r.patientId},${r.patientName},${r.modality},${r.bodyPart},${r.scanDate},${r.status},${r.diagnosis || ''},${r.confidence || ''}`
                ).join('\n')
                const header = 'ID Patient,Nom,Modalite,Region,Date,Statut,Diagnostic,Confiance\n'
                const blob = new Blob([header + csv], { type: 'text/csv;charset=utf-8;' })
                const url = URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = url
                link.download = 'historique-scans.csv'
                link.click()
                URL.revokeObjectURL(url)
              }}
            >
              <Download className="h-4 w-4" />
              Exporter
            </GlassButton>
          </div>
        </div>
      </GlassCard>

      {/* Results count */}
      <p className="text-sm text-muted-foreground mb-4">
        Affichage de {filteredData.length} sur {mockData.length} enregistrements
      </p>

      {/* Table */}
      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort('patientName')}
                    className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
                  >
                    Patient
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort('modality')}
                    className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
                  >
                    Modality
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort('scanDate')}
                    className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
                  >
                    Scan Date
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <span className="text-sm font-medium text-muted-foreground">Status</span>
                </th>
                <th className="px-4 py-3 text-left">
                  <span className="text-sm font-medium text-muted-foreground">Diagnosis</span>
                </th>
                <th className="px-4 py-3 text-left">
                  <span className="text-sm font-medium text-muted-foreground">Confidence</span>
                </th>
                <th className="px-4 py-3 text-right">
                  <span className="text-sm font-medium text-muted-foreground">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredData.map((record, index) => {
                  const StatusIcon = statusStyles[record.status].icon
                  return (
                    <motion.tr
                      key={record.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                    >
                      <td className="px-4 py-4">
                        <Link href={`/patient/${record.patientId}`} className="flex items-center gap-3 group">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium group-hover:text-primary transition-colors">{record.patientName}</p>
                            <p className="text-sm text-muted-foreground">{record.patientId}</p>
                          </div>
                        </Link>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <FileImage className="h-4 w-4 text-muted-foreground" />
                          <span>{record.modality}</span>
                          <span className="text-muted-foreground">- {record.bodyPart}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{format(new Date(record.scanDate), 'MMM d, yyyy')}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[record.status].bg} ${statusStyles[record.status].text}`}>
                          <StatusIcon className="h-3 w-3" />
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        {record.diagnosis ? (
                          <div>
                            <p className="text-sm truncate max-w-[200px]">{record.diagnosis}</p>
                            {record.severity && (
                              <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs ${severityStyles[record.severity]}`}>
                                {record.severity}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {record.confidence !== null ? (
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-muted/30 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full"
                                style={{ width: `${record.confidence}%` }}
                              />
                            </div>
                            <span className="text-sm">{record.confidence}%</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/analysis?id=${record.id}`}>
                            <GlassButton variant="ghost" size="sm" title="Voir">
                              <Eye className="h-4 w-4" />
                            </GlassButton>
                          </Link>
                          <GlassButton
                            variant="ghost"
                            size="sm"
                            title="Details"
                            onClick={() => setSelectedRecord(record)}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </GlassButton>
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {filteredData.length === 0 && (
          <div className="py-12 text-center">
            <FileImage className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucun enregistrement trouve</h3>
            <p className="text-muted-foreground">Essayez d&apos;ajuster votre recherche ou vos filtres</p>
          </div>
        )}
      </GlassCard>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedRecord && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => setSelectedRecord(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg"
            >
              <GlassCard variant="strong">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Details du Scan</h2>
                  <button
                    onClick={() => setSelectedRecord(null)}
                    className="p-2 rounded-lg hover:bg-secondary/50"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Patient</p>
                      <p className="font-medium">{selectedRecord.patientName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Patient ID</p>
                      <p className="font-medium">{selectedRecord.patientId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Modality</p>
                      <p className="font-medium">{selectedRecord.modality}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Body Part</p>
                      <p className="font-medium">{selectedRecord.bodyPart}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Scan Date</p>
                      <p className="font-medium">{format(new Date(selectedRecord.scanDate), 'MMMM d, yyyy')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Upload Date</p>
                      <p className="font-medium">{format(new Date(selectedRecord.uploadDate), 'MMMM d, yyyy h:mm a')}</p>
                    </div>
                  </div>

                  {selectedRecord.diagnosis && (
                    <div className="pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground mb-2">AI Diagnosis</p>
                      <p className="font-medium">{selectedRecord.diagnosis}</p>
                      {selectedRecord.confidence && (
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-sm text-muted-foreground">Confidence:</span>
                          <span className="font-medium text-primary">{selectedRecord.confidence}%</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Link href={`/analysis?id=${selectedRecord.id}`} className="flex-1">
                      <GlassButton className="w-full">
                        <Eye className="h-4 w-4" />
                        Voir l&apos;Analyse
                      </GlassButton>
                    </Link>
                    <GlassButton 
                      variant="secondary"
                      onClick={() => {
                        const content = `Patient: ${selectedRecord.patientName}\nID: ${selectedRecord.patientId}\nModalite: ${selectedRecord.modality}\nRegion: ${selectedRecord.bodyPart}\nDate: ${selectedRecord.scanDate}\nDiagnostic: ${selectedRecord.diagnosis || 'N/A'}\nConfiance: ${selectedRecord.confidence || 'N/A'}%`
                        const blob = new Blob([content], { type: 'text/plain' })
                        const url = URL.createObjectURL(blob)
                        const link = document.createElement('a')
                        link.href = url
                        link.download = `scan-${selectedRecord.patientId}.txt`
                        link.click()
                        URL.revokeObjectURL(url)
                      }}
                    >
                      <Download className="h-4 w-4" />
                      Exporter
                    </GlassButton>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
