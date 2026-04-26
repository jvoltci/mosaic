# Deploying & Updating Mosaic

The complete playbook for putting Mosaic on the public internet and pushing updates from your laptop.

---

## First-time deploy (15 minutes)

### 1. Create a GitHub repo

```bash
cd /Users/shivya/Documents/maia/ai/mosaic
git add .
git commit -m "Initial Mosaic"
gh repo create mosaic --public --source . --push
# or via the web UI: https://github.com/new
```

If you don't have `gh` installed:

```bash
brew install gh && gh auth login
```

### 2. Connect to Vercel (free hosting)

The fastest path:

```bash
npx vercel
# Pick: link to existing project? No
# Project name: mosaic
# Directory: ./ (default)
# Build command, output: defaults
```

Or via the dashboard:

1. Go to <https://vercel.com/new>
2. Sign in with GitHub
3. Import your `mosaic` repo
4. Accept all defaults — Vercel auto-detects Next.js
5. Click *Deploy*

After ~60 seconds you'll have a live URL like `https://mosaic-xyz.vercel.app`. Every push to `main` redeploys automatically. Pull requests get preview URLs.

### 3. Update placeholders

Search-and-replace `your-github` and `jvoltci` with your actual GitHub username:

```bash
# Files to update:
#   app/layout.tsx (no longer has these — but check)
#   components/course/CourseShell.tsx        — footer GitHub link
#   components/SupportSection.tsx            — Buy-Me-a-Coffee handle, UPI VPA, GitHub Sponsors handle
#   AUTHORING.md                             — repo URLs
#   README.md                                — repo URLs
#   DEPLOY.md (this file)                    — repo URLs
```

```bash
grep -rl "jvoltci" --include="*.{tsx,ts,md,mdx}" . | xargs sed -i '' 's/jvoltci/<your-github>/g'
```

### 4. Custom domain (optional)

In the Vercel dashboard → Project → Settings → Domains → add `mosaic.dev` (or whatever you bought). Vercel walks you through DNS. SSL is automatic.

---

## Day-to-day: pushing updates

```bash
git checkout -b add-lesson-flash-attention
# ...edit / write a new lesson...
npm run dev                              # preview at localhost:3000
git add content/llm-architecture/attention/flash-attn-3.mdx \
        lib/mosaic-tiles.ts \
        content/llm-architecture/attention/_meta.ts
git commit -m "lesson: FlashAttention-3"
git push -u origin add-lesson-flash-attention
gh pr create --fill                      # or open the link Git prints
```

Vercel builds a preview URL for the PR. Merge to `main` → live.

For tiny fixes (typos, broken link), just push directly to `main`:

```bash
git pull
# ...fix...
git commit -am "fix: typo in KV cache lesson"
git push
```

---

## Common tasks

### Add a new lesson

See [`AUTHORING.md`](./AUTHORING.md) — that's the full playbook. Short version:

1. `cp templates/LESSON_TEMPLATE.mdx content/<track>/<module>/<your-slug>.mdx`
2. Fill in the 9 sections
3. Register in the parent module's `_meta.ts` and `<ModuleProgress>`
4. Add a tile entry in `lib/mosaic-tiles.ts` with `available: true`
5. Push

### Update SOTA references

Every lesson's `<Resources>` block goes stale over time. Quarterly sweep:

```bash
grep -l "<Resources" content/**/*.mdx
```

Update papers/blogs/repos to current versions. Mark superseded references explicitly (e.g., FlashAttention → FlashAttention-3).

### Fix the cheatsheet aggregator

If a lesson's TL;DR doesn't appear:

```bash
npm run build-cheatsheet     # regenerate lib/cheatsheet-index.json
git add lib/cheatsheet-index.json
git commit -m "rebuild cheatsheet"
git push
```

### Update deps

```bash
npm outdated                 # see what's stale
npm update next nextra nextra-theme-docs   # patch updates only
# For majors, read the changelog first:
npx npm-check-updates -u next nextra
npm install
npm run build                # confirm nothing broke
```

---

## What runs on every deploy

When Vercel builds:

1. `npm install`
2. `npm run prebuild` → `node scripts/build-cheatsheet.mjs` (regenerates `lib/cheatsheet-index.json`)
3. `npm run build` → `next build` (static pages for every route)
4. Deploys static output to Vercel's edge network

No backend, no database, no environment variables (yet). Mosaic is 100% static.

---

## Costs

| Service | Cost | Why |
| --- | --- | --- |
| Vercel | **$0** | Hobby plan covers Mosaic forever (unless you exceed 100 GB bandwidth/month — *huge* traffic) |
| GitHub | **$0** | Public repo, unlimited |
| Custom domain (optional) | ~$12/yr | Namecheap, Cloudflare Registrar, Porkbun |
| **Total** | **$0–12/yr** | |

If you ever need analytics: Vercel Web Analytics is free and zero-config. Just toggle it on in the project settings.

---

## Tips from running this in production

- **Never run `npm run build` while `npm run dev` is running** in the same checkout. They share `.next/` and stomp on each other (you'll see `Cannot find module './vendor-chunks/...'`). Stop dev first, or build in a separate worktree.
- **Don't commit `.next/`, `node_modules/`, `lib/cheatsheet-index.json` is auto-generated** but committing it is fine — keeps Vercel build fast.
- **Test on phone** before pushing — DevTools mobile preview misses some real-device quirks (font rendering, touch targets, Pyodide load time). Open the preview URL on your actual phone for any visual change.
- **The SVG mosaic ships ~150 KB inline** — fine for landing/cheatsheet/map but cache hard. Vercel CDN handles this.
- **Pyodide loads ~6 MB on first `RunInBrowser` click**. Don't pre-load it on the landing.

---

## Domains worth considering

- `mosaic.dev` — clean, on-brand
- `mosaic.so` — short, available
- `learnmosaic.com` — descriptive

Buy from Cloudflare Registrar or Porkbun (no markup). Avoid GoDaddy.

---

## When something breaks in production

Check the deploy log on Vercel first — most failures are caught at build time and the URL stays on the last successful deploy.

If a runtime error sneaks through (rare with static export):

1. Check Vercel function logs (Project → Logs)
2. Roll back: Vercel → Deployments → click previous deploy → *Promote to Production*
3. Then fix locally and redeploy

---

## Future: when you outgrow this setup

Mosaic is intentionally simple. If at some point you want:

- **Search across the whole course better than Cmd+K** — drop in [Algolia DocSearch](https://docsearch.algolia.com/) (free for OSS)
- **User accounts / cloud progress** — Vercel Postgres + Auth.js
- **Comments under lessons** — [Giscus](https://giscus.app/) (uses GitHub Discussions, ~5 min to set up)
- **Email signups for new lessons** — [Buttondown](https://buttondown.email/) or [ConvertKit](https://convertkit.com/)

Each is a 30-min add. Don't add them until the course actually needs them.
