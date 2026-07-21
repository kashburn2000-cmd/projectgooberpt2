/** Small pure helpers (no data imports). */

export const flag = (code: string): string =>
  /^[A-Za-z]{2}$/.test(code)
    ? code.toUpperCase().replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)))
    : "";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const dayName = (n: number): string => DAY_NAMES[n] ?? "";

/** Human weekend label from day numbers, e.g. [6,0] -> "Saturday & Sunday". */
export function weekendLabel(weekend: number[]): string {
  const names = weekend.slice().sort((a, b) => a - b).map((n) => DAY_NAMES[n]);
  // Present in natural order (Fri before Sat before Sun)
  const ordered = [5, 6, 0].filter((d) => weekend.includes(d)).map((n) => DAY_NAMES[n]);
  const list = ordered.length ? ordered : names;
  return list.length === 1 ? list[0] : list.slice(0, -1).join(", ") + " & " + list.slice(-1);
}

/** Format an ISO date (UTC) as e.g. "Mon, Jan 1, 2026". */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    weekday: "short", year: "numeric", month: "short", day: "numeric", timeZone: "UTC",
  });
}

/** Format an ISO date (UTC) as e.g. "1 January 2026". */
export function formatDateLong(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-GB", {
    year: "numeric", month: "long", day: "numeric", timeZone: "UTC",
  });
}
