# Worktally — business-day & public-holiday calculator

A static, ad-ready, SEO-first site that counts working days and public holidays for
200+ countries — with each country's real weekends and holidays built in.
Placeholder brand **Worktally** — change it in one file (see below).

- **Stack:** Astro 7 (static) · Preact island (calculator) · Tailwind 4 · `@astrojs/sitemap`
- **Pages:** ~1,850 — 205 country holiday hubs, ~1,435 country×year pages, 205 business-day pages, guides, trust pages
- **Data:** the open `date-holidays` dataset, generated into a committed snapshot (2024–2030). No live API.
- **Runs on:** Cloudflare Pages free tier · **$0/month**

---

## 1. Rename it (one-line rebrand)

Edit `src/config.ts`:

```ts
export const SITE = {
  SITE_NAME: "Worktally",
  SITE_URL: "https://worktally.com",
  CONTACT_EMAIL: "hello@worktally.com",
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
(shortlist is in the repo root `README.md`). Registering here sets up DNS for you.

## 3. Deploy to Cloudflare Pages

1. Cloudflare → **Workers & Pages → Create → Pages → Connect to Git**, pick this repo.
2. Build configuration:
   - **Framework preset:** Astro
   - **Root directory (Advanced):** `sites/bizdays`  ← this is a monorepo
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
3. **Save and Deploy.**

## 4. Custom domain + www redirect

1. Pages project → **Custom domains** → add `yourdomain.com` and `www.yourdomain.com`.
2. **Rules → Redirect Rules → Create** → template **Redirect from WWW to Root**.
3. **SSL/TLS → Edge Certificates → Always Use HTTPS = On.**
   > ⚠️ The www→root redirect template only matches **https**, so this must be on.
4. **New-domain certificates can take up to ~1 hour** to go live — a brief warning right after adding the domain is normal.

## 5. Data refresh (annual, automatic)

Holiday dates are generated from the open `date-holidays` library into a committed
snapshot covering **2024–2030**. A GitHub Action
(`.github/workflows/bizdays-data.yml`) runs **every January 2** (and on demand) to
roll the window forward and pull upstream fixes, committing the result. The
committed snapshot is the fallback, so a failed refresh never breaks the build.
**No secret to configure.** To run it now: GitHub → **Actions → Refresh holiday data
→ Run workflow**.

To widen the year range, edit `scripts/build-data.mjs` (the `YEARS` loop) and run
`npm run data`.

## 6. Get indexed (Google Search Console)

1. Add your domain as a property in **Google Search Console** (verify via the DNS TXT record).
2. Submit the sitemap using the **full URL** (this site uses a sitemap *index*):
   ```
   https://yourdomain.com/sitemap-index.xml
   ```
3. Indexing ramps over days to weeks; request indexing for the homepage and a few country pages.

## 7. When to apply to AdSense

**Not on day one.** Apply once pages are indexed and getting a little organic
traffic — usually **~2–4 weeks** after submitting the sitemap. Then:

1. Set `ADSENSE_PUB_ID` in `src/config.ts`.
2. Paste ad **slot** ids into the `<AdSlot slot="…" />` placements. Until you do, ad slots render **nothing** (no empty boxes, no layout shift).
3. `ads.txt` auto-updates from the config; redeploy.

---

## Local development

```bash
npm install
npm run dev      # http://localhost:4321
npm run data     # regenerate the holiday snapshot (offline; uses date-holidays)
npm run og       # regenerate OG share images
npm run build    # production build -> dist/
```

## How it's put together

- `src/config.ts` — branding (the one place to edit)
- `scripts/build-data.mjs` — generates `src/data/countries.json`, `holidays.json`, `meta.json`, and per-country files in `public/data/holidays/`
- `src/lib/bizdays.ts` — pure business-day math (shared by pages and the calculator island)
- `src/components/islands/BusinessDayCalculator.tsx` — the interactive calculator
- `src/content/guides/` — editorial guides (Markdown)
- Data sourcing, weekend handling and limitations are documented on the site's `/methodology` page.
