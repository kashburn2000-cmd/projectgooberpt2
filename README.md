# Website portfolio

Three independent, ad-monetization-ready, SEO-first static sites — each attacking
a distinct market gap where the incumbents are wrong, stale, generic, ugly, or
paywalled. Built on **Astro (static) + Preact islands + Tailwind + Cloudflare
Pages**, $0/month to run (free public data, committed snapshots, GitHub Actions
free tier).

- Ideation & scoring: [`IDEATION.md`](./IDEATION.md)
- Build status / task list: [`PORTFOLIO_PLAN.md`](./PORTFOLIO_PLAN.md)

## The three sites

| Dir | What it is | Why it wins | Placeholder brand |
|-----|------------|-------------|-------------------|
| [`sites/adapters`](./sites/adapters) | "Do I need a travel adapter for A→B?" — plug/voltage by country + route tool | Incumbents are dated info-dumps or affiliate listicles; nobody answers *your route* cleanly. IEC-sourced, evergreen, hands-off. | Voltroam |
| [`sites/bizdays`](./sites/bizdays) | International business-days & public-holidays calculator | Long-tail per-country tooling timeanddate under-serves; open-data + annual auto-refresh. | Worktally |
| [`sites/airfryer`](./sites/airfryer) | Air-fryer cook-time database with a built-in timer | Beats recipe-blog bloat — the number, instantly, with USDA doneness temps. | Crisply |

Each site is a **standalone** Astro project. Deploy each as its own Cloudflare
Pages project with the **root directory** set to its subfolder — they do not share
a build. Rebranding is a one-line edit of `src/config.ts` in each.

## Monorepo layout
```
sites/<name>/
  src/config.ts        ← the ONE place to change name / domain / contact / AdSense id
  src/data/            ← committed data snapshots + generated dataset
  src/components/       (shared architecture: AdSlot, Consent, Seo, Header, Footer, islands)
  src/pages/            (programmatic + editorial + trust pages)
  scripts/build-data.mjs
  README.md            ← per-site launch checklist
```

## Working locally
```bash
cd sites/adapters
npm install
npm run data     # regenerate dataset from committed snapshots (deterministic, offline)
npm run dev      # local dev server
npm run build    # production build -> dist/
```

## Domain name shortlists

Coined compound names (subject root + melodic suffix, ≤3 syllables, `.com`).
**Availability is not checked here** — check each in Cloudflare's registrar search.
Apply your pick by editing `SITE_NAME` / `SITE_URL` in that site's `src/config.ts`.

**Site 1 — Travel adapters:** Voltroam · Plugpath · Voltpin · Plugpass · Voltmate · Wattport · Voltglobe · Adaptrip · Roamvolt · Voltpass · Plugport · Socketly · Voltura · Plugaro · Wattmate · Voltago · Plugwave · Currento

**Site 2 — Air-fryer times:** Crisply · Fryver · Crispwave · Frybase · Sizzly · Fryly · Crispo · Frydial · Crispmate · Sizzlo · Fryzen · Crispera · Crispio · Fryndly · Heatly · Crispd · Airfryly · Frymate

**Site 3 — Business-days/holidays:** Daywise · Worktally · Bizdays · Datemesh · Dayspan · Dayforge · Netdays · Workdue · Daygrid · Bizcal · Tallyday · Datebridge · Daymesh · Workspan · Daytally · Bizday · Workgrid · Daycount

> Naming tip / recipe to riff on: subject root + a short melodic suffix (-ly, -o, -a,
> -mate, -path, -wave, -port), say it out loud, and make sure it isn't one letter off
> a real brand (e.g. avoided Workday, Calendly, Plugwise).
