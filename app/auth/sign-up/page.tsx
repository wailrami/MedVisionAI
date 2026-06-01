'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Brain, Mail, Lock, User, Building2, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react'
import { GlassCard, GlassButton, GlassInput, GlassSelect } from '@/components/ui/glass-card'
import { useAuthStore } from '@/lib/store'
import { useLanguage } from '@/components/providers/language-provider'
import { Languages } from 'lucide-react'
import { locales } from '@/lib/i18n'

export default function SignUpPage() {
  const router = useRouter()
  const { signup } = useAuthStore()
  const { t, locale, setLocale } = useLanguage()
  
  const getRoleOptions = () => [
    { value: 'radiologist', label: t('signup.roleRadiologist') },
    { value: 'clinic', label: t('signup.roleClinic') },
    { value: 'hospital', label: t('signup.roleHospital') },
  ]

  const getFeatures = () => [
    t('signup.features'),
    t('signup.features3d'),
    t('signup.featuresMultilingual'),
    t('signup.featuresSecure'),
  ]
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'radiologist',
    institution: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDemoLogin = async () => {
    setLoading(true)
    setError(null)
    
    const { login } = useAuthStore.getState()
    const result = await login('demo@medvision.ai', 'demo123')
    
    if (result.success) {
      router.push('/dashboard')
    } else {
      setError(result.error || 'Login failed')
    }
    
    setLoading(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (formData.password !== formData.confirmPassword) {
      setError(t('signup.passwordNotMatch'))
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError(t('signup.passwordTooShort'))
      setLoading(false)
      return
    }

    const result = await signup({
      email: formData.email,
      password: formData.password,
      fullName: formData.fullName,
      role: formData.role,
      institution: formData.institution,
    })

    if (result.success) {
      router.push('/dashboard')
    } else {
      setError(result.error || t('signup.signupFailed'))
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-accent/10 rounded-full blur-[128px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        {/* Header with Language Toggle */}
        <div className="flex items-center justify-between mb-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <motion.div
              className="p-2 rounded-lg bg-primary/10"
              whileHover={{ scale: 1.05 }}
            >
              <Brain className="h-8 w-8 text-primary" />
            </motion.div>
            <span className="font-bold text-2xl gradient-text">MedVision AI</span>
          </Link>

          {/* Language Toggle */}
          <div className="flex items-center gap-2 bg-card/50 backdrop-blur rounded-lg p-1 border border-border">
            {locales.map((loc) => (
              <button
                key={loc}
                onClick={() => setLocale(loc)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  locale === loc
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {loc.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left - Features */}
          <GlassCard className="hidden lg:block">
            <h2 className="text-2xl font-bold mb-6">{t('signup.trialTitle')}</h2>
            <p className="text-muted-foreground mb-8">
              {t('signup.trialSubtitle')}
            </p>
            <ul className="space-y-4">
              {getFeatures().map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <div className="p-1 rounded-full bg-success/20">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  </div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <div className="mt-12 p-4 rounded-lg bg-primary/10">
              <p className="text-sm text-muted-foreground mb-2">{t('signup.trustedBy')}</p>
              <p className="font-semibold">{t('signup.professionals')}</p>
            </div>
          </GlassCard>

          {/* Right - Form */}
          <GlassCard variant="strong">
            <div className="text-center mb-8 lg:text-left">
              <h1 className="text-2xl font-bold mb-2">{t('signup.title')}</h1>
              <p className="text-muted-foreground">{t('signup.subtitle')}</p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-4 mb-6 rounded-lg bg-destructive/10 text-destructive"
              >
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </motion.div>
            )}

            <form onSubmit={handleSignUp} className="space-y-5">
              <GlassInput
                label={t('signup.fullName')}
                type="text"
                name="fullName"
                placeholder="Dr. Jane Smith"
                value={formData.fullName}
                onChange={handleChange}
                icon={<User className="h-4 w-4" />}
                required
              />

              <GlassInput
                label={t('signup.email')}
                type="email"
                name="email"
                placeholder="you@hospital.com"
                value={formData.email}
                onChange={handleChange}
                icon={<Mail className="h-4 w-4" />}
                required
              />

              <div className="grid sm:grid-cols-2 gap-4">
                <GlassInput
                  label={t('signup.password')}
                  type="password"
                  name="password"
                  placeholder="Min. 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  icon={<Lock className="h-4 w-4" />}
                  required
                />

                <GlassInput
                  label={t('signup.confirmPassword')}
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  icon={<Lock className="h-4 w-4" />}
                  required
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <GlassSelect
                  label={t('signup.role')}
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  options={getRoleOptions()}
                />

                <GlassInput
                  label={`${t('signup.institution')} (${t('common.optional')})`}
                  type="text"
                  name="institution"
                  placeholder="Hospital or Clinic"
                  value={formData.institution}
                  onChange={handleChange}
                  icon={<Building2 className="h-4 w-4" />}
                />
              </div>

              <GlassButton
                type="submit"
                className="w-full"
                size="lg"
                loading={loading}
              >
                {t('signup.signUp')}
                <ArrowRight className="h-5 w-5" />
              </GlassButton>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">{t('common.or')}</span>
                </div>
              </div>

              <GlassButton
                type="button"
                variant="secondary"
                className="w-full"
                size="lg"
                onClick={handleDemoLogin}
                loading={loading}
              >
                {t('signup.demoLogin')}
              </GlassButton>
            </form>

            <div className="mt-6 pt-6 border-t border-border text-center">
              <p className="text-muted-foreground">
                {t('signup.alreadyHaveAccount')}{' '}
                <Link href="/auth/login" className="text-primary hover:underline font-medium">
                  {t('signup.login')}
                </Link>
              </p>
            </div>
          </GlassCard>
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          By signing up, you agree to our{' '}
          <Link href="#" className="text-primary hover:underline">Terms of Service</Link>
          {' '}and{' '}
          <Link href="#" className="text-primary hover:underline">Privacy Policy</Link>
        </p>
      </motion.div>
    </div>
  )
}
