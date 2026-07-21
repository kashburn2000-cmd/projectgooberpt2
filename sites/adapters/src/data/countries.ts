import raw from "./countries.json";
import type { PlugId } from "./plugTypes";
export { voltageBand } from "../lib/util";

export interface Country {
  code: string; // ISO 3166-1 alpha-2
  name: string;
  slug: string;
  alpha3: string;
  region: string;
  subRegion: string;
  plugs: PlugId[];
  voltage: number; // volts
  frequency: number; // Hz
}

export const COUNTRIES: Country[] = raw as Country[];

export const COUNTRY_BY_SLUG: Map<string, Country> = new Map(
  COUNTRIES.map((c) => [c.slug, c]),
);
export const COUNTRY_BY_CODE: Map<string, Country> = new Map(
  COUNTRIES.map((c) => [c.code, c]),
);

export function getCountry(slug: string): Country | undefined {
  return COUNTRY_BY_SLUG.get(slug);
}

/** Regions in a stable, human display order. */
export const REGION_ORDER = ["Europe", "Asia", "Africa", "Americas", "Oceania"];

export function countriesByRegion(): { region: string; countries: Country[] }[] {
  const map = new Map<string, Country[]>();
  for (const c of COUNTRIES) {
    if (!map.has(c.region)) map.set(c.region, []);
    map.get(c.region)!.push(c);
  }
  return REGION_ORDER.filter((r) => map.has(r)).map((region) => ({
    region,
    countries: map.get(region)!.sort((a, b) => a.name.localeCompare(b.name)),
  }));
}

/** Most-searched destinations — used for popular route pages + internal links. */
export const POPULAR_DESTINATION_CODES = [
  "US", "GB", "FR", "IT", "ES", "DE", "JP", "TH", "AU", "IN",
  "MX", "CA", "GR", "PT", "NL", "TR", "AE", "CN", "ID", "VN",
  "BR", "ZA", "CH", "IE", "KR",
];

/** Most-common traveller home countries — the "from" side of route pages. */
export const POPULAR_ORIGIN_CODES = ["US", "GB", "CA", "AU", "DE", "FR", "IN"];

export const popularDestinations = (): Country[] =>
  POPULAR_DESTINATION_CODES.map((c) => COUNTRY_BY_CODE.get(c)!).filter(Boolean);
export const popularOrigins = (): Country[] =>
  POPULAR_ORIGIN_CODES.map((c) => COUNTRY_BY_CODE.get(c)!).filter(Boolean);
