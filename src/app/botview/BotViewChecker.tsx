"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { AuditResult, CategoryResult, Check } from "@/lib/botview-audit";
import { btnPrimary } from "@/components/ui";

function tone(score: number): { text: string; bar: string } {
  if (score >= 80) return { text: "text-green-600", bar: "bg-green-500" };
  if (score >= 50) return { text: "text-amber-500", bar: "bg-amber-400" };
  return { text: "text-red-500", bar: "bg-red-500" };
}

function ScoreCard({ label, score, big }: { label: string; score: number; big?: boolean }) {
  const t = tone(score);
  return (
    <div className="rounded-3xl border border-stone-200 bg-white p-6 text-center shadow-sm">
      <div className={`font-display font-bold ${t.text} ${big ? "text-6xl" : "text-5xl"}`}>
        {score}
      </div>
      <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.15em] text-stone-500">
        {label} · /100
      </div>
      <div className="mt-3 h-2 rounded-full bg-stone-100 overflow-hidden">
        <div className={`h-full rounded-full ${t.bar}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

function CheckRow({ c }: { c: Check }) {
  const icon = c.status === "pass" ? "✓" : c.status === "warn" ? "!" : "✗";
  const cls =
    c.status === "pass" ? "text-green-600" : c.status === "warn" ? "text-amber-500" : "text-red-500";
  return (
    <div className="flex gap-3 py-3 border-b border-stone-100 last:border-0">
      <div className={`font-bold w-5 flex-none text-center ${cls}`}>{icon}</div>
      <div>
        <span className="font-semibold text-stone-900">{c.name}</span>{" "}
        <span className="text-stone-500 text-sm">— {c.detail}</span>
        {c.status !== "pass" && c.fix ? (
          <div className="text-sm text-orange-800 mt-0.5">Fix: {c.fix}</div>
        ) : null}
      </div>
    </div>
  );
}

function Category({
  title,
  score,
  blurb,
  cat,
}: {
  title: string;
  score: number;
  blurb: string;
  cat: CategoryResult;
}) {
  return (
    <section className="py-12">
      <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900">
        {title} — <span className={tone(score).text}>{score}/100</span>
      </h2>
      <p className="mt-2 text-stone-600">{blurb}</p>
      <div className="mt-4 rounded-3xl border border-stone-200 bg-white px-6 py-2">
        {cat.checks.map((c) => (
          <CheckRow key={c.name} c={c} />
        ))}
      </div>
    </section>
  );
}

export default function BotViewChecker({ initialUrl = "" }: { initialUrl?: string }) {
  const [input, setInput] = useState(initialUrl);
  const [data, setData] = useState<AuditResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkedUrl, setCheckedUrl] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const run = useCallback(async (raw: string) => {
    const url = raw.trim();
    if (!url) return;
    setLoading(true);
    setError(null);
    setData(null);
    setCheckedUrl(url);
    try {
      const res = await fetch(`/api/botview-audit?url=${encodeURIComponent(url)}`);
      const json = (await res.json()) as AuditResult;
      if (json.error) setError(json.error);
      else setData(json);
    } catch {
      setError("Could not run the audit — network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialUrl) void run(initialUrl);
  }, [initialUrl, run]);

  function reset() {
    setData(null);
    setError(null);
    setInput("");
    setCheckedUrl("");
    inputRef.current?.focus();
    inputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  const botEntries = data ? Object.entries(data.aiBots) : [];

  return (
    <>
      {/* FORM (sits in the hero flow) */}
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
              name="url"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="https://your-website.com"
              required
              autoComplete="url"
              inputMode="url"
              className="flex-1 rounded-full border border-stone-300 bg-white px-6 py-3.5 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
            />
            <button type="submit" disabled={loading} className={`${btnPrimary} justify-center disabled:opacity-60`}>
              {loading ? "Checking…" : "Check my site →"}
            </button>
          </form>
          <div className="mt-6 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-stone-600">
            <span>
              Try:{" "}
              <button
                type="button"
                className="font-semibold text-orange-700"
                onClick={() => {
                  setInput("https://frinjo.me");
                  void run("https://frinjo.me");
                }}
              >
                frinjo.me
              </button>
            </span>
            <span>
              <button
                type="button"
                className="font-semibold text-orange-700"
                onClick={() => {
                  setInput("https://igaf.me");
                  void run("https://igaf.me");
                }}
              >
                igaf.me
              </button>
            </span>
            <span>
              <button
                type="button"
                className="font-semibold text-orange-700"
                onClick={() => {
                  setInput("https://example.com");
                  void run("https://example.com");
                }}
              >
                example.com
              </button>
            </span>
          </div>
        </div>
      </section>

      {/* LOADING */}
      {loading && (
        <section className="py-16 sm:py-24 bg-white">
          <div className="max-w-2xl mx-auto px-4 text-center text-stone-500 text-lg">
            🔍 Auditing <span className="font-semibold text-stone-800">{checkedUrl}</span> —
            fetching the page, robots.txt, sitemap and llms.txt…
          </div>
        </section>
      )}

      {/* ERROR */}
      {!loading && error && (
        <section className="py-16 sm:py-24 bg-white">
          <div className="max-w-2xl mx-auto px-4">
            <div className="rounded-3xl border border-red-200 bg-white p-8 shadow-sm">
              <h2 className="font-display text-2xl font-bold text-stone-900">
                Couldn&apos;t check that URL
              </h2>
              <p className="mt-3 text-stone-600">{error}</p>
              <p className="mt-4">
                <button type="button" onClick={reset} className="font-semibold text-orange-700">
                  ← Check another URL
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
            <div className="max-w-4xl mx-auto px-4 text-center">
              <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-4">
                BotView Report
              </span>
              <p
                className="font-display text-2xl sm:text-4xl font-bold text-stone-900"
                style={{ wordBreak: "break-all" }}
              >
                {data.finalUrl}
              </p>
              <p className="mt-3 text-sm text-stone-500">
                Checked {new Date(data.fetchedAt).toLocaleString()} ·{" "}
                <button type="button" onClick={reset} className="font-semibold text-orange-700">
                  Check another URL
                </button>
              </p>
              <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mt-8 text-left">
                <ScoreCard label="Overall" score={data.scores.overall} big />
                <ScoreCard label="SEO" score={data.scores.seo} />
                <ScoreCard label="AEO" score={data.scores.aeo} />
                <ScoreCard label="GEO · AI visibility" score={data.scores.geo} />
              </div>
            </div>
          </section>

          <div className="max-w-4xl mx-auto px-4 divide-y divide-stone-100">
            <Category
              title="SEO"
              score={data.scores.seo}
              blurb="Technical basics: can search engines crawl, index and rank this page?"
              cat={data.categories.seo}
            />
            <Category
              title="AEO"
              score={data.scores.aeo}
              blurb="Answer readiness: is the content shaped so an engine can quote it as the answer?"
              cat={data.categories.aeo}
            />
            <Category
              title="GEO — AI visibility"
              score={data.scores.geo}
              blurb="The BotView original: can ChatGPT, Claude and Perplexity read and cite this site?"
              cat={data.categories.geo}
            />

            {botEntries.length > 0 && (
              <section className="py-12">
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900">
                  AI crawler access
                </h2>
                <p className="mt-2 text-stone-600">What this site&apos;s robots.txt tells each AI crawler:</p>
                <div className="mt-4 overflow-x-auto rounded-3xl border border-stone-200">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-stone-50 text-left">
                        <th className="px-5 py-3 font-bold text-stone-900">Crawler</th>
                        <th className="px-5 py-3 font-bold text-stone-900">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {botEntries.map(([bot, verdict]) => (
                        <tr key={bot} className="border-t border-stone-100">
                          <td className="px-5 py-2.5 font-medium text-stone-800">{bot}</td>
                          <td
                            className={`px-5 py-2.5 font-semibold ${
                              verdict === "blocked" ? "text-red-500" : "text-green-600"
                            }`}
                          >
                            {verdict}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {data.schemaTypes.length > 0 && (
                  <p className="mt-4 text-stone-600">
                    Structured data found:{" "}
                    <strong className="text-stone-900">{data.schemaTypes.join(", ")}</strong>
                  </p>
                )}
              </section>
            )}
          </div>
        </>
      )}
    </>
  );
}
