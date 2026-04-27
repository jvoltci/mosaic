#!/usr/bin/env node
/**
 * Mapping integrity check. Run as part of prebuild.
 * Fails fast if tiles, files, _meta.ts, ModuleProgress, and cheatsheet drift.
 */
import { readFileSync, existsSync } from 'node:fs'
import { readdir, readFile } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const CONTENT = join(ROOT, 'content')

let errors = 0
const fail = (msg) => { console.error(`  ✗ ${msg}`); errors++ }
const ok = (msg) => console.log(`  ✓ ${msg}`)

// ── 1. Parse tiles from lib/mosaic-tiles.ts ──────────────────────────────
const tilesSrc = readFileSync(join(ROOT, 'lib/mosaic-tiles.ts'), 'utf8')
const tileRe = /\{\s*slug:\s*'([^']+)'[^}]*?available:\s*(true|false)[^}]*?\}/g
const tiles = []
for (const m of tilesSrc.matchAll(tileRe)) {
  tiles.push({ slug: m[1], available: m[2] === 'true' })
}
console.log(`\nFound ${tiles.length} tiles in mosaic-tiles.ts (${tiles.filter(t => t.available).length} available)\n`)

// ── 2. Tile → file: every tile (regardless of available) maps to a file path ──
console.log('CHECK 1: tile slugs map to existing files')
for (const t of tiles) {
  const filePath = join(CONTENT, t.slug.replace(/^\//, '') + '.mdx')
  const dirIndexPath = join(CONTENT, t.slug.replace(/^\//, ''), 'index.mdx')
  if (!existsSync(filePath) && !existsSync(dirIndexPath)) {
    if (t.available) {
      fail(`tile ${t.slug} marked available:true but ${relative(ROOT, filePath)} missing`)
    }
  } else if (!t.available) {
    fail(`tile ${t.slug} has file ${relative(ROOT, filePath)} but is marked available:false`)
  }
}
if (errors === 0) ok('all available tiles point to existing files; no orphan files marked unavailable')

// ── 3. File → tile: every lesson .mdx (not index.mdx, not top-level) has a tile ──
console.log('\nCHECK 2: every lesson .mdx is registered as a tile')
const startErrors = errors
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
const tileSlugs = new Set(tiles.map(t => t.slug))
const TOP_LEVEL_EXEMPT = new Set(['index', 'cheatsheet', 'map', 'learning-paths', 'favorites', 'reads'])
for await (const file of walk(CONTENT)) {
  const rel = relative(CONTENT, file).replace(/\\/g, '/').replace(/\.mdx$/, '')
  // module index.mdx files are not tiles; they're module pages
  if (rel.endsWith('/index') || TOP_LEVEL_EXEMPT.has(rel)) continue
  const slug = '/' + rel
  if (!tileSlugs.has(slug)) {
    fail(`lesson file ${rel}.mdx exists but no tile in mosaic-tiles.ts (slug=${slug})`)
  }
}
if (errors === startErrors) ok('every lesson .mdx has a corresponding tile')

// ── 4. Tile → _meta.ts: every available tile appears in its module's _meta.ts ──
console.log('\nCHECK 3: every available tile is keyed in its module _meta.ts')
const startErrors3 = errors
const metaCache = new Map()
async function getMeta(metaPath) {
  if (metaCache.has(metaPath)) return metaCache.get(metaPath)
  if (!existsSync(metaPath)) { metaCache.set(metaPath, null); return null }
  const src = await readFile(metaPath, 'utf8')
  const keys = []
  // crude key extraction; covers `key: 'value'` and `'key-with-dashes': '...'`
  for (const m of src.matchAll(/^\s*'?([a-zA-Z0-9_-]+)'?\s*:/gm)) {
    keys.push(m[1])
  }
  metaCache.set(metaPath, keys)
  return keys
}
for (const t of tiles) {
  if (!t.available) continue
  const parts = t.slug.replace(/^\//, '').split('/')
  if (parts.length < 3) continue // top-level tiles (rare) skip
  const moduleDir = join(CONTENT, parts.slice(0, -1).join('/'))
  const lessonKey = parts[parts.length - 1]
  const metaKeys = await getMeta(join(moduleDir, '_meta.ts'))
  if (metaKeys && !metaKeys.includes(lessonKey)) {
    fail(`tile ${t.slug}: lesson key '${lessonKey}' not in ${relative(ROOT, join(moduleDir, '_meta.ts'))}`)
  }
}
if (errors === startErrors3) ok('every available tile is keyed in its module _meta.ts')

// ── 5. Tile → ModuleProgress: every available tile appears in its module index ──
console.log('\nCHECK 4: every available tile appears in <ModuleProgress lessons={[...]} />')
const startErrors4 = errors
const moduleProgressByDir = new Map()
async function getModuleProgressSlugs(moduleDir) {
  if (moduleProgressByDir.has(moduleDir)) return moduleProgressByDir.get(moduleDir)
  const indexPath = join(moduleDir, 'index.mdx')
  if (!existsSync(indexPath)) { moduleProgressByDir.set(moduleDir, null); return null }
  const src = await readFile(indexPath, 'utf8')
  const block = src.match(/<ModuleProgress[\s\S]*?lessons=\{(\[[\s\S]*?\])\s*\}/)
  if (!block) { moduleProgressByDir.set(moduleDir, []); return [] }
  const slugs = [...block[1].matchAll(/slug:\s*'([^']+)'/g)].map(m => m[1])
  moduleProgressByDir.set(moduleDir, slugs)
  return slugs
}
for (const t of tiles) {
  if (!t.available) continue
  const parts = t.slug.replace(/^\//, '').split('/')
  if (parts.length < 3) continue
  const moduleDir = join(CONTENT, parts.slice(0, -1).join('/'))
  const slugs = await getModuleProgressSlugs(moduleDir)
  if (slugs && !slugs.includes(t.slug)) {
    fail(`tile ${t.slug} not listed in ${relative(ROOT, join(moduleDir, 'index.mdx'))} <ModuleProgress>`)
  }
}
if (errors === startErrors4) ok('every available tile is listed in its module index <ModuleProgress>')

// ── 6. Cheatsheet coverage: every available tile lesson has a ## TL;DR section ──
console.log('\nCHECK 5: every available tile lesson has a ## TL;DR section')
const startErrors5 = errors
for (const t of tiles) {
  if (!t.available) continue
  const filePath = join(CONTENT, t.slug.replace(/^\//, '') + '.mdx')
  if (!existsSync(filePath)) continue
  const src = await readFile(filePath, 'utf8')
  if (!/^##\s+TL;DR/m.test(src)) {
    fail(`tile ${t.slug}: lesson missing '## TL;DR' (won't appear in /cheatsheet)`)
  }
}
if (errors === startErrors5) ok('every available lesson has a ## TL;DR for the cheatsheet')

console.log()
if (errors === 0) {
  console.log('✓ Mapping integrity check passed.\n')
  process.exit(0)
}
console.error(`✗ ${errors} mapping issue(s) found.\n`)
process.exit(1)
