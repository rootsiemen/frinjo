"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { chineseZodiac } from "../age-calculator/AgeCalc";

const labelCls = "block text-sm font-bold text-stone-800 mb-2";

export interface SignInfo {
  name: string;
  symbol: string;
  dates: string;
  start: [number, number];
  end: [number, number];
  element: "Fire" | "Earth" | "Air" | "Water";
  planet: string;
  traits: string;
  matches: string[];
}

export const SIGNS: SignInfo[] = [
  { name: "Capricorn", symbol: "♑", dates: "Dec 22 – Jan 19", start: [12, 22], end: [1, 19], element: "Earth", planet: "Saturn", traits: "Disciplined, patient and quietly ambitious — the sign that builds things to last.", matches: ["Taurus", "Virgo", "Pisces"] },
  { name: "Aquarius", symbol: "♒", dates: "Jan 20 – Feb 18", start: [1, 20], end: [2, 18], element: "Air", planet: "Uranus", traits: "Original, independent and idea-driven — the sign that questions every rule.", matches: ["Gemini", "Libra", "Sagittarius"] },
  { name: "Pisces", symbol: "♓", dates: "Feb 19 – Mar 20", start: [2, 19], end: [3, 20], element: "Water", planet: "Neptune", traits: "Intuitive, artistic and deeply empathetic — the dreamer of the zodiac.", matches: ["Cancer", "Scorpio", "Taurus"] },
  { name: "Aries", symbol: "♈", dates: "Mar 21 – Apr 19", start: [3, 21], end: [4, 19], element: "Fire", planet: "Mars", traits: "Bold, direct and first to act — the spark that starts things.", matches: ["Leo", "Sagittarius", "Gemini"] },
  { name: "Taurus", symbol: "♉", dates: "Apr 20 – May 20", start: [4, 20], end: [5, 20], element: "Earth", planet: "Venus", traits: "Steady, loyal and sensual — builds comfort and keeps promises.", matches: ["Virgo", "Capricorn", "Cancer"] },
  { name: "Gemini", symbol: "♊", dates: "May 21 – Jun 20", start: [5, 21], end: [6, 20], element: "Air", planet: "Mercury", traits: "Curious, quick and twin-minded — always two perspectives at once.", matches: ["Libra", "Aquarius", "Aries"] },
  { name: "Cancer", symbol: "♋", dates: "Jun 21 – Jul 22", start: [6, 21], end: [7, 22], element: "Water", planet: "Moon", traits: "Protective, intuitive and home-centred — feels first, then decides.", matches: ["Scorpio", "Pisces", "Taurus"] },
  { name: "Leo", symbol: "♌", dates: "Jul 23 – Aug 22", start: [7, 23], end: [8, 22], element: "Fire", planet: "Sun", traits: "Warm, proud and expressive — born to be seen and to lead.", matches: ["Aries", "Sagittarius", "Libra"] },
  { name: "Virgo", symbol: "♍", dates: "Aug 23 – Sep 22", start: [8, 23], end: [9, 22], element: "Earth", planet: "Mercury", traits: "Precise, helpful and analytical — finds the flaw and fixes it.", matches: ["Taurus", "Capricorn", "Cancer"] },
  { name: "Libra", symbol: "♎", dates: "Sep 23 – Oct 22", start: [9, 23], end: [10, 22], element: "Air", planet: "Venus", traits: "Fair, charming and harmony-seeking — weighs every side before choosing.", matches: ["Gemini", "Aquarius", "Leo"] },
  { name: "Scorpio", symbol: "♏", dates: "Oct 23 – Nov 21", start: [10, 23], end: [11, 21], element: "Water", planet: "Pluto", traits: "Intense, private and all-or-nothing — depth over small talk.", matches: ["Cancer", "Pisces", "Capricorn"] },
  { name: "Sagittarius", symbol: "♐", dates: "Nov 22 – Dec 21", start: [11, 22], end: [12, 21], element: "Fire", planet: "Jupiter", traits: "Honest, restless and philosophical — always aiming at the horizon.", matches: ["Aries", "Leo", "Aquarius"] },
];

export function signForDate(month: number, day: number): { sign: SignInfo; cusp: SignInfo | null } {
  for (let i = 0; i < SIGNS.length; i++) {
    const s = SIGNS[i];
    const [sm, sd] = s.start, [em, ed] = s.end;
    const afterStart = month > sm || (month === sm && day >= sd);
    const beforeEnd = month < em || (month === em && day <= ed);
    const inRange = sm > em ? (afterStart || beforeEnd) : (afterStart && beforeEnd);
    if (inRange) {
      const nearStart = month === sm && day - sd <= 1;
      const nearEnd = month === em && ed - day <= 1;
      const cusp = nearStart ? SIGNS[(i + SIGNS.length - 1) % SIGNS.length] : nearEnd ? SIGNS[(i + 1) % SIGNS.length] : null;
      return { sign: s, cusp };
    }
  }
  return { sign: SIGNS[0], cusp: null };
}

export default function Zodiac() {
  const [dob, setDob] = useState("1995-06-15");

  const result = useMemo(() => {
    if (!dob) return null;
    const [y, m, d] = dob.split("-").map(Number);
    if (!y || !m || !d) return null;
    const { sign, cusp } = signForDate(m, d);
    const cz = chineseZodiac(new Date(y, m - 1, d));
    return { sign, cusp, cz, y };
  }, [dob]);

  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-10 shadow-sm">
          <div className="max-w-sm mx-auto">
            <label className={labelCls} htmlFor="zc-dob">Your date of birth</label>
            <input id="zc-dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)}
              className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition" />
            <p className="mt-2 text-xs text-stone-400 text-center">Result updates instantly — no button, no waiting.</p>
          </div>

          {result && (
            <div className="mt-8 text-center">
              <p className="text-7xl">{result.sign.symbol}</p>
              <p className="mt-2 font-display text-5xl sm:text-6xl font-bold text-stone-900">{result.sign.name}</p>
              <p className="mt-1 text-stone-500">{result.sign.dates} · {result.sign.element} sign · Ruled by {result.sign.planet}</p>
              <p className="mt-4 max-w-xl mx-auto text-lg text-stone-600 leading-relaxed">{result.sign.traits}</p>
              <div className="mt-6 flex flex-wrap justify-center gap-2.5">
                <span className="rounded-full bg-white border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-700">Best matches: {result.sign.matches.join(" · ")}</span>
                {result.cz && <span className="rounded-full bg-white border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-700">Chinese zodiac: {result.cz} (real Lunar New Year)</span>}
              </div>
              {result.cusp && (
                <div className="mt-6 rounded-2xl bg-amber-50 border border-amber-200 px-5 py-4 text-left max-w-2xl mx-auto">
                  <p className="font-bold text-amber-900">Born on the cusp?</p>
                  <p className="mt-1 text-sm text-amber-800 leading-relaxed">
                    Your birthday sits within a day of the {result.sign.name}–{result.cusp.name} boundary. Sign
                    changes happen at an exact moment that shifts slightly each year, so a date alone cannot
                    always settle cusp birthdays — your birth <em>time and place</em> can. Run the full chart
                    (Sun, Moon and Rising) in our <Link href="/sun-moon-rising-calculator" className="font-semibold underline">Big Three Calculator</Link> — the sign
                    the Sun was actually in at your birth moment wins.
                  </p>
                </div>
              )}
              <div className="mt-8 rounded-2xl bg-stone-950 px-6 py-6 max-w-2xl mx-auto">
                <p className="text-orange-300 font-display text-xl font-bold">Your Sun sign is only one third of the picture</p>
                <p className="mt-1.5 text-stone-300 text-sm leading-relaxed">
                  Your Moon sign shapes your inner life and your Rising sign is the face you show the world.
                  Astrologers read all three together — the &quot;Big Three&quot;. Calculate yours free with
                  your birth time and city.
                </p>
                <Link href="/sun-moon-rising-calculator" className="inline-block mt-4 rounded-full bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-2.5 text-sm transition">
                  Get my Big Three →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
