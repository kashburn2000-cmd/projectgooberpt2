import { useEffect, useRef, useState } from "preact/hooks";
import type { Food, CookSetting } from "../../data/foods";

function beep() {
  try {
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new Ctx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    o.type = "sine";
    o.frequency.value = 880;
    g.gain.value = 0.08;
    o.start();
    let n = 0;
    const iv = setInterval(() => {
      o.frequency.value = o.frequency.value === 880 ? 620 : 880;
      if (++n > 7) {
        clearInterval(iv);
        o.stop();
        ctx.close();
      }
    }, 170);
  } catch (e) {}
}

const mmss = (s: number) =>
  `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export default function CookTimer({ food }: { food: Food }) {
  const modes = ([["fresh", food.fresh], ["frozen", food.frozen]] as const).filter(
    ([, s]) => s,
  ) as [("fresh" | "frozen"), CookSetting][];
  const [mode, setMode] = useState<"fresh" | "frozen">(modes[0][0]);
  const setting = (mode === "fresh" ? food.fresh : food.frozen) ?? modes[0][1];

  const [remaining, setRemaining] = useState(setting.min[0] * 60);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const tick = useRef<number | null>(null);

  // Reset whenever the setting (fresh/frozen) changes.
  useEffect(() => {
    setRunning(false);
    setDone(false);
    setRemaining(setting.min[0] * 60);
  }, [mode]);

  useEffect(() => {
    if (!running) return;
    tick.current = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          window.clearInterval(tick.current!);
          setRunning(false);
          setDone(true);
          beep();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => {
      if (tick.current) window.clearInterval(tick.current);
    };
  }, [running]);

  const setTo = (m: number) => {
    setRunning(false);
    setDone(false);
    setRemaining(m * 60);
  };

  return (
    <div class={`rounded-3xl border-2 bg-surface p-5 shadow-lg sm:p-6 ${done ? "border-done-500" : "border-border"}`}>
      {/* Fresh / frozen toggle */}
      {modes.length > 1 && (
        <div class="mb-4 inline-flex rounded-xl border border-border p-1">
          {modes.map(([m]) => (
            <button
              type="button"
              onClick={() => setMode(m)}
              class={`rounded-lg px-4 py-1.5 text-sm font-semibold capitalize ${mode === m ? "bg-brand-600 text-white" : "text-muted"}`}
            >
              {m === "frozen" ? "From frozen" : "Fresh"}
            </button>
          ))}
        </div>
      )}

      {/* Temp + time headline */}
      <div class="flex flex-wrap items-end gap-x-6 gap-y-2">
        <div>
          <div class="text-xs font-semibold uppercase tracking-wide text-muted">Temperature</div>
          <div class="font-mono text-3xl font-extrabold text-brand-700 dark:text-brand-400">{setting.tempF}°F</div>
          <div class="font-mono text-xs text-muted">{setting.tempC}°C</div>
        </div>
        <div>
          <div class="text-xs font-semibold uppercase tracking-wide text-muted">Time</div>
          <div class="font-mono text-3xl font-extrabold">
            {setting.min[0] === setting.min[1] ? `${setting.min[0]}` : `${setting.min[0]}–${setting.min[1]}`}
            <span class="ml-1 text-lg">min</span>
          </div>
          {setting.shake && <div class="text-xs text-muted">shake / flip halfway</div>}
        </div>
      </div>

      {setting.note && <p class="mt-3 text-sm text-muted">{setting.note}</p>}

      {/* Timer */}
      <div class="mt-5 rounded-2xl bg-surface2 p-5 text-center">
        <div
          class={`font-mono text-6xl font-extrabold tabular-nums ${done ? "text-done-600 dark:text-done-400" : ""}`}
          aria-live="polite"
        >
          {done ? "Done!" : mmss(remaining)}
        </div>
        <div class="mt-4 flex justify-center gap-2">
          <button type="button" onClick={() => { setDone(false); setRunning((r) => !r); }} class="btn-primary min-w-28">
            {running ? "Pause" : done ? "Restart" : "Start"}
          </button>
          <button type="button" onClick={() => setTo(setting.min[0])} class="btn-ghost">Reset</button>
        </div>
        <div class="mt-3 flex items-center justify-center gap-2 text-xs text-muted">
          <span>Set timer:</span>
          <button type="button" onClick={() => setTo(setting.min[0])} class="chip hover:border-brand-400">{setting.min[0]} min</button>
          {setting.min[1] !== setting.min[0] && (
            <button type="button" onClick={() => setTo(setting.min[1])} class="chip hover:border-brand-400">{setting.min[1]} min</button>
          )}
        </div>
        <p class="mt-3 text-xs text-muted">Timer preset to the shorter time — check early, then add minutes to taste.</p>
      </div>

      {/* Doneness */}
      {food.doneness && (
        <div class="mt-4 flex items-start gap-3 rounded-xl border border-temp-500/40 bg-temp-500/10 p-3">
          <span class="mt-0.5 text-temp-600" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4v10.5a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/><path d="M12 10v6"/></svg>
          </span>
          <p class="text-sm">
            <strong>Check it's done:</strong> {food.doneness.label} ({food.doneness.tempF}°F / {food.doneness.tempC}°C).
            Air fryers vary — a food thermometer is the only way to be sure.
          </p>
        </div>
      )}
    </div>
  );
}
