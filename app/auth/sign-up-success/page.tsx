'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Brain, Mail, ArrowRight } from 'lucide-react'
import { GlassCard, GlassButton } from '@/components/ui/glass-card'

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-success/10 rounded-full blur-[128px]" />
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

        <GlassCard variant="strong" className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-success/20 flex items-center justify-center"
          >
            <Mail className="h-10 w-10 text-success" />
          </motion.div>

          <h1 className="text-2xl font-bold mb-4">Check Your Email</h1>
          
          <p className="text-muted-foreground mb-8">
            We&apos;ve sent a confirmation link to your email address. 
            Please click the link to verify your account and get started.
          </p>

          <div className="space-y-4">
            <Link href="/auth/login">
              <GlassButton className="w-full" size="lg">
                Go to Sign In
                <ArrowRight className="h-5 w-5" />
              </GlassButton>
            </Link>

            <p className="text-sm text-muted-foreground">
              Didn&apos;t receive the email?{' '}
              <button className="text-primary hover:underline font-medium">
                Resend confirmation
              </button>
            </p>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  )
}
