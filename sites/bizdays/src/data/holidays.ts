import raw from "./holidays.json";

export interface Holiday {
  date: string; // YYYY-MM-DD
  name: string;
}

type All = Record<string, Record<string, Holiday[]>>;
export const HOLIDAYS = raw as All;

export const getHolidays = (code: string, year: number): Holiday[] =>
  HOLIDAYS[code]?.[String(year)] ?? [];

/** Set of holiday dates for a country across the given years (for business-day math). */
export function holidaySet(code: string, years: number[]): Set<string> {
  const s = new Set<string>();
  for (const y of years) for (const h of getHolidays(code, y)) s.add(h.date);
  return s;
}
