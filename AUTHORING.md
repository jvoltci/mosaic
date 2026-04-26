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
6. **Push.** Vercel auto-deploys; the `/cheatsheet` page rebuilds with your new TL;DR.

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
| **Run it on real hardware** | A `<ColabLink>` to a notebook for things Pyodide can't do (GPU, big models, network). |
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

## Components available in MDX

All registered globally in [`mdx-components.tsx`](./mdx-components.tsx) — no imports needed inside lessons.

| Component | Purpose |
| --- | --- |
| `<Quiz question="..." options={[...]} answer={i} explanation="..." />` | Multi-choice with reveal. |
| `<Figure src="..." alt="..." caption="..." />` | Image with caption. |
| `<Cheatsheet>...</Cheatsheet>` | Inline TL;DR-style callout (orthogonal to the auto-aggregated `## TL;DR`). |
| `<LessonComplete />` | "Mark complete" button (saves to localStorage). |
| `<ModuleProgress lessons={[{slug, title, estMin}, ...]} />` | Lesson list + progress bar for module index pages. |
| `<ColabLink href="..." label="..." description="..." />` | Big call-to-action card linking to a Colab notebook. |
| `<Resources items={[{kind, href, title, author, note}, ...]} />` | Linked list of papers / videos / blogs / repos. `kind` ∈ paper, video, blog, repo, docs, book. |
| `<RunInBrowser code={\`...\`} description="..." />` | Pyodide-powered Python runner. Works on phone browsers. ~6 MB load on first click; cached. |
| ` ```mermaid ` | Mermaid diagrams (built into Nextra). |

### Picking the right "run" component

- **`<RunInBrowser>`** — pure Python, no GPU, no external APIs (Pyodide can't network). Perfect for math, data structures, visualizations, sanity checks. Always works on mobile.
- **`<ColabLink>`** — anything else. GPU, large models, API calls, training. Open in Colab → free T4 GPU → run.
- **Both, in the same lesson** — give the in-browser version for the concept, the Colab for the real thing.

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
3. Add to `TrackKey` union, `TRACK_LABELS`, `TRACK_ACCENT`, `TRACK_ICON`, `TRACK_TAGLINE` in `lib/mosaic-tiles.ts`
4. Add a new accent CSS variable in `app/globals.css` (the `--m-track-*` tokens)
5. Pick a hex coordinate region (extend the layout) and add tiles
6. Update the mosaic header copy if needed

---

## What `npm run dev` and `npm run build` actually do

```bash
npm run dev        # 1. node scripts/build-cheatsheet.mjs (predev)
                   # 2. next dev — hot-reloading server at localhost:3000

npm run build      # 1. node scripts/build-cheatsheet.mjs (prebuild)
                   # 2. next build — produces ./.next/ static export

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

Read [`content/foundations/cpp-memory/stack-vs-heap.mdx`](./content/foundations/cpp-memory/stack-vs-heap.mdx) and [`content/llm-architecture/kv-cache/kv-basics.mdx`](./content/llm-architecture/kv-cache/kv-basics.mdx) — these are the reference lessons. Match their density, voice, and structure.

The point of Mosaic is to be the course you'd actually want to take. Every lesson should pass the test: *is this clearer, denser, and more fun to read than what you'd find on the open web?* If not, keep editing.
