import type { ComponentType } from 'react'
import { StackVsHeap } from './StackVsHeap'
import { Gemm } from './Gemm'
import { KvCache } from './KvCache'
import { Mlir } from './Mlir'
import { Placeholder } from './Placeholder'
import {
  CacheLines,
  SimdLanes,
  TensorStrides,
  QuantBits,
  GradCurve,
  MeshNodes,
  DialTune,
  AttentionPattern,
  ProbBars,
  TileGrid,
  PipelineArrows,
  ChatBubble,
  RagVector,
  ServerStack,
  Spectrum,
  Phone,
  Window,
  CamMic,
  LanMesh,
  ChipNpu,
  GgufBytes,
  BigToSmall,
} from './Catalog'
import type { TileIllustrationProps } from './types'

export const ILLUSTRATIONS: Record<string, ComponentType<TileIllustrationProps>> = {
  // Anchor illustrations (one per "iconic" module)
  'stack-vs-heap': StackVsHeap,
  gemm: Gemm,
  'kv-cache': KvCache,
  mlir: Mlir,
  // Module-level icons (one per module)
  'cache-lines': CacheLines,
  'simd-lanes': SimdLanes,
  'tensor-strides': TensorStrides,
  'quant-bits': QuantBits,
  'grad-curve': GradCurve,
  'mesh-nodes': MeshNodes,
  'dial-tune': DialTune,
  'attention-pattern': AttentionPattern,
  'prob-bars': ProbBars,
  'tile-grid': TileGrid,
  'pipeline-arrows': PipelineArrows,
  'chat-bubble': ChatBubble,
  'rag-vector': RagVector,
  'server-stack': ServerStack,
  spectrum: Spectrum,
  phone: Phone,
  window: Window,
  'cam-mic': CamMic,
  'lan-mesh': LanMesh,
  'chip-npu': ChipNpu,
  'gguf-bytes': GgufBytes,
  'big-to-small': BigToSmall,
  // Fallback
  placeholder: Placeholder,
}

export function illustrationFor(name: string): ComponentType<TileIllustrationProps> {
  return ILLUSTRATIONS[name] ?? Placeholder
}
