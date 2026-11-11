"use client";

import { useMemo, useRef, useState } from "react";
import {
  COUNTRY_PRESETS,
  invoiceTotals,
  lineTotals,
  amountInWords,
  type VatMode,
} from "./calc";

const inputCls =
  "w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition";
const labelCls = "block text-sm font-bold text-stone-800 mb-2";

/** Accept both decimal points and commas. */
const num = (s: string): number => {
  const v = parseFloat(s.replace(",", "."));
  return Number.isFinite(v) ? v : 0;
};

interface LineState {
  id: number;
  description: string;
  quantity: string;
  price: string;
  /** Rate as string (matches a preset rate) or "custom". */
  rateSel: string;
  customRate: string;
}

const rateOf = (line: LineState): number =>
  line.rateSel === "custom" ? num(line.customRate) : num(line.rateSel);

export default function VatCalculator() {
  const [countryId, setCountryId] = useState("es");
  const [mode, setMode] = useState<VatMode>("add");
  const [lines, setLines] = useState<LineState[]>([
    { id: 1, description: "", quantity: "1", price: "100", rateSel: "21", customRate: "" },
  ]);
  const [retIsr, setRetIsr] = useState("0");
  const [retVat, setRetVat] = useState("0");
  const [copied, setCopied] = useState(false);
  const idRef = useRef(2);

  const preset = useMemo(
    () => COUNTRY_PRESETS.find((c) => c.id === countryId) ?? COUNTRY_PRESETS[0],
    [countryId],
  );

  const fmt = useMemo(
    () => new Intl.NumberFormat("en-US", { style: "currency", currency: preset.currency }),
    [preset],
  );

  const parsedLines = useMemo(
    () =>
      lines.map((l) => ({
        quantity: num(l.quantity),
        unitPrice: num(l.price),
        ratePct: rateOf(l),
      })),
    [lines],
  );

  const totals = useMemo(
    () => invoiceTotals(parsedLines, mode, num(retIsr), num(retVat)),
    [parsedLines, mode, retIsr, retVat],
  );

  const inWords = useMemo(() => amountInWords(totals.total, preset), [totals.total, preset]);

  const changeCountry = (id: string) => {
    const next = COUNTRY_PRESETS.find((c) => c.id === id) ?? COUNTRY_PRESETS[0];
    setCountryId(id);
    setLines((prev) => prev.map((l) => ({ ...l, rateSel: String(next.defaultRate) })));
  };

  const updateLine = (id: number, patch: Partial<LineState>) =>
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));

  const addLine = () =>
    setLines((prev) => [
      ...prev,
      { id: idRef.current++, description: "", quantity: "1", price: "", rateSel: String(preset.defaultRate), customRate: "" },
    ]);

  const removeLine = (id: number) =>
    setLines((prev) => (prev.length > 1 ? prev.filter((l) => l.id !== id) : prev));

  const copySummary = async () => {
    const rows = [
      `Invoice — Frinjo ${preset.taxName} Calculator`,
      `Country: ${preset.name} · Mode: ${mode === "add" ? "prices excl. " + preset.taxName : "prices incl. " + preset.taxName}`,
      ...lines.map((l, i) => {
        const t = lineTotals(parsedLines[i], mode);
        return `${l.description || "Line " + (i + 1)}: net ${fmt.format(t.base)} · ${preset.taxName} ${fmt.format(t.tax)} · total ${fmt.format(t.total)}`;
      }),
      `Net amount: ${fmt.format(totals.base)}`,
      `${preset.taxName} amount: ${fmt.format(totals.tax)}`,
    ];
    if (totals.isrRetention > 0) rows.push(`Income-tax withholding: −${fmt.format(totals.isrRetention)}`);
    if (totals.ivaRetention > 0) rows.push(`${preset.taxName} withholding: −${fmt.format(totals.ivaRetention)}`);
    rows.push(`TOTAL: ${fmt.format(totals.total)}`);
    rows.push(`In words: ${inWords}`);
    try {
      await navigator.clipboard.writeText(rows.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        <div className="rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-10 shadow-sm">
          {/* Country + mode */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="vat-country">Country</label>
              <select id="vat-country" className={inputCls} value={countryId} onChange={(e) => changeCountry(e.target.value)}>
                {COUNTRY_PRESETS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} — {c.taxName} {c.defaultRate}%
                  </option>
                ))}
              </select>
            </div>
            <div>
              <span className={labelCls}>The prices I enter are…</span>
              <div className="flex gap-2">
                <button type="button" onClick={() => setMode("add")}
                  className={`rounded-full px-5 py-2.5 font-bold text-sm transition ${mode === "add" ? "bg-orange-600 text-white" : "bg-white border border-stone-300 text-stone-700 hover:border-orange-400"}`}>
                  Excl. {preset.taxName} (add it)
                </button>
                <button type="button" onClick={() => setMode("extract")}
                  className={`rounded-full px-5 py-2.5 font-bold text-sm transition ${mode === "extract" ? "bg-orange-600 text-white" : "bg-white border border-stone-300 text-stone-700 hover:border-orange-400"}`}>
                  Incl. {preset.taxName} (remove it)
                </button>
              </div>
            </div>
          </div>

          {/* Lines */}
          <div className="mt-8 space-y-4">
            {lines.map((line, i) => {
              const t = lineTotals(parsedLines[i], mode);
              return (
                <div key={line.id} className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-5">
                  <div className="grid gap-4 md:grid-cols-[1fr_90px_130px_170px_40px]">
                    <div>
                      <label className={labelCls} htmlFor={`vat-desc-${line.id}`}>Description</label>
                      <input id={`vat-desc-${line.id}`} type="text" placeholder="e.g. Web design" className={inputCls}
                        value={line.description} onChange={(e) => updateLine(line.id, { description: e.target.value })} />
                    </div>
                    <div>
                      <label className={labelCls} htmlFor={`vat-qty-${line.id}`}>Qty</label>
                      <input id={`vat-qty-${line.id}`} type="number" min="0" step="1" className={inputCls}
                        value={line.quantity} onChange={(e) => updateLine(line.id, { quantity: e.target.value })} />
                    </div>
                    <div>
                      <label className={labelCls} htmlFor={`vat-price-${line.id}`}>
                        Price {mode === "add" ? "excl." : "incl."} {preset.taxName}
                      </label>
                      <input id={`vat-price-${line.id}`} type="number" min="0" step="0.01" className={inputCls}
                        value={line.price} onChange={(e) => updateLine(line.id, { price: e.target.value })} />
                    </div>
                    <div>
                      <label className={labelCls} htmlFor={`vat-rate-${line.id}`}>{preset.taxName} rate</label>
                      <select id={`vat-rate-${line.id}`} className={inputCls} value={line.rateSel}
                        onChange={(e) => updateLine(line.id, { rateSel: e.target.value })}>
                        {preset.rates.map((r) => (
                          <option key={r} value={String(r)}>{r}%</option>
                        ))}
                        <option value="custom">Custom rate…</option>
                      </select>
                      {line.rateSel === "custom" && (
                        <input type="number" min="0" step="0.1" placeholder="Rate %" aria-label="Custom rate"
                          className={`${inputCls} mt-2`} value={line.customRate}
                          onChange={(e) => updateLine(line.id, { customRate: e.target.value })} />
                      )}
                    </div>
                    <div className="flex items-end pb-1">
                      <button type="button" aria-label="Remove line" onClick={() => removeLine(line.id)}
                        disabled={lines.length <= 1}
                        className="w-10 h-10 rounded-full border border-stone-300 text-stone-500 font-bold hover:border-red-300 hover:text-red-600 disabled:opacity-30 disabled:hover:border-stone-300 disabled:hover:text-stone-500 transition">
                        ×
                      </button>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-stone-500 text-right">
                    Net {fmt.format(t.base)} · {preset.taxName} {fmt.format(t.tax)} ·{" "}
                    <strong className="text-stone-800">Line total {fmt.format(t.total)}</strong>
                  </p>
                </div>
              );
            })}
          </div>

          <button type="button" onClick={addLine}
            className="mt-4 rounded-full border-2 border-dashed border-orange-300 text-orange-800 font-bold px-6 py-2.5 hover:border-orange-500 hover:bg-orange-50 transition">
            + Add line
          </button>

          {/* Withholdings */}
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="vat-ret-isr">Income-tax withholding % (optional)</label>
              <input id="vat-ret-isr" type="number" min="0" step="0.01" className={inputCls}
                value={retIsr} onChange={(e) => setRetIsr(e.target.value)} />
              <p className="mt-2 text-xs text-stone-400">Applied to the net amount. In Mexico, professional services are commonly withheld at 10%.</p>
            </div>
            <div>
              <label className={labelCls} htmlFor="vat-ret-vat">{preset.taxName} withholding % (optional)</label>
              <input id="vat-ret-vat" type="number" min="0" step="0.01" className={inputCls}
                value={retVat} onChange={(e) => setRetVat(e.target.value)} />
              <p className="mt-2 text-xs text-stone-400">Applied to the tax amount. Two thirds in Mexico = 66.67%.</p>
            </div>
          </div>

          <p className="mt-4 text-xs text-stone-400">
            Everything is calculated in your browser: no figure leaves this page or is ever stored.
          </p>
        </div>

        {/* RESULTS */}
        <div className="mt-10 rounded-3xl border border-stone-200 bg-white p-8 sm:p-10 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl bg-stone-50 border border-stone-100 p-5 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">Net amount</p>
              <p className="mt-2 font-display text-2xl font-bold text-stone-900">{fmt.format(totals.base)}</p>
            </div>
            <div className="rounded-2xl bg-stone-50 border border-stone-100 p-5 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">{preset.taxName} amount</p>
              <p className="mt-2 font-display text-2xl font-bold text-stone-900">{fmt.format(totals.tax)}</p>
            </div>
            <div className="rounded-2xl bg-stone-50 border border-stone-100 p-5 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">Withholdings</p>
              <p className="mt-2 font-display text-2xl font-bold text-stone-900">
                {fmt.format(totals.isrRetention + totals.ivaRetention)}
              </p>
              {(totals.isrRetention > 0 || totals.ivaRetention > 0) && (
                <p className="mt-1 text-xs text-stone-500">
                  Income tax {fmt.format(totals.isrRetention)} · {preset.taxName} {fmt.format(totals.ivaRetention)}
                </p>
              )}
            </div>
            <div className="rounded-2xl bg-orange-50 border border-orange-100 p-5 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">Total to pay</p>
              <p className="mt-2 font-display text-2xl font-bold text-stone-900">{fmt.format(totals.total)}</p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-stone-950 text-white p-6 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">Total in words</p>
            <p className="mt-2 font-display text-xl sm:text-2xl font-bold leading-snug">{inWords}</p>
          </div>

          <div className="mt-6 text-center">
            <button type="button" onClick={copySummary}
              className="inline-flex items-center gap-2 rounded-full bg-orange-400 text-orange-950 font-bold px-7 py-3.5 hover:bg-orange-300 transition shadow-lg shadow-orange-400/20">
              {copied ? "Summary copied!" : "Copy summary"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
