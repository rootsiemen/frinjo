"use client";

import { useMemo, useRef, useState } from "react";
import { TVA_RATES, invoiceTotals, lineTotals, type TvaMode } from "./calc";

const inputCls =
  "w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition";
const labelCls = "block text-sm font-bold text-stone-800 mb-2";

/** Les utilisateurs français tapent des virgules décimales — on accepte les deux. */
const num = (s: string): number => {
  const v = parseFloat(s.replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(v) ? v : 0;
};

interface LineState {
  id: number;
  libelle: string;
  quantite: string;
  prix: string;
  rateSel: string;
  customRate: string;
}

const rateOf = (line: LineState): number =>
  line.rateSel === "custom" ? num(line.customRate) : num(line.rateSel);

export default function TvaCalculator() {
  const [mode, setMode] = useState<TvaMode>("add");
  const [lines, setLines] = useState<LineState[]>([
    { id: 1, libelle: "", quantite: "1", prix: "100", rateSel: "20", customRate: "" },
  ]);
  const [copied, setCopied] = useState(false);
  const idRef = useRef(2);

  const fmt = useMemo(
    () => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }),
    [],
  );

  const parsedLines = useMemo(
    () => lines.map((l) => ({ quantity: num(l.quantite), unitPrice: num(l.prix), ratePct: rateOf(l) })),
    [lines],
  );

  const totals = useMemo(() => invoiceTotals(parsedLines, mode), [parsedLines, mode]);

  const updateLine = (id: number, patch: Partial<LineState>) =>
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));

  const addLine = () =>
    setLines((prev) => [
      ...prev,
      { id: idRef.current++, libelle: "", quantite: "1", prix: "", rateSel: "20", customRate: "" },
    ]);

  const removeLine = (id: number) =>
    setLines((prev) => (prev.length > 1 ? prev.filter((l) => l.id !== id) : prev));

  const copySummary = async () => {
    const rows = [
      "Facture — Calcul TVA de Frinjo",
      `Mode : prix ${mode === "add" ? "hors taxes (HT)" : "toutes taxes comprises (TTC)"}`,
      ...lines.map((l, i) => {
        const t = lineTotals(parsedLines[i], mode);
        return `${l.libelle || "Ligne " + (i + 1)} : HT ${fmt.format(t.ht)} · TVA ${fmt.format(t.tva)} · TTC ${fmt.format(t.ttc)}`;
      }),
      `Total HT : ${fmt.format(totals.ht)}`,
      `Total TVA : ${fmt.format(totals.tva)}`,
      `Total TTC : ${fmt.format(totals.ttc)}`,
    ];
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
          <div>
            <span className={labelCls}>Les prix saisis sont…</span>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => setMode("add")}
                className={`rounded-full px-5 py-2.5 font-bold text-sm transition ${mode === "add" ? "bg-orange-600 text-white" : "bg-white border border-stone-300 text-stone-700 hover:border-orange-400"}`}>
                Hors taxes — ajouter la TVA
              </button>
              <button type="button" onClick={() => setMode("extract")}
                className={`rounded-full px-5 py-2.5 font-bold text-sm transition ${mode === "extract" ? "bg-orange-600 text-white" : "bg-white border border-stone-300 text-stone-700 hover:border-orange-400"}`}>
                TTC — retirer la TVA
              </button>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {lines.map((line, i) => {
              const t = lineTotals(parsedLines[i], mode);
              return (
                <div key={line.id} className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-5">
                  <div className="grid gap-4 md:grid-cols-[1fr_90px_130px_200px_40px]">
                    <div>
                      <label className={labelCls} htmlFor={`tva-libelle-${line.id}`}>Libellé</label>
                      <input id={`tva-libelle-${line.id}`} type="text" placeholder="Ex. : Prestation de développement" className={inputCls}
                        value={line.libelle} onChange={(e) => updateLine(line.id, { libelle: e.target.value })} />
                    </div>
                    <div>
                      <label className={labelCls} htmlFor={`tva-qte-${line.id}`}>Quantité</label>
                      <input id={`tva-qte-${line.id}`} type="number" min="0" step="1" className={inputCls}
                        value={line.quantite} onChange={(e) => updateLine(line.id, { quantite: e.target.value })} />
                    </div>
                    <div>
                      <label className={labelCls} htmlFor={`tva-prix-${line.id}`}>
                        Prix {mode === "add" ? "HT" : "TTC"}
                      </label>
                      <input id={`tva-prix-${line.id}`} type="number" min="0" step="0.01" className={inputCls}
                        value={line.prix} onChange={(e) => updateLine(line.id, { prix: e.target.value })} />
                    </div>
                    <div>
                      <label className={labelCls} htmlFor={`tva-taux-${line.id}`}>Taux de TVA</label>
                      <select id={`tva-taux-${line.id}`} className={inputCls} value={line.rateSel}
                        onChange={(e) => updateLine(line.id, { rateSel: e.target.value })}>
                        {TVA_RATES.map((r) => (
                          <option key={r.rate} value={String(r.rate)}>{r.label}</option>
                        ))}
                        <option value="custom">Autre taux…</option>
                      </select>
                      {line.rateSel === "custom" && (
                        <input type="number" min="0" step="0.1" placeholder="Taux %" aria-label="Taux personnalisé"
                          className={`${inputCls} mt-2`} value={line.customRate}
                          onChange={(e) => updateLine(line.id, { customRate: e.target.value })} />
                      )}
                    </div>
                    <div className="flex items-end pb-1">
                      <button type="button" aria-label="Supprimer la ligne" onClick={() => removeLine(line.id)}
                        disabled={lines.length <= 1}
                        className="w-10 h-10 rounded-full border border-stone-300 text-stone-500 font-bold hover:border-red-300 hover:text-red-600 disabled:opacity-30 transition">
                        ×
                      </button>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-stone-500 text-right">
                    HT {fmt.format(t.ht)} · TVA {fmt.format(t.tva)} ·{" "}
                    <strong className="text-stone-800">TTC {fmt.format(t.ttc)}</strong>
                  </p>
                </div>
              );
            })}
          </div>

          <button type="button" onClick={addLine}
            className="mt-4 rounded-full border-2 border-dashed border-orange-300 text-orange-800 font-bold px-6 py-2.5 hover:border-orange-500 hover:bg-orange-50 transition">
            + Ajouter une ligne
          </button>

          <p className="mt-4 text-xs text-stone-400">
            Tout est calculé dans votre navigateur : aucun montant n&apos;est envoyé ni conservé.
          </p>
        </div>

        <div className="mt-10 rounded-3xl border border-stone-200 bg-white p-8 sm:p-10 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-stone-50 border border-stone-100 p-5 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">Total HT</p>
              <p className="mt-2 font-display text-2xl font-bold text-stone-900">{fmt.format(totals.ht)}</p>
            </div>
            <div className="rounded-2xl bg-stone-50 border border-stone-100 p-5 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">Total TVA</p>
              <p className="mt-2 font-display text-2xl font-bold text-stone-900">{fmt.format(totals.tva)}</p>
            </div>
            <div className="rounded-2xl bg-orange-50 border border-orange-100 p-5 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">Total TTC</p>
              <p className="mt-2 font-display text-2xl font-bold text-stone-900">{fmt.format(totals.ttc)}</p>
            </div>
          </div>

          {totals.byRate.length > 1 && (
            <div className="mt-6 overflow-x-auto rounded-2xl border border-stone-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-stone-50 text-left text-xs uppercase tracking-wide text-stone-500">
                    <th className="py-3 px-4">Taux</th>
                    <th className="py-3 px-4 text-right">Base HT</th>
                    <th className="py-3 px-4 text-right">TVA</th>
                  </tr>
                </thead>
                <tbody>
                  {totals.byRate.map((r) => (
                    <tr key={r.ratePct} className="border-t border-stone-100">
                      <td className="py-3 px-4 font-bold text-stone-800">{String(r.ratePct).replace(".", ",")} %</td>
                      <td className="py-3 px-4 text-right text-stone-600">{fmt.format(r.baseHt)}</td>
                      <td className="py-3 px-4 text-right text-stone-600">{fmt.format(r.tva)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-6 text-center">
            <button type="button" onClick={copySummary}
              className="inline-flex items-center gap-2 rounded-full bg-orange-400 text-orange-950 font-bold px-7 py-3.5 hover:bg-orange-300 transition shadow-lg shadow-orange-400/20">
              {copied ? "Récapitulatif copié !" : "Copier le récapitulatif"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
