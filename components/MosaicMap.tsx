'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { TILES, TRACK_ACCENT, TRACK_ICON, TRACK_LABELS, type Tile, type TrackKey } from '../lib/mosaic-tiles'
import { axialToPixel, hexPath, bounds } from '../lib/hex'
import { useProgress } from '../lib/use-progress'
import { illustrationFor } from './tiles'

type Variant = 'landing' | 'map' | 'cheatsheet'
type Props = {
  variant?: Variant
  hexSize?: number
}

type TooltipState = { tile: Tile; x: number; y: number; pinned: boolean }

export function MosaicMap({ variant = 'landing', hexSize = 38 }: Props) {
  const { completed } = useProgress()
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)

  // Dismiss tooltip on outside click / Escape
  useEffect(() => {
    if (!tooltip?.pinned) return
    const onDoc = (e: MouseEvent) => {
      if (!(e.target instanceof Element)) return
      if (!stageRef.current?.contains(e.target)) setTooltip(null)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setTooltip(null)
    }
    document.addEventListener('click', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('click', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [tooltip?.pinned])

  const layout = useMemo(() => {
    const { minX, minY, maxX, maxY } = bounds(TILES, hexSize)
    const padding = hexSize * 0.6
    const width = maxX - minX + padding * 2
    const height = maxY - minY + padding * 2
    return {
      viewBox: `${minX - padding} ${minY - padding} ${width} ${height}`,
      width,
      height,
    }
  }, [hexSize])

  const counts = useMemo(() => {
    const byTrack: Record<TrackKey, { total: number; done: number }> = {
      foundations: { total: 0, done: 0 },
      'ml-execution': { total: 0, done: 0 },
      training: { total: 0, done: 0 },
      'llm-architecture': { total: 0, done: 0 },
      compilers: { total: 0, done: 0 },
      applied: { total: 0, done: 0 },
      'edge-ai': { total: 0, done: 0 },
    }
    for (const t of TILES) {
      byTrack[t.track].total += 1
      if (completed.has(t.slug)) byTrack[t.track].done += 1
    }
    return byTrack
  }, [completed])

  const totalDone = TILES.reduce((n, t) => n + (completed.has(t.slug) ? 1 : 0), 0)
  const availableCount = TILES.reduce((n, t) => n + (t.available ? 1 : 0), 0)

  function showTooltipForTile(tile: Tile, anchor: SVGElement, pinned = false) {
    if (!stageRef.current) return
    const stageRect = stageRef.current.getBoundingClientRect()
    const aRect = anchor.getBoundingClientRect()
    setTooltip({
      tile,
      x: aRect.left - stageRect.left + aRect.width / 2,
      y: aRect.top - stageRect.top,
      pinned,
    })
  }

  function clearHover(slug: string) {
    setTooltip((prev) => {
      if (!prev || prev.tile.slug !== slug || prev.pinned) return prev
      return null
    })
  }

  return (
    <section id="course-map" className={`m-mosaic m-mosaic-${variant}`}>
      {variant !== 'cheatsheet' && (
        <header className="m-mosaic-header">
          <p className="m-section-eyebrow">The course map</p>
          <h2 className="m-section-title">
            {totalDone === 0
              ? `${availableCount} of ${TILES.length} lessons written. Pick any tile.`
              : totalDone === availableCount
                ? `🏁 ${totalDone} of ${availableCount} written lessons completed.`
                : `${totalDone} of ${availableCount} written lessons completed.`}
          </h2>
          <p className="m-section-lede">
            Every tile is one lesson. Solid tiles are written; dashed tiles are stubs being filled in. Hover or
            tap to see what each teaches.
          </p>
        </header>
      )}

      <div ref={stageRef} className="m-mosaic-stage">
        <div ref={scrollerRef} className="m-mosaic-scroller">
          <svg
            viewBox={layout.viewBox}
            className="m-mosaic-svg"
            role="img"
            aria-label="Mosaic course map. Each tile is one lesson."
            preserveAspectRatio="xMidYMid meet"
            style={{ width: layout.width, height: layout.height }}
          >
            {TILES.map((tile) => {
              const { x, y } = axialToPixel(tile.q, tile.r, hexSize)
              const isCompleted = completed.has(tile.slug)
              const isActive = tooltip?.tile.slug === tile.slug
              const accent = TRACK_ACCENT[tile.track]
              const Illustration = illustrationFor(tile.illustration)
              const slug = tile.available ? tile.slug : tile.fallback
              const target = `${process.env.NEXT_PUBLIC_BASE_PATH || ''}${slug}`

              return (
                <a
                  key={tile.slug}
                  href={target}
                  aria-label={`${tile.title}${isCompleted ? ', completed' : ''}, in ${TRACK_LABELS[tile.track]}`}
                  onMouseEnter={(e) => showTooltipForTile(tile, e.currentTarget as unknown as SVGElement, false)}
                  onFocus={(e) => showTooltipForTile(tile, e.currentTarget as unknown as SVGElement, false)}
                  onMouseLeave={() => clearHover(tile.slug)}
                  onBlur={() => clearHover(tile.slug)}
                  onClick={(e) => {
                    // On touch / coarse pointer: first tap pins tooltip, second tap follows link.
                    if (window.matchMedia('(hover: none)').matches) {
                      const wasActive = tooltip?.tile.slug === tile.slug && tooltip?.pinned
                      if (!wasActive) {
                        e.preventDefault()
                        showTooltipForTile(tile, e.currentTarget as unknown as SVGElement, true)
                      }
                    }
                  }}
                  className={[
                    'm-mtile',
                    isCompleted && 'is-completed',
                    isActive && 'is-active',
                    !tile.available && 'is-stub',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  style={{ ['--accent' as string]: accent }}
                >
                  <g transform={`translate(${x.toFixed(2)} ${y.toFixed(2)})`}>
                    <path d={hexPath(0, 0, hexSize)} className="m-mtile-hex" />
                    <g className="m-mtile-art" pointerEvents="none">
                      <Illustration color={isCompleted ? accent : 'var(--m-fg)'} size={hexSize} />
                    </g>
                    {isCompleted && (
                      <g
                        transform={`translate(${(hexSize * 0.55).toFixed(2)} ${(-hexSize * 0.6).toFixed(2)})`}
                        pointerEvents="none"
                      >
                        <circle r={5.5} fill={accent} />
                        <path
                          d="M-2.6,0 L-0.6,2 L2.6,-2"
                          stroke="var(--m-bg)"
                          strokeWidth={1.6}
                          fill="none"
                          strokeLinejoin="round"
                          strokeLinecap="round"
                        />
                      </g>
                    )}
                  </g>
                </a>
              )
            })}
          </svg>
        </div>

        {/* Floating tooltip — positioned above the active tile */}
        {tooltip && (
          <MosaicTooltip
            tile={tooltip.tile}
            x={tooltip.x}
            y={tooltip.y}
            pinned={tooltip.pinned}
            isCompleted={completed.has(tooltip.tile.slug)}
            stageWidth={stageRef.current?.clientWidth ?? 0}
          />
        )}

        <p className="m-mosaic-hint" aria-hidden>
          <span>← swipe to explore →</span>
        </p>
      </div>

      {/* Per-track progress pills — primary navigation for non-mosaic users */}
      <div className="m-mosaic-progress-row">
        {(Object.keys(counts) as TrackKey[]).map((track) => {
          const c = counts[track]
          const pct = c.total ? (c.done / c.total) * 100 : 0
          return (
            <Link
              key={track}
              href={`/${track}`}
              className="m-mosaic-progress-pill"
              style={{ ['--accent' as string]: TRACK_ACCENT[track] }}
            >
              <span className="m-mosaic-progress-icon">{TRACK_ICON[track]}</span>
              <span className="m-mosaic-progress-label">{TRACK_LABELS[track]}</span>
              <span className="m-mosaic-progress-count">
                {c.done}/{c.total}
              </span>
              <span className="m-mosaic-progress-bar">
                <span className="m-mosaic-progress-bar-fill" style={{ width: `${pct}%` }} />
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

function MosaicTooltip({
  tile,
  x,
  y,
  pinned,
  isCompleted,
  stageWidth,
}: {
  tile: Tile
  x: number
  y: number
  pinned: boolean
  isCompleted: boolean
  stageWidth: number
}) {
  const target = tile.available ? tile.slug : tile.fallback
  const tooltipWidth = 280
  const half = tooltipWidth / 2
  const padding = 12
  const clampedX = Math.max(half + padding, Math.min(stageWidth - half - padding, x))

  return (
    <div
      className="m-mtooltip"
      style={{
        left: clampedX,
        top: y,
        transform: 'translate(-50%, calc(-100% - 14px))',
        ['--accent' as string]: TRACK_ACCENT[tile.track],
      }}
      role="status"
      aria-live="polite"
    >
      <div className="m-mtooltip-meta">
        <span className="m-mtooltip-icon" aria-hidden>{TRACK_ICON[tile.track]}</span>
        <span className="m-mtooltip-track">{TRACK_LABELS[tile.track]} · {tile.moduleName}</span>
        {isCompleted && <span className="m-mtooltip-done">✓</span>}
        {!tile.available && <span className="m-mtooltip-stub">soon</span>}
      </div>
      <div className="m-mtooltip-title">{tile.title}</div>
      <div className="m-mtooltip-summary">{tile.summary}</div>
      {pinned && (
        <Link href={target} className="m-mtooltip-cta">
          Open lesson →
        </Link>
      )}
      <span className="m-mtooltip-arrow" aria-hidden />
    </div>
  )
}
