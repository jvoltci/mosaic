import Link from 'next/link'
import { TileCluster } from './TileCluster'

export function Hero() {
  return (
    <section className="m-hero">
      <TileCluster className="m-tile-cluster tl" seed={3} />
      <TileCluster className="m-tile-cluster br" seed={9} />

      <p className="m-hero-eyebrow">A free course · Built in public · Forever</p>

      <h1 className="m-hero-title">Mosaic</h1>

      <p className="m-hero-tagline">
        Learn the systems behind modern&nbsp;AI&nbsp;— and&nbsp;build cutting-edge things you can run on your phone.
      </p>

      <p className="m-hero-sub">
        Six tracks. Sixty-plus lessons. From the C++ memory model up to MLIR, FlashAttention-3, GRPO,
        and on-device inference. Every lesson is finishable in 15&nbsp;minutes — and most have
        a runnable demo right in your browser, on whatever device you&apos;re holding.
      </p>

      <div className="m-hero-cta-row">
        <Link href="/foundations/cpp-memory/stack-vs-heap" className="m-btn-primary">
          Start Lesson 1 <span aria-hidden>→</span>
        </Link>
        <Link href="#course-map" className="m-btn-secondary">
          See the course map
        </Link>
      </div>

      <div className="m-hero-cue">
        Six tracks &nbsp;·&nbsp; Twenty modules &nbsp;·&nbsp; Sixty-plus lessons
      </div>
    </section>
  )
}
