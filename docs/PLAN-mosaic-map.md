# Plan: The Mosaic Map — making the brand load-bearing

> One signature mechanic that turns Mosaic from "a course site that happens to be called Mosaic" into "Mosaic — the course you complete by literally building a mosaic."

## 0. The vision in one paragraph

The course map is a single hand-illustrated mosaic — a tessellated hexagonal artwork where every lesson is one tile. On first visit, the mosaic looks like a stained-glass window before it's been lit: faint outlines of ~50 tiles, organized into four colored regions (one per track). As the learner completes lessons, tiles fill in with full-color custom illustrations of that lesson's concept — a ring buffer for KV cache, two ops folding for operator fusion, a stride pattern for tensor layout. The mosaic is the home page, the navigation, *and* the progress visualization. Finishing the course = completing the artwork. The cheatsheet view is the same mosaic from another angle — hover any tile to see its TL;DR. The metaphor is no longer decoration; the brand is the experience.

## 1. The signature mechanic

| Element            | What it does                                                                  |
| ------------------ | ----------------------------------------------------------------------------- |
| Tile = lesson      | Each tile in the mosaic is one lesson; click = navigate, hover = preview      |
| Region = track     | Tiles cluster into 4 regions (one per track), colored by accent palette       |
| State = progress   | Locked → Available → Completed; tile illustration fills in on completion       |
| Mosaic = home      | The mosaic IS the landing page (below the hero) and a dedicated `/map` route  |
| Mosaic = cheatsheet| Same hex layout, but tooltips show TL;DR cards instead of titles              |

This is the load-bearing idea. Everything else in the plan supports it.

## 2. Visual design

### 2.1 Tile shape

**Hexagonal**, axial-coordinate grid. Why hex over square: it's more organic, more "mosaic"-feeling, and the irregular tessellation feels handmade instead of spreadsheet-y. Why hex over Voronoi/Islamic-geometric: navigable, easy to lay out, manageable to illustrate.

Tile size: 96 px on retina (1.5× = 144 px), gap of 6 px between tiles for the "grout" feel.

### 2.2 Illustration style guide

A rigid style guide is the only way 50 tiles look like one collection instead of a grab-bag. Constraints:

- **Background:** dark-base (`#12121b`) with the track's accent color as a secondary
- **Foreground:** monoline 1.5-px strokes in warm off-white (`#f5f3ee`)
- **Composition:** one central concept-symbol per tile, occupying ~70% of the hex, centered
- **Tone:** intellectual + warm; references — Stripe Press illustrations, Quanta Magazine diagrams, Mihai Cauli's monoline work, the iA Writer aesthetic
- **No text inside tiles** — tiles are images; the lesson title appears in the hover tooltip
- **No gradients except the track-tinted glow** at the tile edge

Anchor tiles (the 5 most-visited, illustrated by hand first) set the visual standard. The rest are batch-generated against the style guide and edited until consistent.

### 2.3 Color system (already in `app/globals.css`)

| Track             | Accent       | Hex       |
| ----------------- | ------------ | --------- |
| Foundations       | Terracotta   | `#e07a5f` |
| ML Execution      | Sage         | `#81b29a` |
| LLM Architecture  | Gold         | `#f2cc8f` |
| ML Compilers      | Indigo       | `#5b8acc` |

Tile edges glow with their region's accent. At region boundaries, neighbor tiles share a subtle gradient — the actual "mosaic grout" effect.

## 3. Mosaic layout

50 lessons across 4 tracks, organized as 4 organic clusters that touch at the center:

```
        ┌─ Foundations region ─┐ ┌─ Execution region ─┐
        │   (terracotta)       │ │     (sage)         │
        │   ~12 tiles          │ │   ~12 tiles        │
        └──────────────────────┘ └────────────────────┘
                              ╳   (touching at center)
        ┌─ Architecture region ┐ ┌─ Compilers region ─┐
        │     (gold)           │ │    (indigo)        │
        │   ~13 tiles          │ │   ~13 tiles        │
        └──────────────────────┘ └────────────────────┘
```

Within each region, tiles are arranged in a roughly-circular hex cluster. Module groupings within a track are visually nested (sub-clusters within the region). The whole shape is roughly rectangular/diamond at full size — fits a 1280×800 viewport without scrolling.

Tile coordinates are **hand-tuned**, not algorithmically packed — the artisan feel matters. Stored as a config file (`lib/mosaic-tiles.ts`):

```ts
type TileDef = {
  slug: string                          // lesson URL
  title: string
  track: TrackKey
  module: string
  q: number                             // axial hex q
  r: number                             // axial hex r
  illustration: string                  // tile-component name
}
```

## 4. Tile states & transitions

| State        | Visual                                                                    |
| ------------ | ------------------------------------------------------------------------- |
| Locked       | 30% opacity, dotted hex outline, no illustration                          |
| Available    | 80% opacity, solid colored outline, faint pulse, monochrome illustration  |
| In progress  | (optional) 90% opacity, breathing glow                                    |
| Completed    | 100% opacity, full-color illustration, subtle hover lift                  |

**"Available" gating:** a lesson is available once every lesson before it in `_meta.ts` order is completed — *or* the user sets a "free explore" toggle that unlocks everything (default off, but obvious). Don't be heavy-handed about gating; it should feel like progression, not a wall.

**Completion animation:** when a lesson is marked complete, its tile transitions over 800 ms — a paint-stroke fill effect (CSS `clip-path` reveal from center out), then a brief glow flash, then settles. Once. Not on every page load.

**Track-completion celebration:** when all tiles in a region are done, the region shimmers (subtle 4-second sweep). Subtle, not casino.

## 5. Where the mosaic appears

| Surface         | Treatment                                                                 |
| --------------- | ------------------------------------------------------------------------- |
| `/` (landing)   | Hero stays as intro. Mosaic is the centerpiece below the hero.           |
| `/map`          | Dedicated full-viewport mosaic with pan/zoom. The "returning home" page.  |
| `/cheatsheet`   | Same mosaic; hover/click reveals the TL;DR of each tile, no navigation.   |
| Lesson page     | Mini-mosaic in the sidebar showing your local neighborhood (current tile + neighbors lit up), reinforces context |
| Module index    | Module's hex sub-cluster shown as a smaller embedded mosaic              |

## 6. Interaction model

- **Hover:** tooltip card slides in (lesson title, ~12-word summary, "click to start" CTA, completion check if done). Tile lifts ~3 px and brightens.
- **Click:** navigates to the lesson. If locked, plays a small "shake" + tooltip says what to finish first.
- **Cmd/Ctrl+click:** opens lesson in a slide-out reader (no nav away). For previewing.
- **Keyboard:** Tab cycles through tiles in reading order, Enter opens, arrow keys move between neighbors. Critical for accessibility.
- **Mobile:** tap = tooltip, second tap = navigate. Pinch-zoom on `/map`.

## 7. Tech architecture

```
mosaic/
├── lib/
│   ├── mosaic-tiles.ts          # the 50-tile config (slug, coords, illustration name)
│   └── mosaic-progress.ts       # localStorage helpers (already exists, mostly)
├── components/
│   ├── MosaicMap.tsx            # <MosaicMap variant="full" | "neighborhood" | "cheatsheet" />
│   ├── MosaicTile.tsx           # one hex tile with state-aware rendering
│   ├── MosaicTooltip.tsx        # hover/focus tooltip
│   └── tiles/                   # one file per illustration, default-exported SVG component
│       ├── stack-vs-heap.tsx
│       ├── kv-cache-ring-buffer.tsx
│       ├── operator-fusion.tsx
│       └── ... (50 total)
├── app/
│   ├── map/page.tsx             # full-viewport map view
│   └── cheatsheet/page.tsx      # rewritten to render <MosaicMap variant="cheatsheet">
└── content/index.mdx            # adds <MosaicMap /> below <Hero />
```

**Rendering:** all SVG, single root `<svg>` per surface. Tile illustrations are React components, not asset files — keeps everything diffable, tweakable, no asset pipeline. Inline SVG total weight ~150 KB; cheap.

**Performance:** static data, zero data-fetching. Hover state is local React state. Progress state subscribes to the existing `mosaic:progress` localStorage event.

**Animation:** CSS transitions for state changes. Framer Motion (already a transitive dep of Nextra theme — let me verify; if not, optional add) only if I need orchestrated entrance animations on `/map`. Default to no extra deps.

**Accessibility:** every tile is a `<button>` with `aria-label="{title} — {state}"`, `role="img"` for the illustration. A "List view" toggle on `/map` exposes the same content as a flat keyboard-navigable list. Reduced-motion media query disables completion animations.

## 8. Illustration strategy

The single biggest unknown. Recommended path:

1. **Define the style guide as a written prompt + 5 anchor tiles drawn by hand** (Foundations: Stack vs Heap, ML Execution: GEMM, Architecture: KV Cache, Compilers: MLIR Lowering, plus one cross-region illustration for the hero). These set the bar.
2. **Batch-generate the remaining ~45 tiles** using the style-guide prompt + a per-lesson concept description, via image generation. Iterate per-tile until they match the anchors.
3. **Manual cleanup pass** — open each generated tile in a vector editor, fix line weights, align centers, ensure each tile feels like a member of the family.
4. **Versioned**: each tile's SVG lives in git; "v2" of an illustration just replaces the file.

Total commitment: ~3 days of focused illustration + cleanup work for a complete first set. Cheaper than commissioning, more personal than off-the-shelf icons.

**Backup plan if illustrations don't come together:** ship Phase 1 with monoline geometric tile placeholders (algorithmically generated from concept keywords — circle, triangle, line patterns). Ugly is okay if it ships; replace tile-by-tile as illustrations land.

## 9. Phasing

### Phase 1 — make it real (target: 2–3 days)

- [ ] `lib/mosaic-tiles.ts` config for all current tracks/modules/lessons (~50 entries, mostly with `illustration: 'placeholder'`)
- [ ] `<MosaicMap>` + `<MosaicTile>` + `<MosaicTooltip>` components, all 4 states rendering
- [ ] Hex layout, hand-tuned coords for the 4 regions
- [ ] Hover, click, keyboard nav, focus rings
- [ ] localStorage progress integration (already exists; just consume)
- [ ] 5 hand-illustrated anchor tiles (the existing sample lesson + 4 across other tracks)
- [ ] Replace `content/index.mdx` mosaic section to render `<MosaicMap variant="landing" />`
- [ ] Rebuild `/cheatsheet` as `<MosaicMap variant="cheatsheet" />` with TL;DR overlays
- [ ] New `/map` route, full-viewport
- [ ] Reduced-motion + keyboard accessibility audit

### Phase 2 — fill the mosaic (target: 1–2 weeks)

- [ ] All 50 tile illustrations finalized (style-guide-driven generation + cleanup)
- [ ] Completion paint-stroke animation
- [ ] Track-completion shimmer
- [ ] Module-level mini-mosaic on module index pages
- [ ] Lesson-page neighborhood mini-mosaic in sidebar

### Phase 3 — delight (later)

- [ ] Per-tile micro-animations on hover (ring buffer rotates, fusion folds)
- [ ] Course-completion easter egg (whole mosaic comes alive)
- [ ] Shareable progress images ("I'm 32% through Mosaic" auto-generated PNG)
- [ ] Optional sound design (very tasteful)

## 10. Risks & mitigations

| Risk                                                   | Mitigation                                                  |
| ------------------------------------------------------ | ----------------------------------------------------------- |
| 50 illustrations don't feel like one set               | Anchor tiles first; rigid style guide; review in batches    |
| Hex layout becomes unwieldy as lessons are added       | Layout is hand-tuned but config-driven; growing it is editing one file |
| Mosaic is beautiful but slow on low-end devices        | All static SVG, zero JS work on render; use `prefers-reduced-motion` |
| Heavy visual UI is inaccessible                        | List-view toggle on `/map`, full keyboard nav, ARIA labels  |
| The metaphor is *too cute* and gets in the way         | Linear sidebar nav (current Nextra) stays as alt path; mosaic doesn't replace, it augments |
| Illustration work blocks shipping                      | Phase 1 ships with monoline geometric placeholders; tiles replace incrementally |

## 11. Open decisions for you

1. **Gating:** do you want lessons to be locked-until-prereq-done, or all unlocked from day one (mosaic as visualization only, no progression gating)? Default I'd recommend: unlocked, mosaic visualizes progress only — gating feels paternalistic for a free course.
2. **Illustration approach:** the style guide + AI-generation pipeline I described, or hire/commission, or self-illustrate? My pick: AI-generation with anchor-by-hand cleanup; cheapest path that still feels like *yours*.
3. **Where the mosaic replaces vs augments:** keep the current docs sidebar everywhere except `/map`, or remove sidebar from `/cheatsheet` to make the mosaic the only nav there too? My pick: keep sidebar everywhere — mosaic is a *second* navigation surface, not a replacement.

## 12. What ships at the end of Phase 1

http://localhost:3000/ — Hero (existing) → mosaic centerpiece below. Hover any tile, see what it is. Click, go to that lesson. 5 tiles look gorgeous; 45 are tasteful placeholders. Progress persists. Refresh, your filled tiles stay filled.

http://localhost:3000/map — full-viewport mosaic. Just the artwork. The home for returning users.

http://localhost:3000/cheatsheet — same mosaic; hover reveals TL;DR card; click stays on page.

That's the moment Mosaic stops being a docs site and starts being something people screenshot.

---

**Status:** plan written, awaiting approval. Phase 1 build kicks off after you sign off + answer the 3 open decisions in §11.
