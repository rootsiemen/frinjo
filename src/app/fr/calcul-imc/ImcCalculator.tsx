"use client";

import { useMemo, useState } from "react";
import { computeImc, type ImcCategory } from "./calc";

const inputCls =
  "w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition";
const labelCls = "block text-sm font-bold text-stone-800 mb-2";

const CATEGORY_META: Record<ImcCategory, { color: string; note: string }> = {
  "Insuffisance pondérale": {
    color: "#38bdf8",
    note: "En dessous de la fourchette de poids santé pour votre taille. Si ce n'était pas intentionnel, cela vaut une discussion avec un médecin — l'insuffisance pondérale comporte ses propres risques, des carences nutritionnelles à l'immunité affaiblie.",
  },
  "Poids normal": {
    color: "#22c55e",
    note: "Dans la fourchette de poids santé pour votre taille (18,5–24,9). L'IMC est un repère de population, pas un verdict — la condition physique, la masse musculaire et votre ressenti comptent autant que le chiffre.",
  },
  Surpoids: {
    color: "#f59e0b",
    note: "Au-dessus de la fourchette de poids santé pour votre taille. De petits changements durables font bouger ce chiffre régulièrement — environ 0,5 à 1 kg par mois est un rythme réaliste et tenable pour la plupart des gens.",
  },
  Obésité: {
    color: "#ef4444",
    note: "Dans la zone d'obésité pour votre taille. C'est une information de santé, pas un jugement — un médecin peut vérifier ce que l'IMC ne voit pas (tension artérielle, glycémie, condition physique) et vous aider à planifier à partir des faits.",
  },
};

const fmt1 = (n: number) => n.toFixed(1).replace(".", ",");

export default function ImcCalculator() {
  const [units, setUnits] = useState<"metric" | "imperial">("metric");
  const [cm, setCm] = useState("175");
  const [kg, setKg] = useState("73");
  const [ft, setFt] = useState("5");
  const [inch, setInch] = useState("9");
  const [lb, setLb] = useState("160");

  const parsed = useMemo(() => {
    if (units === "imperial") {
      const totalIn = Number(ft) * 12 + Number(inch);
      const w = Number(lb);
      if (!(totalIn > 0) || !(w > 0)) return null;
      return { weightKg: w * 0.45359237, heightCm: totalIn * 2.54 };
    }
    const h = Number(cm);
    const w = Number(kg);
    if (!(h > 0) || !(w > 0)) return null;
    return { weightKg: w, heightCm: h };
  }, [units, ft, inch, cm, lb, kg]);

  const result = parsed ? computeImc(parsed.weightKg, parsed.heightCm / 100) : null;
  const meta = result ? CATEGORY_META[result.category] : null;
  // La jauge couvre un IMC de 14 à 40
  const positionPct = result
    ? Math.max(0, Math.min(100, ((result.imc - 14) / (40 - 14)) * 100))
    : 0;
  const fmtWeight = (kgVal: number) =>
    units === "imperial" ? `${fmt1(kgVal / 0.45359237)} lb` : `${fmt1(kgVal)} kg`;

  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-10 shadow-sm">
          <div className="flex gap-2 mb-6">
            {(["metric", "imperial"] as const).map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => setUnits(u)}
                className={`rounded-full px-5 py-2 font-bold text-sm transition ${
                  units === u
                    ? "bg-orange-600 text-white"
                    : "bg-white border border-stone-300 text-stone-700 hover:border-orange-400"
                }`}
              >
                {u === "metric" ? "cm · kg" : "ft / in · lb"}
              </button>
            ))}
          </div>

          {units === "metric" ? (
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelCls} htmlFor="imc-cm">
                  Taille — cm
                </label>
                <input id="imc-cm" type="number" min="50" max="280" className={inputCls} value={cm} onChange={(e) => setCm(e.target.value)} />
              </div>
              <div>
                <label className={labelCls} htmlFor="imc-kg">
                  Poids — kg
                </label>
                <input id="imc-kg" type="number" min="1" max="700" className={inputCls} value={kg} onChange={(e) => setKg(e.target.value)} />
              </div>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-3">
              <div>
                <label className={labelCls} htmlFor="imc-ft">
                  Taille — pieds (feet)
                </label>
                <input id="imc-ft" type="number" min="1" max="8" className={inputCls} value={ft} onChange={(e) => setFt(e.target.value)} />
              </div>
              <div>
                <label className={labelCls} htmlFor="imc-in">
                  Taille — pouces (inches)
                </label>
                <input id="imc-in" type="number" min="0" max="11" className={inputCls} value={inch} onChange={(e) => setInch(e.target.value)} />
              </div>
              <div>
                <label className={labelCls} htmlFor="imc-lb">
                  Poids — livres (pounds)
                </label>
                <input id="imc-lb" type="number" min="1" max="1500" className={inputCls} value={lb} onChange={(e) => setLb(e.target.value)} />
              </div>
            </div>
          )}
          <p className="mt-3 text-xs text-stone-400">
            Votre IMC se met à jour pendant que vous tapez. Rien n&apos;est enregistré — le calcul se fait
            dans votre navigateur. Réservé aux adultes de 20 ans et plus ; les enfants et adolescents
            utilisent des percentiles.
          </p>
        </div>

        {result && meta ? (
          <div className="mt-10 rounded-3xl border border-stone-200 bg-white p-8 sm:p-10 shadow-sm">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">
                Votre indice de masse corporelle
              </p>
              <p className="mt-3 font-display text-7xl sm:text-8xl font-bold text-stone-900">
                {fmt1(result.imc)}
              </p>
              <p className="mt-2 font-display text-2xl font-bold" style={{ color: meta.color }}>
                {result.category}
              </p>
            </div>
            {/* jauge */}
            <div className="mt-8 max-w-xl mx-auto">
              <div className="relative h-4 rounded-full overflow-hidden flex">
                <div style={{ width: "17.3%", background: "#38bdf8" }} />
                <div style={{ width: "24.6%", background: "#22c55e" }} />
                <div style={{ width: "19.2%", background: "#f59e0b" }} />
                <div style={{ width: "38.9%", background: "#ef4444" }} />
              </div>
              <div className="relative h-6">
                <div className="absolute -translate-x-1/2 text-xl leading-none" style={{ left: `${positionPct}%` }}>
                  ▲
                </div>
              </div>
              <div className="flex justify-between text-[11px] font-bold text-stone-400 uppercase tracking-wide">
                <span>14</span>
                <span>18,5</span>
                <span>25</span>
                <span>30</span>
                <span>40</span>
              </div>
            </div>
            <p className="mt-6 text-stone-600 leading-relaxed max-w-2xl mx-auto text-center">{meta.note}</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 max-w-2xl mx-auto">
              <div className="rounded-2xl bg-stone-50 border border-stone-100 p-5 text-center">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">
                  Fourchette santé pour votre taille
                </p>
                <p className="mt-2 font-display text-2xl font-bold text-stone-900">
                  {fmtWeight(result.healthyMinKg)} – {fmtWeight(result.healthyMaxKg)}
                </p>
              </div>
              <div className="rounded-2xl bg-stone-50 border border-stone-100 p-5 text-center">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">La formule</p>
                <p className="mt-2 font-display text-lg font-bold text-stone-900">
                  IMC = poids (kg) ÷ taille² (m)
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p className="mt-8 rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800 text-center">
            Saisissez une taille et un poids valides pour voir votre IMC.
          </p>
        )}
      </div>
    </section>
  );
}
