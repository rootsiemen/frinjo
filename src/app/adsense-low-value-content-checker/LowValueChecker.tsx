"use client";

import { useMemo, useState } from "react";
import { btnPrimary, btnOutline } from "@/components/ui";

/* ---------------------------------- helpers --------------------------------- */

function stripMarkup(raw: string): string {
  return raw
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*`_~|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function countWords(text: string): number {
  const clean = stripMarkup(text);
  if (!clean) return 0;
  return clean.split(/\s+/).filter(Boolean).length;
}

function wordList(text: string): string[] {
  const clean = stripMarkup(text).toLowerCase();
  if (!clean) return [];
  return clean.split(/\s+/).filter(Boolean);
}

function shingleSet(words: string[], size = 3): Set<string> {
  const set = new Set<string>();
  for (let i = 0; i + size <= words.length; i++) {
    set.add(words.slice(i, i + size).join(" "));
  }
  return set;
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  for (const s of a) if (b.has(s)) inter++;
  const union = a.size + b.size - inter;
  return union === 0 ? 0 : inter / union;
}

interface Analysis {
  words: number;
  headings: number;
  paragraphs: number;
  images: number;
  internalLinks: number;
  externalLinks: number;
  hasList: boolean;
  hasTable: boolean;
  hasFaq: boolean;
  keywordCount: number;
  keywordDensity: number | null;
  similarity: number | null;
  quality: number;
  risk: number;
  band: "Low risk" | "Medium risk" | "High risk";
}

interface FixItem {
  ok: boolean;
  label: string;
  detail: string;
}

const WORD_MIN = 1500;
const WORD_TARGET = 1600;
const SECTION_TARGET = 6;
const IMAGE_TARGET = 3;
const INTERNAL_TARGET = 3;

function analyze(article: string, compare: string, keyword: string): { a: Analysis; fixes: FixItem[] } {
  const raw = article;
  const words = countWords(raw);

  const htmlHeadings = (raw.match(/<h[1-6][^>]*>/gi) ?? []).length;
  const mdHeadings = raw
    .split(/\n/)
    .filter((l) => /^\s{0,3}#{1,6}\s+\S/.test(l) || /^\s*\*\*[^*]{3,80}\*\*\s*$/.test(l)).length;
  const headings = Math.max(htmlHeadings, mdHeadings);

  const htmlParas = (raw.match(/<p[\s>]/gi) ?? []).length;
  const textParas = stripMarkup(raw)
    ? raw.split(/\n\s*\n/).filter((b) => countWords(b) >= 3).length
    : 0;
  const paragraphs = Math.max(htmlParas, textParas);

  const images = (raw.match(/<img[\s>]/gi) ?? []).length + (raw.match(/!\[[^\]]*\]\(/g) ?? []).length;

  const hrefs: string[] = [];
  for (const m of raw.matchAll(/<a\s[^>]*href\s*=\s*["']([^"']+)["']/gi)) hrefs.push(m[1]);
  for (const m of raw.matchAll(/\[[^\]]*\]\(([^)\s]+)[^)]*\)/g)) hrefs.push(m[1]);
  let internalLinks = 0;
  let externalLinks = 0;
  for (const h of hrefs) {
    if (/^https?:\/\//i.test(h)) externalLinks++;
    else internalLinks++;
  }

  const hasList =
    /<li[\s>]/i.test(raw) || raw.split(/\n/).some((l) => /^\s*([-*•]|\d+[.)])\s+\S/.test(l));
  const hasTable = /<table[\s>]/i.test(raw) || /^\s*\|.+\|\s*$/m.test(raw);
  const questionLines = raw.split(/\n/).filter((l) => l.trim().endsWith("?")).length;
  const hasFaq = /frequently asked questions/i.test(raw) || /\bfaq\b/i.test(raw) || questionLines >= 2;

  const kw = keyword.trim().toLowerCase();
  let keywordCount = 0;
  let keywordDensity: number | null = null;
  if (kw) {
    const hay = stripMarkup(raw).toLowerCase();
    if (hay) keywordCount = hay.split(kw).length - 1;
    keywordDensity = words > 0 ? (keywordCount / words) * 100 : 0;
  }

  let similarity: number | null = null;
  if (compare.trim()) {
    similarity = Math.round(jaccard(shingleSet(wordList(raw)), shingleSet(wordList(compare))) * 100);
  }

  /* Quality score out of 100 — keyword part is re-scaled out when no keyword is given. */
  let quality = 0;
  let scoredMax = 90;
  quality += words >= WORD_TARGET ? 30 : words >= WORD_MIN ? 27 : words >= 1200 ? 20 : words >= 800 ? 12 : words >= 400 ? 6 : words > 0 ? 2 : 0;
  quality += headings >= SECTION_TARGET ? 15 : headings >= 4 ? 10 : headings >= 2 ? 5 : headings === 1 ? 2 : 0;
  quality += hasFaq ? 10 : 0;
  quality += images >= IMAGE_TARGET ? 10 : images >= 1 ? 5 : 0;
  quality += internalLinks >= INTERNAL_TARGET ? 10 : internalLinks >= 1 ? 5 : 0;
  quality += hasList && hasTable ? 10 : hasList || hasTable ? 6 : 0;
  quality += externalLinks >= 1 ? 5 : 0;
  if (kw) {
    scoredMax = 100;
    const d = keywordDensity ?? 0;
    quality += keywordCount === 0 ? 0 : d >= 0.3 && d <= 2.5 ? 10 : 5;
  }
  let q = scoredMax > 0 ? (quality / scoredMax) * 100 : 0;
  if (similarity !== null && similarity > 30) {
    q -= ((similarity - 30) / 70) * 25;
  }
  q = Math.max(0, Math.min(100, Math.round(q)));
  const risk = 100 - q;
  const band: Analysis["band"] = risk <= 25 ? "Low risk" : risk <= 55 ? "Medium risk" : "High risk";

  const fixes: FixItem[] = [
    {
      ok: words >= WORD_MIN,
      label: `Word count: ${words.toLocaleString()} words`,
      detail:
        words >= WORD_MIN
          ? `Above the ${WORD_MIN.toLocaleString()}-word minimum thin-content line.`
          : `Add ${(WORD_TARGET - words).toLocaleString()} more words to reach ${WORD_TARGET.toLocaleString()} (the ${WORD_MIN.toLocaleString()} minimum plus a safety margin) — expand sections with examples, steps and data, never filler.`,
    },
    {
      ok: headings >= SECTION_TARGET,
      label: `Sections / headings: ${headings}`,
      detail:
        headings >= SECTION_TARGET
          ? "Enough sections for a complete, scannable article."
          : `Add ${SECTION_TARGET - headings} more section${SECTION_TARGET - headings === 1 ? "" : "s"} with real sub-headings (H2/H3) — one idea per section. Markdown (##) and HTML headings both count.`,
    },
    {
      ok: hasFaq,
      label: hasFaq ? "FAQ section found" : "No FAQ section found",
      detail: hasFaq
        ? "Questions-and-answers content is a strong originality and usefulness signal."
        : "Add an FAQ block with 4–6 real questions readers ask about this topic, each answered in 2–4 sentences.",
    },
    {
      ok: images >= IMAGE_TARGET,
      label: `Images: ${images}`,
      detail:
        images >= IMAGE_TARGET
          ? "Enough visual content for a rich page."
          : `Add ${IMAGE_TARGET - images} more image${IMAGE_TARGET - images === 1 ? "" : "s"} — screenshots, diagrams or photos you made or have the rights to use.`,
    },
    {
      ok: internalLinks >= INTERNAL_TARGET,
      label: `Internal links: ${internalLinks} (external: ${externalLinks})`,
      detail:
        internalLinks >= INTERNAL_TARGET
          ? "The article connects into the rest of the site."
          : `Add ${INTERNAL_TARGET - internalLinks} more internal link${INTERNAL_TARGET - internalLinks === 1 ? "" : "s"} to related pages on the same site (relative links like /your-other-page count as internal).`,
    },
    {
      ok: hasList && hasTable,
      label: hasList || hasTable ? "Lists / tables: partial" : "No list or table found",
      detail:
        hasList && hasTable
          ? "Structured content (lists and tables) is present."
          : `Add ${hasList ? "a comparison table" : hasTable ? "a bullet or numbered list" : "a bullet list and a comparison table"} — structured content is hard to mistake for thin filler.`,
    },
  ];
  if (kw) {
    fixes.push({
      ok: keywordCount > 0 && (keywordDensity ?? 0) >= 0.3 && (keywordDensity ?? 0) <= 2.5,
      label:
        keywordCount === 0
          ? `Keyword “${keyword.trim()}” not found`
          : `Keyword density: ${(keywordDensity ?? 0).toFixed(2)}% (${keywordCount} mentions)`,
      detail:
        keywordCount === 0
          ? "The target keyword never appears — the page cannot signal what it is about. Use it naturally in the title, intro, one heading and the body."
          : (keywordDensity ?? 0) > 2.5
            ? "Density is high enough to look stuffed. Rewrite repeats into synonyms and supporting terms."
            : (keywordDensity ?? 0) < 0.3
              ? "Density is very low. Weave the keyword naturally into the intro, a heading or two and the conclusion."
              : "Keyword usage is in the natural range.",
    });
  }
  if (similarity !== null) {
    fixes.push({
      ok: similarity <= 30,
      label: `Duplicate similarity vs comparison article: ${similarity}%`,
      detail:
        similarity <= 30
          ? "Low overlap — the two articles read as separate pieces."
          : "High 3-word-phrase overlap is the classic near-duplicate trigger (same template, swapped keyword). Rewrite the shared sections with different structure, examples and data.",
    });
  }

  return {
    a: {
      words,
      headings,
      paragraphs,
      images,
      internalLinks,
      externalLinks,
      hasList,
      hasTable,
      hasFaq,
      keywordCount,
      keywordDensity,
      similarity,
      quality: q,
      risk,
      band,
    },
    fixes,
  };
}

function riskTone(risk: number): { text: string; bar: string; chip: string } {
  if (risk <= 25) return { text: "text-green-600", bar: "bg-green-500", chip: "bg-green-600" };
  if (risk <= 55) return { text: "text-amber-500", bar: "bg-amber-400", chip: "bg-amber-500" };
  return { text: "text-red-500", bar: "bg-red-500", chip: "bg-red-600" };
}

const THIN_SAMPLE = `How to Make Money Online

Making money online is easy and anyone can do it. There are many ways to earn money from home. You just need a laptop and internet.

Some popular ways are freelancing, blogging and watching videos. Many people earn a lot of money this way.

Start today and you can be rich soon. Follow these tips and success will come. Good luck!`;


/* ---------------------------------- creator --------------------------------- */

interface ScaffoldSection {
  heading: string;
  prompt: string;
}

interface Scaffold {
  titles: string[];
  sections: ScaffoldSection[];
  faqQuestions: string[];
  tableTemplate: string;
}

function titleCase(s: string): string {
  const t = s.trim();
  return t ? t.charAt(0).toUpperCase() + t.slice(1) : t;
}

function buildScaffold(keyword: string): Scaffold {
  const kw = keyword.trim();
  const Kw = titleCase(kw);
  const year = new Date().getFullYear();
  return {
    titles: [
      `${Kw}: The Complete Guide (${year})`,
      `${Kw} Explained: How It Works, Benefits and Costs`,
      `What Is ${Kw}? A Beginner-Friendly Breakdown With Examples`,
    ],
    sections: [
      {
        heading: `What Is ${Kw}?`,
        prompt: `Define ${kw} in plain words in the first two sentences. Say who it is for, what problem it solves, and one thing most beginners misunderstand about it.`,
      },
      {
        heading: `Why ${Kw} Matters`,
        prompt: `Give 3–4 concrete benefits of ${kw}, each with a real example or number. If there is a cost or downside, name it honestly — balanced content reads as original, not sales copy.`,
      },
      {
        heading: `How ${Kw} Works — Step by Step`,
        prompt: `Walk through ${kw} as numbered steps a beginner can follow today. Add a practical tip or a common pitfall under at least two of the steps.`,
      },
      {
        heading: `${Kw}: Pros, Cons and Costs`,
        prompt: `Summarise the honest pros and cons of ${kw} and what it typically costs (money, time or effort). Then fill in the comparison table below from what you wrote here.`,
      },
      {
        heading: `Common Mistakes to Avoid With ${Kw}`,
        prompt: `List 3–5 mistakes people make with ${kw}, what each one costs them, and what to do instead. Specific, experience-based detail is exactly what thin content never has.`,
      },
      {
        heading: `${Kw} Examples and Best Practices`,
        prompt: `Give 2–3 worked examples of ${kw} done well, then close the section with a short best-practice checklist a reader can copy.`,
      },
    ],
    faqQuestions: [
      `What is ${kw} in simple words?`,
      `How much does ${kw} cost?`,
      `Is ${kw} worth it for beginners?`,
      `How long does ${kw} take to show results?`,
      `What are the best alternatives to ${kw}?`,
    ],
    tableTemplate: `| Feature | ${Kw} | Alternative |\n| --- | --- | --- |\n| Cost |  |  |\n| Best for |  |  |\n| Ease of use |  |  |\n| Main drawback |  |  |`,
  };
}

function mdTableToHtml(md: string): string {
  const rows = md
    .split(/\n/)
    .map((l) => l.trim())
    .filter((l) => l.startsWith("|") && l.endsWith("|"))
    .filter((l) => !/^\|[\s:|-]+\|$/.test(l));
  if (rows.length === 0) return "";
  const cells = (row: string) => row.slice(1, -1).split("|").map((c) => c.trim());
  const [head, ...body] = rows;
  const thead = `<tr>${cells(head).map((c) => `<th>${c}</th>`).join("")}</tr>`;
  const tbody = body.map((r) => `<tr>${cells(r).map((c) => `<td>${c}</td>`).join("")}</tr>`).join("");
  return `<table>\n<thead>${thead}</thead>\n<tbody>${tbody}</tbody>\n</table>`;
}

function paras(text: string): string[] {
  return text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
}

/* --------------------------------- component -------------------------------- */

const inputCls =
  "w-full rounded-full border border-stone-300 bg-white px-6 py-3.5 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200";
const areaCls =
  "w-full rounded-3xl border border-stone-300 bg-white px-5 py-4 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 leading-relaxed";
const labelCls = "block text-[11px] font-bold uppercase tracking-[0.15em] text-stone-500 mb-2";

interface FetchedPage {
  finalUrl: string;
  title: string;
  html: string;
}

export default function LowValueChecker() {
  const [mode, setMode] = useState<"auditor" | "creator">("auditor");

  /* auditor state */
  const [article, setArticle] = useState("");
  const [compare, setCompare] = useState("");
  const [keyword, setKeyword] = useState("");
  const [url, setUrl] = useState("");
  const [checking, setChecking] = useState(false);
  const [checkError, setCheckError] = useState("");
  const [fetched, setFetched] = useState<FetchedPage | null>(null);

  // A fetched page (by URL) is scored through the exact same analyze()
  // pipeline as pasted text — the API returns the page HTML normalised so
  // the numbers are the page's real published numbers.
  const result = useMemo(() => {
    if (fetched) return analyze(fetched.html, compare, keyword);
    return article.trim() ? analyze(article, compare, keyword) : null;
  }, [fetched, article, compare, keyword]);

  async function checkUrl() {
    const u = url.trim();
    if (!u || checking) return;
    setChecking(true);
    setCheckError("");
    try {
      const res = await fetch("/api/low-value-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: u }),
      });
      const data = (await res.json()) as {
        error?: string;
        finalUrl?: string;
        title?: string;
        html?: string;
      };
      if (!res.ok || data.error || !data.html) {
        setCheckError(data.error ?? "The check failed. Please try again.");
        return;
      }
      setFetched({ finalUrl: data.finalUrl ?? u, title: data.title ?? "", html: data.html });
    } catch {
      setCheckError("The check failed — the page could not be fetched. Please try again.");
    } finally {
      setChecking(false);
    }
  }

  /* creator state */
  const [cKeyword, setCKeyword] = useState("");
  const [scaffold, setScaffold] = useState<Scaffold | null>(null);
  const [titleIdx, setTitleIdx] = useState(0);
  const [intro, setIntro] = useState("");
  const [sectionTexts, setSectionTexts] = useState<string[]>([]);
  const [tableText, setTableText] = useState("");
  const [faqAnswers, setFaqAnswers] = useState<string[]>([]);
  const [conclusion, setConclusion] = useState("");
  const [copied, setCopied] = useState<"html" | "md" | null>(null);

  const creatorTotal = useMemo(() => {
    if (!scaffold) return 0;
    let total = countWords(intro) + countWords(conclusion) + countWords(tableText);
    for (const t of sectionTexts) total += countWords(t);
    scaffold.faqQuestions.forEach((q, i) => {
      total += countWords(q) + countWords(faqAnswers[i] ?? "");
    });
    return total;
  }, [scaffold, intro, conclusion, tableText, sectionTexts, faqAnswers]);

  function generate() {
    const kw = cKeyword.trim();
    if (!kw) return;
    const sc = buildScaffold(kw);
    setScaffold(sc);
    setTitleIdx(0);
    setIntro("");
    setSectionTexts(sc.sections.map(() => ""));
    setTableText(sc.tableTemplate);
    setFaqAnswers(sc.faqQuestions.map(() => ""));
    setConclusion("");
    setCopied(null);
  }

  function buildHtml(): string {
    if (!scaffold) return "";
    const parts: string[] = [`<h1>${scaffold.titles[titleIdx]}</h1>`];
    for (const p of paras(intro)) parts.push(`<p>${p}</p>`);
    scaffold.sections.forEach((s, i) => {
      parts.push(`<h2>${s.heading}</h2>`);
      for (const p of paras(sectionTexts[i] ?? "")) parts.push(`<p>${p}</p>`);
      if (i === 3) {
        const table = mdTableToHtml(tableText);
        if (table) parts.push(table);
      }
    });
    parts.push(`<h2>Frequently Asked Questions</h2>`);
    scaffold.faqQuestions.forEach((q, i) => {
      parts.push(`<h3>${q}</h3>`);
      for (const p of paras(faqAnswers[i] ?? "")) parts.push(`<p>${p}</p>`);
    });
    parts.push(`<h2>Conclusion</h2>`);
    for (const p of paras(conclusion)) parts.push(`<p>${p}</p>`);
    return parts.join("\n");
  }

  function buildMarkdown(): string {
    if (!scaffold) return "";
    const parts: string[] = [`# ${scaffold.titles[titleIdx]}`, ""];
    if (intro.trim()) parts.push(intro.trim(), "");
    scaffold.sections.forEach((s, i) => {
      parts.push(`## ${s.heading}`, "", (sectionTexts[i] ?? "").trim(), "");
      if (i === 3 && tableText.trim()) parts.push(tableText.trim(), "");
    });
    parts.push(`## Frequently Asked Questions`, "");
    scaffold.faqQuestions.forEach((q, i) => {
      parts.push(`### ${q}`, "", (faqAnswers[i] ?? "").trim(), "");
    });
    parts.push(`## Conclusion`, "", conclusion.trim(), "");
    return parts.join("\n");
  }

  async function copyOut(kind: "html" | "md") {
    const text = kind === "html" ? buildHtml() : buildMarkdown();
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
    setCopied(kind);
    window.setTimeout(() => setCopied(null), 2500);
  }

  const tone = result ? riskTone(result.a.risk) : null;

  return (
    <>
      {/* MODE TOGGLE + INPUT */}
      <section className="bg-orange-50 dot-grid pb-16 sm:pb-20 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-center gap-2 mb-8">
            {(
              [
                ["auditor", "Audit an article"],
                ["creator", "Create an article"],
              ] as const
            ).map(([m, label]) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`rounded-full px-6 py-3 font-semibold transition ${
                  mode === m
                    ? "bg-orange-600 text-white shadow-md"
                    : "bg-white border border-stone-300 text-stone-700 hover:border-orange-300"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {mode === "auditor" && (
            <div className="max-w-3xl mx-auto">
              <label className={labelCls} htmlFor="lvc-url">
                Article URL — audit the live page
              </label>
              <form
                className="flex flex-col sm:flex-row gap-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  void checkUrl();
                }}
              >
                <input
                  id="lvc-url"
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://yoursite.com/your-article"
                  autoComplete="off"
                  className={`${inputCls} flex-1`}
                />
                <button type="submit" disabled={checking} className={`${btnPrimary} justify-center disabled:opacity-60`}>
                  {checking ? "Fetching page…" : "Check URL →"}
                </button>
              </form>
              <p className="mt-3 text-sm text-stone-500 leading-relaxed">
                We fetch the published page and score its real numbers — visible word count, H2/H3
                sections, images, internal vs external links, FAQ, lists and tables. The page is
                fetched once and never stored.
              </p>
              {checkError && (
                <p className="mt-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {checkError}
                </p>
              )}
              {fetched && (
                <div className="mt-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-900">
                  <span className="font-semibold">Now auditing:</span>{" "}
                  {fetched.title ? <span className="font-medium">{fetched.title}</span> : null}{" "}
                  <a
                    href={fetched.finalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-orange-700 hover:text-orange-800 break-all"
                  >
                    {fetched.finalUrl}
                  </a>{" "}
                  <button
                    type="button"
                    className="ml-2 font-semibold text-stone-500 hover:text-stone-700"
                    onClick={() => setFetched(null)}
                  >
                    Clear
                  </button>
                </div>
              )}

              <label className={`${labelCls} mt-6`} htmlFor="lvc-keyword">
                Target keyword (optional — enables the density check)
              </label>
              <input
                id="lvc-keyword"
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="e.g. low value content"
                autoComplete="off"
                className={inputCls}
              />

              <details className="mt-6 rounded-3xl border border-stone-200 bg-white/70 px-5 py-4">
                <summary className="cursor-pointer font-semibold text-stone-800">
                  Or paste the article text instead (drafts &amp; offline checks)
                </summary>
                <p className="mt-2 text-sm text-stone-500 leading-relaxed">
                  Checking an unpublished draft? Paste its text, Markdown or HTML here — headings are
                  counted from HTML (&lt;h2&gt;) or Markdown (##) markup, and pasted text is analysed
                  in your browser and never leaves your device. Pasting switches the audit away from
                  the fetched URL above.
                </p>
                <textarea
                  id="lvc-article"
                  value={article}
                  onChange={(e) => {
                    setArticle(e.target.value);
                    if (fetched) setFetched(null);
                  }}
                  placeholder="Paste the full article here"
                  rows={12}
                  className={`${areaCls} mt-3`}
                />
                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                  <button
                    type="button"
                    className="font-semibold text-orange-700"
                    onClick={() => {
                      setArticle(THIN_SAMPLE);
                      if (fetched) setFetched(null);
                    }}
                  >
                    Load a thin sample article →
                  </button>
                  <button
                    type="button"
                    className="font-semibold text-stone-500"
                    onClick={() => {
                      setArticle("");
                      setCompare("");
                      setKeyword("");
                    }}
                  >
                    Clear
                  </button>
                  <span className="text-stone-500">
                    Relative links (like /another-page) count as internal.
                  </span>
                </div>
              </details>

              <details className="mt-4 rounded-3xl border border-stone-200 bg-white/70 px-5 py-4">
                <summary className="cursor-pointer font-semibold text-stone-800">
                  Compare against a second article (duplicate / near-duplicate check)
                </summary>
                <p className="mt-2 text-sm text-stone-500 leading-relaxed">
                  Paste another article from your site — for example the same template written for a
                  different keyword or city. The checker measures 3-word-phrase (shingle) overlap
                  between the two.
                </p>
                <textarea
                  value={compare}
                  onChange={(e) => setCompare(e.target.value)}
                  placeholder="Paste the comparison article here (optional)"
                  rows={6}
                  className={`${areaCls} mt-3`}
                />
              </details>
            </div>
          )}

          {mode === "creator" && (
            <div className="max-w-3xl mx-auto">
              <label className={labelCls} htmlFor="lvc-ckeyword">
                Article keyword / topic
              </label>
              <form
                className="flex flex-col sm:flex-row gap-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  generate();
                }}
              >
                <input
                  id="lvc-ckeyword"
                  type="text"
                  value={cKeyword}
                  onChange={(e) => setCKeyword(e.target.value)}
                  placeholder="e.g. how to start a home bakery"
                  autoComplete="off"
                  className={`${inputCls} flex-1`}
                />
                <button type="submit" className={`${btnPrimary} justify-center`}>
                  Build scaffold →
                </button>
              </form>
              <p className="mt-4 text-sm text-stone-500 leading-relaxed text-center">
                You get 3 title options, an introduction, 6 guided sections, a comparison-table block, 5 FAQ
                answers and a conclusion — each with a writing prompt and its own word count, and a live total
                that must reach {(WORD_TARGET).toLocaleString()} words before the article is export-ready.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* AUDITOR RESULTS */}
      {mode === "auditor" && result && tone && (
        <section className="bg-white py-12 sm:py-16 border-t border-stone-100">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center">
              <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-4">
                Low Value Audit
              </span>
              <p className="font-display text-2xl sm:text-4xl font-bold text-stone-900">
                {result.a.band} — {result.a.risk}/100 risk
              </p>
              <p className="mt-3 text-sm text-stone-500">
                {fetched ? (
                  <>
                    Scored from the live page just fetched —{" "}
                    <a href={fetched.finalUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-orange-700 hover:text-orange-800 break-all">
                      {fetched.title || fetched.finalUrl}
                    </a>{" "}
                    — its real published word depth, structure, originality signals and engagement
                    elements. Site-level checks are listed under the checklist.
                  </>
                ) : (
                  <>
                    Scored live from the text you pasted — word depth, structure, originality signals and
                    engagement elements only. Site-level checks are listed under the checklist.
                  </>
                )}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3 mt-8 text-left">
              <div className="rounded-3xl border border-stone-200 bg-white p-6 text-center shadow-sm">
                <div className={`font-display font-bold text-6xl ${tone.text}`}>{result.a.risk}</div>
                <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.15em] text-stone-500">
                  Low Value Risk · /100
                </div>
                <div className="mt-3 h-2 rounded-full bg-stone-100 overflow-hidden">
                  <div className={`h-full rounded-full ${tone.bar}`} style={{ width: `${result.a.risk}%` }} />
                </div>
                <p className="mt-3 text-xs text-stone-500">Lower is safer. 0–25 low risk, 26–55 medium, 56+ high.</p>
              </div>
              <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                <div className="text-[11px] font-bold uppercase tracking-[0.15em] text-stone-500">Word depth</div>
                <p className="mt-2 font-display text-xl font-bold text-stone-900">
                  {result.a.words.toLocaleString()} / {WORD_MIN.toLocaleString()} words
                </p>
                <div className="mt-3 h-2 rounded-full bg-stone-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-orange-500"
                    style={{ width: `${Math.min(100, (result.a.words / WORD_TARGET) * 100)}%` }}
                  />
                </div>
                <p className="mt-3 text-sm text-stone-600 leading-relaxed">
                  {result.a.words >= WORD_MIN
                    ? "Past the thin-content line, with margin."
                    : `${(WORD_TARGET - result.a.words).toLocaleString()} words short of the ${WORD_TARGET.toLocaleString()}-word target.`}{" "}
                  {result.a.paragraphs} paragraphs detected.
                </p>
              </div>
              <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                <div className="text-[11px] font-bold uppercase tracking-[0.15em] text-stone-500">At a glance</div>
                <ul className="mt-2 space-y-1.5 text-sm text-stone-700">
                  <li>Sections: <strong>{result.a.headings}</strong> / {SECTION_TARGET}</li>
                  <li>Images: <strong>{result.a.images}</strong> / {IMAGE_TARGET}</li>
                  <li>Internal links: <strong>{result.a.internalLinks}</strong> / {INTERNAL_TARGET} · External: <strong>{result.a.externalLinks}</strong></li>
                  <li>FAQ: <strong>{result.a.hasFaq ? "Yes" : "No"}</strong> · List: <strong>{result.a.hasList ? "Yes" : "No"}</strong> · Table: <strong>{result.a.hasTable ? "Yes" : "No"}</strong></li>
                  {result.a.keywordDensity !== null && (
                    <li>Keyword density: <strong>{result.a.keywordDensity.toFixed(2)}%</strong></li>
                  )}
                  {result.a.similarity !== null && (
                    <li>Similarity vs comparison: <strong>{result.a.similarity}%</strong></li>
                  )}
                </ul>
              </div>
            </div>

            <h3 className="font-display text-2xl font-bold text-stone-900 mt-10">Fix checklist — exact gaps</h3>
            <p className="mt-2 text-stone-600">
              Every item is measured from {fetched ? "the fetched page" : "your pasted article"}. Fix the red items first — they are the
              measurable signals behind a “low value content” rejection.
            </p>
            <div className="mt-4 rounded-3xl border border-stone-200 bg-white px-6 py-2">
              {result.fixes.map((f) => (
                <div key={f.label} className="py-4 border-b border-stone-100 last:border-0">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span
                      className={`inline-grid place-items-center w-6 h-6 rounded-full text-white text-sm font-bold shrink-0 ${
                        f.ok ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {f.ok ? "✓" : "!"}
                    </span>
                    <span className="font-semibold text-stone-900">{f.label}</span>
                  </div>
                  <p className="mt-2 text-sm text-stone-500 leading-relaxed pl-8">{f.detail}</p>
                </div>
              ))}
              <div className="py-4">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="inline-grid place-items-center w-6 h-6 rounded-full bg-stone-400 text-white text-sm font-bold shrink-0">
                    i
                  </span>
                  <span className="font-semibold text-stone-900">Site-level checks (not scored from one article)</span>
                </div>
                <p className="mt-2 text-sm text-stone-500 leading-relaxed pl-8">
                  AdSense also reviews the whole site: working navigation, an About page, a Privacy Policy
                  and a Contact page, no broken or copied pages, and content a visitor can reach in two
                  clicks from the home page. Run your homepage through BotView for the site-level half.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CREATOR WORKSPACE */}
      {mode === "creator" && scaffold && (
        <section className="bg-white py-12 sm:py-16 border-t border-stone-100">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center">
              <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-4">
                Article Scaffold
              </span>
              <p className="font-display text-2xl sm:text-4xl font-bold text-stone-900">
                “{cKeyword.trim()}”
              </p>
              <p className="mt-3 text-sm text-stone-500">
                Write each block in your own words from real knowledge — the prompts tell you what each
                block must contain. Filler will not fool the auditor above; specific examples, steps and
                numbers will pass it.
              </p>
            </div>

            <div className="mt-8 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sticky top-4 z-10">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-display text-xl font-bold text-stone-900">
                  {creatorTotal.toLocaleString()} words
                </span>
                <span className="text-sm text-stone-500">
                  Target {WORD_TARGET.toLocaleString()} · Minimum {WORD_MIN.toLocaleString()}
                </span>
              </div>
              <div className="mt-3 h-2.5 rounded-full bg-stone-100 overflow-hidden">
                <div
                  className={`h-full rounded-full ${creatorTotal >= WORD_MIN ? "bg-green-500" : "bg-orange-500"}`}
                  style={{ width: `${Math.min(100, (creatorTotal / WORD_TARGET) * 100)}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-stone-500">
                {creatorTotal >= WORD_MIN
                  ? "Past the thin-content line — export it, then run it through the auditor before publishing."
                  : `${(WORD_TARGET - creatorTotal).toLocaleString()} words to go. Short sections are the usual gap — expand the steps and examples first.`}
              </p>
            </div>

            <h3 className="font-display text-2xl font-bold text-stone-900 mt-10">1 · Pick a title</h3>
            <div className="mt-4 space-y-3">
              {scaffold.titles.map((t, i) => (
                <label
                  key={t}
                  className={`flex items-start gap-3 rounded-3xl border p-5 cursor-pointer transition ${
                    titleIdx === i ? "border-orange-400 bg-orange-50" : "border-stone-200 bg-white hover:border-orange-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="lvc-title"
                    checked={titleIdx === i}
                    onChange={() => setTitleIdx(i)}
                    className="mt-1 accent-orange-600"
                  />
                  <span className="font-semibold text-stone-900">{t}</span>
                </label>
              ))}
            </div>

            <h3 className="font-display text-2xl font-bold text-stone-900 mt-10">2 · Introduction</h3>
            <p className="mt-2 text-sm text-stone-500 leading-relaxed">
              Prompt: open with the reader&apos;s problem, promise exactly what this guide covers, and use
              the keyword naturally once. 120–180 words.
            </p>
            <textarea
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
              rows={5}
              placeholder="Write the introduction here…"
              className={`${areaCls} mt-3`}
            />
            <p className="mt-1 text-right text-xs text-stone-400">{countWords(intro)} words</p>

            <h3 className="font-display text-2xl font-bold text-stone-900 mt-10">3 · Sections</h3>
            <div className="space-y-6 mt-4">
              {scaffold.sections.map((s, i) => (
                <div key={s.heading} className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                  <p className="font-display text-lg font-bold text-stone-900">{s.heading}</p>
                  <p className="mt-1.5 text-sm text-stone-500 leading-relaxed">{s.prompt}</p>
                  <textarea
                    value={sectionTexts[i] ?? ""}
                    onChange={(e) => {
                      const next = [...sectionTexts];
                      next[i] = e.target.value;
                      setSectionTexts(next);
                    }}
                    rows={6}
                    placeholder="Write this section here… (aim for 200+ words)"
                    className={`${areaCls} mt-3`}
                  />
                  <p className="mt-1 text-right text-xs text-stone-400">{countWords(sectionTexts[i] ?? "")} words</p>
                  {i === 3 && (
                    <div className="mt-4">
                      <p className={labelCls}>Comparison table (Markdown — exported as a real table)</p>
                      <textarea
                        value={tableText}
                        onChange={(e) => setTableText(e.target.value)}
                        rows={6}
                        className={`${areaCls} font-mono text-sm`}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <h3 className="font-display text-2xl font-bold text-stone-900 mt-10">4 · FAQ answers</h3>
            <div className="space-y-6 mt-4">
              {scaffold.faqQuestions.map((q, i) => (
                <div key={q} className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                  <p className="font-display text-lg font-bold text-stone-900">{q}</p>
                  <p className="mt-1.5 text-sm text-stone-500 leading-relaxed">
                    Prompt: answer directly in the first sentence, then add one supporting detail or example. 40–80 words.
                  </p>
                  <textarea
                    value={faqAnswers[i] ?? ""}
                    onChange={(e) => {
                      const next = [...faqAnswers];
                      next[i] = e.target.value;
                      setFaqAnswers(next);
                    }}
                    rows={3}
                    placeholder="Write the answer here…"
                    className={`${areaCls} mt-3`}
                  />
                  <p className="mt-1 text-right text-xs text-stone-400">{countWords(faqAnswers[i] ?? "")} words</p>
                </div>
              ))}
            </div>

            <h3 className="font-display text-2xl font-bold text-stone-900 mt-10">5 · Conclusion</h3>
            <p className="mt-2 text-sm text-stone-500 leading-relaxed">
              Prompt: summarise the 2–3 decisions the reader now has to make, and end with one clear next
              step. 80–120 words.
            </p>
            <textarea
              value={conclusion}
              onChange={(e) => setConclusion(e.target.value)}
              rows={4}
              placeholder="Write the conclusion here…"
              className={`${areaCls} mt-3`}
            />
            <p className="mt-1 text-right text-xs text-stone-400">{countWords(conclusion)} words</p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <button type="button" onClick={() => void copyOut("html")} className={btnPrimary}>
                {copied === "html" ? "Copied ✓" : "Copy as HTML"}
              </button>
              <button type="button" onClick={() => void copyOut("md")} className={btnOutline}>
                {copied === "md" ? "Copied ✓" : "Copy as Markdown"}
              </button>
            </div>
            <p className="mt-4 text-center text-sm text-stone-500">
              Before publishing: enter the exported article&apos;s URL in the <strong>Audit</strong> tab above (or paste its text) and
              clear every red checklist item.
            </p>
          </div>
        </section>
      )}
    </>
  );
}
