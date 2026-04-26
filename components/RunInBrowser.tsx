'use client'

import { useEffect, useRef, useState } from 'react'

type Status = 'idle' | 'loading-pyodide' | 'ready' | 'running' | 'error'

declare global {
  interface Window {
    loadPyodide?: (opts?: { indexURL?: string }) => Promise<unknown>
    __mosaicPyodide?: unknown
    __mosaicPyodidePromise?: Promise<unknown>
  }
}

const PYODIDE_URL = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js'

type Variant = {
  /** Short label shown on the chip button. */
  label: string
  /** Optional rewrite of the code body. If omitted the chip just runs the current code. */
  code?: string
}

type Props = {
  code: string
  label?: string
  description?: string
  /**
   * Cells with the same `group` share one Pyodide namespace. Run cell A,
   * then run cell B — variables defined in A are visible in B. Default:
   * undefined → isolated namespace per cell.
   */
  group?: string
  /**
   * Quick-tweak chips below the code area. Selecting a chip swaps the
   * code body. Useful on mobile where editing the textarea is painful.
   */
  variants?: Variant[]
}

/**
 * In-browser Python runner via Pyodide. Loads ~6 MB on first click;
 * cached for the session across all <RunInBrowser> cells.
 *
 * - `group="x"` shares a Python namespace across cells with the same group.
 * - `variants={[...]}` adds quick-tweak chips so phone users don't fight the textarea.
 */
export function RunInBrowser({
  code,
  label = 'Run in your browser',
  description,
  group,
  variants,
}: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [currentCode, setCurrentCode] = useState(code)
  const [output, setOutput] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [activeVariant, setActiveVariant] = useState<number | null>(null)
  const outputRef = useRef<HTMLPreElement>(null)

  async function ensurePyodide() {
    if (window.__mosaicPyodide) return window.__mosaicPyodide
    if (window.__mosaicPyodidePromise) return window.__mosaicPyodidePromise
    if (!window.loadPyodide) {
      await new Promise<void>((resolve, reject) => {
        const s = document.createElement('script')
        s.src = PYODIDE_URL
        s.onload = () => resolve()
        s.onerror = () => reject(new Error('Failed to load Pyodide'))
        document.head.appendChild(s)
      })
    }
    window.__mosaicPyodidePromise = window
      .loadPyodide!({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/' })
      .then((py) => {
        window.__mosaicPyodide = py
        return py
      })
    return window.__mosaicPyodidePromise
  }

  async function run() {
    setError(null)
    setOutput('')
    try {
      setStatus(window.__mosaicPyodide ? 'running' : 'loading-pyodide')
      const py = (await ensurePyodide()) as {
        runPythonAsync: (code: string, opts?: { globals?: unknown }) => Promise<unknown>
        setStdout: (opts: { batched: (s: string) => void }) => void
        setStderr: (opts: { batched: (s: string) => void }) => void
        globals: { get: (k: string) => unknown; set: (k: string, v: unknown) => void }
        toPy: (obj: unknown) => unknown
      }

      let buf = ''
      py.setStdout({ batched: (s: string) => { buf += s; setOutput(buf) } })
      py.setStderr({ batched: (s: string) => { buf += s; setOutput(buf) } })

      setStatus('running')

      // Group support: share a per-group namespace stored on the Python side.
      // We seed a dict in py.globals once per group, then run each cell with
      // that dict as its `globals` arg so assignments persist across cells.
      let runOpts: { globals?: unknown } | undefined
      if (group) {
        const key = `__mosaic_group_${group.replace(/[^a-zA-Z0-9_]/g, '_')}`
        const existing = py.globals.get(key)
        if (existing === undefined) {
          await py.runPythonAsync(`${key} = {'__name__': '__main__'}`)
        }
        runOpts = { globals: py.globals.get(key) }
      }

      const result = await py.runPythonAsync(currentCode, runOpts)
      if (result !== undefined && result !== null && buf.length === 0) {
        setOutput(String(result))
      }
      setStatus('ready')
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
      setStatus('error')
    }
  }

  useEffect(() => {
    if (output && outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [output])

  function pickVariant(i: number, v: Variant) {
    setActiveVariant(i)
    if (v.code !== undefined) setCurrentCode(v.code)
  }

  const statusLabel: Record<Status, string> = {
    idle: label,
    'loading-pyodide': 'Loading Python (~6 MB)…',
    ready: 'Run again',
    running: 'Running…',
    error: 'Run again',
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Don't interfere with IME composition (CJK input methods).
    if (e.nativeEvent.isComposing) return

    const ta = e.currentTarget
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const val = ta.value

    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      run()
      return
    }

    if (e.key === 'Tab') {
      e.preventDefault()
      setCurrentCode(val.substring(0, start) + '    ' + val.substring(end))
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + 4
      })
      return
    }

    // IDE-style bracket and quote auto-close.
    const PAIRS: Record<string, string> = {
      '(': ')',
      '[': ']',
      '{': '}',
      '"': '"',
      "'": "'",
    }
    const CLOSERS: Record<string, string> = {
      ')': '(',
      ']': '[',
      '}': '{',
    }
    const QUOTES = new Set(['"', "'"])

    // Type opener: pair-insert. If text is selected, wrap it.
    if (e.key in PAIRS) {
      const opener = e.key
      const closer = PAIRS[opener]
      if (start !== end) {
        e.preventDefault()
        const sel = val.substring(start, end)
        setCurrentCode(val.substring(0, start) + opener + sel + closer + val.substring(end))
        requestAnimationFrame(() => {
          ta.selectionStart = start + 1
          ta.selectionEnd = end + 1
        })
        return
      }
      // For quotes: if cursor is right before the same quote, skip (don't double-up).
      if (QUOTES.has(opener) && val[start] === opener) {
        e.preventDefault()
        requestAnimationFrame(() => {
          ta.selectionStart = ta.selectionEnd = start + 1
        })
        return
      }
      e.preventDefault()
      setCurrentCode(val.substring(0, start) + opener + closer + val.substring(end))
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + 1
      })
      return
    }

    // Type closer when next char is the same closer: skip rather than double-up.
    if (e.key in CLOSERS && start === end && val[start] === e.key) {
      e.preventDefault()
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + 1
      })
      return
    }

    // Backspace inside an empty matching pair removes both characters.
    if (e.key === 'Backspace' && start === end && start > 0) {
      const prev = val[start - 1]
      const next = val[start]
      if (prev in PAIRS && PAIRS[prev] === next) {
        e.preventDefault()
        setCurrentCode(val.substring(0, start - 1) + val.substring(start + 1))
        requestAnimationFrame(() => {
          ta.selectionStart = ta.selectionEnd = start - 1
        })
        return
      }
    }
  }

  return (
    <div className="m-run">
      <div className="m-run-header">
        <span aria-hidden>🐍</span>
        <span>Python{group ? ` · cell · group "${group}"` : ' — editable'}</span>
        {description && <span className="m-run-desc">{description}</span>}
      </div>

      {/* Editable on desktop, read-only display on small phones (variants chips drive change). */}
      <textarea
        className="m-run-code m-run-code-desktop"
        value={currentCode}
        onChange={(e) => {
          setCurrentCode(e.target.value)
          setActiveVariant(null)
        }}
        onKeyDown={handleKeyDown}
        spellCheck={false}
        rows={Math.min(currentCode.split('\n').length + 1, 20)}
      />
      <pre className="m-run-code m-run-code-mobile" aria-hidden>
        <code>{currentCode}</code>
      </pre>

      {variants && variants.length > 0 && (
        <div className="m-run-variants" role="group" aria-label="Quick variants">
          {variants.map((v, i) => (
            <button
              key={`${i}-${v.label}`}
              className={`m-run-chip ${activeVariant === i ? 'is-active' : ''}`}
              onClick={() => pickVariant(i, v)}
              type="button"
            >
              {v.label}
            </button>
          ))}
        </div>
      )}

      <div className="m-run-actions">
        <button
          className="m-run-btn"
          onClick={run}
          disabled={status === 'running' || status === 'loading-pyodide'}
        >
          {statusLabel[status]}
        </button>
        <span className="m-run-hint">
          {status === 'loading-pyodide'
            ? 'First run only — cached after.'
            : 'Ctrl+Enter to run'}
        </span>
      </div>

      {(output || error) && (
        <pre
          ref={outputRef}
          className={`m-run-output ${error ? 'is-error' : ''}`}
        >
          {error ?? output}
        </pre>
      )}
    </div>
  )
}
