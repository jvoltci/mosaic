'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useProgress } from '../lib/use-progress'
import { TRACK_ACCENT, type TrackKey } from '../lib/mosaic-tiles'

type Lesson = { slug: string; title: string; estMin?: number }

const TRACK_KEYS: TrackKey[] = [
  'foundations',
  'ml-execution',
  'training',
  'llm-architecture',
  'compilers',
  'applied',
  'edge-ai',
]

export function ModuleProgress({ lessons }: { lessons: Lesson[] }) {
  const { completed: done } = useProgress()
  const pathname = usePathname() || '/'

  const completed = lessons.filter((l) => done.has(l.slug)).length
  const total = lessons.length
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0
  const allDone = completed === total && total > 0
  const totalMin = lessons.reduce((sum, l) => sum + (l.estMin ?? 12), 0)

  const trackKey = TRACK_KEYS.find((k) => pathname.startsWith(`/${k}`))
  const accent = trackKey ? TRACK_ACCENT[trackKey] : '#3b82f6'

  return (
    <div className="m-module-progress">
      {allDone && (
        <div className="m-module-progress-done-banner">
          🏁 Module complete — well done!
        </div>
      )}

      <div className="m-module-progress-meta">
        <span>{completed} / {total} lessons</span>
        <span>~{totalMin} min total</span>
      </div>

      <div className="m-module-progress-bar">
        <div
          className="m-module-progress-bar-fill"
          style={{
            width: `${pct}%`,
            background: allDone ? '#16a34a' : accent,
          }}
        />
      </div>

      <ul className="m-module-progress-list">
        {lessons.map((l) => {
          const isDone = done.has(l.slug)
          return (
            <li key={l.slug} className="m-module-progress-item">
              <Link href={l.slug} className="m-module-progress-link">
                <span
                  aria-hidden
                  className={`m-module-progress-check ${isDone ? 'is-done' : ''}`}
                >
                  {isDone ? '✓' : ''}
                </span>
                <span className={`m-module-progress-title ${isDone ? 'is-done' : ''}`}>
                  {l.title}
                </span>
                {l.estMin && (
                  <span className="m-module-progress-est">{l.estMin} min</span>
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
