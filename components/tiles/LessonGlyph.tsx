import type { TileIllustrationProps } from './types'

/**
 * Procedural per-lesson "constellation" — overlays the module icon to make
 * every tile uniquely identifiable. Deterministic from the slug, so the same
 * lesson always renders the same glyph. Style: 3-5 small dots and 1-3 lines
 * in a sub-region of the hex.
 *
 * Drawn with monoline 1px strokes + 1.4-radius dots so it reads as ornament
 * (not as the primary illustration). The module icon stays the dominant
 * visual; this just adds the lesson-specific signature.
 */

type Props = TileIllustrationProps & { slug: string }

function hash(s: string): number {
  // FNV-1a 32-bit. Deterministic, fast, no deps.
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export function LessonGlyph({ slug, color, size }: Props) {
  const seed = hash(slug)
  // Place the glyph cluster in the lower-left of the hex (so it doesn't
  // collide with the upper-right completion-check badge).
  const cx = -size * 0.32
  const cy = size * 0.32
  const span = size * 0.18
  // 3..5 points, deterministically positioned within span around (cx, cy).
  const n = 3 + ((seed >> 1) % 3)
  const pts: Array<[number, number]> = []
  for (let i = 0; i < n; i++) {
    const r = ((seed >> (i * 5 + 3)) & 0xff) / 255
    const a = ((seed >> (i * 7 + 11)) & 0xff) / 255 * Math.PI * 2
    pts.push([cx + Math.cos(a) * span * (0.4 + r * 0.6), cy + Math.sin(a) * span * (0.4 + r * 0.6)])
  }
  // Pattern selector: 0=dots only, 1=connect-prev, 2=spokes-from-first
  const pattern = seed % 3
  const lines: Array<[number, number, number, number]> = []
  if (pattern === 1) {
    for (let i = 1; i < pts.length; i++) {
      lines.push([pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1]])
    }
  } else if (pattern === 2) {
    for (let i = 1; i < pts.length; i++) {
      lines.push([pts[0][0], pts[0][1], pts[i][0], pts[i][1]])
    }
  }
  return (
    <g pointerEvents="none">
      {lines.map(([x1, y1, x2, y2], i) => (
        <line key={`l-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={0.9} opacity={0.7} />
      ))}
      {pts.map(([x, y], i) => (
        <circle key={`p-${i}`} cx={x} cy={y} r={1.4} fill={color} opacity={0.85} />
      ))}
    </g>
  )
}
