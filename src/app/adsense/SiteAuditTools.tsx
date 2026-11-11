"use client";

import { useMemo, useState } from "react";
import type { AdsenseAudit } from "@/lib/adsense-audit";
import {
  buildSiteReport,
  buildApproval,
  buildEligibilityAuto,
  buildBanRisk,
  validateAdsTxtLine,
  type SiteCheck,
} from "@/lib/adsense-scoring";
import { btnPrimary } from "@/components/ui";

const inputCls =
  "w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200";
const labelCls = "block text-[11px] font-bold uppercase tracking-[0.15em] text-stone-500 mb-2";

function chip(status: "pass" | "warn" | "fail") {
  return status === "pass"
    ? "bg-green-100 text-green-800"
    : status === "warn"
      ? "bg-amber-100 text-amber-800"
      : "bg-red-100 text-red-800";
}

function StatusChip({ status }: { status: "pass" | "warn" | "fail" }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${chip(status)}`}>
      {status}
    </span>
  );
}

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

const MANUAL_ELIGIBILITY = [
  "I am 18 or older (or applying through a parent/guardian where Google allows it)",
  "I can edit my site's HTML / add the AdSense code to my pages",
  "My content is original — written by me, not copied, scraped or auto-spun",
  "I do not already have another AdSense account (one account per person)",
  "My site complies with the AdSense program policies (no prohibited content, no invalid-click activity)",
];

export default function SiteAuditTools() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [audit, setAudit] = useState<AdsenseAudit | null>(null);
  const [manual, setManual] = useState<boolean[]>(MANUAL_ELIGIBILITY.map(() => false));

  const report = useMemo(() => (audit ? buildSiteReport(audit) : null), [audit]);
  const approval = useMemo(() => (audit && report ? buildApproval(audit, report) : null), [audit, report]);
  const eligibilityAuto = useMemo(() => (audit ? buildEligibilityAuto(audit) : []), [audit]);
  const banRisk = useMemo(() => (audit ? buildBanRisk(audit) : null), [audit]);

  async function runAudit() {
    const u = input.trim();
    if (!u || loading) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/adsense-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: u }),
      });
      const data = (await res.json()) as AdsenseAudit & { error?: string };
      if (!res.ok || data.error) {
        setError(data.error ?? "The audit failed. Please try again.");
        return;
      }
      setAudit(data);
    } catch {
      setError("The audit failed — the site could not be fetched. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const runBar = (buttonLabel: string) => (
    <form
      className="flex flex-col sm:flex-row gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        void runAudit();
      }}
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="example.com or https://example.com"
        autoComplete="off"
        aria-label="Website URL or domain"
        className={`${inputCls} flex-1`}
      />
      <button type="submit" disabled={loading} className={`${btnPrimary} justify-center disabled:opacity-60`}>
        {loading ? "Auditing…" : buttonLabel}
      </button>
    </form>
  );

  const emptyNote = (
    <p className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-500">
      Run the audit with your site address — every tool on this page reads from the same single fetch, so
      one run fills them all.
    </p>
  );

  const forLine = audit ? (
    <p className="mb-5 text-sm text-stone-500">
      Results for{" "}
      <a href={audit.finalUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-orange-700 hover:text-orange-800 break-all">
        {audit.finalUrl}
      </a>{" "}
      · HTTP {audit.status} · {audit.redirects} redirect{audit.redirects === 1 ? "" : "s"}
    </p>
  ) : null;

  const eligibilityBlockers = [
    ...eligibilityAuto.filter((i) => !i.ok).map((i) => i.label),
    ...MANUAL_ELIGIBILITY.filter((_, i) => !manual[i]),
  ];

  return (
    <>
      {/* ---------------- 1 · SITE CHECKER ---------------- */}
      <SectionShell
        id="site-checker"
        eyebrow="Tool 1 · Site Checker"
        title="AdSense Site Checker"
        sub="Enter a website and get a Site Health Score out of 100 from its public signals — access and HTTPS, crawlability, ads.txt, AdSense code, policy pages and content depth — with a prioritised fix list."
      >
        {runBar("Run site audit →")}
        {error && (
          <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>
        )}
        {audit && report ? (
          <div className="mt-8">
            {forLine}
            <div className="grid gap-4 md:grid-cols-3 text-left">
              <div className="rounded-3xl border border-stone-200 bg-white p-6 text-center shadow-sm">
                <div className={`font-display font-bold text-6xl ${report.score >= 75 ? "text-green-600" : report.score >= 50 ? "text-amber-500" : "text-red-500"}`}>
                  {report.score}
                </div>
                <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.15em] text-stone-500">Site Health Score · /100</div>
                <div className="mt-3 h-2 rounded-full bg-stone-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${report.score >= 75 ? "bg-green-500" : report.score >= 50 ? "bg-amber-400" : "bg-red-500"}`}
                    style={{ width: `${report.score}%` }}
                  />
                </div>
                <p className="mt-3 text-xs text-stone-500">{report.band} — a public-signals score, not a Google score.</p>
              </div>
              <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm md:col-span-2">
                <div className="text-[11px] font-bold uppercase tracking-[0.15em] text-stone-500">At a glance</div>
                <ul className="mt-2 space-y-1.5 text-sm text-stone-700">
                  <li>Title: <strong>{audit.title || "—"}</strong></li>
                  <li>Homepage: <strong>{audit.words.toLocaleString()}</strong> words · <strong>{audit.internalLinks}</strong> internal links · HTTPS: <strong>{audit.https ? "Yes" : "No"}</strong></li>
                  <li>Sitemap: <strong>{audit.sitemap.exists ? `${audit.sitemap.urlCount} URLs` : "Missing"}</strong> · ads.txt: <strong>{audit.adsTxt.exists ? (audit.adsTxt.hasGoogleLine ? "Live with Google line" : "Live, no Google line") : "Missing/broken"}</strong></li>
                  <li>Policy pages: <strong>{[audit.policy.about && "About", audit.policy.contact && "Contact", audit.policy.privacy && "Privacy", audit.policy.terms && "Terms"].filter(Boolean).join(", ") || "None found"}</strong></li>
                </ul>
              </div>
            </div>

            <h3 className="font-display text-2xl font-bold text-stone-900 mt-10">All checks</h3>
            <div className="mt-4 rounded-3xl border border-stone-200 bg-white px-6 py-2">
              {report.checks.map((c: SiteCheck) => (
                <div key={c.name} className="py-4 border-b border-stone-100 last:border-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusChip status={c.status} />
                    <span className="font-semibold text-stone-900">{c.name}</span>
                    <span className="text-xs text-stone-400">weight {c.weight}</span>
                  </div>
                  <p className="mt-1.5 text-sm text-stone-500 leading-relaxed">{c.detail}</p>
                </div>
              ))}
            </div>

            {report.fixes.length > 0 && (
              <>
                <h3 className="font-display text-2xl font-bold text-stone-900 mt-10">Fix first — in this order</h3>
                <div className="mt-4 space-y-3">
                  {report.fixes.map((c, i) => (
                    <div key={c.name} className="rounded-2xl border border-orange-200 bg-orange-50 px-5 py-4">
                      <p className="font-semibold text-stone-900">
                        {i + 1}. {c.name} <StatusChip status={c.status} />
                      </p>
                      <p className="mt-1 text-sm text-stone-600 leading-relaxed">{c.fix}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          !error && <div className="mt-6">{emptyNote}</div>
        )}
      </SectionShell>

      {/* ---------------- 2 · APPROVAL CHECKER ---------------- */}
      <SectionShell
        id="approval-checker"
        eyebrow="Tool 2 · Approval Checker"
        title="AdSense Approval Checker"
        sub="The same audit, read as an approval verdict. This is a readiness estimate from public signals — the actual decision is always Google's review of the whole site."
        dark
      >
        {audit && approval && report ? (
          <div>
            {forLine}
            <div className={`rounded-3xl border p-7 text-center ${approval.level === "Ready" ? "border-green-200 bg-green-50" : approval.level === "Almost ready" ? "border-amber-200 bg-amber-50" : "border-red-200 bg-red-50"}`}>
              <p className="font-display text-3xl sm:text-4xl font-bold text-stone-900">{approval.level}</p>
              <p className="mt-2 text-stone-600">
                Site Health Score {report.score}/100.{" "}
                {approval.level === "Ready"
                  ? "No failing readiness checks — the public signals look approval-ready."
                  : approval.level === "Almost ready"
                    ? "Close — clear the failing items below before you apply or re-apply."
                    : "Too many failing basics — fix the items below first; applying now invites another rejection."}
              </p>
            </div>
            {approval.failing.length > 0 && (
              <div className="mt-5 rounded-3xl border border-stone-200 bg-white px-6 py-2">
                {approval.failing.map((c) => (
                  <div key={c.name} className="py-4 border-b border-stone-100 last:border-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusChip status={c.status} />
                      <span className="font-semibold text-stone-900">{c.name}</span>
                    </div>
                    <p className="mt-1.5 text-sm text-stone-500 leading-relaxed">{c.fix}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          emptyNote
        )}
      </SectionShell>

      {/* ---------------- 3 · ELIGIBILITY CHECKER ---------------- */}
      <SectionShell
        id="eligibility-checker"
        eyebrow="Tool 3 · Eligibility Checker"
        title="AdSense Eligibility Checker"
        sub="Half of eligibility is your site (checked automatically from the audit), half is you (tick honestly). Both halves must be clear before an application makes sense."
      >
        <div className="grid gap-6 md:grid-cols-2 text-left">
          <div className="rounded-3xl border border-stone-200 bg-white p-6">
            <p className="font-bold text-stone-900 mb-3">Your site — automatic</p>
            {audit ? (
              <ul className="space-y-3">
                {eligibilityAuto.map((i) => (
                  <li key={i.label} className="text-sm">
                    <span className={`mr-2 inline-grid place-items-center w-5 h-5 rounded-full text-white text-xs font-bold ${i.ok ? "bg-green-500" : "bg-red-500"}`}>
                      {i.ok ? "✓" : "!"}
                    </span>
                    <span className="font-semibold text-stone-800">{i.label}</span>
                    <span className="block pl-7 text-stone-500">{i.detail}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-stone-500">Run the site audit above to fill this half in automatically.</p>
            )}
          </div>
          <div className="rounded-3xl border border-stone-200 bg-white p-6">
            <p className="font-bold text-stone-900 mb-3">You — self-check</p>
            <ul className="space-y-3">
              {MANUAL_ELIGIBILITY.map((label, i) => (
                <li key={label}>
                  <label className="flex items-start gap-3 text-sm text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={manual[i]}
                      onChange={(e) => setManual(manual.map((v, j) => (j === i ? e.target.checked : v)))}
                      className="mt-0.5 h-4 w-4 accent-orange-600"
                    />
                    {label}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {audit && (
          <div className={`mt-6 rounded-3xl border p-6 text-center ${eligibilityBlockers.length === 0 ? "border-green-200 bg-green-50" : "border-amber-200 bg-amber-50"}`}>
            <p className="font-display text-2xl font-bold text-stone-900">
              {eligibilityBlockers.length === 0 ? "Eligible on every public signal — you can apply" : `${eligibilityBlockers.length} blocker${eligibilityBlockers.length === 1 ? "" : "s"} to clear`}
            </p>
            {eligibilityBlockers.length > 0 && (
              <p className="mt-2 text-sm text-stone-600">{eligibilityBlockers.join(" · ")}</p>
            )}
          </div>
        )}
      </SectionShell>

      {/* ---------------- 4 · BAN RISK CHECKER ---------------- */}
      <SectionShell
        id="ban-risk-checker"
        eyebrow="Tool 4 · Ban Risk Checker"
        title="AdSense Ban Risk Checker"
        sub="No tool can confirm an official AdSense ban — only the inside of your own AdSense account can. What can be checked from outside are the public risk signals that typically surround bans, suspensions and ad-serving limits."
        dark
      >
        {audit && banRisk ? (
          <div>
            {forLine}
            <div className={`rounded-3xl border p-7 text-center ${banRisk.level === "Low" ? "border-green-200 bg-green-50" : banRisk.level === "Medium" ? "border-amber-200 bg-amber-50" : "border-red-200 bg-red-50"}`}>
              <p className="font-display text-3xl sm:text-4xl font-bold text-stone-900">{banRisk.level} public risk</p>
              <p className="mt-2 text-stone-600">
                {banRisk.signals.length} risk signal{banRisk.signals.length === 1 ? "" : "s"} detected ({banRisk.points}/100 risk points).{" "}
                {banRisk.level === "Low"
                  ? "The public footprint looks clean — keep ads.txt, policy pages and crawler access exactly as they are."
                  : "Work through the signals below — each one is fixable from outside the account."}
              </p>
            </div>
            {banRisk.signals.length > 0 && (
              <div className="mt-5 space-y-3">
                {banRisk.signals.map((s) => (
                  <div key={s.label} className="rounded-2xl border border-stone-200 bg-white px-5 py-4">
                    <p className="font-semibold text-stone-900">
                      {s.label} <span className="text-xs font-bold text-red-600">+{s.points} risk</span>
                    </p>
                    <p className="mt-1 text-sm text-stone-600 leading-relaxed">{s.detail}</p>
                  </div>
                ))}
              </div>
            )}
            <p className="mt-5 text-sm text-stone-500 leading-relaxed">
              Remember: invalid traffic, policy violations inside content, and account-level actions are invisible
              from outside. If ads stopped serving, check the Policy Centre inside your AdSense account first.
            </p>
          </div>
        ) : (
          emptyNote
        )}
      </SectionShell>

      {/* ---------------- 5 · ADS.TXT CHECKER ---------------- */}
      <SectionShell
        id="adstxt-checker"
        eyebrow="Tool 5 · ads.txt Checker"
        title="ads.txt Checker"
        sub="Fetches /ads.txt from the audited domain, shows every seller line and validates its format — domain, publisher ID, DIRECT/RESELLER and certificate ID — and flags whether Google is declared."
      >
        {audit ? (
          <div>
            {forLine}
            {!audit.adsTxt.exists ? (
              <div className="rounded-3xl border border-red-200 bg-red-50 p-6">
                <p className="font-display text-xl font-bold text-stone-900">No valid ads.txt found</p>
                <p className="mt-2 text-stone-600 leading-relaxed">
                  {audit.adsTxt.looksLikeHtml
                    ? "/ads.txt returns an HTML page (usually a 404 page served with status 200) instead of a plain-text ads.txt file."
                    : `/ads.txt returned HTTP ${audit.adsTxt.status || "—"}.`}{" "}
                  Generate a correct file with the ads.txt Generator below and upload it to your domain root.
                </p>
              </div>
            ) : (
              <>
                <p className="text-sm text-stone-600">
                  <strong>{audit.adsTxt.lines.length}</strong> seller line{audit.adsTxt.lines.length === 1 ? "" : "s"} · Google declared:{" "}
                  <strong>{audit.adsTxt.hasGoogleLine ? `Yes (${audit.adsTxt.googlePubIds.join(", ")})` : "No"}</strong>
                </p>
                <div className="mt-4 rounded-3xl border border-stone-200 bg-white px-6 py-2">
                  {audit.adsTxt.lines.map((line, i) => {
                    const v = validateAdsTxtLine(line);
                    return (
                      <div key={i} className="py-3.5 border-b border-stone-100 last:border-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`inline-grid place-items-center w-6 h-6 rounded-full text-white text-sm font-bold shrink-0 ${v.ok ? "bg-green-500" : "bg-red-500"}`}>
                            {v.ok ? "✓" : "!"}
                          </span>
                          <code className="text-sm text-stone-800 break-all">{line}</code>
                          {v.isGoogle && <span className="rounded-full bg-orange-100 text-orange-800 px-2 py-0.5 text-[11px] font-bold">GOOGLE</span>}
                        </div>
                        {v.issues.map((iss) => (
                          <p key={iss} className="mt-1 pl-8 text-sm text-red-600">{iss}</p>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        ) : (
          emptyNote
        )}
      </SectionShell>

      {/* ---------------- 7 · CODE CHECKER / PUBLISHER ID FINDER ---------------- */}
      <SectionShell
        id="code-checker"
        eyebrow="Tool 6 · Code Checker"
        title="AdSense Code Checker — Publisher ID Finder"
        sub="Reads the audited homepage's code for the AdSense loader (adsbygoogle / pagead scripts), extracts every ca-pub publisher ID it finds, and notes whether ads look like Auto Ads or manual units."
        dark
      >
        {audit ? (
          <div>
            {forLine}
            {audit.adsense.found ? (
              <div className="rounded-3xl border border-stone-200 bg-white p-6">
                <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-stone-500">Publisher ID{audit.adsense.caPubIds.length === 1 ? "" : "s"} found</p>
                <ul className="mt-3 space-y-2">
                  {audit.adsense.caPubIds.length ? (
                    audit.adsense.caPubIds.map((id) => (
                      <li key={id}>
                        <code className="rounded-xl bg-stone-950 text-orange-300 px-4 py-2 inline-block font-mono text-lg">{id}</code>
                      </li>
                    ))
                  ) : (
                    <li className="text-stone-600">AdSense scripts detected, but no ca-pub ID could be extracted from the homepage.</li>
                  )}
                </ul>
                <ul className="mt-4 space-y-1.5 text-sm text-stone-700">
                  <li>Auto Ads loader: <strong>{audit.adsense.autoAdsLoader ? "Present — Auto Ads can run site-wide" : "Not detected"}</strong></li>
                  <li>Manual ad units (data-ad-slot): <strong>{audit.adsense.manualUnits}</strong></li>
                  <li>
                    Matches ads.txt Google line:{" "}
                    <strong>
                      {audit.adsTxt.googlePubIds.length === 0
                        ? "No Google line in ads.txt to compare"
                        : audit.adsense.caPubIds.some((id) => audit.adsTxt.googlePubIds.includes(id.replace(/^ca-/, "")))
                          ? "Yes — the code and ads.txt carry the same publisher ID"
                          : "No — the homepage code and ads.txt name different publisher IDs (a real problem: fix one of them)"}
                    </strong>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
                <p className="font-display text-xl font-bold text-stone-900">No AdSense code on the homepage</p>
                <p className="mt-2 text-stone-600 leading-relaxed">
                  No adsbygoogle script, pagead loader or ca-pub ID was found. That is normal for a site that has
                  not applied yet — the code is added during sign-up. For an approved site it means ads cannot
                  serve until the code is placed in the &lt;head&gt; of your pages.
                </p>
              </div>
            )}
          </div>
        ) : (
          emptyNote
        )}
      </SectionShell>
    </>
  );
}
