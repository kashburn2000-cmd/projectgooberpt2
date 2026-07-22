# Getting the sites online — full walkthrough

Everything is already built and pushed. This guide takes you from "code in GitHub"
to "live, indexed, ad-ready website." You'll do it **once per site** — they're
independent, so you can launch one, all three, or add them over time.

Each step says exactly where to click. No coding required (there's an optional
rename step you can hand back to Claude).

---

## The three sites at a glance

| Folder (you'll need this) | Placeholder name | What it is |
|---|---|---|
| `sites/adapters` | Voltroam | Travel plug adapter / voltage checker |
| `sites/bizdays` | Worktally | Business-day & public-holiday calculator |
| `sites/airfryer` | Crisply | Air-fryer cook times with a timer |

Domain name shortlists for each are in the root [`README.md`](./README.md).

---

## Prerequisites (one-time, ~5 min)

1. **A Cloudflare account** — free. Sign up at dash.cloudflare.com.
2. **The GitHub repo is already pushed** (`kashburn2000-cmd/projectgooberpt2`,
   branch `claude/portfolio-website-concepts-5enr2z`). You'll connect Cloudflare to it.
   - Optional but recommended: merge the branch into `main` first, so the live site
     tracks `main`. (GitHub → the repo → Pull requests, or just deploy directly from
     the branch — Cloudflare lets you pick which branch to build.)

---

## Step 1 — Pick and buy the domain

1. Decide the name for this site (see the shortlists in `README.md`). Check
   availability right in Cloudflare: **dash.cloudflare.com → Domain Registration →
   Register Domains**, type the name, buy the `.com`.
2. Registering through Cloudflare means DNS is already wired up — nothing else to configure.

> If a name is taken, just try the next one on the shortlist. Buying the domain and
> using the placeholder name in the code is fine — you can rename anytime.

---

## Step 2 — Set the site's name (optional, but do it before launch)

The site ships under a placeholder brand. To use your real name, change **four
values** in one file: `sites/<folder>/src/config.ts`

```ts
export const SITE = {
  SITE_NAME: "YourBrand",                 // shown everywhere
  SITE_URL: "https://yourbrand.com",      // your domain, no trailing slash
  CONTACT_EMAIL: "hello@yourbrand.com",
  ADSENSE_PUB_ID: "",                     // leave EMPTY for now
};
```

Two ways to do it:

- **Easiest:** tell Claude the names you chose and it will rename all three, regenerate
  the share images, and push — you skip this step entirely.
- **DIY on GitHub (no tools needed):** open the file on github.com, click the pencil
  ✏️, edit the four values, commit. (The social-share image will still show the old
  name until it's regenerated with `npm run og` — cosmetic only; you can do it later
  or ask Claude.)

---

## Step 3 — Deploy to Cloudflare Pages

1. **dash.cloudflare.com → Workers & Pages → Create → Pages → Connect to Git.**
2. Authorize GitHub if asked, then pick the repo `projectgooberpt2`.
3. On the **Set up builds and deployments** screen:
   - **Production branch:** `main` (or the `claude/...` branch if you didn't merge).
   - **Framework preset:** **Astro**
   - Click **"Root directory (advanced)"** and set it to the site's folder — e.g.
     **`sites/adapters`** (this is the key step for a monorepo).
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Click **Save and Deploy.** The first build takes 1–3 minutes.
5. When it finishes you get a preview URL like `voltroam.pages.dev`. Open it — the
   site should be fully working (search/tools included).

> **Node version is already pinned** to 22 via an `.nvmrc` file in each folder, so
> the build "just works." If a build ever fails complaining about the Node version,
> go to the Pages project → **Settings → Variables and Secrets → Add**, set
> `NODE_VERSION` = `22`, and retry the deployment.

---

## Step 4 — Connect your domain + www redirect + HTTPS

In the Pages project you just created:

1. **Custom domains → Set up a custom domain →** enter `yourdomain.com` (the root),
   follow the prompt. Then add `www.yourdomain.com` too.
2. **Force www → root** (so you don't split your SEO across two hostnames):
   - dash.cloudflare.com → your domain → **Rules → Redirect Rules → Create rule**.
   - Use the template **"Redirect from WWW to Root"** (or: *if hostname equals
     `www.yourdomain.com`, then 301 redirect to* `https://yourdomain.com/${1}`* / dynamic*).
3. **Turn on HTTPS everywhere:** your domain → **SSL/TLS → Edge Certificates →
   Always Use HTTPS = On.**
   > ⚠️ Important: the www→root redirect template only matches **https** traffic, so
   > this toggle must be on or `http://www…` visitors won't be redirected.
4. **Be patient with the certificate.** A brand-new domain's SSL certificate can take
   **up to ~1 hour** to go live. A certificate warning right after you add the domain
   is normal — check back later.

Repeat Steps 1–4 for each site you want online (different folder, different domain).

---

## Step 5 — Get it indexed (Google Search Console)

1. Go to **search.google.com/search-console** and **Add property → Domain →**
   enter `yourdomain.com`. Verify with the **DNS TXT record** it gives you (add it in
   Cloudflare → your domain → DNS → Records → Add record → type TXT).
2. **Submit your sitemap.** In Search Console → **Sitemaps**, enter the **full URL** —
   this is the #1 thing people get wrong:
   ```
   https://yourdomain.com/sitemap-index.xml
   ```
   (These sites use a sitemap **index**. Submitting just `sitemap.xml` won't work.)
3. Indexing ramps over days to weeks. Nudge it: in Search Console use **URL
   Inspection** on your homepage and a few key pages → **Request indexing**.

---

## Step 6 — Turn on ads (AdSense) — later, not now

**Don't apply on day one.** AdSense reviewers want to see a real site with indexed
pages and a little traffic. Wait until you've been indexed and are getting some
organic visits — typically **~2–4 weeks** after Step 5.

When you're ready:

1. Apply at **adsense.google.com** and add your domain.
2. Once approved you'll get a **publisher ID** like `ca-pub-1234567890123456`.
3. Put it in `src/config.ts` → `ADSENSE_PUB_ID`. Commit. That single change:
   - starts loading ads,
   - auto-fills `ads.txt` with the correct line,
   - keeps everything else the same.
4. In your AdSense dashboard, create ad units and copy each **slot ID**, then paste
   them into the `<AdSlot slot="…" />` tags in the site's pages (search the
   `src/pages` files for `AdSlot`). Until you do, ad slots simply render **nothing** —
   no empty boxes, no layout shift.
5. Redeploy (any commit triggers it).

> **Consent is already handled.** Google Consent Mode v2 defaults everything to
> "denied," and a cookie banner lets visitors accept — required for showing ads in
> many regions. Nothing to set up.

---

## Data refresh (hands-off, already automated)

- **Worktally (holidays):** a GitHub Action rolls the holiday data forward every
  January and can be run on demand (GitHub → **Actions → Refresh holiday data → Run
  workflow**). No secret needed.
- **Voltroam (adapters):** plug/voltage standards barely change; a quarterly Action
  re-checks the source with the committed data as a fallback.
- **Crisply (air fryer):** the food data is curated (no live feed); a CI Action just
  validates it builds on every change.

You don't need to touch any of these to launch.

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| Build fails on Node version | Pages project → Settings → Variables → `NODE_VERSION=22`, redeploy. |
| Build "output directory not found" | Confirm **Root directory** = `sites/<folder>` and **output** = `dist`. |
| Site loads but CSS/tool looks broken on the `.pages.dev` URL | Hard-refresh; if it persists, re-check the build log for errors. |
| `https://www.yourdomain.com` doesn't redirect | Make sure **Always Use HTTPS** is ON and the WWW→root Redirect Rule exists. |
| Certificate / "not secure" warning right after adding domain | Wait up to ~1 hour for the cert to issue. |
| Sitemap "couldn't fetch" in Search Console | Use the full URL `https://yourdomain.com/sitemap-index.xml`; wait for the cert first. |

---

## Quick per-site cheat sheet

For each site, the only things that differ are the **folder** and your **domain**:

| Site | Root directory | Build command | Output |
|---|---|---|---|
| Voltroam | `sites/adapters` | `npm run build` | `dist` |
| Worktally | `sites/bizdays` | `npm run build` | `dist` |
| Crisply | `sites/airfryer` | `npm run build` | `dist` |

That's it. Buy domain → connect Pages (root dir!) → add domain + redirect + HTTPS →
submit sitemap → (weeks later) apply to AdSense.
