# Authoring Guide — Maintaining Mosaic

This is the playbook for adding lessons, fixing typos, and evolving Mosaic over time. The goal: anyone with Markdown skills can ship a lesson; anyone with React skills can extend the platform.

---

## Adding a new lesson — the 5-minute version

1. **Decide where it lives.** Pick a track and module under [`content/`](./content). The structure is `content/<track>/<module>/<lesson-slug>.mdx`.
2. **Copy the template.** [`templates/LESSON_TEMPLATE.mdx`](./templates/LESSON_TEMPLATE.mdx) → rename to `your-lesson-slug.mdx`.
3. **Fill in the 9 sections** (TL;DR, Why, Mental model, Walkthrough, Run in browser, Run on hardware, Quick check, Key takeaways, Go deeper).
4. **Register the lesson** in two places:
   - The parent module's `_meta.ts` (sidebar order)
   - The parent module's `index.mdx` `<ModuleProgress lessons={...} />` array
5. **Add a tile entry** in [`lib/mosaic-tiles.ts`](./lib/mosaic-tiles.ts):
   - Set `available: true`
   - Pick or reuse an `illustration` name (or leave `'placeholder'`)
   - Make sure the hex `(q, r)` doesn't collide with another tile in the same region
6. **Run `npm run verify-mapping`.** Catches any of the four registrations you missed *before* you push. Wired to `prebuild` and `predev` so the build itself blocks on drift.
7. **Push.** GitHub Actions auto-deploys; the `/cheatsheet` page rebuilds with your new TL;DR.

That's it. Helpers contributing single lessons never need to touch React.

---

## The 9-section lesson shape

Every lesson follows the same template so readers always know where to look:

| Section | Why it's there |
| --- | --- |
| **TL;DR** | 3–5 bullets. The reader can return in 6 months and refresh the concept in 30 seconds. Auto-aggregated to `/cheatsheet`. |
| **Why this matters** | Anchor the lesson to a real-world consequence (perf, cost, correctness). Skip philosophy. |
| **Mental model** | One Mermaid diagram or analogy. The image that makes the concept click. |
| **Concrete walkthrough** | Real code, real numbers, side-by-side comparisons. No handwaving. |
| **Run it in your browser** | A `<RunInBrowser>` block — Python via Pyodide. Works on phones. ~6 MB load on first run, cached after. |
| **Quick check** | A `<Quiz>` with 2–3 options. Tests the *understanding*, not the trivia. |
| **Key takeaways** | Numbered, scannable. The 3–5 things you'd write on a napkin. |
| **Go deeper** | A `<Resources>` block linking papers, blogs, Karpathy videos, source repos. This is where readers who *really* want to dig in go next. |
| **`<LessonComplete />`** | Closes every lesson. Hooks into localStorage progress. |

**Lengths to aim for:**
- TL;DR: 80–150 words
- Why this matters: 60–100 words
- Concrete walkthrough: this is the meat — typically 400–800 words + code blocks
- Total lesson: ~1500–2500 words, ~10–15 min reading

---

## Reading modes — Learn vs Reference

Every lesson ships in **two modes** wrapped inside one MDX file:

```mdx
---
title: Lesson Title
description: ...
last_reviewed: YYYY-MM-DD
---
# Lesson Title

<Mode is="learn">

[1–3 paragraph warm hook anchored to managed-runtime / analogy]

## TL;DR
- bullets…

[the 9-section body, with `<Term>` tags on jargon]

</Mode>

<Mode is="reference">

[the original / dense / reference-quality version of the same lesson — same TL;DR, same body, no warm hook]

</Mode>

<LessonComplete />
```

A small toggle in the lesson breadcrumb (`<ModeToggle />`, registered in `LessonChrome`) lets readers flip between Learn and Reference; the choice persists in `localStorage` site-wide. CSS hides the inactive block. Default mode = `learn`.

**Why two modes:** Learn is a paced walk-through for someone new to the topic; Reference is the dense lookup version for someone who already knows it. Same facts, two ramps.

**Rules:**

1. The shared `# H1` lives **outside** both `<Mode>` blocks. Same with `<LessonComplete />` at the end.
2. The Learn block must come **first** in the file — `scripts/build-cheatsheet.mjs` extracts the first `## TL;DR` it finds, and the Learn TL;DR is the one we want indexed.
3. Both modes carry their own `<Quiz>` / `<FillIn>` / `<RunInBrowser>` / `<Resources>`. They render in the static HTML; CSS hides the inactive one. The build doubles in size per lesson — acceptable.
4. Frontmatter (`title`, `description`, `last_reviewed`) is shared and lives once at the top.
5. Lessons that haven't been converted yet (single body, no `<Mode>` wrapper) still render correctly — the toggle auto-hides on those pages.

When a Learn block contains the markdown `<digit` pattern (e.g., `<10%`), the MDX parser treats it as a JSX tag start and breaks. Rewrite as "under 10%". The lint script catches this; see *MDX traps* below.

---

## Voice rules for the Learn block

Learn mode is the warm walk-through. Six rules:

1. **Open with an analogy or contrast, not a definition.** Anchor unfamiliar systems concepts to ideas a working engineer already has — garbage collection, dynamic arrays, runtimes that "hide" memory. Lead with the thing that makes the abstraction concrete (the heap is "an ocean of RAM"; the stack is "a stack of plates").
2. **Compare to GC'd / managed-runtime languages generically.** Say "in a managed language…" or "in a GC'd runtime…" — *not* "in Node.js" or "in Flutter." Mosaic stays general; the analogy works for anyone who's written Python, Java, Go, JS, Ruby, or similar.
3. **Define-before-use.** Any jargon word gets defined the first time it appears — either inline in plain English, or wrapped in `<Term name="...">` (entry in `lib/glossary.ts`) for a longer pop-over.
4. **One micro-concept per section.** Short paragraphs. Whitespace. Each section should be readable in under 60 seconds.
5. **Keep all the rigor.** All numbers, code, tables, and benchmarks from the Reference version stay. The Learn block changes the *ramp*, not the *ceiling*.
6. **End with confidence checks.** `<Quiz>` and/or `<FillIn>` near the end of the Learn block. The reader should be able to articulate, in their own words, the headline takeaway when they finish.

The Reference block has none of these constraints — it's the dense, opinionated, jargon-friendly version. Both modes are valid; they serve different readers.

The pilot for the voice is `content/foundations/cpp-memory/stack-vs-heap.mdx`. Match its tone.

---

## Code language: C++ vs Python

Mosaic teaches people heading into roles where the production stack is C++, CUDA, Rust, Triton, MLIR. Static code blocks should match that reality. The rule for **every fenced code block in a lesson body** (not `<RunInBrowser>` — that stays Python because Pyodide):

| Topic | Language |
| --- | --- |
| Kernel internals (CUDA, ROCm, Metal compute shaders) | **C++ / CUDA / PTX** |
| Memory allocators, RAII, move semantics, pointers | **C++** |
| GPU primitives (TMA, WGMMA, mma.sync, ldmatrix, swizzle) | **CUDA / PTX inline asm** |
| Compiler IR (LLVM-IR, MLIR text form, PTX) | **The IR's own text format** |
| CUTLASS / CuTe / ThunderKittens | **C++** |
| llama.cpp internals, ExecuTorch, CoreML internals, Hexagon, TFLite C-API | **C / C++** |
| NCCL ops, MPI, RDMA verbs | **C / C++** |
| Triton DSL (kernel author surface) | **Python with `@triton.jit`** — Triton's frontend is Python, that's the actual code |
| PyTorch user API (`tensor.stride()`, `torch.compile`, `model.generate()`) | **Python** — that's how real code calls it |
| Serving config (`vllm.LLM(...)`, `engine_args=...`) | **Python** — that's the user surface |
| Training loops, optimizers, FSDP setup | **Python** — PyTorch user surface |
| Math sketches of an algorithm (quantization formulas, attention math) | **Python or pseudocode** — pick whichever is clearer |

The decision rule when in doubt: **what language does the production code that does this thing actually use?** That's the language that goes in the code block. If the same lesson covers user-facing API *and* internals, show both — Python for the user surface, C++/CUDA for the kernel.

`<RunInBrowser>` snippets are exempt from this rule — they're always Python because Pyodide is the only in-browser runtime. The `## Run it in your browser` block is for *concept demonstration*; the `## Concrete walkthrough` block is for *the language someone will actually write the production version in*.

Don't default to Python. Decide first, then write.

---

## Components available in MDX

All registered globally in [`mdx-components.tsx`](./mdx-components.tsx) — no imports needed inside lessons.

| Component | Purpose |
| --- | --- |
| `<Mode is="learn">…</Mode>` / `<Mode is="reference">…</Mode>` | Wraps the Learn or Reference variant of a lesson body. CSS hides the inactive one. See *Reading modes* above. |
| `<Term name="page fault">page fault</Term>` | Inline jargon-on-tap. Looks up `name` in `lib/glossary.ts` and shows the entry on click. Falls back to plain text if no glossary entry exists, so authors can stage entries. Add a glossary entry in `lib/glossary.ts` when introducing a new piece of jargon worth defining. |
| `<Quiz question="..." options={[...]} answer={i} explanation="..." />` | Multi-choice with reveal. |
| `<Figure src="..." alt="..." caption="..." />` | Image with caption. |
| `<Cheatsheet>...</Cheatsheet>` | Inline TL;DR-style callout (orthogonal to the auto-aggregated `## TL;DR`). |
| `<LessonComplete />` | "Mark complete" button (saves to localStorage). |
| `<ModuleProgress lessons={[{slug, title, estMin}, ...]} />` | Lesson list + progress bar for module index pages. |
| `<Resources items={[{kind, href, title, author, note}, ...]} />` | Linked list of papers / videos / blogs / repos. `kind` ∈ paper, video, blog, repo, docs, book. |
| `<RunInBrowser code={\`...\`} description="..." group="..." variants={[...]} />` | Pyodide-powered Python runner. Works on phone browsers. ~6 MB load on first click; cached. `group` shares state across cells; `variants` adds quick-tweak chips for mobile. |
| `<FillIn prompt="..." answer="..." prefix="..." suffix="..." accept={[...]} hint="..." explanation="..." />` | Code-completion / short-answer prompt. Active recall. Use 1–2 per lesson. |
| `<CostCalc workload="train-7b" hardware={["b200","mi355x","tpu-v6","h100"]} gpus={1024} />` | Live training cost / latency / energy comparator across hardware. Numbers from `lib/hardware-canon.ts`. |
| `<Capstone title= pitch= what= sota=[] device= time= level= steps=[...] outcomes=[...] />` | End-of-module project card. With `steps`, renders a numbered guide — see "Capstones with steps" below. |
| ` ```mermaid ` | Mermaid diagrams (built into Nextra). |

`<FocusScroll>` and `<PathPicker>` are layout primitives, not lesson components — used by `CourseShell` and the `learning-paths` page. You won't reach for them while writing a lesson.

### Running code in lessons

`<RunInBrowser>` is the only runtime component. Pure Python via Pyodide — no GPU, no networking. Perfect for math, data structures, visualizations, sanity checks. Works on phone browsers. For GPU/large-model demos, **show the runnable code as a normal fenced code block** with a one-line "run this on a GPU box" comment. We deliberately don't link to Colab — broken external repos and one-click-then-wait-30-seconds is friction we don't want.

#### Why Pyodide and not a real Python sandbox?

Mosaic teaches people who are heading into roles where the production stack is C++, CUDA, Rust, Triton, MLIR. So why does the in-browser runner only do Python?

Because the in-browser runner is for **concept demonstration**, not for the languages of the production stack. A C++ kernel doesn't compile in three seconds in a browser; CUDA can't run in a browser at all. Building that infrastructure would cost weeks for ~5% of the teaching value.

Pyodide is universal, fast to start (~6 MB cold, cached after), and ships numpy + scipy. That's enough to teach the *idea* — paged KV cache, the autograd engine, FlashAttention's online-softmax math, the AllReduce ring, the MCP message shape — in a window that opens on a phone.

The capstones direct learners to write the real thing in the real language: Triton on Colab GPU, ExecuTorch on iPhone, vLLM-clone in CUDA, FSDP2 on rented Modal GPUs. That's where the language matches the task. **The browser runner sells the concept; the capstone sells the production artifact.** Don't try to make the runner pull double duty.

Every snippet you put inside `<RunInBrowser>` must run cleanly under Pyodide stdlib + numpy. No `pydantic`, no `torch`, no `transformers`. Hand-roll the validator, write the tensor math by hand. If the snippet feels too constrained, that's the signal it should be a fenced code block with a "run this on a GPU box" note instead.

---

## The mosaic map

Every lesson is a tile in [`lib/mosaic-tiles.ts`](./lib/mosaic-tiles.ts). The file is the source of truth for the home page, the `/map` route, the `/cheatsheet` page, and the navigation graph.

### Adding a tile

```ts
{
  slug: '/applied/llm-basics/structured-output',         // matches the .mdx file path
  fallback: '/applied/llm-basics',                       // where to route if the lesson is a stub
  title: 'Structured Output',
  summary: 'JSON mode, Pydantic, Outlines — guarantee valid output.',  // 12-word hover preview
  track: 'applied',
  moduleName: 'LLM Basics',
  q: 2,                                                  // axial hex coord — must be unique within track region
  r: 1,                                                  // axial hex coord
  illustration: 'placeholder',                           // or a registered illustration name
  available: true,                                       // false = lesson is a stub; tile routes to module index
},
```

### Hex coordinate ranges per track region

| Track | q range | r range |
| --- | --- | --- |
| `foundations` | -9 to -6 | -4 to -2 |
| `ml-execution` | -4 to -1 | -4 to -2 |
| `training` | 1 to 4 | -4 to -2 |
| `llm-architecture` | -9 to -6 | 1 to 4 |
| `compilers` | -4 to -1 | 1 to 4 |
| `applied` | 1 to 4 | 1 to 4 |

`r=0` is empty by design — it's the visual "river" between the systems-and-math half (top) and the model-and-product half (bottom).

### Adding a new tile illustration

For a tile that deserves a hand-drawn illustration (anchor lessons, visually iconic concepts):

1. Create `components/tiles/<Name>.tsx` exporting a single React component with `({color, size}: TileIllustrationProps)`. Use `<g stroke={color} fill="none" strokeWidth={1.5}>` and draw centered around `(0, 0)` within roughly a `±size*0.55` box.
2. Register in `components/tiles/index.ts` under a slug like `'kv-cache'`.
3. Reference that slug in the tile's `illustration` field.

Style guide: dark background, monoline 1.5-px strokes, single accent color (passed in), one central concept-symbol per tile, no text. Reference the existing 5 anchors (`StackVsHeap`, `Gemm`, `Rope`, `KvCache`, `Mlir`) for the visual standard.

---

## The `/cheatsheet` aggregator

Every lesson with a `## TL;DR` heading is automatically scraped into `lib/cheatsheet-index.json` by `scripts/build-cheatsheet.mjs` (runs as `prebuild` and `predev`). You don't maintain the cheatsheet manually — write the TL;DR once and it appears everywhere.

If a lesson's TL;DR doesn't show up after a refresh:

```bash
npm run build-cheatsheet     # regenerate manually
```

---

## Adding a new track or module

A new **module** is just a new folder under `content/<track>/`:

```
content/llm-architecture/long-context/
├── _meta.ts          # lesson order
├── index.mdx         # module overview + <ModuleProgress />
└── <lesson>.mdx
```

Then add the module to the parent track's `_meta.ts`.

A new **track** is bigger:

1. New folder `content/<new-track>/` with `_meta.ts`, `index.mdx`, modules
2. Add to top-level `content/_meta.ts`
3. Add to `TrackKey` union, `TRACK_LABELS`, `TRACK_ACCENT`, `TRACK_NUM`, `TRACK_SHORT`, `TRACK_TAGLINE` in `lib/mosaic-tiles.ts`
4. Add a new accent CSS variable in `app/globals.css` (the `--m-track-*` tokens)
5. Pick a hex coordinate region (extend the layout) and add tiles
6. Update the mosaic header copy if needed

---

## What `npm run dev` and `npm run build` actually do

```bash
npm run dev        # 1. node scripts/verify-mapping.mjs   (predev)
                   # 2. node scripts/build-cheatsheet.mjs (predev)
                   # 3. next dev — hot-reloading server at localhost:3000

npm run build      # 1. node scripts/verify-mapping.mjs   (prebuild)
                   # 2. node scripts/build-cheatsheet.mjs (prebuild)
                   # 3. next build — produces ./out static export

npm run verify-mapping     # just check tile/file/_meta/ModuleProgress integrity
npm run build-cheatsheet   # just regenerate lib/cheatsheet-index.json
```

**Important:** never run `npm run build` while `npm run dev` is running on the same checkout. They share `.next/` and stomp on each other (you'll get `Cannot find module './vendor-chunks/...'`). Stop dev first, or build in a separate worktree.

---

## Cutting-edge resource hygiene

Every lesson's `<Resources>` block should include at least:

- **One arXiv paper** — the canonical reference for the concept (use the latest revision).
- **One Karpathy video, Distill article, or equivalent** — the long-form deep dive that beats the paper for intuition.
- **One blog post or docs page** — the "how it actually works in practice today" reference (e.g., vLLM blog, Anthropic docs).
- **One GitHub repo** — the reference implementation. Required for any lesson where someone might want to read the code.

Update these as the field moves. **Mark anything that's been superseded** (e.g., FlashAttention → FlashAttention-2 → FlashAttention-3). Stale references are worse than missing ones.

### Sources to draw from regularly

- **arXiv** — `arxiv.org/list/cs.LG/recent` (ML), `cs.CL/recent` (NLP)
- **Karpathy** — `youtube.com/@AndrejKarpathy` (long-form lectures, gold)
- **Hazy Research blog** — `hazyresearch.stanford.edu/blog/` (kernels, attention, FlashAttention family)
- **Tri Dao** — `tridao.me/` (FlashAttention author, current frontier)
- **Anthropic / OpenAI / DeepSeek / Meta tech reports** — the most-current production accounts
- **Sebastian Raschka** — `magazine.sebastianraschka.com/` (best monthly LLM literature digest)
- **Lilian Weng** — `lilianweng.github.io/` (deep, careful tutorials)
- **The Gradient, Distill (archive), Anthropic Research** — long-form
- **Semianalysis** — hardware and inference economics

---

## Capstones with steps

Every module ends with a `<Capstone>`. The minimum signature is title + pitch + what + sota + device + time + level. That alone renders a "go build this" card.

For modules where the build is non-trivial (almost all of them), pass two more props — `steps` and `outcomes` — and the capstone renders a step-by-step guide:

```jsx
<Capstone
  title="Implement attention from scratch — including the FlashAttention tile"
  pitch="The attention block as it actually runs in production, written, verified against Llama-3.2-1B."
  what="A single-file PyTorch implementation: multi-head, GQA, RoPE, and a tiled FlashAttention-style forward pass."
  sota={['PyTorch 2.x', 'Llama-3.2-1B (reference)', 'FlashAttention paper (Dao et al.)']}
  device="colab"
  time="One focused weekend (~10 h)"
  level="advanced"
  steps={[
    {
      title: 'Set up the harness — Llama-3.2-1B on Colab',
      goal: 'Load Llama-3.2-1B-Instruct via transformers. Pull out one attention layer\'s weights.',
      checkpoint: 'You can torch.load("attn_layer_0.pt") and get a dict with the right shapes.',
      trap: 'Llama-3.2-1B uses GQA — num_key_value_heads=8 not 32.',
      est: '40 min',
    },
    // … 5 more steps
  ]}
  outcomes={[
    'A working attention block — MHA + GQA + RoPE + tiled forward — that matches a real model',
    'Fluency reading FlashAttention-style code: tiles, online softmax, the running-max trick',
  ]}
/>
```

**Conventions for `steps`:**

- 4–6 steps is the sweet spot. Fewer feels hand-wavy; more feels like a tutorial.
- Each step needs `title`, `goal`, `checkpoint`, `est`. `trap` is optional but include one wherever a smart reader will fall into a non-obvious pit (most steps deserve a trap).
- **Goal** is what to do, in one sentence. **Checkpoint** is how the reader knows they're done — a runnable assert, a printable shape, a numerical match. **Trap** is the silent-failure pitfall that costs an hour to debug.
- **Est** is honest wall-clock time including reading + thinking, not just typing. The whole capstone time should equal the sum of step `est`s.
- **Outcomes** is what the reader can put on a resume after finishing — concrete artifacts (a repo, a benchmark plot, a deployed endpoint), not vague capabilities.

Capstones are the part of Mosaic that puts a finished thing in someone's portfolio. Take them seriously — the step-by-step guide is the difference between "I read about FlashAttention" and "I implemented FlashAttention."

---

## MDX traps — caught automatically

A few patterns repeatedly bite us when authoring MDX. `scripts/lint-mdx.mjs` runs as `prebuild` and `predev` and fails the build before any of them ship.

The current rules:

| Rule | Catches | Fix |
| --- | --- | --- |
| `lt-digit` | `<5%`, `<3 s`, `<1 WER` in body prose | Rewrite as "under N", "below N", or escape `&lt;` |
| `lt-equals-digit` | `<=5` in body prose | "at most N" or "no more than N" |

The linter strips inline backticks and JSX attribute strings before checking, so `` `<4 x float>` `` (markdown inline code) and `what="...<250 LOC"` (JSX attribute) are NOT flagged — they actually work fine in MDX.

What the linter catches is the only thing that matters: **unquoted body prose with `<digit`**, which the MDX parser treats as a JSX tag-start and crashes the build with `Unexpected character '5' before name`. We've shipped this bug four times; the linter ensures we don't ship it a fifth.

To extend: edit the `TRAPS` array in `scripts/lint-mdx.mjs`. Each rule is a regex + a one-line fix message + examples. Run `npm run lint-mdx` to check manually.

---

## Mapping integrity

Mosaic has five places a lesson must be registered (the `.mdx` file, the tile in `mosaic-tiles.ts`, the `_meta.ts` key, the `<ModuleProgress>` slug, and a `## TL;DR` for the cheatsheet). Drift between them caused real bugs (lessons that exist but don't appear on the map; tiles that exist but route to 404).

`scripts/verify-mapping.mjs` checks all five — runs as `prebuild` and `predev`, so neither the local dev server nor a deployment will start if any lesson is half-wired. Run it manually after big edits:

```bash
npm run verify-mapping
```

If you see `✗ tile /foo/bar/baz: lesson key 'baz' not in content/foo/bar/_meta.ts`, that's a one-line fix in the meta file. The script's exit code is the build's exit code — there's no "ignore this warning" mode.

---

## Promoting a stub to a real lesson

Most tiles ship as stubs (`available: false`). To upgrade one to a real lesson:

1. Create the `.mdx` file with the 9-section template.
2. Flip `available: true` in `lib/mosaic-tiles.ts`.
3. Add it to the parent module's `_meta.ts` and `<ModuleProgress />`.
4. (Optional) Build a custom tile illustration if the lesson is iconic enough to deserve one.
5. Push.

The mosaic now shows the tile fully filled (the model's progress UI assumes "available" tiles can be completed; "stub" tiles route to the parent module page where users see what's coming).

---

## Style notes

- **Voice: confident, opinionated, specific.** No "we'll explore some interesting facets". Say what's true.
- **Numbers > adjectives.** "Heap allocation costs 30–80 ns" beats "heap allocation is slow."
- **Cite frontier papers by name and year** in body copy when relevant — readers expect to recognize them.
- **No hand-wavy "as we'll see" forward-references.** Every lesson stands alone.
- **Avoid cross-marketing your other projects.** Mosaic is a general-audience course; don't tie examples to one stack unless the stack is canonical.
- **Math notation is fine.** Use plain TeX for inline math (`$\\sum$` etc.) — Nextra renders KaTeX.

---

## Recovering when something breaks

| Symptom | Fix |
| --- | --- |
| `Cannot find module './vendor-chunks/...'` | `rm -rf .next && npm run dev` |
| Cheatsheet doesn't pick up a new TL;DR | `npm run build-cheatsheet` and reload |
| Sidebar misses a new lesson | Did you add it to `_meta.ts`? |
| Mosaic tile doesn't appear | Did you add it to `lib/mosaic-tiles.ts`? Are coords unique? |
| TypeScript error on `'.css'` import | `global.d.ts` must exist — it declares `*.css` modules |
| `<RunInBrowser>` says "loading…" forever | First load is ~6 MB Pyodide; check the network tab. After first run it's cached. |

---

## Sustainable cadence

- **One lesson per week** is a healthy clip and ships ~50 lessons in a year.
- **Ship one full anchor lesson** before adding 5 stubs. The bar is set by the best example, not the count.
- **Update Resources every quarter.** The field moves; the references that are canonical today aren't in 6 months.
- **Quarterly audit: is anything we say still true?** Especially in `llm-architecture` and `compilers`, things move fast.

---

## When in doubt

Read [`content/foundations/cpp-memory/stack-vs-heap.mdx`](./content/foundations/cpp-memory/stack-vs-heap.mdx) — the canonical dual-mode pilot. Both `<Mode is="learn">` and `<Mode is="reference">` are present; the Learn block models the warm-hook → TL;DR → define-before-use pacing; the Reference block is the original dense version. Match its structure and voice.

For an example of the C++-vs-Python policy in action, look at [`content/foundations/parallelism/async.mdx`](./content/foundations/parallelism/async.mdx) — Python `asyncio` for the user-facing API, **C++20 coroutines** for the C++ analogue, **CUDA streams** in C++ for the GPU side, and **Rust `tokio`** for the systems angle. Same lesson, four code languages, each chosen because that's what production code in that role actually uses.

The point of Mosaic is to be the course you'd actually want to take. Every lesson should pass the test: *is this clearer, denser, and more fun to read than what you'd find on the open web?* If not, keep editing.
