import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import yaml from 'js-yaml'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const CONTENT = join(ROOT, 'content')
const OUT_DIR = join(ROOT, 'lib')
const OUT_FILE = join(OUT_DIR, 'cheatsheet-index.json')

async function* walk(dir) {
  let entries
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch (err) {
    if (err.code === 'ENOENT') return
    throw err
  }
  for (const entry of entries) {
    if (entry.name.startsWith('_') || entry.name.startsWith('.')) continue
    const full = join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(full)
    else if (entry.name.endsWith('.mdx')) yield full
  }
}

function extractFrontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---/)
  if (!m) return {}
  try {
    const parsed = yaml.load(m[1])
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function extractTLDR(text) {
  const m = text.match(/##\s+(?:TL;DR|Cheatsheet|TLDR)[^\n]*\n([\s\S]*?)(?=\n##\s|\n#\s|$)/i)
  return m ? m[1].trim() : null
}

function extractFirstH1(text) {
  const m = text.match(/^#\s+(.+)$/m)
  return m ? m[1].trim() : null
}

const items = []
for await (const file of walk(CONTENT)) {
  const text = await readFile(file, 'utf8')
  const fm = extractFrontmatter(text)
  const tldr = extractTLDR(text)
  if (!tldr) continue
  const rel = relative(CONTENT, file).replace(/\\/g, '/').replace(/\.mdx$/, '')
  const slug = rel === 'index' ? '/' : '/' + rel.replace(/\/index$/, '')
  const parts = rel.split('/')
  const track = parts[0] ?? ''
  const moduleSlug = parts.length > 2 ? parts.slice(0, -1).join('/') : track
  const title = fm.title || extractFirstH1(text) || parts.at(-1)
  items.push({ slug, track, module: moduleSlug, title, tldr })
}

await mkdir(OUT_DIR, { recursive: true })
await writeFile(OUT_FILE, JSON.stringify(items, null, 2) + '\n')
console.log(`[mosaic] wrote ${items.length} cheatsheet entries → ${relative(ROOT, OUT_FILE)}`)
