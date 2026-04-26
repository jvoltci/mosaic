import Link from 'next/link'

type Track = {
  num: string
  href: string
  icon: string
  name: string
  desc: string
  modules: number
  accent: string
}

const TRACKS: Track[] = [
  {
    num: '01',
    href: '/foundations',
    icon: '🛠️',
    name: 'Systems Foundations',
    desc:
      'The C++ memory model, CPU caches, branch prediction, SIMD, threading. The substrate every ML kernel runs on.',
    modules: 3,
    accent: 'var(--m-track-foundations)',
  },
  {
    num: '02',
    href: '/ml-execution',
    icon: '🧮',
    name: 'ML Execution & Quantization',
    desc:
      'How tensors live in memory. GEMM, GPU programming, the cost model of CUDA, and INT8/INT4 quantization tricks.',
    modules: 3,
    accent: 'var(--m-track-execution)',
  },
  {
    num: '03',
    href: '/training',
    icon: '📈',
    name: 'Training & Fine-tuning',
    desc:
      'Gradient accumulation, mixed-precision training, LoRA, FSDP, DeepSpeed — making training fast and memory-efficient.',
    modules: 3,
    accent: 'var(--m-track-training)',
  },
  {
    num: '04',
    href: '/llm-architecture',
    icon: '🧠',
    name: 'LLM Architecture',
    desc:
      'Transformers from a systems lens. KV cache, GQA, RoPE, FlashAttention, sampling, continuous batching.',
    modules: 3,
    accent: 'var(--m-track-architecture)',
  },
  {
    num: '05',
    href: '/compilers',
    icon: '⚙️',
    name: 'ML Compilers & Hardware',
    desc:
      'LLVM, MLIR, TVM, XLA, ExecuTorch, Triton, Vulkan, Metal Performance Shaders — the stack that turns models into binaries.',
    modules: 4,
    accent: 'var(--m-track-compilers)',
  },
  {
    num: '06',
    href: '/applied',
    icon: '🚀',
    name: 'Applied ML Systems',
    desc:
      'End-to-end deployment: model serving, edge inference, on-device ML, and building production AI systems.',
    modules: 3,
    accent: 'var(--m-track-applied)',
  },
]

export function TrackGrid() {
  return (
    <section className="m-tracks-section">
      <div className="m-tracks-inner">
        <p className="m-section-eyebrow">The six tracks</p>
        <h2 className="m-section-title">Build the stack from the silicon up.</h2>
        <p className="m-section-lede">
          Each track is a self-contained sequence of small modules. Lessons take ~10–15 minutes — short enough that
          finishing one feels like a real win, structured enough that they compound.
        </p>

        <div className="m-track-grid">
          {TRACKS.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="m-track-card"
              style={{ ['--accent' as string]: t.accent }}
            >
              <span className="m-track-num">Track {t.num}</span>
              <span className="m-track-icon">{t.icon}</span>
              <h3 className="m-track-name">{t.name}</h3>
              <p className="m-track-desc">{t.desc}</p>
              <div className="m-track-meta">
                <span>
                  {t.modules} module{t.modules > 1 ? 's' : ''}
                </span>
                <span className="m-track-arrow" aria-hidden>
                  Open →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
