import Link from 'next/link'

const PATHS = [
  {
    slug: 'ai-systems',
    label: 'AI Systems',
    eyebrow: 'Reading order I',
    desc:
      'Attention, KV cache, paged attention, prefix caching, disaggregated serving, sampling, vLLM, observability. The full inference pipeline.',
    accent: 'var(--m-track-architecture)',
  },
  {
    slug: 'ml-compiler',
    label: 'ML Compilers',
    eyebrow: 'Reading order II',
    desc:
      'SM architecture, shared memory, TMA, GEMM, LLVM, MLIR, Triton, CUTLASS, ThunderKittens. From transistors to kernel DSLs.',
    accent: 'var(--m-track-compilers)',
  },
  {
    slug: 'edge-ai',
    label: 'Edge AI',
    eyebrow: 'Reading order III',
    desc:
      'Quantization, llama.cpp, ExecuTorch, Core ML, Hexagon NPU, GGUF, distillation. Running models off the cloud.',
    accent: 'var(--m-track-applied)',
  },
]

export function PathPicker() {
  return (
    <section className="m-paths">
      <div className="m-paths-inner">
        <p className="m-paths-eyebrow">Three reading orders</p>
        <h2 className="m-paths-heading">Pick a thread to follow.</h2>

        <div className="m-path-grid">
          {PATHS.map((p) => (
            <Link
              key={p.slug}
              href="/learning-paths"
              className="m-path-card"
              style={{ ['--accent' as string]: p.accent }}
            >
              <span className="m-path-eyebrow">{p.eyebrow}</span>
              <h3 className="m-path-label">{p.label}</h3>
              <p className="m-path-desc">{p.desc}</p>
              <span className="m-path-arrow" aria-hidden>→</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
