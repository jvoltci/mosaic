'use client'

import { useCallback, useEffect, useState } from 'react'

const KEY = 'mosaic:favorites'
const EVENT = 'mosaic:favorites'

function load(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = localStorage.getItem(KEY)
    return new Set(raw ? JSON.parse(raw) : [])
  } catch {
    return new Set()
  }
}

function persist(s: Set<string>) {
  localStorage.setItem(KEY, JSON.stringify([...s]))
  window.dispatchEvent(new Event(EVENT))
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  useEffect(() => {
    const sync = () => setFavorites(load())
    sync()
    window.addEventListener(EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const toggle = useCallback((slug: string) => {
    const next = load()
    if (next.has(slug)) next.delete(slug)
    else next.add(slug)
    persist(next)
    setFavorites(new Set(next))
  }, [])

  const isFavorite = useCallback((slug: string) => favorites.has(slug), [favorites])

  return { favorites, toggle, isFavorite }
}
