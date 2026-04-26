/**
 * The Mosaic course map — 74 tiles across 6 tracks.
 * Hand-laid axial-hex coordinates. Layout is 3 columns × 2 rows of regions:
 *
 *   ┌─Foundations─┐ ┌─Execution──┐ ┌─Training────┐
 *   │ q ∈ [-9,-6] │ │ q ∈ [-4,-1]│ │ q ∈ [ 1, 4] │   r ∈ [-4,-1]
 *   └─────────────┘ └────────────┘ └─────────────┘
 *           ╳     "river" at r=0     ╳
 *   ┌─LLM Arch────┐ ┌─Compilers──┐ ┌─Applied AI──┐
 *   │ q ∈ [-9,-6] │ │ q ∈ [-4,-1]│ │ q ∈ [ 1, 4] │   r ∈ [ 1, 4]
 *   └─────────────┘ └────────────┘ └─────────────┘
 */

export type TrackKey =
  | 'foundations'
  | 'ml-execution'
  | 'training'
  | 'llm-architecture'
  | 'compilers'
  | 'applied'

export type Tile = {
  slug: string
  fallback: string
  title: string
  summary: string
  track: TrackKey
  moduleName: string
  q: number
  r: number
  illustration: string
  available: boolean
}

export const TRACK_LABELS: Record<TrackKey, string> = {
  foundations: 'Systems Foundations',
  'ml-execution': 'ML Execution & Quantization',
  training: 'Training & RLHF',
  'llm-architecture': 'LLM Architecture',
  compilers: 'ML Compilers & Hardware',
  applied: 'Applied AI · Build & Ship',
}

export const TRACK_ACCENT: Record<TrackKey, string> = {
  foundations: 'var(--m-track-foundations)',
  'ml-execution': 'var(--m-track-execution)',
  training: 'var(--m-track-training)',
  'llm-architecture': 'var(--m-track-architecture)',
  compilers: 'var(--m-track-compilers)',
  applied: 'var(--m-track-applied)',
}

export const TRACK_NUM: Record<TrackKey, string> = {
  foundations: '01',
  'ml-execution': '02',
  training: '03',
  'llm-architecture': '04',
  compilers: '05',
  applied: '06',
}

export const TRACK_SHORT: Record<TrackKey, string> = {
  foundations: 'Foundations',
  'ml-execution': 'Execution',
  training: 'Training',
  'llm-architecture': 'LLMs',
  compilers: 'Compilers',
  applied: 'Applied',
}

/** @deprecated Kept for backwards compat — prefer TRACK_NUM. */
export const TRACK_ICON: Record<TrackKey, string> = {
  foundations: '01',
  'ml-execution': '02',
  training: '03',
  'llm-architecture': '04',
  compilers: '05',
  applied: '06',
}

export const TRACK_TAGLINE: Record<TrackKey, string> = {
  foundations: 'The substrate everything else runs on.',
  'ml-execution': 'What an ML workload actually does on the metal.',
  training: 'How modern LLMs are actually trained, end to end.',
  'llm-architecture': 'Transformers from a systems lens.',
  compilers: 'From a high-level graph to optimized hardware.',
  applied: 'Build a working AI app on your phone — and ship it.',
}

export const TILES: Tile[] = [
  // ════════════════════ FOUNDATIONS (terracotta) ════════════════════
  // Module: C++ Memory Model
  { slug: '/foundations/cpp-memory/stack-vs-heap',     fallback: '/foundations/cpp-memory', title: 'Stack vs Heap',          summary: 'Why heap allocations cost ~100× a stack push.',                   track: 'foundations', moduleName: 'C++ Memory', q: -9, r: -4, illustration: 'stack-vs-heap', available: true },
  { slug: '/foundations/cpp-memory/move-semantics',    fallback: '/foundations/cpp-memory', title: 'Move Semantics',         summary: 'Rvalue references and the cost of a copy you didn\'t want.',     track: 'foundations', moduleName: 'C++ Memory', q: -8, r: -4, illustration: 'placeholder',   available: false },
  { slug: '/foundations/cpp-memory/smart-pointers',    fallback: '/foundations/cpp-memory', title: 'Smart Pointers & RAII',  summary: 'Ownership encoded in the type system.',                            track: 'foundations', moduleName: 'C++ Memory', q: -7, r: -4, illustration: 'placeholder',   available: false },
  { slug: '/foundations/cpp-memory/custom-allocators', fallback: '/foundations/cpp-memory', title: 'PyTorch Caching Allocator', summary: 'Skip the system allocator on hot ML paths.',                    track: 'foundations', moduleName: 'C++ Memory', q: -6, r: -4, illustration: 'placeholder',   available: false },
  // Module: Caches & Hardware Reality
  { slug: '/foundations/caches-and-architecture/cache-lines',          fallback: '/foundations/caches-and-architecture', title: 'Cache Lines',         summary: 'Spatial locality and the 64-byte unit of work.',          track: 'foundations', moduleName: 'Caches & HW', q: -9, r: -3, illustration: 'placeholder', available: false },
  { slug: '/foundations/caches-and-architecture/branch-prediction',    fallback: '/foundations/caches-and-architecture', title: 'Branch Prediction',   summary: 'Why an unpredictable if-statement can cost 20 cycles.',  track: 'foundations', moduleName: 'Caches & HW', q: -8, r: -3, illustration: 'placeholder', available: false },
  { slug: '/foundations/caches-and-architecture/numa-and-topology',    fallback: '/foundations/caches-and-architecture', title: 'NUMA & Topology',     summary: 'PCIe, NVLink, CXL — what hosts and GPUs cost to talk to.', track: 'foundations', moduleName: 'Caches & HW', q: -7, r: -3, illustration: 'placeholder', available: false },
  { slug: '/foundations/caches-and-architecture/profiling',            fallback: '/foundations/caches-and-architecture', title: 'Profiling Tools',     summary: 'perf, nsys, ncu, eBPF — see what the silicon is actually doing.', track: 'foundations', moduleName: 'Caches & HW', q: -6, r: -3, illustration: 'placeholder', available: false },
  // Module: Parallelism
  { slug: '/foundations/parallelism/threading',  fallback: '/foundations/parallelism', title: 'Threading',  summary: 'OS threads, the scheduler, and where they bite.',  track: 'foundations', moduleName: 'Parallelism', q: -8, r: -2, illustration: 'placeholder', available: false },
  { slug: '/foundations/parallelism/async',      fallback: '/foundations/parallelism', title: 'Async Runtimes', summary: 'Coroutines, executors, CUDA streams — concurrency without locks.', track: 'foundations', moduleName: 'Parallelism', q: -7, r: -2, illustration: 'placeholder', available: false },
  { slug: '/foundations/parallelism/simd',       fallback: '/foundations/parallelism', title: 'SIMD',       summary: 'AVX-512, ARM SVE2 — 8–16 floats per instruction.', track: 'foundations', moduleName: 'Parallelism', q: -6, r: -2, illustration: 'placeholder', available: false },

  // ════════════════════ ML EXECUTION (sage) ════════════════════
  // Module: Tensors in Memory
  { slug: '/ml-execution/tensors-in-memory/strides-and-layout', fallback: '/ml-execution/tensors-in-memory', title: 'Strides & Layout',  summary: 'A tensor isn\'t shape — it\'s shape + strides.',          track: 'ml-execution', moduleName: 'Tensors',   q: -4, r: -4, illustration: 'placeholder', available: true },
  { slug: '/ml-execution/tensors-in-memory/contiguous-vs-non',  fallback: '/ml-execution/tensors-in-memory', title: 'Contiguous vs Non',  summary: 'Why a transposed view is sometimes 10× slower.',           track: 'ml-execution', moduleName: 'Tensors',   q: -3, r: -4, illustration: 'placeholder', available: true },
  { slug: '/ml-execution/tensors-in-memory/tensor-library',     fallback: '/ml-execution/tensors-in-memory', title: 'Build a Tensor Lib', summary: 'The minimal tensor type from scratch in 200 lines of Python.',track: 'ml-execution', moduleName: 'Tensors',   q: -2, r: -4, illustration: 'placeholder', available: true },
  { slug: '/ml-execution/tensors-in-memory/tma-async-copy',     fallback: '/ml-execution/tensors-in-memory', title: 'TMA & cp.async',     summary: 'Hopper\'s producer-consumer warps and async memory pipelines.', track: 'ml-execution', moduleName: 'Tensors', q: -1, r: -4, illustration: 'placeholder', available: true },
  // Module: GPU & GEMM
  { slug: '/ml-execution/gpu-fundamentals/sm-architecture',  fallback: '/ml-execution/gpu-fundamentals', title: 'SM Architecture',     summary: 'SMs, warps, schedulers — how a GPU thinks.',                    track: 'ml-execution', moduleName: 'GPU & GEMM', q: -4, r: -3, illustration: 'placeholder', available: true },
  { slug: '/ml-execution/gpu-fundamentals/thread-hierarchy', fallback: '/ml-execution/gpu-fundamentals', title: 'Thread Hierarchy',    summary: 'Grids, blocks, threads — and why the hierarchy matters.',       track: 'ml-execution', moduleName: 'GPU & GEMM', q: -3, r: -3, illustration: 'placeholder', available: true },
  { slug: '/ml-execution/gpu-fundamentals/shared-memory',    fallback: '/ml-execution/gpu-fundamentals', title: 'Shared Memory',       summary: 'The fast scratch pad every fast kernel uses.',                  track: 'ml-execution', moduleName: 'GPU & GEMM', q: -2, r: -3, illustration: 'placeholder', available: true },
  { slug: '/ml-execution/gpu-fundamentals/gemm',             fallback: '/ml-execution/gpu-fundamentals', title: 'GEMM (Hopper)',       summary: 'Cache-blocked matmul, WGMMA, and outperforming cuBLAS.',         track: 'ml-execution', moduleName: 'GPU & GEMM', q: -1, r: -3, illustration: 'gemm',        available: true },
  // Module: Quantization
  { slug: '/ml-execution/quantization/fp8-overview',         fallback: '/ml-execution/quantization', title: 'FP8 Inference',         summary: 'E4M3 / E5M2 — the H100 format that replaced INT8.',          track: 'ml-execution', moduleName: 'Quantization', q: -4, r: -2, illustration: 'placeholder', available: false },
  { slug: '/ml-execution/quantization/int4-and-awq',         fallback: '/ml-execution/quantization', title: 'INT4 / AWQ / GPTQ',     summary: 'Two weights per byte — and the kernel that unpacks them fast.', track: 'ml-execution', moduleName: 'Quantization', q: -3, r: -2, illustration: 'placeholder', available: false },
  { slug: '/ml-execution/quantization/mxfp4-nvfp4',          fallback: '/ml-execution/quantization', title: 'MXFP4 / NVFP4',         summary: 'Block-floating-point microscaling on Blackwell.',             track: 'ml-execution', moduleName: 'Quantization', q: -2, r: -2, illustration: 'placeholder', available: false },
  { slug: '/ml-execution/quantization/rotation-quant',       fallback: '/ml-execution/quantization', title: 'Rotation Quantization', summary: 'QuaRot, SpinQuant — outlier suppression via Hadamard rotation.', track: 'ml-execution', moduleName: 'Quantization', q: -1, r: -2, illustration: 'placeholder', available: false },

  // ════════════════════ TRAINING & RLHF (plum) ════════════════════
  // Module: Optimization
  { slug: '/training/optimization/backprop',          fallback: '/training/optimization', title: 'Backprop as a Graph',  summary: 'Forward saves activations; backward consumes them. Memory binds.',          track: 'training', moduleName: 'Optimization', q: 1, r: -4, illustration: 'placeholder', available: true },
  { slug: '/training/optimization/optimizers',        fallback: '/training/optimization', title: 'AdamW → Lion → Muon',  summary: 'The optimizer lineage frontier labs actually use.',                          track: 'training', moduleName: 'Optimization', q: 2, r: -4, illustration: 'placeholder', available: true },
  { slug: '/training/optimization/lr-schedules',      fallback: '/training/optimization', title: 'LR Schedules & WSD',   summary: 'Warmup-Stable-Decay — why MiniCPM and DeepSeek-V3 swapped cosine.',          track: 'training', moduleName: 'Optimization', q: 3, r: -4, illustration: 'placeholder', available: true },
  { slug: '/training/optimization/fp8-training',      fallback: '/training/optimization', title: 'FP8 Training',         summary: 'DeepSeek-V3-style FP8 with delayed scaling and master weights.',            track: 'training', moduleName: 'Optimization', q: 4, r: -4, illustration: 'placeholder', available: true },
  // Module: Distributed
  { slug: '/training/distributed/data-parallel',      fallback: '/training/distributed', title: 'Data Parallel & DDP',     summary: 'Ring-AllReduce, gradient bucketing, comm/compute overlap.',                track: 'training', moduleName: 'Distributed', q: 1, r: -3, illustration: 'placeholder', available: false },
  { slug: '/training/distributed/tensor-parallel',    fallback: '/training/distributed', title: 'Tensor Parallel',         summary: 'Megatron-LM column/row parallel and the two AllReduces.',                  track: 'training', moduleName: 'Distributed', q: 2, r: -3, illustration: 'placeholder', available: false },
  { slug: '/training/distributed/pipeline-parallel',  fallback: '/training/distributed', title: 'Pipeline & Zero-Bubble',  summary: 'GPipe, 1F1B, interleaved, and 2024 zero-bubble schedules.',                track: 'training', moduleName: 'Distributed', q: 3, r: -3, illustration: 'placeholder', available: false },
  { slug: '/training/distributed/fsdp',               fallback: '/training/distributed', title: 'ZeRO & FSDP2',            summary: 'Sharding optimizer states, gradients, and parameters per-tensor.',         track: 'training', moduleName: 'Distributed', q: 4, r: -3, illustration: 'placeholder', available: true },
  // Module: Post-training
  { slug: '/training/post-training/sft',              fallback: '/training/post-training', title: 'SFT & Instruction Tune', summary: 'Chat templates, sample packing, prompt loss masking.',                    track: 'training', moduleName: 'Post-training', q: 1, r: -2, illustration: 'placeholder', available: false },
  { slug: '/training/post-training/lora-qlora',       fallback: '/training/post-training', title: 'LoRA / QLoRA / DoRA',     summary: 'Fine-tune a 70B on one 80GB GPU. Working Colab.',                          track: 'training', moduleName: 'Post-training', q: 2, r: -2, illustration: 'placeholder', available: true },
  { slug: '/training/post-training/dpo',              fallback: '/training/post-training', title: 'DPO / IPO / KTO',         summary: 'Preference optimization without RL — closed-form classification.',        track: 'training', moduleName: 'Post-training', q: 3, r: -2, illustration: 'placeholder', available: false },
  { slug: '/training/post-training/grpo-reasoning',   fallback: '/training/post-training', title: 'GRPO & RL Reasoning',     summary: 'DeepSeek-R1\'s recipe: RL on verifiable rewards, no value model.',          track: 'training', moduleName: 'Post-training', q: 4, r: -2, illustration: 'placeholder', available: true },

  // ════════════════════ LLM ARCHITECTURE (gold) ════════════════════
  // Module: Attention
  { slug: '/llm-architecture/attention/mha',             fallback: '/llm-architecture/attention', title: 'Multi-Head Attention',  summary: 'The original attention mechanism, head by head.',                    track: 'llm-architecture', moduleName: 'Attention', q: -9, r: 1, illustration: 'placeholder', available: true },
  { slug: '/llm-architecture/attention/gqa-mqa-mla',     fallback: '/llm-architecture/attention', title: 'GQA, MQA & MLA',         summary: 'KV head sharing — and DeepSeek\'s 10× compression via latent attention.', track: 'llm-architecture', moduleName: 'Attention', q: -8, r: 1, illustration: 'placeholder', available: true },
  { slug: '/llm-architecture/attention/rope-yarn',       fallback: '/llm-architecture/attention', title: 'RoPE + YaRN/LongRoPE',   summary: 'Rotary positional embeddings and how to scale to 1M tokens.',         track: 'llm-architecture', moduleName: 'Attention', q: -7, r: 1, illustration: 'rope',        available: true },
  { slug: '/llm-architecture/attention/flash-attn-3',    fallback: '/llm-architecture/attention', title: 'FlashAttention-3',       summary: 'IO-aware attention. Hopper-tuned, async, warp-specialized.',          track: 'llm-architecture', moduleName: 'Attention', q: -6, r: 1, illustration: 'placeholder', available: true },
  // Module: KV Cache
  { slug: '/llm-architecture/kv-cache/kv-basics',        fallback: '/llm-architecture/kv-cache', title: 'KV Cache Basics',         summary: 'Why we cache; how the cache grows with each token.',                    track: 'llm-architecture', moduleName: 'KV Cache', q: -9, r: 2, illustration: 'kv-cache',    available: true },
  { slug: '/llm-architecture/kv-cache/paged-attention',  fallback: '/llm-architecture/kv-cache', title: 'PagedAttention (vLLM)',    summary: 'OS-style virtual memory for the KV cache.',                              track: 'llm-architecture', moduleName: 'KV Cache', q: -8, r: 2, illustration: 'placeholder', available: true },
  { slug: '/llm-architecture/kv-cache/prefix-radix',     fallback: '/llm-architecture/kv-cache', title: 'Prefix & RadixAttention',  summary: 'SGLang\'s shared-prefix cache reuse across requests.',                  track: 'llm-architecture', moduleName: 'KV Cache', q: -7, r: 2, illustration: 'placeholder', available: true },
  { slug: '/llm-architecture/kv-cache/disaggregated',    fallback: '/llm-architecture/kv-cache', title: 'Disaggregated Serving',    summary: 'DistServe/Mooncake — split prefill from decode across GPUs.',           track: 'llm-architecture', moduleName: 'KV Cache', q: -6, r: 2, illustration: 'placeholder', available: true },
  // Module: Inference-Time
  { slug: '/llm-architecture/inference-time/sampling',              fallback: '/llm-architecture/inference-time', title: 'Sampling',              summary: 'Temperature, top-p, min-p — choosing the next token.',                track: 'llm-architecture', moduleName: 'Inference', q: -9, r: 3, illustration: 'placeholder', available: true },
  { slug: '/llm-architecture/inference-time/structured-output',     fallback: '/llm-architecture/inference-time', title: 'Structured Output',     summary: 'XGrammar, Outlines — constrained decoding via FSMs.',                  track: 'llm-architecture', moduleName: 'Inference', q: -8, r: 3, illustration: 'placeholder', available: true },
  { slug: '/llm-architecture/inference-time/chunked-prefill',       fallback: '/llm-architecture/inference-time', title: 'Chunked Prefill',       summary: 'The unified scheduling primitive vLLM v1 was rebuilt around.',         track: 'llm-architecture', moduleName: 'Inference', q: -7, r: 3, illustration: 'placeholder', available: true },
  { slug: '/llm-architecture/inference-time/spec-decoding',         fallback: '/llm-architecture/inference-time', title: 'Speculative Decoding',  summary: 'EAGLE-3, Medusa, prompt lookup — 2–3× decode speedup.',                track: 'llm-architecture', moduleName: 'Inference', q: -6, r: 3, illustration: 'placeholder', available: true },

  // ════════════════════ ML COMPILERS (indigo) ════════════════════
  // Module: Foundation
  { slug: '/compilers/foundation/llvm-ir',          fallback: '/compilers/foundation', title: 'LLVM IR Tour',           summary: 'The universal intermediate representation.',                       track: 'compilers', moduleName: 'Foundation',  q: -4, r: 1, illustration: 'placeholder', available: true },
  { slug: '/compilers/foundation/passes',           fallback: '/compilers/foundation', title: 'Passes & Pipelines',     summary: 'How LLVM optimizations actually run.',                              track: 'compilers', moduleName: 'Foundation',  q: -3, r: 1, illustration: 'placeholder', available: true },
  { slug: '/compilers/foundation/mlir-overview',    fallback: '/compilers/foundation', title: 'MLIR Overview',          summary: 'Multi-level IR: linalg, gpu, llvm — pick the right vocabulary.',    track: 'compilers', moduleName: 'Foundation',  q: -2, r: 1, illustration: 'mlir',        available: true },
  { slug: '/compilers/foundation/lowering',         fallback: '/compilers/foundation', title: 'Dialects & Lowering',    summary: 'Walking the program down a level at a time, dialect by dialect.',  track: 'compilers', moduleName: 'Foundation',  q: -1, r: 1, illustration: 'placeholder', available: true },
  // Module: Production compilers
  { slug: '/compilers/production/torch-compile',    fallback: '/compilers/production', title: 'torch.compile',          summary: 'Dynamo + AOTAutograd + Inductor — the daily-driver compiler.',     track: 'compilers', moduleName: 'Production',  q: -4, r: 2, illustration: 'placeholder', available: true },
  { slug: '/compilers/production/jax-pallas',       fallback: '/compilers/production', title: 'JAX & Pallas',           summary: 'StableHLO, XLA, and Pallas\' Triton-equivalent kernel DSL.',         track: 'compilers', moduleName: 'Production',  q: -3, r: 2, illustration: 'placeholder', available: true },
  { slug: '/compilers/production/iree-executorch',  fallback: '/compilers/production', title: 'IREE & ExecuTorch',      summary: 'MLIR-based deployment compilers for edge and mobile.',              track: 'compilers', moduleName: 'Production',  q: -2, r: 2, illustration: 'placeholder', available: true },
  { slug: '/compilers/production/operator-fusion',  fallback: '/compilers/production', title: 'Operator Fusion',        summary: 'Inductor\'s fusion heuristics; saving memory traffic.',              track: 'compilers', moduleName: 'Production',  q: -1, r: 2, illustration: 'placeholder', available: true },
  // Module: Kernel DSLs & Hardware
  { slug: '/compilers/kernels/triton',              fallback: '/compilers/kernels', title: 'Triton',                 summary: 'Block-programming for fast GPU kernels — no raw CUDA.',               track: 'compilers', moduleName: 'Kernels & HW', q: -4, r: 3, illustration: 'placeholder', available: true },
  { slug: '/compilers/kernels/cute-cutlass',        fallback: '/compilers/kernels', title: 'CuTe & CUTLASS 4',       summary: 'NVIDIA\'s tile-level layout language for Hopper/Blackwell.',           track: 'compilers', moduleName: 'Kernels & HW', q: -3, r: 3, illustration: 'placeholder', available: true },
  { slug: '/compilers/kernels/thunderkittens',      fallback: '/compilers/kernels', title: 'ThunderKittens & TileLang', summary: 'New tile DSLs from Stanford & friends — terser than Triton.',        track: 'compilers', moduleName: 'Kernels & HW', q: -2, r: 3, illustration: 'placeholder', available: true },
  { slug: '/compilers/kernels/hardware-landscape',  fallback: '/compilers/kernels', title: 'Hardware Landscape 2026', summary: 'Blackwell · MI355X · TPU v6 · Cerebras · Groq — what each is for.',  track: 'compilers', moduleName: 'Kernels & HW', q: -1, r: 3, illustration: 'placeholder', available: true },

  // ════════════════════ APPLIED AI (teal) ════════════════════
  // Module: Talking to LLMs
  { slug: '/applied/llm-basics/prompting',          fallback: '/applied/llm-basics', title: 'Prompt Engineering',     summary: 'Few-shot, CoT, self-consistency — when each helps and when it cargo-cults.', track: 'applied', moduleName: 'LLM Basics', q: 1, r: 1, illustration: 'placeholder', available: true },
  { slug: '/applied/llm-basics/structured-output',  fallback: '/applied/llm-basics', title: 'Structured Output',      summary: 'JSON mode, Pydantic, Outlines — guarantee valid output.',                 track: 'applied', moduleName: 'LLM Basics', q: 2, r: 1, illustration: 'placeholder', available: false },
  { slug: '/applied/llm-basics/tool-use',           fallback: '/applied/llm-basics', title: 'Function Calling',       summary: 'Build a 3-tool weather assistant. Hands-on, runs in Colab.',              track: 'applied', moduleName: 'LLM Basics', q: 3, r: 1, illustration: 'placeholder', available: true },
  { slug: '/applied/llm-basics/embeddings',         fallback: '/applied/llm-basics', title: 'Embeddings',             summary: 'Dense vs sparse, contrastive training, Matryoshka truncation.',             track: 'applied', moduleName: 'LLM Basics', q: 4, r: 1, illustration: 'placeholder', available: false },
  // Module: RAG & Agents
  { slug: '/applied/rag-agents/rag-basics',         fallback: '/applied/rag-agents', title: 'RAG Fundamentals',       summary: 'Chunk → hybrid search → rerank → generate. With a working notebook.',     track: 'applied', moduleName: 'RAG & Agents', q: 1, r: 2, illustration: 'placeholder', available: true },
  { slug: '/applied/rag-agents/advanced-rag',       fallback: '/applied/rag-agents', title: 'Advanced RAG',           summary: 'HyDE, GraphRAG, agentic retrieval — when naive RAG fails.',               track: 'applied', moduleName: 'RAG & Agents', q: 2, r: 2, illustration: 'placeholder', available: true },
  { slug: '/applied/rag-agents/react-agents',       fallback: '/applied/rag-agents', title: 'Build a ReAct Agent',    summary: 'Implement ReAct from scratch in 80 lines. Solve real tasks.',             track: 'applied', moduleName: 'RAG & Agents', q: 3, r: 2, illustration: 'placeholder', available: false },
  { slug: '/applied/rag-agents/mcp',                fallback: '/applied/rag-agents', title: 'Model Context Protocol', summary: 'Expose tools, resources, prompts to any LLM client. Build a server.',     track: 'applied', moduleName: 'RAG & Agents', q: 4, r: 2, illustration: 'placeholder', available: false },
  // Module: Serve & Ship
  { slug: '/applied/serve/vllm-sglang',             fallback: '/applied/serve', title: 'vLLM & SGLang',          summary: 'Pick a serving stack and benchmark it. PagedAttention vs RadixAttention.', track: 'applied', moduleName: 'Serve & Ship', q: 1, r: 3, illustration: 'placeholder', available: true },
  { slug: '/applied/serve/on-device',               fallback: '/applied/serve', title: 'On-Device Inference',     summary: 'llama.cpp, MLX, ExecuTorch — run a 4-bit model on your phone.',           track: 'applied', moduleName: 'Serve & Ship', q: 2, r: 3, illustration: 'placeholder', available: true },
  { slug: '/applied/serve/cost-latency',            fallback: '/applied/serve', title: 'Cost & Latency',          summary: 'Prompt caching, batching, model routing — get 5–10× cheaper.',           track: 'applied', moduleName: 'Serve & Ship', q: 3, r: 3, illustration: 'placeholder', available: true },
  { slug: '/applied/serve/observability',           fallback: '/applied/serve', title: 'Observability',           summary: 'Tracing, online evals, A/B with Langfuse. See what users actually do.',    track: 'applied', moduleName: 'Serve & Ship', q: 4, r: 3, illustration: 'placeholder', available: true },
  // Module: Frontier & Capstone
  { slug: '/applied/frontier/multimodal',           fallback: '/applied/frontier', title: 'Multimodal (Vision)',   summary: 'CLIP, SigLIP, VLMs — image search + chart QA in your browser.',           track: 'applied', moduleName: 'Frontier',    q: 1, r: 4, illustration: 'placeholder', available: false },
  { slug: '/applied/frontier/audio',                fallback: '/applied/frontier', title: 'Audio & Voice',         summary: 'Whisper + Claude + Kokoro — a voice agent end-to-end.',                    track: 'applied', moduleName: 'Frontier',    q: 2, r: 4, illustration: 'placeholder', available: false },
  { slug: '/applied/frontier/safety',               fallback: '/applied/frontier', title: 'Safety & Injection',    summary: 'Llama Guard, dual-LLM, spotlighting — defense-in-depth that actually works.', track: 'applied', moduleName: 'Frontier', q: 3, r: 4, illustration: 'placeholder', available: false },
  { slug: '/applied/frontier/capstone',             fallback: '/applied/frontier', title: 'Capstone: Ship It',     summary: 'Build, eval, and deploy a production RAG-agent in one weekend.',          track: 'applied', moduleName: 'Frontier',    q: 4, r: 4, illustration: 'placeholder', available: false },
]

export const ANCHOR_TILES = ['stack-vs-heap', 'gemm', 'rope', 'kv-cache', 'mlir']

export function tilesByTrack(): Record<TrackKey, Tile[]> {
  const out: Record<TrackKey, Tile[]> = {
    foundations: [],
    'ml-execution': [],
    training: [],
    'llm-architecture': [],
    compilers: [],
    applied: [],
  }
  for (const t of TILES) out[t.track].push(t)
  return out
}
