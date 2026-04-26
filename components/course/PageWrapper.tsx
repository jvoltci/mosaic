import { TILES } from '../../lib/mosaic-tiles'
import { LessonChrome } from './LessonChrome'
import { ErrorBoundary } from '../ErrorBoundary'

const FULL_BLEED = new Set(['/', '/map', '/cheatsheet'])

type Props = {
  pathname: string
  children: React.ReactNode
}

/**
 * Decides which chrome to render around a page:
 * - Full-bleed (no chrome) for the landing, /map, /cheatsheet
 * - LessonChrome (track accent + breadcrumb + prev/next) for individual lesson pages
 * - Bare prose container for everything else (track + module index pages)
 */
export function PageWrapper({ pathname, children }: Props) {
  if (FULL_BLEED.has(pathname)) {
    return <ErrorBoundary>{children}</ErrorBoundary>
  }

  const isLesson = TILES.some((t) => t.slug === pathname)
  if (isLesson) {
    return (
      <ErrorBoundary>
        <LessonChrome pathname={pathname}>{children}</LessonChrome>
      </ErrorBoundary>
    )
  }

  return (
    <ErrorBoundary>
      <article className="m-index-page m-prose">{children}</article>
    </ErrorBoundary>
  )
}

