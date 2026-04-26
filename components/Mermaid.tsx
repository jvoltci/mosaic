'use client'

import { useEffect, useId, useRef, useState } from 'react'

/**
 * Mosaic-themed Mermaid renderer.
 * Replaces Nextra's default Mermaid component (which forces "default"
 * Mermaid theme on light DOMs and "dark" on dark) with one that uses
 * our brand variables on every render — independent of html.dark class.
 *
 * Registered via mdx-components.tsx so MDX `Mermaid chart="..."` calls land here.
 */
export function Mermaid({ chart }: { chart: string }) {
  const id = useId()
  const [svg, setSvg] = useState<string>('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    async function render() {
      const { default: mermaid } = await import('mermaid')
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'loose',
        fontFamily: 'var(--font-sans), system-ui, sans-serif',
        theme: 'base',
        themeVariables: {
          // canvas
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
          // sequence
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
          // cluster
          clusterBkg: 'rgba(245, 243, 238, 0.03)',
          clusterBorder: 'rgba(245, 243, 238, 0.2)',
          // edge labels
          edgeLabelBackground: '#12121b',
          // notes
          noteBkgColor: 'rgba(242, 204, 143, 0.12)',
          noteBorderColor: 'rgba(242, 204, 143, 0.4)',
          noteTextColor: '#f5f3ee',
          // gantt
          sectionBkgColor: '#161620',
          altSectionBkgColor: '#0e0e16',
          gridColor: 'rgba(245, 243, 238, 0.1)',
        },
      })
      try {
        const { svg } = await mermaid.render(
          id.replaceAll(':', ''),
          chart.replaceAll('\\n', '\n'),
        )
        if (!cancelled) setSvg(svg)
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Mermaid render error:', e)
      }
    }
    render()
    return () => {
      cancelled = true
    }
  }, [chart, id])

  return (
    <div
      ref={ref}
      className="m-mermaid"
      dangerouslySetInnerHTML={{ __html: svg }}
      aria-label="Diagram"
    />
  )
}
