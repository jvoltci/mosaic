/**
 * Pointy-top hex grid math, axial coordinates.
 * Reference: https://www.redblobgames.com/grids/hexagons/
 */

export type Axial = { q: number; r: number }

const SQRT3 = Math.sqrt(3)

export function axialToPixel(q: number, r: number, size: number): { x: number; y: number } {
  const x = size * (SQRT3 * q + (SQRT3 / 2) * r)
  const y = size * ((3 / 2) * r)
  return { x, y }
}

/** Six corners of a pointy-top hex of given `size` centered at (cx, cy). */
export function hexCorners(cx: number, cy: number, size: number): { x: number; y: number }[] {
  const corners: { x: number; y: number }[] = []
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i + Math.PI / 6
    corners.push({ x: cx + size * Math.cos(angle), y: cy + size * Math.sin(angle) })
  }
  return corners
}

export function hexPath(cx: number, cy: number, size: number): string {
  const c = hexCorners(cx, cy, size)
  return `M${c[0].x.toFixed(2)},${c[0].y.toFixed(2)} ` +
    c.slice(1).map((p) => `L${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ') +
    ' Z'
}

/** Bounding box of a set of axial coords once converted to pixels. */
export function bounds(tiles: Axial[], size: number): { minX: number; minY: number; maxX: number; maxY: number } {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
  for (const { q, r } of tiles) {
    const { x, y } = axialToPixel(q, r, size)
    if (x - size < minX) minX = x - size
    if (y - size < minY) minY = y - size
    if (x + size > maxX) maxX = x + size
    if (y + size > maxY) maxY = y + size
  }
  return { minX, minY, maxX, maxY }
}
