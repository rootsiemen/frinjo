"use client";

import { useMemo, useState } from "react";
import { computeSalaire, type Statut } from "./calc";

const inputCls =
  "w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition";
const labelCls = "block text-sm font-bold text-stone-800 mb-2";

const eur = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });

const STATUTS: { value: Statut; label: string }[] = [
  { value: "non-cadre", label: "Salarié non-cadre" },
  { value: "cadre", label: "Salarié cadre" },
  { value: "fonction-publique", label: "Fonction publique" },
];

export default function SalaireCalculator() {
  const [periode, setPeriode] = useState<"mensuel" | "annuel">("mensuel");
  const [montant, setMontant] = useState("2500");
  const [statut, setStatut] = useState<Statut>("non-cadre");
  const [pasPct, setPasPct] = useState("7");

  const result = useMemo(() => {
    const brutSaisi = Number(montant);
    if (!(brutSaisi > 0)) return null;
    const brutMensuel = periode === "annuel" ? brutSaisi / 12 : brutSaisi;
    const pas = Number(pasPct);
    return computeSalaire({
      brutMensuel,
      statut,
      pasPct: Number.isFinite(pas) && pas >= 0 ? pas : 0,
    });
  }, [montant, periode, statut, pasPct]);

  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-10 shadow-sm">
          <div className="flex gap-2 mb-6">
            {(["mensuel", "annuel"] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriode(p)}
                className={`rounded-full px-5 py-2 font-bold text-sm transition ${
                  periode === p
                    ? "bg-orange-600 text-white"
                    : "bg-white border border-stone-300 text-stone-700 hover:border-orange-400"
                }`}
              >
                {p === "mensuel" ? "Par mois" : "Par an"}
              </button>
            ))}
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label className={labelCls} htmlFor="sal-brut">
                Salaire brut {periode === "mensuel" ? "mensuel" : "annuel"} (€)
              </label>
              <input
                id="sal-brut"
                type="number"
                min="1"
                className={inputCls}
                value={montant}
                onChange={(e) => setMontant(e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls} htmlFor="sal-statut">
                Statut
              </label>
              <select
                id="sal-statut"
                className={inputCls}
                value={statut}
                onChange={(e) => setStatut(e.target.value as Statut)}
              >
                {STATUTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls} htmlFor="sal-pas">
                Prélèvement à la source (%)
              </label>
              <input
                id="sal-pas"
                type="number"
                min="0"
                max="45"
                step="0.1"
                className={inputCls}
                value={pasPct}
                onChange={(e) => setPasPct(e.target.value)}
              />
            </div>
          </div>
          <p className="mt-3 text-xs text-stone-400">
            Le taux de 7 % pré-rempli est un exemple de taux moyen : remplacez-le par le taux indiqué sur
            votre fiche de paie pour un résultat au plus proche de votre situation. Le calcul se fait dans
            votre navigateur — rien n&apos;est enregistré.
          </p>
        </div>

        {result ? (
          <div className="mt-10 rounded-3xl border border-stone-200 bg-white p-8 sm:p-10 shadow-sm">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">
                Votre salaire net après impôt (par mois)
              </p>
              <p className="mt-3 font-display text-6xl sm:text-7xl font-bold text-stone-900">
                {eur.format(result.netApresImpotMensuel)}
              </p>
              <p className="mt-2 text-stone-500">
                soit {eur.format(result.netApresImpotAnnuel)} net par an
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 max-w-2xl mx-auto">
              <div className="rounded-2xl bg-stone-50 border border-stone-100 p-5 text-center">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">
                  Net avant impôt
                </p>
                <p className="mt-2 font-display text-2xl font-bold text-stone-900">
                  {eur.format(result.netAvantImpotMensuel)} / mois
                </p>
                <p className="mt-1 text-sm text-stone-500">
                  {eur.format(result.netAvantImpotAnnuel)} / an
                </p>
              </div>
              <div className="rounded-2xl bg-stone-50 border border-stone-100 p-5 text-center">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">
                  Charges salariales ({Math.round(result.chargesSalarialesPct * 100)} %)
                </p>
                <p className="mt-2 font-display text-2xl font-bold text-stone-900">
                  − {eur.format(result.chargesSalariales)} / mois
                </p>
                <p className="mt-1 text-sm text-stone-500">cotisations prélevées sur le brut</p>
              </div>
              <div className="rounded-2xl bg-stone-50 border border-stone-100 p-5 text-center">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">
                  Prélèvement à la source
                </p>
                <p className="mt-2 font-display text-2xl font-bold text-stone-900">
                  − {eur.format(result.pas)} / mois
                </p>
                <p className="mt-1 text-sm text-stone-500">impôt sur le revenu retenu par l&apos;employeur</p>
              </div>
              {result.coutEmployeurMensuel !== null ? (
                <div className="rounded-2xl bg-stone-50 border border-stone-100 p-5 text-center">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">
                    Coût total employeur (estimé)
                  </p>
                  <p className="mt-2 font-display text-2xl font-bold text-stone-900">
                    {eur.format(result.coutEmployeurMensuel)} / mois
                  </p>
                  <p className="mt-1 text-sm text-stone-500">
                    brut + charges patronales ≈{" "}
                    {result.chargesPatronalesPct !== null
                      ? Math.round(result.chargesPatronalesPct * 100)
                      : 0}{" "}
                    %
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl bg-stone-50 border border-stone-100 p-5 text-center">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">
                    Coût employeur
                  </p>
                  <p className="mt-2 font-display text-lg font-bold text-stone-900">
                    Non affiché pour la fonction publique
                  </p>
                  <p className="mt-1 text-sm text-stone-500">
                    les cotisations employeur y suivent d&apos;autres règles
                  </p>
                </div>
              )}
            </div>

            <p className="mt-8 text-sm text-stone-500 leading-relaxed max-w-2xl mx-auto text-center">
              Estimation indicative selon le modèle détaillé ci-dessous. Pour un calcul officiel ligne par
              ligne, le simulateur mon-entreprise de l&apos;Urssaf fait foi.
            </p>
          </div>
        ) : (
          <p className="mt-8 rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800 text-center">
            Saisissez un salaire brut valide pour voir le résultat.
          </p>
        )}
      </div>
    </section>
  );
}
