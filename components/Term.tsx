'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { lookupTerm } from '../lib/glossary'

type TermProps = {
  /** Glossary key — case-insensitive. Falls back to children if no entry exists. */
  name: string
  children: React.ReactNode
}

/**
 * Inline jargon-on-tap. Wrap a term that may be unfamiliar:
 *
 *   <Term name="page fault">page fault</Term>
 *
 * Click/tap → popover with a 1-3 sentence definition from lib/glossary.
 * Esc or click-outside dismisses. If `name` isn't in the glossary, renders
 * the children as plain text (no button) so authors can stage entries
 * before the glossary catches up.
 */
export function Term({ name, children }: TermProps) {
  const entry = lookupTerm(name)
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const popRef = useRef<HTMLDivElement>(null)
  const popId = useId()

  useEffect(() => {
    if (!open) return

    function place() {
      const btn = btnRef.current
      if (!btn) return
      const rect = btn.getBoundingClientRect()
      setPos({ x: rect.left + rect.width / 2, y: rect.bottom })
    }
    place()

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false)
        btnRef.current?.focus()
      }
    }
    function onClickAway(e: MouseEvent) {
      const t = e.target
      if (!(t instanceof Element)) return
      if (popRef.current?.contains(t) || btnRef.current?.contains(t)) return
      setOpen(false)
    }

    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClickAway)
    window.addEventListener('scroll', place, true)
    window.addEventListener('resize', place)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClickAway)
      window.removeEventListener('scroll', place, true)
      window.removeEventListener('resize', place)
    }
  }, [open])

  // No entry → render children as plain text. Lets authors mark up terms
  // before glossary entries exist, without breaking pages.
  if (!entry) {
    return <>{children}</>
  }

  // Clamp horizontally so the popup doesn't fall off the viewport.
  const clamp = (x: number) => {
    if (typeof window === 'undefined') return x
    const halfWidth = 160
    const padding = 12
    return Math.max(halfWidth + padding, Math.min(window.innerWidth - halfWidth - padding, x))
  }

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        className="m-term"
        aria-expanded={open}
        aria-controls={open ? popId : undefined}
        onClick={() => setOpen(o => !o)}
      >
        {children}
      </button>
      {open && pos && typeof document !== 'undefined'
        ? createPortal(
            <div
              ref={popRef}
              id={popId}
              role="dialog"
              aria-label={`Definition: ${name}`}
              className="m-term-pop"
              style={{
                position: 'fixed',
                left: clamp(pos.x),
                top: pos.y + 8,
                transform: 'translateX(-50%)',
              }}
            >
              <div className="m-term-pop-label">{name}</div>
              <div className="m-term-pop-body">{entry.short}</div>
              <span className="m-term-pop-arrow" aria-hidden />
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
