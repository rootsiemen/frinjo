"use client";

import { useMemo, useState } from "react";
import { computeDias, festivosPorPais, type PaisCalendario } from "./calc";

const inputCls =
  "w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition";
const labelCls = "block text-sm font-bold text-stone-800 mb-2";

const fmtDate = (iso: string): string => {
  const d = new Date(`${iso}T00:00:00Z`);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
};

export default function DiasCalculator() {
  const [inicio, setInicio] = useState("2026-01-01");
  const [fin, setFin] = useState("2026-12-31");
  const [pais, setPais] = useState<PaisCalendario>("mx");

  const calc = useMemo(() => computeDias(inicio, fin, pais), [inicio, fin, pais]);
  const anioRef = useMemo(() => {
    const y = new Date(`${inicio}T00:00:00Z`).getUTCFullYear();
    return Number.isNaN(y) ? new Date().getFullYear() : y;
  }, [inicio]);
  const festivosAnio = useMemo(() => festivosPorPais(pais, anioRef), [pais, anioRef]);

  const swap = () => {
    setInicio(fin);
    setFin(inicio);
  };

  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-10 shadow-sm">
          <div className="grid gap-5 sm:grid-cols-[1fr_auto_1fr] items-end">
            <div>
              <label className={labelCls} htmlFor="dias-inicio">Fecha de inicio</label>
              <input id="dias-inicio" type="date" className={inputCls}
                value={inicio} onChange={(e) => setInicio(e.target.value)} />
            </div>
            <button type="button" onClick={swap} aria-label="Intercambiar fechas"
              className="mx-auto w-11 h-11 rounded-full border border-stone-300 bg-white text-stone-600 font-bold hover:border-orange-400 hover:text-orange-700 transition">
              ⇄
            </button>
            <div>
              <label className={labelCls} htmlFor="dias-fin">Fecha de fin</label>
              <input id="dias-fin" type="date" className={inputCls}
                value={fin} onChange={(e) => setFin(e.target.value)} />
            </div>
          </div>
          <div className="mt-5 max-w-md">
            <label className={labelCls} htmlFor="dias-pais">Calendario de días festivos</label>
            <select id="dias-pais" className={inputCls} value={pais}
              onChange={(e) => setPais(e.target.value as PaisCalendario)}>
              <option value="mx">México — días de descanso obligatorio (LFT art. 74)</option>
              <option value="es">España — festivos nacionales</option>
              <option value="ninguno">Sin festivos — solo fines de semana</option>
            </select>
          </div>
          <p className="mt-4 text-xs text-stone-400">
            Intervalo [inicio, fin): la duración total es la diferencia entre las dos fechas y cada día
            del periodo se clasifica una sola vez. Todo se calcula en tu navegador.
          </p>
        </div>

        {calc ? (
          <>
            <div className="mt-10 rounded-3xl border border-stone-200 bg-white p-8 sm:p-10 shadow-sm">
              <div className="text-center">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">Duración total</p>
                <p className="mt-3 font-display text-6xl sm:text-7xl font-bold text-stone-900">
                  {calc.totalDias} día{calc.totalDias !== 1 ? "s" : ""}
                </p>
                <p className="mt-2 text-stone-500">
                  {calc.semanas} semana{calc.semanas !== 1 ? "s" : ""}
                  {calc.diasRestantes > 0 ? ` y ${calc.diasRestantes} día${calc.diasRestantes > 1 ? "s" : ""}` : ""}
                </p>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-orange-50 border border-orange-100 p-5 text-center">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">Días hábiles</p>
                  <p className="mt-2 font-display text-3xl font-bold text-stone-900">{calc.diasHabiles}</p>
                  <p className="mt-1 text-xs text-stone-500">lun–vie, sin festivos oficiales</p>
                </div>
                <div className="rounded-2xl bg-stone-50 border border-stone-100 p-5 text-center">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">Días festivos</p>
                  <p className="mt-2 font-display text-3xl font-bold text-stone-900">{calc.festivosEnIntervalo.length}</p>
                  <p className="mt-1 text-xs text-stone-500">{calc.festivosEnSemana} caen entre semana</p>
                </div>
                <div className="rounded-2xl bg-stone-50 border border-stone-100 p-5 text-center">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">Fines de semana</p>
                  <p className="mt-2 font-display text-3xl font-bold text-stone-900">{calc.diasFinDeSemana}</p>
                  <p className="mt-1 text-xs text-stone-500">sábados + domingos</p>
                </div>
              </div>

              {calc.festivosEnIntervalo.length > 0 && (
                <div className="mt-8">
                  <h3 className="font-display text-lg font-bold text-stone-900 mb-3">
                    Días festivos en el periodo
                  </h3>
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {calc.festivosEnIntervalo.map((f) => (
                      <li key={f.fecha} className="rounded-xl bg-stone-50 border border-stone-100 px-4 py-2.5 text-sm text-stone-600">
                        <strong className="text-stone-800">{fmtDate(f.fecha)}</strong> — {f.nombre}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {festivosAnio.length > 0 && (
              <details className="mt-6 rounded-3xl border border-stone-200 bg-white open:shadow-md transition group">
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4 px-6 sm:px-8 py-5 font-bold text-stone-900 [&::-webkit-details-marker]:hidden">
                  Días festivos oficiales de {anioRef} ({pais === "mx" ? "México" : "España"})
                  <span className="shrink-0 w-8 h-8 rounded-full bg-orange-100 text-orange-700 grid place-items-center group-open:rotate-45 transition-transform text-xl leading-none">+</span>
                </summary>
                <div className="px-6 sm:px-8 pb-6">
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {festivosAnio.map((f) => (
                      <li key={f.fecha} className="rounded-xl bg-stone-50 border border-stone-100 px-4 py-2.5 text-sm text-stone-600">
                        <strong className="text-stone-800">{fmtDate(f.fecha)}</strong> — {f.nombre}
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            )}
          </>
        ) : (
          <p className="mt-8 rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800 text-center">
            Elige una fecha de fin posterior o igual a la de inicio.
          </p>
        )}
      </div>
    </section>
  );
}
