/**
 * ─────────────────────────────────────────────────────────────────────────
 *  SITE BRANDING — the ONE place to change the name / domain / ad account.
 *  Swap these four values and regenerate OG images (npm run og) to rebrand.
 * ─────────────────────────────────────────────────────────────────────────
 */
export const SITE = {
  /** Brand name shown in the UI, titles and JSON-LD. */
  SITE_NAME: "Worktally",
  /** Canonical origin, no trailing slash. Used for canonicals, sitemap, OG. */
  SITE_URL: "https://worktally.com",
  /** Public contact address (trust pages, JSON-LD, ads.txt owner). */
  CONTACT_EMAIL: "hello@worktally.com",
  /**
   * Google AdSense publisher id, e.g. "ca-pub-1234567890123456".
   * Leave EMPTY until approved — every ad slot renders nothing while blank,
   * so there is zero layout shift and no empty boxes.
   */
  ADSENSE_PUB_ID: "",
} as const;

/** One-line tagline reused across meta + hero. */
export const SITE_TAGLINE =
  "Count business days, working days and public holidays in any country — instantly and accurately.";

/** Brand color (kept in sync with the CSS theme in styles/global.css). */
export const THEME_COLOR = "#4f46e5";

export const hasAdsense = () => SITE.ADSENSE_PUB_ID.trim().length > 0;

/** Absolute URL helper for canonicals / OG / sitemap. */
export const abs = (path = "/") =>
  new URL(path, SITE.SITE_URL).href.replace(/\/$/, path === "/" ? "/" : "");
