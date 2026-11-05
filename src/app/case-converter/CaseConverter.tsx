"use client";

import { useMemo, useState } from "react";

const labelCls = "block text-sm font-bold text-stone-800 mb-2";

export function words(text: string): string[] {
  return text
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean);
}

export function convertCase(text: string, mode: string): string {
  const ws = words(text);
  const cap = (w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
  switch (mode) {
    case "upper": return text.toUpperCase();
    case "lower": return text.toLowerCase();
    case "title": return text.toLowerCase().replace(/\b[a-z]/g, (c) => c.toUpperCase());
    case "sentence":
      return text.toLowerCase().replace(/(^\s*[a-z])|([.!?]\s*[a-z])/g, (m) => m.toUpperCase());
    case "capitalized": return ws.map(cap).join(" ");
    case "alternating":
      return text.split("").map((c, i) => (i % 2 === 0 ? c.toLowerCase() : c.toUpperCase())).join("");
    case "inverse":
      return text.split("").map((c) => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase())).join("");
    case "camel": return ws.map((w, i) => (i === 0 ? w.toLowerCase() : cap(w))).join("");
    case "pascal": return ws.map(cap).join("");
    case "snake": return ws.map((w) => w.toLowerCase()).join("_");
    case "screaming": return ws.map((w) => w.toUpperCase()).join("_");
    case "kebab": return ws.map((w) => w.toLowerCase()).join("-");
    case "train": return ws.map(cap).join("-");
    case "dot": return ws.map((w) => w.toLowerCase()).join(".");
    case "reverse": return text.split("").reverse().join("");
    case "remove-spaces": return text.replace(/\s+/g, "");
    case "slug": return ws.map((w) => w.toLowerCase()).join("-");
    default: return text;
  }
}

const MODES: { key: string; label: string; group: string }[] = [
  { key: "upper", label: "UPPER CASE", group: "Everyday" },
  { key: "lower", label: "lower case", group: "Everyday" },
  { key: "title", label: "Title Case", group: "Everyday" },
  { key: "sentence", label: "Sentence case", group: "Everyday" },
  { key: "capitalized", label: "Capitalized Words", group: "Everyday" },
  { key: "alternating", label: "aLtErNaTiNg", group: "Fun" },
  { key: "inverse", label: "InVeRsE CaSe", group: "Fun" },
  { key: "reverse", label: "Reverse Text", group: "Fun" },
  { key: "camel", label: "camelCase", group: "Code" },
  { key: "pascal", label: "PascalCase", group: "Code" },
  { key: "snake", label: "snake_case", group: "Code" },
  { key: "screaming", label: "SCREAMING_SNAKE", group: "Code" },
  { key: "kebab", label: "kebab-case / URL slug", group: "Code" },
  { key: "train", label: "Train-Case", group: "Code" },
  { key: "dot", label: "dot.case", group: "Code" },
  { key: "remove-spaces", label: "Remove All Spaces", group: "Everyday" },
];

export default function CaseConverter() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState("title");
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => convertCase(text, mode), [text, mode]);
  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  const groups = ["Everyday", "Code", "Fun"];

  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-10 shadow-sm">
          <label className={labelCls} htmlFor="cc-input">Your text</label>
          <textarea id="cc-input" rows={5} value={text} onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here — conversions happen instantly below…"
            className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition" />
          <p className="mt-2 text-xs text-stone-400">{charCount} characters · {wordCount} words</p>

          <div className="mt-6 space-y-4">
            {groups.map((g) => (
              <div key={g}>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500 mb-2">{g}</p>
                <div className="flex flex-wrap gap-2">
                  {MODES.filter((m) => m.group === g).map((m) => (
                    <button key={m.key} type="button" onClick={() => setMode(m.key)}
                      className={`rounded-full px-4 py-2 text-sm font-bold transition ${mode === m.key ? "bg-orange-600 text-white" : "bg-white border border-stone-300 text-stone-600 hover:border-orange-400"}`}>
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <label className={`${labelCls} mt-7`} htmlFor="cc-output">Result</label>
          <textarea id="cc-output" rows={5} readOnly value={output}
            placeholder="Your converted text appears here…"
            className="w-full rounded-2xl border border-orange-200 bg-orange-50/50 px-4 py-3 text-stone-900 placeholder-stone-400 focus:outline-none" />
          <div className="mt-4 flex gap-3">
            <button type="button" disabled={!output}
              onClick={() => { navigator.clipboard?.writeText(output).then(() => setCopied(true)).catch(() => {}); }}
              className="rounded-full bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white font-bold px-6 py-2.5 text-sm transition">
              {copied ? "Copied ✓" : "Copy result"}
            </button>
            <button type="button" onClick={() => { setText(""); setCopied(false); }}
              className="rounded-full border border-stone-300 bg-white px-6 py-2.5 text-sm font-bold text-stone-600 hover:border-orange-400 transition">
              Clear
            </button>
          </div>
          <p className="mt-5 text-xs text-stone-400">
            Everything happens in your browser — pasted text is never uploaded or stored. The code
            conversions split words intelligently (spaces, hyphens, underscores and camelCase boundaries),
            so &quot;my file_name here&quot; becomes clean camelCase, kebab-case or a URL slug.
          </p>
        </div>
      </div>
    </section>
  );
}
