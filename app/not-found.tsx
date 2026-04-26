import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="m-mosaic-map" style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <h1 style={{ fontFamily: 'var(--font-display), Georgia, serif', fontSize: 'clamp(3rem, 8vw, 5rem)', fontWeight: 600, letterSpacing: '-0.03em', margin: '0 0 0.5rem', color: 'var(--m-fg)' }}>
        404
      </h1>
      <p style={{ fontFamily: 'var(--font-serif), Georgia, serif', fontSize: '1.15rem', color: 'var(--m-fg-muted)', margin: '0 0 2rem', maxWidth: '28rem' }}>
        This tile doesn&apos;t exist yet. Maybe it&apos;s coming soon — check the map.
      </p>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/" className="m-btn-primary">
          ← Home
        </Link>
        <Link href="/map" className="m-btn-secondary">
          Course Map
        </Link>
      </div>
    </div>
  )
}
