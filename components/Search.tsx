'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'

type SubResult = {
  title: string
  url: string
  excerpt: string
}

type Result = {
  id: string
  url: string
  title: string
  excerpt: string
  meta?: { title?: string }
  sub_results?: SubResult[]
}

type PagefindResult = {
  id: string
  data: () => Promise<{
    url: string
    excerpt: string
    meta?: { title?: string }
    sub_results?: SubResult[]
  }>
}

type Pagefind = {
  search: (q: string) => Promise<{ results: PagefindResult[] }>
  options?: (opts: Record<string, unknown>) => Promise<void>
}

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || ''

let pagefindPromise: Promise<Pagefind | null> | null = null
function loadPagefind(): Promise<Pagefind | null> {
  if (pagefindPromise) return pagefindPromise
  pagefindPromise = (async () => {
    try {
      const url = `${BASE}/pagefind/pagefind.js`
      const mod = (await import(/* webpackIgnore: true */ url)) as Pagefind
      if (mod.options) await mod.options({ baseUrl: BASE || '/' })
      return mod
    } catch {
      return null
    }
  })()
  return pagefindPromise
}

/**
 * Cmd-K (or ⌘-/) opens a search modal that queries the static Pagefind
 * index built in `postbuild`. No server, no service — just an indexed
 * static asset.
 */
export function Search() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(false)
  const [available, setAvailable] = useState<boolean | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Cmd-K / Ctrl-K to open; Esc to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey
      if (meta && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault()
        setOpen((v) => !v)
      } else if (e.key === 'Escape' && open) {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // Focus input when opened
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 30)
      loadPagefind().then((pf) => setAvailable(!!pf))
      return () => clearTimeout(t)
    }
  }, [open])

  // Debounced search
  useEffect(() => {
    if (!open) return
    const q = query.trim()
    if (!q) { setResults([]); return }
    let cancelled = false
    setLoading(true)
    const t = setTimeout(async () => {
      const pf = await loadPagefind()
      if (!pf) { if (!cancelled) { setLoading(false); setResults([]) } return }
      const search = await pf.search(q)
      const top = search.results.slice(0, 10)
      const data = await Promise.all(top.map((r) => r.data()))
      if (cancelled) return
      setResults(
        data.map((d, i) => ({
          id: top[i].id,
          url: d.url.startsWith(BASE) ? d.url : `${BASE}${d.url.startsWith('/') ? '' : '/'}${d.url}`,
          title: d.meta?.title || d.url,
          excerpt: d.excerpt,
          meta: d.meta,
          sub_results: d.sub_results,
        }))
      )
      setLoading(false)
    }, 120)
    return () => { cancelled = true; clearTimeout(t) }
  }, [query, open])

  const close = useCallback(() => setOpen(false), [])

  if (!open) {
    return (
      <button
        className="m-search-trigger"
        onClick={() => setOpen(true)}
        aria-label="Search lessons (⌘K)"
        title="Search lessons (⌘K)"
      >
        <span aria-hidden>⌕</span>
        <span className="m-search-trigger-label">Search</span>
        <kbd className="m-search-kbd">⌘K</kbd>
      </button>
    )
  }

  return (
    <div className="m-search-overlay" role="dialog" aria-modal="true" aria-label="Search">
      <button className="m-search-scrim" aria-label="Close search" onClick={close} />
      <div className="m-search-panel" onClick={(e) => e.stopPropagation()}>
        <div className="m-search-input-row">
          <span aria-hidden className="m-search-icon">⌕</span>
          <input
            ref={inputRef}
            className="m-search-input"
            type="search"
            placeholder="Search 81 lessons…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <kbd className="m-search-kbd m-search-kbd-esc">Esc</kbd>
        </div>

        <div className="m-search-results">
          {available === false && (
            <p className="m-search-note">
              Search isn't built yet. Run <code>npm run build</code> locally — Pagefind
              indexes only the production export.
            </p>
          )}
          {available && !query.trim() && (
            <p className="m-search-note">
              Try <em>flash attention</em>, <em>fsdp</em>, <em>quantization</em>, <em>mlir</em>.
            </p>
          )}
          {loading && <p className="m-search-note">Searching…</p>}
          {!loading && query.trim() && results.length === 0 && available && (
            <p className="m-search-note">No matches for <em>{query}</em>.</p>
          )}
          {results.map((r) => (
            <Link
              key={r.id}
              href={r.url.replace(BASE, '') || '/'}
              className="m-search-hit"
              onClick={close}
            >
              <span
                className="m-search-hit-title"
                dangerouslySetInnerHTML={{ __html: r.title }}
              />
              <span
                className="m-search-hit-excerpt"
                dangerouslySetInnerHTML={{ __html: r.excerpt }}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
