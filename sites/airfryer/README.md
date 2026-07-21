# Crisply — air fryer cook times & temperatures

A static, ad-ready, SEO-first site that gives the temperature, the time, and a
built-in timer for whatever you're air-frying — no recipe-blog scrolling.
Placeholder brand **Crisply** — change it in one file (see below).

- **Stack:** Astro 7 (static) · Preact islands (search + cook timer) · Tailwind 4 · `@astrojs/sitemap`
- **Pages:** ~90 — 60 food pages (each with a timer), 7 category pages, an all-foods index, a temperature chart, guides, trust pages
- **Data:** a hand-curated dataset of 60+ foods; USDA safe internal temps for every protein. No live API.
- **Runs on:** Cloudflare Pages free tier · **$0/month**

> **On accuracy:** cook times are honest *ranges* (air fryers vary), presented as
> starting points; every meat/fish page shows the **USDA safe internal
> temperature** to cook to. See `/methodology` on the live site.

---

## 1. Rename it (one-line rebrand)

Edit `src/config.ts`:

```ts
export const SITE = {
  SITE_NAME: "Crisply",
  SITE_URL: "https://crisply.com",
  CONTACT_EMAIL: "hello@crisply.com",
  ADSENSE_PUB_ID: "",   // leave EMPTY until AdSense is approved
};
```

Then regenerate the share images and commit:

```bash
npm install
npm run og
```

## 2. Buy the domain (Cloudflare)

Cloudflare dashboard → **Domain Registration → Register Domains** → buy your `.com`
(shortlist is in the repo root `README.md`).

## 3. Deploy to Cloudflare Pages

1. Cloudflare → **Workers & Pages → Create → Pages → Connect to Git**, pick this repo.
2. Build configuration:
   - **Framework preset:** Astro
   - **Root directory (Advanced):** `sites/airfryer`  ← this is a monorepo
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
3. **Save and Deploy.**

## 4. Custom domain + www redirect

1. Pages project → **Custom domains** → add `yourdomain.com` and `www.yourdomain.com`.
2. **Rules → Redirect Rules → Create** → template **Redirect from WWW to Root**.
3. **SSL/TLS → Edge Certificates → Always Use HTTPS = On.**
   > ⚠️ The www→root redirect template only matches **https**, so this must be on.
4. **New-domain certificates can take up to ~1 hour** to go live — a brief warning right after adding the domain is normal.

## 5. Data (curated — no refresh secret)

The food dataset lives in `src/data/foods.json` and is hand-curated, so there's no
external feed and **no secret to configure.** A GitHub Action
(`.github/workflows/airfryer-ci.yml`) validates the dataset and builds the site on
every push as a quality gate. To add or edit foods, edit `foods.json` and run
`npm run data` (it validates and regenerates the public search index).

## 6. Get indexed (Google Search Console)

1. Add your domain as a property in **Google Search Console** (verify via DNS TXT).
2. Submit the sitemap using the **full URL** (this site uses a sitemap *index*):
   ```
   https://yourdomain.com/sitemap-index.xml
   ```
3. Indexing ramps over days to weeks; request indexing for the homepage, the temperature chart, and a few popular food pages.

## 7. When to apply to AdSense

**Not on day one.** Apply once pages are indexed and getting some organic traffic —
usually **~2–4 weeks** after submitting the sitemap. Then:

1. Set `ADSENSE_PUB_ID` in `src/config.ts`.
2. Paste ad **slot** ids into the `<AdSlot slot="…" />` placements. Until you do, ad slots render **nothing** (no empty boxes, no layout shift).
3. `ads.txt` auto-updates from the config; redeploy.

---

## Local development

```bash
npm install
npm run dev      # http://localhost:4321
npm run data     # validate the dataset + regenerate the public search index
npm run og       # regenerate OG share images
npm run build    # production build -> dist/
```

## How it's put together

- `src/config.ts` — branding (the one place to edit)
- `src/data/foods.json` — the food dataset (times, temps, USDA doneness); `foods.ts` is the typed loader + USDA table
- `scripts/build-data.mjs` — validates the dataset and emits `public/data/foods.json` for search
- `src/components/islands/CookTimer.tsx` — the per-food timer (fresh/frozen toggle, doneness reminder)
- `src/components/islands/FoodSearch.tsx` — the homepage search
- `src/content/guides/` — editorial guides (Markdown)
- Data sourcing and the food-safety approach are documented on the site's `/methodology` page.
