'use client'

import { useEffect, useState } from 'react'

type Pos = { x: number; y: number; text: string }

/**
 * Selection-to-search popup. When the reader highlights a term inside .m-prose,
 * a small floating menu appears offering Google, Wikipedia, and arXiv search.
 * Useful for unfamiliar jargon mid-lesson.
 */
export function SelectionLookup() {
  const [pos, setPos] = useState<Pos | null>(null)

  useEffect(() => {
    function update() {
      const sel = window.getSelection()
      if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
        setPos(null)
        return
      }
      const text = sel.toString().trim()
      if (text.length < 2 || text.length > 80) {
        setPos(null)
        return
      }
      const range = sel.getRangeAt(0)
      const anchor = range.startContainer.parentElement
      if (!anchor?.closest('.m-prose')) {
        setPos(null)
        return
      }
      const rect = range.getBoundingClientRect()
      if (rect.width === 0 && rect.height === 0) return
      setPos({
        x: rect.left + rect.width / 2,
        y: rect.top,
        text,
      })
    }
    function clear(e: MouseEvent | KeyboardEvent) {
      // Don't clear when clicking the popup itself
      if (e.target instanceof Element && e.target.closest('.m-sel')) return
      const sel = window.getSelection()
      if (!sel || sel.isCollapsed) setPos(null)
    }

    document.addEventListener('selectionchange', update)
    document.addEventListener('mousedown', clear)
    document.addEventListener('keydown', clear)
    return () => {
      document.removeEventListener('selectionchange', update)
      document.removeEventListener('mousedown', clear)
      document.removeEventListener('keydown', clear)
    }
  }, [])

  if (!pos) return null

  const q = encodeURIComponent(pos.text)

  // Clamp horizontally so the popup doesn't fall off the viewport
  const padding = 12
  const maxX = window.innerWidth - 130 - padding
  const minX = 130 + padding
  const x = Math.max(minX, Math.min(maxX, pos.x))

  return (
    <div
      className="m-sel"
      style={{
        position: 'fixed',
        left: x,
        top: pos.y - 12,
        transform: 'translate(-50%, -100%)',
      }}
      role="toolbar"
      aria-label="Look up selected term"
    >
      <a
        className="m-sel-btn"
        href={`https://www.google.com/search?q=${q}`}
        target="_blank"
        rel="noreferrer"
        title="Search Google"
      >
        Google
      </a>
      <a
        className="m-sel-btn"
        href={`https://en.wikipedia.org/wiki/Special:Search?search=${q}`}
        target="_blank"
        rel="noreferrer"
        title="Wikipedia"
      >
        Wiki
      </a>
      <a
        className="m-sel-btn"
        href={`https://arxiv.org/search/?query=${q}&searchtype=all`}
        target="_blank"
        rel="noreferrer"
        title="arXiv"
      >
        arXiv
      </a>
      <a
        className="m-sel-btn"
        href={`https://scholar.google.com/scholar?q=${q}`}
        target="_blank"
        rel="noreferrer"
        title="Google Scholar"
      >
        Scholar
      </a>
      <span className="m-sel-arrow" aria-hidden />
    </div>
  )
}
