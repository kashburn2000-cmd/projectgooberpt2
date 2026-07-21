import { useEffect, useMemo, useState } from "preact/hooks";
import { businessDaysBetween, addBusinessDays, addDays } from "../../lib/bizdays";
import { flag, weekendLabel, formatDate } from "../../lib/util";

interface SlimCountry {
  code: string;
  name: string;
  slug: string;
  weekend: number[];
}
interface Props {
  countries: SlimCountry[];
  initialCode?: string;
  years: number[];
}

const REGION_UNKNOWN = "Countries";
const DAY_LETTERS = ["S", "M", "T", "W", "T", "F", "S"];

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function BusinessDayCalculator({ countries, initialCode = "US", years }: Props) {
  const byCode = useMemo(() => new Map(countries.map((c) => [c.code, c])), [countries]);
  const sorted = useMemo(() => [...countries].sort((a, b) => a.name.localeCompare(b.name)), [countries]);

  const [code, setCode] = useState(initialCode);
  const [weekend, setWeekend] = useState<number[]>(byCode.get(initialCode)?.weekend ?? [6, 0]);
  const [holidays, setHolidays] = useState<Set<string> | null>(null);
  const [holidayNames, setHolidayNames] = useState<Record<string, string>>({});
  const [mode, setMode] = useState<"between" | "add">("between");
  const [start, setStart] = useState(todayISO());
  const [end, setEnd] = useState(() => addDays(todayISO(), 30));
  const [n, setN] = useState(10);
  const [dir, setDir] = useState<1 | -1>(1);

  useEffect(() => {
    const c = byCode.get(code);
    if (c) setWeekend(c.weekend);
    setHolidays(null);
    fetch(`/data/holidays/${code}.json`)
      .then((r) => r.json())
      .then((d: { years: Record<string, { date: string; name: string }[]> }) => {
        const set = new Set<string>();
        const names: Record<string, string> = {};
        for (const y of Object.keys(d.years))
          for (const h of d.years[y]) {
            set.add(h.date);
            names[h.date] = h.name;
          }
        setHolidays(set);
        setHolidayNames(names);
      })
      .catch(() => setHolidays(new Set()));
  }, [code]);

  const toggleDay = (day: number) =>
    setWeekend((w) => (w.includes(day) ? w.filter((x) => x !== day) : [...w, day].sort((a, b) => a - b)));

  const yearInRange = (iso: string) => years.includes(Number(iso.slice(0, 4)));
  const outOfRange =
    mode === "between" ? !yearInRange(start) || !yearInRange(end) : !yearInRange(start);

  const between = useMemo(
    () => (holidays && mode === "between" && start && end ? businessDaysBetween(start, end, weekend, holidays) : null),
    [holidays, mode, start, end, weekend],
  );
  const addResult = useMemo(
    () => (holidays && mode === "add" && start ? addBusinessDays(start, n * dir, weekend, holidays) : null),
    [holidays, mode, start, n, dir, weekend],
  );

  const loading = holidays === null;

  return (
    <div class="rounded-3xl border-2 border-border bg-surface p-5 shadow-lg sm:p-6">
      {/* Country + mode */}
      <div class="flex flex-col gap-4 sm:flex-row sm:items-end">
        <label class="flex-1">
          <span class="mb-1.5 block text-sm font-medium text-muted">Country</span>
          <select
            class="w-full rounded-xl border border-border bg-surface px-3 py-3 text-base font-medium shadow-sm focus:border-brand-500"
            value={code}
            onChange={(e) => setCode((e.target as HTMLSelectElement).value)}
          >
            {sorted.map((c) => (
              <option value={c.code}>
                {flag(c.code)} {c.name}
              </option>
            ))}
          </select>
        </label>
        <div class="inline-flex rounded-xl border border-border p-1" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "between"}
            class={`rounded-lg px-3 py-2 text-sm font-semibold ${mode === "between" ? "bg-brand-600 text-white" : "text-muted"}`}
            onClick={() => setMode("between")}
          >
            Days between
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "add"}
            class={`rounded-lg px-3 py-2 text-sm font-semibold ${mode === "add" ? "bg-brand-600 text-white" : "text-muted"}`}
            onClick={() => setMode("add")}
          >
            Add / subtract
          </button>
        </div>
      </div>

      {/* Inputs */}
      {mode === "between" ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <label>
            <span class="mb-1.5 block text-sm font-medium text-muted">From</span>
            <input type="date" value={start} onChange={(e) => setStart((e.target as HTMLInputElement).value)} class="w-full rounded-xl border border-border bg-surface px-3 py-2.5 shadow-sm focus:border-brand-500" />
          </label>
          <label>
            <span class="mb-1.5 block text-sm font-medium text-muted">To</span>
            <input type="date" value={end} onChange={(e) => setEnd((e.target as HTMLInputElement).value)} class="w-full rounded-xl border border-border bg-surface px-3 py-2.5 shadow-sm focus:border-brand-500" />
          </label>
        </div>
      ) : (
        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          <label>
            <span class="mb-1.5 block text-sm font-medium text-muted">Start date</span>
            <input type="date" value={start} onChange={(e) => setStart((e.target as HTMLInputElement).value)} class="w-full rounded-xl border border-border bg-surface px-3 py-2.5 shadow-sm focus:border-brand-500" />
          </label>
          <label>
            <span class="mb-1.5 block text-sm font-medium text-muted">Business days</span>
            <input type="number" min="0" value={n} onInput={(e) => setN(Math.max(0, Number((e.target as HTMLInputElement).value)))} class="w-full rounded-xl border border-border bg-surface px-3 py-2.5 shadow-sm focus:border-brand-500" />
          </label>
          <label>
            <span class="mb-1.5 block text-sm font-medium text-muted">Direction</span>
            <select value={String(dir)} onChange={(e) => setDir(Number((e.target as HTMLSelectElement).value) as 1 | -1)} class="w-full rounded-xl border border-border bg-surface px-3 py-2.5 shadow-sm focus:border-brand-500">
              <option value="1">After (add)</option>
              <option value="-1">Before (subtract)</option>
            </select>
          </label>
        </div>
      )}

      {/* Weekend picker */}
      <div class="mt-4 flex flex-wrap items-center gap-2">
        <span class="text-sm text-muted">Weekend:</span>
        <div class="inline-flex overflow-hidden rounded-lg border border-border">
          {DAY_LETTERS.map((l, i) => (
            <button
              type="button"
              onClick={() => toggleDay(i)}
              aria-pressed={weekend.includes(i)}
              title={`Toggle ${l}`}
              class={`h-8 w-8 border-r border-border text-xs font-semibold last:border-r-0 ${weekend.includes(i) ? "bg-holiday-500/20 text-holiday-600" : "text-muted hover:bg-surface2"}`}
            >
              {l}
            </button>
          ))}
        </div>
        <span class="text-xs text-muted">{weekendLabel(weekend)}</span>
      </div>

      {/* Result */}
      <div class="mt-5">
        {loading ? (
          <div class="h-24 animate-pulse rounded-2xl bg-surface2"></div>
        ) : mode === "between" && between ? (
          <div class="rounded-2xl bg-brand-500/10 p-5">
            <div class="flex items-baseline gap-2">
              <span class="font-mono text-4xl font-extrabold text-brand-600 dark:text-brand-300">{between.businessDays.toLocaleString()}</span>
              <span class="text-lg font-semibold">business days</span>
            </div>
            <div class="mt-3 grid grid-cols-3 gap-2 text-center text-sm">
              <div class="rounded-lg bg-surface/70 py-2"><div class="font-mono font-bold">{between.calendarDays.toLocaleString()}</div><div class="text-xs text-muted">calendar days</div></div>
              <div class="rounded-lg bg-surface/70 py-2"><div class="font-mono font-bold">{between.weekendDays.toLocaleString()}</div><div class="text-xs text-muted">weekend days</div></div>
              <div class="rounded-lg bg-surface/70 py-2"><div class="font-mono font-bold">{between.holidayDays.toLocaleString()}</div><div class="text-xs text-muted">public holidays</div></div>
            </div>
            {between.holidaysInRange.length > 0 && (
              <details class="mt-3 text-sm">
                <summary class="cursor-pointer text-muted">Holidays excluded in this range ({between.holidaysInRange.length})</summary>
                <ul class="mt-2 space-y-1">
                  {between.holidaysInRange.map((d) => (
                    <li class="flex justify-between gap-4"><span class="font-medium">{holidayNames[d] ?? "Public holiday"}</span><span class="font-mono text-muted">{formatDate(d)}</span></li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        ) : mode === "add" && addResult ? (
          <div class="rounded-2xl bg-brand-500/10 p-5">
            <div class="text-sm text-muted">{n} business day{n === 1 ? "" : "s"} {dir === 1 ? "after" : "before"} {formatDate(start)} is</div>
            <div class="mt-1 font-mono text-3xl font-extrabold text-brand-600 dark:text-brand-300">{formatDate(addResult)}</div>
          </div>
        ) : null}

        {outOfRange && !loading && (
          <p class="mt-2 text-xs text-holiday-600">
            Heads up: holiday data covers {years[0]}–{years[years.length - 1]}. Dates outside that range
            only exclude weekends, not public holidays.
          </p>
        )}
      </div>
    </div>
  );
}
