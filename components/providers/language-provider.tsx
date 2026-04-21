'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { type Locale, type TranslationKey, translations, isRTL, locales, localeNames } from '@/lib/i18n'

interface LanguageContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: TranslationKey) => string
  isRTL: boolean
  locales: typeof locales
  localeNames: typeof localeNames
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const STORAGE_KEY = 'medvision-locale'

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')
  const [mounted, setMounted] = useState(false)

  // Load saved locale on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null
    if (saved && locales.includes(saved)) {
      setLocaleState(saved)
    } else {
      // Try to detect browser language
      const browserLang = navigator.language.split('-')[0]
      if (browserLang === 'fr') {
        setLocaleState('fr')
      } else if (browserLang === 'ar') {
        setLocaleState('ar')
      }
    }
    setMounted(true)
  }, [])

  // Update document direction and lang when locale changes
  useEffect(() => {
    if (mounted) {
      document.documentElement.lang = locale
      document.documentElement.dir = isRTL(locale) ? 'rtl' : 'ltr'
    }
  }, [locale, mounted])

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem(STORAGE_KEY, newLocale)
  }, [])

  const t = useCallback((key: TranslationKey): string => {
    return translations[locale][key] || translations.en[key] || key
  }, [locale])

  const value: LanguageContextType = {
    locale,
    setLocale,
    t,
    isRTL: isRTL(locale),
    locales,
    localeNames,
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

// Hook for components that need the translation function
export function useTranslation() {
  const { t, locale, isRTL } = useLanguage()
  return { t, locale, isRTL }
}
