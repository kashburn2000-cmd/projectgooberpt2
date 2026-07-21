import { useMemo, useState } from "preact/hooks";

interface SlimFood {
  slug: string;
  name: string;
  aliases: string[];
  category: string;
  emoji: string;
}

export default function FoodSearch({ foods }: { foods: SlimFood[] }) {
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    const list = query
      ? foods.filter(
          (f) =>
            f.name.toLowerCase().includes(query) ||
            f.aliases.some((a) => a.toLowerCase().includes(query)),
        )
      : foods;
    return list.slice(0, query ? 60 : 12);
  }, [q, foods]);

  return (
    <div>
      <label class="relative block">
        <span class="sr-only">Search foods</span>
        <input
          type="search"
          value={q}
          onInput={(e) => setQ((e.target as HTMLInputElement).value)}
          placeholder="Search a food… (fries, chicken breast, salmon)"
          autocomplete="off"
          class="w-full rounded-2xl border-2 border-border bg-surface px-5 py-4 pl-12 text-lg shadow-lg focus:border-brand-500"
        />
        <svg class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
      </label>

      <div class="mt-4">
        {!q && <p class="mb-3 text-center text-sm text-muted">Popular right now — or search for anything above.</p>}
        {results.length === 0 ? (
          <p class="py-6 text-center text-muted">No match. Try "fries", "wings", or "broccoli".</p>
        ) : (
          <div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {results.map((f) => (
              <a href={`/food/${f.slug}`} class="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2.5 text-left text-sm font-medium hover:border-brand-400">
                <span class="text-lg" aria-hidden="true">{f.emoji}</span>
                <span class="truncate">{f.name}</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
