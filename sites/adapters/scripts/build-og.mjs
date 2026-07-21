// Generates per-page-type Open Graph images (1200x630 PNG) into public/og/.
// Run locally with `npm run og` and commit the output — the Cloudflare build does
// not need satori/resvg. Brand text is read from src/config.ts so it stays
// single-sourced (rebrand = edit config, then re-run this).
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const cfg = readFileSync(join(root, "src", "config.ts"), "utf8");
const BRAND = (cfg.match(/SITE_NAME:\s*"([^"]+)"/) || [])[1] || "Voltroam";
const URL = ((cfg.match(/SITE_URL:\s*"([^"]+)"/) || [])[1] || "https://voltroam.com").replace(/^https?:\/\//, "");

const regular = readFileSync("/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf");
const bold = readFileSync("/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf");

// Brand mark: reuse the site favicon (rounded blue tile + white bolt) as a data URI.
const favicon = readFileSync(join(root, "public", "favicon.svg"));
const MARK = `data:image/svg+xml;base64,${favicon.toString("base64")}`;

const el = (type, style, children) => ({ type, props: { style, children } });
const img = (src, style) => ({ type: "img", props: { src, ...style } });
const text = (t) => t;

function card({ title, subtitle }) {
  return el(
    "div",
    {
      width: 1200,
      height: 630,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: 72,
      background: "linear-gradient(135deg, #0a1120 0%, #0d477f 60%, #0b6bcb 100%)",
      fontFamily: "Liberation Sans",
      color: "#ffffff",
    },
    [
      // header: mark + brand
      el("div", { display: "flex", alignItems: "center" }, [
        img(MARK, { width: 64, height: 64, style: { marginRight: 20, borderRadius: 16 } }),
        el("div", { display: "flex", fontSize: 34, fontWeight: 700 }, [text(BRAND)]),
      ]),
      // title block
      el("div", { display: "flex", flexDirection: "column" }, [
        el("div", { display: "flex", fontSize: 68, fontWeight: 700, lineHeight: 1.1, letterSpacing: -1 }, [text(title)]),
        el("div", { display: "flex", fontSize: 32, color: "#b6d8ff", marginTop: 20 }, [text(subtitle)]),
      ]),
      // footer
      el("div", { display: "flex", justifyContent: "space-between", alignItems: "center" }, [
        el("div", { display: "flex", fontSize: 26, color: "#86bcff" }, [text(URL)]),
        el("div", { display: "flex", fontSize: 24, color: "#86bcff" }, [text("Adapter · Voltage · Plug types")]),
      ]),
    ],
  );
}

const VARIANTS = [
  { file: "default", title: "Do I need a travel adapter?", subtitle: "Plug, voltage & converter checker for 218 countries" },
  { file: "country", title: "Plugs & voltage by country", subtitle: "Adapters, converters and plug types A–N" },
  { file: "route", title: "Country-to-country adapter guide", subtitle: "Exactly what to pack for your route" },
  { file: "guide", title: "Travel power guides", subtitle: "Adapters, converters & voltage, explained simply" },
  { file: "plug", title: "The 14 plug types, A to N", subtitle: "Where each is used and what fits" },
];

const outDir = join(root, "public", "og");
mkdirSync(outDir, { recursive: true });

for (const v of VARIANTS) {
  const svg = await satori(card(v), {
    width: 1200,
    height: 630,
    fonts: [
      { name: "Liberation Sans", data: regular, weight: 400, style: "normal" },
      { name: "Liberation Sans", data: bold, weight: 700, style: "normal" },
    ],
  });
  const png = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } }).render().asPng();
  writeFileSync(join(outDir, `${v.file}.png`), png);
  console.log(`og/${v.file}.png (${(png.length / 1024).toFixed(0)} KB)`);
}
