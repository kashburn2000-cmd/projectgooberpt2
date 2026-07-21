# Data provenance

These are committed snapshots so the site builds deterministically and never
depends on a live API at request time.

## `world-plugs.iec.csv`
- **What:** plug/socket type, nominal voltage, and frequency for each country.
- **Origin:** the [`benjiao/world-plugs`](https://github.com/benjiao/world-plugs)
  dataset, scraped from the International Electrotechnical Commission (IEC)
  "World Plugs" reference. One row per country × plug type.
- **Refreshed by:** `.github/workflows/adapters-data.yml` (quarterly / on demand),
  which re-fetches this file and falls back to this committed copy if the fetch fails.

## `iso-3166.json`
- **What:** ISO 3166-1 country names, alpha-2/alpha-3 codes, region and sub-region.
- **Origin:** [`lukes/ISO-3166-Countries-with-Regional-Codes`](https://github.com/lukes/ISO-3166-Countries-with-Regional-Codes)
  (public-domain UN M49 / ISO 3166 mapping).
- **Used for:** friendly country names, URL slugs, and region grouping.

## Transform
`scripts/build-data.mjs` joins these two by country code, applies a small set of
friendly-name and region fixups (documented inline), and emits:
- `src/data/countries.json` — the typed dataset the site imports
- `public/data/countries.slim.json` — a single cached file the route-checker island fetches

Nothing here is fabricated; every value traces back to one of the two sources
above. Known limitations (regional voltage variation, plug-fit vs. safety) are
disclosed on the site's `/methodology` page.
