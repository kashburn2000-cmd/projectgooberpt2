import { SITE } from "../config";

export const abs = (path: string): string =>
  new URL(path, SITE.SITE_URL).href.replace(/(.)\/$/, "$1");

export interface Crumb {
  name: string;
  path?: string;
}

/** BreadcrumbList JSON-LD from an ordered list of crumbs. */
export function breadcrumbLd(items: Crumb[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      ...(it.path ? { item: abs(it.path) } : {}),
    })),
  };
}

/** FAQPage JSON-LD. */
export function faqLd(faqs: { q: string; a: string }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
