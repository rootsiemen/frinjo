/**
 * Pure scoring/view models for the /adsense tools. Every view (Site
 * Checker, Approval, Eligibility, Ban Risk) is derived from the single
 * AdsenseAudit payload returned by /api/adsense-audit, so all tools agree
 * with each other.
 */
import type { AdsenseAudit } from "./adsense-audit";

export type CheckStatus = "pass" | "warn" | "fail";

export interface SiteCheck {
  name: string;
  status: CheckStatus;
  detail: string;
  fix: string;
  /** fraction of the check's weight earned: 0–1 */
  earned: number;
  weight: number;
}

export interface SiteReport {
  score: number;
  band: "Strong" | "Fair" | "Weak";
  checks: SiteCheck[];
  fixes: SiteCheck[];
}

function robotsBlocksAdsense(a: AdsenseAudit): boolean {
  return a.robots.blocksAll || a.robots.blocksMediapartners || a.robots.blocksAdsbot || a.robots.blocksGooglebot;
}

export function buildSiteReport(a: AdsenseAudit): SiteReport {
  const checks: SiteCheck[] = [];

  /* Access / HTTPS — 15 */
  checks.push({
    name: "Reachable over HTTPS",
    status: a.https ? "pass" : "warn",
    detail: a.https
      ? `Homepage loads at ${a.finalUrl} (HTTP ${a.status}${a.redirects ? `, ${a.redirects} redirect${a.redirects === 1 ? "" : "s"}` : ""}).`
      : `Homepage loads (HTTP ${a.status}) but the final URL is not HTTPS.`,
    fix: "Move the site to HTTPS — AdSense requires ads to serve on secure pages, and browsers flag HTTP pages as not secure.",
    earned: a.https ? 1 : 0.5,
    weight: 15,
  });

  /* Crawlability — 20 (robots 10, sitemap 5, noindex 5) */
  const blocked = robotsBlocksAdsense(a);
  checks.push({
    name: "robots.txt allows Google & AdSense crawlers",
    status: !a.robots.exists ? "warn" : blocked ? "fail" : "pass",
    detail: !a.robots.exists
      ? "No robots.txt found — crawlers are allowed by default, but an explicit file is cleaner."
      : blocked
        ? "robots.txt has a Disallow: / rule covering Googlebot, Mediapartners-Google or AdsBot-Google."
        : "robots.txt found and no rule blocks Googlebot, Mediapartners-Google or AdsBot-Google.",
    fix: "Remove any Disallow: / rule for Googlebot, Mediapartners-Google and AdsBot-Google from robots.txt — the AdSense crawler must be able to read your pages to verify and serve ads.",
    earned: !a.robots.exists ? 0.6 : blocked ? 0 : 1,
    weight: 10,
  });
  checks.push({
    name: "Sitemap present",
    status: a.sitemap.exists ? "pass" : "fail",
    detail: a.sitemap.exists
      ? a.sitemap.isIndex
        ? `Sitemap index found with ${a.sitemap.urlCount} child sitemap${a.sitemap.urlCount === 1 ? "" : "s"}.`
        : `sitemap.xml found with ${a.sitemap.urlCount} URL${a.sitemap.urlCount === 1 ? "" : "s"}.`
      : "No valid sitemap.xml found at /sitemap.xml.",
    fix: "Publish a sitemap.xml listing your pages and submit it in Google Search Console — it speeds up the crawl the AdSense review depends on.",
    earned: a.sitemap.exists ? 1 : 0,
    weight: 5,
  });
  checks.push({
    name: "Homepage is indexable (no noindex)",
    status: a.noindex ? "fail" : "pass",
    detail: a.noindex
      ? "The homepage carries a robots noindex meta tag."
      : "No noindex directive on the homepage.",
    fix: "Remove the noindex meta tag from the homepage — a noindexed site cannot build the indexed content AdSense reviews.",
    earned: a.noindex ? 0 : 1,
    weight: 5,
  });

  /* ads.txt — 15 */
  checks.push({
    name: "ads.txt with a Google seller line",
    status: a.adsTxt.exists && a.adsTxt.hasGoogleLine ? "pass" : a.adsTxt.exists ? "warn" : "fail",
    detail: a.adsTxt.exists
      ? a.adsTxt.hasGoogleLine
        ? `ads.txt is live with a google.com line (${a.adsTxt.googlePubIds.join(", ") || "publisher id detected"}).`
        : "ads.txt is live but has no google.com seller line."
      : a.adsTxt.looksLikeHtml
        ? "/ads.txt returns an HTML page instead of a text ads.txt file."
        : a.adsTxt.status
          ? `/ads.txt returned HTTP ${a.adsTxt.status}.`
          : "/ads.txt could not be fetched.",
    fix: "Publish a plain-text /ads.txt at the domain root containing: google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0 — with your own publisher ID. Use the ads.txt Generator below.",
    earned: a.adsTxt.exists && a.adsTxt.hasGoogleLine ? 1 : a.adsTxt.exists ? 0.5 : 0,
    weight: 15,
  });

  /* AdSense code — 10 */
  checks.push({
    name: "AdSense code on the homepage",
    status: a.adsense.found ? "pass" : "warn",
    detail: a.adsense.found
      ? `AdSense code detected (${a.adsense.caPubIds.join(", ") || "ca-pub id in script"})${a.adsense.autoAdsLoader ? ", Auto Ads loader present" : ""}${a.adsense.manualUnits ? `, ${a.adsense.manualUnits} manual ad unit${a.adsense.manualUnits === 1 ? "" : "s"}` : ""}.`
      : "No AdSense code (adsbygoogle / pagead / ca-pub) detected on the homepage.",
    fix: "After approval, place the AdSense code in the <head> of every page (or enable Auto Ads). Before approval this is expected — you add the code when Google asks for it during sign-up.",
    earned: a.adsense.found ? 1 : 0.4,
    weight: 10,
  });

  /* Policy pages — 20 (5 each). Each check carries its OWN fix text. */
  const policyItems: { key: "about" | "contact" | "privacy" | "terms"; label: string; path: string; fix: string }[] = [
    {
      key: "about",
      label: "About page",
      path: "/about",
      fix: "Publish a real About page that says who runs the site, what it publishes and why readers can trust it, and link it from the footer or main menu — reviewers look for an identifiable publisher behind the content, and anonymous sites read as low-trust.",
    },
    {
      key: "contact",
      label: "Contact page",
      path: "/contact",
      fix: "Publish a Contact page with a working way to reach the publisher — an email address or a contact form — and link it from the footer. A site nobody can contact looks abandoned to reviewers and gives dissatisfied visitors nowhere to go but a policy report.",
    },
    {
      key: "privacy",
      label: "Privacy Policy page",
      path: "/privacy-policy",
      fix: "Publish a Privacy Policy that discloses third-party advertising cookies (state plainly that Google AdSense uses cookies to serve ads based on prior visits), any analytics you run, and how visitors can opt out — then link it from the footer. This disclosure is effectively required before AdSense will approve a site.",
    },
    {
      key: "terms",
      label: "Terms page",
      path: "/terms",
      fix: "Publish a Terms page covering acceptable use of the site, who owns the content and your liability limits, and link it from the footer — it completes the trust-page set reviewers check alongside About, Contact and Privacy.",
    },
  ];
  for (const { key, label, path, fix } of policyItems) {
    const ok = a.policy[key];
    const foundUrl = a.policyUrls?.[key];
    let detail: string;
    if (ok) {
      detail = foundUrl ? `${label} found: ${foundUrl}` : `${label} found (${path} or a close variant responds).`;
    } else if (key === "terms" && a.policyUrls?.disclaimer) {
      detail = `No terms page found at ${path} or its common variants. A Disclaimer page was found (${a.policyUrls.disclaimer}) — useful, but it does not replace a Terms page.`;
    } else {
      detail = `No ${label.toLowerCase()} found at ${path} or its common variants.`;
    }
    checks.push({
      name: label,
      status: ok ? "pass" : "fail",
      detail,
      fix,
      earned: ok ? 1 : 0,
      weight: 5,
    });
  }

  /* Content depth — 20 (words 8, internal links 6, title/meta 6) */
  checks.push({
    name: "Homepage content depth",
    status: a.words >= 600 ? "pass" : a.words >= 300 ? "warn" : "fail",
    detail: a.iframeOnly
      ? `The homepage is close to iframe-only: ${a.words} visible words with ${a.iframeCount} iframe${a.iframeCount === 1 ? "" : "s"} — a classic low-value signal.`
      : `Homepage has ${a.words.toLocaleString()} visible words${a.iframeCount ? ` and ${a.iframeCount} iframe${a.iframeCount === 1 ? "" : "s"}` : ""}.`,
    fix: "Give the homepage real, original text — what the site is, who it helps, how it works, examples and an FAQ. Iframe-only and near-empty homepages read as low value content.",
    earned: a.words >= 600 ? 1 : a.words >= 300 ? 0.5 : 0,
    weight: 8,
  });
  checks.push({
    name: "Internal linking from the homepage",
    status: a.internalLinks >= 15 ? "pass" : a.internalLinks >= 5 ? "warn" : "fail",
    detail: `${a.internalLinks} internal link${a.internalLinks === 1 ? "" : "s"} from the homepage into the rest of the site.`,
    fix: "Link your important pages from the homepage and main navigation — reviewers and crawlers should reach your content in two clicks.",
    earned: a.internalLinks >= 15 ? 1 : a.internalLinks >= 5 ? 0.5 : 0,
    weight: 6,
  });
  checks.push({
    name: "Title & meta description",
    status: a.title && a.metaDescription ? "pass" : a.title || a.metaDescription ? "warn" : "fail",
    detail: a.title
      ? `Title: “${a.title}”${a.metaDescription ? " · meta description present." : " · no meta description found."}`
      : "No <title> tag found on the homepage.",
    fix: "Give every page a unique, descriptive <title> and a meta description that summarises the page for a human reader.",
    earned: a.title && a.metaDescription ? 1 : a.title || a.metaDescription ? 0.5 : 0,
    weight: 6,
  });

  const totalWeight = checks.reduce((s, c) => s + c.weight, 0);
  const score = Math.round(checks.reduce((s, c) => s + c.earned * c.weight, 0) / totalWeight * 100);
  const fixes = checks
    .filter((c) => c.earned < 1)
    .sort((x, y) => y.weight * (1 - y.earned) - x.weight * (1 - x.earned));
  return { score, band: score >= 75 ? "Strong" : score >= 50 ? "Fair" : "Weak", checks, fixes };
}

/* ------------------------------ Approval view ----------------------------- */

export interface ApprovalVerdict {
  level: "Ready" | "Almost ready" | "Not ready";
  failing: SiteCheck[];
}

export function buildApproval(a: AdsenseAudit, report: SiteReport): ApprovalVerdict {
  const failing = report.checks.filter((c) => c.status === "fail");
  const level = report.score >= 80 && failing.length === 0 ? "Ready" : report.score >= 55 ? "Almost ready" : "Not ready";
  return { level, failing };
}

/* ----------------------------- Eligibility view ---------------------------- */

export interface EligibilityItem {
  label: string;
  ok: boolean;
  detail: string;
}

export function buildEligibilityAuto(a: AdsenseAudit): EligibilityItem[] {
  return [
    { label: "Site is live and reachable", ok: a.status >= 200 && a.status < 400, detail: `Homepage returned HTTP ${a.status}.` },
    { label: "Site serves over HTTPS", ok: a.https, detail: a.https ? "Final URL is HTTPS." : "Final URL is not HTTPS — fix this before applying." },
    { label: "You can verify ownership signals (ads.txt present)", ok: a.adsTxt.exists, detail: a.adsTxt.exists ? "ads.txt is live at the domain root." : "No valid ads.txt yet — generate one below; Google uses it to verify authorised sellers." },
    { label: "Privacy Policy page exists", ok: a.policy.privacy, detail: a.policy.privacy ? "Privacy page found." : "No privacy page found — AdSense requires one that discloses ad cookies." },
    { label: "Homepage is indexable and crawlable", ok: !a.noindex && !robotsBlocksAdsense(a), detail: a.noindex ? "Homepage has a noindex tag." : robotsBlocksAdsense(a) ? "robots.txt blocks a Google/AdSense crawler." : "No noindex and no crawler blocks found." },
    { label: "Sitemap present for the review crawl", ok: a.sitemap.exists, detail: a.sitemap.exists ? `Sitemap found (${a.sitemap.urlCount} URLs).` : "No sitemap.xml found." },
  ];
}

/* ------------------------------ Ban risk view ------------------------------ */

export interface BanRisk {
  level: "Low" | "Medium" | "High";
  points: number;
  signals: { label: string; detail: string; points: number }[];
}

export function buildBanRisk(a: AdsenseAudit): BanRisk {
  const signals: BanRisk["signals"] = [];
  const add = (cond: boolean, label: string, detail: string, points: number) => {
    if (cond) signals.push({ label, detail, points });
  };
  add(!a.https, "No HTTPS", "Ads serving on insecure pages is restricted and flagged.", 20);
  add(!a.adsTxt.exists, "ads.txt missing or broken", a.adsTxt.looksLikeHtml ? "/ads.txt returns HTML instead of a valid text file." : "No valid ads.txt — unauthorised-seller warnings follow.", 20);
  add(a.adsTxt.exists && !a.adsTxt.hasGoogleLine, "ads.txt has no google.com line", "Google is not declared as an authorised seller on this domain.", 10);
  add(robotsBlocksAdsense(a), "robots.txt blocks an AdSense crawler", "Mediapartners-Google / AdsBot-Google / Googlebot is disallowed — Google cannot verify the site.", 25);
  const missingPolicy = (["about", "contact", "privacy", "terms"] as const).filter((k) => !a.policy[k]);
  add(missingPolicy.length > 0, "Trust pages missing", `Missing: ${missingPolicy.join(", ")}. Missing policy pages are a common rejection and policy-risk signal.`, Math.min(20, missingPolicy.length * 6));
  add(a.iframeOnly, "Iframe-only / near-empty homepage", `${a.words} visible words with ${a.iframeCount} iframes — pages built to carry ads around borrowed content are a policy risk.`, 15);
  add(!a.iframeOnly && a.words < 300, "Very thin homepage", `Only ${a.words} visible words on the homepage.`, 8);
  add(!a.adsense.found, "No AdSense code detected", "If this site is supposed to be approved and monetised, missing code means ads cannot serve — check for removal or a wrong publisher id.", 8);
  add(a.noindex, "Homepage noindexed", "A noindexed homepage undermines the content Google approved.", 10);
  const points = Math.min(100, signals.reduce((s, x) => s + x.points, 0));
  return { level: points >= 50 ? "High" : points >= 25 ? "Medium" : "Low", points, signals };
}

/* ------------------------------ ads.txt lines ------------------------------ */

export interface AdsTxtLineResult {
  raw: string;
  ok: boolean;
  issues: string[];
  isGoogle: boolean;
}

export function validateAdsTxtLine(raw: string): AdsTxtLineResult {
  const issues: string[] = [];
  const parts = raw.split(",").map((p) => p.trim());
  const isGoogle = /^google\.com$/i.test(parts[0] ?? "");
  if (parts.length < 3) {
    issues.push("Needs at least 3 fields: seller domain, publisher ID, relationship.");
    return { raw, ok: false, issues, isGoogle };
  }
  if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(parts[0])) issues.push(`“${parts[0]}” does not look like a seller domain.`);
  if (isGoogle && !/^pub-\d{10,}$/i.test(parts[1])) issues.push(`Google publisher IDs look like pub- followed by digits — got “${parts[1]}”.`);
  if (!/^(DIRECT|RESELLER)$/i.test(parts[2])) issues.push(`Relationship must be DIRECT or RESELLER — got “${parts[2]}”.`);
  if (parts[3] && !/^[a-f0-9]{16}$/i.test(parts[3])) issues.push("Certification authority ID should be 16 hex characters (Google's is f08c47fec0942fa0).");
  return { raw, ok: issues.length === 0, issues, isGoogle };
}
