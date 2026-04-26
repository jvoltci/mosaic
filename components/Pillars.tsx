const PILLARS = [
  {
    label: 'Free, forever',
    body: "Built openly, no signup, no paywall, no email gate. Edit any lesson on GitHub and send a PR.",
  },
  {
    label: 'Modular by design',
    body: 'Tracks → modules → ~10–15 min lessons. Finish each piece in one sitting. Progress saves locally.',
  },
  {
    label: 'Built for revision',
    body: 'Every lesson has a TL;DR pinned at the top. The Cheatsheet aggregates them all for fast re-skimming.',
  },
  {
    label: 'From silicon to model',
    body: 'Memory model → GPU programming → Transformers → MLIR → Applied. The stack, in order, with no gaps.',
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
