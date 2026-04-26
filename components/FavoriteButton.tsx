'use client'

import { usePathname } from 'next/navigation'
import { useFavorites } from '../lib/use-favorites'

/**
 * Star toggle for the current lesson. Renders into LessonChrome's breadcrumb row.
 * Persists to localStorage; appears in /favorites.
 */
export function FavoriteButton() {
  const pathname = usePathname() || ''
  const { isFavorite, toggle } = useFavorites()
  const fav = isFavorite(pathname)

  return (
    <button
      className={`m-fav-btn ${fav ? 'is-on' : ''}`}
      onClick={() => toggle(pathname)}
      aria-pressed={fav}
      aria-label={fav ? 'Remove from favorites' : 'Save to favorites'}
      title={fav ? 'Saved — open /favorites to revisit' : 'Save this lesson'}
    >
      <span aria-hidden>{fav ? '★' : '☆'}</span>
      <span className="m-fav-btn-label">{fav ? 'Saved' : 'Save'}</span>
    </button>
  )
}
