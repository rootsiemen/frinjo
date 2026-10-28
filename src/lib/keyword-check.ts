/**
 * Keyword Traffic Checker engine — free, honestly-sourced keyword data.
 *
 * What this does NOT do: invent a monthly search volume. Exact volume is
 * paid-database data (Ahrefs / Semrush / Keyword Planner). This engine only
 * reports things it actually fetched:
 *  - a live SERP sample (DuckDuckGo HTML -> DuckDuckGo Lite -> Bing),
 *  - a difficulty score computed ONLY from that SERP sample, with every
 *    factor's points shown to the user,
 *  - Google Autocomplete suggestions (real queries people type),
 *  - Google Trends interest, when Google does not rate-limit the request,
 *  - a rule-based search-intent classification that names the rule that fired.
 *
 * Every fetch is geo-targeted to ONE user-selected country (see
 * src/lib/countries.ts): DuckDuckGo gets its `kl` region code where DDG
 * publishes one, Bing gets `cc` (plus `setmkt` where Bing defines a market),
 * Google Autocomplete gets `gl`, and Google Trends gets `geo`. The report
 * always names the country it was fetched for — there is no silent fallback
 * to another country's results.
 */

import { resolveCountry, type Country } from "./countries";

export interface SerpResult {
  rank: number;
  title: string;
  url: string;
  domain: string;
  snippet: string;
}

export interface DifficultyFactor {
  factor: string;
  points: number;
  max: number;
  detail: string;
}

/**
 * Pluggable volume provider.
 *
 * Today the only provider is "free-signals": it returns NO exact volume
 * (exactVolume is always null) and the report is built from autocomplete,
 * Trends and the SERP sample instead.
 *
 * The paid upgrade path chosen for this tool is the Google Keyword Planner
 * API (Google Ads API) — NOT a third-party database. A future
 * "google-ads" provider can be added behind this same interface, reading
 * its credentials from environment variables (placeholders only — no real
 * secrets exist yet, and none may be committed):
 *   GOOGLE_ADS_CLIENT_ID, GOOGLE_ADS_CLIENT_SECRET,
 *   GOOGLE_ADS_REFRESH_TOKEN, GOOGLE_ADS_DEVELOPER_TOKEN,
 *   GOOGLE_ADS_CUSTOMER_ID, GOOGLE_ADS_LOGIN_CUSTOMER_ID
 * Swapping providers must not change the page or the API route shape:
 * only this function and the `provider` / `exactVolume` fields change.
 */
export interface VolumeData {
  provider: "free-signals" | "google-ads";
  exactVolume: number | null;
  note: string;
}

export async function getVolumeData(
  keyword: string,
  countryCode: string,
  context: { suggestionsCount: number; trendsStatus: string },
): Promise<VolumeData> {
  void keyword;
  // `countryCode` (ISO 3166-1 alpha-2) is the market this check ran for.
  // When the "google-ads" provider lands, it maps 1:1 to a Keyword Planner
  // geo target: Google Ads geo targets are keyed by country (each country
  // has a numeric geoTargetConstant id, e.g. US=2840, PK=2586, GB=2826),
  // so the provider will resolve alpha-2 -> geoTargetConstant and pass it as
  // the keyword plan's target — no signature change will be needed.
  void countryCode;
  // Free provider: exact volume is paid-API data, so it stays null and the
  // note says so plainly instead of dressing up an estimate as a number.
  return {
    provider: "free-signals",
    exactVolume: null,
    note: `No exact monthly volume in the free version — that figure comes from the Google Keyword Planner / Google Ads API. Demand signal here is based on ${context.suggestionsCount} Google Autocomplete suggestion(s) and Trends status: ${context.trendsStatus}.`,
  };
}

export interface KeywordReport {
  keyword: string;
  country: { code: string; name: string };
  volume: VolumeData;
  checkedAt: string;
  serpSource: string | null; // e.g. "DuckDuckGo (Lite)"
  serpResults: SerpResult[];
  approxResultCount: number | null;
  serpError: string | null;
  difficulty: number | null; // 0-100, null when no SERP could be fetched
  difficultyFactors: DifficultyFactor[];
  verdict: string;
  suggestions: string[];
  relatedKeywords: string[];
  trends:
    | { status: "ok"; averageInterest: number; direction: "rising" | "falling" | "steady" }
    | { status: "unavailable"; note: string };
  intent: { label: string; rule: string };
  error?: string;
}

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";
const TIMEOUT_MS = 8000;

/* ---------------- helpers ---------------- */

function decodeEntities(s: string): string {
  return s
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;|&apos;/gi, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

function stripTags(s: string): string {
  return decodeEntities(s.replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchText(url: string): Promise<{ status: number; body: string } | null> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": UA,
        Accept: "text/html,application/xhtml+xml,application/json,text/plain,*/*",
        "Accept-Language": "en-US,en;q=0.9",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    return { status: res.status, body: await res.text() };
  } catch {
    return null;
  }
}

function domainOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

/** DuckDuckGo redirect links carry the real URL in the `uddg` parameter. */
function unwrapDdg(href: string): string {
  let u = href;
  if (u.startsWith("//")) u = "https:" + u;
  try {
    const parsed = new URL(u);
    const uddg = parsed.searchParams.get("uddg");
    if (uddg) return uddg;
  } catch {
    /* fall through */
  }
  return u;
}

/** Bing result links hide the target in a base64 `u=a1...` parameter. */
function unwrapBing(href: string): string {
  try {
    const parsed = new URL(href);
    const u = parsed.searchParams.get("u");
    if (u && u.startsWith("a1")) {
      const b64 = u.slice(2).replace(/-/g, "+").replace(/_/g, "/");
      const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
      const decoded = Buffer.from(padded, "base64").toString("utf-8");
      if (/^https?:\/\//.test(decoded)) return decoded;
    }
  } catch {
    /* fall through */
  }
  return href;
}

/* ---------------- SERP fetching ---------------- */

function parseDdgHtml(html: string): SerpResult[] {
  const results: SerpResult[] = [];
  const anchors = [
    ...html.matchAll(/<a\b[^>]*class="[^"]*result__a[^"]*"[^>]*>([\s\S]*?)<\/a>/gi),
  ];
  const snippets = [
    ...html.matchAll(/<a\b[^>]*class="[^"]*result__snippet[^"]*"[^>]*>([\s\S]*?)<\/a>/gi),
  ];
  anchors.forEach((m, i) => {
    const tag = m[0].slice(0, m[0].indexOf(">") + 1);
    const href = tag.match(/href="([^"]+)"/i)?.[1] ?? "";
    const url = unwrapDdg(decodeEntities(href));
    const domain = domainOf(url);
    if (!url || !domain || domain.includes("duckduckgo.com")) return;
    results.push({
      rank: results.length + 1,
      title: stripTags(m[1]),
      url,
      domain,
      snippet: snippets[i] ? stripTags(snippets[i][1]) : "",
    });
  });
  return results.slice(0, 10);
}

function parseDdgLite(html: string): SerpResult[] {
  const results: SerpResult[] = [];
  const anchors = [
    ...html.matchAll(/<a\b[^>]*class=['"]result-link['"][^>]*>([\s\S]*?)<\/a>/gi),
  ];
  const snippets = [
    ...html.matchAll(/<td[^>]*class=['"]result-snippet['"][^>]*>([\s\S]*?)<\/td>/gi),
  ];
  anchors.forEach((m, i) => {
    const tag = m[0].slice(0, m[0].indexOf(">") + 1);
    const href = tag.match(/href="([^"]+)"/i)?.[1] ?? tag.match(/href='([^']+)'/)?.[1] ?? "";
    const url = unwrapDdg(decodeEntities(href));
    const domain = domainOf(url);
    if (!url || !domain || domain.includes("duckduckgo.com")) return;
    results.push({
      rank: results.length + 1,
      title: stripTags(m[1]),
      url,
      domain,
      snippet: snippets[i] ? stripTags(snippets[i][1]) : "",
    });
  });
  return results.slice(0, 10);
}

function parseBing(html: string): { results: SerpResult[]; approxCount: number | null } {
  const results: SerpResult[] = [];
  const chunks = html.split(/<li class="b_algo"/i).slice(1);
  for (const chunk of chunks) {
    const m = chunk.match(/<h2[^>]*>\s*<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i);
    if (!m) continue;
    const url = unwrapBing(decodeEntities(m[1]));
    const domain = domainOf(url);
    if (!url || !domain || domain.includes("bing.com")) continue;
    const snip =
      chunk.match(/<p[^>]*class="[^"]*b_lineclamp[^"]*"[^>]*>([\s\S]*?)<\/p>/i)?.[1] ??
      chunk.match(/<div[^>]*class="[^"]*b_caption[^"]*"[^>]*>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/i)?.[1] ??
      "";
    results.push({
      rank: results.length + 1,
      title: stripTags(m[2]),
      url,
      domain,
      snippet: stripTags(snip),
    });
    if (results.length >= 10) break;
  }
  const countMatch =
    html.match(/sb_count[^>]*>\s*(?:About\s*)?([\d,]+)\s*results/i) ??
    html.match(/([\d,]+)\s*results/i);
  const approxCount = countMatch ? Number(countMatch[1].replace(/,/g, "")) : null;
  return { results, approxCount: approxCount && approxCount > 10 ? approxCount : null };
}

/** A score is only ever built on a real sample: at least 5 results. */
const MIN_SERP_RESULTS = 5;

function dropJunk(results: SerpResult[]): SerpResult[] {
  return results
    .filter((r) => !/moved permanently|access denied|just a moment|are you a robot|captcha/i.test(r.title))
    .map((r, i) => ({ ...r, rank: i + 1 }));
}

async function fetchSerp(
  keyword: string,
  country: Country,
): Promise<{ source: string; results: SerpResult[]; approxCount: number | null } | null> {
  const q = encodeURIComponent(keyword);
  // Geo parameters for the requested country — never substituted with
  // another country's. DDG only publishes `kl` codes for some countries;
  // without one the DDG request goes unregionalized and Bing (which always
  // receives `cc`) carries the localization.
  const kl = country.ddgKl ? `&kl=${country.ddgKl}` : "";
  const label = (source: string) => `${source} · ${country.name}`;
  // 1) DuckDuckGo HTML
  const ddg = await fetchText(`https://html.duckduckgo.com/html/?q=${q}${kl}`);
  if (ddg && ddg.status === 200) {
    const r = dropJunk(parseDdgHtml(ddg.body));
    if (r.length >= MIN_SERP_RESULTS) return { source: label("DuckDuckGo"), results: r, approxCount: null };
  }
  // 2) DuckDuckGo Lite (same engine, lighter page — often survives when the
  // HTML endpoint is bot-checked with a 202/403, so it is tried on ANY thin
  // or failed HTML result, not only on HTTP 200)
  const lite = await fetchText(`https://lite.duckduckgo.com/lite/?q=${q}${kl}`);
  if (lite && lite.status === 200) {
    const lr = dropJunk(parseDdgLite(lite.body));
    if (lr.length >= MIN_SERP_RESULTS) return { source: label("DuckDuckGo (Lite)"), results: lr, approxCount: null };
  }
  // 3) Bing fallback — Bing occasionally answers a degraded page with a
  // single junk result, so a thin parse is retried once before giving up.
  // Both attempts target the SAME requested country (`cc`, plus `setmkt`
  // where Bing defines a market for it).
  const mkt = country.bingMkt ? `&setmkt=${country.bingMkt}` : "";
  for (let attempt = 0; attempt < 2; attempt++) {
    const bing = await fetchText(
      attempt === 0
        ? `https://www.bing.com/search?q=${q}&count=10&cc=${country.code}${mkt}`
        : `https://www.bing.com/search?q=${q}&count=10&setlang=en&cc=${country.code}${mkt}&form=QBRE`,
    );
    if (bing && bing.status === 200) {
      const { results, approxCount } = parseBing(bing.body);
      const clean = dropJunk(results);
      if (clean.length >= MIN_SERP_RESULTS) return { source: label("Bing"), results: clean, approxCount };
    }
    if (attempt === 0) await new Promise((r) => setTimeout(r, 700));
  }
  return null;
}

/* ---------------- difficulty (from the SERP only) ---------------- */

const AUTHORITY_DOMAINS = [
  "wikipedia.org", "youtube.com", "facebook.com", "instagram.com", "twitter.com",
  "x.com", "linkedin.com", "reddit.com", "quora.com", "pinterest.com",
  "amazon.com", "amazon.co.uk", "amazon.in", "ebay.com", "apple.com",
  "microsoft.com", "google.com", "bbc.com", "bbc.co.uk", "cnn.com",
  "forbes.com", "nytimes.com", "theguardian.com", "yelp.com",
  "tripadvisor.com", "trustpilot.com", "medium.com", "statefarm.com",
  "geico.com", "progressive.com", "nerdwallet.com", "investopedia.com",
  "healthline.com", "webmd.com", "mayoclinic.org", "nih.gov",
];

function isAuthority(domain: string): boolean {
  if (!domain) return false;
  if (/(^|\.)gov(\.|$)/.test(domain) || domain.endsWith(".edu") || domain.includes(".edu.")) return true;
  return AUTHORITY_DOMAINS.some((d) => domain === d || domain.endsWith("." + d));
}

function keywordWords(keyword: string): string[] {
  return keyword.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 1);
}

function coverage(text: string, words: string[]): number {
  if (!words.length) return 0;
  const t = text.toLowerCase();
  const hit = words.filter((w) => t.includes(w)).length;
  return hit / words.length;
}

export function scoreDifficulty(
  keyword: string,
  results: SerpResult[],
  approxCount: number | null,
): { score: number; factors: DifficultyFactor[] } {
  const words = keywordWords(keyword);
  const factors: DifficultyFactor[] = [];

  const auth = results.filter((r) => isAuthority(r.domain));
  const authPoints = Math.min(auth.length * 6, 30);
  factors.push({
    factor: "Authority sites in the top results",
    points: authPoints,
    max: 30,
    detail:
      auth.length === 0
        ? "No Wikipedia / YouTube / .gov / .edu / big-brand domains in this SERP sample — a good sign for a small site."
        : `${auth.length} authority result(s): ${[...new Set(auth.map((r) => r.domain))].join(", ")} (6 points each, max 30).`,
  });

  const top3 = results.slice(0, 3);
  const posWeights = [5, 3, 2];
  let top3Points = 0;
  top3.forEach((r, i) => {
    if (isAuthority(r.domain)) top3Points += posWeights[i];
  });
  factors.push({
    factor: "Authority sites in the top 3",
    points: top3Points,
    max: 10,
    detail:
      top3Points === 0
        ? "None of the top 3 results is an authority domain."
        : `Authority domain(s) hold top-3 position(s) (position weights 5/3/2) — the hardest spots to displace.`,
  });

  const titleCov = results.length
    ? results.reduce((s, r) => s + coverage(r.title, words), 0) / results.length
    : 0;
  factors.push({
    factor: "Titles targeting this exact keyword",
    points: Math.round(titleCov * 25),
    max: 25,
    detail: `On average ${Math.round(titleCov * 100)}% of the keyword's words appear in each result title — high coverage means every competitor is deliberately targeting this term.`,
  });

  const urlHits = results.filter(
    (r) => coverage(`${r.domain} ${decodeURIComponent(r.url)}`, words) >= 0.5,
  ).length;
  factors.push({
    factor: "Keyword in the ranking URLs",
    points: Math.min(urlHits * 2, 10),
    max: 10,
    detail: `${urlHits} of ${results.length} ranking URLs contain at least half the keyword's words (2 points each, max 10) — a sign of optimised, established pages.`,
  });

  const uniqueDomains = new Set(results.map((r) => r.domain)).size;
  const repeats = Math.max(0, results.length - uniqueDomains);
  factors.push({
    factor: "One domain dominating the page",
    points: results.length > 1 ? Math.round((repeats / (results.length - 1)) * 5) : 0,
    max: 5,
    detail:
      repeats === 0
        ? `All ${results.length} results come from different domains — no single site owns this SERP.`
        : `${repeats} result(s) are repeats of a domain already on the page (${uniqueDomains} unique domains in ${results.length} results).`,
  });

  const breadthPoints = words.length <= 1 ? 10 : words.length === 2 ? 6 : words.length === 3 ? 3 : 0;
  factors.push({
    factor: "Keyword breadth (head term vs long-tail)",
    points: breadthPoints,
    max: 10,
    detail:
      words.length <= 1
        ? "A single-word head term — these are almost always fought over by the biggest sites in the niche."
        : words.length === 2
          ? "A short 2-word term — usually broad and competitive."
          : words.length === 3
            ? "A 3-word term — mid-tail, usually more winnable than a head term."
            : `A ${words.length}-word long-tail phrase — long-tail terms are normally far easier to rank for.`,
  });

  const snipCov = results.length
    ? results.reduce((s, r) => s + coverage(r.snippet, words), 0) / results.length
    : 0;
  factors.push({
    factor: "Keyword saturation in result snippets",
    points: Math.round(snipCov * 5),
    max: 5,
    detail: `On average ${Math.round(snipCov * 100)}% of the keyword's words appear in each result snippet.`,
  });

  const countPoints =
    approxCount === null ? 0 : approxCount >= 10_000_000 ? 5 : approxCount >= 1_000_000 ? 4 : approxCount >= 100_000 ? 3 : approxCount >= 10_000 ? 2 : 1;
  factors.push({
    factor: "Total competing pages (when the source reports it)",
    points: countPoints,
    max: 5,
    detail:
      approxCount === null
        ? "This SERP source does not publish a total result count, so this factor scores 0 — it is not estimated."
        : `The search engine reports about ${approxCount.toLocaleString()} competing pages.`,
  });

  const score = factors.reduce((s, f) => s + f.points, 0);
  return { score: Math.min(100, score), factors };
}

export function verdictFor(score: number): string {
  if (score < 40) return "Low competition — page 1 is realistic for a small site with one strong, well-targeted page.";
  if (score < 60) return "Medium competition — page 1 is possible with a thorough page that is clearly better than the current results.";
  if (score < 80) return "Hard — established sites hold this SERP. A small site should target a longer-tail version of this keyword first.";
  return "Very hard — authority sites dominate this SERP. Pick a narrower long-tail keyword instead of fighting for this one.";
}

/* ---------------- Google Autocomplete ---------------- */

async function fetchSuggestions(query: string, country: Country): Promise<string[]> {
  const res = await fetchText(
    `https://suggestqueries.google.com/complete/search?client=firefox&hl=en&gl=${country.code.toLowerCase()}&q=${encodeURIComponent(query)}`,
  );
  if (!res || res.status !== 200) return [];
  try {
    const parsed = JSON.parse(res.body) as unknown;
    if (Array.isArray(parsed) && Array.isArray(parsed[1])) {
      return parsed[1].filter((x): x is string => typeof x === "string");
    }
  } catch {
    /* no suggestions available */
  }
  return [];
}

/* ---------------- Google Trends (best effort, never faked) ---------------- */

async function fetchTrends(
  keyword: string,
  country: Country,
): Promise<KeywordReport["trends"]> {
  const unavailable: KeywordReport["trends"] = {
    status: "unavailable",
    note: "Trends data abhi available nahi (rate-limited)",
  };
  const req = {
    comparisonItem: [{ keyword, geo: country.code, time: "today 12-m" }],
    category: 0,
    property: "",
  };
  const explore = await fetchText(
    `https://trends.google.com/trends/api/explore?hl=en-US&tz=0&req=${encodeURIComponent(JSON.stringify(req))}`,
  );
  if (!explore || explore.status !== 200) return unavailable;
  try {
    const jsonText = explore.body.replace(/^\)\]\}',?\n?/, "");
    const parsed = JSON.parse(jsonText) as {
      widgets?: { id: string; token: string; request: unknown }[];
    };
    const widget = parsed.widgets?.find((w) => w.id === "TIMELINES");
    if (!widget) return unavailable;
    const data = await fetchText(
      `https://trends.google.com/trends/api/widgetdata/multiline?hl=en-US&tz=0&req=${encodeURIComponent(
        JSON.stringify(widget.request),
      )}&token=${encodeURIComponent(widget.token)}`,
    );
    if (!data || data.status !== 200) return unavailable;
    const dataJson = JSON.parse(data.body.replace(/^\)\]\}',?\n?/, "")) as {
      default?: { timelineData?: { value?: number[] }[] };
    };
    const points = (dataJson.default?.timelineData ?? [])
      .map((p) => p.value?.[0])
      .filter((v): v is number => typeof v === "number");
    if (points.length < 4) return unavailable;
    const avg = Math.round(points.reduce((s, v) => s + v, 0) / points.length);
    const half = Math.floor(points.length / 2);
    const first = points.slice(0, half).reduce((s, v) => s + v, 0) / Math.max(1, half);
    const second = points.slice(half).reduce((s, v) => s + v, 0) / Math.max(1, points.length - half);
    const direction = second > first * 1.1 ? "rising" : second < first * 0.9 ? "falling" : "steady";
    return { status: "ok", averageInterest: avg, direction };
  } catch {
    return unavailable;
  }
}

/* ---------------- search intent (transparent rules) ---------------- */

const BRANDS = ["facebook", "youtube", "instagram", "twitter", "google", "amazon", "netflix", "spotify", "tiktok", "whatsapp", "gmail", "outlook"];

export function classifyIntent(keyword: string): { label: string; rule: string } {
  const k = ` ${keyword.toLowerCase()} `;
  if (BRANDS.some((b) => k.includes(` ${b} `) || k.includes(` ${b}`)) || /\b(login|log in|sign in|official site|website)\b/.test(k) && BRANDS.some((b) => k.includes(b))) {
    return { label: "Navigational", rule: "Rule fired: the keyword names a brand / asks for a specific site or login — the searcher already knows where they want to go." };
  }
  if (/\bnear me\b/.test(k) || /\b(in|near)\s+[a-z]+\s+(city|town)?\b/.test(k) && /\b(shop|store|salon|restaurant|clinic|hotel|service|plumber|dentist)\b/.test(k)) {
    return { label: "Local", rule: "Rule fired: the keyword contains a place / 'near me' signal together with a local business type — the searcher wants a nearby provider." };
  }
  const transactional = ["buy", "price", "cost", "pricing", "order", "shop", "hire", "book", "booking", "quote", "cheap", "discount", "for sale", "packages", "rates", "fee", "fees"];
  const tHit = transactional.filter((w) => k.includes(` ${w} `) || k.includes(` ${w}`));
  if (tHit.length) {
    return { label: "Transactional / Commercial", rule: `Rule fired: buying-signal word(s) found — ${tHit.join(", ")}. The searcher is comparing providers or prices with intent to act.` };
  }
  const informational = ["how", "what", "why", "when", "which", "guide", "tutorial", "tips", "meaning", "examples", "ideas", "difference", "vs", "benefits", "process", "steps"];
  const iHit = informational.filter((w) => k.includes(` ${w} `) || k.startsWith(` ${w} `) || k.includes(` ${w}`));
  if (iHit.length) {
    return { label: "Informational", rule: `Rule fired: question / learning word(s) found — ${iHit.join(", ")}. The searcher wants an explanation, not a checkout.` };
  }
  return { label: "General / mixed", rule: "No strong signal word (buy/price/how/what/near me/brand) was found in the keyword, so no single intent rule fired — treat the intent as mixed and check the SERP results above to see what Google rewards." };
}

/* ---------------- main ---------------- */

export async function runKeywordCheck(
  rawKeyword: string,
  rawCountry?: string | null,
): Promise<KeywordReport> {
  const keyword = rawKeyword.trim().replace(/\s+/g, " ").slice(0, 120);
  const country = resolveCountry(rawCountry);
  const base: KeywordReport = {
    keyword,
    country: { code: country.code, name: country.name },
    volume: {
      provider: "free-signals",
      exactVolume: null,
      note: "No exact monthly volume in the free version — that figure comes from the Google Keyword Planner / Google Ads API.",
    },
    checkedAt: new Date().toISOString(),
    serpSource: null,
    serpResults: [],
    approxResultCount: null,
    serpError: null,
    difficulty: null,
    difficultyFactors: [],
    verdict: "",
    suggestions: [],
    relatedKeywords: [],
    trends: { status: "unavailable", note: "Trends data abhi available nahi (rate-limited)" },
    intent: classifyIntent(keyword || ""),
  };
  if (!keyword || keyword.length < 2) {
    return { ...base, error: "Please enter a keyword of at least 2 characters." };
  }

  const [serp, suggestions, trends] = await Promise.all([
    fetchSerp(keyword, country),
    fetchSuggestions(keyword, country),
    fetchTrends(keyword, country),
  ]);

  // Related keywords: a few prefix expansions, reusing the base suggestions.
  const prefixes = ["how ", "best ", "what is "];
  const extraLists = await Promise.all(prefixes.map((p) => fetchSuggestions(p + keyword, country)));
  const relatedSet = new Set<string>();
  for (const s of [...suggestions, ...extraLists.flat()]) {
    const v = s.trim();
    if (v && v.toLowerCase() !== keyword.toLowerCase()) relatedSet.add(v);
  }
  const relatedKeywords = [...relatedSet].slice(0, 24);
  const volume = await getVolumeData(keyword, country.code, {
    suggestionsCount: suggestions.length,
    trendsStatus: trends.status,
  });

  if (!serp) {
    return {
      ...base,
      volume,
      suggestions,
      relatedKeywords,
      trends,
      serpError:
        `Both SERP sources (DuckDuckGo and Bing) failed or returned too few parseable results for ${country.name} this time (a score needs a sample of at least 5), so no difficulty score was calculated — a score is never invented, and no other country's results were substituted. Please try again in a minute.`,
      verdict: `No verdict — the live SERP sample for ${country.name} could not be fetched.`,
    };
  }

  const { score, factors } = scoreDifficulty(keyword, serp.results, serp.approxCount);
  return {
    ...base,
    volume,
    serpSource: serp.source,
    serpResults: serp.results,
    approxResultCount: serp.approxCount,
    difficulty: score,
    difficultyFactors: factors,
    verdict: verdictFor(score),
    suggestions,
    relatedKeywords,
    trends,
  };
}
