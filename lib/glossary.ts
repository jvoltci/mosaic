/**
 * Glossary for inline <Term name="..."> tooltips.
 *
 * Keep entries short — 1–3 sentences, plain English, written for a CS engineer
 * who knows high-level languages but is new to systems / ML internals.
 *
 * Add a new entry the first time a lesson needs it; keep names lowercase.
 */

export type GlossaryEntry = {
  short: string
  longer?: string
}

export const glossary: Record<string, GlossaryEntry> = {
  stack: {
    short:
      'A small, fast region of memory tied to function calls. Variables declared inside a function live here and are freed automatically when the function returns. Think of a stack of plates — push on entry, pop on return.',
  },
  heap: {
    short:
      'A general-purpose pool of memory you ask for explicitly (via `new`, `malloc`, etc). The runtime has to find a free block, hand it back, and you (or a garbage collector) are responsible for releasing it later.',
  },
  'garbage collection': {
    short:
      'A background process in managed languages (Python, Java, JavaScript, Go) that periodically scans memory, finds objects nothing is using, and frees them. Convenient — but it occasionally pauses your program to do its work.',
  },
  gc: {
    short:
      'Short for garbage collection. A background process in managed languages that frees memory you no longer reference, at the cost of unpredictable pauses.',
  },
  allocator: {
    short:
      'The piece of code that hands out heap memory when you ask for it. It tracks which blocks are free, finds one big enough, and returns a pointer to it. Common production allocators: glibc malloc, jemalloc, tcmalloc, mimalloc.',
  },
  malloc: {
    short:
      'The classic C function for asking the heap allocator for a chunk of memory. Returns a pointer; you must `free()` it later or it leaks.',
  },
  'page fault': {
    short:
      'When your program touches a virtual memory address that has no real RAM behind it yet, the CPU traps to the OS, which assigns a physical page and resumes you. Usually invisible — but the round-trip costs ~1 microsecond, which is a lot in a hot loop.',
  },
  'lifo': {
    short:
      'Last-In, First-Out. The data-structure rule the call stack follows: the most recently entered function is the first to leave. Like a stack of plates — you can only take from the top.',
  },
  raii: {
    short:
      'Resource Acquisition Is Initialization. The C++ idiom where a resource (heap memory, file handle, lock) is owned by a stack object whose destructor releases it. When the stack object falls out of scope, cleanup runs automatically — like deterministic, predictable garbage collection.',
  },
  'register': {
    short:
      'A tiny slot of storage inside the CPU itself — single-cycle access, the fastest memory there is. The "stack pointer" register is just a register holding the address of the top of the call stack.',
  },
  'cache miss': {
    short:
      'When the CPU asks for data that isn\'t in its on-chip cache (L1/L2/L3) and has to fetch it from main RAM. ~100× slower than a hit. The single biggest source of unexplained slowness in tight loops.',
  },
  'cache line': {
    short:
      'The unit of data the CPU moves between RAM and its on-chip caches — typically 64 bytes. You never load just one byte; you load the whole line containing it. This is why traversing memory sequentially is so much faster than jumping around.',
  },
  fragmentation: {
    short:
      'When the heap has plenty of total free memory, but it\'s scattered in chunks too small to satisfy a large request. Long-running processes that allocate and free in unpredictable patterns suffer most.',
  },
  jemalloc: {
    short:
      'A production-grade memory allocator developed at Facebook, famous for low fragmentation and good multi-threaded scaling. A common drop-in replacement for the default system malloc.',
  },
  ptmalloc: {
    short:
      'The default heap allocator in glibc (the C standard library on Linux). Solid baseline, but tends to lose to jemalloc / tcmalloc under heavy contention.',
  },
  tcmalloc: {
    short:
      'Google\'s thread-caching malloc. Each thread keeps a private cache of small free blocks, so most allocations don\'t need a global lock — making it especially fast in heavily multi-threaded servers.',
  },
  'hot path': {
    short:
      'The piece of code your program spends most of its time in — typically the inner loop of a request, a frame, or a token. Optimizations here move the needle; optimizations elsewhere usually don\'t.',
  },
  mmap: {
    short:
      'A system call that maps a file (or anonymous memory) directly into your process\'s address space. Used by allocators for large chunks (>~128KB), and by tools that load big files without a copy.',
  },
  tlb: {
    short:
      'Translation Lookaside Buffer. A tiny CPU cache that remembers virtual-to-physical address translations. A miss here forces the CPU to walk the page tables, which costs ~100 ns even before the actual memory access.',
  },
  vector: {
    short:
      '`std::vector<T>` in C++ — a dynamically resizable array. The header (size, capacity, pointer) lives wherever you declared it; the actual data buffer always lives on the heap.',
  },
  'kv cache': {
    short:
      'Short for key-value cache. The tensor that stores the keys and values from every token an LLM has already processed, so generating the next token doesn\'t recompute attention over the whole prompt. Pre-allocating this once is the canonical "no allocations on the hot path" pattern.',
  },
  'inference': {
    short:
      'Running a trained model to get predictions — the deployment side of ML, as opposed to training. Latency-sensitive: the user is waiting for the answer.',
  },
  'lock contention': {
    short:
      'When multiple threads try to grab the same mutex/lock at once and end up waiting for each other instead of doing work. A heap allocator with one global lock becomes a bottleneck under enough threads.',
  },
  rvalue: {
    short:
      'A temporary expression with no name you can take the address of — like the literal `5` in `int x = 5;`, or the result of `a + b`. C++ uses the rvalue/lvalue distinction to decide when it can safely steal data instead of copying.',
  },
  lvalue: {
    short:
      'A named, addressable expression — anything that has an identity you can refer to later: variables, array elements, dereferenced pointers. The opposite of an rvalue.',
  },
  rvo: {
    short:
      'Return Value Optimization. The compiler trick where a function building a local object on the way to returning it constructs that object directly in the caller\'s memory — no copy, no move. Often makes naive `return v;` literally free.',
  },
  destructor: {
    short:
      'A special method (`~ClassName()`) that runs automatically when an object goes out of scope. The C++ mechanism that powers RAII — files close, locks release, memory frees, all without you typing the cleanup explicitly.',
  },
  'spatial locality': {
    short:
      'The principle that programs tend to access memory addresses near the ones they just used. Cache hardware exploits it by fetching whole 64-byte cache lines, not just the byte you asked for.',
  },
  'temporal locality': {
    short:
      'The principle that programs tend to re-access the same memory address shortly after touching it. Caches exploit it by keeping recently-used data resident.',
  },
  aos: {
    short:
      'Array of Structures. Lay out objects whole-by-whole in memory: `x0, y0, z0, x1, y1, z1, …`. Good when your hot loop touches multiple fields per object together.',
  },
  soa: {
    short:
      'Structure of Arrays. Lay out memory field-by-field: `x0, x1, x2, …  y0, y1, y2, …`. Good when your hot loop touches only one field across many objects — every cache line is full of useful data.',
  },
  'false sharing': {
    short:
      'When two threads update different variables that happen to live in the same 64-byte cache line, the line ping-pongs between cores even though there\'s no real conflict. Pad shared atomics to 64-byte boundaries to fix it.',
  },
  ipc: {
    short:
      'Instructions Per Cycle — how many work units the CPU is retiring per clock tick. Modern cores can sustain 3–4. IPC under 1 usually means you\'re memory-bound; IPC over 2 means you\'re compute-bound.',
  },
  cmov: {
    short:
      'Conditional move — an x86 instruction that copies a value only if a condition flag is set, with no branch. Lets compilers replace small `if/else` blocks with branchless code, dodging misprediction risk.',
  },
  'speculative execution': {
    short:
      'The CPU\'s strategy of guessing which way a branch will go and starting work on the predicted path before knowing the answer. If right, free speedup. If wrong, the pipeline gets flushed and the work is thrown away.',
  },
  pipeline: {
    short:
      'The CPU\'s assembly-line architecture: at any moment, 15–20 instructions are in flight at different stages (fetch, decode, execute, write-back). This is what lets a chip running at a few GHz retire multiple instructions per cycle.',
  },
  numa: {
    short:
      'Non-Uniform Memory Access. On multi-socket servers, each CPU has its own attached RAM. Memory on the same socket is fast; memory on the other socket goes through a cross-socket link and costs ~2× the latency.',
  },
  nvlink: {
    short:
      'NVIDIA\'s direct GPU-to-GPU interconnect. ~600 GB/s on H100/H200 — about 10× faster than PCIe. The reason intra-node tensor parallelism is feasible.',
  },
  nvswitch: {
    short:
      'A switch chip that gives every GPU in a node full-bandwidth NVLink to every other GPU. Turns 8 (or 72 on GB200) GPUs into "one big GPU" from the comm perspective.',
  },
  infiniband: {
    short:
      'Low-latency, high-bandwidth networking standard for HPC and AI clusters. 200–400 Gb/s, RDMA-native. Standard inter-node fabric in serious training clusters.',
  },
  rdma: {
    short:
      'Remote Direct Memory Access. Lets one machine read/write another\'s memory without involving its CPU. Underlies InfiniBand, RoCE, and modern AI cluster comm — moving GPU memory across hosts without round-tripping through the kernel.',
  },
  cxl: {
    short:
      'Compute Express Link. Emerging cache-coherent fabric over PCIe that lets CPUs and accelerators share memory pools across machines. Production deployment 2024–2026; could reshape how multi-host AI systems are built.',
  },
  mutex: {
    short:
      'Mutual Exclusion lock. Only one thread can hold it at a time; others block until it\'s released. The general-purpose synchronization primitive — slow when contended, fine when not.',
  },
  'atomic variable': {
    short:
      'A variable whose reads and writes are guaranteed indivisible — no other thread can see a half-updated value. Cheaper than a mutex (one or two CPU cycles) but only works on single primitives like ints and pointers.',
  },
  gil: {
    short:
      'CPython\'s Global Interpreter Lock. A single lock that prevents two threads from running Python bytecode at once. C extensions (NumPy, PyTorch) release it during heavy compute, which is why threads still help for ML workloads.',
  },
  coroutine: {
    short:
      'A function that can pause itself mid-execution (`await`), let other code run, then resume later from exactly where it stopped. The mechanism behind every async runtime.',
  },
  'event loop': {
    short:
      'The core of an async runtime — a single thread that keeps a queue of ready coroutines, runs each until the next `await`, then picks the next ready one. One thread, thousands of concurrent operations.',
  },
  'cuda stream': {
    short:
      'An ordered queue of GPU operations. Operations on the same stream run in order; operations on different streams can run concurrently. The GPU-side cousin of an event loop.',
  },
  simd: {
    short:
      'Single Instruction, Multiple Data — CPU instructions that operate on 4–16 numbers at once instead of one. AVX-512 does 16 FP32 ops per instruction; ARM NEON does 4. The parallelism that lives below threading.',
  },
  avx: {
    short:
      'Advanced Vector Extensions — Intel/AMD\'s SIMD instruction families. AVX (128-bit, 4 floats), AVX2 (256-bit, 8 floats), AVX-512 (512-bit, 16 floats). The wider the version, the more lanes per instruction.',
  },
  neon: {
    short:
      'ARM\'s SIMD instruction set, the analogue of x86\'s AVX. 128-bit, 4 FP32 lanes. On Apple Silicon and most modern phones — the SIMD that runs llama.cpp on your laptop.',
  },
  intrinsic: {
    short:
      'A C/C++ function that compiles to a specific CPU instruction, used to write SIMD code by hand. `_mm256_loadu_ps` loads 8 floats at once on AVX2; the compiler emits the matching machine instruction with no wrapper overhead.',
  },
  amx: {
    short:
      'Advanced Matrix Extensions — CPU instructions that operate on whole matrix tiles (32×32 or similar) in one instruction. Apple Silicon has its own AMX; Intel ships a separate AMX on Sapphire Rapids+. The CPU\'s answer to GPU tensor cores.',
  },
  arena: {
    short:
      'A pre-allocated chunk of memory that hands out sub-allocations very cheaply (just bump a pointer) and is freed all at once at the end. Skips per-object bookkeeping. Common pattern for per-request scratch space.',
  },
  flamegraph: {
    short:
      'A profiler visualization invented by Brendan Gregg. X-axis is sample count (i.e. CPU time); Y-axis is call-stack depth. Wide flames = hot. Once you read one you never want a flat profile again.',
  },
  ebpf: {
    short:
      'Extended Berkeley Packet Filter — a Linux mechanism that runs sandboxed programs inside the kernel to observe syscalls, function entries, and hardware counters with very low overhead. The basis of modern always-on production profilers.',
  },
  quantization: {
    short:
      'Storing model weights (and sometimes activations or KV cache) in a smaller numeric format than they were trained in — FP16 → FP8 → INT4 → FP4. The point is to halve or quarter HBM traffic, since decode is bandwidth-bound. Done well, the quality cost is well under one MMLU point.',
  },
  'tensor core': {
    short:
      'A specialized matrix-multiply unit on modern NVIDIA GPUs (and the AMD/Apple equivalents) that does a small fixed-shape mma in one instruction. Hopper added FP8 tensor cores; Blackwell added FP4. Code that hits them runs an order of magnitude faster than scalar SIMT.',
  },
  outlier: {
    short:
      'In LLM activations, a small number of channels — often around 1% — whose magnitudes are 10–100× the rest. They wreck naive quantization because per-tensor scales get pulled wide to fit them, leaving everyone else with too few quantization levels. Rotation, AWQ, and SmoothQuant are all responses to this one problem.',
  },
  'calibration data': {
    short:
      'A small batch (typically 128–512 sequences from C4, WikiText, or your own corpus) that you run through a model to record activation statistics — magnitudes, Hessians, channel-wise scales. Quantization recipes like GPTQ and AWQ use this to pick scales without retraining the model.',
  },
  'quantization group': {
    short:
      'A chunk of contiguous weights that share one scale factor. Group size 32, 64, or 128 is standard for INT4 / FP4. Smaller groups → tighter dynamic-range fit → less error, at the cost of more metadata per weight.',
  },
  awq: {
    short:
      'Activation-aware Weight Quantization (Lin et al., 2024). Identifies "salient" weight channels — the ones paired with high-magnitude activations — and protects them via a per-input-channel scale before quantizing. Same total bits as naive INT4, lower output error.',
  },
  gptq: {
    short:
      'Frantar et al., 2022. Iteratively quantize weights one column at a time, using the Hessian of the reconstruction loss to spread each column\'s error onto the still-unquantized columns. Slower to apply than AWQ; slightly worse on most modern models.',
  },
  hadamard: {
    short:
      'A 2^k × 2^k matrix of ±1/√n entries that is its own (transposed) inverse and "mixes" any input vector into one with evenly-distributed coordinate magnitudes. Computable in O(d log d) time like an FFT. The standard cheap orthogonal rotation for outlier flattening.',
  },
  microscaling: {
    short:
      'The OCP family of formats (MXFP4, MXFP6, MXFP8) that store one tiny scale factor per block of 32 elements. The block-FP idea — narrow elements, frequent scales — is what makes 4-bit weights tractable on Blackwell tensor cores.',
  },
  wgmma: {
    short:
      'Warpgroup matrix-multiply-accumulate — the Hopper-and-newer tensor-core instruction that issues an asynchronous mma over a warp group (128 threads). The FP8 / FP4 variants are how production inference kernels get their throughput.',
  },
  ptx: {
    short:
      'Parallel Thread Execution — NVIDIA\'s GPU assembly-like IR. CUDA C++ compiles to PTX, and PTX compiles (just-in-time) to the GPU\'s real binary. Inline PTX (`asm volatile(...)`) is how you hand-code instructions like wgmma when CUTLASS won\'t do the job.',
  },
  gguf: {
    short:
      'GPT-Generated Unified Format — the file format llama.cpp uses for quantized models. Bundles weights, K-quant metadata, and tokenizer in one mmap-friendly file. The de-facto standard for shipping local-LLM checkpoints.',
  },
  ggml: {
    short:
      'A tiny C tensor library (~10K LOC) authored by Georgi Gerganov. The compute layer underneath llama.cpp and whisper.cpp — defines the tensor type, the op graph, and per-backend kernels (CPU/Metal/CUDA/Vulkan). The "PyTorch" of the local-inference world, with a fraction of the surface area.',
  },
  'k-quants': {
    short:
      'llama.cpp\'s family of post-training quantization formats (Q2_K through Q6_K). Super-blocks of 256 weights with sub-block scales, mixing 4-bit and 6-bit precision for "important" vs "ordinary" weights. Beats naive INT4 by 0.5–1 pt MMLU at the same bit budget — no calibration data needed.',
  },
  ane: {
    short:
      'Apple Neural Engine — Apple\'s NPU, present on every recent iPhone (A11+) and Apple Silicon Mac. ~38 TOPS at INT8 on M4. Optimized for FP16 matmul/conv and transformer patterns; runs the on-device half of Apple Intelligence. Static shapes, FP16-preferred, picky about ops.',
  },
  palettization: {
    short:
      'Apple\'s flavor of weight quantization: store each weight as a small index (e.g., 4 bits) into a per-tensor lookup table of FP16 values. The ANE has hardware LUT-lookup support, so palettized weights run natively; generic INT4 has to dequantize to FP16 in software and falls off the ANE.',
  },
  wgsl: {
    short:
      'WebGPU Shading Language — the W3C-standard kernel language for WebGPU. Rust-flavored syntax, compute shaders, ~CUDA-shaped programming model. The browser JIT-compiles WGSL to whatever the device GPU speaks: Metal on Apple, D3D12 on Windows, Vulkan on Linux/Android. Same source, every modern browser.',
  },
  ssa: {
    short:
      'Static Single Assignment — the compiler IR convention that every register-like value is defined exactly once. Trivial assignment becomes hard at control-flow merges, where SSA uses PHI nodes to pick the right incoming value. The form every modern optimizer reasons in.',
  },
  'llvm ir': {
    short:
      'LLVM\'s strongly-typed, SSA, RISC-like virtual instruction set. The "language" between your source compiler and the actual machine. Three forms — `.ll` text, `.bc` bitcode, in-memory C++ Module — all the same IR. Almost every modern compiler eventually emits it.',
  },
  mlir: {
    short:
      'Multi-Level IR. A framework for representing programs at many levels of abstraction simultaneously: tensor ops at the top, GPU ops in the middle, LLVM IR at the bottom. Each level is a "dialect." Every modern AI compiler — Triton, IREE, XLA, ExecuTorch — is built on it.',
  },
  dialect: {
    short:
      'In MLIR, a namespace bundling related ops and types. `linalg.matmul`, `tensor.empty`, `gpu.launch` — same IR file, three different dialects. Adding a new dialect is cheap, which is how every hardware vendor plugs in their NPU support.',
  },
  lowering: {
    short:
      'A pass that rewrites IR from a higher-level dialect to a lower-level one. Same semantics, different representation. Stack 5–10 lowerings end-to-end and you go from `linalg` to `llvm` — that is the entire skeleton of a modern AI compiler.',
  },
  bufferization: {
    short:
      'The lowering that turns immutable tensors (values) into mutable memrefs (concrete buffers in memory). It\'s where allocation decisions get made — pre-bufferization the compiler doesn\'t even know how many buffers the program needs.',
  },
  fusion: {
    short:
      'Generating one kernel that does a chain of operations, keeping intermediates in registers instead of round-tripping through HBM. The single biggest perf lever in AI graph compilers — a 12-op pointwise chain becomes one kernel, ~6× less memory traffic.',
  },
  triton: {
    short:
      'OpenAI\'s Python-syntax kernel DSL. You write what looks like NumPy on tiles; the compiler emits register-tiled, SMEM-staged, tensor-core-using GPU kernels. The default kernel language of vLLM, FlashAttention, torch.compile\'s codegen, and most 2026 OSS kernel work.',
  },
  cutlass: {
    short:
      'NVIDIA\'s open-source C++ template library for GEMM-class kernels. The reference for "how to write a fast tensor-core kernel." Hand-written CUTLASS still beats Triton by 5–10% on edge cases and is how kernels land on day one of a new architecture.',
  },
  cute: {
    short:
      'CUTLASS\'s layout sublanguage (CUTLASS 3.x+). A small algebra over `(shape, stride)` pairs that expresses every layout you need: SMEM tiles, register fragments, TMA descriptors, swizzle patterns. One algebra, many uses.',
  },
  inductor: {
    short:
      'PyTorch\'s graph-to-kernel codegen, the third stage of `torch.compile`. Receives an FX graph, fuses pointwise ops, lowers to Triton kernels for GPU and C++ for CPU. The most-deployed AI compiler in 2026 by orders of magnitude.',
  },
  dynamo: {
    short:
      'PyTorch\'s graph capture system, the first stage of `torch.compile`. Hooks into CPython\'s frame evaluation API and rewrites bytecode on the fly to extract an FX graph. Inserts "graph breaks" when it hits Python it can\'t trace.',
  },
  xla: {
    short:
      'Google\'s long-standing graph compiler (~2017+). Does fusion, layout assignment, codegen for GPU/TPU/CPU. Production compiler that runs Gemini and every Google production model. The JAX/TF-side analog of PyTorch\'s Inductor.',
  },
  stablehlo: {
    short:
      'A stable subset of HLO (XLA\'s op set), the IR JAX `jit` traces to. The OpenXLA-specified handoff format between research frameworks and the XLA compiler.',
  },
  pallas: {
    short:
      'JAX\'s kernel DSL — Triton-shaped, but with a TPU backend (Mosaic) in addition to GPU. The same Pallas function lowers to Triton on GPU and Mosaic on TPU. The only ergonomic way to write custom TPU kernels outside Google.',
  },
  iree: {
    short:
      'Intermediate Representation Execution Environment — Google\'s open-source MLIR-based compiler + runtime. Compiles models from any StableHLO frontend to a portable artifact (`.vmfb`) that runs on CPU, GPU, NPU, edge silicon. Strongest production story for cross-vendor edge deployment.',
  },
  executorch: {
    short:
      'PyTorch\'s mobile runtime. Takes a `torch.export()`-d graph, lowers through MLIR, produces a `.pte` artifact you bundle in an iOS/Android app. AOT-compiled, no Python at runtime, ~few hundred KB runtime overhead.',
  },
  autotune: {
    short:
      'Compile each candidate kernel config (different block sizes, warp counts, pipeline stages), benchmark on the actual GPU at the actual shapes, cache the winner. What `@triton.autotune` does on first call. The reason Triton can match hand-tuned CUTLASS without per-shape hand-tuning.',
  },
  tma: {
    short:
      'Tensor Memory Accelerator — Hopper\'s hardware unit for asynchronous bulk copies between HBM and SMEM, driven by a tensor descriptor instead of per-thread loads. The instruction is `cp.async.bulk.tensor`. Crucial for warp-specialized kernels and the FlashAttention-3 design.',
  },
  swizzle: {
    short:
      'A bit-twiddling pattern (typically XOR-with-row) applied to SMEM addresses to scatter accesses across memory banks, eliminating bank conflicts. CUTLASS expresses it as a `Swizzle<B, M, S>` Layout op; you pick parameters that match your access pattern.',
  },
  'cuda graph': {
    short:
      'A pre-recorded sequence of GPU launches that can be replayed with one CPU API call, bypassing the per-launch ~5–10 µs overhead. `torch.compile(mode="reduce-overhead")` captures the whole step into one graph. Crucial for small-kernel-heavy workloads.',
  },
  hbm: {
    short:
      'High Bandwidth Memory — the stacked DRAM that lives next to a modern GPU die. ~3–8 TB/s of bandwidth, ~80–288 GB of capacity. Decode and most LLM inference is HBM-bandwidth-bound, which is why halving bytes per weight (FP8, INT4) translates directly to faster decode.',
  },
  sft: {
    short:
      'Supervised Fine-Tuning — the first post-training step, where a pretrained autocompleter is trained on (instruction, response) pairs to follow directions. Every chatbot, coding assistant, and agentic model passes through SFT before any preference-based alignment (DPO, RLHF) or RL (GRPO).',
  },
  'chat template': {
    short:
      'The special-token wrapping that delineates system/user/assistant turns in an LLM conversation. Llama 3, ChatML (Qwen/Mistral), and Gemini use different templates, and a model is bound to whichever one it was trained with. Always call `tokenizer.apply_chat_template()` — formatting manually is the #1 source of broken fine-tunes.',
  },
  'prompt loss masking': {
    short:
      'Setting label tokens to `-100` for the prompt portion of an SFT sequence so cross-entropy loss is computed only on the assistant response. PyTorch\'s `CrossEntropyLoss` skips `-100` by design. Without this, the model wastes capacity learning to predict instruction tokens it will never have to generate.',
  },
  'sample packing': {
    short:
      'Concatenating multiple short training conversations into one long sequence — with a block-diagonal attention mask so they can\'t see each other — to eliminate `<pad>` waste. 2–4× training throughput on typical chat datasets. FlashAttention exposes this via `cu_seqlens`; HF Trainer ships it as a dataset option.',
  },
  lora: {
    short:
      'Low-Rank Adaptation (Hu et al., 2021). Freeze the pretrained weights and train two small low-rank matrices `A·B` on top of every linear layer. Cuts trainable parameters by 100–1000× with negligible quality loss. The default fine-tuning method when you don\'t have unlimited GPUs.',
  },
  trl: {
    short:
      'Hugging Face\'s Transformer Reinforcement Learning library. Provides `SFTTrainer`, `DPOTrainer`, `GRPOTrainer`, and friends — the standard entry points for post-training. Sits on top of `transformers` + `accelerate`; what every modern post-training recipe imports.',
  },
  bf16: {
    short:
      'Brain Float 16 — same exponent range as FP32 (~10^38) packed into 16 bits, with a 7-bit mantissa instead of FP32\'s 23. Avoids the overflow problems that plagued FP16 mixed-precision training; the default dtype for SFT, DPO, and most LLM fine-tunes on Ampere or newer.',
  },
  'flash attention': {
    short:
      'A drop-in replacement for the attention layer that tiles `softmax(QKᵀ)·V` over SMEM, never materializing the full N×N attention matrix in HBM. Memory drops from O(N²) to O(N); throughput rises 2–4× on long sequences. Tri Dao, 2022; FlashAttention-3 ships in PyTorch 2.5+.',
  },
  dpo: {
    short:
      'Direct Preference Optimization (Rafailov et al., 2023). A closed-form supervised loss on (prompt, chosen, rejected) triples that replaces PPO-RLHF\'s reward model + rollout + RL pipeline. Trains the policy to make `log π(chosen) − log π(rejected)` larger relative to a frozen reference. Same gradient direction as RLHF, fraction of the infrastructure.',
  },
  rlhf: {
    short:
      'Reinforcement Learning from Human Feedback. Train a reward model on human preference labels, then use PPO to optimize the policy against that reward (with a KL penalty against an SFT reference). The 2022-era post-training stack — superseded by DPO for general preferences and GRPO for verifiable rewards.',
  },
  ppo: {
    short:
      'Proximal Policy Optimization (Schulman et al., 2017). The classical RL algorithm that powered RLHF: importance-sampled gradient with a clip term to prevent runaway updates, plus a learned value function as the variance-reduction baseline. GRPO drops the value function; DPO drops the whole RL loop.',
  },
  'reference policy': {
    short:
      'A frozen copy of the SFT model used as the anchor during DPO/GRPO/RLHF. The KL divergence between the learning policy and this reference is what keeps the policy from drifting into pathological regions while it optimizes the new objective. Sometimes called the "anchor" or "ref model."',
  },
  'bradley-terry': {
    short:
      'The standard preference model: P(A beats B) = σ(reward(A) − reward(B)). DPO\'s entire derivation is "what if I write the optimal policy as the implicit reward, then plug it back into Bradley-Terry?" The answer is the DPO loss.',
  },
  kto: {
    short:
      'Kahneman-Tversky Optimization (Ethayarajh et al., 2024). A preference-tuning loss that uses unary thumbs-up / thumbs-down labels instead of (chosen, rejected) pairs. Derived from prospect theory, with loss-aversion built in. The natural fit when production feedback is naturally unary.',
  },
  peft: {
    short:
      'Parameter-Efficient Fine-Tuning. Family of techniques (LoRA, QLoRA, DoRA, prompt-tuning, IA³) that train a tiny fraction of model parameters while leaving the base frozen. Hugging Face\'s `peft` library is the canonical implementation. The reason every "I fine-tuned a model on my data" blog post since 2023 is feasible.',
  },
  qlora: {
    short:
      'Dettmers et al., 2023. LoRA + 4-bit NF4 quantization of the frozen base model. Fits Llama-3-70B fine-tuning into a single 80 GB H100. Adds double-quantization and paged optimizers to push memory further; the recipe behind almost every consumer-GPU LLM fine-tune.',
  },
  nf4: {
    short:
      'NormalFloat 4-bit — a 4-bit datatype designed for storing weights that are roughly normally distributed (which LLM weights mostly are). Quantization levels are placed at quantiles of a unit normal, making it information-theoretically optimal for normal-shaped data. The default quantization for QLoRA.',
  },
  dora: {
    short:
      'Weight-Decomposed Low-Rank Adaptation (Liu et al., 2024). Decomposes each fine-tuning update into magnitude + direction, then trains both. Closes most of the LoRA→full-FT quality gap at ~5% extra training cost. Drop-in replacement for LoRA when quality matters.',
  },
  grpo: {
    short:
      'Group Relative Policy Optimization (DeepSeek, 2024). Sample G rollouts per prompt, score each with a verifier, normalize rewards within the group, take a PPO-style gradient. No value function — group-relative normalization replaces the learned critic. The recipe behind DeepSeek-R1 and the open default for reasoning post-training.',
  },
  'verifiable reward': {
    short:
      'A reward signal that can be computed by a deterministic checker rather than a learned reward model — exact-match for math answers, unit tests for code, format checks for structured output. Lets RL skip the "train a reward model" step entirely; the unlock that made GRPO work.',
  },
  'value function': {
    short:
      'In RL, a learned estimate of "expected future reward from this state." PPO uses a value head trained alongside the policy to compute advantages (reward − baseline). GRPO replaces it with the mean of group-relative rewards — saving a separate critic network and a known source of training instability.',
  },
  autograd: {
    short:
      'PyTorch\'s reverse-mode automatic differentiation engine. Every forward op records itself onto a per-tensor "tape" with a closure that knows how to compute the op\'s VJP. `.backward()` does a topological walk in reverse, calling each closure with the upstream gradient. ~600 lines of clever bookkeeping; everything else is per-op math.',
  },
  vjp: {
    short:
      'Vector-Jacobian Product. For an op with inputs and outputs, the Jacobian J is usually huge — but `Jᵀv` (a vector of input shape) is what backward actually computes. Most ops have closed-form VJPs that fit on one line. The right mental model for `.backward()` — never think Jacobians, always think Jᵀv.',
  },
  'gradient checkpointing': {
    short:
      'Trade compute for memory: don\'t save all forward activations; save only at marked checkpoints, recompute the rest during backward. Drops activation memory from O(L) to O(√L) for a network of L layers. Megatron\'s "selective recompute" picks *which* activations to keep based on cost — the production default. ~5% extra compute for 3–5× lower activation memory.',
  },
  adamw: {
    short:
      'Adam with decoupled weight decay (Loshchilov & Hutter, 2017). Per-parameter LR scaling via running first and second moments of the gradient, with weight decay applied directly to the parameter (not folded into the gradient). 12 bytes/param of optimizer state in FP32; the workhorse for almost all LLM pretraining 2018–2024.',
  },
  lion: {
    short:
      'Symbolic-search-discovered optimizer (Chen et al., 2023). Keeps one momentum buffer, takes `sign()` of the interpolated momentum-plus-gradient as the update. Half the optimizer state of AdamW; matches it on most language tasks at ~1/3 the learning rate. The "what if we just took signs?" optimizer.',
  },
  muon: {
    short:
      'Optimizer that orthogonalizes hidden-layer weight updates via a 5-step Newton-Schulz iteration on the momentum buffer (Jordan et al., 2024). Acts as a cheap matrix preconditioner for matmul weights; ~30% faster convergence than AdamW per token on language modeling. Embeddings + heads stay AdamW. Frontier choice in 2024–2025; reportedly used in Llama-4.',
  },
  wsd: {
    short:
      'Warmup-Stable-Decay learning-rate schedule. Short linear warmup, long stable plateau at peak LR, short cosine cooldown. The killer feature: you don\'t have to commit to a step count up front — train at peak indefinitely, decay when you decide. MiniCPM, DeepSeek-V3, and Qwen 2.5 all use it; the new pretraining default.',
  },
  fp8: {
    short:
      '8-bit floating-point — the H100/B200-era throughput unlock. Two variants: E4M3 (4 exponent, 3 mantissa bits — used for forward) and E5M2 (5e/2m — used for backward, larger range, less precision). On Hopper tensor cores, FP8 GEMM is 2× the throughput of BF16. End-to-end training is ~1.5× faster; DeepSeek-V3 showed it works at 671B scale.',
  },
  e4m3: {
    short:
      'FP8 variant with 4 exponent bits and 3 mantissa bits. Range ~±448, more precision than E5M2 but tighter dynamic range. Used for forward-pass tensors (weights, activations) where values stay close to zero.',
  },
  e5m2: {
    short:
      'FP8 variant with 5 exponent bits and 2 mantissa bits. Range ~±57344, much wider than E4M3 but coarser. Used for backward-pass tensors (gradients) where values can span many orders of magnitude.',
  },
  'transformer engine': {
    short:
      'NVIDIA\'s PyTorch library that wraps tensor-core GEMMs in FP8 with delayed-scaling support (Format.HYBRID = E4M3 forward, E5M2 backward). Drop-in `te.TransformerLayer` plus `te.fp8_autocast()` context. The standard FP8 training entry point for non-DeepSeek-recipe runs.',
  },
  mxfp8: {
    short:
      'Open Compute Project Microscaling FP8 — block-FP format with one shared 8-bit scale per 32-element block. Hardware-native on Blackwell (B200/B300) tensor cores; better numerical behavior than per-tile FP8 with no software per-block scaling code. The 2025+ training default.',
  },
  'master weights': {
    short:
      'The FP32 copy of model parameters that the optimizer reads and writes, kept alongside lower-precision (BF16/FP8) versions used for the actual GEMMs. Without this, low-precision rounding errors accumulate every step until the model diverges. Mandatory for any training in BF16 or below.',
  },
  ddp: {
    short:
      'Distributed Data Parallel — PyTorch\'s wrapper that replicates the model on every GPU, splits the batch, and AllReduces gradients during backward. The default multi-GPU primitive. Wraps your model in one line; framework injects async AllReduce + bucketing + comm-compute overlap underneath.',
  },
  nccl: {
    short:
      'NVIDIA Collective Communications Library. The library that implements AllReduce, AllGather, ReduceScatter, and friends on top of NVLink and InfiniBand. Bandwidth-optimal Ring-AllReduce + tree algorithms for cross-node. Every PyTorch distributed primitive eventually calls into NCCL.',
  },
  allreduce: {
    short:
      'Collective op: every rank contributes a tensor, every rank receives the (sum or average) across all contributions. Implemented in NCCL as Ring-AllReduce — bytes/rank ≈ `2(N-1)/N × P × bytes`, bandwidth-optimal. The primitive that averages gradients in DDP and accumulates partial sums in tensor parallel.',
  },
  allgather: {
    short:
      'Collective op: each rank holds a shard, every rank ends up with the full concatenated tensor. The forward-pass primitive in FSDP — every step AllGathers the layer\'s sharded weights so the local GPU can do its forward, then frees them again.',
  },
  reducescatter: {
    short:
      'Collective op: ranks contribute full tensors, each rank receives the sum of one shard. The inverse of AllGather. FSDP backward uses ReduceScatter to leave each rank with its 1/N shard of the averaged gradient — no rank ever holds the full gradient.',
  },
  fsdp: {
    short:
      'Fully Sharded Data Parallel — PyTorch\'s ZeRO-3. Each rank holds 1/N of the parameters, gradients, and optimizer state. Forward AllGathers a layer\'s weights, computes, frees them. Backward AllGathers + ReduceScatters. FSDP2 (2024) is the per-parameter DTensor-based rewrite — composes cleanly with TP/PP and is the production default.',
  },
  zero: {
    short:
      'DeepSpeed\'s family of memory-sharding strategies (Rajbhandari et al., 2020). Stage 1 shards optimizer state, stage 2 adds gradients, stage 3 adds parameters. ZeRO-3 = FSDP conceptually. Reduces per-rank memory linearly with the number of data-parallel ranks.',
  },
  hsdp: {
    short:
      'Hybrid Sharded Data Parallel. Shard within a node (over fast NVLink) and replicate across nodes (where AllGather over InfiniBand would dominate). The 2026 default for any multi-node FSDP run; cuts cross-node traffic to grad AllReduce only.',
  },
  'tensor parallel': {
    short:
      'Megatron-style sharding *inside* a layer. Each weight matrix is split across GPUs (column-parallel for the input matmul, row-parallel for the output), with two AllReduces per transformer layer to recombine activations. Bandwidth-hungry; pinned to within an NVLink domain (usually TP=8 per node).',
  },
  'pipeline parallel': {
    short:
      'Splitting the model layer-by-layer across GPUs — stage 0 holds layers 0–N, stage 1 holds N–2N, etc. Activations flow forward through the pipeline, gradients flow back. Comm is point-to-point (small), so PP scales across nodes. Naive bubble (idle time) shrinks with more micro-batches; modern schedules (1F1B, interleaved, zero-bubble) shrink it further.',
  },
  '1f1b': {
    short:
      'One-Forward-One-Backward pipeline schedule. After warm-up, each stage alternates one forward micro-batch with one backward — keeping at most P (not M) activation snapshots in memory. Same bubble fraction as GPipe at much lower memory; the production PP default since ~2021.',
  },
  'zero-bubble': {
    short:
      'Pipeline schedule (Qi et al., 2024) that splits gradient computation into the input-grad (critical path) and weight-grad (deferrable) phases, then schedules the weight-grad work into what would have been bubble time. Fully eliminates pipeline bubbles for typical configs; ships in TorchTitan and Megatron-Core.',
  },
  dtensor: {
    short:
      'PyTorch\'s "distributed tensor." A tensor that knows how it\'s sharded across a `DeviceMesh` — replicated, sharded along an axis, or partial. Ops on DTensors automatically insert the right collectives. The abstraction underneath FSDP2 and PyTorch-native TP; lets multi-axis (TP × FSDP × PP) parallelism compose.',
  },
  'device mesh': {
    short:
      'PyTorch abstraction for arranging GPUs into a logical n-dimensional grid (e.g. dp × pp × tp). Each parallelism axis pins to one mesh dim. `init_device_mesh("cuda", (32, 4, 8), names=("dp","pp","tp"))` sets up a 1024-GPU 3D mesh; ops on DTensors know which axis to AllReduce along.',
  },
  bubble: {
    short:
      'In pipeline parallelism, idle time at the front and back of each step while the pipeline fills and drains. Fraction is `(P-1)/(M+P-1)` for P stages and M micro-batches with naive 1F1B. Mitigated by more micro-batches, interleaved virtual stages, or the 2024 zero-bubble schedule.',
  },
  'attention head': {
    short:
      'A triplet of `(Q, K, V)` projections from `d_model → d_head`. Multi-head attention runs `H` heads in parallel and concatenates their outputs, with `H · d_head = d_model`. Heads aren\'t separate modules — they\'re an axis of one big matmul, created by reshape and dissolved by reshape.',
  },
  'causal mask': {
    short:
      'The triangular mask added to attention scores during decoder self-attention so position `t` only attends to positions `≤ t`. Implemented as `-inf` in the upper triangle before softmax. The single op that makes a transformer autoregressive — without it the model can see the future during training.',
  },
  'softmax saturation': {
    short:
      'When softmax inputs are too large in magnitude, the output collapses to one-hot — gradients of all the "losers" go to ~0 and learning stalls. Why attention divides `QKᵀ` by `√d_head`: it normalizes the variance back to 1 so softmax stays in its responsive regime as `d_head` grows.',
  },
  logits: {
    short:
      "The unnormalized scores the model emits at the final layer — one number per vocabulary token, typically a 32K–256K-long vector. Softmax turns them into probabilities. Every sampling decision (temperature, top-k, top-p, min-p) and every constraint (banned tokens, FSM masks) operates on logits, not on the model itself.",
  },
  'min-p': {
    short:
      "A sampler that keeps tokens whose probability is at least `p_min × max_prob` — the gate is *peak-relative*, not cumulative. Adapts automatically: sharp distributions stay sharp, diffuse ones stay diverse. Empirically beats top-p on hallucination and creativity. Default in DeepSeek-R1, Qwen-3, llama.cpp.",
  },
  'speculative decoding': {
    short:
      "A small draft model proposes K candidate tokens; the big target model verifies all K in one forward pass via rejection sampling. Accepted tokens emit, the rest fall back to a target sample. Output distribution is identical to running the target alone — 2–3× decode speedup with zero quality change. EAGLE-3 and Medusa are the production variants.",
  },
  ttft: {
    short:
      "Time to First Token — the latency from request arrival to the first streamed output token. Dominated by prefill (running the prompt forward through every layer). The SLO that controls how chat *feels*; budget is typically 200–800 ms.",
  },
  tpot: {
    short:
      "Time Per Output Token — the steady-state latency between consecutive streamed tokens. Dominated by decode (one forward pass per token, HBM-bandwidth-bound). The SLO that controls how fast the response *streams*; budget is typically 30–80 ms.",
  },
  'constrained decoding': {
    short:
      "Compile a JSON schema or grammar into a finite-state machine, then at every decode step mask logits for tokens that would violate the grammar. Output is parseable by construction — never relies on the model getting JSON right. XGrammar is the 2026 speed champion; per-step overhead is sub-millisecond.",
  },
  embedding: {
    short:
      'A fixed-size dense vector that represents text (or an image, audio clip — anything). Similar inputs land near each other in vector space; cosine similarity is the standard distance. The substrate of every RAG pipeline, semantic search, dedup job, and recommendation system.',
  },
  bm25: {
    short:
      'A sparse retrieval scoring function that ranks documents by term frequency weighted by inverse document frequency, with length normalization. The classical baseline that catches names, IDs, and exact-match queries dense embeddings miss. Hybrid retrieval (BM25 + dense) reliably beats either alone by 5–10 NDCG points.',
  },
  reranker: {
    short:
      'A cross-encoder model that takes (query, doc) as a pair and outputs a single relevance score. Far more expressive than a dense-vector dot product, ~50× the compute — run it on a small candidate pool (top 20–100) after a cheap first-stage retriever. The third stage of the modern retrieval stack.',
  },
  matryoshka: {
    short:
      'Matryoshka Representation Learning (Kusupati et al., 2022). Trains an embedding model so that any prefix of the vector is itself a usable embedding — truncate a 1024-dim vector to 256-dim and you get ~3% lower quality but 4× the speed and storage. Lets one model serve fast / accurate / storage-cheap variants without retraining.',
  },
  'chain-of-thought': {
    short:
      'Asking the model to "think step by step" before giving the final answer (Wei et al., 2022). Triples accuracy on multi-step reasoning but hurts on simple classification, where the extra room lets the model second-guess itself. Self-consistency = sample N CoT traces, take the majority answer.',
  },
  rag: {
    short:
      'Retrieval-Augmented Generation. Pull the most relevant chunks for a question — usually via embedding similarity over a vector index — and stuff them into the prompt before generation. The most-deployed AI-engineering pattern: how a model with a stale knowledge cutoff answers questions about your private docs from this morning. Naive RAG is one cosine-similarity sort; production RAG is a chunk → embed → retrieve → rerank → generate pipeline.',
  },
  chunking: {
    short:
      'Splitting source documents into smaller passages before embedding them for retrieval. Recursive character splitting at ~400 tokens with 50-token overlap is the sane default; semantic chunking (sentence- or section-aware boundaries) sometimes wins. The most underrated dial in a RAG pipeline — when retrieval quality is bad, chunking is usually the first thing to fix.',
  },
  'vector db': {
    short:
      'A database optimized for nearest-neighbor search over high-dimensional vectors — usually with HNSW or IVF-PQ as the index. Production options: Pinecone, Weaviate, Qdrant, pgvector, Chroma, FAISS (in-process). The storage layer of every RAG pipeline; you upsert (id, vector, metadata) and query by vector with `top_k`.',
  },
  rrf: {
    short:
      'Reciprocal Rank Fusion. A parameter-light way to combine ranked lists from heterogeneous retrievers: each document gets `Σ 1/(k + rank_in_each_list)` with `k=60` standard, then rank by that sum. Robust because it ignores raw scores — dense, BM25, and even reranker outputs fuse cleanly. Production hybrid retrieval defaults to RRF.',
  },
  hyde: {
    short:
      'Hypothetical Document Embeddings (Gao et al., 2022). The LLM generates a one-paragraph fake answer to the query, then *that* gets embedded for retrieval — bridging the vocab gap between short jargon queries and long technical chunks. Hurts when the model hallucinates a wrong premise; the production fix is to retrieve against both query and HyDE answer and fuse with RRF.',
  },
  react: {
    short:
      'Reason + Act (Yao et al., 2022). The agent paradigm where an LLM alternates between free-text reasoning ("let me think..."), actions (tool calls), and observations (tool results), looping until a final answer. Every modern agent — Cursor, Claude Code, Replit Agent, deep research — descends from this paper. Modern tool-use APIs make it implicit: the model produces both reasoning text and tool calls in one response.',
  },
  'tool use': {
    short:
      'The primitive that lets an LLM call your code. The model emits a typed `tool_use` block (name + JSON-schema-validated arguments); your code dispatches it to a function and feeds the result back as a `tool_result`. The model never executes anything itself. Combined with a loop, this is the substrate for every modern agent (Cursor, Claude Code, ChatGPT browsing).',
  },
  mcp: {
    short:
      'Model Context Protocol — Anthropic\'s open spec (late 2024) for how LLM clients discover and call tools, read resources, and run prompt templates from external servers. Three primitives (tools / resources / prompts) over JSON-RPC, with stdio / HTTP / SSE transports. Write one server; every MCP-compliant client (Claude Desktop, Cursor, Zed, VS Code) inherits the integration — the 2026 replacement for ad-hoc per-platform tool integrations.',
  },
  vllm: {
    short:
      'The default open-source LLM inference server (Kwon et al., UC Berkeley, SOSP 2023). Reference implementation of PagedAttention + continuous batching, with an OpenAI-compatible HTTP API. Supports almost every popular open model within days of release. vLLM v1 (late 2024) rewrote the engine around chunked prefill as the unified primitive. The boring-and-correct pick when you don\'t have a specific reason to choose otherwise.',
  },
  sglang: {
    short:
      'Throughput-focused alternative to vLLM (Zheng et al., 2024). Built around RadixAttention — a radix-tree generalization of prefix caching that shares KV cache across overlapping prefixes — and ships native grammar-constrained decoding via XGrammar. Typically 1.5–3× faster than vLLM on agent / chat / RAG workloads where many requests share a long preamble; smaller community, occasional rough edges.',
  },
  'paged attention': {
    short:
      'vLLM\'s mechanism for storing the KV cache in fixed-size blocks (typically 16 tokens each) instead of one contiguous tensor per request. Lets the scheduler pack many sequences into one GPU\'s memory without fragmentation, the way an OS pages virtual memory. The throughput primitive that made continuous batching practical at scale.',
  },
  'radix attention': {
    short:
      'SGLang\'s generalization of prefix caching to a radix tree of shared prefixes across requests (Zheng et al., 2024). When 1,000 concurrent users share a 4K-token system prompt, RadixAttention reuses one KV cache copy for all of them — hit rate climbs, KV memory drops, throughput often jumps 2× over the no-share baseline. The reason SGLang dominates on agent and chat workloads.',
  },
  'continuous batching': {
    short:
      'A serving-side scheduler that doesn\'t wait for one request to finish before starting the next. New sequences are admitted mid-batch, finished ones evicted, and one packed forward pass runs per step. Combined with chunked prefill, every step is full of useful work. On by default in vLLM v1, SGLang v0.4+, and TensorRT-LLM; legacy stacks that lack it leave ~5× of decode throughput on the floor.',
  },
  'prefix caching': {
    short:
      'Storing the KV cache from a recently-served prompt prefix and reusing it when a new request shares the same prefix bytes — skipping prefill entirely on the shared region. Free if you keep variable bits (timestamps, request IDs) at the *end* of the prompt and pin a stable chat template. Hit rates over 50% on chat workloads are normal; the rate itself is the most important metric to put on a serving dashboard.',
  },
  vlm: {
    short:
      'Vision-Language Model. A transformer that consumes images alongside text by running pixels through a ViT-style encoder, projecting the patch embeddings into the text token-embedding space, and feeding the interleaved sequence into a standard decoder. The decoder cannot tell which tokens were pixels — which is why every text-side technique (RAG, tool use, structured output) composes with vision unchanged. Frontier examples: Claude 4 vision, GPT-4o, Gemini 2.x, Llama-3.2-Vision, Qwen2-VL, InternVL2.',
  },
}

/** Look up an entry by name, case-insensitive, trimming whitespace. */
export function lookupTerm(name: string): GlossaryEntry | undefined {
  return glossary[name.trim().toLowerCase()]
}
