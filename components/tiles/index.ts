import type { ComponentType } from 'react'
import { StackVsHeap } from './StackVsHeap'
import { Gemm } from './Gemm'
import { Rope } from './Rope'
import { KvCache } from './KvCache'
import { Mlir } from './Mlir'
import { Placeholder } from './Placeholder'
import type { TileIllustrationProps } from './types'

export const ILLUSTRATIONS: Record<string, ComponentType<TileIllustrationProps>> = {
  'stack-vs-heap': StackVsHeap,
  gemm: Gemm,
  rope: Rope,
  'kv-cache': KvCache,
  mlir: Mlir,
  placeholder: Placeholder,
}

export function illustrationFor(name: string): ComponentType<TileIllustrationProps> {
  return ILLUSTRATIONS[name] ?? Placeholder
}
