/** Pure business-day math. No data imports, so the calculator island stays tiny. */

export type Weekend = number[]; // day numbers, 0=Sun … 6=Sat

export function toDate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}
export function toISO(d: Date): string {
  return d.toISOString().slice(0, 10);
}
export function dow(s: string): number {
  return toDate(s).getUTCDay();
}
export function addDays(s: string, n: number): string {
  const d = toDate(s);
  d.setUTCDate(d.getUTCDate() + n);
  return toISO(d);
}
export function calendarDaysBetween(a: string, b: string): number {
  return Math.round((toDate(b).getTime() - toDate(a).getTime()) / 86400000);
}

export const isWeekend = (s: string, weekend: Weekend): boolean =>
  weekend.includes(dow(s));

export const isBusinessDay = (s: string, weekend: Weekend, holidays: Set<string>): boolean =>
  !isWeekend(s, weekend) && !holidays.has(s);

export interface BetweenResult {
  businessDays: number;
  calendarDays: number;
  weekendDays: number;
  holidayDays: number;
  holidaysInRange: string[]; // ISO dates that were public holidays (on a weekday)
  start: string;
  end: string;
  inclusive: boolean;
}

/**
 * Business days in [start, end]. Both endpoints inclusive. Swaps if reversed.
 * Guards against absurd ranges.
 */
export function businessDaysBetween(
  startIn: string,
  endIn: string,
  weekend: Weekend,
  holidays: Set<string>,
): BetweenResult {
  let start = startIn, end = endIn;
  if (toDate(start) > toDate(end)) [start, end] = [end, start];
  const total = calendarDaysBetween(start, end);
  let businessDays = 0, weekendDays = 0, holidayDays = 0;
  const holidaysInRange: string[] = [];
  const cap = Math.min(total, 366 * 60); // ~60 years safety cap
  let cur = start;
  for (let i = 0; i <= cap; i++) {
    const w = isWeekend(cur, weekend);
    const h = holidays.has(cur);
    if (w) weekendDays++;
    else if (h) { holidayDays++; holidaysInRange.push(cur); }
    else businessDays++;
    cur = addDays(cur, 1);
  }
  return {
    businessDays,
    calendarDays: total + 1,
    weekendDays,
    holidayDays,
    holidaysInRange,
    start,
    end,
    inclusive: true,
  };
}

/** Add (or subtract, if n<0) n business days to a start date. Start not counted. */
export function addBusinessDays(
  start: string,
  n: number,
  weekend: Weekend,
  holidays: Set<string>,
): string {
  if (n === 0) return start;
  const step = n > 0 ? 1 : -1;
  let remaining = Math.abs(n);
  let cur = start;
  let guard = 0;
  while (remaining > 0 && guard < 100000) {
    cur = addDays(cur, step);
    if (isBusinessDay(cur, weekend, holidays)) remaining--;
    guard++;
  }
  return cur;
}

/** Count business days across a whole year (inclusive of both ends). */
export function businessDaysInYear(year: number, weekend: Weekend, holidays: Set<string>): BetweenResult {
  return businessDaysBetween(`${year}-01-01`, `${year}-12-31`, weekend, holidays);
}
