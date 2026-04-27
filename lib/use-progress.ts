'use client'

import { useCallback, useEffect, useState } from 'react'

const KEY = 'mosaic:completed'
const EVENT = 'mosaic:progress'

/**
 * Normalize a slug to the canonical form used by mosaic-tiles.ts:
 * leading slash, no trailing slash. Without this, `usePathname()` returns
 * `/foo/bar/` (because next.config has `trailingSlash: true`) but
 * `tile.slug` is `/foo/bar` — and `Set.has()` would silently always miss.
 */
function normalize(slug: string): string {
  if (!slug) return '/'
  const stripped = slug.replace(/\/+$/, '')
  return stripped || '/'
}

function load(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = localStorage.getItem(KEY)
    const arr: string[] = raw ? JSON.parse(raw) : []
    return new Set(arr.map(normalize))
  } catch {
    return new Set()
  }
}

function persist(s: Set<string>) {
  localStorage.setItem(KEY, JSON.stringify([...s]))
  window.dispatchEvent(new Event(EVENT))
}

export function useProgress() {
  const [completed, setCompleted] = useState<Set<string>>(new Set())

  useEffect(() => {
    const sync = () => setCompleted(load())
    sync()
    window.addEventListener(EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const toggle = useCallback((slug: string) => {
    const key = normalize(slug)
    const next = load()
    if (next.has(key)) next.delete(key)
    else next.add(key)
    persist(next)
    setCompleted(new Set(next))
  }, [])

  const isDone = useCallback((slug: string) => completed.has(normalize(slug)), [completed])

  return { completed, toggle, isDone }
}
