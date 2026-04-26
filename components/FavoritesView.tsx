'use client'

import Link from 'next/link'
import { useFavorites } from '../lib/use-favorites'
import { TILES, TRACK_LABELS, TRACK_ACCENT, TRACK_NUM, type TrackKey } from '../lib/mosaic-tiles'

const TRACK_ORDER: TrackKey[] = [
  'foundations',
  'ml-execution',
  'training',
  'llm-architecture',
  'compilers',
  'applied',
  'edge-ai',
]

/**
 * Renders the user's starred lessons grouped by track. localStorage-only;
 * shows a polite empty state on first visit.
 */
export function FavoritesView() {
  const { favorites, toggle } = useFavorites()

  if (favorites.size === 0) {
    return (
      <div className="m-favs-empty">
        <p className="m-favs-empty-title">Nothing saved yet.</p>
        <p className="m-favs-empty-sub">
          Tap the <span aria-hidden>☆</span> star at the top of any lesson to keep it here for later.
          Saved lessons live only in this browser — no account, no cloud.
        </p>
        <Link href="/map" className="m-favs-empty-cta">Open the course map →</Link>
      </div>
    )
  }

  const byTrack = new Map<TrackKey, typeof TILES>()
  for (const slug of favorites) {
    const tile = TILES.find((t) => t.slug === slug)
    if (!tile) continue
    const list = byTrack.get(tile.track) ?? []
    list.push(tile)
    byTrack.set(tile.track, list)
  }

  return (
    <div className="m-favs">
      <p className="m-favs-count">
        {favorites.size === 1 ? '1 lesson saved' : `${favorites.size} lessons saved`}
      </p>
      {TRACK_ORDER.map((track) => {
        const tiles = byTrack.get(track)
        if (!tiles || tiles.length === 0) return null
        return (
          <section
            key={track}
            className="m-favs-track"
            style={{ ['--accent' as string]: TRACK_ACCENT[track] }}
          >
            <h2 className="m-favs-track-title">
              <span aria-hidden className="m-favs-track-num">{TRACK_NUM[track]}</span>
              <Link href={`/${track}`}>{TRACK_LABELS[track]}</Link>
            </h2>
            <ul className="m-favs-list">
              {tiles.map((tile) => (
                <li key={tile.slug} className="m-favs-item">
                  <Link href={tile.slug} className="m-favs-link">
                    <span className="m-favs-link-title">{tile.title}</span>
                    <span className="m-favs-link-summary">{tile.summary}</span>
                  </Link>
                  <button
                    className="m-favs-remove"
                    onClick={() => toggle(tile.slug)}
                    aria-label={`Remove ${tile.title} from favorites`}
                    title="Remove"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
