# Voltroam — travel adapter & voltage checker

A static, ad-ready, SEO-first site that tells travellers exactly what power gear
they need for any of 218 countries. Placeholder brand **Voltroam** — change it in
one file (see below).

- **Stack:** Astro 7 (static) · Preact island (route checker) · Tailwind 4 · `@astrojs/sitemap`
- **Pages:** ~1,780 — 218 country pages, ~1,500 country-to-country route guides, 14 plug-type pages, 5 regions, 13 editorial guides, trust pages
- **Runs on:** Cloudflare Pages free tier · **$0/month** (data is a committed snapshot; no live API)

---

## 1. Rename it (one-line rebrand)

Open `src/config.ts` and edit the four values:

```ts
export const SITE = {
  SITE_NAME: "Voltroam",              // your brand name
  SITE_URL: "https://voltroam.com",   // your domain, no trailing slash
  CONTACT_EMAIL: "hello@voltroam.com", // shown on trust pages
  ADSENSE_PUB_ID: "",                  // leave EMPTY until AdSense is approved
};
```

Then regenerate the social share images so they show the new name:

```bash
npm install
npm run og      # rewrites public/og/*.png from the new brand
```

Commit the changes. That's the entire rebrand.

---

## 2. Buy the domain (Cloudflare)

1. In the Cloudflare dashboard: **Domain Registration → Register Domains**.
2. Search your chosen name (see the ranked shortlist in the repo root `README.md`), buy the `.com`.
   Registering through Cloudflare means DNS is already set up for you.

## 3. Deploy to Cloudflare Pages

1. Push this repo to GitHub (already done on your branch).
2. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**, pick this repo.
3. Set the build configuration **exactly**:
   - **Framework preset:** Astro
   - **Root directory (Advanced):** `sites/adapters`  ← important, this is a monorepo
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Click **Save and Deploy**. First build takes a couple of minutes; you'll get a
   `*.pages.dev` preview URL.

## 4. Connect your custom domain + www redirect

1. In the Pages project → **Custom domains → Set up a custom domain** → add `yourdomain.com` (the root/apex).
2. Add `www.yourdomain.com` too.
3. Make the root canonical (redirect www → root):
   - Cloudflare dashboard → your domain → **Rules → Redirect Rules → Create**.
   - Template: **Redirect from WWW to Root** (or: if hostname equals `www.yourdomain.com`, 301 to `https://yourdomain.com/$1`).
4. **Enable "Always Use HTTPS":** domain → **SSL/TLS → Edge Certificates → Always Use HTTPS = On.**
   > ⚠️ The www→root redirect template only matches **https** traffic, so this
   > toggle must be on or `http://www…` won't redirect.
5. **New-domain certificates can take up to ~1 hour** to go live. If you see a
   certificate warning right after adding the domain, wait — it's normal.

## 5. Data refresh (optional — this data is evergreen)

Plug and voltage standards barely change, so there's nothing to run on day one and
**no secret to configure.** A GitHub Action (`.github/workflows/adapters-data.yml`)
re-derives the dataset quarterly and on demand, re-fetching the upstream snapshot
with the committed file as a fallback. To run it once manually: GitHub → **Actions →
Refresh adapter data → Run workflow**.

## 6. Get indexed (Google Search Console)

1. Go to **Google Search Console**, add your domain as a property (Domain
   property → verify via the DNS TXT record Cloudflare makes easy).
2. Submit your sitemap — **use the full URL, not just the filename:**
   ```
   https://yourdomain.com/sitemap-index.xml
   ```
   (Submitting `sitemap.xml` will not work — this site uses a sitemap **index**.)
3. Indexing ramps over days to weeks. Check back; request indexing for the homepage
   and a few country pages to nudge it.

## 7. When to apply to AdSense

**Not on day one.** Apply once you have real indexed pages and a trickle of organic
traffic — usually **~2–4 weeks** after the sitemap is submitted and pages start
ranking. AdSense reviewers want to see a site with content and visitors, not a
brand-new empty domain.

When approved:
1. Put your publisher id in `src/config.ts` → `ADSENSE_PUB_ID` (e.g. `ca-pub-1234567890123456`).
2. Paste your ad **slot** ids into the `<AdSlot slot="…" />` placements (search the
   `src/pages` files). Until you do, ad slots render **nothing** — no empty boxes,
   no layout shift.
3. `ads.txt` auto-updates from the config; redeploy.

---

## Local development

```bash
npm install
npm run dev      # http://localhost:4321
npm run data     # regenerate the dataset from committed sources (offline, deterministic)
npm run og       # regenerate OG share images
npm run build    # production build -> dist/
npm run check    # astro type/diagnostics check
```

## How it's put together

- `src/config.ts` — branding (the one place to edit)
- `src/data/sources/` — committed source snapshots (IEC plugs CSV, ISO regions) + provenance
- `scripts/build-data.mjs` — deterministic transform → `src/data/countries.json` (+ a slim public copy for the island)
- `src/data/plugTypes.ts` — the 14 plug types + physical-fit compatibility matrix
- `src/lib/adapter.ts` — the adapter/converter verdict logic
- `src/components/` — shared architecture: `AdSlot`, `ConsentBanner`, `Seo`, `Header`, `Footer`, islands
- `src/content/guides/` — the editorial guides (Markdown)
- `src/pages/` — programmatic + editorial + trust pages

Data provenance and the adapter logic are documented on the site's own
`/methodology` page.
