"use client";

import { useMemo, useState } from "react";
import { encodeBase64, decodeBase64, encodeBytes, decodedSize } from "./calc";

const inputCls =
  "w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition";
const labelCls = "block text-sm font-bold text-stone-800 mb-2";
const cardCls = "rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-8 shadow-sm";
const areaCls = `${inputCls} font-mono text-sm min-h-[140px] resize-y`;

export default function Base64Tool() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [urlSafe, setUrlSafe] = useState(false);
  const [input, setInput] = useState("Hello, World! 👋");
  const [fileName, setFileName] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { output, error } = useMemo(() => {
    if (input === "") return { output: "", error: null as string | null };
    try {
      const out = mode === "encode" ? encodeBase64(input, urlSafe) : decodeBase64(input, urlSafe);
      return { output: out, error: null };
    } catch (e) {
      return { output: "", error: e instanceof Error ? e.message : "Could not decode that input." };
    }
  }, [input, mode, urlSafe]);

  const onFile = async (f: File | undefined) => {
    if (!f) return;
    const buf = new Uint8Array(await f.arrayBuffer());
    setMode("encode");
    setFileName(`${f.name} (${f.size.toLocaleString()} bytes)`);
    setInput("");
    setFileB64(encodeBytes(buf, urlSafe));
  };
  const [fileB64, setFileB64] = useState<string | null>(null);

  const shownOutput = fileB64 ?? output;

  const swap = () => {
    if (fileB64) setFileB64(null);
    setInput(shownOutput);
    setMode(mode === "encode" ? "decode" : "encode");
    setFileName(null);
  };

  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 grid gap-6">
        <div className={cardCls}>
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex rounded-full border border-stone-300 bg-white p-1">
              {(["encode", "decode"] as const).map((m) => (
                <button key={m} type="button" onClick={() => { setMode(m); setFileB64(null); setFileName(null); }}
                  className={`rounded-full px-4 py-2 text-sm font-bold transition ${mode === m ? "bg-orange-600 text-white" : "text-stone-600 hover:text-orange-700"}`}>
                  {m === "encode" ? "Encode" : "Decode"}
                </button>
              ))}
            </div>
            <label className="flex items-center gap-2 text-sm font-semibold text-stone-700 cursor-pointer">
              <input type="checkbox" checked={urlSafe} onChange={(e) => setUrlSafe(e.target.checked)} className="h-4 w-4 accent-orange-600" />
              URL-safe alphabet (− and _ , no padding)
            </label>
          </div>

          <div className="mt-5">
            <label className={labelCls} htmlFor="b64-in">{mode === "encode" ? "Text to encode" : "Base64 to decode"}</label>
            <textarea id="b64-in" className={areaCls} value={input} onChange={(e) => { setInput(e.target.value); setFileB64(null); setFileName(null); }}
              placeholder={mode === "encode" ? "Type or paste any text — emoji and accents included…" : "Paste Base64 here…"} />
            <p className="mt-2 text-xs text-stone-400">
              {input.length.toLocaleString()} characters in
              {mode === "decode" && input.trim() !== "" && <> · ≈{decodedSize(input).toLocaleString()} bytes decoded</>}
            </p>
          </div>

          {mode === "encode" && (
            <div className="mt-4 rounded-2xl border border-dashed border-stone-300 bg-white p-4">
              <label className="text-sm font-bold text-stone-800" htmlFor="b64-file">…or encode a file (image, PDF, anything)</label>
              <input id="b64-file" type="file" className="mt-2 block w-full text-sm text-stone-600"
                onChange={(e) => onFile(e.target.files?.[0])} />
              {fileName && <p className="mt-2 text-xs font-semibold text-orange-700">File loaded: {fileName} — its Base64 is in the output below.</p>}
            </div>
          )}

          <div className="mt-4 flex justify-center">
            <button type="button" onClick={swap} disabled={!shownOutput}
              className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-bold text-stone-700 hover:border-orange-400 hover:text-orange-700 transition disabled:opacity-40">
              ⇅ Swap &amp; convert back
            </button>
          </div>

          <div className="mt-4">
            <label className={labelCls} htmlFor="b64-out">{mode === "encode" ? "Base64 output" : "Decoded text"}</label>
            <textarea id="b64-out" readOnly className={areaCls} value={shownOutput}
              placeholder="Result appears here as you type…" />
            {error && <p className="mt-2 text-sm font-semibold text-red-600">⚠ {error}</p>}
            <div className="mt-3 flex items-center gap-3">
              <button type="button" disabled={!shownOutput}
                onClick={() => { navigator.clipboard?.writeText(shownOutput).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
                className="rounded-full bg-orange-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-700 transition disabled:opacity-40">
                {copied ? "Copied ✓" : "Copy result"}
              </button>
              <span className="text-xs text-stone-400">{shownOutput.length.toLocaleString()} characters out</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-stone-400 text-center">
          Full UTF-8 support — accents, Chinese characters and emoji encode correctly (plain btoa() breaks on those).
          Everything runs locally in your browser.
        </p>
      </div>
    </section>
  );
}
