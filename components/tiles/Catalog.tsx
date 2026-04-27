import type { TileIllustrationProps } from './types'

/**
 * Module-level tile illustrations. Each module in the course owns one of
 * these glyphs; every tile in that module shares it. Style guide:
 *  - monoline 1.5-px strokes
 *  - drawn within ±size*0.45 of the (0,0) origin
 *  - single accent color via the `color` prop
 *  - readable at hex sizes from ~26px to 56px
 */

const stroke = (color: string, w = 1.5) => ({
  stroke: color,
  strokeWidth: w,
  fill: 'none',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
})

// ── foundations ─────────────────────────────────────────────
// Caches & Architecture: stacked cache lines.
export function CacheLines({ color, size }: TileIllustrationProps) {
  const w = size * 0.55
  const gap = size * 0.13
  const h = size * 0.06
  return (
    <g {...stroke(color)}>
      {[-1.5, -0.5, 0.5, 1.5].map((y, i) => (
        <rect key={i} x={-w / 2} y={y * gap - h / 2} width={w} height={h} rx={1.5} />
      ))}
    </g>
  )
}

// SIMD & Threading: parallel arrows in lockstep.
export function SimdLanes({ color, size }: TileIllustrationProps) {
  const len = size * 0.5
  const gap = size * 0.13
  return (
    <g {...stroke(color)}>
      {[-1.5, -0.5, 0.5, 1.5].map((y, i) => (
        <g key={i}>
          <line x1={-len / 2} y1={y * gap} x2={len / 2 - 4} y2={y * gap} />
          <path
            d={`M${len / 2 - 5},${y * gap - 3} L${len / 2},${y * gap} L${len / 2 - 5},${y * gap + 3}`}
          />
        </g>
      ))}
    </g>
  )
}

// ── ml-execution ────────────────────────────────────────────
// Tensors in Memory: 3×3 grid + diagonal stride path.
export function TensorStrides({ color, size }: TileIllustrationProps) {
  const gap = size * 0.18
  const r = size * 0.045
  const dots: React.ReactNode[] = []
  for (let row = -1; row <= 1; row++) {
    for (let col = -1; col <= 1; col++) {
      dots.push(
        <circle key={`${row}-${col}`} cx={col * gap} cy={row * gap} r={r} fill={color} stroke="none" />,
      )
    }
  }
  return (
    <g {...stroke(color)}>
      {dots}
      <path d={`M${-gap},${-gap} L${0},${0} L${gap},${gap}`} strokeWidth={1.7} />
    </g>
  )
}

// Quantization: 8-bit → 4-bit reduction.
export function QuantBits({ color, size }: TileIllustrationProps) {
  const w = size * 0.06
  const gap = size * 0.085
  const y0 = -size * 0.13
  const y1 = size * 0.13
  return (
    <g {...stroke(color)}>
      {[-3.5, -2.5, -1.5, -0.5, 0.5, 1.5, 2.5, 3.5].map((x, i) => (
        <rect
          key={`a-${i}`}
          x={x * gap - w / 2}
          y={y0 - w}
          width={w}
          height={w * 2}
          rx={1}
          fill={color}
          stroke="none"
          opacity={0.85}
        />
      ))}
      {[-1.5, -0.5, 0.5, 1.5].map((x, i) => (
        <rect
          key={`b-${i}`}
          x={x * gap * 1.6 - w / 2}
          y={y1 - w}
          width={w}
          height={w * 2}
          rx={1}
          fill={color}
          stroke="none"
        />
      ))}
    </g>
  )
}

// ── training ────────────────────────────────────────────────
// Optimization: descent curve with optimum.
export function GradCurve({ color, size }: TileIllustrationProps) {
  const r = size * 0.42
  return (
    <g {...stroke(color)}>
      <path d={`M${-r},${-r * 0.55} Q${-r * 0.3},${r * 0.7} ${r * 0.3},${r * 0.18} T${r},${-r * 0.4}`} />
      <circle cx={r * 0.3} cy={r * 0.18} r={3} fill={color} stroke="none" />
    </g>
  )
}

// Distributed: 4-node mesh.
export function MeshNodes({ color, size }: TileIllustrationProps) {
  const d = size * 0.27
  const r = size * 0.07
  const pts: [number, number][] = [
    [-d, -d],
    [d, -d],
    [-d, d],
    [d, d],
  ]
  const edges: [number, number][] = []
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) edges.push([i, j])
  }
  return (
    <g {...stroke(color)}>
      {edges.map(([i, j], k) => (
        <line
          key={k}
          x1={pts[i][0]}
          y1={pts[i][1]}
          x2={pts[j][0]}
          y2={pts[j][1]}
          opacity={0.55}
        />
      ))}
      {pts.map(([x, y], i) => (
        <circle key={`p-${i}`} cx={x} cy={y} r={r} fill={color} stroke="none" />
      ))}
    </g>
  )
}

// Post-training: dial with tick marks.
export function DialTune({ color, size }: TileIllustrationProps) {
  const r = size * 0.32
  const ticks = [-90, 0, 90, 180]
  return (
    <g {...stroke(color)}>
      <circle cx={0} cy={0} r={r} />
      <line x1={0} y1={0} x2={r * 0.7} y2={-r * 0.5} strokeWidth={1.8} />
      <circle cx={0} cy={0} r={2.5} fill={color} stroke="none" />
      {ticks.map((deg, i) => {
        const rad = (deg * Math.PI) / 180
        return (
          <line
            key={i}
            x1={Math.cos(rad) * r * 0.85}
            y1={Math.sin(rad) * r * 0.85}
            x2={Math.cos(rad) * r * 1.05}
            y2={Math.sin(rad) * r * 1.05}
          />
        )
      })}
    </g>
  )
}

// ── llm-architecture ────────────────────────────────────────
// Attention: causal-mask grid.
export function AttentionPattern({ color, size }: TileIllustrationProps) {
  const s = size * 0.4
  return (
    <g {...stroke(color)}>
      <rect x={-s / 2} y={-s / 2} width={s} height={s} rx={2} />
      <path d={`M${-s / 2},${-s / 2} L${s / 2},${s / 2}`} strokeWidth={1.8} />
      <line x1={-s / 2 + 4} y1={s / 2 - 4} x2={s / 2 - 4} y2={s / 2 - 4} opacity={0.45} />
      <line x1={-s / 2 + 4} y1={s / 2 - 10} x2={s / 2 - 10} y2={s / 2 - 10} opacity={0.45} />
    </g>
  )
}

// Inference-time: probability bars (sampling histogram).
export function ProbBars({ color, size }: TileIllustrationProps) {
  const w = size * 0.06
  const gap = size * 0.09
  const baseY = size * 0.22
  const heights = [0.55, 0.85, 0.45, 0.7, 0.3, 0.55, 0.25].map((h) => h * size * 0.4)
  return (
    <g {...stroke(color)}>
      {heights.map((h, i) => {
        const x = (i - (heights.length - 1) / 2) * gap
        return (
          <rect
            key={i}
            x={x - w / 2}
            y={baseY - h}
            width={w}
            height={h}
            rx={1}
            fill={color}
            stroke="none"
          />
        )
      })}
      <line x1={-size * 0.4} y1={baseY} x2={size * 0.4} y2={baseY} />
    </g>
  )
}

// ── compilers ───────────────────────────────────────────────
// Kernels: tile grid with one tile highlighted.
export function TileGrid({ color, size }: TileIllustrationProps) {
  const s = size * 0.4
  const n = 3
  const cell = s / n
  return (
    <g {...stroke(color)}>
      <rect x={-s / 2} y={-s / 2} width={s} height={s} rx={1} />
      {Array.from({ length: n - 1 }, (_, i) => (
        <line
          key={`v-${i}`}
          x1={-s / 2 + (i + 1) * cell}
          y1={-s / 2}
          x2={-s / 2 + (i + 1) * cell}
          y2={s / 2}
        />
      ))}
      {Array.from({ length: n - 1 }, (_, i) => (
        <line
          key={`h-${i}`}
          x1={-s / 2}
          y1={-s / 2 + (i + 1) * cell}
          x2={s / 2}
          y2={-s / 2 + (i + 1) * cell}
        />
      ))}
      <rect
        x={-s / 2 + cell}
        y={-s / 2}
        width={cell}
        height={cell}
        fill={color}
        stroke="none"
        opacity={0.35}
      />
    </g>
  )
}

// Production: three pipeline boxes with arrows.
export function PipelineArrows({ color, size }: TileIllustrationProps) {
  const w = size * 0.18
  const h = size * 0.18
  const gap = size * 0.07
  const xs = [-w - gap, 0, w + gap]
  return (
    <g {...stroke(color)}>
      {xs.map((x, i) => (
        <rect key={i} x={x - w / 2} y={-h / 2} width={w} height={h} rx={2} />
      ))}
      {xs.slice(0, -1).map((x, i) => (
        <g key={`a-${i}`}>
          <line x1={x + w / 2} y1={0} x2={xs[i + 1] - w / 2 - 2} y2={0} />
          <path
            d={`M${xs[i + 1] - w / 2 - 4},${-3} L${xs[i + 1] - w / 2},${0} L${xs[i + 1] - w / 2 - 4},${3}`}
          />
        </g>
      ))}
    </g>
  )
}

// ── applied ─────────────────────────────────────────────────
// LLM Basics: chat bubble.
export function ChatBubble({ color, size }: TileIllustrationProps) {
  const w = size * 0.55
  const h = size * 0.4
  const tail = size * 0.08
  return (
    <g {...stroke(color)}>
      <path
        d={`M${-w / 2 + 4},${-h / 2}
           h${w - 8}
           a4,4 0 0 1 4,4
           v${h - 8}
           a4,4 0 0 1 -4,4
           h${-w * 0.35}
           l${-tail},${tail}
           l${0},${-tail}
           h${-w * 0.65 + 8}
           a4,4 0 0 1 -4,-4
           v${-h + 8}
           a4,4 0 0 1 4,-4 z`}
      />
      <line x1={-w * 0.25} y1={-h * 0.05} x2={w * 0.25} y2={-h * 0.05} opacity={0.6} />
      <line x1={-w * 0.25} y1={h * 0.12} x2={w * 0.05} y2={h * 0.12} opacity={0.6} />
    </g>
  )
}

// RAG / Agents: bracketed vector + magnifying glass.
export function RagVector({ color, size }: TileIllustrationProps) {
  const w = size * 0.46
  return (
    <g {...stroke(color)}>
      <path d={`M${-w / 2 + 2},${-7} L${-w / 2 - 2},${-7} L${-w / 2 - 2},${7} L${-w / 2 + 2},${7}`} />
      <path d={`M${w / 2 - 4},${-7} L${w / 2},${-7} L${w / 2},${7} L${w / 2 - 4},${7}`} />
      {[-w * 0.28, -w * 0.08, w * 0.12].map((x, i) => (
        <circle key={i} cx={x} cy={0} r={2} fill={color} stroke="none" />
      ))}
      <circle cx={size * 0.18} cy={size * 0.18} r={size * 0.11} />
      <line
        x1={size * 0.26}
        y1={size * 0.26}
        x2={size * 0.34}
        y2={size * 0.34}
        strokeWidth={1.7}
      />
    </g>
  )
}

// Serve: stacked server slabs.
export function ServerStack({ color, size }: TileIllustrationProps) {
  const w = size * 0.5
  const h = size * 0.1
  const gap = size * 0.06
  return (
    <g {...stroke(color)}>
      {[-1, 0, 1].map((row, i) => (
        <g key={i}>
          <rect
            x={-w / 2}
            y={row * (h + gap) - h / 2}
            width={w}
            height={h}
            rx={2}
          />
          <circle cx={w / 2 - 5} cy={row * (h + gap)} r={1.4} fill={color} stroke="none" />
          <circle cx={w / 2 - 9} cy={row * (h + gap)} r={1.4} fill={color} stroke="none" opacity={0.6} />
        </g>
      ))}
    </g>
  )
}

// Frontier: overlapping circles for multimodal.
export function Spectrum({ color, size }: TileIllustrationProps) {
  const r = size * 0.18
  const off = size * 0.13
  return (
    <g {...stroke(color)}>
      <circle cx={-off} cy={off * 0.4} r={r} />
      <circle cx={0} cy={-off * 0.6} r={r} />
      <circle cx={off} cy={off * 0.4} r={r} />
    </g>
  )
}

// ── edge-ai ─────────────────────────────────────────────────
// On-Device: phone outline.
export function Phone({ color, size }: TileIllustrationProps) {
  const w = size * 0.32
  const h = size * 0.5
  return (
    <g {...stroke(color)}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={4} />
      <line x1={-w * 0.18} y1={-h / 2 + 4} x2={w * 0.18} y2={-h / 2 + 4} opacity={0.7} />
      <circle cx={0} cy={h / 2 - 4} r={1.5} fill={color} stroke="none" />
    </g>
  )
}

// Browser: window with traffic lights.
export function Window({ color, size }: TileIllustrationProps) {
  const w = size * 0.55
  const h = size * 0.4
  return (
    <g {...stroke(color)}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={2} />
      <line x1={-w / 2} y1={-h / 2 + 6} x2={w / 2} y2={-h / 2 + 6} />
      <circle cx={-w / 2 + 5} cy={-h / 2 + 3} r={1.4} fill={color} stroke="none" />
      <circle cx={-w / 2 + 9} cy={-h / 2 + 3} r={1.4} fill={color} stroke="none" opacity={0.6} />
      <circle cx={-w / 2 + 13} cy={-h / 2 + 3} r={1.4} fill={color} stroke="none" opacity={0.4} />
    </g>
  )
}

// Multimodal: camera + mic side by side.
export function CamMic({ color, size }: TileIllustrationProps) {
  return (
    <g {...stroke(color)}>
      {/* camera body */}
      <rect
        x={-size * 0.4}
        y={-size * 0.16}
        width={size * 0.32}
        height={size * 0.32}
        rx={3}
      />
      <circle cx={-size * 0.24} cy={0} r={size * 0.085} />
      {/* mic */}
      <rect
        x={size * 0.13}
        y={-size * 0.25}
        width={size * 0.14}
        height={size * 0.28}
        rx={size * 0.07}
      />
      <path d={`M${size * 0.08},${size * 0.05} a${size * 0.12},${size * 0.12} 0 0 0 ${size * 0.24},0`} />
      <line x1={size * 0.2} y1={size * 0.17} x2={size * 0.2} y2={size * 0.27} />
    </g>
  )
}

// Distributed Edge: triangle of nodes around a swarm core.
export function LanMesh({ color, size }: TileIllustrationProps) {
  const r = size * 0.06
  const pts: [number, number][] = [
    [-size * 0.3, size * 0.2],
    [size * 0.3, size * 0.2],
    [0, -size * 0.28],
  ]
  return (
    <g {...stroke(color)}>
      {pts.map(([x, y], i) => {
        const next = pts[(i + 1) % pts.length]
        return <line key={`e-${i}`} x1={x} y1={y} x2={next[0]} y2={next[1]} opacity={0.5} />
      })}
      <circle cx={0} cy={0} r={r * 1.4} />
      {pts.map(([x, y], i) => (
        <circle key={`p-${i}`} cx={x} cy={y} r={r} fill={color} stroke="none" />
      ))}
    </g>
  )
}

// NPU: chip with pins + central die.
export function ChipNpu({ color, size }: TileIllustrationProps) {
  const s = size * 0.36
  const pins = [-1, 0, 1]
  return (
    <g {...stroke(color)}>
      <rect x={-s / 2} y={-s / 2} width={s} height={s} rx={2} />
      <rect x={-s * 0.28} y={-s * 0.28} width={s * 0.56} height={s * 0.56} rx={1} />
      {pins.map((i, k) => {
        const off = i * s * 0.32
        return (
          <g key={k}>
            <line x1={-s / 2 - 3} y1={off} x2={-s / 2} y2={off} />
            <line x1={s / 2} y1={off} x2={s / 2 + 3} y2={off} />
            <line x1={off} y1={-s / 2 - 3} x2={off} y2={-s / 2} />
            <line x1={off} y1={s / 2} x2={off} y2={s / 2 + 3} />
          </g>
        )
      })}
    </g>
  )
}

// Edge Quantization: sparse-bit pattern.
export function GgufBytes({ color, size }: TileIllustrationProps) {
  const w = size * 0.07
  const gap = size * 0.1
  const grid = [
    [1, 0, 1, 0],
    [0, 1, 1, 0],
    [1, 1, 0, 1],
    [0, 1, 0, 1],
  ]
  return (
    <g {...stroke(color)}>
      {grid.flatMap((row, ri) =>
        row.map((on, ci) => (
          <rect
            key={`${ri}-${ci}`}
            x={(ci - 1.5) * gap - w / 2}
            y={(ri - 1.5) * gap - w / 2}
            width={w}
            height={w}
            rx={1}
            fill={on ? color : 'none'}
            stroke={color}
          />
        )),
      )}
    </g>
  )
}

// Distillation: big box → arrow → small box.
export function BigToSmall({ color, size }: TileIllustrationProps) {
  return (
    <g {...stroke(color)}>
      <rect
        x={-size * 0.35}
        y={-size * 0.16}
        width={size * 0.3}
        height={size * 0.32}
        rx={2}
      />
      <line
        x1={size * 0.0}
        y1={0}
        x2={size * 0.13}
        y2={0}
        strokeWidth={1.7}
      />
      <path d={`M${size * 0.1},${-3} L${size * 0.13},${0} L${size * 0.1},${3}`} />
      <rect
        x={size * 0.18}
        y={-size * 0.08}
        width={size * 0.16}
        height={size * 0.16}
        rx={1}
      />
    </g>
  )
}
