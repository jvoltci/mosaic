import type { ComponentType } from 'react'
import { StackVsHeap } from './StackVsHeap'
import { Gemm } from './Gemm'
import { KvCache } from './KvCache'
import { Mlir } from './Mlir'
import { Placeholder } from './Placeholder'
import {
  // foundations / cpp-memory
  MoveSemantics,
  SmartPointers,
  CustomAllocators,
  // foundations / caches-and-architecture
  CacheLines,
  BranchPrediction,
  NumaTopology,
  Profiling,
  // foundations / parallelism
  Threading,
  Async,
  Simd,
  // ml-execution / gpu-fundamentals
  SmArchitecture,
  ThreadHierarchy,
  SharedMemory,
  // ml-execution / tensors-in-memory
  StridesAndLayout,
  ContiguousVsNon,
  TensorLibrary,
  TmaAsyncCopy,
  // ml-execution / quantization
  Fp8Overview,
  Int4Awq,
  MxfpNvfp,
  RotationQuant,
  // training / optimization
  Backprop,
  Optimizers,
  LrSchedules,
  Fp8Training,
  // training / distributed
  DataParallel,
  TensorParallel,
  PipelineParallel,
  Fsdp,
  // training / post-training
  Sft,
  LoraQlora,
  Dpo,
  GrpoReasoning,
  // llm-architecture / attention
  Mha,
  GqaMqaMla,
  RopeYarn,
  FlashAttn,
  // llm-architecture / kv-cache
  KvBasics,
  PagedAttention,
  PrefixRadix,
  Disaggregated,
  // llm-architecture / inference-time
  Sampling,
  StructuredOutputArch,
  ChunkedPrefill,
  SpecDecodingArch,
  // compilers / foundation
  LlvmIr,
  Passes,
  MlirOverview,
  Lowering,
  // compilers / kernels
  Triton,
  CuteCutlass,
  Thunderkittens,
  HardwareLandscape,
  // compilers / production
  TorchCompile,
  JaxPallas,
  IreeExecutorch,
  OperatorFusion,
  // applied / llm-basics
  Prompting,
  StructuredOutputApplied,
  ToolUse,
  Embeddings,
  // applied / rag-agents
  RagBasics,
  AdvancedRag,
  ReactAgents,
  Mcp,
  // applied / serve
  VllmSglang,
  OnDeviceApplied,
  CostLatency,
  Observability,
  // applied / frontier
  MultimodalApplied,
  Audio,
  Safety,
  Capstone,
  // edge-ai / on-device
  LlamaCppInternals,
  Executorch,
  CoreML,
  Tflite,
  // edge-ai / browser
  WebgpuWebllm,
  // edge-ai / multimodal
  WhisperCpp,
  MobileVlm,
  // edge-ai / distributed
  ExoSwarm,
  // edge-ai / npu
  Hexagon,
  AppleAne,
  // edge-ai / edge-quant
  GgufImatrix,
  // edge-ai / distillation
  SmallLlms,
  SpeculativeDecodingEdge,
} from './Lessons'
import type { TileIllustrationProps } from './types'

export const ILLUSTRATIONS: Record<string, ComponentType<TileIllustrationProps>> = {
  // Anchor illustrations (the originals)
  'stack-vs-heap': StackVsHeap,
  gemm: Gemm,
  'kv-basics': KvBasics,
  'mlir-overview': MlirOverview,
  // foundations
  'move-semantics': MoveSemantics,
  'smart-pointers': SmartPointers,
  'custom-allocators': CustomAllocators,
  'cache-lines': CacheLines,
  'branch-prediction': BranchPrediction,
  'numa-and-topology': NumaTopology,
  profiling: Profiling,
  threading: Threading,
  async: Async,
  simd: Simd,
  // ml-execution
  'sm-architecture': SmArchitecture,
  'thread-hierarchy': ThreadHierarchy,
  'shared-memory': SharedMemory,
  'strides-and-layout': StridesAndLayout,
  'contiguous-vs-non': ContiguousVsNon,
  'tensor-library': TensorLibrary,
  'tma-async-copy': TmaAsyncCopy,
  'fp8-overview': Fp8Overview,
  'int4-and-awq': Int4Awq,
  'mxfp4-nvfp4': MxfpNvfp,
  'rotation-quant': RotationQuant,
  // training
  backprop: Backprop,
  optimizers: Optimizers,
  'lr-schedules': LrSchedules,
  'fp8-training': Fp8Training,
  'data-parallel': DataParallel,
  'tensor-parallel': TensorParallel,
  'pipeline-parallel': PipelineParallel,
  fsdp: Fsdp,
  sft: Sft,
  'lora-qlora': LoraQlora,
  dpo: Dpo,
  'grpo-reasoning': GrpoReasoning,
  // llm-architecture
  mha: Mha,
  'gqa-mqa-mla': GqaMqaMla,
  'rope-yarn': RopeYarn,
  'flash-attn-3': FlashAttn,
  'paged-attention': PagedAttention,
  'prefix-radix': PrefixRadix,
  disaggregated: Disaggregated,
  sampling: Sampling,
  'structured-output-arch': StructuredOutputArch,
  'chunked-prefill': ChunkedPrefill,
  'spec-decoding': SpecDecodingArch,
  // compilers
  'llvm-ir': LlvmIr,
  passes: Passes,
  lowering: Lowering,
  triton: Triton,
  'cute-cutlass': CuteCutlass,
  thunderkittens: Thunderkittens,
  'hardware-landscape': HardwareLandscape,
  'torch-compile': TorchCompile,
  'jax-pallas': JaxPallas,
  'iree-executorch': IreeExecutorch,
  'operator-fusion': OperatorFusion,
  // applied
  prompting: Prompting,
  'structured-output': StructuredOutputApplied,
  'tool-use': ToolUse,
  embeddings: Embeddings,
  'rag-basics': RagBasics,
  'advanced-rag': AdvancedRag,
  'react-agents': ReactAgents,
  mcp: Mcp,
  'vllm-sglang': VllmSglang,
  'on-device': OnDeviceApplied,
  'cost-latency': CostLatency,
  observability: Observability,
  multimodal: MultimodalApplied,
  audio: Audio,
  safety: Safety,
  capstone: Capstone,
  // edge-ai
  'llama-cpp-internals': LlamaCppInternals,
  executorch: Executorch,
  coreml: CoreML,
  tflite: Tflite,
  'webgpu-webllm': WebgpuWebllm,
  'whisper-cpp': WhisperCpp,
  'mobile-vlm': MobileVlm,
  'exo-swarm': ExoSwarm,
  hexagon: Hexagon,
  'apple-ane': AppleAne,
  'gguf-and-imatrix': GgufImatrix,
  'small-llms': SmallLlms,
  'speculative-decoding': SpeculativeDecodingEdge,
  // Fallback
  placeholder: Placeholder,
}

export function illustrationFor(name: string): ComponentType<TileIllustrationProps> {
  return ILLUSTRATIONS[name] ?? Placeholder
}
