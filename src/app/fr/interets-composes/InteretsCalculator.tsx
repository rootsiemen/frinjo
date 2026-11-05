"use client";

import { useMemo, useState } from "react";
import { computeInterets, valeurReelle, type Frequence } from "./calc";

const inputCls =
  "w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition";
const labelCls = "block text-sm font-bold text-stone-800 mb-2";

const num = (s: string): number => {
  const v = parseFloat(s.replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(v) ? v : 0;
};

const PRESETS: { label: string; taux: string }[] = [
  { label: "Livret A / LDDS (exemple : 2 %)", taux: "2" },
  { label: "Assurance-vie fonds euros (exemple : 2,5 %)", taux: "2.5" },
  { label: "PEA / ETF monde (exemple : 7 %)", taux: "7" },
  { label: "Taux libre", taux: "" },
];

export default function InteretsCalculator() {
  const [capital, setCapital] = useState("10000");
  const [taux, setTaux] = useState("5");
  const [preset, setPreset] = useState(3);
  const [duree, setDuree] = useState("20");
  const [versement, setVersement] = useState("200");
  const [frequence, setFrequence] = useState<Frequence>(12);
  const [inflation, setInflation] = useState("2");

  const fmt = useMemo(
    () => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }),
    [],
  );

  const applyPreset = (idx: number) => {
    setPreset(idx);
    if (PRESETS[idx].taux) setTaux(PRESETS[idx].taux.replace(".", ","));
  };

  const calc = useMemo(() => {
    const years = Math.min(50, Math.max(0, Math.round(num(duree))));
    const res = computeInterets({
      capitalInitial: num(capital),
      tauxAnnuelPct: num(taux),
      dureeAnnees: years,
      versementMensuel: num(versement),
      frequence,
    });
    return { res, years, reelle: valeurReelle(res.valeurFinale, num(inflation), years) };
  }, [capital, taux, duree, versement, frequence, inflation]);

  const maxValeur = Math.max(1, ...calc.res.rows.map((r) => r.valeur));

  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-10 shadow-sm">
          <div>
            <span className={labelCls}>Placement de référence (le taux reste modifiable)</span>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p, i) => (
                <button key={p.label} type="button" onClick={() => applyPreset(i)}
                  className={`rounded-full px-4 py-2 font-bold text-sm transition ${preset === i ? "bg-orange-600 text-white" : "bg-white border border-stone-300 text-stone-700 hover:border-orange-400"}`}>
                  {p.label}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-stone-400">
              Les taux des exemples sont indicatifs et datés : le Livret A, par exemple, change par décision
              publique. Saisissez le taux actuel de votre produit pour une projection réaliste.
            </p>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="ic-capital">Capital initial (€)</label>
              <input id="ic-capital" type="number" min="0" step="100" className={inputCls}
                value={capital} onChange={(e) => setCapital(e.target.value)} />
            </div>
            <div>
              <label className={labelCls} htmlFor="ic-taux">Taux annuel (%)</label>
              <input id="ic-taux" type="number" min="0" step="0.1" className={inputCls}
                value={taux} onChange={(e) => { setTaux(e.target.value); setPreset(3); }} />
            </div>
            <div>
              <label className={labelCls} htmlFor="ic-duree">Durée (années)</label>
              <input id="ic-duree" type="number" min="1" max="50" step="1" className={inputCls}
                value={duree} onChange={(e) => setDuree(e.target.value)} />
              <input type="range" min="1" max="40" step="1" aria-label="Durée en années"
                className="mt-3 w-full accent-orange-600" value={duree}
                onChange={(e) => setDuree(e.target.value)} />
              <div className="flex justify-between text-[11px] font-bold text-stone-400 uppercase tracking-wide">
                <span>1 an</span><span>40 ans</span>
              </div>
            </div>
            <div>
              <label className={labelCls} htmlFor="ic-versement">Versement mensuel (€)</label>
              <input id="ic-versement" type="number" min="0" step="10" className={inputCls}
                value={versement} onChange={(e) => setVersement(e.target.value)} />
              <p className="mt-2 text-xs text-stone-400">Versements en fin de période, convertis à la fréquence de capitalisation.</p>
            </div>
            <div>
              <label className={labelCls} htmlFor="ic-freq">Capitalisation</label>
              <select id="ic-freq" className={inputCls} value={String(frequence)}
                onChange={(e) => setFrequence(Number(e.target.value) as Frequence)}>
                <option value="12">Mensuelle</option>
                <option value="4">Trimestrielle</option>
                <option value="1">Annuelle</option>
              </select>
            </div>
            <div>
              <label className={labelCls} htmlFor="ic-inflation">Inflation annuelle supposée (%)</label>
              <input id="ic-inflation" type="number" min="0" step="0.1" className={inputCls}
                value={inflation} onChange={(e) => setInflation(e.target.value)} />
              <p className="mt-2 text-xs text-stone-400">Pour la valeur « réelle » en pouvoir d&apos;achat d&apos;aujourd&apos;hui.</p>
            </div>
          </div>
          <p className="mt-4 text-xs text-stone-400">
            Projection avant fiscalité (les prélèvements dépendent du produit : Livret A exonéré, assurance-vie
            et PEA selon leur régime propre). Tout est calculé dans votre navigateur.
          </p>
        </div>

        <div className="mt-10 rounded-3xl border border-stone-200 bg-white p-8 sm:p-10 shadow-sm">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">
              Valeur finale dans {calc.years} an{calc.years > 1 ? "s" : ""}
            </p>
            <p className="mt-3 font-display text-6xl sm:text-7xl font-bold text-stone-900">
              {fmt.format(calc.res.valeurFinale)}
            </p>
            <p className="mt-2 text-stone-500">
              soit {fmt.format(calc.reelle)} en pouvoir d&apos;achat d&apos;aujourd&apos;hui (inflation déduite)
            </p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3 max-w-3xl mx-auto">
            <div className="rounded-2xl bg-stone-50 border border-stone-100 p-5 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">Total versé par vous</p>
              <p className="mt-2 font-display text-xl font-bold text-stone-900">{fmt.format(calc.res.totalVerse)}</p>
            </div>
            <div className="rounded-2xl bg-orange-50 border border-orange-100 p-5 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">Intérêts gagnés</p>
              <p className="mt-2 font-display text-xl font-bold text-stone-900">{fmt.format(calc.res.totalInterets)}</p>
            </div>
            <div className="rounded-2xl bg-stone-50 border border-stone-100 p-5 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">Part des intérêts</p>
              <p className="mt-2 font-display text-xl font-bold text-stone-900">
                {calc.res.valeurFinale > 0 ? `${((calc.res.totalInterets / calc.res.valeurFinale) * 100).toFixed(1).replace(".", ",")} %` : "—"}
              </p>
            </div>
          </div>

          {calc.res.rows.length > 0 && (
            <div className="mt-10">
              <h3 className="font-display text-lg font-bold text-stone-900 mb-4">Croissance année par année</h3>
              <div className="space-y-2">
                {calc.res.rows.filter((_, i) => calc.res.rows.length <= 20 || i % Math.ceil(calc.res.rows.length / 20) === 0 || i === calc.res.rows.length - 1).map((r) => (
                  <div key={r.annee} className="flex items-center gap-3">
                    <span className="w-14 shrink-0 text-xs font-bold text-stone-500">An {r.annee}</span>
                    <div className="flex-1 h-6 rounded-lg bg-stone-100 overflow-hidden flex">
                      <div className="h-full bg-stone-400" style={{ width: `${(r.versementsCumules / maxValeur) * 100}%` }} />
                      <div className="h-full bg-orange-500" style={{ width: `${(r.interetsCumules / maxValeur) * 100}%` }} />
                    </div>
                    <span className="w-28 shrink-0 text-right text-sm font-bold text-stone-800">{fmt.format(r.valeur)}</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-stone-400">
                <span className="inline-block w-3 h-3 rounded bg-stone-400 mr-1 align-middle" /> vos versements
                {"  "}
                <span className="inline-block w-3 h-3 rounded bg-orange-500 mr-1 align-middle" /> les intérêts composés
              </p>
            </div>
          )}

          <details className="mt-8 rounded-2xl border border-stone-200 bg-stone-50/60 transition group">
            <summary className="cursor-pointer list-none flex items-center justify-between gap-4 px-6 py-4 font-bold text-stone-900 [&::-webkit-details-marker]:hidden">
              Tableau complet, année par année
              <span className="shrink-0 w-8 h-8 rounded-full bg-orange-100 text-orange-700 grid place-items-center group-open:rotate-45 transition-transform text-xl leading-none">+</span>
            </summary>
            <div className="px-6 pb-5 max-h-96 overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-stone-400 border-b border-stone-200">
                    <th className="py-2 pr-3">Année</th>
                    <th className="py-2 pr-3 text-right">Versé (cumul)</th>
                    <th className="py-2 pr-3 text-right">Intérêts (cumul)</th>
                    <th className="py-2 text-right">Valeur</th>
                  </tr>
                </thead>
                <tbody>
                  {calc.res.rows.map((r) => (
                    <tr key={r.annee} className="border-b border-stone-100 last:border-0">
                      <td className="py-2 pr-3 font-bold text-stone-800">{r.annee}</td>
                      <td className="py-2 pr-3 text-right text-stone-600">{fmt.format(r.versementsCumules)}</td>
                      <td className="py-2 pr-3 text-right text-stone-600">{fmt.format(r.interetsCumules)}</td>
                      <td className="py-2 text-right text-stone-600">{fmt.format(r.valeur)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </div>
      </div>
    </section>
  );
}
