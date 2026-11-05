"use client";

import { useMemo, useState } from "react";
import { computeFraisNotaire, EMOLUMENTS_TRANCHES, type DepartementRegime, type TypeBien } from "./calc";

const inputCls =
  "w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition";
const labelCls = "block text-sm font-bold text-stone-800 mb-2";

const num = (s: string): number => {
  const v = parseFloat(s.replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(v) ? v : 0;
};

const REDUIT_DEPARTEMENTS = "Indre (36), Isère (38), Morbihan (56), Mayotte (976) et quelques autres collectivités";

export default function NotaireCalculator() {
  const [prix, setPrix] = useState("200000");
  const [type, setType] = useState<TypeBien>("ancien");
  const [departement, setDepartement] = useState<DepartementRegime>("standard");
  const [pret, setPret] = useState("");

  const fmt = useMemo(
    () => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }),
    [],
  );

  const calc = useMemo(() => {
    const p = num(prix);
    if (!(p > 0)) return null;
    return computeFraisNotaire({
      prix: p,
      type,
      departement,
      montantPret: num(pret),
    });
  }, [prix, type, departement, pret]);

  const rows: [string, string][] = calc
    ? [
        ["Droits de mutation (taxes versées à l'État et aux collectivités)", fmt.format(calc.droitsMutation)],
        ["Émoluments du notaire (TVA 20 % incluse)", fmt.format(calc.emolumentsTtc)],
        ["Contribution de sécurité immobilière (0,10 %)", fmt.format(calc.contributionSecuriteImmobiliere)],
        ["Débours estimés (documents, formalités)", fmt.format(calc.debours)],
        ...(calc.fraisGarantieEstimes > 0
          ? [["Frais de garantie du prêt estimés (PPD, ~0,9 % du prêt)", fmt.format(calc.fraisGarantieEstimes)] as [string, string]]
          : []),
      ]
    : [];

  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-10 shadow-sm">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="not-prix">Prix du bien (€)</label>
              <input id="not-prix" type="number" min="0" step="1000" className={inputCls}
                value={prix} onChange={(e) => setPrix(e.target.value)} />
            </div>
            <div>
              <span className={labelCls}>Type de bien</span>
              <div className="flex gap-2">
                <button type="button" onClick={() => setType("ancien")}
                  className={`rounded-full px-5 py-2.5 font-bold text-sm transition ${type === "ancien" ? "bg-orange-600 text-white" : "bg-white border border-stone-300 text-stone-700 hover:border-orange-400"}`}>
                  Ancien
                </button>
                <button type="button" onClick={() => setType("neuf")}
                  className={`rounded-full px-5 py-2.5 font-bold text-sm transition ${type === "neuf" ? "bg-orange-600 text-white" : "bg-white border border-stone-300 text-stone-700 hover:border-orange-400"}`}>
                  Neuf (frais réduits)
                </button>
              </div>
            </div>
            {type === "ancien" && (
              <div>
                <label className={labelCls} htmlFor="not-dept">Régime du département</label>
                <select id="not-dept" className={inputCls} value={departement}
                  onChange={(e) => setDepartement(e.target.value as DepartementRegime)}>
                  <option value="standard">Standard — droits à 5,81 % (la plupart des départements)</option>
                  <option value="reduit">Taux réduit — droits à 5,09 %</option>
                </select>
                <p className="mt-2 text-xs text-stone-400">Taux réduit notamment : {REDUIT_DEPARTEMENTS}.</p>
              </div>
            )}
            <div>
              <label className={labelCls} htmlFor="not-pret">Montant du prêt (€, optionnel)</label>
              <input id="not-pret" type="number" min="0" step="1000" className={inputCls}
                value={pret} onChange={(e) => setPret(e.target.value)} placeholder="Laisser vide sans prêt" />
              <p className="mt-2 text-xs text-stone-400">Pour estimer les frais de garantie (PPD) liés au financement.</p>
            </div>
          </div>
          <p className="mt-4 text-xs text-stone-400">
            Estimation indicative calculée dans votre navigateur, à partir du barème officiel des émoluments
            et des taux de droits en vigueur. Le décompte final du notaire prévaut.
          </p>
        </div>

        {calc ? (
          <div className="mt-10 rounded-3xl border border-stone-200 bg-white p-8 sm:p-10 shadow-sm">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">
                Frais de notaire estimés ({calc.totalFraisPct.toLocaleString("fr-FR")} % du prix)
              </p>
              <p className="mt-3 font-display text-6xl sm:text-7xl font-bold text-stone-900">
                {fmt.format(calc.totalFrais)}
              </p>
              <p className="mt-2 text-stone-500">
                Coût total d&apos;acquisition : {fmt.format(calc.coutTotalAcquisition)} pour un bien à{" "}
                {fmt.format(calc.prix)} ({type === "ancien" ? "ancien" : "neuf"})
              </p>
            </div>

            <div className="mt-8 overflow-x-auto rounded-2xl border border-stone-200">
              <table className="w-full text-sm">
                <tbody>
                  {rows.map(([label, value]) => (
                    <tr key={label} className="border-b border-stone-100 last:border-0">
                      <td className="py-3 px-4 text-stone-600">{label}</td>
                      <td className="py-3 px-4 text-right font-bold text-stone-800 whitespace-nowrap">{value}</td>
                    </tr>
                  ))}
                  <tr className="bg-orange-50">
                    <td className="py-3 px-4 font-bold text-stone-900">Total des frais</td>
                    <td className="py-3 px-4 text-right font-bold text-stone-900 whitespace-nowrap">{fmt.format(calc.totalFrais)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <details className="mt-6 rounded-2xl border border-stone-200 bg-stone-50/60 transition group">
              <summary className="cursor-pointer list-none flex items-center justify-between gap-4 px-6 py-4 font-bold text-stone-900 [&::-webkit-details-marker]:hidden">
                Barème des émoluments appliqué (hors taxes)
                <span className="shrink-0 w-8 h-8 rounded-full bg-orange-100 text-orange-700 grid place-items-center group-open:rotate-45 transition-transform text-xl leading-none">+</span>
              </summary>
              <div className="px-6 pb-5">
                <table className="w-full text-sm">
                  <tbody>
                    {EMOLUMENTS_TRANCHES.map((t, i) => (
                      <tr key={i} className="border-b border-stone-100 last:border-0">
                        <td className="py-2 pr-3 text-stone-600">
                          {i === 0 ? "De 0 à " : `De ${EMOLUMENTS_TRANCHES[i - 1].jusquA.toLocaleString("fr-FR")} € à `}
                          {Number.isFinite(t.jusquA) ? `${t.jusquA.toLocaleString("fr-FR")} €` : "au-delà"}
                        </td>
                        <td className="py-2 text-right font-bold text-stone-800">
                          {String(t.tauxPct).replace(".", ",")} %
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="mt-3 text-xs text-stone-400">
                  Émoluments proportionnels pour votre prix : {fmt.format(calc.emolumentsHt)} HT, soit{" "}
                  {fmt.format(calc.emolumentsTtc)} TTC (TVA 20 %).
                </p>
              </div>
            </details>
          </div>
        ) : (
          <p className="mt-8 rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800 text-center">
            Saisissez un prix valide pour estimer les frais.
          </p>
        )}
      </div>
    </section>
  );
}
