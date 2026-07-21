// Generates the committed holiday dataset from the `date-holidays` library
// (open, MIT, 200+ countries, computed offline). The site builds entirely from
// these committed JSON files — no live API at request time. Re-run: `npm run data`.
import Holidays from "date-holidays";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = join(__dirname, "..", "src", "data");
const PUB = join(__dirname, "..", "public", "data", "holidays");
mkdirSync(PUB, { recursive: true });
mkdirSync(join(SRC, "holidays"), { recursive: true });

const slugify = (s) =>
  s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

// Friendly English names (date-holidays returns some names localized).
const NAME_OVERRIDES = {
  US: "United States", GB: "United Kingdom", TW: "Taiwan", KR: "South Korea",
  KP: "North Korea", RU: "Russia", IR: "Iran", SY: "Syria", VE: "Venezuela",
  BO: "Bolivia", TZ: "Tanzania", MD: "Moldova", LA: "Laos", BN: "Brunei",
  VN: "Vietnam", CD: "DR Congo", CG: "Congo (Republic)", CI: "Ivory Coast",
  FM: "Micronesia", MK: "North Macedonia", PS: "Palestine", CV: "Cape Verde",
  SZ: "Eswatini", MM: "Myanmar", AE: "United Arab Emirates", XK: "Kosovo",
};

// Regions for territories ISO leaves blank, so grouping works.
const REGION_FIXUPS = {
  TW: { region: "Asia", subRegion: "Eastern Asia" },
  XK: { region: "Europe", subRegion: "Southern Europe" },
};

// Non-sovereign codes to skip (subdivisions that overlap a parent country).
const EXCLUDE = new Set(["IC"]); // Canary Islands (part of Spain)

// Typical weekend (0=Sun … 6=Sat). Default [6,0] = Sat+Sun. Overrides cover the
// best-established non-Sat/Sun cases; the site discloses that weekends vary and the
// calculator lets the user change them.
const WEEKEND = {
  SA: [5, 6], KW: [5, 6], QA: [5, 6], OM: [5, 6], BH: [5, 6], EG: [5, 6],
  JO: [5, 6], IQ: [5, 6], SY: [5, 6], LY: [5, 6], SD: [5, 6], YE: [5, 6],
  PS: [5, 6], IL: [5, 6], AF: [5, 6], DZ: [5, 6], BD: [5, 6], MV: [5, 6],
  IR: [5], // Friday only
  NP: [6], // Saturday only
};

const iso = JSON.parse(readFileSync(join(SRC, "sources", "iso-3166.json"), "utf8"));
const isoByCode = new Map(iso.map((c) => [c["alpha-2"], c]));

const now = new Date();
const CUR = now.getFullYear();
const YEARS = [];
for (let y = CUR - 2; y <= CUR + 4; y++) YEARS.push(y);

const supported = new Holidays().getCountries();
const codes = Object.keys(supported).filter((c) => /^[A-Z]{2}$/.test(c));

const countries = [];
const holidaysAll = {};
let totalHolidays = 0;

for (const code of codes) {
  if (EXCLUDE.has(code)) continue;
  const meta = isoByCode.get(code);
  const name = NAME_OVERRIDES[code] || meta?.name || supported[code];
  const region = REGION_FIXUPS[code]?.region || meta?.region || "Other";
  const subRegion = REGION_FIXUPS[code]?.subRegion || meta?.["sub-region"] || "";
  const weekend = WEEKEND[code] || [6, 0];

  let hd;
  try {
    hd = new Holidays(code);
  } catch {
    continue;
  }

  const byYear = {};
  for (const y of YEARS) {
    const seen = new Set();
    const list = [];
    for (const h of hd.getHolidays(y)) {
      if (h.type !== "public") continue;
      const date = h.date.slice(0, 10);
      const key = date + "|" + h.name;
      if (seen.has(key)) continue;
      seen.add(key);
      list.push({ date, name: h.name });
    }
    list.sort((a, b) => a.date.localeCompare(b.date));
    byYear[y] = list;
    totalHolidays += list.length;
  }

  holidaysAll[code] = byYear;
  writeFileSync(join(PUB, `${code}.json`), JSON.stringify({ code, name, weekend, years: byYear }));
  countries.push({
    code, name, slug: slugify(name), region, subRegion, weekend,
    holidayCount: byYear[CUR]?.length || 0,
  });
}

countries.sort((a, b) => a.name.localeCompare(b.name));
writeFileSync(join(SRC, "countries.json"), JSON.stringify(countries, null, 0) + "\n");
writeFileSync(join(SRC, "holidays.json"), JSON.stringify(holidaysAll));
writeFileSync(
  join(SRC, "meta.json"),
  JSON.stringify({ currentYear: CUR, years: YEARS, generated: now.toISOString().slice(0, 10) }, null, 2) + "\n",
);

const regions = {};
for (const c of countries) regions[c.region] = (regions[c.region] || 0) + 1;
console.log(`countries: ${countries.length}`);
console.log(`years: ${YEARS[0]}–${YEARS[YEARS.length - 1]}`);
console.log(`total public holidays generated: ${totalHolidays}`);
console.log(`by region:`, regions);
