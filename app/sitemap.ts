import { TILES } from '../lib/mosaic-tiles'
import type { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://mosaic.shivy.dev'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: `${BASE_URL}/`, changeFrequency: 'weekly' as const, priority: 1 },
    { url: `${BASE_URL}/map/`, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${BASE_URL}/cheatsheet/`, changeFrequency: 'monthly' as const, priority: 0.7 },
  ]

  // All track index pages
  const tracks = [...new Set(TILES.map((t) => t.track))]
  const trackPages = tracks.map((track) => ({
    url: `${BASE_URL}/${track}/`,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // All lesson pages (only available ones)
  const lessonPages = TILES.filter((t) => t.available).map((tile) => ({
    url: `${BASE_URL}${tile.slug}/`,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...trackPages, ...lessonPages]
}
