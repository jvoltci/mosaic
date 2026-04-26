import Link from 'next/link'

export function CtaSection() {
  return (
    <section className="m-cta-section">
      <h2>Start with the substrate.</h2>
      <p>The first track teaches the memory model that everything else builds on.</p>
      <Link href="/foundations/cpp-memory/stack-vs-heap" className="m-btn-primary">
        Open the first lesson →
      </Link>
    </section>
  )
}
