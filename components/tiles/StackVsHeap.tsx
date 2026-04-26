import type { TileIllustrationProps } from './types'

export function StackVsHeap({ color, size }: TileIllustrationProps) {
  const s = size * 0.55
  const stroke = 1.5
  return (
    <g stroke={color} fill="none" strokeWidth={stroke} strokeLinejoin="round" strokeLinecap="round">
      {/* Stack — neatly stacked frames on the left */}
      <rect x={-s * 0.85} y={-s * 0.6} width={s * 0.7} height={s * 0.18} rx={1} />
      <rect x={-s * 0.85} y={-s * 0.36} width={s * 0.7} height={s * 0.18} rx={1} />
      <rect x={-s * 0.85} y={-s * 0.12} width={s * 0.7} height={s * 0.18} rx={1} />
      <rect x={-s * 0.85} y={s * 0.12} width={s * 0.7} height={s * 0.18} rx={1} />
      {/* SP arrow pointing down at top of stack */}
      <path d={`M${-s * 0.5},${-s * 0.95} L${-s * 0.5},${-s * 0.7} M${-s * 0.62},${-s * 0.78} L${-s * 0.5},${-s * 0.7} L${-s * 0.38},${-s * 0.78}`} />
      {/* Heap — scattered free chunks on the right */}
      <rect x={s * 0.18} y={-s * 0.6} width={s * 0.34} height={s * 0.22} rx={1} />
      <rect x={s * 0.6} y={-s * 0.4} width={s * 0.22} height={s * 0.32} rx={1} />
      <rect x={s * 0.18} y={-s * 0.05} width={s * 0.42} height={s * 0.18} rx={1} />
      <rect x={s * 0.18} y={s * 0.28} width={s * 0.28} height={s * 0.24} rx={1} />
      <rect x={s * 0.55} y={s * 0.32} width={s * 0.27} height={s * 0.2} rx={1} />
    </g>
  )
}
