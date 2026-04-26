import type { TileIllustrationProps } from './types'

/**
 * Rotary positional embedding — a vector rotating in the complex plane.
 * Original axes (faint) + rotated axes (bold) + an arc showing the rotation angle.
 */
export function Rope({ color, size }: TileIllustrationProps) {
  const s = size * 0.55
  const stroke = 1.5
  const r = s * 0.85
  const angle = -Math.PI / 5 // ~36°

  // Rotated axes endpoints
  const rxEnd = { x: r * Math.cos(angle), y: r * Math.sin(angle) }
  const ryEnd = { x: r * Math.cos(angle + Math.PI / 2), y: r * Math.sin(angle + Math.PI / 2) }

  return (
    <g stroke={color} fill="none" strokeWidth={stroke} strokeLinejoin="round" strokeLinecap="round">
      {/* Faint reference circle */}
      <circle cx={0} cy={0} r={r} strokeOpacity={0.18} />

      {/* Original axes (faint) */}
      <line x1={-r} y1={0} x2={r} y2={0} strokeOpacity={0.3} strokeDasharray="2 2" />
      <line x1={0} y1={-r} x2={0} y2={r} strokeOpacity={0.3} strokeDasharray="2 2" />

      {/* Rotated x-axis (the vector) */}
      <line x1={0} y1={0} x2={rxEnd.x} y2={rxEnd.y} strokeWidth={stroke * 1.4} />
      <path
        d={`M${rxEnd.x - 5 * Math.cos(angle - Math.PI / 6)},${rxEnd.y - 5 * Math.sin(angle - Math.PI / 6)} L${rxEnd.x},${rxEnd.y} L${rxEnd.x - 5 * Math.cos(angle + Math.PI / 6)},${rxEnd.y - 5 * Math.sin(angle + Math.PI / 6)}`}
        strokeWidth={stroke * 1.4}
      />

      {/* Rotated y-axis (lighter) */}
      <line x1={0} y1={0} x2={ryEnd.x} y2={ryEnd.y} strokeOpacity={0.55} />

      {/* Arc showing rotation angle θ */}
      <path
        d={`M${r * 0.4},0 A${r * 0.4},${r * 0.4} 0 0,${angle < 0 ? 0 : 1} ${r * 0.4 * Math.cos(angle)},${r * 0.4 * Math.sin(angle)}`}
        strokeOpacity={0.7}
      />

      {/* Origin dot */}
      <circle cx={0} cy={0} r={1.8} fill={color} stroke="none" />
    </g>
  )
}
