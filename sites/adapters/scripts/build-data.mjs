// Transforms the committed IEC plug/voltage snapshot + ISO-3166 region snapshot
// into the structured dataset the site imports. Deterministic, no network access:
// the build never depends on a live API. Re-run with `npm run data`.
//
// Sources (committed under src/data/sources/):
//   - world-plugs.iec.csv : plug type, voltage, frequency per country (IEC World Plugs)
//   - iso-3166.json       : ISO 3166-1 names, codes, region / sub-region
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = join(__dirname, "..", "src", "data");

/** Minimal RFC-4180-ish CSV parser (handles quoted fields with commas). */
function parseCsv(text) {
  const rows = [];
  let row = [], field = "", inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else if (c === "\r") { /* skip */ }
    else field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows;
}

const slugify = (s) =>
  s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

// --- Load ISO region metadata, keyed by alpha-2 ---
const iso = JSON.parse(readFileSync(join(SRC, "sources", "iso-3166.json"), "utf8"));
const isoByCode = new Map();
for (const c of iso) isoByCode.set(c["alpha-2"], c);

// --- Parse the IEC plug/voltage CSV ---
const csv = parseCsv(readFileSync(join(SRC, "sources", "world-plugs.iec.csv"), "utf8"));
const header = csv[0];
const col = (name) => header.indexOf(name);
const iCode = col("country_code"), iFreq = col("frequency"),
  iName = col("name"), iPlug = col("plug_type"), iVolt = col("voltage");

const byCountry = new Map();
for (let r = 1; r < csv.length; r++) {
  const row = csv[r];
  if (!row || row.length < header.length) continue;
  const code = row[iCode].trim();
  if (!code) continue;
  const plug = row[iPlug].replace(/^Type\s+/i, "").trim(); // "Type C" -> "C"
  const voltage = parseInt(row[iVolt], 10);
  const frequency = parseInt(row[iFreq], 10);
  if (!byCountry.has(code)) {
    byCountry.set(code, {
      code,
      name: row[iName].trim(),
      plugs: new Set(),
      voltage,
      frequency,
    });
  }
  byCountry.get(code).plugs.add(plug);
}

// ISO codes in the IEC set that differ from ISO-3166 alpha-2, mapped by hand.
const CODE_FIXUPS = { UK: "GB" };

// Friendlier display names than the verbose official ISO-3166 forms. These drive
// page titles, H1s and URL slugs, so travellers search the names people use.
const NAME_OVERRIDES = {
  US: "United States", GB: "United Kingdom", TW: "Taiwan", KR: "South Korea",
  KP: "North Korea", RU: "Russia", IR: "Iran", SY: "Syria", VE: "Venezuela",
  BO: "Bolivia", TZ: "Tanzania", MD: "Moldova", LA: "Laos", BN: "Brunei",
  VN: "Vietnam", CD: "DR Congo", CG: "Congo (Republic)", CI: "Ivory Coast",
  FM: "Micronesia", MK: "North Macedonia", PS: "Palestine", CV: "Cape Verde",
  SZ: "Eswatini", MM: "Myanmar", RE: "Réunion", XK: "Kosovo",
};

// Territories ISO leaves without a region get one so grouping/linking works.
const REGION_FIXUPS = {
  TW: { region: "Asia", subRegion: "Eastern Asia" },
};

const countries = [];
const unmatched = [];
for (const rec of byCountry.values()) {
  const isoCode = CODE_FIXUPS[rec.code] || rec.code;
  const meta = isoByCode.get(isoCode);
  if (!meta) unmatched.push(`${rec.code} ${rec.name}`);
  const name = NAME_OVERRIDES[isoCode] || meta?.name || rec.name;
  const region = REGION_FIXUPS[isoCode]?.region || meta?.region || "Other";
  const subRegion = REGION_FIXUPS[isoCode]?.subRegion || meta?.["sub-region"] || "";
  countries.push({
    code: isoCode,
    name,
    slug: slugify(name),
    alpha3: meta?.["alpha-3"] || "",
    region,
    subRegion,
    plugs: [...rec.plugs].sort(),
    voltage: rec.voltage,
    frequency: rec.frequency,
  });
}
countries.sort((a, b) => a.name.localeCompare(b.name));

writeFileSync(join(SRC, "countries.json"), JSON.stringify(countries, null, 2) + "\n");

// Slim, single cached file the browser downloads once for the route-finder island
// (keeps every one of the ~1,700 pages lean instead of inlining the country list).
const PUB = join(__dirname, "..", "public", "data");
mkdirSync(PUB, { recursive: true });
const slim = countries.map(({ code, name, slug, region, plugs, voltage, frequency }) => ({
  code, name, slug, region, plugs, voltage, frequency,
}));
writeFileSync(join(PUB, "countries.slim.json"), JSON.stringify(slim));

// --- Report ---
const regions = {};
for (const c of countries) regions[c.region] = (regions[c.region] || 0) + 1;
console.log(`countries: ${countries.length}`);
console.log(`by region:`, regions);
console.log(`voltages:`, [...new Set(countries.map((c) => c.voltage))].sort((a, b) => a - b).join(", "));
console.log(`plug types:`, [...new Set(countries.flatMap((c) => c.plugs))].sort().join(", "));
if (unmatched.length) console.log(`unmatched ISO (kept, region=Other):`, unmatched.join("; "));
