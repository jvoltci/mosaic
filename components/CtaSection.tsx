import Link from 'next/link'

export function CtaSection() {
  return (
    <section className="m-cta-section">
      <h2>Open a lesson.</h2>
      <p>The first track teaches the memory model that everything else builds on. Or jump anywhere — the lessons stand alone.</p>
      <Link href="/foundations/cpp-memory/stack-vs-heap" className="m-btn-primary">
        Stack vs Heap →
      </Link>
    </section>
  )
}
