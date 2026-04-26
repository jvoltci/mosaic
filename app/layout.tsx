import { Fraunces, Inter, JetBrains_Mono, Source_Serif_4 } from 'next/font/google'
import { CourseShell } from '../components/course/CourseShell'
import 'katex/dist/katex.min.css'
import './globals.css'

// Display — headings, hero, brand wordmark
const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
})

// Reading — long-form prose, designed for sustained focus on screens
const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
})

// UI — nav, buttons, labels, callout chrome
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

// Code — monospace blocks, technical detail
const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
  weight: ['400', '500', '600'],
})

export const metadata = {
  title: { default: 'Mosaic — A free course on AI Systems & ML Compilers', template: '%s · Mosaic' },
  description:
    'A free, self-paced, beautiful course on AI Systems, ML Compilers, and AI Architectures. Build cutting-edge AI things you can run on your phone.',
}

export const viewport = {
  themeColor: '#0a0a0f',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`dark ${fraunces.variable} ${sourceSerif.variable} ${inter.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <body>
        <CourseShell>{children}</CourseShell>
      </body>
    </html>
  )
}
