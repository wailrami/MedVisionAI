'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Upload,
  FileImage,
  Activity,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
  Brain,
  Users,
  ChevronRight,
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { DashboardSkeleton } from '@/components/ui/ai-loader'
import { StaggerContainer, StaggerItem } from '@/components/layout/page-transition'
import { useAuthStore } from '@/lib/store'
import { format } from 'date-fns'

interface DashboardStats {
  totalScans: number
  scansThisMonth: number
  pendingReports: number
  avgConfidence: number
  recentActivity: Array<{
    id: string
    type: 'upload' | 'report' | 'annotation'
    title: string
    time: string
    status?: 'success' | 'warning' | 'pending'
  }>
}

const mockStats: DashboardStats = {
  totalScans: 247,
  scansThisMonth: 34,
  pendingReports: 5,
  avgConfidence: 93.2,
  recentActivity: [
    { id: '1', type: 'upload', title: 'Chest CT - Patient #4521', time: '5 min ago', status: 'success' },
    { id: '2', type: 'report', title: 'Brain MRI Analysis Complete', time: '23 min ago', status: 'success' },
    { id: '3', type: 'annotation', title: 'Lung nodule marked for review', time: '1 hour ago', status: 'warning' },
    { id: '4', type: 'upload', title: 'Spine X-Ray - Patient #8932', time: '2 hours ago', status: 'success' },
    { id: '5', type: 'report', title: 'Abdominal CT pending review', time: '3 hours ago', status: 'pending' },
  ],
}

const statCards = [
  {
    title: 'Total Scans',
    value: (stats: DashboardStats) => stats.totalScans.toLocaleString(),
    change: '+12%',
    changeType: 'positive' as const,
    icon: FileImage,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    title: 'This Month',
    value: (stats: DashboardStats) => stats.scansThisMonth.toString(),
    change: '+8%',
    changeType: 'positive' as const,
    icon: TrendingUp,
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
  {
    title: 'Pending Reports',
    value: (stats: DashboardStats) => stats.pendingReports.toString(),
    change: '-3',
    changeType: 'neutral' as const,
    icon: Clock,
    color: 'text-warning',
    bgColor: 'bg-warning/10',
  },
  {
    title: 'Avg. Confidence',
    value: (stats: DashboardStats) => `${stats.avgConfidence}%`,
    change: '+0.5%',
    changeType: 'positive' as const,
    icon: Activity,
    color: 'text-accent',
    bgColor: 'bg-accent/10',
  },
]

const quickActions = [
  { title: 'New Analysis', href: '/analysis', icon: Upload, color: 'bg-primary' },
  { title: 'View History', href: '/history', icon: Brain, color: 'bg-accent' },
  { title: 'Crowdsource', href: '/crowdsource', icon: Users, color: 'bg-success' },
]

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const { user } = useAuthStore()

  useEffect(() => {
    const fetchData = async () => {
      // Simulate loading real stats
      await new Promise(resolve => setTimeout(resolve, 800))
      setStats(mockStats)
      setLoading(false)
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <div className="h-8 w-48 bg-muted/50 rounded animate-pulse mb-2" />
          <div className="h-4 w-64 bg-muted/50 rounded animate-pulse" />
        </div>
        <DashboardSkeleton />
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
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, <span className="gradient-text">{user?.fullName?.split(' ')[0] || 'User'}</span>
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening with your medical imaging today.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {statCards.map((card) => (
          <StaggerItem key={card.title}>
            <GlassCard className="relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{card.title}</p>
                  <p className="text-3xl font-bold">{stats && card.value(stats)}</p>
                  <div className={`flex items-center gap-1 mt-2 text-sm ${
                    card.changeType === 'positive' ? 'text-success' : 
                    card.changeType === 'negative' ? 'text-destructive' : 'text-muted-foreground'
                  }`}>
                    {card.changeType === 'positive' && <TrendingUp className="h-4 w-4" />}
                    <span>{card.change} from last month</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${card.bgColor}`}>
                  <card.icon className={`h-6 w-6 ${card.color}`} />
                </div>
              </div>
              {/* Subtle glow effect */}
              <div className={`absolute -bottom-4 -right-4 w-24 h-24 ${card.bgColor} rounded-full blur-2xl opacity-50`} />
            </GlassCard>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <GlassCard>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Recent Activity</h2>
              <Link
                href="/history"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                View all
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="space-y-4">
              {stats?.recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                >
                  <div className={`p-2 rounded-lg ${
                    activity.status === 'success' ? 'bg-success/20' :
                    activity.status === 'warning' ? 'bg-warning/20' : 'bg-muted/50'
                  }`}>
                    {activity.status === 'success' && <CheckCircle2 className="h-5 w-5 text-success" />}
                    {activity.status === 'warning' && <AlertTriangle className="h-5 w-5 text-warning" />}
                    {activity.status === 'pending' && <Clock className="h-5 w-5 text-muted-foreground" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.time}</p>
                  </div>
                  <Link href={`/history/${activity.id}`}>
                    <ArrowUpRight className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Quick Actions & Charts */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <GlassCard>
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              {quickActions.map((action) => (
                <Link key={action.title} href={action.href}>
                  <motion.div
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                  >
                    <div className={`p-2 rounded-lg ${action.color}`}>
                      <action.icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-medium">{action.title}</span>
                    <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground" />
                  </motion.div>
                </Link>
              ))}
            </div>
          </GlassCard>

          {/* Diagnostic Distribution */}
          <GlassCard>
            <h2 className="text-xl font-semibold mb-4">Scan Distribution</h2>
            <div className="space-y-4">
              {[
                { label: 'CT Scans', value: 45, color: 'bg-chart-1' },
                { label: 'MRI', value: 28, color: 'bg-chart-2' },
                { label: 'X-Ray', value: 18, color: 'bg-chart-3' },
                { label: 'Other', value: 9, color: 'bg-chart-4' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{item.label}</span>
                    <span className="text-muted-foreground">{item.value}%</span>
                  </div>
                  <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${item.color} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* AI Performance */}
          <GlassCard>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">AI Performance</h2>
            </div>
            <div className="text-center py-4">
              <motion.div
                className="text-5xl font-bold gradient-text mb-2"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                93.2%
              </motion.div>
              <p className="text-sm text-muted-foreground">
                Diagnostic accuracy this month
              </p>
              <div className="mt-4 flex items-center justify-center gap-2 text-success text-sm">
                <TrendingUp className="h-4 w-4" />
                <span>+1.3% improvement</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
