"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { KeywordReport } from "@/lib/keyword-check";
import { btnPrimary } from "@/components/ui";

function tone(score: number): { text: string; bar: string } {
  if (score < 40) return { text: "text-green-600", bar: "bg-green-500" };
  if (score < 60) return { text: "text-amber-500", bar: "bg-amber-400" };
  return { text: "text-red-500", bar: "bg-red-500" };
}

const EXAMPLES = ["salon website cost in pakistan", "insurance", "how to start a bakery"];

export default function KeywordChecker({ initialKeyword = "" }: { initialKeyword?: string }) {
  const [input, setInput] = useState(initialKeyword);
  const [data, setData] = useState<KeywordReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const run = useCallback(async (raw: string) => {
    const kw = raw.trim();
    if (!kw) return;
    setLoading(true);
    setError(null);
    setData(null);
    setChecked(kw);
    try {
      const res = await fetch(`/api/keyword-check?keyword=${encodeURIComponent(kw)}`);
      const json = (await res.json()) as KeywordReport;
      if (json.error) setError(json.error);
      else setData(json);
    } catch {
      setError("Could not run the check — network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialKeyword) void run(initialKeyword);
  }, [initialKeyword, run]);

  function reset() {
    setData(null);
    setError(null);
    setInput("");
    setChecked("");
    inputRef.current?.focus();
    inputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  const demandLabel =
    data == null
      ? ""
      : data.suggestions.length >= 8
        ? "High demand signal"
        : data.suggestions.length >= 4
          ? "Medium demand signal"
          : data.suggestions.length >= 1
            ? "Low demand signal"
            : "No autocomplete demand signal found";

  return (
    <>
      {/* FORM */}
      <section className="bg-orange-50 dot-grid pb-16 sm:pb-20 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4">
          <form
            className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto"
            onSubmit={(e) => {
              e.preventDefault();
              void run(input);
            }}
          >
            <input
              ref={inputRef}
              type="text"
              name="keyword"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. salon website cost in pakistan"
              required
              autoComplete="off"
              className="flex-1 rounded-full border border-stone-300 bg-white px-6 py-3.5 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
            />
            <button type="submit" disabled={loading} className={`${btnPrimary} justify-center disabled:opacity-60`}>
              {loading ? "Checking…" : "Check keyword →"}
            </button>
          </form>
          <div className="mt-6 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-stone-600">
            <span>Try:</span>
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                type="button"
                className="font-semibold text-orange-700"
                onClick={() => {
                  setInput(ex);
                  void run(ex);
                }}
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* LOADING */}
      {loading && (
        <section className="py-16 sm:py-24 bg-white">
          <div className="max-w-2xl mx-auto px-4 text-center text-stone-500 text-lg">
            🔍 Checking <span className="font-semibold text-stone-800">“{checked}”</span> — fetching the
            live SERP sample, Google suggestions and Trends…
          </div>
        </section>
      )}

      {/* ERROR */}
      {!loading && error && (
        <section className="py-16 sm:py-24 bg-white">
          <div className="max-w-2xl mx-auto px-4">
            <div className="rounded-3xl border border-red-200 bg-white p-8 shadow-sm">
              <h2 className="font-display text-2xl font-bold text-stone-900">Couldn&apos;t check that keyword</h2>
              <p className="mt-3 text-stone-600">{error}</p>
              <p className="mt-4">
                <button type="button" onClick={reset} className="font-semibold text-orange-700">
                  ← Check another keyword
                </button>
              </p>
            </div>
          </div>
        </section>
      )}

      {/* REPORT */}
      {!loading && data && (
        <>
          <section className="bg-white py-12 sm:py-16 border-t border-stone-100">
            <div className="max-w-4xl mx-auto px-4">
              <div className="text-center">
                <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-4">
                  Keyword Report
                </span>
                <p className="font-display text-2xl sm:text-4xl font-bold text-stone-900" style={{ wordBreak: "break-word" }}>
                  “{data.keyword}”
                </p>
                <p className="mt-3 text-sm text-stone-500">
                  Checked {new Date(data.checkedAt).toLocaleString()}
                  {data.serpSource ? <> · SERP sample: {data.serpSource}</> : null} ·{" "}
                  <button type="button" onClick={reset} className="font-semibold text-orange-700">
                    Check another keyword
                  </button>
                </p>
              </div>

              {data.serpError ? (
                <div className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
                  <strong>No difficulty score this time.</strong> {data.serpError}
                </div>
              ) : data.difficulty !== null ? (
                <>
                  <div className="grid gap-4 md:grid-cols-3 mt-8 text-left">
                    <div className="rounded-3xl border border-stone-200 bg-white p-6 text-center shadow-sm">
                      <div className={`font-display font-bold text-6xl ${tone(data.difficulty).text}`}>
                        {data.difficulty}
                      </div>
                      <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.15em] text-stone-500">
                        Difficulty · /100
                      </div>
                      <div className="mt-3 h-2 rounded-full bg-stone-100 overflow-hidden">
                        <div className={`h-full rounded-full ${tone(data.difficulty).bar}`} style={{ width: `${data.difficulty}%` }} />
                      </div>
                      <p className="mt-3 text-xs text-stone-500">Lower is easier. Built only from the SERP sample below.</p>
                    </div>
                    <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                      <div className="text-[11px] font-bold uppercase tracking-[0.15em] text-stone-500">Verdict</div>
                      <p className="mt-2 font-semibold text-stone-900 leading-relaxed">{data.verdict}</p>
                    </div>
                    <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                      <div className="text-[11px] font-bold uppercase tracking-[0.15em] text-stone-500">Search intent</div>
                      <p className="mt-2 font-display text-xl font-bold text-stone-900">{data.intent.label}</p>
                      <p className="mt-2 text-sm text-stone-600 leading-relaxed">{data.intent.rule}</p>
                    </div>
                  </div>

                  {/* BREAKDOWN */}
                  <h3 className="font-display text-2xl font-bold text-stone-900 mt-10">
                    How this difficulty score was calculated
                  </h3>
                  <p className="mt-2 text-stone-600">
                    Every point comes from the {data.serpResults.length} results actually fetched below — nothing is estimated.
                  </p>
                  <div className="mt-4 rounded-3xl border border-stone-200 bg-white px-6 py-2">
                    {data.difficultyFactors.map((f) => (
                      <div key={f.factor} className="py-4 border-b border-stone-100 last:border-0">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <span className="font-semibold text-stone-900">{f.factor}</span>
                          <span className="font-display font-bold text-stone-900">
                            +{f.points} <span className="text-stone-400 text-sm font-normal">/ {f.max}</span>
                          </span>
                        </div>
                        <div className="mt-2 h-1.5 rounded-full bg-stone-100 overflow-hidden">
                          <div className="h-full rounded-full bg-orange-500" style={{ width: `${f.max ? (f.points / f.max) * 100 : 0}%` }} />
                        </div>
                        <p className="mt-2 text-sm text-stone-500 leading-relaxed">{f.detail}</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : null}

              {/* DEMAND */}
              <h3 className="font-display text-2xl font-bold text-stone-900 mt-12">Demand signals (not fake volume)</h3>
              <div className="grid gap-4 md:grid-cols-3 mt-4 text-left">
                <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                  <div className="text-[11px] font-bold uppercase tracking-[0.15em] text-stone-500">Google Autocomplete</div>
                  <p className="mt-2 font-display text-xl font-bold text-stone-900">{demandLabel}</p>
                  <p className="mt-2 text-sm text-stone-600 leading-relaxed">
                    Google suggested {data.suggestions.length} real completion(s) for this exact keyword — a live demand
                    signal, not a volume estimate.
                  </p>
                </div>
                <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                  <div className="text-[11px] font-bold uppercase tracking-[0.15em] text-stone-500">Google Trends</div>
                  {data.trends.status === "ok" ? (
                    <p className="mt-2 text-sm text-stone-600 leading-relaxed">
                      <span className="font-display text-xl font-bold text-stone-900 block">
                        Interest index {data.trends.averageInterest}/100 · {data.trends.direction}
                      </span>
                      Average relative interest over the last 12 months (100 = this keyword&apos;s own peak in that period —
                      a relative index, not a search count).
                    </p>
                  ) : (
                    <p className="mt-2 font-semibold text-stone-900">{data.trends.note}</p>
                  )}
                </div>
                <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                  <div className="text-[11px] font-bold uppercase tracking-[0.15em] text-stone-500">Monthly search volume</div>
                  <p className="mt-2 font-display text-xl font-bold text-stone-900">Not shown — on purpose</p>
                  <p className="mt-2 text-sm text-stone-600 leading-relaxed">{data.volume.note}</p>
                </div>
              </div>
              {data.approxResultCount !== null && (
                <p className="mt-4 text-sm text-stone-500">
                  Competing pages reported by {data.serpSource}: about {data.approxResultCount.toLocaleString()}.
                </p>
              )}
              {data.suggestions.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {data.suggestions.map((s) => (
                    <span key={s} className="rounded-full bg-stone-100 border border-stone-200 px-3.5 py-1.5 text-[13px] font-medium text-stone-700">
                      {s}
                    </span>
                  ))}
                </div>
              )}

              {/* SERP TABLE */}
              {data.serpResults.length > 0 && (
                <>
                  <h3 className="font-display text-2xl font-bold text-stone-900 mt-12">
                    The SERP sample this report is based on
                  </h3>
                  <p className="mt-2 text-stone-600">
                    Top {data.serpResults.length} organic results from {data.serpSource}, fetched live just now.
                  </p>
                  <div className="mt-4 overflow-x-auto rounded-3xl border border-stone-200">
                    <table className="w-full text-sm text-left">
                      <thead>
                        <tr className="bg-stone-50">
                          <th className="px-5 py-3 font-bold text-stone-900">#</th>
                          <th className="px-5 py-3 font-bold text-stone-900">Result</th>
                          <th className="px-5 py-3 font-bold text-stone-900">Domain</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.serpResults.map((r) => (
                          <tr key={r.rank} className="border-t border-stone-100 align-top">
                            <td className="px-5 py-3 font-bold text-stone-500">{r.rank}</td>
                            <td className="px-5 py-3">
                              <a href={r.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-orange-800 hover:text-orange-600">
                                {r.title || r.url}
                              </a>
                              {r.snippet && <p className="mt-1 text-stone-500 leading-relaxed">{r.snippet.slice(0, 180)}</p>}
                            </td>
                            <td className="px-5 py-3 font-medium text-stone-700 whitespace-nowrap">{r.domain}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {/* RELATED */}
              {data.relatedKeywords.length > 0 && (
                <>
                  <h3 className="font-display text-2xl font-bold text-stone-900 mt-12">Related &amp; long-tail keywords</h3>
                  <p className="mt-2 text-stone-600">
                    Real Google Autocomplete expansions of this keyword — click one to check it instead.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {data.relatedKeywords.map((k) => (
                      <button
                        key={k}
                        type="button"
                        onClick={() => {
                          setInput(k);
                          void run(k);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="rounded-full bg-white border border-stone-300 px-3.5 py-1.5 text-[13px] font-semibold text-stone-700 hover:border-orange-400 hover:text-orange-700 transition"
                      >
                        {k}
                      </button>
                    ))}
                  </div>
                </>
              )}

              <div className="mt-12 rounded-3xl border border-stone-200 bg-stone-50 p-6 text-sm text-stone-600 leading-relaxed">
                <strong className="text-stone-900">Honest disclaimer:</strong> exact monthly search volume is
                paid-database data (Google Keyword Planner / Ahrefs / Semrush). This free tool never invents a
                volume number — it shows live SERP competition, a difficulty score with its full breakdown, and
                real demand signals instead.
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}
