'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

const KEY = 'mosaic:completed'
const EVENT = 'mosaic:progress'

function load(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = localStorage.getItem(KEY)
    return new Set(raw ? JSON.parse(raw) : [])
  } catch {
    return new Set()
  }
}

function persist(s: Set<string>) {
  localStorage.setItem(KEY, JSON.stringify([...s]))
  window.dispatchEvent(new Event(EVENT))
}

export function LessonComplete() {
  const pathname = usePathname()
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDone(load().has(pathname))
    const sync = () => setDone(load().has(pathname))
    window.addEventListener(EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [pathname])

  function toggle() {
    const s = load()
    if (s.has(pathname)) s.delete(pathname)
    else s.add(pathname)
    persist(s)
    setDone(s.has(pathname))
  }

  return (
    <div style={{ margin: '2.5rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
      <button
        onClick={toggle}
        style={{
          padding: '0.75rem 1.6rem',
          borderRadius: '0.5rem',
          fontWeight: 600,
          fontSize: '1rem',
          border: '1px solid',
          borderColor: done ? '#16a34a' : 'var(--m-fg)',
          cursor: 'pointer',
          background: done ? '#16a34a' : 'var(--m-fg)',
          color: done ? 'white' : 'var(--m-bg)',
          fontFamily: 'var(--font-sans), system-ui, sans-serif',
          transition: 'background 0.15s, transform 0.05s, opacity 0.15s',
        }}
        onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
        onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
      >
        {done ? '✓ Lesson complete' : 'Mark lesson complete'}
      </button>
      {done && (
        <p style={{ fontSize: '0.85rem', opacity: 0.7, margin: 0 }}>Saved locally — keep going!</p>
      )}
    </div>
  )
}
