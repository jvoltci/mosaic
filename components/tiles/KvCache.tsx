import type { TileIllustrationProps } from './types'

/**
 * KV cache — a ring buffer with token slots filling clockwise.
 */
export function KvCache({ color, size }: TileIllustrationProps) {
  const s = size * 0.55
  const stroke = 1.5
  const r = s * 0.78
  const slots = 12
  const filledThrough = 7 // first 7 slots filled

  const slotMarks: React.ReactElement[] = []
  for (let i = 0; i < slots; i++) {
    const a0 = -Math.PI / 2 + (2 * Math.PI * i) / slots
    const a1 = -Math.PI / 2 + (2 * Math.PI * (i + 1)) / slots - 0.04
    const x0 = r * Math.cos(a0)
    const y0 = r * Math.sin(a0)
    const x1 = r * Math.cos(a1)
    const y1 = r * Math.sin(a1)
    const filled = i < filledThrough
    slotMarks.push(
      <path
        key={i}
        d={`M${x0},${y0} A${r},${r} 0 0,1 ${x1},${y1}`}
        strokeWidth={filled ? stroke * 1.7 : stroke}
        strokeOpacity={filled ? 1 : 0.35}
      />,
    )
  }

  // Inflow arrow at top
  const arrowAngle = -Math.PI / 2
  const ax = r * Math.cos(arrowAngle)
  const ay = r * Math.sin(arrowAngle)

  return (
    <g stroke={color} fill="none" strokeWidth={stroke} strokeLinejoin="round" strokeLinecap="round">
      {slotMarks}
      {/* Inflow arrow */}
      <path d={`M${ax},${ay - s * 0.32} L${ax},${ay - s * 0.08}`} />
      <path d={`M${ax - 4},${ay - s * 0.14} L${ax},${ay - s * 0.08} L${ax + 4},${ay - s * 0.14}`} />
      {/* Center dot */}
      <circle cx={0} cy={0} r={2} fill={color} stroke="none" />
    </g>
  )
}
