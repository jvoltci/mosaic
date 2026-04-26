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

const TRACK_ORDER: TrackKey[] = [
  'foundations',
  'ml-execution',
  'training',
  'llm-architecture',
  'compilers',
  'applied',
]

export function CourseNav() {
  const pathname = usePathname() || '/'
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { completed: completedSet } = useProgress()
  const completed = completedSet.size

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMenuOpen(false), [pathname])

  return (
    <nav className={`m-nav ${scrolled ? 'is-scrolled' : ''}`}>
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
          <Link href="/map" className="m-nav-action">Map</Link>
          <Link href="/cheatsheet" className="m-nav-action">Cheatsheet</Link>
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
        </div>
      )}
    </nav>
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
