import Link from 'next/link'
import { TileCluster } from './TileCluster'

export function Hero() {
  return (
    <section className="m-hero">
      <TileCluster className="m-tile-cluster tl" seed={3} />
      <TileCluster className="m-tile-cluster br" seed={9} />

      <p className="m-hero-eyebrow">Free · Open · Current</p>

      <h1 className="m-hero-title">Mosaic</h1>

      <p className="m-hero-tagline">
        The systems behind modern AI — from the C++ memory model up to MLA, FlashAttention-3,
        and on-device inference.
      </p>

      <p className="m-hero-sub">
        Six tracks. Sixty-plus lessons. Every concept the field actually uses today, written
        like an engineer would explain it to another engineer. Real numbers, runnable code,
        nothing hand-wavy. Each lesson finishes in 15 minutes.
      </p>

      <div className="m-hero-cta-row">
        <Link href="/learning-paths" className="m-btn-primary">
          Reading orders <span aria-hidden>→</span>
        </Link>
        <Link href="#course-map" className="m-btn-secondary">
          Or the full map
        </Link>
      </div>

      <div className="m-hero-cue">
        Six tracks &nbsp;·&nbsp; Twenty modules &nbsp;·&nbsp; Sixty-plus lessons
      </div>
    </section>
  )
}
