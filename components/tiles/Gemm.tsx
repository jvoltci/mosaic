import type { TileIllustrationProps } from './types'

/**
 * Three matrices side by side: A × B = C, with grid lines suggesting cache blocking.
 */
export function Gemm({ color, size }: TileIllustrationProps) {
  const s = size * 0.55
  const stroke = 1.5
  const matW = s * 0.45
  const matH = s * 0.7
  const gap = s * 0.18
  const totalW = matW * 3 + gap * 2
  const startX = -totalW / 2

  return (
    <g stroke={color} fill="none" strokeWidth={stroke} strokeLinejoin="round" strokeLinecap="round">
      {/* Matrix A */}
      <rect x={startX} y={-matH / 2} width={matW} height={matH} />
      <line x1={startX + matW / 2} y1={-matH / 2} x2={startX + matW / 2} y2={matH / 2} strokeOpacity={0.4} />
      <line x1={startX} y1={0} x2={startX + matW} y2={0} strokeOpacity={0.4} />
      {/* × */}
      <text x={startX + matW + gap / 2} y={5} textAnchor="middle" fontFamily="serif" fontSize={s * 0.32} fill={color} stroke="none" opacity={0.6}>
        ×
      </text>
      {/* Matrix B */}
      <rect x={startX + matW + gap} y={-matH / 2} width={matW} height={matH} />
      <line x1={startX + matW + gap + matW / 2} y1={-matH / 2} x2={startX + matW + gap + matW / 2} y2={matH / 2} strokeOpacity={0.4} />
      <line x1={startX + matW + gap} y1={0} x2={startX + 2 * matW + gap} y2={0} strokeOpacity={0.4} />
      {/* = */}
      <text x={startX + 2 * matW + gap + gap / 2} y={5} textAnchor="middle" fontFamily="serif" fontSize={s * 0.32} fill={color} stroke="none" opacity={0.6}>
        =
      </text>
      {/* Matrix C — highlighted block in upper-left to suggest cache blocking */}
      <rect x={startX + 2 * (matW + gap)} y={-matH / 2} width={matW} height={matH} />
      <rect x={startX + 2 * (matW + gap)} y={-matH / 2} width={matW / 2} height={matH / 2} strokeWidth={stroke * 1.4} />
    </g>
  )
}
