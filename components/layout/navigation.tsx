'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ThemeToggle, ThemeToggleCompact } from '@/components/ui/theme-toggle'
import { LanguageSwitcher } from '@/components/ui/language-switcher'
import { useLanguage } from '@/components/providers/language-provider'
import {
  Brain,
  LayoutDashboard,
  Scan,
  History,
  Users,
  CreditCard,
  User,
  Mail,
  Menu,
  X,
  LogOut,
  ChevronDown,
} from 'lucide-react'
import { useAuthStore } from '@/lib/store'

const navItemsConfig = [
  { href: '/dashboard', icon: LayoutDashboard, labelKey: 'nav.dashboard' as const },
  { href: '/analysis', icon: Scan, labelKey: 'nav.analysis' as const },
  { href: '/history', icon: History, labelKey: 'nav.history' as const },
  { href: '/crowdsource', icon: Users, labelKey: 'nav.crowdsource' as const },
  { href: '/pricing', icon: CreditCard, labelKey: 'nav.pricing' as const },
]

const publicNavItemsConfig = [
  { href: '/', labelKey: 'nav.home' as const },
  { href: '/pricing', labelKey: 'nav.pricing' as const },
  { href: '/contact', labelKey: 'nav.contact' as const },
]

export function Navbar() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  const { user, isAuthenticated, logout } = useAuthStore()
  const { t } = useLanguage()
  
  // Create translated nav items
  const navItems = navItemsConfig.map(item => ({ ...item, label: t(item.labelKey) }))
  const publicNavItems = publicNavItemsConfig.map(item => ({ ...item, label: t(item.labelKey) }))

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSignOut = () => {
    logout()
    window.location.href = '/'
  }

  const isAuthPage = pathname?.startsWith('/auth')
  const isAppPage = pathname?.startsWith('/dashboard') || 
                    pathname?.startsWith('/analysis') || 
                    pathname?.startsWith('/history') ||
                    pathname?.startsWith('/crowdsource') ||
                    pathname?.startsWith('/profile')

  if (isAuthPage) return null

  return (
    <>
      <motion.header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled || mobileMenuOpen ? 'glass-strong' : 'bg-transparent'
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href={mounted && isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2 group">
            <motion.div
              className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Brain className="h-6 w-6 text-primary" />
            </motion.div>
            <span className="font-bold text-xl gradient-text">MedVision AI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {isAppPage ? (
              // App navigation
              <>
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'relative flex items-center gap-2 px-3 py-2 rounded-lg transition-colors',
                      'text-muted-foreground hover:text-foreground',
                      pathname === item.href && 'text-foreground'
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                    {pathname === item.href && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute inset-0 bg-primary/10 rounded-lg -z-10"
                        transition={{ type: 'spring', duration: 0.3 }}
                      />
                    )}
                  </Link>
                ))}
              </>
            ) : (
              // Public navigation
              <>
                {publicNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'text-sm font-medium transition-colors',
                      'text-muted-foreground hover:text-foreground',
                      pathname === item.href && 'text-foreground'
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <LanguageSwitcher variant="compact" />
            <ThemeToggle className="hidden md:flex" />
            
            {mounted && isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-2 rounded-lg glass-subtle hover:bg-secondary/50 transition-colors"
                >
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <span className="hidden md:block text-sm font-medium max-w-25 truncate">
                    {user.fullName.split(' ')[0]}
                  </span>
                  <ChevronDown className={cn(
                    'h-4 w-4 text-muted-foreground transition-transform hidden md:block',
                    userMenuOpen && 'rotate-180'
                  )} />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 top-full mt-2 w-48 py-2 rounded-xl glass-strong"
                    >
                      <Link
                        href="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-secondary/50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        {t('nav.profile')}
                      </Link>
                      <Link
                        href="/contact"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-secondary/50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Mail className="h-4 w-4" />
                        {t('nav.contact')}
                      </Link>
                      <hr className="my-2 border-border" />
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors w-full"
                      >
                        <LogOut className="h-4 w-4" />
                        {t('nav.logout')}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="hidden md:block px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  href="/auth/sign-up"
                  className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  {t('nav.signup')}
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg glass-subtle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="container mx-auto px-4 py-4 space-y-2">
                {isAppPage ? (
                  navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                        pathname === item.href
                          ? 'bg-primary/10 text-foreground'
                          : 'text-muted-foreground hover:bg-secondary/50'
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  ))
                ) : (
                  publicNavItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'block px-4 py-3 rounded-lg font-medium transition-colors',
                        pathname === item.href
                          ? 'bg-primary/10 text-foreground'
                          : 'text-muted-foreground hover:bg-secondary/50'
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))
                )}
                <div className="pt-4 space-y-3 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t('profile.language')}</span>
                    <LanguageSwitcher />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t('profile.theme')}</span>
                    <ThemeToggleCompact />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Spacer */}
      <div className="h-16" />
    </>
  )
}
