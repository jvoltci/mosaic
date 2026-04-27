import type { TileIllustrationProps } from './types'

/**
 * Per-lesson tile illustrations. One unique glyph per lesson, depicting
 * what the lesson actually teaches. Style:
 *  - monoline 1.5-px strokes
 *  - drawn within ±size*0.45 of (0,0)
 *  - single accent color via `color` prop
 *  - readable from ~26-px hex up
 */

const S = (color: string, w = 1.5) => ({
  stroke: color,
  strokeWidth: w,
  fill: 'none' as const,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
})

// ════════════ FOUNDATIONS / cpp-memory ════════════

export function MoveSemantics({ color, size }: TileIllustrationProps) {
  // Two boxes — left empty (moved-from), right filled, with arrow
  const w = size * 0.22
  return (
    <g {...S(color)}>
      <rect x={-size * 0.4} y={-w / 2} width={w} height={w} rx={2} strokeDasharray="2 2" opacity={0.45} />
      <line x1={-size * 0.16} y1={0} x2={size * 0.05} y2={0} />
      <path d={`M${size * 0.02},${-3} L${size * 0.05},0 L${size * 0.02},${3}`} />
      <rect x={size * 0.07} y={-w / 2} width={w} height={w} rx={2} fill={color} stroke="none" opacity={0.18} />
      <rect x={size * 0.07} y={-w / 2} width={w} height={w} rx={2} />
    </g>
  )
}

export function SmartPointers({ color, size }: TileIllustrationProps) {
  // Pointer arrow + ref-count badge
  return (
    <g {...S(color)}>
      <circle cx={-size * 0.25} cy={0} r={size * 0.07} fill={color} stroke="none" />
      <line x1={-size * 0.18} y1={0} x2={size * 0.1} y2={0} />
      <path d={`M${size * 0.07},${-3} L${size * 0.1},0 L${size * 0.07},${3}`} />
      <rect x={size * 0.13} y={-size * 0.14} width={size * 0.28} height={size * 0.28} rx={3} />
      {/* ref-count "3" suggested by 3 dots */}
      <circle cx={-size * 0.25} cy={-size * 0.22} r={1.4} fill={color} stroke="none" />
      <circle cx={-size * 0.25} cy={size * 0.22} r={1.4} fill={color} stroke="none" />
    </g>
  )
}

export function CustomAllocators({ color, size }: TileIllustrationProps) {
  // Arena split into 4 slots, 2 filled
  const w = size * 0.55
  const h = size * 0.18
  const slot = w / 4
  return (
    <g {...S(color)}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={2} />
      {[1, 2, 3].map((i) => (
        <line key={i} x1={-w / 2 + i * slot} y1={-h / 2} x2={-w / 2 + i * slot} y2={h / 2} />
      ))}
      <rect x={-w / 2} y={-h / 2} width={slot} height={h} fill={color} stroke="none" opacity={0.5} />
      <rect x={-w / 2 + slot} y={-h / 2} width={slot} height={h} fill={color} stroke="none" opacity={0.3} />
      {/* arena label as bracket below */}
      <path d={`M${-w / 2},${h / 2 + 3} l0,4 l${w},0 l0,-4`} opacity={0.6} />
    </g>
  )
}

// ════════════ FOUNDATIONS / caches-and-architecture ════════════

export function CacheLines({ color, size }: TileIllustrationProps) {
  const w = size * 0.55
  const gap = size * 0.13
  const h = size * 0.05
  return (
    <g {...S(color)}>
      {[-1.5, -0.5, 0.5, 1.5].map((y, i) => (
        <rect key={i} x={-w / 2} y={y * gap - h / 2} width={w} height={h} rx={1.5} />
      ))}
    </g>
  )
}

export function BranchPrediction({ color, size }: TileIllustrationProps) {
  // Path forking
  return (
    <g {...S(color)}>
      <line x1={-size * 0.4} y1={0} x2={-size * 0.05} y2={0} />
      <line x1={-size * 0.05} y1={0} x2={size * 0.35} y2={-size * 0.22} />
      <line x1={-size * 0.05} y1={0} x2={size * 0.35} y2={size * 0.22} strokeDasharray="3 3" opacity={0.55} />
      <circle cx={-size * 0.05} cy={0} r={2.5} fill={color} stroke="none" />
      {/* prediction marker on top branch */}
      <path d={`M${size * 0.32},${-size * 0.25} L${size * 0.36},${-size * 0.21} L${size * 0.4},${-size * 0.27}`} strokeWidth={1.7} />
    </g>
  )
}

export function NumaTopology({ color, size }: TileIllustrationProps) {
  // 2 nodes connected, plus 2 GPUs hanging off each
  const r = size * 0.07
  return (
    <g {...S(color)}>
      {/* CPU nodes */}
      <rect x={-size * 0.4} y={-size * 0.06} width={size * 0.18} height={size * 0.12} rx={2} />
      <rect x={size * 0.22} y={-size * 0.06} width={size * 0.18} height={size * 0.12} rx={2} />
      <line x1={-size * 0.22} y1={0} x2={size * 0.22} y2={0} strokeWidth={1.7} />
      {/* GPU dots */}
      <circle cx={-size * 0.31} cy={size * 0.27} r={r} />
      <line x1={-size * 0.31} y1={size * 0.06} x2={-size * 0.31} y2={size * 0.2} opacity={0.55} />
      <circle cx={size * 0.31} cy={size * 0.27} r={r} />
      <line x1={size * 0.31} y1={size * 0.06} x2={size * 0.31} y2={size * 0.2} opacity={0.55} />
    </g>
  )
}

export function Profiling({ color, size }: TileIllustrationProps) {
  // Flame-graph style stacked rects
  const w = size * 0.5
  const h = size * 0.07
  const baseY = size * 0.22
  return (
    <g {...S(color)}>
      <rect x={-w / 2} y={baseY - h} width={w} height={h} rx={1} fill={color} stroke="none" opacity={0.7} />
      <rect x={-w / 2 + w * 0.15} y={baseY - 2 * h} width={w * 0.7} height={h} rx={1} fill={color} stroke="none" opacity={0.55} />
      <rect x={-w / 2 + w * 0.3} y={baseY - 3 * h} width={w * 0.45} height={h} rx={1} fill={color} stroke="none" opacity={0.4} />
      <rect x={-w / 2 + w * 0.42} y={baseY - 4 * h} width={w * 0.2} height={h} rx={1} fill={color} stroke="none" opacity={0.3} />
    </g>
  )
}

// ════════════ FOUNDATIONS / parallelism ════════════

export function Threading({ color, size }: TileIllustrationProps) {
  return (
    <g {...S(color)}>
      {[-1.5, -0.5, 0.5, 1.5].map((y, i) => (
        <line key={i} x1={-size * 0.32} y1={y * size * 0.13} x2={size * 0.32} y2={y * size * 0.13} />
      ))}
      {/* thread heads */}
      {[-1.5, -0.5, 0.5, 1.5].map((y, i) => (
        <circle key={`h-${i}`} cx={size * (0.28 - i * 0.07)} cy={y * size * 0.13} r={2} fill={color} stroke="none" />
      ))}
    </g>
  )
}

export function Async({ color, size }: TileIllustrationProps) {
  // Yield/resume curve
  return (
    <g {...S(color)}>
      <path d={`M${-size * 0.4},${-size * 0.15}
                Q${-size * 0.1},${-size * 0.4} ${0},${0}
                Q${size * 0.1},${size * 0.4} ${size * 0.4},${size * 0.15}`}
            strokeWidth={1.7} />
      <circle cx={-size * 0.4} cy={-size * 0.15} r={2.5} fill={color} stroke="none" />
      <circle cx={0} cy={0} r={2.5} fill={color} stroke="none" />
      <circle cx={size * 0.4} cy={size * 0.15} r={2.5} fill={color} stroke="none" />
    </g>
  )
}

export function Simd({ color, size }: TileIllustrationProps) {
  // 8 lanes in a single SIMD register
  const w = size * 0.6
  const h = size * 0.16
  const cell = w / 8
  return (
    <g {...S(color)}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={2} />
      {[1, 2, 3, 4, 5, 6, 7].map((i) => (
        <line key={i} x1={-w / 2 + i * cell} y1={-h / 2} x2={-w / 2 + i * cell} y2={h / 2} opacity={0.6} />
      ))}
      {/* parallel down-arrows above */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const x = -w / 2 + (i + 0.5) * cell
        return (
          <g key={`a-${i}`} opacity={0.55}>
            <line x1={x} y1={-h / 2 - 4} x2={x} y2={-h / 2 - 1} />
          </g>
        )
      })}
    </g>
  )
}

// ════════════ ML-EXECUTION / gpu-fundamentals ════════════

export function SmArchitecture({ color, size }: TileIllustrationProps) {
  // SM block with warp dots inside
  const s = size * 0.38
  return (
    <g {...S(color)}>
      <rect x={-s / 2} y={-s / 2} width={s} height={s} rx={3} />
      {[-1, 0, 1].map((row) =>
        [-1, 0, 1].map((col) => (
          <circle
            key={`${row}-${col}`}
            cx={col * s * 0.27}
            cy={row * s * 0.27}
            r={size * 0.025}
            fill={color}
            stroke="none"
          />
        )),
      )}
    </g>
  )
}

export function ThreadHierarchy({ color, size }: TileIllustrationProps) {
  // Nested boxes: grid > block > thread
  return (
    <g {...S(color)}>
      <rect x={-size * 0.4} y={-size * 0.32} width={size * 0.8} height={size * 0.64} rx={3} />
      <rect x={-size * 0.22} y={-size * 0.18} width={size * 0.44} height={size * 0.36} rx={2} />
      <rect x={-size * 0.05} y={-size * 0.05} width={size * 0.1} height={size * 0.1} rx={1} fill={color} stroke="none" />
    </g>
  )
}

export function SharedMemory({ color, size }: TileIllustrationProps) {
  // Box with memory cells
  const w = size * 0.6
  const h = size * 0.22
  return (
    <g {...S(color)}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={2} />
      {[1, 2, 3, 4, 5].map((i) => (
        <line key={i} x1={-w / 2 + (i * w) / 6} y1={-h / 2} x2={-w / 2 + (i * w) / 6} y2={h / 2} opacity={0.5} />
      ))}
      {/* read/write arrows above and below */}
      <line x1={-size * 0.15} y1={-h / 2 - 6} x2={-size * 0.15} y2={-h / 2 - 1} />
      <line x1={size * 0.15} y1={h / 2 + 1} x2={size * 0.15} y2={h / 2 + 6} />
    </g>
  )
}

// ════════════ ML-EXECUTION / tensors-in-memory ════════════

export function StridesAndLayout({ color, size }: TileIllustrationProps) {
  const gap = size * 0.18
  const r = size * 0.04
  const dots: React.ReactNode[] = []
  for (let row = -1; row <= 1; row++) {
    for (let col = -1; col <= 1; col++) {
      dots.push(
        <circle key={`${row}-${col}`} cx={col * gap} cy={row * gap} r={r} fill={color} stroke="none" />,
      )
    }
  }
  return (
    <g {...S(color)}>
      {dots}
      <path d={`M${-gap},${-gap} L${0},${0} L${gap},${gap}`} strokeWidth={1.7} />
    </g>
  )
}

export function ContiguousVsNon({ color, size }: TileIllustrationProps) {
  // Top row: contiguous packed; bottom row: scattered
  const cellW = size * 0.07
  const gap = size * 0.085
  return (
    <g {...S(color)}>
      {/* contiguous (top) */}
      {[-3, -2, -1, 0, 1, 2, 3].map((i) => (
        <rect
          key={`t-${i}`}
          x={i * gap - cellW / 2}
          y={-size * 0.18 - cellW / 2}
          width={cellW}
          height={cellW}
          rx={1}
          fill={color}
          stroke="none"
          opacity={0.85}
        />
      ))}
      {/* scattered (bottom) */}
      {[-3, -1, 1, 3].map((i) => (
        <rect
          key={`b-${i}`}
          x={i * gap - cellW / 2}
          y={size * 0.13 - cellW / 2}
          width={cellW}
          height={cellW}
          rx={1}
          fill={color}
          stroke="none"
          opacity={0.85}
        />
      ))}
    </g>
  )
}

export function TensorLibrary({ color, size }: TileIllustrationProps) {
  // 3D box (like a tensor)
  return (
    <g {...S(color)}>
      <rect x={-size * 0.3} y={-size * 0.18} width={size * 0.4} height={size * 0.4} />
      <line x1={-size * 0.3} y1={-size * 0.18} x2={-size * 0.18} y2={-size * 0.3} />
      <line x1={size * 0.1} y1={-size * 0.18} x2={size * 0.22} y2={-size * 0.3} />
      <line x1={size * 0.1} y1={size * 0.22} x2={size * 0.22} y2={size * 0.1} />
      <line x1={-size * 0.18} y1={-size * 0.3} x2={size * 0.22} y2={-size * 0.3} />
      <line x1={size * 0.22} y1={-size * 0.3} x2={size * 0.22} y2={size * 0.1} />
    </g>
  )
}

export function TmaAsyncCopy({ color, size }: TileIllustrationProps) {
  // Two parallel arrows representing async producer/consumer
  return (
    <g {...S(color)}>
      <rect x={-size * 0.4} y={-size * 0.28} width={size * 0.18} height={size * 0.18} rx={2} />
      <rect x={size * 0.22} y={-size * 0.28} width={size * 0.18} height={size * 0.18} rx={2} />
      <rect x={-size * 0.4} y={size * 0.1} width={size * 0.18} height={size * 0.18} rx={2} />
      <rect x={size * 0.22} y={size * 0.1} width={size * 0.18} height={size * 0.18} rx={2} />
      <line x1={-size * 0.22} y1={-size * 0.19} x2={size * 0.22} y2={-size * 0.19} />
      <path d={`M${size * 0.18},${-size * 0.22} L${size * 0.22},${-size * 0.19} L${size * 0.18},${-size * 0.16}`} />
      <line x1={size * 0.22} y1={size * 0.19} x2={-size * 0.22} y2={size * 0.19} strokeDasharray="3 3" opacity={0.55} />
    </g>
  )
}

// ════════════ ML-EXECUTION / quantization ════════════

export function Fp8Overview({ color, size }: TileIllustrationProps) {
  // FP8 bit pattern: 1 sign + 4 exp + 3 mantissa
  const cellW = size * 0.07
  const gap = size * 0.08
  return (
    <g {...S(color)}>
      {[-3.5, -2.5, -1.5, -0.5, 0.5, 1.5, 2.5, 3.5].map((x, i) => (
        <rect
          key={i}
          x={x * gap - cellW / 2}
          y={-cellW}
          width={cellW}
          height={cellW * 2}
          rx={1}
          fill={i === 0 || (i >= 1 && i <= 4) ? color : 'none'}
          opacity={i === 0 ? 1 : i <= 4 ? 0.65 : 0.85}
        />
      ))}
      <line x1={-3 * gap} y1={size * 0.16} x2={-2 * gap} y2={size * 0.16} opacity={0.6} />
      <line x1={-1.5 * gap} y1={size * 0.16} x2={1.5 * gap} y2={size * 0.16} opacity={0.6} />
      <line x1={2.5 * gap} y1={size * 0.16} x2={3.5 * gap} y2={size * 0.16} opacity={0.6} />
    </g>
  )
}

export function Int4Awq({ color, size }: TileIllustrationProps) {
  // Two columns of nibbles (4-bit groupings)
  const w = size * 0.07
  return (
    <g {...S(color)}>
      {[-3, -2, -1, 0].map((i) => (
        <rect
          key={`a-${i}`}
          x={-size * 0.22 + i * 0}
          y={i * size * 0.09 - w / 2}
          width={size * 0.16}
          height={w}
          rx={1}
          fill={color}
          stroke="none"
          opacity={0.85}
        />
      ))}
      {[-3, -2, -1, 0].map((i) => (
        <rect
          key={`b-${i}`}
          x={size * 0.06}
          y={i * size * 0.09 - w / 2}
          width={size * 0.16}
          height={w}
          rx={1}
          fill={color}
          stroke="none"
          opacity={0.85}
        />
      ))}
    </g>
  )
}

export function MxfpNvfp({ color, size }: TileIllustrationProps) {
  // Block of bits + a scale factor on the side
  const w = size * 0.07
  return (
    <g {...S(color)}>
      {[0, 1, 2, 3].map((row) =>
        [0, 1, 2, 3].map((col) => (
          <rect
            key={`${row}-${col}`}
            x={(col - 2) * w * 1.4}
            y={(row - 1.5) * w * 1.4}
            width={w}
            height={w}
            rx={1}
            fill={color}
            stroke="none"
            opacity={0.7}
          />
        )),
      )}
      {/* scale factor box on right */}
      <rect x={size * 0.22} y={-size * 0.06} width={size * 0.13} height={size * 0.12} rx={2} />
      <line x1={size * 0.13} y1={0} x2={size * 0.22} y2={0} opacity={0.55} />
    </g>
  )
}

export function RotationQuant({ color, size }: TileIllustrationProps) {
  // Rotation arc over a distribution
  const r = size * 0.34
  return (
    <g {...S(color)}>
      <path d={`M${-r},0 A${r},${r} 0 0 1 ${r},0`} />
      <path d={`M${r - 4},${-3} L${r},0 L${r - 4},${3}`} />
      {/* outlier dots before; aligned dots after */}
      <circle cx={-r * 0.6} cy={size * 0.18} r={2} fill={color} stroke="none" opacity={0.85} />
      <circle cx={-r * 0.2} cy={size * 0.18} r={2} fill={color} stroke="none" opacity={0.85} />
      <circle cx={r * 0.2} cy={size * 0.18} r={2} fill={color} stroke="none" opacity={0.85} />
      <circle cx={r * 0.6} cy={size * 0.18} r={2} fill={color} stroke="none" opacity={0.85} />
    </g>
  )
}

// ════════════ TRAINING / optimization ════════════

export function Backprop({ color, size }: TileIllustrationProps) {
  // 3-node compute graph with reverse arrows
  return (
    <g {...S(color)}>
      <circle cx={-size * 0.32} cy={0} r={size * 0.08} />
      <circle cx={0} cy={0} r={size * 0.08} />
      <circle cx={size * 0.32} cy={0} r={size * 0.08} />
      {/* reverse arrows */}
      <line x1={size * 0.24} y1={size * 0.05} x2={size * 0.08} y2={size * 0.05} strokeWidth={1.7} />
      <path d={`M${size * 0.11},${size * 0.02} L${size * 0.08},${size * 0.05} L${size * 0.11},${size * 0.08}`} />
      <line x1={-size * 0.08} y1={size * 0.05} x2={-size * 0.24} y2={size * 0.05} strokeWidth={1.7} />
      <path d={`M${-size * 0.21},${size * 0.02} L${-size * 0.24},${size * 0.05} L${-size * 0.21},${size * 0.08}`} />
    </g>
  )
}

export function Optimizers({ color, size }: TileIllustrationProps) {
  // Loss curve with descent step
  return (
    <g {...S(color)}>
      <path d={`M${-size * 0.4},${-size * 0.2} Q${-size * 0.1},${size * 0.3} ${size * 0.3},${size * 0.05} T${size * 0.4},${-size * 0.1}`} />
      <circle cx={-size * 0.4} cy={-size * 0.2} r={2.5} fill={color} stroke="none" />
      <circle cx={size * 0.05} cy={size * 0.18} r={2.5} fill={color} stroke="none" />
      <circle cx={size * 0.3} cy={size * 0.05} r={2.5} fill={color} stroke="none" />
    </g>
  )
}

export function LrSchedules({ color, size }: TileIllustrationProps) {
  // WSD curve: warmup, stable plateau, decay
  return (
    <g {...S(color)}>
      <line x1={-size * 0.4} y1={size * 0.25} x2={size * 0.4} y2={size * 0.25} opacity={0.45} />
      <path d={`M${-size * 0.4},${size * 0.25}
                L${-size * 0.25},${-size * 0.15}
                L${size * 0.1},${-size * 0.15}
                Q${size * 0.25},${-size * 0.15} ${size * 0.4},${size * 0.15}`}
            strokeWidth={1.7} />
    </g>
  )
}

export function Fp8Training({ color, size }: TileIllustrationProps) {
  // FP8 bits + circular training loop
  const r = size * 0.18
  return (
    <g {...S(color)}>
      {/* small bit pattern */}
      <rect x={-size * 0.4} y={-size * 0.04} width={size * 0.18} height={size * 0.08} rx={1} />
      <line x1={-size * 0.34} y1={-size * 0.04} x2={-size * 0.34} y2={size * 0.04} opacity={0.6} />
      <line x1={-size * 0.27} y1={-size * 0.04} x2={-size * 0.27} y2={size * 0.04} opacity={0.6} />
      {/* training loop */}
      <circle cx={size * 0.12} cy={0} r={r} />
      <path d={`M${size * 0.12 + r},0 L${size * 0.12 + r - 4},${-3} M${size * 0.12 + r},0 L${size * 0.12 + r - 4},${3}`} />
    </g>
  )
}

// ════════════ TRAINING / distributed ════════════

export function DataParallel({ color, size }: TileIllustrationProps) {
  // Ring AllReduce: 4 nodes in a circle
  const r = size * 0.3
  const pts = [0, 1, 2, 3].map((i) => {
    const a = (i / 4) * Math.PI * 2 - Math.PI / 2
    return [Math.cos(a) * r, Math.sin(a) * r] as [number, number]
  })
  return (
    <g {...S(color)}>
      {pts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r={size * 0.07} fill={color} stroke="none" />
      ))}
      {/* ring edges */}
      {pts.map((p, i) => {
        const next = pts[(i + 1) % pts.length]
        return <line key={`e-${i}`} x1={p[0]} y1={p[1]} x2={next[0]} y2={next[1]} opacity={0.7} />
      })}
    </g>
  )
}

export function TensorParallel({ color, size }: TileIllustrationProps) {
  // Matrix split vertically into shards
  const w = size * 0.5
  const h = size * 0.4
  return (
    <g {...S(color)}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={2} />
      <line x1={-w / 6} y1={-h / 2} x2={-w / 6} y2={h / 2} strokeWidth={1.7} />
      <line x1={w / 6} y1={-h / 2} x2={w / 6} y2={h / 2} strokeWidth={1.7} />
      <rect x={-w / 2} y={-h / 2} width={w / 3} height={h} fill={color} stroke="none" opacity={0.18} />
      <rect x={-w / 6} y={-h / 2} width={w / 3} height={h} fill={color} stroke="none" opacity={0.32} />
      <rect x={w / 6} y={-h / 2} width={w / 3} height={h} fill={color} stroke="none" opacity={0.46} />
    </g>
  )
}

export function PipelineParallel({ color, size }: TileIllustrationProps) {
  // Pipeline stages diagonal
  const w = size * 0.16
  const h = size * 0.13
  return (
    <g {...S(color)}>
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={-size * 0.36 + i * size * 0.18}
          y={-size * 0.32 + i * size * 0.14}
          width={w}
          height={h}
          rx={2}
          fill={color}
          stroke="none"
          opacity={0.4 + i * 0.15}
        />
      ))}
    </g>
  )
}

export function Fsdp({ color, size }: TileIllustrationProps) {
  // 4 shards with arrows showing gather
  const r = size * 0.07
  const y = size * 0.18
  return (
    <g {...S(color)}>
      {[-1.5, -0.5, 0.5, 1.5].map((x, i) => (
        <rect
          key={i}
          x={x * size * 0.16 - size * 0.06}
          y={y - size * 0.06}
          width={size * 0.12}
          height={size * 0.12}
          rx={2}
        />
      ))}
      {/* gather arrow up */}
      <path d={`M${0},${y - size * 0.16} L${0},${-size * 0.18}`} strokeWidth={1.7} />
      <path d={`M${-3},${-size * 0.15} L${0},${-size * 0.18} L${3},${-size * 0.15}`} />
      <circle cx={0} cy={-size * 0.28} r={r} />
    </g>
  )
}

// ════════════ TRAINING / post-training ════════════

export function Sft({ color, size }: TileIllustrationProps) {
  // Chat bubble + instruction
  const w = size * 0.55
  const h = size * 0.32
  return (
    <g {...S(color)}>
      <path d={`M${-w / 2},${-h / 2} h${w} a4,4 0 0 1 4,4 v${h - 8} a4,4 0 0 1 -4,4 h${-w * 0.4} l${-6},${6} l${0},${-6} h${-w * 0.6 + 4} a4,4 0 0 1 -4,-4 v${-h + 8} a4,4 0 0 1 4,-4 z`} />
      <line x1={-w * 0.25} y1={-h * 0.05} x2={w * 0.25} y2={-h * 0.05} opacity={0.55} />
      <line x1={-w * 0.25} y1={h * 0.15} x2={w * 0.05} y2={h * 0.15} opacity={0.55} />
    </g>
  )
}

export function LoraQlora({ color, size }: TileIllustrationProps) {
  // Big matrix W with two thin matrices A and B beside it
  const W_w = size * 0.2
  const W_h = size * 0.3
  const A_w = size * 0.06
  return (
    <g {...S(color)}>
      <rect x={-size * 0.4} y={-W_h / 2} width={W_w} height={W_h} rx={2} />
      <text x={-size * 0.3} y={3} textAnchor="middle" fontSize={size * 0.13} fill={color} fontFamily="serif">W</text>
      {/* + */}
      <line x1={-size * 0.16} y1={-size * 0.04} x2={-size * 0.16} y2={size * 0.04} opacity={0.7} />
      <line x1={-size * 0.2} y1={0} x2={-size * 0.12} y2={0} opacity={0.7} />
      {/* A (tall thin) */}
      <rect x={-size * 0.06} y={-W_h / 2} width={A_w} height={W_h} rx={2} fill={color} stroke="none" opacity={0.65} />
      {/* B (wide thin) */}
      <rect x={size * 0.04} y={-A_w / 2} width={size * 0.32} height={A_w} rx={2} fill={color} stroke="none" opacity={0.65} />
    </g>
  )
}

export function Dpo({ color, size }: TileIllustrationProps) {
  // Two trajectories: chosen ✓ vs rejected ✗
  return (
    <g {...S(color)}>
      <path d={`M${-size * 0.4},${-size * 0.2} Q${0},${-size * 0.4} ${size * 0.4},${-size * 0.18}`} strokeWidth={1.7} />
      <path d={`M${size * 0.32},${-size * 0.25} L${size * 0.36},${-size * 0.21} L${size * 0.4},${-size * 0.27}`} />
      <path d={`M${-size * 0.4},${size * 0.2} Q${0},${size * 0.4} ${size * 0.4},${size * 0.18}`} strokeDasharray="3 3" opacity={0.55} />
      <line x1={size * 0.32} y1={size * 0.13} x2={size * 0.4} y2={size * 0.23} opacity={0.55} />
      <line x1={size * 0.4} y1={size * 0.13} x2={size * 0.32} y2={size * 0.23} opacity={0.55} />
    </g>
  )
}

export function GrpoReasoning({ color, size }: TileIllustrationProps) {
  // Group of trajectories fanning out
  return (
    <g {...S(color)}>
      <circle cx={-size * 0.32} cy={0} r={size * 0.06} fill={color} stroke="none" />
      {[-0.25, -0.08, 0.08, 0.25].map((y, i) => (
        <line key={i} x1={-size * 0.26} y1={0} x2={size * 0.32} y2={y * size} />
      ))}
      {[-0.25, -0.08, 0.08, 0.25].map((y, i) => (
        <circle key={`d-${i}`} cx={size * 0.32} cy={y * size} r={size * 0.04} fill={color} stroke="none" opacity={i === 1 ? 1 : 0.55} />
      ))}
    </g>
  )
}

// ════════════ LLM-ARCHITECTURE / attention ════════════

export function Mha({ color, size }: TileIllustrationProps) {
  // 4 parallel heads converging
  return (
    <g {...S(color)}>
      {[-1.5, -0.5, 0.5, 1.5].map((y, i) => (
        <g key={i}>
          <line x1={-size * 0.4} y1={y * size * 0.13} x2={-size * 0.05} y2={0} opacity={0.7} />
          <circle cx={-size * 0.4} cy={y * size * 0.13} r={size * 0.04} fill={color} stroke="none" />
        </g>
      ))}
      <circle cx={-size * 0.05} cy={0} r={size * 0.06} />
      <line x1={size * 0.01} y1={0} x2={size * 0.4} y2={0} strokeWidth={1.7} />
      <path d={`M${size * 0.36},${-3} L${size * 0.4},0 L${size * 0.36},${3}`} />
    </g>
  )
}

export function GqaMqaMla({ color, size }: TileIllustrationProps) {
  // 4 Q heads sharing 1 KV head
  const Q = size * 0.04
  return (
    <g {...S(color)}>
      {[-1.5, -0.5, 0.5, 1.5].map((y, i) => (
        <circle key={i} cx={-size * 0.34} cy={y * size * 0.13} r={Q} fill={color} stroke="none" />
      ))}
      {[-1.5, -0.5, 0.5, 1.5].map((y, i) => (
        <line key={`l-${i}`} x1={-size * 0.3} y1={y * size * 0.13} x2={size * 0.05} y2={0} opacity={0.55} />
      ))}
      {/* shared KV */}
      <rect x={size * 0.07} y={-size * 0.06} width={size * 0.12} height={size * 0.12} rx={2} fill={color} stroke="none" opacity={0.5} />
      <rect x={size * 0.07} y={-size * 0.06} width={size * 0.12} height={size * 0.12} rx={2} />
    </g>
  )
}

export function RopeYarn({ color, size }: TileIllustrationProps) {
  // Concentric rotating circles
  const r1 = size * 0.36
  const r2 = size * 0.22
  return (
    <g {...S(color)}>
      <circle cx={0} cy={0} r={r1} />
      <circle cx={0} cy={0} r={r2} opacity={0.55} />
      <line x1={0} y1={0} x2={r1} y2={0} strokeWidth={1.7} />
      <line x1={0} y1={0} x2={Math.cos(Math.PI / 3) * r2} y2={Math.sin(Math.PI / 3) * r2} opacity={0.7} />
    </g>
  )
}

export function FlashAttn({ color, size }: TileIllustrationProps) {
  // Tiled attention: blocks with one highlighted
  const s = size * 0.42
  const cell = s / 3
  return (
    <g {...S(color)}>
      <rect x={-s / 2} y={-s / 2} width={s} height={s} rx={2} />
      {[1, 2].map((i) => (
        <line key={`v-${i}`} x1={-s / 2 + i * cell} y1={-s / 2} x2={-s / 2 + i * cell} y2={s / 2} opacity={0.6} />
      ))}
      {[1, 2].map((i) => (
        <line key={`h-${i}`} x1={-s / 2} y1={-s / 2 + i * cell} x2={s / 2} y2={-s / 2 + i * cell} opacity={0.6} />
      ))}
      {/* highlighted tile (current "online softmax") */}
      <rect x={-s / 2 + cell} y={-s / 2 + cell} width={cell} height={cell} fill={color} stroke="none" opacity={0.5} />
      {/* causal diagonal */}
      <line x1={-s / 2} y1={-s / 2} x2={s / 2} y2={s / 2} strokeWidth={1.7} />
    </g>
  )
}

// ════════════ LLM-ARCHITECTURE / kv-cache ════════════

export function KvBasics({ color, size }: TileIllustrationProps) {
  // Stack of K and V columns, growing
  const w = size * 0.07
  return (
    <g {...S(color)}>
      {/* K column */}
      {[-2, -1, 0, 1].map((i) => (
        <rect key={`k-${i}`} x={-size * 0.24 - w} y={i * size * 0.09 - w / 2} width={w} height={w} rx={1} fill={color} stroke="none" opacity={0.85} />
      ))}
      {/* V column */}
      {[-2, -1, 0, 1].map((i) => (
        <rect key={`v-${i}`} x={size * 0.18} y={i * size * 0.09 - w / 2} width={w} height={w} rx={1} fill={color} stroke="none" opacity={0.85} />
      ))}
      {/* arrow up indicating growth */}
      <line x1={0} y1={size * 0.18} x2={0} y2={-size * 0.2} opacity={0.55} />
      <path d={`M${-3},${-size * 0.16} L${0},${-size * 0.2} L${3},${-size * 0.16}`} opacity={0.7} />
    </g>
  )
}

export function PagedAttention({ color, size }: TileIllustrationProps) {
  // Paged blocks, some allocated/free
  const w = size * 0.13
  const states = [1, 1, 0, 1, 0, 1, 1, 0]
  return (
    <g {...S(color)}>
      {states.map((on, i) => (
        <rect
          key={i}
          x={-size * 0.42 + (i % 4) * (w + 2)}
          y={i < 4 ? -size * 0.2 : 0}
          width={w}
          height={w}
          rx={2}
          fill={on ? color : 'none'}
          stroke={color}
          opacity={on ? 0.6 : 1}
        />
      ))}
    </g>
  )
}

export function PrefixRadix({ color, size }: TileIllustrationProps) {
  // Tree branching from a prefix
  return (
    <g {...S(color)}>
      <circle cx={-size * 0.32} cy={0} r={size * 0.06} fill={color} stroke="none" />
      <line x1={-size * 0.26} y1={0} x2={-size * 0.05} y2={-size * 0.18} opacity={0.7} />
      <line x1={-size * 0.26} y1={0} x2={-size * 0.05} y2={0} opacity={0.7} />
      <line x1={-size * 0.26} y1={0} x2={-size * 0.05} y2={size * 0.18} opacity={0.7} />
      <circle cx={-size * 0.05} cy={-size * 0.18} r={size * 0.05} fill={color} stroke="none" />
      <circle cx={-size * 0.05} cy={0} r={size * 0.05} fill={color} stroke="none" />
      <circle cx={-size * 0.05} cy={size * 0.18} r={size * 0.05} fill={color} stroke="none" />
      <line x1={size * 0.0} y1={-size * 0.18} x2={size * 0.25} y2={-size * 0.27} opacity={0.55} />
      <line x1={size * 0.0} y1={-size * 0.18} x2={size * 0.25} y2={-size * 0.09} opacity={0.55} />
      <line x1={size * 0.0} y1={0} x2={size * 0.25} y2={0} opacity={0.55} />
    </g>
  )
}

export function Disaggregated({ color, size }: TileIllustrationProps) {
  // Two boxes labeled "P" and "D" (prefill and decode)
  return (
    <g {...S(color)}>
      <rect x={-size * 0.4} y={-size * 0.18} width={size * 0.32} height={size * 0.32} rx={3} />
      <rect x={size * 0.08} y={-size * 0.18} width={size * 0.32} height={size * 0.32} rx={3} />
      <line x1={-size * 0.08} y1={-size * 0.02} x2={size * 0.08} y2={-size * 0.02} strokeWidth={1.7} />
      <path d={`M${size * 0.04},${-size * 0.05} L${size * 0.08},${-size * 0.02} L${size * 0.04},${size * 0.01}`} />
      {/* labels */}
      <text x={-size * 0.24} y={size * 0.05} textAnchor="middle" fontSize={size * 0.16} fill={color} fontFamily="serif">P</text>
      <text x={size * 0.24} y={size * 0.05} textAnchor="middle" fontSize={size * 0.16} fill={color} fontFamily="serif">D</text>
    </g>
  )
}

// ════════════ LLM-ARCHITECTURE / inference-time ════════════

export function Sampling({ color, size }: TileIllustrationProps) {
  // Probability bars + sampling marker
  const w = size * 0.06
  const gap = size * 0.085
  const baseY = size * 0.25
  const heights = [0.4, 0.85, 0.55, 0.7, 0.3, 0.45, 0.2].map((h) => h * size * 0.4)
  return (
    <g {...S(color)}>
      {heights.map((h, i) => {
        const x = (i - (heights.length - 1) / 2) * gap
        return <rect key={i} x={x - w / 2} y={baseY - h} width={w} height={h} rx={1} fill={color} stroke="none" />
      })}
      <line x1={-size * 0.4} y1={baseY} x2={size * 0.4} y2={baseY} />
      {/* sampling pointer at the tallest bar */}
      <path d={`M${-2 * gap - 5},${baseY - heights[1] - 8} L${-2 * gap},${baseY - heights[1] - 2} L${-2 * gap + 5},${baseY - heights[1] - 8}`} strokeWidth={1.7} />
    </g>
  )
}

export function StructuredOutputArch({ color, size }: TileIllustrationProps) {
  // FSM nodes + braces
  return (
    <g {...S(color)}>
      <text x={-size * 0.36} y={3} textAnchor="middle" fontSize={size * 0.32} fill={color} fontFamily="serif">{'{'}</text>
      <text x={size * 0.36} y={3} textAnchor="middle" fontSize={size * 0.32} fill={color} fontFamily="serif">{'}'}</text>
      <circle cx={-size * 0.1} cy={0} r={size * 0.05} />
      <circle cx={size * 0.1} cy={0} r={size * 0.05} fill={color} stroke="none" />
      <line x1={-size * 0.05} y1={0} x2={size * 0.05} y2={0} opacity={0.7} />
    </g>
  )
}

export function ChunkedPrefill({ color, size }: TileIllustrationProps) {
  // Timeline split into chunks
  const w = size * 0.13
  const h = size * 0.16
  return (
    <g {...S(color)}>
      {[0, 1, 2, 3, 4].map((i) => (
        <rect
          key={i}
          x={-size * 0.4 + i * (w + 2)}
          y={-h / 2}
          width={w}
          height={h}
          rx={1}
          fill={i < 3 ? color : 'none'}
          stroke={color}
          opacity={i < 3 ? 0.7 - i * 0.18 : 1}
        />
      ))}
    </g>
  )
}

export function SpecDecodingArch({ color, size }: TileIllustrationProps) {
  // Draft (small) → target (big), with some accepted
  return (
    <g {...S(color)}>
      <rect x={-size * 0.4} y={-size * 0.1} width={size * 0.18} height={size * 0.2} rx={2} />
      {/* draft tokens */}
      {[-1, 0, 1].map((i) => (
        <rect key={`d-${i}`} x={-size * 0.18 + i * size * 0.04} y={-size * 0.04} width={size * 0.025} height={size * 0.08} rx={1} fill={color} stroke="none" />
      ))}
      {/* arrow */}
      <line x1={-size * 0.06} y1={0} x2={size * 0.05} y2={0} />
      <path d={`M${size * 0.02},${-3} L${size * 0.05},0 L${size * 0.02},${3}`} />
      {/* target (bigger box) */}
      <rect x={size * 0.07} y={-size * 0.18} width={size * 0.34} height={size * 0.36} rx={2} />
    </g>
  )
}

// ════════════ COMPILERS / foundation ════════════

export function LlvmIr({ color, size }: TileIllustrationProps) {
  // IR-shaped tree (root + 2 children + 4 leaves)
  const root: [number, number] = [0, -size * 0.28]
  const c1: [number, number] = [-size * 0.16, -size * 0.05]
  const c2: [number, number] = [size * 0.16, -size * 0.05]
  const leaves: Array<[number, number]> = [
    [-size * 0.28, size * 0.22],
    [-size * 0.06, size * 0.22],
    [size * 0.06, size * 0.22],
    [size * 0.28, size * 0.22],
  ]
  return (
    <g {...S(color)}>
      <line x1={root[0]} y1={root[1]} x2={c1[0]} y2={c1[1]} opacity={0.7} />
      <line x1={root[0]} y1={root[1]} x2={c2[0]} y2={c2[1]} opacity={0.7} />
      {leaves.slice(0, 2).map((l, i) => (
        <line key={`l1-${i}`} x1={c1[0]} y1={c1[1]} x2={l[0]} y2={l[1]} opacity={0.55} />
      ))}
      {leaves.slice(2).map((l, i) => (
        <line key={`l2-${i}`} x1={c2[0]} y1={c2[1]} x2={l[0]} y2={l[1]} opacity={0.55} />
      ))}
      <circle cx={root[0]} cy={root[1]} r={size * 0.05} fill={color} stroke="none" />
      <circle cx={c1[0]} cy={c1[1]} r={size * 0.04} fill={color} stroke="none" />
      <circle cx={c2[0]} cy={c2[1]} r={size * 0.04} fill={color} stroke="none" />
      {leaves.map((l, i) => (
        <circle key={`lf-${i}`} cx={l[0]} cy={l[1]} r={size * 0.03} fill={color} stroke="none" opacity={0.85} />
      ))}
    </g>
  )
}

export function Passes({ color, size }: TileIllustrationProps) {
  // Pass arrows in sequence
  const w = size * 0.13
  const h = size * 0.13
  return (
    <g {...S(color)}>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={-size * 0.4 + i * size * 0.27} y={-h / 2} width={w} height={h} rx={2} />
          {i < 2 && (
            <>
              <line x1={-size * 0.4 + i * size * 0.27 + w} y1={0} x2={-size * 0.4 + (i + 1) * size * 0.27 - 2} y2={0} />
              <path d={`M${-size * 0.4 + (i + 1) * size * 0.27 - 5},${-3} L${-size * 0.4 + (i + 1) * size * 0.27 - 2},0 L${-size * 0.4 + (i + 1) * size * 0.27 - 5},${3}`} />
            </>
          )}
        </g>
      ))}
    </g>
  )
}

export function MlirOverview({ color, size }: TileIllustrationProps) {
  // Layered dialects (3 stacked rectangles)
  const w = size * 0.55
  const h = size * 0.07
  const gap = size * 0.04
  return (
    <g {...S(color)}>
      {[-1, 0, 1].map((row, i) => (
        <rect
          key={i}
          x={-w / 2}
          y={row * (h + gap) - h / 2}
          width={w}
          height={h}
          rx={1.5}
          fill={color}
          stroke="none"
          opacity={0.4 + (i + 1) * 0.15}
        />
      ))}
    </g>
  )
}

export function Lowering({ color, size }: TileIllustrationProps) {
  // Stair-step descending
  return (
    <g {...S(color)}>
      <path
        d={`M${-size * 0.4},${-size * 0.25}
            L${-size * 0.18},${-size * 0.25}
            L${-size * 0.18},${-size * 0.05}
            L${size * 0.04},${-size * 0.05}
            L${size * 0.04},${size * 0.15}
            L${size * 0.32},${size * 0.15}`}
        strokeWidth={1.7}
      />
      <path d={`M${size * 0.28},${size * 0.12} L${size * 0.32},${size * 0.15} L${size * 0.28},${size * 0.18}`} />
    </g>
  )
}

// ════════════ COMPILERS / kernels ════════════

export function Triton({ color, size }: TileIllustrationProps) {
  // Block kernel: 4 tiles with @ overlay
  const cell = size * 0.18
  return (
    <g {...S(color)}>
      {[
        [-1, -1],
        [0, -1],
        [-1, 0],
        [0, 0],
      ].map(([cx, cy], i) => (
        <rect
          key={i}
          x={cx * cell + 1}
          y={cy * cell + 1}
          width={cell - 2}
          height={cell - 2}
          rx={1.5}
          fill={i === 0 ? color : 'none'}
          stroke={color}
          opacity={i === 0 ? 0.55 : 1}
        />
      ))}
    </g>
  )
}

export function CuteCutlass({ color, size }: TileIllustrationProps) {
  // CuTe: layered tiles (3D-ish)
  const s = size * 0.32
  return (
    <g {...S(color)}>
      <rect x={-s / 2 - size * 0.04} y={-s / 2 + size * 0.04} width={s} height={s} rx={2} opacity={0.45} />
      <rect x={-s / 2 - size * 0.02} y={-s / 2 + size * 0.02} width={s} height={s} rx={2} opacity={0.7} />
      <rect x={-s / 2} y={-s / 2} width={s} height={s} rx={2} />
      {/* internal grid */}
      <line x1={-s / 4} y1={-s / 2} x2={-s / 4} y2={s / 2} opacity={0.55} />
      <line x1={s / 4} y1={-s / 2} x2={s / 4} y2={s / 2} opacity={0.55} />
    </g>
  )
}

export function Thunderkittens({ color, size }: TileIllustrationProps) {
  // Compact register tiles
  const cell = size * 0.13
  return (
    <g {...S(color)}>
      {[0, 1, 2].map((row) =>
        [0, 1, 2].map((col) => (
          <rect
            key={`${row}-${col}`}
            x={(col - 1) * cell - cell / 2 + 0.5}
            y={(row - 1) * cell - cell / 2 + 0.5}
            width={cell - 1}
            height={cell - 1}
            rx={1}
            fill={(row + col) % 2 ? color : 'none'}
            stroke={color}
            opacity={(row + col) % 2 ? 0.5 : 1}
          />
        )),
      )}
    </g>
  )
}

export function HardwareLandscape({ color, size }: TileIllustrationProps) {
  // 4 chip silhouettes side by side
  const w = size * 0.13
  return (
    <g {...S(color)}>
      {[-1.5, -0.5, 0.5, 1.5].map((x, i) => (
        <g key={i}>
          <rect x={x * size * 0.16 - w / 2} y={-w / 2} width={w} height={w} rx={1.5} />
          <rect
            x={x * size * 0.16 - w / 4}
            y={-w / 4}
            width={w / 2}
            height={w / 2}
            rx={0.5}
            fill={color}
            stroke="none"
            opacity={0.6}
          />
        </g>
      ))}
    </g>
  )
}

// ════════════ COMPILERS / production ════════════

export function TorchCompile({ color, size }: TileIllustrationProps) {
  // Flame (PyTorch logo motif) + cog
  return (
    <g {...S(color)}>
      <path d={`M${-size * 0.05},${-size * 0.3} Q${size * 0.05},${-size * 0.18} ${0},${-size * 0.05} Q${-size * 0.1},${size * 0.05} ${0},${size * 0.18} Q${size * 0.12},${size * 0.05} ${size * 0.05},${-size * 0.1} Q${0},${-size * 0.22} ${-size * 0.05},${-size * 0.3} Z`} />
      {/* gear teeth around */}
      {[0, 60, 120, 180, 240, 300].map((deg) => {
        const a = (deg * Math.PI) / 180
        return (
          <line
            key={deg}
            x1={size * 0.25 * Math.cos(a)}
            y1={size * 0.25 * Math.sin(a)}
            x2={size * 0.32 * Math.cos(a)}
            y2={size * 0.32 * Math.sin(a)}
            opacity={0.5}
          />
        )
      })}
    </g>
  )
}

export function JaxPallas({ color, size }: TileIllustrationProps) {
  // X shape with tile
  return (
    <g {...S(color)}>
      <line x1={-size * 0.32} y1={-size * 0.2} x2={size * 0.32} y2={size * 0.2} strokeWidth={1.7} />
      <line x1={-size * 0.32} y1={size * 0.2} x2={size * 0.32} y2={-size * 0.2} strokeWidth={1.7} />
      {/* central tile */}
      <rect x={-size * 0.08} y={-size * 0.06} width={size * 0.16} height={size * 0.12} rx={1.5} fill={color} stroke="none" opacity={0.6} />
    </g>
  )
}

export function IreeExecutorch({ color, size }: TileIllustrationProps) {
  // Source → compile → mobile binary
  return (
    <g {...S(color)}>
      <rect x={-size * 0.4} y={-size * 0.12} width={size * 0.18} height={size * 0.24} rx={2} />
      <line x1={-size * 0.22} y1={0} x2={-size * 0.05} y2={0} />
      <path d={`M${-size * 0.08},${-3} L${-size * 0.05},0 L${-size * 0.08},${3}`} />
      {/* phone-shaped target */}
      <rect x={size * 0.05} y={-size * 0.22} width={size * 0.2} height={size * 0.44} rx={3} />
      <line x1={size * 0.1} y1={-size * 0.18} x2={size * 0.2} y2={-size * 0.18} opacity={0.55} />
    </g>
  )
}

export function OperatorFusion({ color, size }: TileIllustrationProps) {
  // Two ops merging into one
  return (
    <g {...S(color)}>
      <rect x={-size * 0.4} y={-size * 0.22} width={size * 0.16} height={size * 0.16} rx={2} />
      <rect x={-size * 0.4} y={size * 0.06} width={size * 0.16} height={size * 0.16} rx={2} />
      <line x1={-size * 0.24} y1={-size * 0.14} x2={size * 0.05} y2={0} opacity={0.7} />
      <line x1={-size * 0.24} y1={size * 0.14} x2={size * 0.05} y2={0} opacity={0.7} />
      <rect x={size * 0.07} y={-size * 0.1} width={size * 0.22} height={size * 0.2} rx={2} fill={color} stroke="none" opacity={0.5} />
      <rect x={size * 0.07} y={-size * 0.1} width={size * 0.22} height={size * 0.2} rx={2} />
    </g>
  )
}

// ════════════ APPLIED / llm-basics ════════════

export function Prompting({ color, size }: TileIllustrationProps) {
  // Quote marks "" + arrow
  return (
    <g {...S(color)}>
      <text x={-size * 0.32} y={size * 0.05} textAnchor="middle" fontSize={size * 0.5} fill={color} fontFamily="serif">"</text>
      <text x={size * 0.06} y={size * 0.05} textAnchor="middle" fontSize={size * 0.5} fill={color} fontFamily="serif">"</text>
      <line x1={size * 0.18} y1={0} x2={size * 0.4} y2={0} />
      <path d={`M${size * 0.36},${-3} L${size * 0.4},0 L${size * 0.36},${3}`} />
    </g>
  )
}

export function StructuredOutputApplied({ color, size }: TileIllustrationProps) {
  return (
    <g {...S(color)}>
      <text x={-size * 0.3} y={size * 0.08} textAnchor="middle" fontSize={size * 0.42} fill={color} fontFamily="serif">{'{'}</text>
      <text x={size * 0.3} y={size * 0.08} textAnchor="middle" fontSize={size * 0.42} fill={color} fontFamily="serif">{'}'}</text>
      {/* lines representing JSON keys */}
      <line x1={-size * 0.16} y1={-size * 0.06} x2={size * 0.16} y2={-size * 0.06} opacity={0.7} />
      <line x1={-size * 0.16} y1={size * 0.06} x2={size * 0.08} y2={size * 0.06} opacity={0.7} />
    </g>
  )
}

export function ToolUse({ color, size }: TileIllustrationProps) {
  // Wrench-ish: T-shape
  return (
    <g {...S(color)}>
      <rect x={-size * 0.04} y={-size * 0.32} width={size * 0.08} height={size * 0.45} rx={1} fill={color} stroke="none" opacity={0.65} />
      <rect x={-size * 0.18} y={-size * 0.32} width={size * 0.36} height={size * 0.1} rx={1.5} />
      {/* small "fastener" */}
      <circle cx={0} cy={size * 0.2} r={size * 0.06} />
    </g>
  )
}

export function Embeddings({ color, size }: TileIllustrationProps) {
  // Vector cloud with arrow
  return (
    <g {...S(color)}>
      {[
        [-0.32, -0.18],
        [-0.18, 0.05],
        [-0.05, -0.25],
        [0.1, 0.08],
        [0.22, -0.1],
        [0.3, 0.18],
      ].map(([x, y], i) => (
        <circle key={i} cx={x * size} cy={y * size} r={size * 0.035} fill={color} stroke="none" opacity={0.85} />
      ))}
      <line x1={0} y1={0} x2={size * 0.34} y2={-size * 0.18} strokeWidth={1.7} />
      <path d={`M${size * 0.3},${-size * 0.2} L${size * 0.34},${-size * 0.18} L${size * 0.3},${-size * 0.13}`} />
    </g>
  )
}

// ════════════ APPLIED / rag-agents ════════════

export function RagBasics({ color, size }: TileIllustrationProps) {
  // Document + retrieve arrow + answer
  return (
    <g {...S(color)}>
      {/* docs (3 stacked) */}
      <rect x={-size * 0.4} y={-size * 0.16} width={size * 0.16} height={size * 0.22} rx={1} />
      <rect x={-size * 0.36} y={-size * 0.2} width={size * 0.16} height={size * 0.22} rx={1} opacity={0.65} />
      <rect x={-size * 0.32} y={-size * 0.24} width={size * 0.16} height={size * 0.22} rx={1} opacity={0.4} />
      {/* arrow */}
      <line x1={-size * 0.13} y1={0} x2={size * 0.05} y2={0} />
      <path d={`M${size * 0.02},${-3} L${size * 0.05},0 L${size * 0.02},${3}`} />
      {/* answer */}
      <rect x={size * 0.08} y={-size * 0.13} width={size * 0.3} height={size * 0.26} rx={2} fill={color} stroke="none" opacity={0.45} />
      <rect x={size * 0.08} y={-size * 0.13} width={size * 0.3} height={size * 0.26} rx={2} />
    </g>
  )
}

export function AdvancedRag({ color, size }: TileIllustrationProps) {
  // Graph nodes with edges (GraphRAG)
  const pts: Array<[number, number]> = [
    [-0.3, -0.2],
    [0.05, -0.28],
    [0.28, -0.05],
    [-0.05, 0.05],
    [-0.28, 0.18],
    [0.18, 0.22],
  ]
  return (
    <g {...S(color)}>
      {pts.map(([x1, y1], i) =>
        pts.slice(i + 1).map(([x2, y2], j) =>
          (Math.abs(x1 - x2) + Math.abs(y1 - y2)) < 0.5 ? (
            <line key={`e-${i}-${j}`} x1={x1 * size} y1={y1 * size} x2={x2 * size} y2={y2 * size} opacity={0.45} />
          ) : null,
        ),
      )}
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x * size} cy={y * size} r={size * 0.045} fill={color} stroke="none" />
      ))}
    </g>
  )
}

export function ReactAgents({ color, size }: TileIllustrationProps) {
  // ReAct loop: Think → Act → Observe
  const r = size * 0.3
  return (
    <g {...S(color)}>
      <circle cx={0} cy={0} r={r} />
      {/* arrows around the loop */}
      <path d={`M${r - 4},${-3} L${r},0 L${r - 4},${3}`} />
      {/* labels as 3 dots */}
      <circle cx={0} cy={-r} r={size * 0.04} fill={color} stroke="none" />
      <circle cx={r * 0.866} cy={r * 0.5} r={size * 0.04} fill={color} stroke="none" />
      <circle cx={-r * 0.866} cy={r * 0.5} r={size * 0.04} fill={color} stroke="none" />
    </g>
  )
}

export function Mcp({ color, size }: TileIllustrationProps) {
  // Server hub with 3 client connections
  return (
    <g {...S(color)}>
      <rect x={-size * 0.1} y={-size * 0.1} width={size * 0.2} height={size * 0.2} rx={3} />
      {/* connections to 3 corners */}
      <line x1={-size * 0.1} y1={-size * 0.05} x2={-size * 0.32} y2={-size * 0.22} opacity={0.7} />
      <line x1={size * 0.1} y1={-size * 0.05} x2={size * 0.32} y2={-size * 0.22} opacity={0.7} />
      <line x1={0} y1={size * 0.1} x2={0} y2={size * 0.3} opacity={0.7} />
      <circle cx={-size * 0.32} cy={-size * 0.22} r={size * 0.05} fill={color} stroke="none" />
      <circle cx={size * 0.32} cy={-size * 0.22} r={size * 0.05} fill={color} stroke="none" />
      <circle cx={0} cy={size * 0.3} r={size * 0.05} fill={color} stroke="none" />
    </g>
  )
}

// ════════════ APPLIED / serve ════════════

export function VllmSglang({ color, size }: TileIllustrationProps) {
  // Server stack
  const w = size * 0.5
  const h = size * 0.1
  const gap = size * 0.04
  return (
    <g {...S(color)}>
      {[-1, 0, 1].map((row, i) => (
        <g key={i}>
          <rect x={-w / 2} y={row * (h + gap) - h / 2} width={w} height={h} rx={2} />
          <circle cx={w / 2 - 5} cy={row * (h + gap)} r={1.4} fill={color} stroke="none" />
        </g>
      ))}
    </g>
  )
}

export function OnDeviceApplied({ color, size }: TileIllustrationProps) {
  // Phone outline
  const w = size * 0.32
  const h = size * 0.5
  return (
    <g {...S(color)}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={4} />
      <line x1={-w * 0.18} y1={-h / 2 + 4} x2={w * 0.18} y2={-h / 2 + 4} opacity={0.7} />
      <circle cx={0} cy={h / 2 - 4} r={1.5} fill={color} stroke="none" />
    </g>
  )
}

export function CostLatency({ color, size }: TileIllustrationProps) {
  // Money symbol + clock
  return (
    <g {...S(color)}>
      <text x={-size * 0.22} y={size * 0.08} textAnchor="middle" fontSize={size * 0.4} fill={color} fontFamily="serif">$</text>
      {/* clock face */}
      <circle cx={size * 0.18} cy={0} r={size * 0.16} />
      <line x1={size * 0.18} y1={0} x2={size * 0.18} y2={-size * 0.1} strokeWidth={1.7} />
      <line x1={size * 0.18} y1={0} x2={size * 0.27} y2={size * 0.04} strokeWidth={1.7} />
    </g>
  )
}

export function Observability({ color, size }: TileIllustrationProps) {
  // Trace timeline with spans
  return (
    <g {...S(color)}>
      <line x1={-size * 0.4} y1={-size * 0.2} x2={size * 0.4} y2={-size * 0.2} opacity={0.4} />
      <line x1={-size * 0.4} y1={0} x2={size * 0.4} y2={0} opacity={0.4} />
      <line x1={-size * 0.4} y1={size * 0.2} x2={size * 0.4} y2={size * 0.2} opacity={0.4} />
      <rect x={-size * 0.35} y={-size * 0.23} width={size * 0.45} height={size * 0.06} rx={1} fill={color} stroke="none" opacity={0.7} />
      <rect x={-size * 0.18} y={-size * 0.03} width={size * 0.3} height={size * 0.06} rx={1} fill={color} stroke="none" opacity={0.55} />
      <rect x={size * 0.05} y={size * 0.17} width={size * 0.18} height={size * 0.06} rx={1} fill={color} stroke="none" opacity={0.4} />
    </g>
  )
}

// ════════════ APPLIED / frontier ════════════

export function MultimodalApplied({ color, size }: TileIllustrationProps) {
  // Image + text overlap
  return (
    <g {...S(color)}>
      <rect x={-size * 0.35} y={-size * 0.18} width={size * 0.3} height={size * 0.3} rx={2} />
      {/* sun-and-mountain inside */}
      <circle cx={-size * 0.27} cy={-size * 0.1} r={size * 0.04} fill={color} stroke="none" />
      <path d={`M${-size * 0.34},${size * 0.1} L${-size * 0.22},${-size * 0.04} L${-size * 0.08},${size * 0.1}`} opacity={0.7} />
      {/* text lines */}
      <line x1={size * 0.0} y1={-size * 0.05} x2={size * 0.36} y2={-size * 0.05} opacity={0.65} />
      <line x1={size * 0.0} y1={size * 0.05} x2={size * 0.28} y2={size * 0.05} opacity={0.65} />
    </g>
  )
}

export function Audio({ color, size }: TileIllustrationProps) {
  // Sound waveform
  return (
    <g {...S(color)}>
      {[-3, -2, -1, 0, 1, 2, 3].map((i) => {
        const x = i * size * 0.08
        const heights = [0.18, 0.32, 0.12, 0.4, 0.22, 0.32, 0.14]
        const h = heights[i + 3] * size
        return <line key={i} x1={x} y1={-h / 2} x2={x} y2={h / 2} strokeWidth={1.7} />
      })}
    </g>
  )
}

export function Safety({ color, size }: TileIllustrationProps) {
  // Shield
  return (
    <g {...S(color)}>
      <path d={`M${0},${-size * 0.32}
                L${size * 0.25},${-size * 0.18}
                L${size * 0.22},${size * 0.1}
                Q${size * 0.18},${size * 0.25} ${0},${size * 0.32}
                Q${-size * 0.18},${size * 0.25} ${-size * 0.22},${size * 0.1}
                L${-size * 0.25},${-size * 0.18} Z`} />
      <path d={`M${-size * 0.08},${0} L${-size * 0.02},${size * 0.08} L${size * 0.12},${-size * 0.08}`} strokeWidth={1.7} />
    </g>
  )
}

export function Capstone({ color, size }: TileIllustrationProps) {
  // Trophy / flag
  return (
    <g {...S(color)}>
      <rect x={-size * 0.04} y={-size * 0.3} width={size * 0.04} height={size * 0.5} rx={0.5} fill={color} stroke="none" />
      <path d={`M${0},${-size * 0.3} L${size * 0.3},${-size * 0.22} L${0},${-size * 0.13} Z`} />
      {/* base */}
      <line x1={-size * 0.12} y1={size * 0.22} x2={size * 0.04} y2={size * 0.22} opacity={0.6} />
    </g>
  )
}

// ════════════ EDGE-AI / on-device ════════════

export function LlamaCppInternals({ color, size }: TileIllustrationProps) {
  // GGUF file box with bits inside
  return (
    <g {...S(color)}>
      <path d={`M${-size * 0.22},${-size * 0.32}
                L${size * 0.16},${-size * 0.32}
                L${size * 0.26},${-size * 0.22}
                L${size * 0.26},${size * 0.32}
                L${-size * 0.22},${size * 0.32} Z`} />
      <path d={`M${size * 0.16},${-size * 0.32} L${size * 0.16},${-size * 0.22} L${size * 0.26},${-size * 0.22}`} opacity={0.55} />
      {/* bits */}
      {[-1, 0, 1].map((row) =>
        [-1, 0, 1].map((col) => (
          <circle
            key={`${row}-${col}`}
            cx={col * size * 0.1}
            cy={size * 0.05 + row * size * 0.08}
            r={1.6}
            fill={color}
            stroke="none"
            opacity={(row + col) % 2 ? 0.85 : 0.4}
          />
        )),
      )}
    </g>
  )
}

export function Executorch({ color, size }: TileIllustrationProps) {
  // ExecuTorch flame inside a chip
  return (
    <g {...S(color)}>
      <rect x={-size * 0.3} y={-size * 0.3} width={size * 0.6} height={size * 0.6} rx={4} />
      {/* flame */}
      <path d={`M${0},${-size * 0.18}
                Q${size * 0.06},${-size * 0.06} ${0},${size * 0.04}
                Q${-size * 0.06},${-size * 0.02} ${size * 0.04},${-size * 0.06}
                Q${0},${-size * 0.12} ${0},${-size * 0.18} Z`}
            fill={color}
            stroke="none"
            opacity={0.7} />
    </g>
  )
}

export function CoreML({ color, size }: TileIllustrationProps) {
  // Apple-bite + chip
  return (
    <g {...S(color)}>
      <path d={`M${-size * 0.2},${-size * 0.05}
                Q${-size * 0.25},${-size * 0.25} ${-size * 0.05},${-size * 0.25}
                Q${0},${-size * 0.3} ${size * 0.05},${-size * 0.25}
                Q${size * 0.25},${-size * 0.25} ${size * 0.2},${-size * 0.05}
                Q${size * 0.22},${size * 0.2} ${0},${size * 0.25}
                Q${-size * 0.22},${size * 0.2} ${-size * 0.2},${-size * 0.05} Z`} />
      <circle cx={size * 0.08} cy={-size * 0.1} r={size * 0.05} fill={color} stroke="none" opacity={0.55} />
    </g>
  )
}

export function Tflite({ color, size }: TileIllustrationProps) {
  // Android-shape + chip
  return (
    <g {...S(color)}>
      {/* head */}
      <path d={`M${-size * 0.18},0
                A${size * 0.18},${size * 0.18} 0 0 1 ${size * 0.18},0 Z`} />
      <circle cx={-size * 0.08} cy={-size * 0.05} r={1.5} fill={color} stroke="none" />
      <circle cx={size * 0.08} cy={-size * 0.05} r={1.5} fill={color} stroke="none" />
      {/* body */}
      <rect x={-size * 0.16} y={size * 0.02} width={size * 0.32} height={size * 0.2} rx={2} />
    </g>
  )
}

// ════════════ EDGE-AI / browser ════════════

export function WebgpuWebllm({ color, size }: TileIllustrationProps) {
  // Browser window with shader squares
  const w = size * 0.55
  const h = size * 0.42
  return (
    <g {...S(color)}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={2} />
      <line x1={-w / 2} y1={-h / 2 + 6} x2={w / 2} y2={-h / 2 + 6} />
      <circle cx={-w / 2 + 5} cy={-h / 2 + 3} r={1.4} fill={color} stroke="none" />
      <circle cx={-w / 2 + 9} cy={-h / 2 + 3} r={1.4} fill={color} stroke="none" opacity={0.6} />
      <circle cx={-w / 2 + 13} cy={-h / 2 + 3} r={1.4} fill={color} stroke="none" opacity={0.4} />
      {/* shader cells */}
      {[0, 1, 2].map((row) =>
        [0, 1, 2].map((col) => (
          <rect
            key={`${row}-${col}`}
            x={(col - 1) * size * 0.1 - size * 0.04}
            y={(row - 0.5) * size * 0.08 - size * 0.03}
            width={size * 0.08}
            height={size * 0.06}
            rx={1}
            fill={color}
            stroke="none"
            opacity={0.25 + ((row + col) % 3) * 0.2}
          />
        )),
      )}
    </g>
  )
}

// ════════════ EDGE-AI / multimodal ════════════

export function WhisperCpp({ color, size }: TileIllustrationProps) {
  // Microphone + waveform
  return (
    <g {...S(color)}>
      {/* mic body */}
      <rect x={-size * 0.32} y={-size * 0.25} width={size * 0.14} height={size * 0.28} rx={size * 0.07} />
      <path d={`M${-size * 0.36},${-size * 0.05} a${size * 0.13},${size * 0.13} 0 0 0 ${size * 0.24},0`} />
      <line x1={-size * 0.25} y1={size * 0.07} x2={-size * 0.25} y2={size * 0.18} />
      {/* waveform */}
      {[-3, -2, -1, 0, 1, 2, 3].map((i) => {
        const x = size * 0.05 + i * size * 0.04
        const heights = [0.1, 0.18, 0.12, 0.22, 0.14, 0.16, 0.08]
        const h = heights[i + 3] * size
        return <line key={i} x1={x} y1={-h} x2={x} y2={h} strokeWidth={1.4} />
      })}
    </g>
  )
}

export function MobileVlm({ color, size }: TileIllustrationProps) {
  // Phone with eye on screen
  const w = size * 0.32
  const h = size * 0.5
  return (
    <g {...S(color)}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={4} />
      {/* eye */}
      <ellipse cx={0} cy={0} rx={size * 0.12} ry={size * 0.08} />
      <circle cx={0} cy={0} r={size * 0.04} fill={color} stroke="none" />
    </g>
  )
}

// ════════════ EDGE-AI / distributed ════════════

export function ExoSwarm({ color, size }: TileIllustrationProps) {
  // 4 phones in a mesh
  const r = size * 0.04
  const pts: Array<[number, number]> = [
    [-0.3, -0.18],
    [0.3, -0.18],
    [-0.3, 0.18],
    [0.3, 0.18],
  ]
  return (
    <g {...S(color)}>
      {pts.flatMap(([x1, y1], i) =>
        pts.slice(i + 1).map(([x2, y2], j) => (
          <line key={`e-${i}-${j}`} x1={x1 * size} y1={y1 * size} x2={x2 * size} y2={y2 * size} opacity={0.45} />
        )),
      )}
      {pts.map(([x, y], i) => (
        <g key={i}>
          <rect
            x={x * size - size * 0.05}
            y={y * size - size * 0.07}
            width={size * 0.1}
            height={size * 0.14}
            rx={1.5}
            fill={color}
            stroke="none"
            opacity={0.5}
          />
          <rect
            x={x * size - size * 0.05}
            y={y * size - size * 0.07}
            width={size * 0.1}
            height={size * 0.14}
            rx={1.5}
          />
        </g>
      ))}
    </g>
  )
}

// ════════════ EDGE-AI / npu ════════════

export function Hexagon({ color, size }: TileIllustrationProps) {
  // Hexagon shape with internal lattice
  const r = size * 0.3
  const pts: Array<[number, number]> = [0, 1, 2, 3, 4, 5].map((i) => {
    const a = (i * 60 + 30) * (Math.PI / 180)
    return [Math.cos(a) * r, Math.sin(a) * r]
  })
  return (
    <g {...S(color)}>
      <path d={`M${pts[0][0]},${pts[0][1]} ${pts.slice(1).map(([x, y]) => `L${x},${y}`).join(' ')} Z`} />
      <line x1={0} y1={0} x2={pts[0][0]} y2={pts[0][1]} opacity={0.5} />
      <line x1={0} y1={0} x2={pts[2][0]} y2={pts[2][1]} opacity={0.5} />
      <line x1={0} y1={0} x2={pts[4][0]} y2={pts[4][1]} opacity={0.5} />
    </g>
  )
}

export function AppleAne({ color, size }: TileIllustrationProps) {
  // Apple-bite outline + neural-net dots inside
  return (
    <g {...S(color)}>
      <path d={`M${-size * 0.2},${-size * 0.05}
                Q${-size * 0.25},${-size * 0.25} ${-size * 0.05},${-size * 0.25}
                Q${0},${-size * 0.3} ${size * 0.05},${-size * 0.25}
                Q${size * 0.25},${-size * 0.25} ${size * 0.2},${-size * 0.05}
                Q${size * 0.22},${size * 0.2} ${0},${size * 0.25}
                Q${-size * 0.22},${size * 0.2} ${-size * 0.2},${-size * 0.05} Z`} />
      {/* neural net dots */}
      <circle cx={-size * 0.08} cy={-size * 0.05} r={size * 0.02} fill={color} stroke="none" />
      <circle cx={0} cy={size * 0.02} r={size * 0.02} fill={color} stroke="none" />
      <circle cx={size * 0.08} cy={size * 0.09} r={size * 0.02} fill={color} stroke="none" />
      <line x1={-size * 0.08} y1={-size * 0.05} x2={0} y2={size * 0.02} opacity={0.55} />
      <line x1={0} y1={size * 0.02} x2={size * 0.08} y2={size * 0.09} opacity={0.55} />
    </g>
  )
}

// ════════════ EDGE-AI / edge-quant ════════════

export function GgufImatrix({ color, size }: TileIllustrationProps) {
  // GGUF file + sparse-bit pattern
  return (
    <g {...S(color)}>
      <path d={`M${-size * 0.3},${-size * 0.3}
                L${size * 0.15},${-size * 0.3}
                L${size * 0.28},${-size * 0.18}
                L${size * 0.28},${size * 0.3}
                L${-size * 0.3},${size * 0.3} Z`} />
      <path d={`M${size * 0.15},${-size * 0.3} L${size * 0.15},${-size * 0.18} L${size * 0.28},${-size * 0.18}`} opacity={0.55} />
      {/* bits */}
      {[
        [1, 0, 1, 0],
        [0, 1, 1, 0],
        [1, 1, 0, 1],
      ].flatMap((row, ri) =>
        row.map((on, ci) => (
          <rect
            key={`${ri}-${ci}`}
            x={(ci - 1.5) * size * 0.07 - size * 0.02}
            y={size * 0.04 + (ri - 1) * size * 0.07 - size * 0.02}
            width={size * 0.04}
            height={size * 0.04}
            rx={0.5}
            fill={on ? color : 'none'}
            stroke={color}
            strokeWidth={1}
          />
        )),
      )}
    </g>
  )
}

// ════════════ EDGE-AI / distillation ════════════

export function SmallLlms({ color, size }: TileIllustrationProps) {
  // Big model → arrow → small model
  return (
    <g {...S(color)}>
      <rect x={-size * 0.4} y={-size * 0.2} width={size * 0.32} height={size * 0.4} rx={2} />
      <line x1={-size * 0.04} y1={0} x2={size * 0.13} y2={0} strokeWidth={1.7} />
      <path d={`M${size * 0.1},${-3} L${size * 0.13},0 L${size * 0.1},${3}`} />
      <rect x={size * 0.16} y={-size * 0.1} width={size * 0.18} height={size * 0.2} rx={1.5} />
    </g>
  )
}

export function SpeculativeDecodingEdge({ color, size }: TileIllustrationProps) {
  // Small model "draft" + big "target" verifying
  return (
    <g {...S(color)}>
      {/* draft (small) */}
      <rect x={-size * 0.4} y={-size * 0.13} width={size * 0.18} height={size * 0.26} rx={2} />
      {/* token sequence */}
      {[-1, 0, 1].map((i) => (
        <rect
          key={`t-${i}`}
          x={-size * 0.18 + i * size * 0.045}
          y={-size * 0.04}
          width={size * 0.03}
          height={size * 0.08}
          rx={0.5}
          fill={color}
          stroke="none"
        />
      ))}
      {/* arrow up to target */}
      <line x1={-size * 0.05} y1={0} x2={size * 0.05} y2={0} />
      <path d={`M${size * 0.02},${-3} L${size * 0.05},0 L${size * 0.02},${3}`} />
      {/* target (big) */}
      <rect x={size * 0.07} y={-size * 0.22} width={size * 0.34} height={size * 0.44} rx={3} />
    </g>
  )
}
