"use client";

import { useMemo, useState } from "react";
import { computeJours, joursFeriesFrance } from "./calc";

const inputCls =
  "w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition";
const labelCls = "block text-sm font-bold text-stone-800 mb-2";

const fmtDate = (iso: string): string => {
  const d = new Date(`${iso}T00:00:00Z`);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
};

export default function JoursCalculator() {
  const [debut, setDebut] = useState("2026-01-01");
  const [fin, setFin] = useState("2026-12-31");
  const [alsace, setAlsace] = useState(false);

  const calc = useMemo(() => computeJours(debut, fin, alsace), [debut, fin, alsace]);
  const anneeRef = useMemo(() => {
    const y = new Date(`${debut}T00:00:00Z`).getUTCFullYear();
    return Number.isNaN(y) ? new Date().getFullYear() : y;
  }, [debut]);
  const feriesAnnee = useMemo(() => joursFeriesFrance(anneeRef, alsace), [anneeRef, alsace]);

  const swap = () => {
    setDebut(fin);
    setFin(debut);
  };

  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-10 shadow-sm">
          <div className="grid gap-5 sm:grid-cols-[1fr_auto_1fr] items-end">
            <div>
              <label className={labelCls} htmlFor="jours-debut">Date de début</label>
              <input id="jours-debut" type="date" className={inputCls}
                value={debut} onChange={(e) => setDebut(e.target.value)} />
            </div>
            <button type="button" onClick={swap} aria-label="Inverser les dates"
              className="mx-auto w-11 h-11 rounded-full border border-stone-300 bg-white text-stone-600 font-bold hover:border-orange-400 hover:text-orange-700 transition">
              ⇄
            </button>
            <div>
              <label className={labelCls} htmlFor="jours-fin">Date de fin</label>
              <input id="jours-fin" type="date" className={inputCls}
                value={fin} onChange={(e) => setFin(e.target.value)} />
            </div>
          </div>
          <label className="mt-5 flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={alsace} onChange={(e) => setAlsace(e.target.checked)}
              className="mt-1 w-4 h-4 accent-orange-600" />
            <span className="text-sm text-stone-600">
              <strong className="text-stone-800">Alsace-Moselle</strong> — ajouter le Vendredi saint et le
              26 décembre, fériés uniquement dans le Bas-Rhin, le Haut-Rhin et la Moselle.
            </span>
          </label>
          <p className="mt-4 text-xs text-stone-400">
            Intervalle [début, fin) : la durée totale est la différence entre les deux dates, et chaque
            jour de la période est classé une seule fois. Tout est calculé dans votre navigateur.
          </p>
        </div>

        {calc ? (
          <>
            <div className="mt-10 rounded-3xl border border-stone-200 bg-white p-8 sm:p-10 shadow-sm">
              <div className="text-center">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">Durée totale</p>
                <p className="mt-3 font-display text-6xl sm:text-7xl font-bold text-stone-900">
                  {calc.totalJours} jour{calc.totalJours > 1 ? "s" : ""}
                </p>
                <p className="mt-2 text-stone-500">
                  soit {calc.semaines} semaine{calc.semaines > 1 ? "s" : ""}
                  {calc.joursRestants > 0 ? ` et ${calc.joursRestants} jour${calc.joursRestants > 1 ? "s" : ""}` : ""}
                </p>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl bg-orange-50 border border-orange-100 p-5 text-center">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">Jours ouvrés</p>
                  <p className="mt-2 font-display text-3xl font-bold text-stone-900">{calc.joursOuvres}</p>
                  <p className="mt-1 text-xs text-stone-500">lun–ven, hors fériés</p>
                </div>
                <div className="rounded-2xl bg-stone-50 border border-stone-100 p-5 text-center">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">Jours ouvrables</p>
                  <p className="mt-2 font-display text-3xl font-bold text-stone-900">{calc.joursOuvrables}</p>
                  <p className="mt-1 text-xs text-stone-500">lun–sam, hors fériés</p>
                </div>
                <div className="rounded-2xl bg-stone-50 border border-stone-100 p-5 text-center">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">Jours fériés</p>
                  <p className="mt-2 font-display text-3xl font-bold text-stone-900">{calc.feriesDansIntervalle.length}</p>
                  <p className="mt-1 text-xs text-stone-500">dont {calc.feriesEnSemaine} en semaine</p>
                </div>
                <div className="rounded-2xl bg-stone-50 border border-stone-100 p-5 text-center">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">Week-ends</p>
                  <p className="mt-2 font-display text-3xl font-bold text-stone-900">{calc.joursWeekend}</p>
                  <p className="mt-1 text-xs text-stone-500">samedis + dimanches</p>
                </div>
              </div>

              {calc.feriesDansIntervalle.length > 0 && (
                <div className="mt-8">
                  <h3 className="font-display text-lg font-bold text-stone-900 mb-3">
                    Jours fériés dans la période
                  </h3>
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {calc.feriesDansIntervalle.map((f) => (
                      <li key={f.date} className="rounded-xl bg-stone-50 border border-stone-100 px-4 py-2.5 text-sm text-stone-600">
                        <strong className="text-stone-800">{fmtDate(f.date)}</strong> — {f.nom}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <details className="mt-6 rounded-3xl border border-stone-200 bg-white open:shadow-md transition group">
              <summary className="cursor-pointer list-none flex items-center justify-between gap-4 px-6 sm:px-8 py-5 font-bold text-stone-900 [&::-webkit-details-marker]:hidden">
                Les {feriesAnnee.length} jours fériés de {anneeRef}{alsace ? " (avec Alsace-Moselle)" : ""}
                <span className="shrink-0 w-8 h-8 rounded-full bg-orange-100 text-orange-700 grid place-items-center group-open:rotate-45 transition-transform text-xl leading-none">+</span>
              </summary>
              <div className="px-6 sm:px-8 pb-6">
                <ul className="grid gap-2 sm:grid-cols-2">
                  {feriesAnnee.map((f) => (
                    <li key={f.date} className="rounded-xl bg-stone-50 border border-stone-100 px-4 py-2.5 text-sm text-stone-600">
                      <strong className="text-stone-800">{fmtDate(f.date)}</strong> — {f.nom}
                    </li>
                  ))}
                </ul>
              </div>
            </details>
          </>
        ) : (
          <p className="mt-8 rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800 text-center">
            Choisissez une date de fin postérieure ou égale à la date de début.
          </p>
        )}
      </div>
    </section>
  );
}
