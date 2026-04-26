import type { TileIllustrationProps } from './types'

/**
 * Placeholder for lessons that don't have a custom illustration yet.
 * Three quiet dots — universally "more to come".
 */
export function Placeholder({ color, size }: TileIllustrationProps) {
  const r = size * 0.07
  const dx = size * 0.22
  return (
    <g fill={color} stroke="none">
      <circle cx={-dx} cy={0} r={r} opacity={0.45} />
      <circle cx={0} cy={0} r={r} opacity={0.65} />
      <circle cx={dx} cy={0} r={r} opacity={0.45} />
    </g>
  )
}
