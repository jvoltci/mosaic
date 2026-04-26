type Props = { className?: string; seed?: number }

const PALETTE = ['#e07a5f', '#f2cc8f', '#81b29a', '#5b8acc', '#b86fa5', '#f5f3ee']

function rng(seed: number) {
  let s = seed || 1
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

export function TileCluster({ className, seed = 1 }: Props) {
  const r = rng(seed)
  const tiles = []

  const cellW = 40
  const cellH = 69
  const cols = 6
  const rows = 4

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (r() > 0.55) continue
      const cx = col * cellW + (row % 2 ? cellW / 2 : 0)
      const cy = row * cellH * 0.5 + cellH / 2
      const opacity = 0.15 + r() * 0.55
      const color = PALETTE[Math.floor(r() * PALETTE.length)]
      const size = 18 + r() * 8
      tiles.push(
        <polygon
          key={`${row}-${col}`}
          points={hexPoints(cx, cy, size)}
          fill={color}
          opacity={opacity}
        />,
      )
    }
  }

  return (
    <svg className={className} viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      {tiles}
    </svg>
  )
}

function hexPoints(cx: number, cy: number, r: number) {
  const pts: string[] = []
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i + Math.PI / 6
    const x = cx + r * Math.cos(angle)
    const y = cy + r * Math.sin(angle)
    pts.push(`${x.toFixed(2)},${y.toFixed(2)}`)
  }
  return pts.join(' ')
}
