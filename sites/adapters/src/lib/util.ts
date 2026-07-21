/** Pure helpers with no data imports, so islands that use them stay tiny. */

/** ISO alpha-2 -> flag emoji (regional indicator letters). */
export const flag = (code: string): string =>
  /^[A-Za-z]{2}$/.test(code)
    ? code
        .toUpperCase()
        .replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)))
    : "";

/** Voltage band used across converter logic. */
export const voltageBand = (v: number): "low" | "high" => (v < 150 ? "low" : "high");

export const titleCase = (s: string): string =>
  s.replace(/\b\w/g, (m) => m.toUpperCase());
