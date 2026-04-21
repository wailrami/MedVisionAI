'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Check,
  X,
  Zap,
  Building2,
  Briefcase,
  ArrowRight,
  Mail,
  Phone,
  User,
  Building,
  MessageSquare,
} from 'lucide-react'
import { GlassCard, GlassButton, GlassInput } from '@/components/ui/glass-card'
import { StaggerContainer, StaggerItem, FadeInOnScroll } from '@/components/layout/page-transition'

const plans = [
  {
    name: 'Essentiel',
    description: 'Pour les radiologues individuels',
    price: { monthly: null, yearly: null },
    icon: User,
    popular: false,
    features: [
      { name: '50 scans par mois', included: true },
      { name: 'Analyse IA basique', included: true },
      { name: 'Visualisation 2D/3D', included: true },
      { name: 'Rapports (FR)', included: true },
      { name: 'Support par email', included: true },
      { name: 'Rapports multilingues', included: false },
      { name: 'Acces API', included: false },
      { name: 'Modeles IA personnalises', included: false },
      { name: 'Support dedie', included: false },
    ],
  },
  {
    name: 'Professionnel',
    description: 'Pour les cliniques et cabinets',
    price: { monthly: null, yearly: null },
    icon: Briefcase,
    popular: true,
    features: [
      { name: '500 scans par mois', included: true },
      { name: 'Analyse IA avancee', included: true },
      { name: 'Visualisation 2D/3D', included: true },
      { name: 'Rapports (FR, EN, AR)', included: true },
      { name: 'Support prioritaire', included: true },
      { name: 'Rapports multilingues', included: true },
      { name: 'Acces API', included: true },
      { name: 'Modeles IA personnalises', included: false },
      { name: 'Support dedie', included: false },
    ],
  },
  {
    name: 'Entreprise',
    description: 'Pour les hopitaux et grandes organisations',
    price: { monthly: null, yearly: null },
    icon: Building2,
    popular: false,
    features: [
      { name: 'Scans illimites', included: true },
      { name: 'Analyse IA premium', included: true },
      { name: 'Visualisation 2D/3D', included: true },
      { name: 'Rapports (toutes langues)', included: true },
      { name: 'Support dedie 24/7', included: true },
      { name: 'Rapports multilingues', included: true },
      { name: 'Acces API complet', included: true },
      { name: 'Modeles IA personnalises', included: true },
      { name: 'Deploiement sur site', included: true },
    ],
  },
]

const faqs = [
  {
    q: 'Comment fonctionne la limite de scans ?',
    a: 'Chaque scan telecharge et analyse compte dans votre limite mensuelle. Les scans non utilises ne sont pas reportes au mois suivant.',
  },
  {
    q: 'Puis-je changer de forfait ?',
    a: 'Oui, vous pouvez changer de forfait a tout moment. Les changements prennent effet au debut de votre prochain cycle de facturation.',
  },
  {
    q: 'Mes donnees sont-elles securisees ?',
    a: 'Absolument. Nous utilisons un chiffrement de bout en bout. Vos donnees patients restent sous votre controle.',
  },
  {
    q: 'Quels modes de paiement acceptez-vous ?',
    a: 'Nous acceptons les virements bancaires et les bons de commande institutionnels. Paiement en DZD disponible.',
  },
]

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('yearly')
  const [showContactModal, setShowContactModal] = useState(false)
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  })

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, submit to API
    setShowContactModal(false)
    setContactForm({ name: '', email: '', company: '', message: '' })
  }

  return (
    <div className="relative">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-accent/10 rounded-full blur-[128px]" />
      </div>

      <div className="container mx-auto px-4 py-16 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Tarification <span className="gradient-text">Transparente</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Choisissez le forfait adapte a votre pratique. Contactez-nous pour les tarifs en DZD.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 p-1 rounded-xl glass">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                billingPeriod === 'monthly'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                billingPeriod === 'yearly'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Yearly
              <span className="ml-2 text-xs bg-success/20 text-success px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <StaggerContainer className="grid md:grid-cols-3 gap-8 mb-20">
          {plans.map((plan) => (
            <StaggerItem key={plan.name}>
              <GlassCard
                variant={plan.popular ? 'strong' : 'default'}
                className={`relative h-full flex flex-col ${plan.popular ? 'ring-2 ring-primary' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${plan.popular ? 'bg-primary/20' : 'bg-secondary/50'}`}>
                      <plan.icon className={`h-6 w-6 ${plan.popular ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <div className="text-2xl font-bold text-primary">Contactez-nous</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Tarifs en DZD sur demande
                  </p>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature.name} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="h-5 w-5 text-muted-foreground/50 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={feature.included ? '' : 'text-muted-foreground/50'}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>

                <GlassButton
                  variant={plan.popular ? 'primary' : 'secondary'}
                  className="w-full"
                  onClick={() => setShowContactModal(true)}
                >
                  Demander un Devis
                  <ArrowRight className="h-4 w-4" />
                </GlassButton>
              </GlassCard>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* FAQs */}
        <FadeInOnScroll>
          <GlassCard className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">Questions Frequentes</h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-border pb-6 last:border-0 last:pb-0"
                >
                  <h3 className="font-semibold mb-2">{faq.q}</h3>
                  <p className="text-muted-foreground">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </FadeInOnScroll>

        {/* Contact Sales Modal */}
        <AnimatePresence>
          {showContactModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
              onClick={() => setShowContactModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg"
              >
                <GlassCard variant="strong">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Contact Sales</h2>
                    <button
                      onClick={() => setShowContactModal(false)}
                      className="p-2 rounded-lg hover:bg-secondary/50"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <GlassInput
                      label="Full Name"
                      placeholder="Dr. Jane Smith"
                      value={contactForm.name}
                      onChange={(e) => setContactForm((prev) => ({ ...prev, name: e.target.value }))}
                      icon={<User className="h-4 w-4" />}
                      required
                    />
                    <GlassInput
                      label="Email"
                      type="email"
                      placeholder="jane@hospital.com"
                      value={contactForm.email}
                      onChange={(e) => setContactForm((prev) => ({ ...prev, email: e.target.value }))}
                      icon={<Mail className="h-4 w-4" />}
                      required
                    />
                    <GlassInput
                      label="Company/Institution"
                      placeholder="City General Hospital"
                      value={contactForm.company}
                      onChange={(e) => setContactForm((prev) => ({ ...prev, company: e.target.value }))}
                      icon={<Building className="h-4 w-4" />}
                      required
                    />
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Message</label>
                      <textarea
                        className="w-full rounded-lg px-4 py-2.5 glass-subtle bg-input/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[100px] resize-none"
                        placeholder="Tell us about your needs..."
                        value={contactForm.message}
                        onChange={(e) => setContactForm((prev) => ({ ...prev, message: e.target.value }))}
                        required
                      />
                    </div>
                    <GlassButton type="submit" className="w-full">
                      Send Message
                      <ArrowRight className="h-4 w-4" />
                    </GlassButton>
                  </form>
                </GlassCard>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
