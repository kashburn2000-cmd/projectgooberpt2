import raw from "./foods.json";

export interface CookSetting {
  tempF: number;
  tempC: number;
  min: [number, number];
  shake: boolean;
  note?: string;
}
export interface Doneness {
  tempF: number;
  tempC: number;
  label: string;
}
export interface Food {
  slug: string;
  name: string;
  aliases?: string[];
  category: string;
  emoji: string;
  fresh?: CookSetting;
  frozen?: CookSetting;
  doneness?: Doneness;
  tips?: string[];
  summary?: string;
}

export const FOODS: Food[] = raw as Food[];
export const FOOD_BY_SLUG = new Map(FOODS.map((f) => [f.slug, f]));
export const getFood = (slug: string): Food | undefined => FOOD_BY_SLUG.get(slug);

export const CATEGORY_ORDER = [
  "Frozen Favorites",
  "Chicken",
  "Beef",
  "Pork",
  "Fish & Seafood",
  "Vegetables",
  "Snacks & More",
];

export const CATEGORY_SLUG: Record<string, string> = {
  "Frozen Favorites": "frozen",
  Chicken: "chicken",
  Beef: "beef",
  Pork: "pork",
  "Fish & Seafood": "fish-seafood",
  Vegetables: "vegetables",
  "Snacks & More": "snacks",
};
export const SLUG_TO_CATEGORY: Record<string, string> = Object.fromEntries(
  Object.entries(CATEGORY_SLUG).map(([k, v]) => [v, k]),
);

export function foodsByCategory(): { category: string; slug: string; foods: Food[] }[] {
  const map = new Map<string, Food[]>();
  for (const f of FOODS) {
    if (!map.has(f.category)) map.set(f.category, []);
    map.get(f.category)!.push(f);
  }
  return CATEGORY_ORDER.filter((c) => map.has(c)).map((category) => ({
    category,
    slug: CATEGORY_SLUG[category],
    foods: map.get(category)!.sort((a, b) => a.name.localeCompare(b.name)),
  }));
}

/** The primary cook setting to show first (fresh if present, else frozen). */
export const primarySetting = (f: Food): CookSetting => (f.fresh ?? f.frozen)!;

export const fmtTime = (min: [number, number]): string =>
  min[0] === min[1] ? `${min[0]} min` : `${min[0]}–${min[1]} min`;

/**
 * USDA safe minimum internal temperatures (FSIS / FoodSafety.gov). These are the
 * authoritative doneness targets; air-fryer times on this site are guidance to
 * reach them. Verify with a food thermometer.
 */
export const USDA_TEMPS = [
  { food: "Poultry — chicken & turkey (whole, parts, ground, stuffing)", tempF: 165, tempC: 74, note: "No rest time required." },
  { food: "Ground meats — beef, pork, lamb, veal", tempF: 160, tempC: 71 },
  { food: "Fresh beef, pork, veal & lamb — steaks, chops, roasts", tempF: 145, tempC: 63, note: "Plus a 3-minute rest." },
  { food: "Ham, fresh or smoked (uncooked)", tempF: 145, tempC: 63, note: "Plus a 3-minute rest." },
  { food: "Fully cooked ham (to reheat)", tempF: 165, tempC: 74, note: "140°F if USDA-inspected and repackaged." },
  { food: "Fish & shellfish", tempF: 145, tempC: 63, note: "Or until the flesh is opaque and flakes." },
  { food: "Egg dishes", tempF: 160, tempC: 71 },
  { food: "Leftovers & casseroles", tempF: 165, tempC: 74 },
];

/** Popular foods for the homepage / internal linking. */
export const POPULAR_SLUGS = [
  "frozen-french-fries", "chicken-breast", "chicken-wings", "salmon", "bacon",
  "frozen-chicken-nuggets", "steak", "brussels-sprouts", "shrimp", "chicken-thighs-boneless",
  "baked-potato", "broccoli",
];
export const popularFoods = (): Food[] =>
  POPULAR_SLUGS.map((s) => FOOD_BY_SLUG.get(s)!).filter(Boolean);
