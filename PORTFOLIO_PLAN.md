# Portfolio build plan & status

Persistent task list (survives across work sessions). Update as things land.

## Decisions (locked)
- **Portfolio shape:** independent standalone properties (distinct niches; separate CF Pages projects, one monorepo, one branch).
- **Reveal:** revealed up front.
- **Budget:** $0/month for all three (free public data, committed snapshots, GitHub Actions free tier). No paid infra pending.
- **Stack:** Astro 7 (static) + Preact islands + Tailwind 4 + `@astrojs/sitemap`. Node ≥ 22.12.
- **Branch:** `claude/portfolio-website-concepts-5enr2z`.

## Monorepo layout
```
sites/adapters   → Site 1  Travel adapters (placeholder brand: Voltroam)
sites/airfryer   → Site 2  Air-fryer cook times (placeholder brand: Crisply)   [pending]
sites/bizdays    → Site 3  Business-days/holidays (placeholder brand: Worktally) [pending]
```
Each is a standalone Astro project; deploy each as its own CF Pages project with root = its subdir.

## Shared architecture (reusable across sites)
- [x] Config constant (`src/config.ts`: SITE_NAME/SITE_URL/CONTACT_EMAIL/ADSENSE_PUB_ID)
- [x] AdSlot (renders nothing until pub id) + Consent Mode v2 + cookie banner
- [x] Seo.astro (title/meta/canonical/OG/JSON-LD) + Base layout
- [x] Header/Footer, light+dark (no-FOUC theme init), a11y skip link
- [x] robots.txt + ads.txt dynamic endpoints, sitemap-index
- [ ] OG image generation (satori + resvg) per page type
- [ ] GitHub Action for data refresh (where applicable)

## Site 1 — Travel adapters (`sites/adapters`)  ✅ COMPLETE
- [x] Data pipeline: IEC plug CSV + ISO regions → `countries.json` (218 countries), committed snapshots + provenance
- [x] Domain model: plugTypes A–N + compatibility matrix, adapter/converter logic
- [x] Homepage with RouteFinder island + FAQ/JSON-LD
- [x] `/country/[slug]` — 218 pages (unique data, per-origin table, FAQs, JSON-LD, internal links)
- [x] `/adapter/[from]-to-[to]` — 1,519 route pages (popular origins × all dests)
- [x] `/plug-types` + `/plug-types/[id]` — 14 + index
- [x] `/region/[region]` — 5 pages
- [x] `/countries` index (with filter)
- [x] 13 editorial guides (`/guides`) — 3 authored + 10 via briefed subagents, fact-checked
- [x] Trust pages: about, methodology, contact, privacy, terms
- [x] 404, per-type OG images (satori+resvg), README launch checklist
- [x] Data-refresh GitHub Action (re-fetch upstream + committed fallback)
- [x] Production build green (1,780 pages, 5s); all 64k internal links resolve

## Site 2 — Air-fryer cook times (`sites/airfryer`)  [not started]
- [ ] Source USDA safe temps + compile cook-time ranges w/ citations (committed snapshot)
- [ ] Timer island, from-frozen/fresh toggle
- [ ] food × appliance programmatic pages, guides, trust pages, OG, README

## Site 3 — Business-days/holidays (`sites/bizdays`)  ✅ COMPLETE (built 2nd)
- [x] Data: `date-holidays` (open, MIT) → committed snapshot, 205 countries × 2024–2030 (18k+ holidays); per-country weekend map
- [x] Business-day calculator island (days-between + add/subtract, editable weekend, on-demand holiday fetch)
- [x] `/holidays/[country]` (205) + `/holidays/[country]/[year]` (~1,435) + `/business-days/[country]` (205, monthly working-day tables)
- [x] `/holidays`, `/business-days`, `/countries` index hubs (distinct data angles)
- [x] 12 guides (2 authored + 10 via briefed subagents, dates fact-checked, legal disclaimer)
- [x] Trust pages, 404, per-type OG (indigo), README, annual data-refresh Action
- [x] Build green (1,868 pages); all 84k internal links resolve

## Deliverables checklist (per site)
- [ ] Full codebase on branch
- [ ] README with dumbed-down launch checklist (domain → CF Pages → DNS/redirect → data secret → GSC → when to apply to AdSense) + deploy gotchas
- [ ] Distinct visual identity (palette + type, light+dark, responsive, a11y)
- [ ] Programmatic pages with unique data + FAQs + dense internal links
- [ ] Per-page title/meta/H1, JSON-LD, partitioned sitemap, robots, canonicals, per-type OG
