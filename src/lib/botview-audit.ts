/**
 * BotView audit engine — SEO / AEO / GEO checks for any public URL.
 *
 * The GEO category ports the checks and point weights of the original
 * zero-dependency Python BotView CLI (github.com/rootsiemen/botview):
 * llms.txt 16, llms.txt links 6, llms-full.txt 4, AI crawlers 12,
 * JSON-LD 10, entity schema 6, readable text 8, SSR content 2 — rescaled
 * to /100 the same way the CLI rescales (earned / max).
 *
 * Ported from the standalone BotView web checker (botview-web) to run
 * natively on frinjo.me/botview.
 */

export type CheckStatus = "pass" | "warn" | "fail";

export interface Check {
  name: string;
  status: CheckStatus;
  detail: string;
  fix: string;
  /** fraction of the check's weight earned: 1, 0.5 or 0 */
  earned: number;
  weight: number;
}

export interface CategoryResult {
  score: number; // 0–100
  checks: Check[];
}

export interface AuditResult {
  url: string;
  finalUrl: string;
  fetchedAt: string;
  scores: { seo: number; aeo: number; geo: number; overall: number };
  categories: { seo: CategoryResult; aeo: CategoryResult; geo: CategoryResult };
  aiBots: Record<string, "allowed" | "blocked" | "not mentioned" | "unknown (no robots.txt)">;
  schemaTypes: string[];
  error?: string;
}

const UA =
  "Mozilla/5.0 (compatible; BotView/1.0; +https://frinjo.me/botview)";
const TIMEOUT_MS = 10000;

export const AI_BOTS = [
  "GPTBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-Web",
  "PerplexityBot",
  "Google-Extended",
  "CCBot",
  "Bytespider",
];

async function fetchText(
  url: string,
): Promise<{ status: number; body: string; finalUrl: string } | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "text/html,application/xhtml+xml,text/plain,*/*" },
      redirect: "follow",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const body = await res.text();
    return { status: res.status, body, finalUrl: res.url || url };
  } catch {
    return null;
  }
}

/* ---------------- robots.txt parsing (ported from botview.py) ---------------- */

export function parseRobots(
  text: string | null,
): Record<string, "allowed" | "blocked" | "not mentioned" | "unknown (no robots.txt)"> {
  const out: Record<string, "allowed" | "blocked" | "not mentioned" | "unknown (no robots.txt)"> = {};
  if (!text) {
    for (const b of AI_BOTS) out[b] = "unknown (no robots.txt)";
    return out;
  }
  // group rules by user-agent block, like the Python version: an agent is
  // "blocked" when a block naming it (or *) disallows "/".
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
  for (const bot of AI_BOTS) {
    const b = bot.toLowerCase();
    let verdict: "allowed" | "blocked" | "not mentioned" = "not mentioned";
    for (const g of groups) {
      if (g.agents.includes(b)) {
        verdict = g.disallowAll ? "blocked" : "allowed";
        break;
      }
    }
    if (verdict === "not mentioned") {
      const star = groups.find((g) => g.agents.includes("*"));
      if (star) verdict = star.disallowAll ? "blocked" : "allowed";
      else verdict = "allowed";
      // botview.py reports unmentioned bots as "allowed (not blocked)";
      // we keep that semantics but surface "not mentioned" only for the
      // table when there is no wildcard group either.
      if (!star) verdict = "allowed";
    }
    out[bot] = verdict;
  }
  return out;
}

/* ---------------- tiny HTML extraction (no dependencies) ---------------- */

function stripTags(s: string): string {
  return s
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;|&apos;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function visibleText(html: string): string {
  const noScripts = html
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ");
  return stripTags(noScripts);
}

function attr(tag: string, name: string): string | null {
  const m = tag.match(
    new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"),
  );
  return m ? (m[1] ?? m[2] ?? m[3] ?? "") : null;
}

function collectSchemaTypes(html: string): string[] {
  const types = new Set<string>();
  const blocks = html.match(
    /<script[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  );
  if (!blocks) return [];
  for (const block of blocks) {
    const inner = block.replace(/<script[^>]*>/i, "").replace(/<\/script>/i, "");
    const walk = (node: unknown): void => {
      if (Array.isArray(node)) return node.forEach(walk);
      if (node && typeof node === "object") {
        const rec = node as Record<string, unknown>;
        const t = rec["@type"];
        if (typeof t === "string") types.add(t);
        if (Array.isArray(t)) t.forEach((x) => typeof x === "string" && types.add(x));
        Object.values(rec).forEach(walk);
      }
    };
    try {
      walk(JSON.parse(inner));
    } catch {
      // unparseable JSON-LD — fall back to regex like botview.py does
      for (const m of inner.matchAll(/"@type"\s*:\s*"([^"]+)"/g)) types.add(m[1]);
    }
  }
  return [...types].sort();
}

/* ---------------- check helpers ---------------- */

function mk(
  name: string,
  status: CheckStatus,
  detail: string,
  fix: string,
  weight = 2,
): Check {
  return {
    name,
    status,
    detail,
    fix,
    earned: status === "pass" ? 1 : status === "warn" ? 0.5 : 0,
    weight,
  };
}

function scoreOf(checks: Check[]): number {
  const max = checks.reduce((s, c) => s + c.weight, 0);
  const got = checks.reduce((s, c) => s + c.weight * c.earned, 0);
  return max ? Math.round((got / max) * 100) : 0;
}

function normalizeUrl(input: string): string | null {
  let u = input.trim();
  if (!u) return null;
  if (!/^https?:\/\//i.test(u)) u = "https://" + u;
  try {
    const parsed = new URL(u);
    if (!/^https?:$/.test(parsed.protocol)) return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

/* ---------------- main audit ---------------- */

export async function runAudit(input: string): Promise<AuditResult> {
  const target = normalizeUrl(input);
  const base: AuditResult = {
    url: input,
    finalUrl: target ?? input,
    fetchedAt: new Date().toISOString(),
    scores: { seo: 0, aeo: 0, geo: 0, overall: 0 },
    categories: {
      seo: { score: 0, checks: [] },
      aeo: { score: 0, checks: [] },
      geo: { score: 0, checks: [] },
    },
    aiBots: {},
    schemaTypes: [],
  };
  if (!target) {
    return { ...base, error: "That doesn't look like a valid URL. Try something like https://example.com" };
  }

  const page = await fetchText(target);
  if (!page) {
    return {
      ...base,
      error: `Could not fetch ${target} — the site is unreachable or took longer than ${TIMEOUT_MS / 1000}s to respond.`,
    };
  }

  const finalUrl = page.finalUrl || target;
  const origin = new URL(finalUrl).origin;
  const html = page.body;
  const [robotsRes, sitemapRes, llmsRes, llmsFullRes] = await Promise.all([
    fetchText(origin + "/robots.txt"),
    fetchText(origin + "/sitemap.xml"),
    fetchText(origin + "/llms.txt"),
    fetchText(origin + "/llms-full.txt"),
  ]);

  const robotsText = robotsRes && robotsRes.status === 200 ? robotsRes.body : null;
  const aiBots = parseRobots(robotsText);
  const schemaTypes = collectSchemaTypes(html);
  const text = visibleText(html);
  const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
  const textRatio = html.length ? text.length / html.length : 0;

  /* ---------- SEO ---------- */
  const seo: Check[] = [];
  const final = new URL(finalUrl);
  seo.push(
    mk(
      "HTTPS enabled",
      final.protocol === "https:" ? "pass" : "fail",
      final.protocol === "https:" ? "Final URL is HTTPS" : `Final URL is ${final.protocol}`,
      "Serve the site over HTTPS and redirect HTTP → HTTPS.",
    ),
  );
  seo.push(
    mk(
      "Homepage returns 200",
      page.status === 200 ? "pass" : "fail",
      `HTTP ${page.status}`,
      "Fix server errors/redirects so the page itself returns 200.",
    ),
  );
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? stripTags(titleMatch[1]) : "";
  seo.push(
    !title
      ? mk("Title tag", "fail", "Missing", "Add a unique <title> of 30–60 characters.")
      : title.length >= 30 && title.length <= 60
        ? mk("Title tag", "pass", `${title.length} chars: “${title.slice(0, 60)}”`, "")
        : mk(
            "Title tag",
            "warn",
            `${title.length} chars (ideal 30–60): “${title.slice(0, 60)}”`,
            "Rewrite the title to 30–60 characters, keyword first.",
          ),
  );
  const metaTags = html.match(/<meta\b[^>]*>/gi) ?? [];
  const descTag = metaTags.find((t) => (attr(t, "name") ?? "").toLowerCase() === "description");
  const desc = descTag ? (attr(descTag, "content") ?? "").trim() : "";
  seo.push(
    !desc
      ? mk("Meta description", "fail", "Missing", "Add a meta description (≤160 chars) written to earn the click.")
      : desc.length <= 160
        ? mk("Meta description", "pass", `${desc.length} chars`, "")
        : mk("Meta description", "warn", `${desc.length} chars — over the 160-char limit`, "Shorten the meta description to ≤160 characters."),
  );
  const linkTags = html.match(/<link\b[^>]*>/gi) ?? [];
  const canonTag = linkTags.find((t) => (attr(t, "rel") ?? "").toLowerCase() === "canonical");
  const canonical = canonTag ? (attr(canonTag, "href") ?? "") : "";
  const norm = (u: string) => {
    try {
      const p = new URL(u, origin);
      return (p.origin + p.pathname).replace(/\/$/, "") || p.origin;
    } catch {
      return u;
    }
  };
  seo.push(
    !canonical
      ? mk("Canonical URL", "fail", "Missing", "Add a self-referencing canonical tag.")
      : norm(canonical) === norm(finalUrl)
        ? mk("Canonical URL", "pass", canonical, "")
        : mk("Canonical URL", "warn", `Points elsewhere: ${canonical}`, "Canonical should reference this page's own URL."),
  );
  const headings: { level: number; text: string }[] = [];
  for (const m of html.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi)) {
    headings.push({ level: Number(m[1]), text: stripTags(m[2]) });
  }
  const h1s = headings.filter((h) => h.level === 1);
  seo.push(
    mk(
      "Exactly one H1",
      h1s.length === 1 ? "pass" : "fail",
      `${h1s.length} H1 found${h1s[0] ? `: “${h1s[0].text.slice(0, 60)}”` : ""}`,
      "Use exactly one H1 per page — the page's main headline.",
    ),
  );
  let orderSane = true;
  for (let i = 1; i < headings.length; i++) {
    if (headings[i].level > headings[i - 1].level + 1) orderSane = false;
  }
  seo.push(
    mk(
      "Heading order",
      headings.length === 0 ? "fail" : orderSane ? "pass" : "warn",
      headings.length === 0 ? "No headings found" : `${headings.length} headings, ${orderSane ? "no skipped levels" : "levels are skipped"}`,
      "Don't skip heading levels (e.g. H1 → H3); keep a logical outline.",
    ),
  );
  const imgs = html.match(/<img\b[^>]*>/gi) ?? [];
  const withAlt = imgs.filter((t) => (attr(t, "alt") ?? "").trim().length > 0).length;
  const altPct = imgs.length ? Math.round((withAlt / imgs.length) * 100) : 100;
  seo.push(
    mk(
      "Image alt text",
      imgs.length === 0 || altPct >= 80 ? "pass" : altPct >= 50 ? "warn" : "fail",
      imgs.length === 0 ? "No images on page" : `${withAlt}/${imgs.length} images have alt text (${altPct}%)`,
      "Add descriptive alt text to images (aim for ≥80% coverage).",
    ),
  );
  let internal = 0;
  let external = 0;
  for (const m of html.matchAll(/<a\b[^>]*\bhref\s*=\s*(?:"([^"]*)"|'([^']*)')/gi)) {
    const href = m[1] ?? m[2] ?? "";
    if (!href || href.startsWith("#") || /^(mailto:|tel:|javascript:)/i.test(href)) continue;
    try {
      const u = new URL(href, finalUrl);
      if (u.hostname === final.hostname) internal++;
      else if (/^https?:$/.test(u.protocol)) external++;
    } catch {
      /* ignore */
    }
  }
  seo.push(
    mk(
      "Internal links",
      internal >= 3 ? "pass" : internal >= 1 ? "warn" : "fail",
      `${internal} internal links`,
      "Link to your own related pages (3+) so crawlers discover them.",
    ),
  );
  seo.push(
    mk(
      "External links",
      external >= 1 ? "pass" : "warn",
      `${external} external links`,
      "Link out to authoritative sources where relevant — it builds trust.",
      1,
    ),
  );
  seo.push(
    mk(
      "robots.txt present",
      robotsRes && robotsRes.status === 200 ? "pass" : "fail",
      robotsRes ? `HTTP ${robotsRes.status}` : "Not found",
      "Publish a robots.txt at the site root.",
    ),
  );
  const sitemapUrls = sitemapRes && sitemapRes.status === 200 ? (sitemapRes.body.match(/<loc>/g) ?? []).length : 0;
  seo.push(
    mk(
      "sitemap.xml present",
      sitemapUrls > 0 ? "pass" : "fail",
      sitemapUrls > 0 ? `${sitemapUrls} URLs listed` : "Missing or empty",
      "Publish a sitemap.xml listing canonical URLs and reference it in robots.txt.",
    ),
  );
  const hasViewport = metaTags.some((t) => (attr(t, "name") ?? "").toLowerCase() === "viewport");
  seo.push(
    mk(
      "Mobile viewport meta",
      hasViewport ? "pass" : "fail",
      hasViewport ? "Present" : "Missing",
      'Add <meta name="viewport" content="width=device-width, initial-scale=1">.',
    ),
  );
  const ogProps = ["og:title", "og:description", "og:image"]
    .filter((p) => metaTags.some((t) => (attr(t, "property") ?? "").toLowerCase() === p));
  seo.push(
    mk(
      "OpenGraph tags",
      ogProps.length === 3 ? "pass" : ogProps.length > 0 ? "warn" : "fail",
      ogProps.length ? `Found: ${ogProps.join(", ")}` : "None found",
      "Add og:title, og:description and og:image for social/AI previews.",
    ),
  );
  seo.push(
    mk(
      "Word count",
      words >= 300 ? "pass" : words >= 150 ? "warn" : "fail",
      `${words} words of readable text`,
      "Thin pages rank poorly — aim for 300+ words of real content.",
    ),
  );
  const sizeKb = Math.round(html.length / 1024);
  seo.push(
    mk(
      "HTML size",
      sizeKb <= 200 ? "pass" : sizeKb <= 500 ? "warn" : "fail",
      `${sizeKb} KB of HTML`,
      "Bloated HTML slows crawling and rendering — trim inline scripts/styles.",
      1,
    ),
  );

  /* ---------- AEO (answer-engine optimisation) ---------- */
  const aeo: Check[] = [];
  const answerSchema = schemaTypes.filter((t) => /FAQPage|HowTo|QAPage/i.test(t));
  aeo.push(
    mk(
      "FAQ / HowTo / Q&A schema",
      answerSchema.length ? "pass" : "fail",
      answerSchema.length ? `Found: ${answerSchema.join(", ")}` : "No FAQPage, HowTo or QAPage schema",
      "Mark up genuine Q&A content with FAQPage schema so answer engines can quote it.",
      3,
    ),
  );
  const questionHeadings = headings.filter(
    (h) => /\?$/.test(h.text) || /^(how|what|why|when|where|which|who|can|does|is|are)\b/i.test(h.text),
  );
  aeo.push(
    mk(
      "Question-style headings",
      questionHeadings.length >= 2 ? "pass" : questionHeadings.length === 1 ? "warn" : "fail",
      `${questionHeadings.length} question headings${questionHeadings[0] ? ` (e.g. “${questionHeadings[0].text.slice(0, 50)}”)` : ""}`,
      "Phrase section headings as the questions users ask — answer engines lift them directly.",
      3,
    ),
  );
  const paras = [...html.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((m) => stripTags(m[1]))
    .filter((t) => t.length > 0);
  const directAnswers = paras.filter((t) => {
    const w = t.split(/\s+/).length;
    return w >= 20 && w <= 60;
  });
  aeo.push(
    mk(
      "Direct-answer paragraphs",
      directAnswers.length >= 2 ? "pass" : directAnswers.length === 1 ? "warn" : "fail",
      `${directAnswers.length} short answer-length paragraphs (20–60 words)`,
      "Put a concise 20–60 word answer right under each question heading — that's the snippet AI quotes.",
      2,
    ),
  );
  const hasListOrTable = /<(ul|ol|table)\b/i.test(html);
  aeo.push(
    mk(
      "Lists or tables for extraction",
      hasListOrTable ? "pass" : "fail",
      hasListOrTable ? "List/table markup present" : "No list or table found",
      "Present steps, comparisons and specs as lists/tables — easy for AI to extract and cite.",
      2,
    ),
  );

  /* ---------- GEO (BotView port) ---------- */
  const geo: Check[] = [];
  const llmsOk = !!llmsRes && llmsRes.status === 200 && llmsRes.body.lstripStartsWithHash();
  const llmsPresent = !!llmsRes && llmsRes.status === 200;
  geo.push({
    name: "llms.txt present & valid",
    status: llmsOk ? "pass" : llmsPresent ? "warn" : "fail",
    detail: llmsOk ? "Found and starts with a # heading" : llmsPresent ? "Found but doesn't start with #" : `HTTP ${llmsRes?.status ?? "—"}`,
    fix: "Publish an llms.txt at the root: a Markdown map of your key pages for AI crawlers.",
    earned: llmsOk ? 1 : 0,
    weight: 16,
  });
  const llmsLinks = llmsPresent ? (llmsRes!.body.match(/\[[^\]]+\]\(https?:\/\/[^)]+\)/g) ?? []).length : 0;
  geo.push({
    name: "llms.txt links to key pages",
    status: llmsLinks >= 3 ? "pass" : llmsLinks > 0 ? "warn" : "fail",
    detail: llmsPresent ? `${llmsLinks} links listed` : "No llms.txt",
    fix: "List at least 3 key pages as Markdown links in llms.txt.",
    earned: llmsLinks >= 3 ? 1 : llmsLinks > 0 ? 0.5 : 0,
    weight: 6,
  });
  const hasFull = !!llmsFullRes && llmsFullRes.status === 200;
  geo.push({
    name: "llms-full.txt (bonus)",
    status: hasFull ? "pass" : "warn",
    detail: hasFull ? "Found" : "Not present (optional bonus file)",
    fix: "Optionally publish llms-full.txt with the full text of key pages.",
    earned: hasFull ? 1 : 0,
    weight: 4,
  });
  const mainBots = ["GPTBot", "ClaudeBot", "PerplexityBot"];
  const blocked = AI_BOTS.filter((b) => aiBots[b] === "blocked");
  const mainBlocked = mainBots.filter((b) => aiBots[b] === "blocked");
  geo.push({
    name: "AI crawlers not blocked",
    status: mainBlocked.length ? "fail" : blocked.length ? "warn" : "pass",
    detail: blocked.length ? `Blocked: ${blocked.join(", ")}` : "GPTBot, ClaudeBot, PerplexityBot… all allowed",
    fix: "Remove Disallow rules for AI crawlers in robots.txt if you want AI search to cite you.",
    earned: mainBlocked.length ? 0 : blocked.length ? 0.5 : 1,
    weight: 12,
  });
  geo.push({
    name: "Structured data (JSON-LD)",
    status: schemaTypes.length ? "pass" : "fail",
    detail: schemaTypes.length ? schemaTypes.join(", ") : "No JSON-LD found",
    fix: "Add JSON-LD structured data describing the page and the business.",
    earned: schemaTypes.length ? 1 : 0,
    weight: 10,
  });
  const entityTypes = schemaTypes.filter((t) => /Organization|LocalBusiness|WebSite|Person/i.test(t));
  geo.push({
    name: "Entity schema (Organization / WebSite)",
    status: entityTypes.length ? "pass" : "fail",
    detail: entityTypes.length ? `Found: ${entityTypes.join(", ")}` : "No Organization or WebSite schema",
    fix: "Add Organization + WebSite JSON-LD so AI knows who you are — the entity behind the content.",
    earned: entityTypes.length ? 1 : 0,
    weight: 6,
  });
  geo.push({
    name: "Readable text content",
    status: textRatio > 0.05 ? "pass" : textRatio > 0.02 ? "warn" : "fail",
    detail: `Text is ${Math.round(textRatio * 100)}% of page weight (${text.length.toLocaleString()} chars an LLM can read)`,
    fix: "More real text, less markup bloat — LLMs read text, not divs.",
    earned: textRatio > 0.05 ? 1 : textRatio > 0.02 ? 0.5 : 0,
    weight: 8,
  });
  geo.push({
    name: "Content in raw HTML (SSR)",
    status: words >= 100 ? "pass" : words > 0 ? "warn" : "fail",
    detail:
      words >= 100
        ? `${words} words readable in the raw HTML — no JavaScript rendering needed`
        : "Little or no content in raw HTML — the page likely needs JavaScript to render, which many AI crawlers skip",
    fix: "Server-render (SSR/SSG) your main content so crawlers see it in the raw HTML.",
    earned: words >= 100 ? 1 : words > 0 ? 0.5 : 0,
    weight: 2,
  });

  const seoScore = scoreOf(seo);
  const aeoScore = scoreOf(aeo);
  const geoScore = scoreOf(geo);
  return {
    ...base,
    finalUrl,
    scores: {
      seo: seoScore,
      aeo: aeoScore,
      geo: geoScore,
      overall: Math.round((seoScore + aeoScore + geoScore) / 3),
    },
    categories: {
      seo: { score: seoScore, checks: seo },
      aeo: { score: aeoScore, checks: aeo },
      geo: { score: geoScore, checks: geo },
    },
    aiBots,
    schemaTypes,
  };
}

// String.prototype helper used above (kept dependency-free and explicit).
declare global {
  interface String {
    lstripStartsWithHash(): boolean;
  }
}
String.prototype.lstripStartsWithHash = function (this: string) {
  return this.replace(/^\s+/, "").startsWith("#");
};
