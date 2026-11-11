import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Low Value Audit API — fetches a published page server-side and extracts
 * the on-page signals the AdSense Low Value Content Checker scores:
 * visible-text word count, H2/H3 section count, paragraphs, images,
 * internal vs external links (vs the page's own host), list/table
 * presence, FAQ signal and the page title. It also returns the page HTML
 * normalised for the client-side scorer (scripts/styles removed, H1 and
 * H4–H6 demoted so the heading count equals H2/H3 sections, same-host
 * absolute links rewritten to relative paths so they count as internal)
 * plus the stripped main text for keyword-density / similarity checks.
 */

// Simple in-memory throttle: max 20 audits per IP per minute (per instance).
const hits = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_HITS = 20;

function throttled(ip: string): boolean {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  list.push(now);
  hits.set(ip, list);
  return list.length > MAX_HITS;
}

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 FrinjoLowValueChecker/1.0 (+https://frinjo.me/adsense-low-value-content-checker)";
const TIMEOUT_MS = 12_000;
const BODY_CAP = 1_500_000; // ~1.5 MB
const HTML_CAP = 1_000_000;
const TEXT_CAP = 100_000;

/* ------------------------------- SSRF guard ------------------------------- */

function isPrivateHost(hostname: string): boolean {
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

function normalizeUrl(raw: string): URL | null {
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
    /* already closed */
  }
  const buf = Buffer.concat(chunks.map((c) => Buffer.from(c)));
  return buf.subarray(0, cap).toString("utf-8");
}

/* ----------------------------- HTML extraction ---------------------------- */

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

function count(re: RegExp, s: string): number {
  return (s.match(re) ?? []).length;
}

function bareHost(hostname: string): string {
  return hostname.toLowerCase().replace(/^www\./, "");
}

/**
 * Normalise the fetched HTML for the client-side scorer:
 * - drop script/style/noscript/template/iframe blocks (no readable text);
 * - demote H1 and H4–H6 to <div> so the heading count the scorer sees is
 *   exactly the H2/H3 section count measured server-side;
 * - rewrite absolute links to the page's own host as root-relative paths
 *   so the scorer counts them as internal links.
 */
function normalizeHtmlForScorer(html: string, pageUrl: URL): string {
  let out = html
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<template[\s\S]*?<\/template>/gi, " ")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, " ");
  out = out
    .replace(/<(\/?)h1(\s[^>]*)?>/gi, "<$1div$2>")
    .replace(/<(\/?)h[456](\s[^>]*)?>/gi, "<$1div$2>");
  const host = bareHost(pageUrl.hostname);
  out = out.replace(
    /href\s*=\s*(["'])(https?:)?\/\/([^"'\/#?]+)([^"']*)\1/gi,
    (full, q: string, _scheme: string | undefined, linkHost: string, rest: string) => {
      if (bareHost(linkHost) === host) return `href=${q}${rest || "/"}${q}`;
      return full;
    },
  );
  return out.slice(0, HTML_CAP);
}

/* --------------------------------- handler -------------------------------- */

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (throttled(ip)) {
    return NextResponse.json(
      { error: "Too many checks from this network — please wait a minute and try again." },
      { status: 429 },
    );
  }

  let body: { url?: string };
  try {
    body = (await req.json()) as { url?: string };
  } catch {
    return NextResponse.json({ error: "Invalid request — send JSON { url }." }, { status: 400 });
  }

  const target = normalizeUrl(body.url ?? "");
  if (!target) {
    return NextResponse.json(
      { error: "That does not look like a valid URL. Paste the full address of a published page." },
      { status: 400 },
    );
  }
  if (isPrivateHost(target.hostname)) {
    return NextResponse.json(
      { error: "That address points to a local or private network host, which cannot be checked." },
      { status: 400 },
    );
  }

  let res: Response;
  try {
    res = await fetch(target.toString(), {
      headers: {
        "User-Agent": UA,
        Accept: "text/html,application/xhtml+xml,*/*",
        "Accept-Language": "en-US,en;q=0.9",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "Could not fetch that page — the site did not respond in time or refused the connection. Check the URL and try again.",
      },
      { status: 422 },
    );
  }

  const finalUrl = (() => {
    try {
      return new URL(res.url || target.toString());
    } catch {
      return target;
    }
  })();
  if (isPrivateHost(finalUrl.hostname)) {
    return NextResponse.json(
      { error: "That URL redirects to a local or private network host, which cannot be checked." },
      { status: 400 },
    );
  }
  if (!res.ok) {
    return NextResponse.json(
      { error: `The page returned HTTP ${res.status}. Only live, publicly reachable pages can be audited.` },
      { status: 422 },
    );
  }

  const html = await readCapped(res, BODY_CAP);

  /* ---- metrics ---- */
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? decodeEntities(titleMatch[1]).replace(/\s+/g, " ").trim() : "";

  const text = stripToText(html);
  const words = text ? text.split(/\s+/).filter(Boolean).length : 0;

  const h2 = count(/<h2[\s>]/gi, html);
  const h3 = count(/<h3[\s>]/gi, html);
  const headings = h2 + h3;
  const paragraphs = count(/<p[\s>]/gi, html);
  const images = count(/<img[\s>]/gi, html);

  let internalLinks = 0;
  let externalLinks = 0;
  const pageHost = bareHost(finalUrl.hostname);
  for (const m of html.matchAll(/<a\s[^>]*href\s*=\s*["']([^"']+)["']/gi)) {
    const href = m[1].trim();
    if (!href || href.startsWith("#")) continue;
    if (/^(mailto|tel|javascript|data):/i.test(href)) continue;
    try {
      const u = new URL(href, finalUrl);
      if (u.protocol !== "http:" && u.protocol !== "https:") continue;
      if (bareHost(u.hostname) === pageHost) internalLinks++;
      else externalLinks++;
    } catch {
      /* unparseable href — ignore */
    }
  }

  const hasList = /<(ul|ol|li)[\s>]/i.test(html);
  const hasTable = /<table[\s>]/i.test(html);

  const headingTexts: string[] = [];
  for (const m of html.matchAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/gi)) {
    headingTexts.push(stripToText(m[1]));
  }
  const questionHeadings = headingTexts.filter((t) => t.trim().endsWith("?")).length;
  const hasFaq =
    /"@type"\s*:\s*"FAQPage"/i.test(html) ||
    /frequently asked questions/i.test(text) ||
    /\bfaq\b/i.test(text) ||
    questionHeadings >= 2;

  return NextResponse.json(
    {
      url: target.toString(),
      finalUrl: finalUrl.toString(),
      status: res.status,
      title,
      metrics: {
        words,
        headings,
        paragraphs,
        images,
        internalLinks,
        externalLinks,
        hasList,
        hasTable,
        hasFaq,
      },
      text: text.slice(0, TEXT_CAP),
      html: normalizeHtmlForScorer(html, finalUrl),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
