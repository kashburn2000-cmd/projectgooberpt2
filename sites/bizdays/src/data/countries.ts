import rawCountries from "./countries.json";
import meta from "./meta.json";

export interface Country {
  code: string;
  name: string;
  slug: string;
  region: string;
  subRegion: string;
  weekend: number[];
  holidayCount: number;
}

export const COUNTRIES: Country[] = rawCountries as Country[];
export const COUNTRY_BY_CODE = new Map(COUNTRIES.map((c) => [c.code, c]));
export const COUNTRY_BY_SLUG = new Map(COUNTRIES.map((c) => [c.slug, c]));

export const CURRENT_YEAR: number = meta.currentYear;
export const YEARS: number[] = meta.years;
export const GENERATED: string = meta.generated;

export const getCountry = (slug: string): Country | undefined => COUNTRY_BY_SLUG.get(slug);

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

/** Most-searched countries — used on the homepage and for internal linking. */
export const POPULAR_CODES = [
  "US", "GB", "CA", "AU", "DE", "IN", "FR", "JP", "BR", "ZA",
  "AE", "SG", "NL", "IE", "NZ", "ES", "IT", "MX", "PH", "SE",
];
export const popularCountries = (): Country[] =>
  POPULAR_CODES.map((c) => COUNTRY_BY_CODE.get(c)!).filter(Boolean);
