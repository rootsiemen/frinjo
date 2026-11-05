"use client";

import { useMemo, useRef, useState } from "react";

const labelCls = "block text-sm font-bold text-stone-800 mb-2";

export interface TextStats {
  words: number;
  chars: number;
  charsNoSpaces: number;
  sentences: number;
  paragraphs: number;
  uniqueWords: number;
}

/** Syllable estimate: vowel-group heuristic (standard for readability formulas). */
export function countSyllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!w) return 0;
  if (w.length <= 3) return 1;
  const groups = w.replace(/e$/, "").match(/[aeiouy]+/g);
  return Math.max(1, groups ? groups.length : 1);
}

export function analyze(text: string): TextStats & { syllables: number; fleschEase: number | null; fkGrade: number | null; topWords: [string, number][] } {
  const wordsArr = text.trim() ? text.trim().split(/\s+/) : [];
  const words = wordsArr.length;
  const charsNoSpaces = text.replace(/\s/g, "").length;
  const sentences = (text.match(/[.!?]+(\s|$)/g) || []).length || (words > 0 ? 1 : 0);
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim()).length;
  const syllables = wordsArr.reduce((s, w) => s + countSyllables(w), 0);
  const freq = new Map<string, number>();
  for (const w of wordsArr) {
    const key = w.toLowerCase().replace(/[^a-z0-9'-]/g, "");
    if (key) freq.set(key, (freq.get(key) ?? 0) + 1);
  }
  const topWords = [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
  let fleschEase: number | null = null, fkGrade: number | null = null;
  if (words >= 10 && sentences > 0) {
    const asl = words / sentences, asw = syllables / words;
    fleschEase = Math.max(0, Math.min(100, 206.835 - 1.015 * asl - 84.6 * asw));
    fkGrade = Math.max(0, 0.39 * asl + 11.8 * asw - 15.59);
  }
  return {
    words, chars: text.length, charsNoSpaces, sentences, paragraphs,
    uniqueWords: freq.size, syllables, fleschEase, fkGrade, topWords,
  };
}

export default function WordCounter() {
  const [text, setText] = useState("");
  const [readWpm, setReadWpm] = useState(238);
  const [speakWpm, setSpeakWpm] = useState(130);
  const [selection, setSelection] = useState("");
  const taRef = useRef<HTMLTextAreaElement>(null);

  const stats = useMemo(() => analyze(text), [text]);
  const selStats = useMemo(() => (selection ? analyze(selection) : null), [selection]);
  const readMin = stats.words / readWpm;
  const speakMin = stats.words / speakWpm;

  function onSelect() {
    const ta = taRef.current;
    if (!ta) return;
    const sel = ta.value.slice(ta.selectionStart ?? 0, ta.selectionEnd ?? 0);
    setSelection(sel);
  }

  function loadFile(f: File | undefined) {
    if (!f) return;
    if (!f.name.toLowerCase().endsWith(".txt") && f.type !== "text/plain") {
      alert("For now, plain .txt files only — or paste the text directly.");
      return;
    }
    f.text().then(setText).catch(() => {});
  }

  function downloadCsv() {
    const header = "word,count,density_percent\n";
    const rows = analyze(text).topWords
      .map(([w, c]) => `"${w}",${c},${((c / Math.max(1, stats.words)) * 100).toFixed(2)}`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "keyword-density.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  const statCards: [string, string][] = [
    [stats.words.toLocaleString(), "Words"],
    [stats.chars.toLocaleString(), "Characters"],
    [stats.charsNoSpaces.toLocaleString(), "Characters (no spaces)"],
    [stats.sentences.toLocaleString(), "Sentences"],
    [stats.paragraphs.toLocaleString(), "Paragraphs"],
    [stats.uniqueWords.toLocaleString(), "Unique words"],
  ];

  function fmtTime(min: number): string {
    if (min <= 0) return "0 sec";
    if (min < 1) return `${Math.round(min * 60)} sec`;
    const m = Math.floor(min), s = Math.round((min - m) * 60);
    return s > 0 ? `${m} min ${s} sec` : `${m} min`;
  }

  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-10 shadow-sm">
          <label className={labelCls} htmlFor="wc-text">Paste or type your text — counts update live</label>
          <textarea id="wc-text" ref={taRef} rows={9} value={text}
            onChange={(e) => { setText(e.target.value); }}
            onSelect={onSelect}
            placeholder="Start typing or paste your essay, article, speech… Tip: highlight part of the text to count just the selection."
            className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition" />
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <label className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-bold text-stone-600 hover:border-orange-400 cursor-pointer transition">
              📄 Load a .txt file
              <input type="file" accept=".txt,text/plain" className="hidden" onChange={(e) => loadFile(e.target.files?.[0])} />
            </label>
            <button type="button" onClick={() => setText("")} className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-bold text-stone-600 hover:border-orange-400 transition">Clear</button>
            {selStats && (
              <span className="text-sm font-semibold text-orange-800 bg-orange-100 rounded-full px-4 py-2">
                Selection: {selStats.words} words · {selection.length} characters
              </span>
            )}
          </div>

          <div className="mt-7 grid gap-3 grid-cols-2 sm:grid-cols-3">
            {statCards.map(([v, l]) => (
              <div key={l} className="rounded-2xl bg-white border border-stone-200 p-4 text-center">
                <p className="font-display text-3xl font-bold text-stone-900">{v}</p>
                <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-stone-500">{l}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div className="rounded-2xl bg-white border border-stone-200 p-5">
              <p className="font-bold text-stone-900">Reading &amp; speaking time</p>
              <p className="mt-2 font-display text-2xl font-bold text-stone-900">{fmtTime(readMin)} <span className="text-base text-stone-500 font-sans font-semibold">to read</span></p>
              <p className="font-display text-2xl font-bold text-stone-900">{fmtTime(speakMin)} <span className="text-base text-stone-500 font-sans font-semibold">to speak aloud</span></p>
              <div className="mt-3 space-y-2 text-sm text-stone-600">
                <label className="flex items-center gap-3">Reading speed
                  <input type="number" min="60" max="600" value={readWpm} onChange={(e) => setReadWpm(Math.max(1, Number(e.target.value) || 238))} className="w-20 rounded-lg border border-stone-300 px-2 py-1" /> wpm
                </label>
                <label className="flex items-center gap-3">Speaking speed
                  <input type="number" min="60" max="300" value={speakWpm} onChange={(e) => setSpeakWpm(Math.max(1, Number(e.target.value) || 130))} className="w-20 rounded-lg border border-stone-300 px-2 py-1" /> wpm
                </label>
              </div>
              <p className="mt-2 text-xs text-stone-400">Defaults are the research averages — 238 wpm silent reading of English non-fiction (Brysbaert, 2019), ~130 wpm for presentations. Adjust them to your own pace; most counters lock you into theirs.</p>
            </div>
            <div className="rounded-2xl bg-white border border-stone-200 p-5">
              <p className="font-bold text-stone-900">Readability (real formulas, named)</p>
              {stats.fleschEase !== null ? (
                <>
                  <p className="mt-2 font-display text-2xl font-bold text-stone-900">{stats.fleschEase.toFixed(0)} <span className="text-base text-stone-500 font-sans font-semibold">Flesch Reading Ease</span></p>
                  <p className="font-display text-2xl font-bold text-stone-900">Grade {stats.fkGrade!.toFixed(1)} <span className="text-base text-stone-500 font-sans font-semibold">Flesch-Kincaid (US school grade)</span></p>
                  <p className="mt-2 text-xs text-stone-400">90–100 very easy · 60–70 plain English · 30–50 difficult · below 30 academic/dense. Formulas: Flesch (1948) and Kincaid et al. (1975), computed from sentence length and syllables per word.</p>
                </>
              ) : (
                <p className="mt-2 text-sm text-stone-400">Add at least 10 words to compute readability — the formulas need enough text to be meaningful.</p>
              )}
            </div>
          </div>

          {stats.topWords.length > 0 && (
            <div className="mt-5 rounded-2xl bg-white border border-stone-200 p-5">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <p className="font-bold text-stone-900">Top words &amp; keyword density</p>
                <button type="button" onClick={downloadCsv} className="rounded-full bg-stone-900 text-white text-sm font-bold px-4 py-2 hover:bg-stone-800 transition">⬇ Export density CSV</button>
              </div>
              <div className="mt-3 grid gap-x-8 gap-y-1.5 sm:grid-cols-2">
                {stats.topWords.map(([w, c]) => (
                  <p key={w} className="flex justify-between text-sm text-stone-600 border-b border-stone-50 py-1">
                    <span className="font-semibold text-stone-800">{w}</span>
                    <span>{c}× · {((c / Math.max(1, stats.words)) * 100).toFixed(1)}%</span>
                  </p>
                ))}
              </div>
            </div>
          )}
          <p className="mt-5 text-xs text-stone-400 text-center">Everything is counted locally in your browser — your text is never uploaded or stored.</p>
        </div>
      </div>
    </section>
  );
}
