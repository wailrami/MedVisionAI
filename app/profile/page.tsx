'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User,
  Mail,
  Building2,
  Shield,
  Bell,
  CreditCard,
  Globe,
  Eye,
  Palette,
  Save,
  Camera,
  CheckCircle2,
  AlertCircle,
  LogOut,
} from 'lucide-react'
import { GlassCard, GlassButton, GlassInput, GlassSelect } from '@/components/ui/glass-card'
import { useAppStore, useAuthStore, type Theme, type Language } from '@/lib/store'

const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' },
  { value: 'ar', label: 'العربية' },
]

const themeOptions = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'colorblind', label: 'Color-Blind Friendly' },
]

const getTabs = (t: (key: any) => string) => [
  { id: 'profile', label: t('profile.profileTab'), icon: User },
  { id: 'preferences', label: t('profile.preferencesTab'), icon: Palette },
  { id: 'notifications', label: t('profile.notificationsTab'), icon: Bell },
  { id: 'security', label: t('profile.securityTab'), icon: Shield },
  { id: 'billing', label: t('profile.billingTab'), icon: CreditCard },
]

import { useLanguage } from '@/components/providers/language-provider'

export default function ProfilePage() {
  const router = useRouter()
  const { theme, language, setTheme, setLanguage } = useAppStore()
  const { user, isAuthenticated, logout } = useAuthStore()
  const { t } = useLanguage()
  
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    role: 'radiologist',
    institution: '',
    phone: '',
    bio: '',
  })
  
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    scanComplete: true,
    weeklyReport: false,
    marketingEmails: false,
  })

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      router.push('/auth/login')
      return
    }

    // Load profile from auth store
    setProfile({
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      institution: user.institution,
      phone: '',
      bio: '',
    })
    setLoading(false)
  }, [user, isAuthenticated, router])

  const handleSaveProfile = async () => {
    setSaving(true)
    setError(null)
    setSuccess(null)

    // Demo mode - simulate save
    setTimeout(() => {
      setSaving(false)
      setSuccess(t('profile.saved'))
      setTimeout(() => setSuccess(null), 3000)
    }, 500)
  }

  const handleSavePreferences = () => {
    setSaving(true)
    // Theme and language are already saved via Zustand persist
    setTimeout(() => {
      setSaving(false)
      setSuccess(t('profile.saved'))
      setTimeout(() => setSuccess(null), 3000)
    }, 500)
  }

  const handleSignOut = () => {
    logout()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-muted/50 rounded" />
          <div className="h-64 bg-muted/50 rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">{t('profile.title')}</h1>
        <p className="text-muted-foreground">
          {t('profile.subtitle')}
        </p>
      </motion.div>

      {/* Success/Error Messages */}
      <AnimatePresence>
        {(success || error) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`flex items-center gap-2 p-4 mb-6 rounded-lg ${
              success ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
            }`}
          >
            {success ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <p className="text-sm">{success || error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <GlassCard className="p-2">
            <nav className="space-y-1">
              {getTabs(t).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
              <hr className="my-2 border-border" />
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium">{t('profile.signOut')}</span>
              </button>
            </nav>
          </GlassCard>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <GlassCard>
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    {t('profile.personalInfo')}
                  </h2>

                  {/* Avatar */}
                  <div className="flex items-center gap-6 mb-8">
                    <div className="relative">
                      <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center">
                        <User className="h-12 w-12 text-primary" />
                      </div>
                      <button className="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                        <Camera className="h-4 w-4" />
                      </button>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{profile.fullName || 'Your Name'}</h3>
                      <p className="text-muted-foreground">{profile.email}</p>
                      <p className="text-sm text-primary capitalize">{t(("profile." + profile.role) as any)}</p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <GlassInput
                      label={t('profile.fullName')}
                      placeholder="Dr. Jane Smith"
                      value={profile.fullName}
                      onChange={(e) => setProfile(prev => ({ ...prev, fullName: e.target.value }))}
                      icon={<User className="h-4 w-4" />}
                    />
                    <GlassInput
                      label={t('profile.email')}
                      type="email"
                      placeholder="you@hospital.com"
                      value={profile.email}
                      disabled
                      icon={<Mail className="h-4 w-4" />}
                    />
                    <GlassInput
                      label={t('profile.institution')}
                      placeholder="Hospital or Clinic"
                      value={profile.institution}
                      onChange={(e) => setProfile(prev => ({ ...prev, institution: e.target.value }))}
                      icon={<Building2 className="h-4 w-4" />}
                    />
                    <GlassInput
                      label={t('profile.phone')}
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={profile.phone}
                      onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                    />
                    <div className="sm:col-span-2">
                      <label className="text-sm font-medium text-foreground mb-2 block">{t('profile.bio')}</label>
                      <textarea
                        className="w-full rounded-lg px-4 py-2.5 glass-subtle bg-input/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200 min-h-[100px] resize-none"
                        placeholder="Tell us about yourself..."
                        value={profile.bio}
                        onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end mt-6">
                    <GlassButton onClick={handleSaveProfile} loading={saving}>
                      <Save className="h-4 w-4" />
                      {t('profile.save')}
                    </GlassButton>
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <motion.div
                key="preferences"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <GlassCard>
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <Palette className="h-5 w-5 text-primary" />
                    {t('profile.displaySettings')}
                  </h2>

                  <div className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <GlassSelect
                        label={t('profile.theme')}
                        value={theme}
                        onChange={(e) => setTheme(e.target.value as Theme)}
                        options={themeOptions}
                      />
                      <GlassSelect
                        label={t('profile.language')}
                        value={language}
                        onChange={(e) => setLanguage(e.target.value as Language)}
                        options={languageOptions}
                      />
                    </div>

                    <div className="p-4 rounded-lg bg-secondary/30">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Accessibility
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        The color-blind friendly theme uses high-contrast colors optimized for deuteranopia and protanopia.
                      </p>
                      <div className="flex gap-4">
                        {['light', 'dark', 'colorblind'].map((tm) => (
                          <button
                            key={tm}
                            onClick={() => setTheme(tm as Theme)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              theme === tm
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-secondary/50 text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            {t((`profile.theme${tm.charAt(0).toUpperCase() + tm.slice(1)}`) as any)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-6">
                    <GlassButton onClick={handleSavePreferences} loading={saving}>
                      <Save className="h-4 w-4" />
                      {t('profile.save')}
                    </GlassButton>
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <GlassCard>
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />
                    {t('profile.notificationsTab')}
                  </h2>

                  <div className="space-y-4">
                    {[
                      { key: 'emailAlerts', label: 'profile.emailAlerts', description: 'profile.emailAlerts' },
                      { key: 'scanComplete', label: 'profile.scanComplete', description: 'profile.scanComplete' },
                      { key: 'weeklyReport', label: 'profile.weeklyReport', description: 'profile.weeklyReport' },
                      { key: 'marketingEmails', label: 'profile.marketingEmails', description: 'profile.marketingEmails' },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between p-4 rounded-lg bg-secondary/30"
                      >
                        <div>
                          <p className="font-medium">{t(item.label as any)}</p>
                          <p className="text-sm text-muted-foreground">{t(item.description as any)}</p>
                        </div>
                        <button
                          onClick={() => setNotifications(prev => ({
                            ...prev,
                            [item.key]: !prev[item.key as keyof typeof prev],
                          }))}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            notifications[item.key as keyof typeof notifications]
                              ? 'bg-primary'
                              : 'bg-muted'
                          }`}
                        >
                          <span
                            className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                              notifications[item.key as keyof typeof notifications]
                                ? 'translate-x-7'
                                : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end mt-6">
                    <GlassButton onClick={() => {
                      setSuccess(t('profile.saved'))
                      setTimeout(() => setSuccess(null), 3000)
                    }}>
                      <Save className="h-4 w-4" />
                      {t('profile.save')}
                    </GlassButton>
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <motion.div
                key="security"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <GlassCard>
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    {t('profile.securityTab')}
                  </h2>

                  <div className="space-y-6">
                    <div className="p-4 rounded-lg bg-secondary/30">
                      <h3 className="font-medium mb-2">{t('profile.changePassword')}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Update your password to keep your account secure.
                      </p>
                      <GlassButton variant="secondary" size="sm">
                        {t('profile.changePassword')}
                      </GlassButton>
                    </div>

                    <div className="p-4 rounded-lg bg-secondary/30">
                      <h3 className="font-medium mb-2">Two-Factor Authentication</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Add an extra layer of security to your account.
                      </p>
                      <GlassButton variant="secondary" size="sm">
                        Enable 2FA
                      </GlassButton>
                    </div>

                    <div className="p-4 rounded-lg bg-secondary/30">
                      <h3 className="font-medium mb-2">Active Sessions</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Manage devices where you&apos;re currently logged in.
                      </p>
                      <div className="p-3 rounded bg-background/50 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Current Device</p>
                          <p className="text-xs text-muted-foreground">Last active: Now</p>
                        </div>
                        <span className="text-xs px-2 py-1 rounded bg-success/20 text-success">Active</span>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {/* Billing Tab */}
            {activeTab === 'billing' && (
              <motion.div
                key="billing"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <GlassCard>
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    {t('profile.billingTab')}
                  </h2>

                  <div className="space-y-6">
                    <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{t('profile.currentPlan')}</h3>
                        <span className="text-sm px-2 py-1 rounded bg-success/20 text-success">Active</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        500 scans/month - Renews on Jan 15, 2025
                      </p>
                      <div className="flex gap-2">
                        <GlassButton size="sm">Upgrade Plan</GlassButton>
                        <GlassButton variant="secondary" size="sm">Manage Subscription</GlassButton>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-secondary/30">
                      <h3 className="font-medium mb-4">Usage This Month</h3>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Scans Used</span>
                            <span>89 / 500</span>
                          </div>
                          <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: '17.8%' }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Storage Used</span>
                            <span>2.4 GB / 10 GB</span>
                          </div>
                          <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                            <div className="h-full bg-accent rounded-full" style={{ width: '24%' }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-secondary/30">
                      <h3 className="font-medium mb-4">Payment Method</h3>
                      <div className="flex items-center justify-between p-3 rounded bg-background/50">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded bg-secondary">
                            <CreditCard className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Visa ending in 4242</p>
                            <p className="text-xs text-muted-foreground">Expires 12/2025</p>
                          </div>
                        </div>
                        <GlassButton variant="ghost" size="sm">Update</GlassButton>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
