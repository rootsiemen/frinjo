"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { btnPrimary, btnOutline } from "@/components/ui";

const inputCls =
  "w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200";
const areaCls =
  "w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 font-mono text-sm leading-relaxed";
const labelCls = "block text-[11px] font-bold uppercase tracking-[0.15em] text-stone-500 mb-2";

function SectionShell({
  id,
  eyebrow,
  title,
  sub,
  children,
  dark = false,
}: {
  id: string;
  eyebrow: string;
  title: string;
  sub: string;
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <section id={id} className={`py-14 sm:py-16 scroll-mt-24 ${dark ? "bg-stone-50" : "bg-white"} border-t border-stone-100`}>
      <div className="max-w-4xl mx-auto px-4">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700 mb-2">{eyebrow}</p>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-stone-900">{title}</h2>
        <p className="mt-3 text-stone-600 leading-relaxed max-w-2xl">{sub}</p>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}

async function copyText(text: string, done: () => void) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  }
  done();
}

/* ============================ ads.txt Generator ============================ */

const GOOGLE_CERT = "f08c47fec0942fa0";

function AdsTxtGenerator() {
  const [pub, setPub] = useState("");
  const [extra, setExtra] = useState("");
  const [copied, setCopied] = useState(false);

  const digits = pub.replace(/[^0-9]/g, "");
  const valid = digits.length >= 10;
  const googleLine = valid ? `google.com, pub-${digits}, DIRECT, ${GOOGLE_CERT}` : "";
  const fileText = [googleLine, ...extra.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)]
    .filter(Boolean)
    .join("\n");

  function download() {
    const blob = new Blob([fileText + "\n"], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "ads.txt";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <SectionShell
      id="adstxt-generator"
      eyebrow="Tool 7 · ads.txt Generator"
      title="ads.txt Generator"
      sub="Type your publisher ID and get the exact ads.txt file Google expects at your domain root — the Google seller line with the correct certification ID, plus any extra seller lines you add."
    >
      <label className={labelCls} htmlFor="gen-pub">
        Your publisher ID (pub-…, from your AdSense account)
      </label>
      <input
        id="gen-pub"
        type="text"
        value={pub}
        onChange={(e) => setPub(e.target.value)}
        placeholder="pub-1234567890123456"
        autoComplete="off"
        className={inputCls}
      />
      <label className={`${labelCls} mt-5`} htmlFor="gen-extra">
        Extra seller lines (optional — one per line, e.g. other networks)
      </label>
      <textarea
        id="gen-extra"
        value={extra}
        onChange={(e) => setExtra(e.target.value)}
        placeholder={"appnexus.com, 1234, RESELLER, f5ab79cb980f11d1"}
        rows={3}
        className={areaCls}
      />
      {valid ? (
        <div className="mt-5">
          <p className={labelCls}>Your ads.txt</p>
          <pre className="rounded-2xl bg-stone-950 text-orange-200 px-5 py-4 overflow-x-auto text-sm leading-relaxed">{fileText}</pre>
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" className={btnPrimary} onClick={() => void copyText(fileText, () => {
              setCopied(true);
              window.setTimeout(() => setCopied(false), 2500);
            })}>
              {copied ? "Copied ✓" : "Copy ads.txt"}
            </button>
            <button type="button" className={btnOutline} onClick={download}>
              Download ads.txt
            </button>
          </div>
          <p className="mt-3 text-sm text-stone-500">
            Upload this file, unchanged, to <strong>https://yourdomain.com/ads.txt</strong> — the root of the
            domain, not a subfolder — then re-run the ads.txt Checker above to confirm it is live.
          </p>
        </div>
      ) : (
        <p className="mt-4 text-sm text-stone-500">
          {pub.trim()
            ? "That publisher ID looks short — AdSense IDs are pub- followed by 16 digits. Find yours in AdSense under Account → Settings → Account information."
            : "Your generated file will appear here as soon as you enter a publisher ID."}
        </p>
      )}
    </SectionShell>
  );
}

/* ====================== Low Value Checker (by URL) ======================== */

interface LvMetrics {
  words: number;
  headings: number;
  paragraphs: number;
  images: number;
  internalLinks: number;
  externalLinks: number;
  hasList: boolean;
  hasTable: boolean;
  hasFaq: boolean;
}

function lvScore(m: LvMetrics): { risk: number; band: string; fixes: string[] } {
  let q = 0;
  q += m.words >= 1600 ? 30 : m.words >= 1500 ? 27 : m.words >= 1200 ? 20 : m.words >= 800 ? 12 : m.words >= 400 ? 6 : m.words > 0 ? 2 : 0;
  q += m.headings >= 6 ? 15 : m.headings >= 4 ? 10 : m.headings >= 2 ? 5 : m.headings === 1 ? 2 : 0;
  q += m.hasFaq ? 10 : 0;
  q += m.images >= 3 ? 10 : m.images >= 1 ? 5 : 0;
  q += m.internalLinks >= 3 ? 10 : m.internalLinks >= 1 ? 5 : 0;
  q += m.hasList && m.hasTable ? 10 : m.hasList || m.hasTable ? 6 : 0;
  q += m.externalLinks >= 1 ? 5 : 0;
  const quality = Math.round((q / 90) * 100);
  const risk = 100 - quality;
  const fixes: string[] = [];
  if (m.words < 1500) fixes.push(`Add ${(1600 - m.words).toLocaleString()} more words to reach the 1,600-word working target (1,500 minimum).`);
  if (m.headings < 6) fixes.push(`Add ${6 - m.headings} more H2/H3 sections — one idea per section.`);
  if (!m.hasFaq) fixes.push("Add an FAQ block with 4–6 real reader questions, answered in 2–4 sentences each.");
  if (m.images < 3) fixes.push(`Add ${3 - m.images} more images — screenshots, diagrams or photos you have the rights to use.`);
  if (m.internalLinks < 3) fixes.push(`Add ${3 - m.internalLinks} more internal links to related pages on the same site.`);
  if (!(m.hasList && m.hasTable)) fixes.push(`Add ${m.hasList ? "a comparison table" : m.hasTable ? "a bullet or numbered list" : "a bullet list and a comparison table"}.`);
  return { risk, band: risk <= 25 ? "Low risk" : risk <= 55 ? "Medium risk" : "High risk", fixes };
}

function LowValueByUrl() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<{ finalUrl: string; title: string; metrics: LvMetrics } | null>(null);
  const scored = useMemo(() => (data ? lvScore(data.metrics) : null), [data]);

  async function run() {
    const u = url.trim();
    if (!u || loading) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/low-value-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: u }),
      });
      const d = (await res.json()) as { error?: string; finalUrl?: string; title?: string; metrics?: LvMetrics };
      if (!res.ok || d.error || !d.metrics) {
        setError(d.error ?? "The check failed. Please try again.");
        return;
      }
      setData({ finalUrl: d.finalUrl ?? u, title: d.title ?? "", metrics: d.metrics });
    } catch {
      setError("The check failed — the page could not be fetched. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SectionShell
      id="low-value-checker"
      eyebrow="Tool 8 · Low Value Content"
      title="Low Value Content Checker — by URL"
      sub="Point it at any published article: it fetches the live page and scores its real numbers — words, sections, images, links, FAQ — against the thin-content patterns behind “low value content” rejections."
      dark
    >
      <form
        className="flex flex-col sm:flex-row gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          void run();
        }}
      >
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://yoursite.com/your-article"
          autoComplete="off"
          aria-label="Article URL"
          className={`${inputCls} flex-1`}
        />
        <button type="submit" disabled={loading} className={`${btnPrimary} justify-center disabled:opacity-60`}>
          {loading ? "Fetching page…" : "Check article →"}
        </button>
      </form>
      {error && (
        <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>
      )}
      {data && scored && (
        <div className="mt-7">
          <p className="text-sm text-stone-500 mb-4">
            Audited:{" "}
            <a href={data.finalUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-orange-700 hover:text-orange-800 break-all">
              {data.title || data.finalUrl}
            </a>
          </p>
          <div className="grid gap-4 md:grid-cols-3 text-left">
            <div className="rounded-3xl border border-stone-200 bg-white p-6 text-center shadow-sm">
              <div className={`font-display font-bold text-6xl ${scored.risk <= 25 ? "text-green-600" : scored.risk <= 55 ? "text-amber-500" : "text-red-500"}`}>
                {scored.risk}
              </div>
              <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.15em] text-stone-500">Low Value Risk · /100</div>
              <p className="mt-2 text-xs text-stone-500">{scored.band} — lower is safer.</p>
            </div>
            <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm md:col-span-2">
              <ul className="space-y-1.5 text-sm text-stone-700">
                <li>Words: <strong>{data.metrics.words.toLocaleString()}</strong> / 1,500 · Sections (H2/H3): <strong>{data.metrics.headings}</strong> / 6</li>
                <li>Images: <strong>{data.metrics.images}</strong> / 3 · Internal links: <strong>{data.metrics.internalLinks}</strong> / 3 · External: <strong>{data.metrics.externalLinks}</strong></li>
                <li>FAQ: <strong>{data.metrics.hasFaq ? "Yes" : "No"}</strong> · List: <strong>{data.metrics.hasList ? "Yes" : "No"}</strong> · Table: <strong>{data.metrics.hasTable ? "Yes" : "No"}</strong> · Paragraphs: <strong>{data.metrics.paragraphs}</strong></li>
              </ul>
              {scored.fixes.length > 0 ? (
                <ul className="mt-4 space-y-1.5 text-sm text-stone-600 list-disc pl-5">
                  {scored.fixes.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-green-700 font-medium">No gaps on the measured signals — this page clears every low-value check.</p>
              )}
              <p className="mt-4 text-sm">
                Need the full audit with duplicate-similarity and the guided article creator?{" "}
                <Link href="/adsense-low-value-content-checker" className="font-semibold text-orange-700 hover:text-orange-800">
                  Open the full Low Value Content Checker →
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </SectionShell>
  );
}

/* ========================= Earnings Calculator ============================ */

const NICHES: [string, string][] = [
  ["Insurance", "$30–$55"],
  ["Finance & investing", "$25–$45"],
  ["Legal", "$20–$40"],
  ["Software / SaaS / tech", "$12–$25"],
  ["Health & wellness", "$10–$20"],
  ["Education & careers", "$8–$18"],
  ["Travel", "$6–$14"],
  ["Food & recipes", "$5–$12"],
  ["Entertainment", "$2–$6"],
  ["Gaming", "$1.50–$5"],
];

function money(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: n < 100 ? 2 : 0 });
}

function EarningsCalculator() {
  const [mode, setMode] = useState<"rpm" | "cpc">("rpm");
  const [pageviews, setPageviews] = useState("50000");
  const [rpm, setRpm] = useState("12");
  const [cpc, setCpc] = useState("0.35");
  const [ctr, setCtr] = useState("1.2");

  const pv = Math.max(0, Number(pageviews) || 0);
  const monthly = useMemo(() => {
    if (mode === "rpm") return (pv / 1000) * (Number(rpm) || 0);
    return pv * ((Number(ctr) || 0) / 100) * (Number(cpc) || 0);
  }, [mode, pv, rpm, cpc, ctr]);

  const numCls = `${inputCls} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`;

  return (
    <SectionShell
      id="earnings-calculator"
      eyebrow="Tool 9 · Earnings Calculator"
      title="AdSense Earnings Calculator"
      sub="Estimate earnings from monthly pageviews — by page RPM, or by CPC and CTR if you think in clicks. An estimate for planning, not a promise: real RPM moves with niche, country mix and season."
    >
      <div className="flex gap-2 mb-6">
        {(
          [
            ["rpm", "Pageviews × RPM"],
            ["cpc", "CPC × CTR"],
          ] as const
        ).map(([m, label]) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`rounded-full px-5 py-2.5 font-semibold transition ${mode === m ? "bg-orange-600 text-white shadow-md" : "bg-white border border-stone-300 text-stone-700 hover:border-orange-300"}`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-3 text-left">
        <div>
          <label className={labelCls} htmlFor="earn-pv">Monthly pageviews</label>
          <input id="earn-pv" type="number" min="0" value={pageviews} onChange={(e) => setPageviews(e.target.value)} className={numCls} />
        </div>
        {mode === "rpm" ? (
          <div>
            <label className={labelCls} htmlFor="earn-rpm">Page RPM ($ per 1,000 views)</label>
            <input id="earn-rpm" type="number" min="0" step="0.5" value={rpm} onChange={(e) => setRpm(e.target.value)} className={numCls} />
          </div>
        ) : (
          <>
            <div>
              <label className={labelCls} htmlFor="earn-cpc">Average CPC ($ per click)</label>
              <input id="earn-cpc" type="number" min="0" step="0.05" value={cpc} onChange={(e) => setCpc(e.target.value)} className={numCls} />
            </div>
            <div>
              <label className={labelCls} htmlFor="earn-ctr">Page CTR (%)</label>
              <input id="earn-ctr" type="number" min="0" step="0.1" value={ctr} onChange={(e) => setCtr(e.target.value)} className={numCls} />
            </div>
          </>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3 mt-7 text-left">
        {[
          ["Per day", monthly / 30],
          ["Per month", monthly],
          ["Per year", monthly * 12],
        ].map(([label, v]) => (
          <div key={label as string} className="rounded-3xl border border-stone-200 bg-white p-6 text-center shadow-sm">
            <div className="font-display font-bold text-4xl text-stone-900">{money(v as number)}</div>
            <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.15em] text-stone-500">{label}</div>
          </div>
        ))}
      </div>
      {mode === "cpc" && (
        <p className="mt-3 text-sm text-stone-500">
          That is roughly <strong>{Math.round(pv * ((Number(ctr) || 0) / 100)).toLocaleString()}</strong> ad clicks a month
          at a <strong>${pv > 0 ? (monthly / pv * 1000).toFixed(2) : "0.00"}</strong> effective page RPM.
        </p>
      )}

      <h3 className="font-display text-xl font-bold text-stone-900 mt-10">Typical page RPM by niche (rough ranges)</h3>
      <p className="mt-2 text-sm text-stone-500 max-w-2xl">
        US/UK-heavy traffic sits at the top of each range; mostly South-Asian or African traffic can be a
        third of it. Use these to sanity-check your RPM input, not as a quote.
      </p>
      <div className="mt-4 overflow-hidden rounded-3xl border border-stone-200">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-stone-950 text-white">
              <th className="px-5 py-3 font-semibold">Niche</th>
              <th className="px-5 py-3 font-semibold">Typical page RPM</th>
            </tr>
          </thead>
          <tbody>
            {NICHES.map(([n, r], i) => (
              <tr key={n} className={i % 2 ? "bg-stone-50" : "bg-white"}>
                <td className="px-5 py-2.5 text-stone-800">{n}</td>
                <td className="px-5 py-2.5 font-semibold text-stone-900">{r}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionShell>
  );
}

export default function MoreAdsenseTools() {
  return (
    <>
      <AdsTxtGenerator />
      <LowValueByUrl />
      <EarningsCalculator />
    </>
  );
}
