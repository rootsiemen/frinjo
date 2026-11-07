"use client";

import { useMemo, useState } from "react";
import { generateBulk, checkUuid } from "./calc";

const inputCls =
  "w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition";
const labelCls = "block text-sm font-bold text-stone-800 mb-2";
const cardCls = "rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-8 shadow-sm";

export default function UuidGenerator() {
  const [version, setVersion] = useState<"v4" | "v7">("v4");
  const [count, setCount] = useState("5");
  const [uppercase, setUppercase] = useState(false);
  const [hyphens, setHyphens] = useState(true);
  const [seed, setSeed] = useState(0);
  const [copied, setCopied] = useState(false);

  const uuids = useMemo(
    () => generateBulk(Number(count) || 1, version, { uppercase, hyphens }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [version, count, uppercase, hyphens, seed],
  );

  const [checkInput, setCheckInput] = useState("");
  const check = checkInput.trim() ? checkUuid(checkInput) : null;

  const download = () => {
    const blob = new Blob([uuids.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "uuids.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 grid gap-6">
        <div className={cardCls}>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">Generate</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className={labelCls} htmlFor="uu-ver">Version</label>
              <select id="uu-ver" className={inputCls} value={version} onChange={(e) => setVersion(e.target.value as "v4" | "v7")}>
                <option value="v4">v4 — random</option>
                <option value="v7">v7 — time-ordered</option>
              </select>
            </div>
            <div>
              <label className={labelCls} htmlFor="uu-count">How many (1–500)</label>
              <input id="uu-count" type="number" min={1} max={500} className={inputCls} value={count}
                onChange={(e) => setCount(e.target.value)} />
            </div>
            <div>
              <label className={labelCls} htmlFor="uu-case">Case</label>
              <select id="uu-case" className={inputCls} value={uppercase ? "upper" : "lower"} onChange={(e) => setUppercase(e.target.value === "upper")}>
                <option value="lower">lowercase</option>
                <option value="upper">UPPERCASE</option>
              </select>
            </div>
            <div>
              <label className={labelCls} htmlFor="uu-hyph">Hyphens</label>
              <select id="uu-hyph" className={inputCls} value={hyphens ? "yes" : "no"} onChange={(e) => setHyphens(e.target.value === "yes")}>
                <option value="yes">With hyphens</option>
                <option value="no">No hyphens</option>
              </select>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-stone-200 bg-white p-4">
            <pre className="font-mono text-sm sm:text-base text-stone-900 whitespace-pre-wrap break-all leading-relaxed">{uuids.join("\n")}</pre>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" onClick={() => setSeed((s) => s + 1)}
              className="rounded-full bg-orange-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-700 transition">
              ↻ Generate new
            </button>
            <button type="button" onClick={() => { navigator.clipboard?.writeText(uuids.join("\n")).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
              className="rounded-full border border-stone-300 bg-white px-5 py-2.5 text-sm font-bold text-stone-800 hover:border-orange-400 hover:text-orange-700 transition">
              {copied ? "Copied ✓" : "Copy all"}
            </button>
            <button type="button" onClick={download}
              className="rounded-full border border-stone-300 bg-white px-5 py-2.5 text-sm font-bold text-stone-800 hover:border-orange-400 hover:text-orange-700 transition">
              Download .txt
            </button>
          </div>
          <p className="mt-4 text-sm text-stone-500">
            Generated with your browser&apos;s cryptographic random source (Web Crypto API) — nothing leaves your device.
            {version === "v7" && " v7 UUIDs embed the current millisecond timestamp, so they sort by creation time — ideal as database primary keys."}
          </p>
        </div>

        <div className={cardCls}>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">Validate</p>
          <h3 className="mt-2 font-display text-xl font-bold text-stone-900">Check a UUID</h3>
          <div className="mt-4">
            <label className={labelCls} htmlFor="uu-check">Paste a UUID</label>
            <input id="uu-check" className={`${inputCls} font-mono`} value={checkInput} onChange={(e) => setCheckInput(e.target.value)}
              placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000" />
          </div>
          {check && (
            <div className="mt-4 rounded-2xl border border-stone-200 bg-white p-4 text-sm leading-relaxed">
              {check.valid ? (
                <p className="text-stone-700">
                  <span className="font-bold text-green-700">✓ Valid UUID.</span>{" "}
                  {check.isNil
                    ? "This is the special Nil UUID (all zeros)."
                    : <>Version <strong>{check.version}</strong> · Variant: <strong>{check.variant}</strong></>}
                </p>
              ) : (
                <p className="font-bold text-red-600">✗ Not a valid UUID — it needs the 8-4-4-4-12 hex format with hyphens.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
