'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Brain, Mail, Lock, ArrowRight, AlertCircle, Info } from 'lucide-react'
import { GlassCard, GlassButton, GlassInput } from '@/components/ui/glass-card'
import { useAuthStore } from '@/lib/store'
import { useLanguage } from '@/components/providers/language-provider'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuthStore()
  const { t } = useLanguage()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const result = await login(email, password)
    
    if (result.success) {
      router.push('/dashboard')
    } else {
      setError(result.error || 'Login failed')
    }
    
    setLoading(false)
  }

  const handleDemoLogin = async () => {
    setEmail('demo@medvision.ai')
    setPassword('demo123')
    setLoading(true)
    setError(null)
    
    const result = await login('demo@medvision.ai', 'demo123')
    
    if (result.success) {
      router.push('/dashboard')
    } else {
      setError(result.error || 'Login failed')
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
        className="w-full max-w-md"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <motion.div
            className="p-2 rounded-lg bg-primary/10"
            whileHover={{ scale: 1.05 }}
          >
            <Brain className="h-8 w-8 text-primary" />
          </motion.div>
          <span className="font-bold text-2xl gradient-text">MedVision AI</span>
        </Link>

        <GlassCard variant="strong">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">{t('auth.welcomeBack')}</h1>
            <p className="text-muted-foreground">{t('auth.signInAccess')}</p>
          </div>

          {/* Demo Mode Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-start gap-3 p-4 mb-6 rounded-lg bg-primary/10 border border-primary/20"
          >
            <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-primary mb-1">{t('auth.demoModeActive')}</p>
              <p className="text-muted-foreground">
                {t('auth.demoModeDesc')}
              </p>
            </div>
          </motion.div>

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

          <form onSubmit={handleLogin} className="space-y-6">
            <GlassInput
              label={t('auth.email')}
              type="email"
              placeholder="you@hospital.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="h-4 w-4" />}
              required
            />

            <div>
              <GlassInput
                label={t('auth.password')}
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="h-4 w-4" />}
                required
              />
              <div className="mt-2 text-right">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  {t('auth.forgotPassword')}
                </Link>
              </div>
            </div>

            <GlassButton
              type="submit"
              className="w-full"
              size="lg"
              loading={loading}
            >
              {t('auth.login')}
              <ArrowRight className="h-5 w-5" />
            </GlassButton>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or</span>
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
              {t('auth.tryDemo')}
            </GlassButton>
          </form>

          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-muted-foreground">
              {t('auth.dontHaveAccount')}{' '}
              <Link href="/auth/sign-up" className="text-primary hover:underline font-medium">
                {t('auth.createAccount')}
              </Link>
            </p>
          </div>
        </GlassCard>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          By signing in, you agree to our{' '}
          <Link href="#" className="text-primary hover:underline">Terms of Service</Link>
          {' '}and{' '}
          <Link href="#" className="text-primary hover:underline">Privacy Policy</Link>
        </p>
      </motion.div>
    </div>
  )
}
