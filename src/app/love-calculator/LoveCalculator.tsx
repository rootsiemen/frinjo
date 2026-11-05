"use client";

import { useMemo, useState } from "react";
import { SIGNS, type SignInfo } from "../sun-moon-rising-calculator/astro";

const inputCls =
  "w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition";
const labelCls = "block text-sm font-bold text-stone-800 mb-2";

/** Deterministic score for a pair of names: same pair, same score, forever. */
export function loveScore(nameA: string, nameB: string): number {
  const a = nameA.trim().toLowerCase().replace(/[^a-z]/g, "");
  const b = nameB.trim().toLowerCase().replace(/[^a-z]/g, "");
  if (!a || !b) return 0;
  const pair = [a, b].sort().join("♥");
  // letter-count fingerprint + position-weighted hash — stable across visits
  let h = 0;
  for (let i = 0; i < pair.length; i++) {
    h = (h * 31 + pair.charCodeAt(i) * (i + 7)) >>> 0;
  }
  const shared = [...new Set(a)].filter((ch) => b.includes(ch)).length;
  const base = (h % 61) + Math.min(shared * 3, 24);
  return Math.max(24, Math.min(99, base));
}

export function scoreVerdict(score: number): { title: string; text: string } {
  if (score >= 85)
    return {
      title: "Written in the stars ✨",
      text: "A rare, easy chemistry. Pairs that score here tend to finish each other's sentences — the work is not finding the spark, it is protecting it from routine.",
    };
  if (score >= 70)
    return {
      title: "A strong, warm match",
      text: "Real compatibility with room to grow. Scores in this range usually mean shared values and natural attraction — small frictions, quickly forgiven.",
    };
  if (score >= 55)
    return {
      title: "Plenty to build on",
      text: "A workable, human match. The connection is there; what decides it is communication. Couples here often outlast the 'perfect' scores because they learn each other properly.",
    };
  if (score >= 40)
    return {
      title: "A slow-burn pairing",
      text: "Different rhythms, different defaults. That is not a no — many lasting couples start here — but this pairing asks for patience and honest talking from day one.",
    };
  return {
    title: "A challenging mix",
    text: "Sparks of the friction kind. Low scores usually mean opposite instincts about closeness, plans and feelings. If it works, it works because both people chose it deliberately, every day.",
  };
}

const ELEMENT_PAIR: Record<string, string> = {
  "Fire|Fire": "Double fire: instant heat, shared hunger for life, and arguments that flare and pass like summer storms. The risk is not boredom — it is both of you burning out at once.",
  "Fire|Earth": "Fire brings the spark, Earth brings the staying power. This pairing works when fire respects earth's pace and earth makes room for fire's spontaneity.",
  "Fire|Air": "Air feeds fire — this is the classic accelerant pairing. Conversation, laughter and new plans come easily; the challenge is landing long enough to build something solid.",
  "Fire|Water": "Steam or a doused flame — this pairing is all about handling intensity. Water feels fire's heat deeply; fire must learn that water's quiet is not disinterest.",
  "Earth|Earth": "Built to last. Two earth signs share values around loyalty, comfort and the long game. The work is keeping romance deliberate instead of purely practical.",
  "Earth|Air": "The builder meets the thinker. Air keeps earth from getting stuck; earth gives air's ideas a foundation. Misunderstandings happen when air wants to debate what earth wants to decide.",
  "Earth|Water": "The most naturally nurturing mix — water softens earth, earth gives water banks to flow between. These pairs often build a home, a family or a business that feels like all three.",
  "Air|Air": "A meeting of minds first, hearts second. Endless conversation and shared curiosity; the danger is living in theory while feelings wait outside the door.",
  "Air|Water": "The poet and the dreamer. Water feels what air analyses, which can confuse both — until air learns to listen and water learns to say it plainly.",
  "Water|Water": "Deep water. Two water signs read each other without words, which is beautiful and occasionally overwhelming. Boundaries keep this pairing sweet instead of swampy.",
};

export function pairReading(a: SignInfo, b: SignInfo): string {
  const key = [a.element, b.element].sort().join("|");
  return ELEMENT_PAIR[key] ?? "";
}

export default function LoveCalculator() {
  const [nameA, setNameA] = useState("");
  const [nameB, setNameB] = useState("");
  const [signA, setSignA] = useState("");
  const [signB, setSignB] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const sa = useMemo(() => SIGNS.find((s) => s.name === signA), [signA]);
  const sb = useMemo(() => SIGNS.find((s) => s.name === signB), [signB]);

  function calculate() {
    setError("");
    setCopied(false);
    if (nameA.trim().length < 2 || nameB.trim().length < 2) {
      setError("Enter both names (at least 2 letters each) to calculate your score.");
      setResult(null);
      return;
    }
    setResult(loveScore(nameA, nameB));
  }

  const verdict = result !== null ? scoreVerdict(result) : null;
  const shareText = result
    ? `💘 ${nameA.trim()} + ${nameB.trim()} = ${result}% on the Love Calculator — try yours free at frinjo.me/love-calculator`
    : "";

  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-10 shadow-sm">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="lc-a">Your name</label>
              <input id="lc-a" className={inputCls} placeholder="e.g. Alex" value={nameA}
                onChange={(e) => setNameA(e.target.value)} autoComplete="off" />
            </div>
            <div>
              <label className={labelCls} htmlFor="lc-b">Their name</label>
              <input id="lc-b" className={inputCls} placeholder="e.g. Sam" value={nameB}
                onChange={(e) => setNameB(e.target.value)} autoComplete="off" />
            </div>
            <div>
              <label className={labelCls} htmlFor="lc-sa">Your zodiac sign (optional)</label>
              <select id="lc-sa" className={inputCls} value={signA} onChange={(e) => setSignA(e.target.value)}>
                <option value="">Not sure / skip</option>
                {SIGNS.map((s) => (
                  <option key={s.name} value={s.name}>{s.glyph} {s.name} — {s.dates}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls} htmlFor="lc-sb">Their zodiac sign (optional)</label>
              <select id="lc-sb" className={inputCls} value={signB} onChange={(e) => setSignB(e.target.value)}>
                <option value="">Not sure / skip</option>
                {SIGNS.map((s) => (
                  <option key={s.name} value={s.name}>{s.glyph} {s.name} — {s.dates}</option>
                ))}
              </select>
            </div>
          </div>
          <p className="mt-3 text-xs text-stone-400">
            Don&apos;t know your signs? Find them first with the{" "}
            <a href="/sun-moon-rising-calculator" className="font-semibold text-orange-700 hover:text-orange-800">
              Sun, Moon &amp; Rising Calculator
            </a>{" "}
            — it takes 20 seconds.
          </p>

          {error && (
            <p className="mt-5 rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</p>
          )}

          <button type="button" onClick={calculate}
            className="mt-6 w-full sm:w-auto inline-flex justify-center items-center gap-2 rounded-full bg-orange-400 text-orange-950 font-bold px-8 py-3.5 hover:bg-orange-300 transition shadow-lg shadow-orange-400/20">
            Calculate our score 💘
          </button>
          <p className="mt-3 text-xs text-stone-400">
            The same pair of names always gets the same score — it is calculated in your browser and nothing is stored.
          </p>
        </div>

        {result !== null && verdict && (
          <div className="mt-10">
            <div className="rounded-3xl border border-stone-200 bg-white p-8 sm:p-10 shadow-sm text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">
                {nameA.trim()} 💘 {nameB.trim()}
              </p>
              <p className="mt-4 font-display text-7xl sm:text-8xl font-bold text-stone-900">
                {result}<span className="text-orange-500">%</span>
              </p>
              <div className="mt-5 h-4 w-full max-w-md mx-auto rounded-full bg-stone-100 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-orange-300 to-orange-500 transition-all duration-700" style={{ width: `${result}%` }} />
              </div>
              <h2 className="mt-6 font-display text-3xl font-bold text-stone-900">{verdict.title}</h2>
              <p className="mt-3 text-stone-600 leading-relaxed max-w-2xl mx-auto">{verdict.text}</p>
              <button type="button"
                onClick={() => { navigator.clipboard.writeText(shareText).then(() => setCopied(true)).catch(() => {}); }}
                className="mt-6 inline-flex items-center gap-2 rounded-full border-2 border-orange-700 text-orange-800 font-semibold px-6 py-2.5 hover:border-orange-800 hover:bg-orange-50 transition">
                {copied ? "Copied ✓" : "Copy our result"}
              </button>
            </div>

            {sa && sb && (
              <div className="mt-6 rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">
                  {sa.glyph} {sa.name} + {sb.glyph} {sb.name}
                </p>
                <h3 className="mt-3 font-display text-2xl font-bold text-stone-900">
                  The zodiac layer: {sa.element} meets {sb.element}
                </h3>
                <p className="mt-3 text-stone-600 leading-relaxed">{pairReading(sa, sb)}</p>
                <p className="mt-3 text-stone-600 leading-relaxed">
                  {sa.name} in love: {sa.sun} {sb.name} in love: {sb.sun}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
