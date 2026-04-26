const PILLARS = [
  {
    label: 'Free, forever',
    body: 'Built openly on GitHub. No signup, no paywall, no email gate. Edit any lesson and send a PR.',
  },
  {
    label: 'Modular by design',
    body: 'Tracks → modules → 10–15 minute lessons. Finish each piece in one sitting. Progress saves locally.',
  },
  {
    label: 'Built for revision',
    body: 'Every lesson has a TL;DR pinned at the top. The cheatsheet aggregates them all for fast re-skimming.',
  },
  {
    label: 'Current to the field',
    body: 'Blackwell, DeepSeek-V3, vLLM v1, MLA, FP8. Re-validated quarterly. Each lesson stamps its last review date.',
  },
]

export function Pillars() {
  return (
    <section className="m-pillars">
      <div className="m-pillars-inner">
        {PILLARS.map((p, i) => (
          <div key={p.label} className="m-pillar">
            <span className="m-pillar-num">{String(i + 1).padStart(2, '0')}</span>
            <h3>{p.label}</h3>
            <p>{p.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
