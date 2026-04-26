import Link from 'next/link'
import { TILES, TRACK_ACCENT, TRACK_NUM, TRACK_LABELS, type Tile } from '../../lib/mosaic-tiles'
import { FocusScroll } from './FocusScroll'

type Props = {
  pathname: string
  children: React.ReactNode
}

export function LessonChrome({ pathname, children }: Props) {
  const tile = TILES.find((t) => t.slug === pathname)
  if (!tile) return <article className="m-lesson-body m-lesson-body-bare">{children}</article>

  const moduleSlug = tile.slug.split('/').slice(0, -1).join('/')
  const moduleTiles = TILES.filter((t) => t.slug.startsWith(moduleSlug + '/'))
  const idx = moduleTiles.findIndex((t) => t.slug === tile.slug)
  const prev: Tile | undefined = moduleTiles[idx - 1]
  const next: Tile | undefined = moduleTiles[idx + 1]

  const accent = TRACK_ACCENT[tile.track]

  return (
    <article className="m-lesson" style={{ ['--accent' as string]: accent }}>
      <div className="m-lesson-accent" aria-hidden />

      <nav className="m-lesson-breadcrumb" aria-label="Breadcrumb">
        <Link href={`/${tile.track}`} className="m-lesson-bc-track">
          <span aria-hidden>{TRACK_NUM[tile.track]}</span>
          {TRACK_LABELS[tile.track]}
        </Link>
        <span aria-hidden className="m-lesson-bc-sep">/</span>
        <Link href={`/${moduleSlug}`} className="m-lesson-bc-module">
          {tile.moduleName}
        </Link>
        <span aria-hidden className="m-lesson-bc-sep">/</span>
        <span className="m-lesson-bc-position">
          Lesson {idx + 1} of {moduleTiles.length}
        </span>
      </nav>

      <div className="m-lesson-body m-prose">
        <FocusScroll>{children}</FocusScroll>
      </div>

      <footer className="m-lesson-footer">
        <div className="m-lesson-footer-row">
          {prev ? (
            <Link href={prev.slug} className="m-lesson-prev">
              <span className="m-lesson-step-label">← Previous</span>
              <span className="m-lesson-step-title">{prev.title}</span>
            </Link>
          ) : (
            <span aria-hidden />
          )}
          {next ? (
            <Link href={next.slug} className="m-lesson-next">
              <span className="m-lesson-step-label">Next lesson →</span>
              <span className="m-lesson-step-title">{next.title}</span>
            </Link>
          ) : (
            <Link href={`/${tile.track}`} className="m-lesson-next">
              <span className="m-lesson-step-label">Module complete →</span>
              <span className="m-lesson-step-title">Back to {TRACK_LABELS[tile.track]}</span>
            </Link>
          )}
        </div>

        <div className="m-lesson-track-strip">
          <span className="m-lesson-track-label">
            <span aria-hidden>{TRACK_NUM[tile.track]}</span>
            <Link href={`/${tile.track}`}>{TRACK_LABELS[tile.track]}</Link>
            <span className="m-lesson-track-dot">·</span>
            <Link href={`/${moduleSlug}`}>{tile.moduleName}</Link>
          </span>
          <Link href="/map" className="m-lesson-track-map">
            See the full course map →
          </Link>
        </div>
      </footer>
    </article>
  )
}
