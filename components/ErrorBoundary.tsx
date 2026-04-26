'use client'

import React from 'react'

type Props = {
  children: React.ReactNode
}

type State = {
  hasError: boolean
  error: Error | null
}

/**
 * Catches render errors in lesson MDX (bad math, broken Mermaid, etc.)
 * and shows a styled fallback instead of a white screen.
 */
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[Mosaic] Render error:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            margin: '3rem auto',
            maxWidth: '36rem',
            padding: '2rem',
            borderRadius: '0.75rem',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            background: 'rgba(239, 68, 68, 0.06)',
            fontFamily: 'var(--font-sans), system-ui, sans-serif',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>⚠️</div>
          <h2
            style={{
              fontFamily: 'var(--font-display), Georgia, serif',
              fontSize: '1.3rem',
              fontWeight: 600,
              margin: '0 0 0.5rem',
              color: 'var(--m-fg)',
            }}
          >
            Something went wrong rendering this section
          </h2>
          <p
            style={{
              fontSize: '0.9rem',
              color: 'var(--m-fg-muted)',
              margin: '0 0 1rem',
              lineHeight: 1.5,
            }}
          >
            This is likely a content issue (broken diagram, bad math, etc.).
            Try refreshing the page.
          </p>
          {this.state.error && (
            <pre
              style={{
                textAlign: 'left',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono), ui-monospace, monospace',
                background: 'var(--m-bg-soft)',
                border: '1px solid var(--m-border)',
                padding: '0.75rem',
                borderRadius: '0.4rem',
                overflow: 'auto',
                maxHeight: '8rem',
                color: '#ef4444',
              }}
            >
              {this.state.error.message}
            </pre>
          )}
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1.2rem',
              borderRadius: '0.4rem',
              border: '1px solid var(--m-border)',
              background: 'transparent',
              color: 'var(--m-fg)',
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'var(--font-sans), system-ui, sans-serif',
            }}
          >
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
