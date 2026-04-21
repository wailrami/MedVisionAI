'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, Check, ChevronDown } from 'lucide-react'
import { useLanguage } from '@/components/providers/language-provider'
import type { Locale } from '@/lib/i18n'

const flagEmojis: Record<Locale, string> = {
  en: '🇺🇸',
  fr: '🇫🇷',
  ar: '🇸🇦',
}

export function LanguageSwitcher({ variant = 'default' }: { variant?: 'default' | 'compact' }) {
  const { locale, setLocale, locales, localeNames } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Avoid hydration mismatch - render placeholder until mounted
  if (!mounted) {
    return (
      <div className="flex items-center justify-center w-9 h-9 rounded-lg glass-subtle">
        <Globe className="h-4 w-4" />
      </div>
    )
  }

  const handleSelect = (newLocale: Locale) => {
    setLocale(newLocale)
    setIsOpen(false)
  }

  if (variant === 'compact') {
    return (
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center w-9 h-9 rounded-lg glass-subtle hover:bg-secondary/50 transition-colors"
          aria-label="Select language"
        >
          <Globe className="h-4 w-4" />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-40 rounded-lg glass border border-border shadow-lg overflow-hidden z-50"
            >
              {locales.map((l) => (
                <button
                  key={l}
                  onClick={() => handleSelect(l)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm transition-colors ${
                    l === locale ? 'bg-primary/10 text-primary' : 'hover:bg-secondary/50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{flagEmojis[l]}</span>
                    <span>{localeNames[l]}</span>
                  </span>
                  {l === locale && <Check className="h-4 w-4" />}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg glass-subtle hover:bg-secondary/50 transition-colors text-sm"
      >
        <Globe className="h-4 w-4" />
        <span>{flagEmojis[locale]}</span>
        <span className="hidden sm:inline">{localeNames[locale]}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-48 rounded-lg glass border border-border shadow-lg overflow-hidden z-50"
          >
            {locales.map((l) => (
              <button
                key={l}
                onClick={() => handleSelect(l)}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors ${
                  l === locale ? 'bg-primary/10 text-primary' : 'hover:bg-secondary/50'
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className="text-lg">{flagEmojis[l]}</span>
                  <span>{localeNames[l]}</span>
                </span>
                {l === locale && <Check className="h-4 w-4" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
