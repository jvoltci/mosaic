import Link from 'next/link'

type Item = { slug: string; track: string; module: string; title: string; tldr: string }

const TRACK_LABELS: Record<string, string> = {
  foundations: '01 · Systems Foundations',
  'ml-execution': '02 · ML Execution & Quantization',
  training: '03 · Training & RLHF',
  'llm-architecture': '04 · LLM Architecture',
  compilers: '05 · ML Compilers & Hardware',
  applied: '06 · Applied AI · Build & Ship',
}

/**
 * Mini markdown renderer for TL;DR text.
 * Handles: leading bullet `- ` or `* `, **bold**, `code`, [link](url), em dashes.
 * Anything more complex than that and the TL;DR is too long anyway.
 */
function renderTldr(md: string): React.ReactNode {
  const lines = md.trim().split('\n').map((l) => l.trim()).filter(Boolean)
  const isBulletList = lines.every((l) => /^[-*]\s+/.test(l))

  if (isBulletList) {
    return (
      <ul>
        {lines.map((line, i) => (
          <li key={i}>{renderInline(line.replace(/^[-*]\s+/, ''))}</li>
        ))}
      </ul>
    )
  }
  return <p>{renderInline(md)}</p>
}

function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = []
  // Order matters: **bold** before *italic* (bold uses **) and `code` separately.
  const tokenizer = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g
  let lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = tokenizer.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index))
    const tok = match[0]
    if (tok.startsWith('**')) {
      parts.push(<strong key={parts.length}>{tok.slice(2, -2)}</strong>)
    } else if (tok.startsWith('*')) {
      parts.push(<em key={parts.length}>{tok.slice(1, -1)}</em>)
    } else if (tok.startsWith('`')) {
      parts.push(<code key={parts.length}>{tok.slice(1, -1)}</code>)
    } else {
      const linkMatch = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(tok)
      if (linkMatch) {
        parts.push(
          <a key={parts.length} href={linkMatch[2]}>
            {linkMatch[1]}
          </a>,
        )
      } else {
        parts.push(tok)
      }
    }
    lastIndex = match.index + tok.length
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex))
  return parts
}

export function CheatsheetList({ items }: { items: Item[] }) {
  const byTrack = new Map<string, Item[]>()
  for (const item of items) {
    if (!byTrack.has(item.track)) byTrack.set(item.track, [])
    byTrack.get(item.track)!.push(item)
  }

  return (
    <main className="m-cheatsheet-list">
      <header className="m-cheatsheet-list-header">
        <h2>Cheatsheet</h2>
        <p>
          Every lesson&apos;s TL;DR, grouped by track. Press{' '}
          <kbd>Cmd</kbd>/<kbd>Ctrl</kbd>+<kbd>K</kbd> to search the whole course.
        </p>
      </header>

      {items.length === 0 && (
        <p style={{ opacity: 0.6, textAlign: 'center', padding: '2rem' }}>
          No lessons yet. As they&apos;re added, the cheatsheet fills up automatically.
        </p>
      )}

      {[...byTrack.entries()].map(([track, list]) => (
        <section key={track} className="m-cheatsheet-section">
          <h3>{TRACK_LABELS[track] ?? track}</h3>
          <div className="m-cheatsheet-cards">
            {list.map((item) => (
              <article key={item.slug} className="m-cheatsheet-card">
                <Link href={item.slug} className="m-cheatsheet-card-link">
                  {item.title} <span style={{ opacity: 0.5 }}>→</span>
                </Link>
                <div className="m-cheatsheet-card-tldr">{renderTldr(item.tldr)}</div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </main>
  )
}
