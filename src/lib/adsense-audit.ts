/**
 * AdSense site audit engine — fetches a site ONCE (homepage, robots.txt,
 * sitemap.xml, ads.txt, policy-page probes) and returns every public
 * signal the /adsense tools render from: Site Checker, Approval Checker,
 * Eligibility, Ban Risk, ads.txt Checker and Publisher ID Finder.
 *
 * Honest scope: these are public readiness signals only. No tool can
 * confirm an official AdSense ban or guarantee approval.
 */

export interface AdsenseAudit {
  url: string;
  finalUrl: string;
  status: number;
  https: boolean;
  redirects: number;
  title: string;
  metaDescription: boolean;
  noindex: boolean;
  h1: boolean;
  words: number;
  internalLinks: number;
  iframeCount: number;
  iframeOnly: boolean;
  adsense: {
    found: boolean;
    caPubIds: string[];
    autoAdsLoader: boolean;
    manualUnits: number;
  };
  robots: {
    exists: boolean;
    blocksAll: boolean;
    blocksGooglebot: boolean;
    blocksMediapartners: boolean;
    blocksAdsbot: boolean;
  };
  sitemap: { exists: boolean; urlCount: number; isIndex: boolean };
  adsTxt: {
    exists: boolean;
    status: number;
    looksLikeHtml: boolean;
    lines: string[];
    hasGoogleLine: boolean;
    googlePubIds: string[];
  };
  policy: { about: boolean; contact: boolean; privacy: boolean; terms: boolean };
  error?: string;
}

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 FrinjoAdsenseChecker/1.0 (+https://frinjo.me/adsense)";
const TIMEOUT_MS = 10_000;
const BODY_CAP = 1_500_000;
const SMALL_CAP = 500_000;

/* ------------------------------- SSRF guard ------------------------------- */

export function isPrivateHost(hostname: string): boolean {
  const h = hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (h === "localhost" || h.endsWith(".localhost")) return true;
  if (h === "::1" || h === "0:0:0:0:0:0:0:1") return true;
  const m = h.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (m) {
    const a = Number(m[1]);
    const b = Number(m[2]);
    if (a === 127 || a === 10 || a === 0) return true;
    if (a === 192 && b === 168) return true;
    if (a === 169 && b === 254) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
  }
  return false;
}

export function normalizeSiteUrl(raw: string): URL | null {
  let s = (raw ?? "").trim();
  if (!s) return null;
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(s)) s = `https://${s}`;
  try {
    const u = new URL(s);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    return u;
  } catch {
    return null;
  }
}

/* ------------------------------ fetch helpers ----------------------------- */

async function readCapped(res: Response, cap: number): Promise<string> {
  if (!res.body) {
    const t = await res.text();
    return t.slice(0, cap);
  }
  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (total < cap) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      chunks.push(value);
      total += value.byteLength;
    }
  }
  try {
    await reader.cancel();
  } catch {
    /* closed */
  }
  return Buffer.concat(chunks.map((c) => Buffer.from(c)))
    .subarray(0, cap)
    .toString("utf-8");
}

interface FetchResult {
  status: number;
  body: string;
  finalUrl: string;
  redirects: number;
}

/** Manual redirect following so the chain length can be reported. */
async function fetchFollowing(start: string, cap: number, timeout = TIMEOUT_MS): Promise<FetchResult | null> {
  let current = start;
  let redirects = 0;
  for (let hop = 0; hop <= 5; hop++) {
    let res: Response;
    try {
      res = await fetch(current, {
        headers: { "User-Agent": UA, Accept: "text/html,application/xhtml+xml,text/plain,*/*", "Accept-Language": "en-US,en;q=0.9" },
        redirect: "manual",
        signal: AbortSignal.timeout(timeout),
      });
    } catch {
      return null;
    }
    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get("location");
      if (!loc || hop === 5) {
        return { status: res.status, body: "", finalUrl: current, redirects };
      }
      let next: URL;
      try {
        next = new URL(loc, current);
      } catch {
        return { status: res.status, body: "", finalUrl: current, redirects };
      }
      if (isPrivateHost(next.hostname)) return null;
      redirects++;
      current = next.toString();
      continue;
    }
    const body = await readCapped(res, cap);
    return { status: res.status, body, finalUrl: current, redirects };
  }
  return null;
}

async function probeExists(origin: string, paths: string[]): Promise<boolean> {
  for (const p of paths) {
    const r = await fetchFollowing(`${origin}${p}`, 2_000, 6_000);
    if (r && r.status >= 200 && r.status < 300) return true;
  }
  return false;
}

/* ------------------------------ text helpers ------------------------------ */

function decodeEntities(s: string): string {
  return s
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;|&apos;/gi, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

function stripToText(html: string): string {
  return decodeEntities(
    html
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<template[\s\S]*?<\/template>/gi, " ")
      .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();
}

function bareHost(hostname: string): string {
  return hostname.toLowerCase().replace(/^www\./, "");
}

/** Parse robots.txt groups; an agent is blocked when its group (or *) has Disallow: /. */
function parseRobotsBlocks(text: string): { googlebot: boolean; mediapartners: boolean; adsbot: boolean; all: boolean } {
  const groups: { agents: string[]; disallowAll: boolean }[] = [];
  let current: { agents: string[]; disallowAll: boolean } | null = null;
  let lastWasAgent = false;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.split("#")[0].trim();
    if (!line || !line.includes(":")) continue;
    const idx = line.indexOf(":");
    const k = line.slice(0, idx).trim().toLowerCase();
    const v = line.slice(idx + 1).trim();
    if (k === "user-agent") {
      if (!current || !lastWasAgent) {
        current = { agents: [], disallowAll: false };
        groups.push(current);
      }
      current.agents.push(v.toLowerCase());
      lastWasAgent = true;
    } else {
      lastWasAgent = false;
      if (k === "disallow" && v === "/" && current) current.disallowAll = true;
    }
  }
  const blocked = (agent: string) =>
    groups.some((g) => g.disallowAll && (g.agents.includes(agent) || g.agents.includes("*")));
  return {
    googlebot: blocked("googlebot"),
    mediapartners: blocked("mediapartners-google"),
    adsbot: blocked("adsbot-google"),
    all: groups.some((g) => g.disallowAll && g.agents.includes("*")),
  };
}

/* --------------------------------- audit ---------------------------------- */

export async function runAdsenseAudit(rawUrl: string): Promise<AdsenseAudit | { error: string }> {
  const target = normalizeSiteUrl(rawUrl);
  if (!target) return { error: "That does not look like a valid URL. Paste the site address, e.g. example.com." };
  if (isPrivateHost(target.hostname)) {
    return { error: "That address points to a local or private network host, which cannot be checked." };
  }

  const home = await fetchFollowing(target.toString(), BODY_CAP);
  if (!home) {
    return {
      error:
        "Could not fetch that site — it did not respond in time, refused the connection, or redirected somewhere unreachable. Check the address and try again.",
    };
  }
  if (home.status < 200 || home.status >= 400) {
    return { error: `The homepage returned HTTP ${home.status}. Only live, publicly reachable sites can be audited.` };
  }

  const finalUrl = new URL(home.finalUrl);
  const origin = finalUrl.origin;
  const html = home.body;
  const pageHost = bareHost(finalUrl.hostname);

  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? decodeEntities(titleMatch[1]).replace(/\s+/g, " ").trim() : "";
  const metaDescription = /<meta[^>]+name\s*=\s*["']description["'][^>]*content\s*=\s*["'][^"']{10,}["']/i.test(html);
  const noindex =
    /<meta[^>]+name\s*=\s*["']robots["'][^>]*content\s*=\s*["'][^"']*noindex/i.test(html) ||
    /<meta[^>]+content\s*=\s*["'][^"']*noindex["'][^>]*name\s*=\s*["']robots["']/i.test(html);
  const h1 = /<h1[\s>]/i.test(html);
  const text = stripToText(html);
  const words = text ? text.split(/\s+/).filter(Boolean).length : 0;

  let internalLinks = 0;
  for (const m of html.matchAll(/<a\s[^>]*href\s*=\s*["']([^"']+)["']/gi)) {
    const href = m[1].trim();
    if (!href || href.startsWith("#") || /^(mailto|tel|javascript|data):/i.test(href)) continue;
    try {
      const u = new URL(href, finalUrl);
      if ((u.protocol === "http:" || u.protocol === "https:") && bareHost(u.hostname) === pageHost) internalLinks++;
    } catch {
      /* ignore */
    }
  }

  const iframeCount = (html.match(/<iframe[\s>]/gi) ?? []).length;

  const caPubIds = Array.from(new Set(Array.from(html.matchAll(/ca-pub-\d+/gi)).map((m) => m[0].toLowerCase())));
  const adsenseFound =
    caPubIds.length > 0 || /adsbygoogle|pagead2\.googlesyndication\.com|googlesyndication\.com/i.test(html);
  const autoAdsLoader = /pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js/i.test(html);
  const manualUnits = (html.match(/data-ad-slot\s*=/gi) ?? []).length;

  const [robotsRes, sitemapRes, adsTxtRes, about, contact, privacy, terms] = await Promise.all([
    fetchFollowing(`${origin}/robots.txt`, SMALL_CAP, 8_000),
    fetchFollowing(`${origin}/sitemap.xml`, SMALL_CAP, 8_000),
    fetchFollowing(`${origin}/ads.txt`, SMALL_CAP, 8_000),
    probeExists(origin, ["/about", "/about-us"]),
    probeExists(origin, ["/contact", "/contact-us"]),
    probeExists(origin, ["/privacy-policy", "/privacy"]),
    probeExists(origin, ["/terms", "/terms-of-service", "/terms-and-conditions"]),
  ]);

  const robotsExists = !!robotsRes && robotsRes.status === 200 && !/^\s*</.test(robotsRes.body);
  const blocks = robotsExists
    ? parseRobotsBlocks(robotsRes!.body)
    : { googlebot: false, mediapartners: false, adsbot: false, all: false };

  const sitemapBody = sitemapRes && sitemapRes.status === 200 ? sitemapRes.body : "";
  const sitemapExists = !!sitemapBody && /<(urlset|sitemapindex)[\s>]/i.test(sitemapBody);
  const sitemapIsIndex = sitemapExists && /<sitemapindex[\s>]/i.test(sitemapBody);
  const sitemapUrlCount = sitemapExists ? (sitemapBody.match(/<loc>/gi) ?? []).length : 0;

  const adsStatus = adsTxtRes?.status ?? 0;
  const adsBody = adsTxtRes && adsStatus === 200 ? adsTxtRes.body : "";
  const adsLooksHtml = /^\s*<(?:!doctype|html)/i.test(adsBody);
  const adsExists = !!adsBody && !adsLooksHtml;
  const adsLines = adsExists
    ? adsBody.split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith("#"))
    : [];
  const googleLines = adsLines.filter((l) => /^google\.com\s*,/i.test(l));
  const googlePubIds = Array.from(
    new Set(googleLines.flatMap((l) => Array.from(l.matchAll(/pub-\d+/gi)).map((m) => m[0].toLowerCase()))),
  );

  return {
    url: target.toString(),
    finalUrl: home.finalUrl,
    status: home.status,
    https: finalUrl.protocol === "https:",
    redirects: home.redirects,
    title,
    metaDescription,
    noindex,
    h1,
    words,
    internalLinks,
    iframeCount,
    iframeOnly: iframeCount > 0 && words < 100,
    adsense: { found: adsenseFound, caPubIds, autoAdsLoader, manualUnits },
    robots: {
      exists: robotsExists,
      blocksAll: blocks.all,
      blocksGooglebot: blocks.googlebot,
      blocksMediapartners: blocks.mediapartners,
      blocksAdsbot: blocks.adsbot,
    },
    sitemap: { exists: sitemapExists, urlCount: sitemapUrlCount, isIndex: sitemapIsIndex },
    adsTxt: {
      exists: adsExists,
      status: adsStatus,
      looksLikeHtml: adsLooksHtml,
      lines: adsLines.slice(0, 200),
      hasGoogleLine: googleLines.length > 0,
      googlePubIds,
    },
    policy: { about, contact, privacy, terms },
  };
}
