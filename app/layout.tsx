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
  title: { default: 'Mosaic — AI Systems & ML Compilers', template: '%s · Mosaic' },
  description:
    'A free, self-paced, beautiful course on AI Systems, ML Compilers, and AI Architectures. Build cutting-edge AI things you can run on your phone.',
  openGraph: {
    type: 'website',
    siteName: 'Mosaic',
    title: 'Mosaic — AI Systems & ML Compilers',
    description: 'A free, self-paced course on AI Systems, ML Compilers, and AI Architectures.',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mosaic — AI Systems & ML Compilers',
    description: 'A free, self-paced course on AI Systems, ML Compilers, and AI Architectures.',
  },
  metadataBase: new URL('https://mosaic.shivy.dev'),
}

export const viewport = {
  themeColor: '#0a0a0f',
  width: 'device-width',
  initialScale: 1,
}

// Inline script — runs before React hydration, sets html class from
// localStorage or system preference. Prevents flash on first paint.
// Dark mode is the hard default (class="dark" on <html>).
// This script is kept minimal — dark is already applied via SSR.
const THEME_INIT_SCRIPT = `
try {
  var t = localStorage.getItem('mosaic:theme');
  if (t === 'light') {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  }
} catch (e) {}
try {
  var m = localStorage.getItem('mosaic:mode');
  document.documentElement.dataset.mode = (m === 'reference') ? 'reference' : 'learn';
} catch (e) {
  document.documentElement.dataset.mode = 'learn';
}
`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`dark ${fraunces.variable} ${sourceSerif.variable} ${inter.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <CourseShell>{children}</CourseShell>
      </body>
    </html>
  )
}
