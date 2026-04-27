import {
  KIND_LABEL,
  LAST_SWEEP,
  READS,
  SECTION_INTROS,
  SECTION_ORDER,
  SECTION_TITLES,
  type ReadEntry,
  type ReadSection,
} from '../lib/reads'

export function ReadsList() {
  const bySection = new Map<ReadSection, ReadEntry[]>()
  for (const entry of READS) {
    if (!bySection.has(entry.section)) bySection.set(entry.section, [])
    bySection.get(entry.section)!.push(entry)
  }

  return (
    <main className="m-reads">
      <header className="m-reads-header">
        <h2>Reads</h2>
        <p>
          A hand-curated reading list — the long-form writing on AI, AGI, and
          the broader tech moment that has actually shaped how the field thinks.
          Not a course, not in any order. Pick a section, pick an entry, read
          for an evening.
        </p>
        <p className="m-reads-sweep">Last sweep · {LAST_SWEEP}</p>
      </header>

      {SECTION_ORDER.map((sectionKey) => {
        const items = bySection.get(sectionKey) ?? []
        if (items.length === 0) return null
        return (
          <section key={sectionKey} className="m-reads-section">
            <h3>{SECTION_TITLES[sectionKey]}</h3>
            <p className="m-reads-section-intro">
              {SECTION_INTROS[sectionKey]}
            </p>
            <ul className="m-reads-list">
              {items.map((entry) => (
                <li key={entry.href} className="m-reads-entry">
                  <span className="m-reads-tag">{KIND_LABEL[entry.kind]}</span>
                  <span className="m-reads-body">
                    <a
                      href={entry.href}
                      target="_blank"
                      rel="noreferrer"
                      className="m-reads-link"
                    >
                      {entry.title}
                    </a>
                    <span className="m-reads-meta">
                      {entry.author} · {entry.year}
                    </span>
                    <span className="m-reads-note">{entry.note}</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </main>
  )
}
