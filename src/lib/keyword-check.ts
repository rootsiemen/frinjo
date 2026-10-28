/**
 * Keyword Traffic Checker engine — free, honestly-sourced keyword data.
 *
 * What this does NOT do: invent a monthly search volume. Exact volume is
 * paid-database data (Ahrefs / Semrush / Keyword Planner). This engine only
 * reports things it actually fetched:
 *  - a live SERP sample (DuckDuckGo HTML, DuckDuckGo Lite, Bing in two
 *    URL variants, Mojeek and Yahoo raced in parallel, the whole race
 *    retried once — a score needs >=5 real results from ONE source,
 *    whichever answers first with a usable sample),
 *  - a difficulty score computed ONLY from that SERP sample, with every
 *    factor's points shown to the user,
 *  - Google Autocomplete suggestions (real queries people type),
 *  - Google Trends interest, when Google does not rate-limit the request,
 *  - exact monthly search volume from Google Keyword Planner (Google Ads
 *    API), when the GOOGLE_ADS_* credentials are configured — otherwise
 *    the volume stays null and the report says so (see getVolumeData),
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
 * Volume providers.
 *
 * "google-ads" (live when configured): exact monthly search volume from
 * the Google Keyword Planner API (Google Ads API). Credentials come from
 * environment variables only — no secrets are ever committed:
 *   GOOGLE_ADS_CLIENT_ID, GOOGLE_ADS_CLIENT_SECRET,
 *   GOOGLE_ADS_REFRESH_TOKEN, GOOGLE_ADS_CUSTOMER_ID,
 *   GOOGLE_ADS_LOGIN_CUSTOMER_ID
 * Access follows the Cloud access model: an OAuth access token (minted
 * from the refresh token, cached in module scope) plus the
 * login-customer-id header — no developer-token header is sent.
 *
 * "free-signals" (fallback): returns NO exact volume (exactVolume is
 * always null) and the report is built from autocomplete, Trends and the
 * SERP sample instead. It is used whenever the Ads credentials are not
 * configured, the selected country has no geo target constant (see
 * countries.ts `geoTargetId`), or the Planner lookup fails — the volume
 * lookup must never fail the whole check.
 */
export interface MonthlyVolume {
  month: string; // e.g. "Sep 2026"
  searches: number;
}

export interface VolumeData {
  provider: "free-signals" | "google-ads";
  exactVolume: number | null;
  note: string;
  /**
   * Keyword Planner ADVERTISER competition (how hard advertisers bid in
   * Google Ads) — a different thing from the SERP difficulty score, and
   * always labelled as such in the UI. Only set by the google-ads provider.
   */
  googleCompetition?: "LOW" | "MEDIUM" | "HIGH" | null;
  /** Advertiser competition index, 0-100. */
  googleCompetitionIndex?: number | null;
  /** Most recent monthly search volumes first, up to 3 entries. */
  monthlyVolumes?: MonthlyVolume[];
}

/* ---------------- Google Ads API (Keyword Planner) ---------------- */

const ADS_API_VERSION = "v23";
const ADS_TIMEOUT_MS = 8_000;

interface AdsConfig {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  customerId: string; // digits only
  loginCustomerId: string; // digits only
}

function adsConfig(): AdsConfig | null {
  const clientId = process.env.GOOGLE_ADS_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_ADS_REFRESH_TOKEN;
  const customerId = process.env.GOOGLE_ADS_CUSTOMER_ID?.replace(/\D/g, "");
  const loginCustomerId = process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID?.replace(/\D/g, "");
  if (!clientId || !clientSecret || !refreshToken || !customerId || !loginCustomerId) return null;
  return { clientId, clientSecret, refreshToken, customerId, loginCustomerId };
}

let adsTokenCache: { token: string; expiresAt: number } | null = null;

async function adsAccessToken(cfg: AdsConfig): Promise<string | null> {
  if (adsTokenCache && Date.now() < adsTokenCache.expiresAt) return adsTokenCache.token;
  try {
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: cfg.clientId,
        client_secret: cfg.clientSecret,
        refresh_token: cfg.refreshToken,
        grant_type: "refresh_token",
      }),
      signal: AbortSignal.timeout(ADS_TIMEOUT_MS),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { access_token?: string; expires_in?: number };
    if (!json.access_token) return null;
    const ttlMs = (typeof json.expires_in === "number" ? json.expires_in : 3600) * 1000;
    // Cache the token until ~5 minutes before it actually expires.
    adsTokenCache = {
      token: json.access_token,
      expiresAt: Date.now() + Math.max(0, ttlMs - 5 * 60_000),
    };
    return json.access_token;
  } catch {
    return null;
  }
}

const MONTH_NUMBER: Record<string, number> = {
  JANUARY: 1, FEBRUARY: 2, MARCH: 3, APRIL: 4, MAY: 5, JUNE: 6,
  JULY: 7, AUGUST: 8, SEPTEMBER: 9, OCTOBER: 10, NOVEMBER: 11, DECEMBER: 12,
};
const MONTH_LABEL = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

interface PlannerMetrics {
  avgMonthlySearches: number;
  competition: "LOW" | "MEDIUM" | "HIGH" | null;
  competitionIndex: number | null;
  monthlyVolumes: MonthlyVolume[];
}

type PlannerResult =
  | { status: "ok"; metrics: PlannerMetrics }
  | { status: "no-data" }
  | { status: "error" };

async function fetchPlannerMetrics(
  cfg: AdsConfig,
  accessToken: string,
  keyword: string,
  geoTargetId: number,
): Promise<PlannerResult> {
  try {
    const res = await fetch(
      `https://googleads.googleapis.com/${ADS_API_VERSION}/customers/${cfg.customerId}:generateKeywordHistoricalMetrics`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "login-customer-id": cfg.loginCustomerId,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          keywords: [keyword],
          geoTargetConstants: [`geoTargetConstants/${geoTargetId}`],
          language: "languageConstants/1000",
          keywordPlanNetwork: "GOOGLE_SEARCH",
        }),
        signal: AbortSignal.timeout(ADS_TIMEOUT_MS),
      },
    );
    if (!res.ok) return { status: "error" };
    const json = (await res.json()) as {
      results?: {
        text?: string;
        keywordMetrics?: {
          avgMonthlySearches?: string | number | null;
          competition?: string | null;
          competitionIndex?: string | number | null;
          monthlySearchVolumes?: {
            month?: string | number;
            year?: string | number;
            monthlySearches?: string | number | null;
          }[];
        } | null;
      }[];
    };
    const results = json.results ?? [];
    const match =
      results.find((r) => (r.text ?? "").toLowerCase() === keyword.toLowerCase()) ?? results[0];
    const km = match?.keywordMetrics;
    if (!km || km.avgMonthlySearches === null || km.avgMonthlySearches === undefined || km.avgMonthlySearches === "") {
      // The API answered, but Planner holds no metrics for this keyword in
      // this geo — a real "no data", not a failure.
      return { status: "no-data" };
    }
    const avg = Number(km.avgMonthlySearches);
    if (!Number.isFinite(avg)) return { status: "no-data" };

    const monthly: { y: number; m: number; searches: number }[] = [];
    for (const v of km.monthlySearchVolumes ?? []) {
      const m =
        typeof v.month === "number" ? v.month : MONTH_NUMBER[String(v.month ?? "").toUpperCase()];
      const y = Number(v.year);
      const searches = Number(v.monthlySearches);
      if (m && Number.isFinite(y) && Number.isFinite(searches)) monthly.push({ y, m, searches });
    }
    monthly.sort((a, b) => b.y - a.y || b.m - a.m);

    const compIndex = km.competitionIndex == null ? null : Number(km.competitionIndex);
    return {
      status: "ok",
      metrics: {
        avgMonthlySearches: avg,
        competition:
          km.competition === "LOW" || km.competition === "MEDIUM" || km.competition === "HIGH"
            ? km.competition
            : null,
        competitionIndex: compIndex !== null && Number.isFinite(compIndex) ? compIndex : null,
        monthlyVolumes: monthly.slice(0, 3).map((v) => ({
          month: `${MONTH_LABEL[v.m - 1]} ${v.y}`,
          searches: v.searches,
        })),
      },
    };
  } catch {
    return { status: "error" };
  }
}

export async function getVolumeData(
  keyword: string,
  countryCode: string,
  context: { suggestionsCount: number; trendsStatus: string },
): Promise<VolumeData> {
  const demandTail = `Demand signal here is based on ${context.suggestionsCount} Google Autocomplete suggestion(s) and Trends status: ${context.trendsStatus}.`;

  // No Ads credentials configured -> the original free-signals behaviour,
  // word for word.
  const cfg = adsConfig();
  if (!cfg) {
    return {
      provider: "free-signals",
      exactVolume: null,
      note: `No exact monthly volume in the free version — that figure comes from the Google Keyword Planner / Google Ads API. ${demandTail}`,
    };
  }

  const country = resolveCountry(countryCode);
  if (!country.geoTargetId) {
    return {
      provider: "free-signals",
      exactVolume: null,
      note: `Exact volume is not available for ${country.name} yet — this tool has no Keyword Planner geo target configured for that market, and no other country's data was substituted. ${demandTail}`,
    };
  }

  const token = await adsAccessToken(cfg);
  const result = token
    ? await fetchPlannerMetrics(cfg, token, keyword, country.geoTargetId)
    : ({ status: "error" } as PlannerResult);

  if (result.status === "error") {
    return {
      provider: "free-signals",
      exactVolume: null,
      note: `The Google Keyword Planner lookup failed just now, so no exact volume is shown — a volume number is never estimated or invented. ${demandTail}`,
    };
  }
  if (result.status === "no-data") {
    return {
      provider: "google-ads",
      exactVolume: null,
      note: `Keyword Planner has no data for this keyword in ${country.name}.`,
    };
  }
  return {
    provider: "google-ads",
    exactVolume: result.metrics.avgMonthlySearches,
    note: `Exact volume from Google Keyword Planner for ${country.name} — the average monthly searches over the last 12 months.`,
    googleCompetition: result.metrics.competition,
    googleCompetitionIndex: result.metrics.competitionIndex,
    monthlyVolumes: result.metrics.monthlyVolumes,
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

async function fetchText(
  url: string,
  timeoutMs: number = TIMEOUT_MS,
): Promise<{ status: number; body: string } | null> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": UA,
        Accept: "text/html,application/xhtml+xml,application/json,text/plain,*/*",
        "Accept-Language": "en-US,en;q=0.9",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(Math.max(500, timeoutMs)),
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

/** Yahoo result links hide the target in a `/RU=<url-encoded>/RK=` segment. */
function unwrapYahoo(href: string): string {
  const m = decodeEntities(href).match(/\/RU=([^/]+)\/RK=/);
  if (m) {
    try {
      const decoded = decodeURIComponent(m[1]);
      if (/^https?:\/\//.test(decoded)) return decoded;
    } catch {
      /* fall through */
    }
  }
  return href;
}

function parseYahoo(html: string): SerpResult[] {
  const results: SerpResult[] = [];
  const anchors = [
    ...html.matchAll(/<h3[^>]*class="[^"]*title[^"]*"[^>]*>\s*<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi),
  ];
  const snippets = [
    ...html.matchAll(/<div[^>]*class="[^"]*compText[^"]*"[^>]*>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/gi),
  ];
  anchors.forEach((m, i) => {
    const url = unwrapYahoo(m[1]);
    const domain = domainOf(url);
    if (!url || !domain || domain.includes("yahoo.com")) return;
    results.push({
      rank: results.length + 1,
      title: stripTags(m[2]),
      url,
      domain,
      snippet: snippets[i] ? stripTags(snippets[i][1]) : "",
    });
  });
  return results.slice(0, 10);
}

function parseMojeek(html: string): SerpResult[] {
  const results: SerpResult[] = [];
  const anchors = [
    ...html.matchAll(/<a[^>]*class="[^"]*\btitle\b[^"]*"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi),
  ];
  const snippets = [
    ...html.matchAll(/<p[^>]*class="[^"]*\bs\b[^"]*"[^>]*>([\s\S]*?)<\/p>/gi),
  ];
  anchors.forEach((m, i) => {
    const url = decodeEntities(m[1]);
    const domain = domainOf(url);
    if (!url || !domain || domain.includes("mojeek.com")) return;
    results.push({
      rank: results.length + 1,
      title: stripTags(m[2]),
      url,
      domain,
      snippet: snippets[i] ? stripTags(snippets[i][1]) : "",
    });
  });
  return results.slice(0, 10);
}

/** A score is only ever built on a real sample: at least 5 results. */
const MIN_SERP_RESULTS = 5;

function dropJunk(results: SerpResult[]): SerpResult[] {
  return results
    .filter((r) => !/moved permanently|access denied|just a moment|are you a robot|captcha/i.test(r.title))
    .map((r, i) => ({ ...r, rank: i + 1 }));
}

type SerpSample = { source: string; results: SerpResult[]; approxCount: number | null };

/** Whole SERP race gets ~14s max across both passes. */
const SERP_BUDGET_MS = 14_000;
const SERP_FETCH_TIMEOUT_MS = 5_000;

/**
 * Resolve with the first attempt that yields a usable sample; resolve null
 * only once every attempt has settled without one. Losing attempts are
 * left to finish on their own per-fetch timeout — nothing waits on them.
 */
function firstSerpSuccess(
  attempts: Promise<SerpSample | null>[],
): Promise<SerpSample | null> {
  return new Promise((resolve) => {
    if (attempts.length === 0) return resolve(null);
    let pending = attempts.length;
    let done = false;
    const settle = (sample: SerpSample | null) => {
      if (done) return;
      if (sample) {
        done = true;
        resolve(sample);
        return;
      }
      pending -= 1;
      if (pending === 0) resolve(null);
    };
    for (const p of attempts) {
      p.then(settle, () => settle(null));
    }
  });
}

async function fetchSerpPass(
  keyword: string,
  country: Country,
  deadline: number,
): Promise<SerpSample | null> {
  const q = encodeURIComponent(keyword);
  // Geo parameters for the requested country — never substituted with
  // another country's. DDG only publishes `kl` codes for some countries;
  // without one the DDG request goes unregionalized and Bing (which always
  // receives `cc`) carries the localization.
  const kl = country.ddgKl ? `&kl=${country.ddgKl}` : "";
  const label = (source: string) => `${source} · ${country.name}`;
  const left = () => deadline - Date.now();
  const t = () => Math.min(SERP_FETCH_TIMEOUT_MS, left());
  if (left() <= 1_200) return null;

  // Every applicable source is queried CONCURRENTLY and the first one to
  // return >= MIN_SERP_RESULTS parseable results wins the pass. (The old
  // sequential chain burned the whole budget on the first sources' timeouts
  // and often never reached Mojeek/Yahoo at all.)
  const timeout = t();

  // DuckDuckGo HTML
  const tryDdgHtml = async (): Promise<SerpSample | null> => {
    const ddg = await fetchText(`https://html.duckduckgo.com/html/?q=${q}${kl}`, timeout);
    if (ddg && ddg.status === 200) {
      const r = dropJunk(parseDdgHtml(ddg.body));
      if (r.length >= MIN_SERP_RESULTS) return { source: label("DuckDuckGo"), results: r, approxCount: null };
    }
    return null;
  };
  // DuckDuckGo Lite (same engine, lighter page — often survives when the
  // HTML endpoint is bot-checked with a 202/403)
  const tryDdgLite = async (): Promise<SerpSample | null> => {
    const lite = await fetchText(`https://lite.duckduckgo.com/lite/?q=${q}${kl}`, timeout);
    if (lite && lite.status === 200) {
      const lr = dropJunk(parseDdgLite(lite.body));
      if (lr.length >= MIN_SERP_RESULTS) return { source: label("DuckDuckGo (Lite)"), results: lr, approxCount: null };
    }
    return null;
  };
  // Bing — Bing occasionally answers a degraded page with a single junk
  // result, so two URL variants run in the race; either can win. Both
  // target the SAME requested country (`cc`, plus `setmkt` where Bing
  // defines a market for it).
  const mkt = country.bingMkt ? `&setmkt=${country.bingMkt}` : "";
  const tryBing = async (url: string): Promise<SerpSample | null> => {
    const bing = await fetchText(url, timeout);
    if (bing && bing.status === 200) {
      const { results, approxCount } = parseBing(bing.body);
      const clean = dropJunk(results);
      if (clean.length >= MIN_SERP_RESULTS) return { source: label("Bing"), results: clean, approxCount };
    }
    return null;
  };
  // Mojeek — an independent index (not Bing/Google), usually tolerant of
  // server-side fetches. Mojeek has NO country parameter, so its sample is
  // a global index and the label says exactly that — it is never dressed up
  // as a country-targeted sample.
  const tryMojeek = async (): Promise<SerpSample | null> => {
    const mojeek = await fetchText(`https://www.mojeek.com/search?q=${q}`, timeout);
    if (mojeek && mojeek.status === 200) {
      const mr = dropJunk(parseMojeek(mojeek.body));
      if (mr.length >= MIN_SERP_RESULTS) {
        return { source: "Mojeek · global index (not country-targeted)", results: mr, approxCount: null };
      }
    }
    return null;
  };
  // Yahoo Search — Bing-powered but a different host that often answers
  // when bing.com degrades. Yahoo localizes by regional host, so it only
  // joins the race for countries that have one (see countries.ts
  // `yahooHost`).
  const tryYahoo = async (): Promise<SerpSample | null> => {
    const yahoo = await fetchText(`https://${country.yahooHost}/search?p=${q}`, timeout);
    if (yahoo && yahoo.status === 200) {
      const yr = dropJunk(parseYahoo(yahoo.body));
      if (yr.length >= MIN_SERP_RESULTS) return { source: label("Yahoo"), results: yr, approxCount: null };
    }
    return null;
  };

  const attempts: Promise<SerpSample | null>[] = [
    tryDdgHtml(),
    tryDdgLite(),
    tryBing(`https://www.bing.com/search?q=${q}&count=10&cc=${country.code}${mkt}`),
    tryBing(
      `https://www.bing.com/search?q=${q}&count=10&setlang=en&cc=${country.code}${mkt}&form=QBRE`,
    ),
    tryMojeek(),
  ];
  if (country.yahooHost) attempts.push(tryYahoo());
  return firstSerpSuccess(attempts);
}

async function fetchSerp(keyword: string, country: Country): Promise<SerpSample | null> {
  const deadline = Date.now() + SERP_BUDGET_MS;
  // One full pass through every source; if all of them come back thin
  // (bot-checks and degraded pages are usually transient), wait ~1.8s and
  // run the whole chain once more before giving up.
  for (let pass = 0; pass < 2; pass++) {
    if (pass > 0) {
      if (deadline - Date.now() < 3_000) break;
      await new Promise((r) => setTimeout(r, 1_800));
    }
    const sample = await fetchSerpPass(keyword, country, deadline);
    if (sample) return sample;
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
        `Every SERP source tried (DuckDuckGo, Bing, Mojeek, and Yahoo where the country has a regional host — each retried once) failed or returned too few parseable results for ${country.name} this time (a score needs a sample of at least 5), so no difficulty score was calculated — a score is never invented, and no other country's results were substituted. Please try again in a minute.`,
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
