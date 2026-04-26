'use client'

import { useEffect, useId, useRef, useState } from 'react'

/**
 * Mosaic-themed Mermaid renderer. Theme-aware: re-renders when the user toggles
 * dark/light. Replaces Nextra's default Mermaid (aliased in next.config.mjs).
 *
 * Improvements:
 * - Loading skeleton while diagram renders
 * - Click-to-zoom on mobile/small diagrams
 * - Error fallback instead of blank space
 */

const DARK_THEME = {
  background: 'transparent',
  primaryColor: '#1a1a24',
  primaryTextColor: '#f5f3ee',
  primaryBorderColor: 'rgba(245, 243, 238, 0.42)',
  lineColor: 'rgba(245, 243, 238, 0.5)',
  secondaryColor: '#161620',
  tertiaryColor: '#0e0e16',
  mainBkg: '#1a1a24',
  secondBkg: '#161620',
  tertiaryBkg: '#0e0e16',
  textColor: '#f5f3ee',
  actorBkg: '#1a1a24',
  actorBorder: 'rgba(245, 243, 238, 0.42)',
  actorTextColor: '#f5f3ee',
  actorLineColor: 'rgba(245, 243, 238, 0.25)',
  signalColor: 'rgba(245, 243, 238, 0.55)',
  signalTextColor: '#f5f3ee',
  labelBoxBkgColor: '#1a1a24',
  labelBoxBorderColor: 'rgba(245, 243, 238, 0.4)',
  labelTextColor: '#f5f3ee',
  loopTextColor: '#f5f3ee',
  activationBkgColor: '#161620',
  activationBorderColor: 'rgba(245, 243, 238, 0.4)',
  clusterBkg: 'rgba(245, 243, 238, 0.03)',
  clusterBorder: 'rgba(245, 243, 238, 0.2)',
  edgeLabelBackground: '#12121b',
  noteBkgColor: 'rgba(242, 204, 143, 0.12)',
  noteBorderColor: 'rgba(242, 204, 143, 0.4)',
  noteTextColor: '#f5f3ee',
  sectionBkgColor: '#161620',
  altSectionBkgColor: '#0e0e16',
  gridColor: 'rgba(245, 243, 238, 0.1)',
}

const LIGHT_THEME = {
  background: 'transparent',
  primaryColor: '#fbfaf6',
  primaryTextColor: '#1a1a24',
  primaryBorderColor: 'rgba(26, 26, 36, 0.42)',
  lineColor: 'rgba(26, 26, 36, 0.55)',
  secondaryColor: '#f3f0e9',
  tertiaryColor: '#ece8df',
  mainBkg: '#fbfaf6',
  secondBkg: '#f3f0e9',
  tertiaryBkg: '#ece8df',
  textColor: '#1a1a24',
  actorBkg: '#fbfaf6',
  actorBorder: 'rgba(26, 26, 36, 0.42)',
  actorTextColor: '#1a1a24',
  actorLineColor: 'rgba(26, 26, 36, 0.3)',
  signalColor: 'rgba(26, 26, 36, 0.6)',
  signalTextColor: '#1a1a24',
  labelBoxBkgColor: '#fbfaf6',
  labelBoxBorderColor: 'rgba(26, 26, 36, 0.42)',
  labelTextColor: '#1a1a24',
  loopTextColor: '#1a1a24',
  activationBkgColor: '#f3f0e9',
  activationBorderColor: 'rgba(26, 26, 36, 0.4)',
  clusterBkg: 'rgba(26, 26, 36, 0.03)',
  clusterBorder: 'rgba(26, 26, 36, 0.2)',
  edgeLabelBackground: '#fbfaf6',
  noteBkgColor: 'rgba(184, 144, 47, 0.12)',
  noteBorderColor: 'rgba(184, 144, 47, 0.45)',
  noteTextColor: '#1a1a24',
  sectionBkgColor: '#f3f0e9',
  altSectionBkgColor: '#ece8df',
  gridColor: 'rgba(26, 26, 36, 0.1)',
}

function isDark(): boolean {
  if (typeof document === 'undefined') return true
  return document.documentElement.classList.contains('dark')
}

export function Mermaid({ chart }: { chart: string }) {
  const id = useId()
  const [svg, setSvg] = useState<string>('')
  const [status, setStatus] = useState<'loading' | 'done' | 'error'>('loading')
  const [zoomed, setZoomed] = useState(false)
  const [tick, setTick] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  // Listen for theme changes — re-render the diagram with the matching palette
  useEffect(() => {
    const onTheme = () => setTick((n) => n + 1)
    window.addEventListener('mosaic:theme-change', onTheme)
    // Also catch system-preference flips when user hasn't picked a manual theme
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    mq.addEventListener('change', onTheme)
    return () => {
      window.removeEventListener('mosaic:theme-change', onTheme)
      mq.removeEventListener('change', onTheme)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    setStatus('loading')
    async function render() {
      const { default: mermaid } = await import('mermaid')
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'loose',
        fontFamily: 'var(--font-sans), system-ui, sans-serif',
        theme: 'base',
        themeVariables: isDark() ? DARK_THEME : LIGHT_THEME,
      })
      try {
        const { svg } = await mermaid.render(
          id.replaceAll(':', '') + '-' + tick,
          chart.replaceAll('\\n', '\n'),
        )
        if (!cancelled) {
          setSvg(svg)
          setStatus('done')
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Mermaid render error:', e)
        if (!cancelled) setStatus('error')
      }
    }
    render()
    return () => {
      cancelled = true
    }
  }, [chart, id, tick])

  if (status === 'error') {
    return (
      <div className="m-mermaid m-mermaid-error">
        <span>⚠️ Diagram failed to render</span>
      </div>
    )
  }

  return (
    <>
      <div
        ref={ref}
        className={`m-mermaid ${status === 'loading' ? 'm-mermaid-loading' : ''}`}
        onClick={() => setZoomed(true)}
        role="img"
        aria-label="Diagram"
        title="Click to enlarge"
      >
        {status === 'loading' && (
          <div className="m-mermaid-skeleton" aria-hidden>
            <div className="m-mermaid-skeleton-pulse" />
          </div>
        )}
        {svg && (
          <div dangerouslySetInnerHTML={{ __html: svg }} />
        )}
      </div>

      {/* Zoom overlay */}
      {zoomed && svg && (
        <div
          className="m-mermaid-overlay"
          onClick={() => setZoomed(false)}
          role="dialog"
          aria-label="Enlarged diagram"
        >
          <div
            className="m-mermaid-overlay-content"
            onClick={(e) => e.stopPropagation()}
            dangerouslySetInnerHTML={{ __html: svg }}
          />
          <button
            className="m-mermaid-overlay-close"
            onClick={() => setZoomed(false)}
            aria-label="Close enlarged diagram"
          >
            ✕
          </button>
        </div>
      )}
    </>
  )
}
