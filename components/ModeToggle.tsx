'use client'

import { useEffect, useState } from 'react'

type Mode = 'learn' | 'reference'

const STORAGE_KEY = 'mosaic:mode'

/**
 * Two-state chip in the lesson breadcrumb. Toggles between the warm "Learn"
 * voice and the original "Reference" voice. Setting persists in localStorage
 * and applies site-wide via `<html data-mode>`.
 *
 * Renders only when the current page contains BOTH a learn block and a
 * reference block — so unswept lessons don't show a toggle that does nothing.
 */
export function ModeToggle() {
  const [mode, setMode] = useState<Mode | null>(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Detect: does this lesson have both modes? If not, hide the chip.
    const hasLearn = !!document.querySelector('[data-mode-block="learn"]')
    const hasRef = !!document.querySelector('[data-mode-block="reference"]')
    setShow(hasLearn && hasRef)

    // Read current mode from <html> (set by the pre-paint boot script).
    const current = (document.documentElement.dataset.mode as Mode) || 'learn'
    setMode(current)
  }, [])

  if (!show || !mode) return null

  function pick(next: Mode) {
    setMode(next)
    document.documentElement.dataset.mode = next
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Private mode / disabled storage — toggle still works for this session.
    }
  }

  return (
    <span
      className="m-mode-toggle"
      role="group"
      aria-label="Reading mode"
      title="Switch reading style"
    >
      <button
        type="button"
        className="m-mode-toggle-btn"
        aria-pressed={mode === 'learn'}
        onClick={() => pick('learn')}
      >
        Learn
      </button>
      <button
        type="button"
        className="m-mode-toggle-btn"
        aria-pressed={mode === 'reference'}
        onClick={() => pick('reference')}
      >
        Ref
      </button>
    </span>
  )
}
