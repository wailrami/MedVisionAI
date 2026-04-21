'use client'

import { useAppStore, Theme } from '@/lib/store'
import { Sun, Moon, Eye } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const themes: { value: Theme; icon: React.ReactNode; label: string }[] = [
  { value: 'light', icon: <Sun className="h-4 w-4" />, label: 'Light' },
  { value: 'dark', icon: <Moon className="h-4 w-4" />, label: 'Dark' },
  { value: 'colorblind', icon: <Eye className="h-4 w-4" />, label: 'Color-blind' },
]

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useAppStore()

  return (
    <div className={cn('flex items-center gap-1 p-1 rounded-lg glass-subtle', className)}>
      {themes.map(({ value, icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={cn(
            'relative flex items-center justify-center p-2 rounded-md transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-primary/50',
            theme === value ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
          )}
          title={label}
          aria-label={`Switch to ${label} theme`}
        >
          {theme === value && (
            <motion.div
              layoutId="theme-indicator"
              className="absolute inset-0 bg-primary rounded-md"
              transition={{ type: 'spring', duration: 0.3 }}
            />
          )}
          <span className="relative z-10">{icon}</span>
        </button>
      ))}
    </div>
  )
}

// Compact version for mobile
export function ThemeToggleCompact() {
  const { theme, setTheme } = useAppStore()

  const cycleTheme = () => {
    const themeOrder: Theme[] = ['light', 'dark', 'colorblind']
    const currentIndex = themeOrder.indexOf(theme)
    const nextIndex = (currentIndex + 1) % themeOrder.length
    setTheme(themeOrder[nextIndex])
  }

  const currentTheme = themes.find((t) => t.value === theme)

  return (
    <motion.button
      onClick={cycleTheme}
      className="p-2 rounded-lg glass-subtle text-muted-foreground hover:text-foreground transition-colors"
      whileTap={{ scale: 0.95 }}
      title={`Current: ${currentTheme?.label}. Click to change.`}
    >
      {currentTheme?.icon}
    </motion.button>
  )
}
