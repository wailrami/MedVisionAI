'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface AILoaderProps {
  className?: string
  message?: string
  size?: 'sm' | 'md' | 'lg'
}

export function AILoader({ className, message = 'AI Analyzing...', size = 'md' }: AILoaderProps) {
  const sizes = {
    sm: { width: 120, height: 4, text: 'text-xs' },
    md: { width: 200, height: 6, text: 'text-sm' },
    lg: { width: 300, height: 8, text: 'text-base' },
  }

  const { width, height, text } = sizes[size]

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      {/* Laser scan animation */}
      <div
        className="relative rounded-full overflow-hidden bg-muted/30"
        style={{ width, height }}
      >
        {/* Background track */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-muted/20 to-transparent" />
        
        {/* Laser beam */}
        <motion.div
          className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-primary to-transparent"
          animate={{
            x: [-width, width * 1.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ boxShadow: '0 0 20px var(--primary), 0 0 40px var(--primary)' }}
        />
        
        {/* Secondary pulse */}
        <motion.div
          className="absolute inset-y-0 w-1/4 bg-gradient-to-r from-transparent via-accent/50 to-transparent"
          animate={{
            x: [-width * 0.5, width * 1.2],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.5,
          }}
        />
      </div>

      {/* Message with typing effect */}
      <motion.p
        className={cn('text-muted-foreground font-medium', text)}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {message}
      </motion.p>
    </div>
  )
}

// Brain activity visualization
export function BrainActivity({ className }: { className?: string }) {
  const bars = 12

  return (
    <div className={cn('flex items-end justify-center gap-1 h-12', className)}>
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-primary rounded-full"
          animate={{
            height: [8, 32, 16, 40, 8],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.1,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

// Circular progress with percentage
interface CircularProgressProps {
  value: number
  size?: number
  strokeWidth?: number
  className?: string
  showValue?: boolean
}

export function CircularProgress({
  value,
  size = 120,
  strokeWidth = 8,
  className,
  showValue = true,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (value / 100) * circumference

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/30"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className="text-primary"
          style={{
            strokeDasharray: circumference,
          }}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className="text-2xl font-bold text-foreground"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            {Math.round(value)}%
          </motion.span>
        </div>
      )}
    </div>
  )
}

// Skeleton loader variants
interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular' | 'card'
}

export function Skeleton({ className, variant = 'text' }: SkeletonProps) {
  const variants = {
    text: 'h-4 w-full rounded',
    circular: 'h-12 w-12 rounded-full',
    rectangular: 'h-24 w-full rounded-lg',
    card: 'h-48 w-full rounded-xl',
  }

  return (
    <motion.div
      className={cn(
        'bg-muted/50',
        variants[variant],
        className
      )}
      animate={{
        opacity: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  )
}

// Dashboard skeleton
export function DashboardSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="glass rounded-xl p-6 space-y-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-2 w-full" />
        </div>
      ))}
    </div>
  )
}

// Table skeleton
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="glass rounded-xl overflow-hidden">
      <div className="p-4 border-b border-border">
        <Skeleton className="h-6 w-48" />
      </div>
      <div className="divide-y divide-border">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 flex items-center gap-4">
            <Skeleton variant="circular" className="h-10 w-10" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
        ))}
      </div>
    </div>
  )
}
