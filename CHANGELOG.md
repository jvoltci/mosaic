# Changelog

All notable changes to Mosaic. Format: [Keep a Changelog](https://keepachangelog.com); versioning follows the project's iteration history (no semver — content is the artifact).

## [v1.0] — 2026-04-26 — *Launch-ready*

The first version where every track is fully fleshed out and the platform is stable enough to point real readers at.

### Content
- **88 lessons across 7 tracks**, all live (zero stubs).
- **Edge AI expanded from 6 to 13 lessons** across 7 modules — now includes Browser (WebGPU/WebLLM), Multimodal Edge (Whisper.cpp, Mobile VLMs), and Distributed Edge (EXO/swarm inference) modules. Apple Neural Engine deep-dive added; Speculative Decoding and TFLite/LiteRT lessons added.
- **Capstone v2 format** rolled out across the harder modules: step-by-step builds with checkpoints, traps, time estimates, and concrete portfolio outcomes. Distributed Training, On-Device, Browser, Multimodal Edge, and Distributed Edge all use it.
- **Three reading orders** (AI Systems, ML Compilers, Edge AI) thread the same lessons differently.
- **`last_reviewed: 2026-04-26`** frontmatter on every lesson; powers the quarterly currency-refresh sweep.

### Platform
- **⌘K search** via Pagefind. ~14K indexed words across all lessons; ~100 KB JS only when the modal opens.
- **Favorites/★** — star any lesson; view collection at `/favorites`. localStorage-backed, no account.
- **Subtle global footer** with live visitor counter ("N curious minds have walked the mosaic" via abacus.jasoncameron.dev).
- **Mosaic-map** rendered against the live tile registry (no stale stubs on the homepage).
- **Mobile-responsive**: unified breakpoints (640/768/1024), 44 px touch targets on coarse pointers, section-dots stepper visible on tablets, FillIn/Capstone fluid sizing.
- **Theme toggle** (auto / light / dark).

### Build & quality
- **`scripts/verify-mapping.mjs`** — 5-check integrity gate (tile→file, file→tile, _meta.ts, ModuleProgress, TL;DR). Wired to `prebuild`.
- **`scripts/lint-mdx.mjs`** — permanent fix for the `<digit` MDX trap that bit us repeatedly. Wired to `prebuild`.
- **`scripts/build-cheatsheet.mjs`** — auto-aggregates `## TL;DR` blocks across all lessons into `lib/cheatsheet-index.json`.
- **Pagefind postbuild** — static-export-friendly indexing, no runtime needed.

### Authoring
- **AUTHORING.md** rewritten with: "Why Pyodide?" rationale, "Capstones with steps" recipe, MDX-traps section, mapping-integrity section, full component reference.
- **README.md** rewritten reflecting 7 tracks / 88 lessons / final feature set.

---

## [v0.x] — 2026-01 to 2026-04 — *The build*

Each commit listed below was a meaningful step. See `git log` for the full record.

- `feat(applied): frontier 8-pack` — Vision, Audio, Safety, Capstone for Applied AI track.
- `feat(foundations): 10 lessons completing the substrate track` — caches, branches, NUMA, profiling, plus the C++ memory module.
- `feat(training): distributed parallelism + DPO` — TP / PP / FSDP2 / zero-bubble + DPO/IPO/KTO.
- `feat(edge-ai): new track` — llama.cpp, ExecuTorch, Core ML, Hexagon, GGUF, distillation. (Track later expanded in v1.0.)
- `feat(ml-execution): quantization` — FP8, INT4/AWQ, GPTQ, MXFP4/NVFP4, rotation.
- `feat(ml-execution): tensors-in-memory` — strides, contiguity, tensor library, TMA.
- `feat(compilers): kernels module` — Triton, CUTe / CUTLASS, ThunderKittens.
- `feat: Capstone v2 + reading orders + tone retune` — the trusted-reference voice settled in.
- Initial release: 22 deep lessons across 6 tracks + interactive course platform (mosaic map, cheatsheet aggregator, in-browser Pyodide).

[v1.0]: https://github.com/jvoltci/mosaic/releases/tag/v1.0
