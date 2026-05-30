'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Building2,
  Clock,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  FileText,
  Users,
} from 'lucide-react'
import { GlassCard, GlassButton, GlassInput, GlassSelect } from '@/components/ui/glass-card'
import { StaggerContainer, StaggerItem, FadeInOnScroll } from '@/components/layout/page-transition'
import { useLanguage } from '@/components/providers/language-provider'

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'contact@medvision-dz.ai',
    description: 'Envoyez-nous un email',
  },
  {
    icon: Phone,
    label: 'Telephone',
    value: '+213 (0) 555 12 34 56',
    description: 'Dim-Jeu, 8h-17h',
  },
  {
    icon: MapPin,
    label: 'Bureau',
    value: 'Cite 500 Logements, Bloc A',
    description: 'Alger, Algerie',
  },
  {
    icon: Clock,
    label: 'Support',
    value: 'Support Prioritaire',
    description: 'Dim-Jeu 8h-17h',
  },
]

const inquiryTypes = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'sales', label: 'Sales / Enterprise' },
  { value: 'support', label: 'Technical Support' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'media', label: 'Press / Media' },
]

const quickLinks = [
  {
    icon: HelpCircle,
    title: 'Help Center',
    description: 'Browse our comprehensive knowledge base',
    href: '#',
  },
  {
    icon: FileText,
    title: 'Documentation',
    description: 'Technical guides and API reference',
    href: '#',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Join our radiologist community',
    href: '#',
  },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    inquiryType: 'general',
    subject: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { t } = useLanguage()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500))

    setLoading(false)
    setSuccess(true)
    setFormData({
      name: '',
      email: '',
      company: '',
      inquiryType: 'general',
      subject: '',
      message: '',
    })
  }

  return (
    <div className="relative">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-accent/10 rounded-full blur-[128px]" />
      </div>

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t('contact.title')} <span className="gradient-text"></span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </motion.div>

        {/* Contact Info Cards */}
        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {[
            { icon: Mail, label: t('contact.title'), value: 'contact@medvision-dz.ai', description: t('contact.sendMessage') },
            { icon: Phone, label: 'Telephone', value: '+213 (0) 555 12 34 56', description: 'Dim-Jeu, 8h-17h' },
            { icon: MapPin, label: 'Bureau', value: 'Cite 500 Logements, Bloc A', description: 'Alger, Algerie' },
            { icon: Clock, label: 'Support', value: 'Support Prioritaire', description: 'Dim-Jeu 8h-17h' },
          ].map((item, idx) => (
            <StaggerItem key={idx}>
              <GlassCard className="text-center h-full">
                <div className="p-3 rounded-lg bg-primary/10 w-fit mx-auto mb-4">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">{item.label}</h3>
                <p className="text-primary font-medium">{item.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
              </GlassCard>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-3">
            <FadeInOnScroll>
              <GlassCard variant="strong">
                {success ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="p-4 rounded-full bg-success/20 w-fit mx-auto mb-6">
                      <CheckCircle2 className="h-12 w-12 text-success" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">{t('contact.messageSent')}</h2>
                    <p className="text-muted-foreground mb-6">
                      {t('contact.thankYou')}
                    </p>
                    <GlassButton onClick={() => setSuccess(false)}>
                      {t('contact.sendAnother')}
                    </GlassButton>
                  </motion.div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 mb-6">
                      <MessageSquare className="h-6 w-6 text-primary" />
                      <h2 className="text-xl font-semibold">{t('contact.sendMessage')}</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <GlassInput
                          label={t('contact.fullName')}
                          name="name"
                          placeholder="Dr. Ahmed Benali"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                        <GlassInput
                          label={t('contact.title')}
                          name="email"
                          type="email"
                          placeholder="vous@clinique.dz"
                          value={formData.email}
                          onChange={handleChange}
                          icon={<Mail className="h-4 w-4" />}
                          required
                        />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <GlassInput
                          label={t('contact.company')}
                          name="company"
                          placeholder="Hospital or Clinic"
                          value={formData.company}
                          onChange={handleChange}
                          icon={<Building2 className="h-4 w-4" />}
                        />
                        <GlassSelect
                          label={t('contact.inquiryType')}
                          name="inquiryType"
                          value={formData.inquiryType}
                          onChange={handleChange}
                          options={[
                            { value: 'general', label: t('contact.generalInquiry') },
                            { value: 'sales', label: t('contact.sales') },
                            { value: 'support', label: t('contact.support') },
                            { value: 'partnership', label: t('contact.partnership') },
                            { value: 'media', label: t('contact.media') },
                          ]}
                        />
                      </div>

                      <GlassInput
                        label={t('contact.subject')}
                        name="subject"
                        placeholder="How can we help you?"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                      />

                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          {t('contact.message')}
                        </label>
                        <textarea
                          name="message"
                          className="w-full rounded-lg px-4 py-2.5 glass-subtle bg-input/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200 min-h-[150px] resize-none"
                          placeholder="Tell us more about your inquiry..."
                          value={formData.message}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <GlassButton type="submit" className="w-full" size="lg" loading={loading}>
                        <Send className="h-4 w-4" />
                        {t('contact.sendMessage')}
                      </GlassButton>
                    </form>
                  </>
                )}
              </GlassCard>
            </FadeInOnScroll>
          </div>

          {/* Quick Links & Map */}
          <div className="lg:col-span-2 space-y-6">
            <FadeInOnScroll>
              <GlassCard>
                <h3 className="text-lg font-semibold mb-4">{t('contact.quickLinks')}</h3>
                <div className="space-y-3">
                  {[
                    { icon: HelpCircle, title: t('contact.helpCenter'), description: t('contact.browseKB'), href: '#' },
                    { icon: FileText, title: t('contact.documentation'), description: t('contact.techGuides'), href: '#' },
                    { icon: Users, title: t('contact.community'), description: t('contact.radiologistCommunity'), href: '#' },
                  ].map((link) => (
                    <a
                      key={link.title}
                      href={link.href}
                      className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors group"
                    >
                      <div className="p-2 rounded-lg bg-primary/10">
                        <link.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium group-hover:text-primary transition-colors">
                          {link.title}
                        </p>
                        <p className="text-sm text-muted-foreground">{link.description}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all mt-2" />
                    </a>
                  ))}
                </div>
              </GlassCard>
            </FadeInOnScroll>

            <FadeInOnScroll>
              <GlassCard>
                <h3 className="text-lg font-semibold mb-4">{t('contact.officeLocation')}</h3>
                {/* Placeholder map */}
                <div className="aspect-video rounded-lg bg-secondary/50 flex items-center justify-center overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
                  <div className="text-center z-10">
                    <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-sm font-medium">Cite 500 Logements, Bloc A</p>
                    <p className="text-xs text-muted-foreground">Alger, Algerie</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <GlassButton variant="secondary" size="sm" className="flex-1">
                    <MapPin className="h-4 w-4" />
                    {t('contact.getDirections')}
                  </GlassButton>
                </div>
              </GlassCard>
            </FadeInOnScroll>

            <FadeInOnScroll>
              <GlassCard className="bg-primary/5 border-primary/20">
                <h3 className="text-lg font-semibold mb-2">{t('contact.enterpriseSupport')}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t('contact.enterpriseDesc')}
                </p>
                <GlassButton size="sm">
                  {t('contact.contactEnterprise')}
                  <ArrowRight className="h-4 w-4" />
                </GlassButton>
              </GlassCard>
            </FadeInOnScroll>
          </div>
        </div>

        {/* FAQ CTA */}
        <FadeInOnScroll>
          <div className="mt-16 text-center">
            <GlassCard variant="strong" className="inline-block max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-2">{t('contact.lookingAnswers')}</h2>
              <p className="text-muted-foreground mb-6">
                {t('contact.checkPricing')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <GlassButton onClick={() => window.location.href = '/pricing'}>
                  {t('contact.viewPricing')}
                  <ArrowRight className="h-4 w-4" />
                </GlassButton>
                <GlassButton variant="secondary" onClick={() => window.location.href = '/pricing#faq'}>
                  {t('contact.browseFAQ')}
                </GlassButton>
              </div>
            </GlassCard>
          </div>
        </FadeInOnScroll>
      </div>
    </div>
  )
}
