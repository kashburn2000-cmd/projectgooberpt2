import { useMemo, useState } from "preact/hooks";
import { adapterAdvice, plugList, bandLabel } from "../../lib/adapter";
import { PLUG_TYPES } from "../../data/plugTypes";
import type { Country } from "../../data/countries";
import { flag } from "../../lib/util";

interface Props {
  countries: Country[];
  initialFrom?: string;
  initialTo?: string;
}

const REGION_ORDER = ["Europe", "Asia", "Africa", "Americas", "Oceania"];

export default function RouteFinder({
  countries,
  initialFrom = "US",
  initialTo = "",
}: Props) {
  const byCode = useMemo(
    () => new Map(countries.map((c) => [c.code, c])),
    [countries],
  );
  const grouped = useMemo(() => {
    const m = new Map<string, Country[]>();
    for (const c of countries) {
      if (!m.has(c.region)) m.set(c.region, []);
      m.get(c.region)!.push(c);
    }
    for (const list of m.values()) list.sort((a, b) => a.name.localeCompare(b.name));
    return REGION_ORDER.filter((r) => m.has(r)).map((r) => ({ region: r, list: m.get(r)! }));
  }, [countries]);

  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);

  const home = byCode.get(from);
  const dest = byCode.get(to);
  const advice = home && dest ? adapterAdvice(home, dest) : null;

  const tone = !advice
    ? "neutral"
    : advice.adapterNeeded || advice.converterNeeded
      ? advice.adapterNeeded && advice.converterNeeded
        ? "warn"
        : "info"
      : "good";

  const toneRing = {
    neutral: "border-border",
    good: "border-good/40",
    info: "border-brand-400/50",
    warn: "border-volt-500/50",
  }[tone];

  const Select = ({
    label,
    value,
    onChange,
    placeholder,
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
  }) => (
    <label class="flex-1">
      <span class="mb-1.5 block text-sm font-medium text-muted">{label}</span>
      <select
        class="w-full rounded-xl border border-border bg-surface px-3 py-3 text-base font-medium shadow-sm focus:border-brand-500"
        value={value}
        onChange={(e) => onChange((e.target as HTMLSelectElement).value)}
      >
        <option value="">{placeholder}</option>
        {grouped.map((g) => (
          <optgroup label={g.region}>
            {g.list.map((c) => (
              <option value={c.code}>
                {flag(c.code)} {c.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </label>
  );

  return (
    <div class={`rounded-3xl border-2 bg-surface p-5 shadow-lg sm:p-6 ${toneRing}`}>
      <div class="flex flex-col gap-4 sm:flex-row sm:items-end">
        <Select label="I'm travelling from" value={from} onChange={setFrom} placeholder="Choose home country" />
        <div class="hidden pb-3 text-muted sm:block" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </div>
        <Select label="going to" value={to} onChange={setTo} placeholder="Choose destination" />
      </div>

      {!dest && (
        <p class="mt-5 text-center text-sm text-muted">
          Pick your destination to see whether you need an adapter, a voltage
          converter, or nothing at all.
        </p>
      )}

      {home && dest && advice && (
        <div class="mt-5">
          <div
            class={`flex items-start gap-3 rounded-2xl p-4 ${
              tone === "good"
                ? "bg-good/10"
                : tone === "warn"
                  ? "bg-volt-500/10"
                  : "bg-brand-500/10"
            }`}
          >
            <span class="mt-0.5 shrink-0" aria-hidden="true">
              {tone === "good" ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="text-good" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" class={tone === "warn" ? "text-volt-600" : "text-brand-600"} stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/></svg>
              )}
            </span>
            <p class="text-[15px] font-semibold leading-snug">
              {flag(home.code)} {home.name} → {flag(dest.code)} {dest.name}: {advice.headline}
            </p>
          </div>

          <dl class="mt-4 grid gap-3 sm:grid-cols-3">
            <Fact
              title="Plug adapter"
              ok={!advice.adapterNeeded}
              value={
                advice.adapterNeeded
                  ? `Needed — ${dest.name} uses ${plugList(dest.plugs)} sockets`
                  : `Not needed — your ${plugList(advice.compatiblePlugs)} plug fits`
              }
            />
            <Fact
              title="Voltage"
              ok={!advice.converterNeeded}
              value={
                advice.converterNeeded
                  ? `${dest.name} is ${dest.voltage} V (${bandLabel(advice.destBand)}). Single-voltage devices need a converter.`
                  : `${dest.voltage} V — matches your ${bandLabel(advice.homeBand)}. No converter needed.`
              }
            />
            <Fact
              title="Frequency"
              ok={advice.sameFrequency}
              value={
                advice.sameFrequency
                  ? `${dest.frequency} Hz — same as home.`
                  : `${dest.frequency} Hz vs your ${home.frequency} Hz. Fine for electronics.`
              }
            />
          </dl>

          <div class="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <span class="text-muted">Destination sockets:</span>
            {dest.plugs.map((p) => (
              <span class="chip" title={PLUG_TYPES[p].standard}>
                Type {p}
              </span>
            ))}
            <a
              class="prose-link ml-auto font-medium"
              href={`/adapter/${slugPair(home, dest)}`}
            >
              Full {home.name} → {dest.name} guide →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

function Fact({ title, value, ok }: { title: string; value: string; ok: boolean }) {
  return (
    <div class="rounded-xl border border-border bg-bg/40 p-3">
      <dt class="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
        <span
          class={`inline-block h-2 w-2 rounded-full ${ok ? "bg-good" : "bg-volt-500"}`}
          aria-hidden="true"
        />
        {title}
      </dt>
      <dd class="mt-1 text-sm leading-snug">{value}</dd>
    </div>
  );
}

const slugPair = (a: Country, b: Country) => `${a.slug}-to-${b.slug}`;
