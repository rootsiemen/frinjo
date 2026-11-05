"use client";

import { useEffect, useRef, useState } from "react";
import {
  computeBigThree,
  formatDegree,
  localToUtc,
  type BigThree,
  type Placement,
} from "./astro";

interface City {
  name: string;
  label: string;
  lat: number;
  lon: number;
  timezone: string;
}

const inputCls =
  "w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition";
const labelCls = "block text-sm font-bold text-stone-800 mb-2";

function PlacementCard({
  title,
  symbol,
  blurb,
  placement,
}: {
  title: string;
  symbol: string;
  blurb: string;
  placement: Placement;
}) {
  const text =
    title === "Sun sign" ? placement.sign.sun : title === "Moon sign" ? placement.sign.moon : placement.sign.rising;
  return (
    <div className="rounded-3xl border border-stone-200 bg-white p-7 text-left shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">
          {symbol} {title}
        </p>
        <span className="text-[11px] font-bold uppercase tracking-wider rounded-full bg-orange-100 text-orange-800 px-2.5 py-1">
          {placement.sign.element}
        </span>
      </div>
      <p className="mt-4 font-display text-4xl font-bold text-stone-900">
        <span className="text-orange-500 mr-2">{placement.sign.glyph}</span>
        {placement.sign.name}
      </p>
      <p className="mt-1 text-sm font-semibold text-stone-500">
        at {formatDegree(placement.degreeInSign)} · ruled by {placement.sign.ruler}
      </p>
      <p className="mt-2 text-xs font-semibold text-stone-400">{blurb}</p>
      <p className="mt-3 text-stone-600 leading-relaxed">{text}</p>
      {placement.cusp && (
        <p className="mt-3 rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800">
          ⚠ Very close to the neighbouring sign (within half a degree). A birth time or place that is
          slightly off can tip this one either way — read the neighbour too.
        </p>
      )}
    </div>
  );
}

export default function BigThreeCalculator() {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [noTime, setNoTime] = useState(false);
  const [cityQuery, setCityQuery] = useState("");
  const [cities, setCities] = useState<City[]>([]);
  const [city, setCity] = useState<City | null>(null);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<BigThree | null>(null);
  const [copied, setCopied] = useState(false);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (city || cityQuery.trim().length < 2) {
      setCities([]);
      return;
    }
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityQuery.trim())}&count=6&language=en&format=json`
        );
        const data = await res.json();
        const list: City[] = (data.results ?? []).map((r: Record<string, unknown>) => ({
          name: String(r.name),
          label: [r.name, r.admin1, r.country].filter(Boolean).join(", "),
          lat: Number(r.latitude),
          lon: Number(r.longitude),
          timezone: String(r.timezone ?? "UTC"),
        }));
        setCities(list);
      } catch {
        setCities([]);
      } finally {
        setSearching(false);
      }
    }, 350);
  }, [cityQuery, city]);

  function calculate() {
    setError("");
    setCopied(false);
    if (!date) {
      setError("Please enter your birth date — the Sun and Moon signs both come from it.");
      return;
    }
    const [y, m, d] = date.split("-").map(Number);
    if (!y || y < 1900 || y > 2100) {
      setError("Please use a birth year between 1900 and 2100.");
      return;
    }
    let hh = 12;
    let mm = 0;
    if (!noTime && time) {
      [hh, mm] = time.split(":").map(Number);
    }
    let utc: Date;
    if (city) {
      utc = localToUtc(city.timezone, y, m, d, hh, mm);
    } else {
      utc = new Date(Date.UTC(y, m - 1, d, hh, mm));
    }
    const wantRising = !noTime && !!time && !!city;
    const r = computeBigThree(utc, wantRising ? city!.lat : undefined, wantRising ? city!.lon : undefined);
    setResult(r);
  }

  const shareText = result
    ? `My Big Three: ☀️ Sun in ${result.sun.sign.name} · 🌙 Moon in ${result.moon.sign.name}${
        result.rising ? ` · ⬆️ ${result.rising.sign.name} Rising` : ""
      } — calculated free at frinjo.me/sun-moon-rising-calculator`
    : "";

  const elements = result
    ? [result.sun, result.moon, result.rising]
        .filter((p): p is Placement => !!p)
        .map((p) => p.sign.element)
    : [];
  const elementCounts = ["Fire", "Earth", "Air", "Water"].map(
    (e) => [e, elements.filter((x) => x === e).length] as const
  );
  const dominant = elementCounts.reduce((a, b) => (b[1] > a[1] ? b : a), elementCounts[0]);

  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-10 shadow-sm">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="bt-name">Your name (optional)</label>
              <input id="bt-name" className={inputCls} placeholder="e.g. Alex" value={name}
                onChange={(e) => setName(e.target.value)} autoComplete="off" />
            </div>
            <div>
              <label className={labelCls} htmlFor="bt-date">Birth date *</label>
              <input id="bt-date" type="date" className={inputCls} value={date}
                onChange={(e) => setDate(e.target.value)} min="1900-01-01" max="2100-12-31" />
            </div>
            <div>
              <label className={labelCls} htmlFor="bt-time">Birth time {noTime ? "" : "*"}</label>
              <input id="bt-time" type="time" className={inputCls} value={time} disabled={noTime}
                onChange={(e) => setTime(e.target.value)} />
              <label className="mt-2 flex items-center gap-2 text-sm text-stone-600 cursor-pointer">
                <input type="checkbox" checked={noTime} onChange={(e) => setNoTime(e.target.checked)}
                  className="w-4 h-4 accent-orange-600" />
                I don&apos;t know my birth time
              </label>
            </div>
            <div className="relative">
              <label className={labelCls} htmlFor="bt-city">Birth city {noTime ? "" : "*"}</label>
              <input id="bt-city" className={inputCls} placeholder="Start typing — e.g. New York"
                value={city ? city.label : cityQuery}
                onChange={(e) => { setCity(null); setCityQuery(e.target.value); }}
                autoComplete="off" />
              {searching && <p className="mt-1 text-xs text-stone-400">Searching cities…</p>}
              {!city && cities.length > 0 && (
                <ul className="absolute z-10 mt-1 w-full rounded-2xl border border-stone-200 bg-white shadow-xl overflow-hidden">
                  {cities.map((c) => (
                    <li key={c.label + c.lat}>
                      <button type="button"
                        className="w-full text-left px-4 py-2.5 hover:bg-orange-50 text-stone-800 text-sm"
                        onClick={() => { setCity(c); setCities([]); }}>
                        {c.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {city && <p className="mt-1 text-xs text-stone-400">{city.timezone.replace("_", " ")} · {city.lat.toFixed(2)}°, {city.lon.toFixed(2)}°</p>}
            </div>
          </div>

          {error && (
            <p className="mt-5 rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</p>
          )}

          <button type="button" onClick={calculate}
            className="mt-7 w-full sm:w-auto inline-flex justify-center items-center gap-2 rounded-full bg-orange-400 text-orange-950 font-bold px-8 py-3.5 hover:bg-orange-300 transition shadow-lg shadow-orange-400/20">
            Reveal my Big Three ✨
          </button>
          <p className="mt-3 text-xs text-stone-400">
            Calculated in your browser from real astronomical positions. Nothing you enter is stored or sent to our servers — the city lookup is the only request, and it carries only the city name you type.
          </p>
        </div>

        {result && (
          <div className="mt-10">
            <h2 className="font-display text-3xl font-bold text-stone-900 text-center">
              {name ? `${name}'s` : "Your"} Big Three
            </h2>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              <PlacementCard title="Sun sign" symbol="☀️" blurb="Your core self — who you are becoming" placement={result.sun} />
              <PlacementCard title="Moon sign" symbol="🌙" blurb="Your inner life — what you need to feel safe" placement={result.moon} />
              {result.rising ? (
                <PlacementCard title="Rising sign" symbol="⬆️" blurb="Your first impression — how the world meets you" placement={result.rising} />
              ) : (
                <div className="rounded-3xl border border-dashed border-stone-300 bg-stone-50 p-7 text-left">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">⬆️ Rising sign</p>
                  <p className="mt-4 font-display text-2xl font-bold text-stone-900">Needs your birth time &amp; city</p>
                  <p className="mt-3 text-stone-600 leading-relaxed">
                    The rising sign changes about every two hours, so it is set by the minute and the place
                    you were born. Add your birth time and city above and calculate again to reveal it.
                  </p>
                  {noTime && (
                    <p className="mt-3 text-stone-600 leading-relaxed">
                      Your Sun and Moon above are exact. Your Moon was read at midday — on the rare day the
                      Moon changed signs on your birth date, it could be the neighbouring sign.
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="mt-6 rounded-3xl border border-stone-200 bg-white p-7 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">Your element balance</p>
              <div className="mt-4 grid grid-cols-4 gap-3 text-center">
                {elementCounts.map(([e, n]) => (
                  <div key={e} className="rounded-2xl bg-stone-50 border border-stone-100 py-3">
                    <p className="font-display text-2xl font-bold text-stone-900">{n}</p>
                    <p className="text-xs font-bold uppercase tracking-wider text-stone-500">{e}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-stone-600 leading-relaxed">
                {dominant[1] > 0 ? (
                  <>Your chart leans <strong>{dominant[0]}</strong> — {
                    dominant[0] === "Fire" ? "drive, warmth and momentum run through all three placements." :
                    dominant[0] === "Earth" ? "practicality and staying power run through all three placements." :
                    dominant[0] === "Air" ? "curiosity and connection run through all three placements." :
                    "intuition and feeling run through all three placements."
                  }</>
                ) : "—"}
              </p>
              <button type="button"
                onClick={() => { navigator.clipboard.writeText(shareText).then(() => setCopied(true)).catch(() => {}); }}
                className="mt-5 inline-flex items-center gap-2 rounded-full border-2 border-orange-700 text-orange-800 font-semibold px-6 py-2.5 hover:border-orange-800 hover:bg-orange-50 transition">
                {copied ? "Copied ✓" : "Copy my Big Three"}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
