// Validates the committed food dataset and emits a public copy for the client
// search island. The dataset is hand-curated (no upstream API), so this mainly
// guards data integrity. Run: `npm run data`.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = join(__dirname, "..", "src", "data");
const foods = JSON.parse(readFileSync(join(SRC, "foods.json"), "utf8"));

const errors = [];
const slugs = new Set();
for (const f of foods) {
  const where = f.slug || f.name || "(unknown)";
  if (!f.slug) errors.push(`${where}: missing slug`);
  if (slugs.has(f.slug)) errors.push(`${where}: duplicate slug`);
  slugs.add(f.slug);
  if (!f.name) errors.push(`${where}: missing name`);
  if (!f.category) errors.push(`${where}: missing category`);
  if (!f.fresh && !f.frozen) errors.push(`${where}: needs at least one of fresh/frozen`);
  for (const key of ["fresh", "frozen"]) {
    const s = f[key];
    if (!s) continue;
    if (typeof s.tempF !== "number" || s.tempF < 150 || s.tempF > 450)
      errors.push(`${where}.${key}: tempF out of range (${s.tempF})`);
    if (!Array.isArray(s.min) || s.min.length !== 2 || s.min[0] > s.min[1])
      errors.push(`${where}.${key}: bad time range`);
  }
  if (f.doneness && (f.doneness.tempF < 140 || f.doneness.tempF > 175))
    errors.push(`${where}: doneness temp looks wrong (${f.doneness.tempF})`);
}

if (errors.length) {
  console.error("Data validation FAILED:\n" + errors.map((e) => "  - " + e).join("\n"));
  process.exit(1);
}

const PUB = join(__dirname, "..", "public", "data");
mkdirSync(PUB, { recursive: true });
// Slim list for the client-side search island.
const slim = foods.map((f) => ({
  slug: f.slug,
  name: f.name,
  aliases: f.aliases || [],
  category: f.category,
  emoji: f.emoji,
}));
writeFileSync(join(PUB, "foods.json"), JSON.stringify(slim));

const byCat = {};
for (const f of foods) byCat[f.category] = (byCat[f.category] || 0) + 1;
console.log(`foods: ${foods.length}  (all valid)`);
console.log(`with doneness temp: ${foods.filter((f) => f.doneness).length}`);
console.log(`by category:`, byCat);
