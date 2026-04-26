'use client'

import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark'
const KEY = 'mosaic:theme'
const EVENT = 'mosaic:theme-change'

function readTheme(): Theme {
  if (typeof document === 'undefined') return 'dark'
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

function applyTheme(t: Theme) {
  document.documentElement.classList.toggle('dark', t === 'dark')
  document.documentElement.classList.toggle('light', t === 'light')
  try {
    localStorage.setItem(KEY, t)
  } catch {}
  window.dispatchEvent(new CustomEvent(EVENT, { detail: t }))
}

export function ThemeToggle() {
  // Render placeholder during SSR / before mount; sync to actual theme on mount
  const [theme, setTheme] = useState<Theme | null>(null)

  useEffect(() => {
    setTheme(readTheme())
    const onMedia = () => {
      // Only follow system if user hasn't chosen a preference
      try {
        if (!localStorage.getItem(KEY)) {
          const sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches
          applyTheme(sysDark ? 'dark' : 'light')
          setTheme(sysDark ? 'dark' : 'light')
        }
      } catch {}
    }
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    mq.addEventListener('change', onMedia)
    return () => mq.removeEventListener('change', onMedia)
  }, [])

  function toggle() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    applyTheme(next)
    setTheme(next)
  }

  return (
    <button
      type="button"
      className="m-theme-toggle"
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      title={theme === 'dark' ? 'Light theme' : 'Dark theme'}
    >
      {/* Sun (visible in dark mode → click for light) and Moon (visible in light mode → click for dark) */}
      {theme === 'dark' ? <SunIcon /> : theme === 'light' ? <MoonIcon /> : <span style={{ width: 16, height: 16 }} />}
    </button>
  )
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden>
      <circle cx="8" cy="8" r="3.2" />
      <path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.4 3.4l1.4 1.4M11.2 11.2l1.4 1.4M3.4 12.6l1.4-1.4M11.2 4.8l1.4-1.4" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12.8 9.4A5.4 5.4 0 0 1 6.6 3.2a5.4 5.4 0 1 0 6.2 6.2z" />
    </svg>
  )
}
