# Contributing to Mosaic

Mosaic is open to typo fixes, lesson improvements, new lessons, and platform tweaks. The bar is *the result must read better than what's already there*.

## Quick contributions (typo, broken link, factual error)

Open a PR. Title it `fix: brief description`. No issue needed.

## New lesson

1. Read [`AUTHORING.md`](./AUTHORING.md) — it covers the 9-section template, the components, and the registration steps.
2. Spend 10 minutes reading two reference lessons before writing yours: [`content/foundations/cpp-memory/stack-vs-heap.mdx`](./content/foundations/cpp-memory/stack-vs-heap.mdx) and [`content/llm-architecture/kv-cache/kv-basics.mdx`](./content/llm-architecture/kv-cache/kv-basics.mdx). Match their density and voice.
3. `cp templates/LESSON_TEMPLATE.mdx content/<track>/<module>/<your-slug>.mdx` and fill it.
4. Register the lesson in three places (the build will fail loudly if any are missing): the module's `_meta.ts`, the module's `index.mdx` `<ModuleProgress />`, and `lib/mosaic-tiles.ts`.
5. `npm run dev` to preview. `npm run lint-mdx && npm run verify-mapping && npm run build` before pushing.
6. Open a PR. Include a one-paragraph "what's in this lesson" description and a screenshot of the rendered TL;DR section.

## Platform changes

Substantial platform changes (new component, navigation shift, build-pipeline change) — open an issue first. Discuss the design before writing code.

## Code style

Match the file you're editing. We don't enforce a formatter; we trust the contributor's judgment.

## Review SLA

Single-lesson PRs and typo fixes: usually within a week. Larger changes: longer; depends on review bandwidth.

## License

By submitting a PR you agree your contribution will be released under the project's MIT license.
