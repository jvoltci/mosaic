#!/usr/bin/env node
/**
 * MDX trap linter. Catches the patterns that bite us repeatedly when authoring
 * MDX with embedded JSX. Runs as `prebuild` so a bad commit can never reach
 * production. Extend the TRAPS array when a new failure mode shows up.
 *
 * Usage: `node scripts/lint-mdx.mjs` (exits non-zero on any trap match).
 */
import { readFile, readdir } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const CONTENT = join(ROOT, 'content')

/**
 * Each trap is checked on every "prose-eligible" line. A line counts as prose
 * if it is NOT inside a fenced code block and NOT inside a JSX template
 * literal expression (the `code={\`...\`}` pattern).
 *
 * `pattern` is a regex; `name` is the rule label; `message` is the user-facing
 * fix hint; `examples` shows safe alternatives.
 */
const TRAPS = [
  {
    name: 'lt-digit',
    pattern: /<\d/,
    message: '`<digit` is parsed as a JSX tag start by MDX. Rewrite as "under N", "below N", or escape with `&lt;`.',
    examples: ['"<5%" → "under 5%"', '"<3 s" → "under 3 s"', '"<1 WER" → "under 1 WER"'],
  },
  {
    name: 'lt-equals-digit',
    pattern: /<=\s*\d/,
    message: '`<=N` is ambiguous on some MDX configs. Prefer "at most N" or "no more than N".',
    examples: ['"<=5" → "at most 5"'],
  },
]

/**
 * State machine: walk lines, skip regions where MDX does not parse JSX:
 *  1. Fenced code blocks (``` ... ```)
 *  2. Inline code (`...`) — stripped per-line
 *  3. JSX expression bodies (`={...}`) — tracked by `{}` depth across lines
 *
 * The depth tracker counts braces on each line *after* stripping inline
 * code and string literals, so a `{` inside `'foo'` doesn't count.
 */
function stripInlineCode(line) {
  // Replace backtick-quoted spans with spaces of equal length.
  return line.replace(/`[^`\n]*`/g, (m) => ' '.repeat(m.length))
}

function stripJsStrings(line) {
  // Strip single-, double-, and template-literal-quoted strings (single line).
  return line
    .replace(/'(?:\\.|[^'\\\n])*'/g, (m) => ' '.repeat(m.length))
    .replace(/"(?:\\.|[^"\\\n])*"/g, (m) => ' '.repeat(m.length))
    .replace(/`(?:\\.|[^`\\\n])*`/g, (m) => ' '.repeat(m.length))
}

function* prose_lines(src) {
  const lines = src.split('\n')
  let inFence = false       // ``` fenced code blocks
  let exprDepth = 0         // JSX expression brace depth
  let lineDepth = 0         // depth at start of current line

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Fenced code blocks
    if (/^\s{0,3}```/.test(line)) {
      inFence = !inFence
      continue
    }
    if (inFence) continue

    lineDepth = exprDepth

    // Update depth from this line — count `={` (expression opener) and `{`/`}`
    // pairs after stripping strings + inline code, so quoted braces don't count.
    const cleaned = stripJsStrings(stripInlineCode(line))
    for (const ch of cleaned) {
      if (ch === '{') exprDepth++
      else if (ch === '}') exprDepth = Math.max(0, exprDepth - 1)
    }

    // If the line was already inside an expression at start, OR ends inside one,
    // it's JS code (not prose) — skip.
    if (lineDepth > 0 || exprDepth > 0) continue

    // For pattern-matching, strip inline backticks AND quoted strings (JSX
    // attribute values like `what="..."`). Quoted strings are tolerated by
    // the MDX parser even when they contain `<digit`; we only care about
    // unquoted prose.
    yield { lineno: i + 1, text: stripJsStrings(stripInlineCode(line)) }
  }
}

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

const errors = []
const warnings = []

for await (const file of walk(CONTENT)) {
  const src = await readFile(file, 'utf8')
  const rel = relative(ROOT, file)
  for (const { lineno, text } of prose_lines(src)) {
    for (const trap of TRAPS) {
      if (!trap.pattern) continue
      const m = trap.pattern.exec(text)
      if (m) {
        errors.push({ rel, lineno, trap, snippet: text.trim() })
      }
    }
  }
}

if (errors.length === 0) {
  console.log('✓ MDX lint passed.')
  process.exit(0)
}

console.error(`\n✗ ${errors.length} MDX trap(s) found:\n`)
for (const e of errors) {
  console.error(`  ${e.rel}:${e.lineno}`)
  console.error(`    rule: ${e.trap.name}`)
  console.error(`    line: ${e.snippet.length > 110 ? e.snippet.slice(0, 110) + '…' : e.snippet}`)
  console.error(`    fix:  ${e.trap.message}`)
  if (e.trap.examples.length) {
    console.error(`    e.g.: ${e.trap.examples.join(' · ')}`)
  }
  console.error('')
}
process.exit(1)
