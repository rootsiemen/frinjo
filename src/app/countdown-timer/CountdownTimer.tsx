"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { TIMER_PRESETS } from "./presets";

const inputCls =
  "w-24 rounded-2xl border border-stone-300 bg-white px-4 py-3 text-center text-lg font-bold text-stone-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition";

function fmt(totalSeconds: number): string {
  const s = Math.max(0, Math.ceil(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = h > 0 ? String(m).padStart(2, "0") : String(m);
  return `${h > 0 ? `${h}:` : ""}${mm}:${String(sec).padStart(2, "0")}`;
}

export default function CountdownTimer({ initialMinutes = 5 }: { initialMinutes?: number }) {
  const [durationMin, setDurationMin] = useState(initialMinutes);
  const [remaining, setRemaining] = useState(initialMinutes * 60);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const endAtRef = useRef<number | null>(null);
  const audioRef = useRef<AudioContext | null>(null);
  const baseTitle = useRef<string>("");

  useEffect(() => {
    baseTitle.current = document.title;
  }, []);

  const beep = useCallback(() => {
    if (!soundOn) return;
    try {
      audioRef.current = audioRef.current ?? new AudioContext();
      const ctx = audioRef.current;
      [0, 0.35, 0.7].forEach((offset) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 880;
        gain.gain.setValueAtTime(0.25, ctx.currentTime + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + offset + 0.3);
        osc.start(ctx.currentTime + offset);
        osc.stop(ctx.currentTime + offset + 0.32);
      });
    } catch {
      /* audio unavailable — visual alarm still shows */
    }
  }, [soundOn]);

  useEffect(() => {
    if (!running) return;
    const tick = () => {
      if (endAtRef.current === null) return;
      const left = (endAtRef.current - Date.now()) / 1000;
      if (left <= 0) {
        setRemaining(0);
        setRunning(false);
        setDone(true);
        document.title = "⏰ Time's up!";
        beep();
        if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
        return;
      }
      setRemaining(left);
      document.title = `${fmt(left)} — Countdown Timer`;
    };
    tick();
    const id = setInterval(tick, 200);
    return () => clearInterval(id);
  }, [running, beep]);

  useEffect(() => {
    if (!running && !done) document.title = baseTitle.current;
  }, [running, done]);

  function start() {
    if (remaining <= 0) return;
    endAtRef.current = Date.now() + remaining * 1000;
    setDone(false);
    setRunning(true);
  }
  function pause() {
    setRunning(false);
  }
  function reset(mins: number = durationMin) {
    setRunning(false);
    setDone(false);
    setRemaining(mins * 60);
    endAtRef.current = null;
    document.title = baseTitle.current;
  }
  function setCustom(mins: number) {
    const m = Math.max(0, Math.min(999, mins || 0));
    setDurationMin(m);
    reset(m);
  }

  const total = Math.max(durationMin * 60, 1);
  const pct = Math.max(0, Math.min(100, (remaining / total) * 100));

  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className={`rounded-3xl border p-6 sm:p-10 shadow-sm text-center transition ${
          done ? "border-orange-400 bg-orange-50" : "border-stone-200 bg-stone-50/60"
        }`}>
          <p className={`font-display font-bold text-stone-900 tabular-nums leading-none ${
            done ? "text-5xl sm:text-7xl" : "text-7xl sm:text-9xl"
          }`}>
            {done ? "⏰ Time's up!" : fmt(remaining)}
          </p>

          <div className="mt-6 h-3 w-full max-w-xl mx-auto rounded-full bg-stone-200 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-orange-300 to-orange-500 transition-all duration-200"
              style={{ width: `${pct}%` }} />
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {!running ? (
              <button type="button" onClick={start}
                className="inline-flex items-center gap-2 rounded-full bg-orange-400 text-orange-950 font-bold px-8 py-3.5 hover:bg-orange-300 transition shadow-lg shadow-orange-400/20">
                {remaining < total ? "Resume" : "Start"}
              </button>
            ) : (
              <button type="button" onClick={pause}
                className="inline-flex items-center gap-2 rounded-full bg-stone-900 text-white font-bold px-8 py-3.5 hover:bg-stone-700 transition">
                Pause
              </button>
            )}
            <button type="button" onClick={() => reset()}
              className="inline-flex items-center gap-2 rounded-full border-2 border-orange-700 text-orange-800 font-semibold px-7 py-3 hover:border-orange-800 hover:bg-orange-50 transition">
              Reset
            </button>
            <label className="inline-flex items-center gap-2 text-sm font-semibold text-stone-600 cursor-pointer px-2">
              <input type="checkbox" checked={soundOn} onChange={(e) => setSoundOn(e.target.checked)}
                className="w-4 h-4 accent-orange-600" />
              Alarm sound
            </label>
          </div>

          <div className="mt-8 flex items-end justify-center gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-500 mb-1.5" htmlFor="ct-min">Minutes</label>
              <input id="ct-min" type="number" min="0" max="999" className={inputCls} value={durationMin}
                onChange={(e) => setCustom(Number(e.target.value))} />
            </div>
            <button type="button" onClick={start}
              className="rounded-full bg-orange-100 text-orange-800 font-bold px-5 py-3 hover:bg-orange-200 transition">
              Set &amp; start
            </button>
          </div>
          <p className="mt-4 text-xs text-stone-400">
            The countdown also runs in the tab title, so you can switch tabs and still see the time left.
            When it finishes: alarm, vibration on phones, and a title flash.
          </p>
        </div>

        <div className="mt-8">
          <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-stone-500 mb-4">
            Popular preset timers
          </p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {TIMER_PRESETS.map((p) => (
              <Link key={p.slug} href={`/countdown-timer/${p.slug}`}
                className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 hover:border-orange-400 hover:text-orange-700 transition">
                {p.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
