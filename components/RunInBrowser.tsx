'use client'

import { useEffect, useRef, useState } from 'react'

type Status = 'idle' | 'loading-pyodide' | 'ready' | 'running' | 'error'

declare global {
  interface Window {
    loadPyodide?: (opts?: { indexURL?: string }) => Promise<unknown>
    __mosaicPyodide?: unknown
  }
}

const PYODIDE_URL = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js'

type Props = {
  code: string
  label?: string
  description?: string
}

/**
 * In-browser Python runner via Pyodide. Loads ~6 MB on first click;
 * cached for the session. Works on mobile browsers (iOS Safari, Chrome Android).
 */
export function RunInBrowser({ code, label = 'Run in your browser', description }: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [output, setOutput] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const outputRef = useRef<HTMLPreElement>(null)

  async function ensurePyodide() {
    if (window.__mosaicPyodide) return window.__mosaicPyodide
    if (!window.loadPyodide) {
      await new Promise<void>((resolve, reject) => {
        const s = document.createElement('script')
        s.src = PYODIDE_URL
        s.onload = () => resolve()
        s.onerror = () => reject(new Error('Failed to load Pyodide'))
        document.head.appendChild(s)
      })
    }
    const py = await window.loadPyodide!({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/' })
    window.__mosaicPyodide = py
    return py
  }

  async function run() {
    setError(null)
    setOutput('')
    try {
      setStatus(window.__mosaicPyodide ? 'running' : 'loading-pyodide')
      const py = (await ensurePyodide()) as {
        runPythonAsync: (code: string) => Promise<unknown>
        setStdout: (opts: { batched: (s: string) => void }) => void
        setStderr: (opts: { batched: (s: string) => void }) => void
      }

      let buf = ''
      py.setStdout({ batched: (s: string) => { buf += s; setOutput(buf) } })
      py.setStderr({ batched: (s: string) => { buf += s; setOutput(buf) } })

      setStatus('running')
      const result = await py.runPythonAsync(code)
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

  const statusLabel: Record<Status, string> = {
    idle: label,
    'loading-pyodide': 'Loading Python (~6 MB)…',
    ready: 'Run again',
    running: 'Running…',
    error: 'Run again',
  }

  return (
    <div
      style={{
        margin: '1.25rem 0',
        border: '1px solid var(--m-border)',
        borderRadius: '0.7rem',
        overflow: 'hidden',
        background: 'var(--m-bg-soft)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          padding: '0.6rem 0.9rem',
          background: 'rgba(245,243,238,0.04)',
          borderBottom: '1px solid var(--m-border)',
          fontSize: '0.78rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--m-fg-dim)',
          fontFamily: 'var(--font-sans), system-ui, sans-serif',
        }}
      >
        <span aria-hidden>🐍</span>
        <span>Python — runs in your browser</span>
        {description && <span style={{ marginLeft: 'auto', opacity: 0.7, textTransform: 'none', letterSpacing: 0 }}>{description}</span>}
      </div>

      <pre
        style={{
          margin: 0,
          padding: '0.9rem 1rem',
          fontFamily: 'ui-monospace, monospace',
          fontSize: '0.85rem',
          lineHeight: 1.55,
          background: 'transparent',
          color: 'var(--m-fg)',
          overflow: 'auto',
          maxHeight: '20rem',
        }}
      >
        <code>{code}</code>
      </pre>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0.9rem', borderTop: '1px solid var(--m-border)' }}>
        <button
          onClick={run}
          disabled={status === 'running' || status === 'loading-pyodide'}
          style={{
            padding: '0.5rem 1.1rem',
            borderRadius: '0.4rem',
            border: 'none',
            background: 'var(--m-fg)',
            color: 'var(--m-bg)',
            fontWeight: 600,
            fontSize: '0.9rem',
            cursor: status === 'running' || status === 'loading-pyodide' ? 'wait' : 'pointer',
            fontFamily: 'var(--font-sans), system-ui, sans-serif',
          }}
        >
          {statusLabel[status]}
        </button>
        {status === 'loading-pyodide' && (
          <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>First run only — cached after.</span>
        )}
      </div>

      {(output || error) && (
        <pre
          ref={outputRef}
          style={{
            margin: 0,
            padding: '0.85rem 1rem',
            fontFamily: 'ui-monospace, monospace',
            fontSize: '0.82rem',
            lineHeight: 1.55,
            background: 'rgba(0,0,0,0.25)',
            color: error ? '#ff8b8b' : 'var(--m-fg)',
            borderTop: '1px solid var(--m-border)',
            maxHeight: '14rem',
            overflow: 'auto',
            whiteSpace: 'pre-wrap',
          }}
        >
          {error ?? output}
        </pre>
      )}
    </div>
  )
}
