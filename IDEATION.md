# Portfolio ideation — the gauntlet

> How the three sites were chosen. Recorded so the reasoning is auditable and so
> a fourth site (if commissioned) starts from the bench, not from scratch.

## Method

~40 candidates were generated across travel, food, home services, pets,
gardening, dev-tools, finance-adjacent data, and B2B reference. Each was scored
on seven axes:

1. **Search demand** — is there real, high-intent long-tail volume?
2. **Incumbent weakness** — are the top results wrong, stale, generic, ugly, or paywalled?
3. **Ad RPM** — advertiser competition for the topic.
4. **Buildability** — can a static Astro site actually deliver it?
5. **Hands-off durability** — does it earn traffic without me writing on a schedule?
6. **Design potential** — room for a distinct, non-bland identity.
7. **Data integrity** — can I ground every fact in a real, citable public source *without fabricating*? (Hard gate — anything that would require inventing data was cut.)

Constraints applied as filters: no overlap with Billowatt (home electricity),
avoid YMYL unless the E-E-A-T bar is clearly meetable, no user logins, no ongoing labor.

## Longlist (condensed)

| # | Idea | Niche | Incumbent weakness | RPM | Data integrity | Verdict |
|---|------|-------|--------------------|-----|----------------|---------|
| 1 | **Travel adapter / voltage by country** | Travel | Dated info-dumps + affiliate listicles | Med-High | ★★★ IEC/ISO open | **PICK** |
| 2 | **Air-fryer / multicooker cook times** | Food | Recipe-blog bloat (worst UX on web) | Med | ★★ USDA + sourced ranges | **PICK** |
| 3 | **Intl business-days / holidays** | Ops/HR | Clunky, thin per-country tooling | Med | ★★★ Nager.Date open | **PICK** |
| 4 | US LLC formation cost by state | Legal/biz | LegalZoom/ZenBusiness lead-gen | **High** | ★★ needs 50-state sourcing | Deferred (YMYL + sourcing risk) |
| 5 | Airline baggage-fee database | Travel | Buried on airline sites | High | ★★ changes often | Bench (maintenance) |
| 6 | SeatGuru successor (seat pitch) | Travel | SeatGuru abandoned by TripAdvisor | High | ★ hard to source seat maps | Bench (data) |
| 7 | Home-project cost ("cost to install X") | Home | HomeAdvisor/Angi vague lead-gen | **High** | ★ can't ground w/o fabricating | Cut (data integrity) |
| 8 | Can dogs/cats eat X | Pets | Content farms, mixed accuracy | Med-High | ★★ ASPCA but YMYL | Cut (YMYL, competitive) |
| 9 | Pet plant toxicity (ASPCA) | Pets | Generic listicles | Med | ★★★ ASPCA open | Bench (YMYL-adjacent) |
| 10 | Planting calendar by USDA zone | Garden | Almanac paywall-ish, imprecise | Med | ★★ derived from frost data | Bench (fuzzy grounding) |
| 11 | Sales-tax rate by ZIP | Finance | Avalara/TaxJar strong | High | ★ changes, YMYL | Cut |
| 12 | Public holidays only | Reference | timeanddate strong | Med | ★★★ | Folded into #3 |
| 13 | Time-zone meeting planner | Reference | worldtimebuddy strong | Med | ★★★ | Cut (incumbents) |
| 14 | Bank routing-number directory | Finance | Spammy | High | ★★★ Fed public | Bench (dry) |
| 15 | HS/tariff code lookup | Trade | Ugly gov sites | Med-High | ★★★ public | Bench (dry, maintenance) |
| 16 | Brand size-chart / conversions | Shopping | Generic | Med-High | ★★ per-brand sourcing | Bench |
| 17 | Retailer return-policy lookup | Shopping | Buried / content farms | Med-High | ★ changes | Cut (maintenance) |
| 18 | Airport layover guides | Travel | sleepinginairports dated | Med | ★★ heavy sourcing | Bench |
| 19 | Tipping / etiquette by country | Travel | Generic blogs | Low-Med | ★★ | Cut (low RPM) |
| 20 | Visa requirements by passport | Travel | Paywalled/lead-gen | High | ★ YMYL, hard | Cut (accuracy risk) |
| 21 | Unit converters | Reference | Saturated | Low | ★★★ | Cut |
| 22 | Regex/cron explainers | Dev | Saturated | Low | ★★★ | Cut (RPM) |
| 23 | Produce seasonality by month | Food | Generic | Low-Med | ★★ | Bench |
| 24 | Cooking substitutions | Food | allrecipes etc. strong | Med | ★★ | Cut (incumbents) |
| 25 | Grill/smoke meat temps | Food | Blogs | Med | ★★ USDA + consensus | Bench (overlaps #2) |
| 26 | Frost dates by ZIP | Garden | Almanac | Med | ★★ NOAA | Bench |
| 27 | Climate averages by city-month | Travel | WeatherSpark good | Med | ★★★ NOAA | Cut (incumbent) |
| 28 | College net-price / stats | Edu | Niche/CollegeSimply | Med | ★★★ IPEDS but YMYL | Bench |
| 29 | Baby-name popularity | Reference | nameberry/SSA | Low-Med | ★★★ | Cut (saturated) |
| 30 | Cost of living by city | Reference | Numbeo strong | Med | ★★ | Cut (incumbent) |
| … | (dev-tool, currency, stadium-seat, license-by-state, IBAN, SWIFT, dial-code, mattress-size, font-pairing, emoji-meaning candidates) | — | — | — | — | Cut (RPM / saturation / data) |

## Why the three winners

They span the RPM curve, occupy **distinct** audiences and design languages, and — critically —
each passes the data-integrity gate with a real public source I can commit as a snapshot.

### 1. Travel adapter & electrical guide *(built first)*
- **Gap:** worldstandards/IEC are accurate but dated info-dumps; the rest of page one is "best travel adapter" affiliate listicles. Nobody cleanly answers *"for my specific route, what do I actually need?"*
- **Moat:** completeness + genuine tool UX. Plug standards barely change → maximally hands-off.
- **Data:** IEC World Plugs (plug type, voltage, frequency, 218 countries) + ISO-3166 regions. Both committed byte-exact.
- **Pre-mortem (6 months on, it failed because…):** *"No freshness moat, so a competitor cloned the data."* → Defence: win on the country×country route mesh + UX + internal-link depth, which a static clone won't match; data being evergreen is a feature (zero maintenance), and the brand + guides compound.

### 2. Air-fryer & multicooker cook-time database
- **Gap:** the most-hated UX on the web — one number buried under 2,000 words and six ad units. A data-first tool with a built-in timer is a real 10×.
- **Moat:** UX + breadth (food × appliance × from-frozen state). Safety temps grounded in USDA; cook times presented as **sourced ranges to verify with a thermometer**, never invented as gospel.
- **Pre-mortem:** *"Cook times weren't authoritative and users didn't trust them."* → Defence: explicit ranges + per-food sourcing + a methodology page + doneness temps from USDA; frame as starting points, which is honest and still far better than the incumbents.

### 3. International business-days & public-holidays calculator
- **Gap:** timeanddate owns head terms but per-country business-day/working-day tooling is thin and clunky.
- **Moat:** genuine fresh-data + automation — annual GitHub Action refreshes holidays from the open **Nager.Date** dataset with a committed fallback. Non-YMYL.
- **Pre-mortem:** *"timeanddate outranked everything."* → Defence: target the long-tail calculators and per-country-per-year pages they under-serve, plus cross-country scheduling overlap they don't offer at all.

## Deferred / future bench (best first)

- **US LLC formation cost & requirements by state** — the highest-RPM idea found (legal/formation CPCs are enormous; LegalZoom/ZenBusiness are exactly the paywalled lead-gen gap). Benched only because it's YMYL and demands flawless 50-state fee sourcing where a wrong number is a real liability. If a fourth, higher-RPM swing is wanted, this is first off the bench — it needs a careful sourcing pass + trust-page investment, not a new concept.
- **Pet plant toxicity (ASPCA)**, **airline baggage fees**, **planting calendar by USDA zone**, **HS/tariff codes**, **bank routing directory** — all viable, each with one caveat noted above.

## Domain shortlists

See the root `README.md` and the per-site `README.md` for the ranked coined-name
candidates (I can't check availability from this environment — check them in
Cloudflare's registrar search).
