import type { TileIllustrationProps } from './types'

/**
 * MLIR — multi-level IR visualized as a stack of dialect layers being lowered.
 */
export function Mlir({ color, size }: TileIllustrationProps) {
  const s = size * 0.55
  const stroke = 1.5
  const layerW = s * 1.4
  const layerH = s * 0.22
  const gap = s * 0.14

  const layers = [
    { y: -s * 0.7, w: layerW * 1.0 },     // Graph dialect
    { y: -s * 0.7 + layerH + gap, w: layerW * 0.8 },  // linalg
    { y: -s * 0.7 + 2 * (layerH + gap), w: layerW * 0.6 },  // affine / loops
    { y: -s * 0.7 + 3 * (layerH + gap), w: layerW * 0.4 },  // llvm
  ]

  return (
    <g stroke={color} fill="none" strokeWidth={stroke} strokeLinejoin="round" strokeLinecap="round">
      {layers.map((layer, i) => (
        <g key={i}>
          <rect x={-layer.w / 2} y={layer.y} width={layer.w} height={layerH} rx={2} strokeOpacity={i === 0 ? 1 : 0.5 + i * 0.15} />
          {/* Lowering arrow between layers (skip on the last) */}
          {i < layers.length - 1 && (
            <path
              d={`M0,${layer.y + layerH + 1} L0,${layer.y + layerH + gap - 1} M-3,${layer.y + layerH + gap - 4} L0,${layer.y + layerH + gap - 1} L3,${layer.y + layerH + gap - 4}`}
              strokeOpacity={0.7}
            />
          )}
        </g>
      ))}
    </g>
  )
}
