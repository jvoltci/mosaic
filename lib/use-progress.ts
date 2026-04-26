'use client'

import { useCallback, useEffect, useState } from 'react'

const KEY = 'mosaic:completed'
const EVENT = 'mosaic:progress'

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
    const next = load()
    if (next.has(slug)) next.delete(slug)
    else next.add(slug)
    persist(next)
    setCompleted(new Set(next))
  }, [])

  const isDone = useCallback((slug: string) => completed.has(slug), [completed])

  return { completed, toggle, isDone }
}
