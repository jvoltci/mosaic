'use client'

import { useEffect, useState } from 'react'

const KEY = 'mosaic:completed'
const EVENT = 'mosaic:progress'

type Lesson = { slug: string; title: string; estMin?: number }

export function ModuleProgress({ lessons }: { lessons: Lesson[] }) {
  const [done, setDone] = useState<Set<string>>(new Set())

  useEffect(() => {
    const sync = () => {
      try {
        const raw = localStorage.getItem(KEY)
        setDone(new Set(raw ? JSON.parse(raw) : []))
      } catch {
        setDone(new Set())
      }
    }
    sync()
    window.addEventListener(EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const completed = lessons.filter((l) => done.has(l.slug)).length
  const total = lessons.length
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0
  const allDone = completed === total && total > 0
  const totalMin = lessons.reduce((sum, l) => sum + (l.estMin ?? 12), 0)

  return (
    <div style={{ margin: '1.5rem 0 2rem' }}>
      {allDone && (
        <div
          style={{
            padding: '0.75rem 1rem',
            background: 'rgba(34,197,94,0.12)',
            border: '1px solid rgba(34,197,94,0.4)',
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            fontWeight: 600,
          }}
        >
          🏁 Module complete — well done!
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', opacity: 0.75, marginBottom: '0.4rem' }}>
        <span>
          {completed} / {total} lessons
        </span>
        <span>~{totalMin} min total</span>
      </div>

      <div style={{ height: '0.5rem', background: 'rgba(127,127,127,0.2)', borderRadius: '0.25rem', overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: allDone ? '#16a34a' : '#3b82f6',
            transition: 'width 0.3s',
          }}
        />
      </div>

      <ul style={{ marginTop: '1.25rem', listStyle: 'none', padding: 0 }}>
        {lessons.map((l) => {
          const isDone = done.has(l.slug)
          return (
            <li key={l.slug} style={{ borderBottom: '1px solid rgba(127,127,127,0.15)' }}>
              <a
                href={l.slug}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.7rem',
                  padding: '0.65rem 0.25rem',
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                <span
                  aria-hidden
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '1.3rem',
                    height: '1.3rem',
                    borderRadius: '50%',
                    border: `1.5px solid ${isDone ? '#16a34a' : 'currentColor'}`,
                    background: isDone ? '#16a34a' : 'transparent',
                    color: isDone ? 'white' : 'currentColor',
                    fontSize: '0.8rem',
                    flexShrink: 0,
                  }}
                >
                  {isDone ? '✓' : ''}
                </span>
                <span
                  style={{
                    flex: 1,
                    textDecoration: isDone ? 'line-through' : 'none',
                    opacity: isDone ? 0.6 : 1,
                  }}
                >
                  {l.title}
                </span>
                {l.estMin && (
                  <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>{l.estMin} min</span>
                )}
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
