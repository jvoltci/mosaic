#!/usr/bin/env node
/**
 * Quarterly currency-refresh audit. Flags every lesson whose `last_reviewed`
 * frontmatter is older than 90 days. Outputs:
 *
 *   - human-readable report on stdout
 *   - GitHub-Actions-friendly grouping (one section per track)
 *   - exit code 0 (always — informational)
 *
 * Run manually: `node scripts/audit-currency.mjs`
 * Wired into a quarterly cron via `.github/workflows/currency-audit.yml`.
 */
import { readFile, readdir } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const CONTENT = join(ROOT, 'content')
const STALE_DAYS = parseInt(process.env.STALE_DAYS || '90', 10)

const today = new Date()
const todayStr = today.toISOString().slice(0, 10)

async function* walk(dir) {
  let entries
  try { entries = await readdir(dir, { withFileTypes: true }) } catch { return }
  for (const e of entries) {
    if (e.name.startsWith('_') || e.name.startsWith('.')) continue
    const full = join(dir, e.name)
    if (e.isDirectory()) yield* walk(full)
    else if (e.name.endsWith('.mdx')) yield full
  }
}

function parseFrontmatter(src) {
  if (!src.startsWith('---\n')) return {}
  const end = src.indexOf('\n---', 4)
  if (end === -1) return {}
  const block = src.slice(4, end)
  const out = {}
  for (const line of block.split('\n')) {
    const m = line.match(/^([a-zA-Z_]+):\s*(.+?)\s*$/)
    if (m) out[m[1]] = m[2]
  }
  return out
}

function daysBetween(a, b) {
  return Math.floor((b - a) / (1000 * 60 * 60 * 24))
}

const stale = []
const fresh = []
const missing = []

for await (const file of walk(CONTENT)) {
  const src = await readFile(file, 'utf8')
  const fm = parseFrontmatter(src)
  const rel = relative(ROOT, file)
  if (!fm.last_reviewed) {
    missing.push(rel)
    continue
  }
  const reviewed = new Date(fm.last_reviewed)
  if (Number.isNaN(reviewed.getTime())) {
    missing.push(rel)
    continue
  }
  const days = daysBetween(reviewed, today)
  if (days >= STALE_DAYS) {
    stale.push({ rel, last_reviewed: fm.last_reviewed, days })
  } else {
    fresh.push({ rel, days })
  }
}

console.log(`# Currency audit — ${todayStr}`)
console.log()
console.log(`Stale threshold: ${STALE_DAYS} days.`)
console.log(`${fresh.length} lessons fresh · ${stale.length} stale · ${missing.length} missing \`last_reviewed\``)
console.log()

if (stale.length === 0 && missing.length === 0) {
  console.log('✓ Every lesson is fresh. Nothing to do.')
  process.exit(0)
}

if (stale.length > 0) {
  console.log(`## Stale (${stale.length})`)
  console.log()
  // Group by track (first path segment after content/)
  const byTrack = new Map()
  for (const s of stale) {
    const seg = s.rel.split('/')[1] || 'misc'
    const list = byTrack.get(seg) ?? []
    list.push(s)
    byTrack.set(seg, list)
  }
  for (const [track, items] of [...byTrack.entries()].sort()) {
    console.log(`### ${track}`)
    for (const it of items.sort((a, b) => b.days - a.days)) {
      console.log(`- [ ] \`${it.rel}\` — last reviewed ${it.last_reviewed} (${it.days} days ago)`)
    }
    console.log()
  }
}

if (missing.length > 0) {
  console.log(`## Missing \`last_reviewed\` (${missing.length})`)
  console.log()
  for (const rel of missing) console.log(`- [ ] \`${rel}\``)
  console.log()
}

console.log('---')
console.log()
console.log('To refresh: re-read the lesson, update facts/numbers/links if needed, bump `last_reviewed:` to today.')
