type Props = {
  track: 'foundations' | 'ml-execution' | 'training' | 'llm-architecture' | 'compilers' | 'applied'
  icon: string
  eyebrow: string
  title: string
  subtitle: string
}

const ACCENT: Record<Props['track'], string> = {
  foundations: 'var(--m-track-foundations)',
  'ml-execution': 'var(--m-track-execution)',
  training: 'var(--m-track-training)',
  'llm-architecture': 'var(--m-track-architecture)',
  compilers: 'var(--m-track-compilers)',
  applied: 'var(--m-track-applied)',
}

export function TrackBanner({ track, icon, eyebrow, title, subtitle }: Props) {
  return (
    <div className="m-track-banner" style={{ ['--accent' as string]: ACCENT[track] }}>
      <p className="m-track-banner-eyebrow">
        <span className="m-track-banner-num" aria-hidden>{icon}</span>
        {eyebrow}
      </p>
      <h1 className="m-track-banner-title">{title}</h1>
      <p className="m-track-banner-subtitle">{subtitle}</p>
    </div>
  )
}
