'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  TRACK_ACCENT,
  TRACK_LABELS,
  TRACK_NUM,
  TRACK_SHORT,
  TILES,
  type TrackKey,
} from '../../lib/mosaic-tiles'
import { useProgress } from '../../lib/use-progress'
import { ThemeToggle } from '../ThemeToggle'
import { Search } from '../Search'

const TRACK_ORDER: TrackKey[] = [
  'foundations',
  'ml-execution',
  'training',
  'llm-architecture',
  'compilers',
  'applied',
  'edge-ai',
]

export function CourseNav() {
  const pathname = usePathname() || '/'
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [progress, setProgress] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const { completed: completedSet } = useProgress()
  const completed = completedSet.size

  useEffect(() => {
    let lastY = 0
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 12)
      // Hide nav when scrolling DOWN past 96px; reveal on scroll UP. The thin
      // progress bar stays pinned at the top.
      if (y > 96 && y > lastY) setHidden(true)
      else if (y < lastY - 4 || y < 96) setHidden(false)
      lastY = y
      // Article reading progress (page % scrolled)
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(1, Math.max(0, y / max)) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMenuOpen(false), [pathname])

  return (
    <>
      {/* Reading-progress line — rendered as a sibling of the nav so its
          position:fixed is relative to the viewport, not to the (possibly
          translated/hidden) nav container. Color tracks the current section so
          a foundations lesson reads in terracotta, compilers in indigo, etc. */}
      {(() => {
        const trackKey = TRACK_ORDER.find((k) => pathname.startsWith(`/${k}`))
        const accent = trackKey ? TRACK_ACCENT[trackKey] : undefined
        return (
          <span
            className="m-nav-progress-line"
            style={{
              transform: `scaleX(${progress})`,
              ...(accent ? { background: accent } : {}),
            }}
            aria-hidden
          />
        )
      })()}
      <nav className={`m-nav ${scrolled ? 'is-scrolled' : ''} ${hidden ? 'is-hidden' : ''}`}>
        <div className="m-nav-inner">
        <Link href="/" className="m-nav-brand" aria-label="Mosaic — home">
          Mosaic
        </Link>

        <div className="m-nav-tabs">
          {TRACK_ORDER.map((key) => {
            const isActive = pathname.startsWith(`/${key}`)
            return (
              <Link
                key={key}
                href={`/${key}`}
                className={`m-nav-tab ${isActive ? 'is-active' : ''}`}
                style={{ ['--accent' as string]: TRACK_ACCENT[key] }}
              >
                <span className="m-nav-tab-num">{TRACK_NUM[key]}</span>
                <span className="m-nav-tab-label">{TRACK_SHORT[key]}</span>
              </Link>
            )
          })}
        </div>

        <div className="m-nav-actions">
          <Search />
          <Link href="/map" className="m-nav-action">Map</Link>
          <Link href="/cheatsheet" className="m-nav-action">Cheatsheet</Link>
          <Link href="/reads" className="m-nav-action">Reads</Link>
          <Link href="/favorites" className="m-nav-action" aria-label="Saved lessons">★</Link>
          {completed > 0 && (
            <span className="m-nav-progress" title={`${completed} of ${TILES.length} lessons done`}>
              {completed}/{TILES.length}
            </span>
          )}
          <ThemeToggle />
          <button
            className="m-nav-burger"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <BurgerIcon open={menuOpen} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="m-nav-mobile-sheet">
          <p className="m-nav-mobile-label">Tracks</p>
          {TRACK_ORDER.map((key) => (
            <Link
              key={key}
              href={`/${key}`}
              className="m-nav-mobile-item"
              style={{ ['--accent' as string]: TRACK_ACCENT[key] }}
            >
              <span className="m-nav-mobile-num">{TRACK_NUM[key]}</span>
              <span>{TRACK_LABELS[key]}</span>
            </Link>
          ))}
          <p className="m-nav-mobile-label">Reference</p>
          <Link href="/map" className="m-nav-mobile-item">
            <span className="m-nav-mobile-num">·</span>
            <span>Course Map</span>
          </Link>
          <Link href="/cheatsheet" className="m-nav-mobile-item">
            <span className="m-nav-mobile-num">·</span>
            <span>Cheatsheet</span>
          </Link>
          <Link href="/reads" className="m-nav-mobile-item">
            <span className="m-nav-mobile-num">·</span>
            <span>Reads</span>
          </Link>
          <Link href="/favorites" className="m-nav-mobile-item">
            <span className="m-nav-mobile-num">★</span>
            <span>Saved</span>
          </Link>
        </div>
      )}
      </nav>
    </>
  )
}

function BurgerIcon({ open }: { open: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      {open ? (
        <>
          <line x1="4" y1="4" x2="14" y2="14" />
          <line x1="14" y1="4" x2="4" y2="14" />
        </>
      ) : (
        <>
          <line x1="3" y1="6" x2="15" y2="6" />
          <line x1="3" y1="12" x2="15" y2="12" />
        </>
      )}
    </svg>
  )
}
