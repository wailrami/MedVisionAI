import type { Metadata, Viewport } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { LanguageProvider } from '@/components/providers/language-provider'
import { Navbar } from '@/components/layout/navigation'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  title: {
    default: 'MedVision AI - Advanced Medical Imaging Platform',
    template: '%s | MedVision AI',
  },
  description: 'AI-powered medical imaging analysis platform with 3D visualization, automated diagnostics, and radiologist crowdsourcing.',
  keywords: ['medical imaging', 'AI diagnostics', 'radiology', 'DICOM viewer', '3D visualization', 'healthcare AI'],
  authors: [{ name: 'MedVision AI Team' }],
  creator: 'MedVision AI',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://medvision.ai',
    title: 'MedVision AI - Advanced Medical Imaging Platform',
    description: 'AI-powered medical imaging analysis platform with 3D visualization and automated diagnostics.',
    siteName: 'MedVision AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MedVision AI - Advanced Medical Imaging Platform',
    description: 'AI-powered medical imaging analysis platform with 3D visualization and automated diagnostics.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a12' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.variable} ${geistMono.variable} font-sans antialiased bg-background`} suppressHydrationWarning>
        <LanguageProvider>
          <ThemeProvider>
            <Navbar />
            <main className="min-h-screen">
              {children}
            </main>
            <Toaster />
          </ThemeProvider>
        </LanguageProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
