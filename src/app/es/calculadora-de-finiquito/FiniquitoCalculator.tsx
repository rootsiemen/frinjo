"use client";

import { useMemo, useState } from "react";
import { computeFiniquito, diasVacacionesPorAnio } from "./calc";

const inputCls =
  "w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition";
const labelCls = "block text-sm font-bold text-stone-800 mb-2";

const num = (s: string): number => {
  const v = parseFloat(s.replace(",", "."));
  return Number.isFinite(v) ? v : 0;
};

export default function FiniquitoCalculator() {
  const [salario, setSalario] = useState("12000");
  const [anios, setAnios] = useState("1");
  const [diasAnio, setDiasAnio] = useState("200");
  const [pendientes, setPendientes] = useState("15");
  const [noGozadas, setNoGozadas] = useState("0");
  const [diasAguinaldo, setDiasAguinaldo] = useState("15");

  const fmt = useMemo(
    () => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }),
    [],
  );

  const calc = useMemo(() => {
    if (!(num(salario) > 0)) return null;
    return computeFiniquito({
      salarioMensual: num(salario),
      diasSalarioPendiente: num(pendientes),
      diasTrabajadosAnio: Math.round(num(diasAnio)),
      aniosCompletos: Math.floor(num(anios)),
      diasVacacionesNoGozadas: num(noGozadas),
      diasAguinaldo: num(diasAguinaldo),
    });
  }, [salario, pendientes, diasAnio, anios, noGozadas, diasAguinaldo]);

  const anioServicio = Math.floor(num(anios)) + 1;
  const diasVacTabla = diasVacacionesPorAnio(anioServicio);

  const rows: [string, string][] = calc
    ? [
        [`Salarios pendientes (${pendientes || 0} días × ${fmt.format(calc.salarioDiario)})`, fmt.format(calc.salarioPendiente)],
        ["Aguinaldo proporcional", fmt.format(calc.aguinaldoProporcional)],
        [`Vacaciones proporcionales (${calc.diasVacacionesProporcionales} días de ${diasVacTabla} del año en curso)`, fmt.format(calc.vacacionesProporcionales)],
        ["Vacaciones no gozadas de años anteriores", fmt.format(calc.vacacionesNoGozadas)],
        ["Prima vacacional (25% de las vacaciones)", fmt.format(calc.primaVacacional)],
      ]
    : [];

  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-10 shadow-sm">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="fin-salario">Salario mensual bruto ($)</label>
              <input id="fin-salario" type="number" min="0" step="100" className={inputCls}
                value={salario} onChange={(e) => setSalario(e.target.value)} />
            </div>
            <div>
              <label className={labelCls} htmlFor="fin-anios">Años completos de servicio</label>
              <input id="fin-anios" type="number" min="0" step="1" className={inputCls}
                value={anios} onChange={(e) => setAnios(e.target.value)} />
              <p className="mt-2 text-xs text-stone-400">
                Estás en tu año de servicio n.º {anioServicio}: te tocan {diasVacTabla} días de vacaciones al año según la tabla LFT.
              </p>
            </div>
            <div>
              <label className={labelCls} htmlFor="fin-dias-anio">Días trabajados en el año en curso (0–365)</label>
              <input id="fin-dias-anio" type="number" min="0" max="365" step="1" className={inputCls}
                value={diasAnio} onChange={(e) => setDiasAnio(e.target.value)} />
              <p className="mt-2 text-xs text-stone-400">Desde el 1.º de enero (o tu ingreso) hasta tu último día.</p>
            </div>
            <div>
              <label className={labelCls} htmlFor="fin-pendientes">Días de salario ya trabajados y no pagados</label>
              <input id="fin-pendientes" type="number" min="0" step="1" className={inputCls}
                value={pendientes} onChange={(e) => setPendientes(e.target.value)} />
              <p className="mt-2 text-xs text-stone-400">Ej.: si te pagan por quincena y sales el día 15 sin cobrar, son 15 días.</p>
            </div>
            <div>
              <label className={labelCls} htmlFor="fin-nogozadas">Días de vacaciones de años anteriores que nunca tomaste</label>
              <input id="fin-nogozadas" type="number" min="0" step="1" className={inputCls}
                value={noGozadas} onChange={(e) => setNoGozadas(e.target.value)} />
            </div>
            <div>
              <label className={labelCls} htmlFor="fin-aguinaldo">Días de aguinaldo de tu empresa (mín. 15)</label>
              <input id="fin-aguinaldo" type="number" min="15" step="1" className={inputCls}
                value={diasAguinaldo} onChange={(e) => setDiasAguinaldo(e.target.value)} />
            </div>
          </div>
          <p className="mt-4 text-xs text-stone-400">
            Montos brutos, antes de ISR e IMSS. Todo se calcula en tu navegador; nada queda guardado.
          </p>
        </div>

        {calc ? (
          <div className="mt-10 rounded-3xl border border-stone-200 bg-white p-8 sm:p-10 shadow-sm">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">Tu finiquito estimado (bruto)</p>
              <p className="mt-3 font-display text-6xl sm:text-7xl font-bold text-stone-900">
                {fmt.format(calc.total)}
              </p>
              <p className="mt-2 text-stone-500">
                Con salario diario de {fmt.format(calc.salarioDiario)} (mensual ÷ 30)
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
                    <td className="py-3 px-4 font-bold text-stone-900">Total finiquito</td>
                    <td className="py-3 px-4 text-right font-bold text-stone-900 whitespace-nowrap">{fmt.format(calc.total)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-6 text-sm text-stone-500 max-w-2xl mx-auto text-center">
              Esto es el <strong>finiquito</strong> (renuncia o acuerdo). Si te despidieron sin causa, lo
              que corresponde es una <strong>liquidación</strong>: a estos conceptos se sumarían 3 meses
              de salario de indemnización, 20 días por año en ciertos casos y la prima de antigüedad —
              conceptos que esta calculadora no mezcla, porque son jurídicamente distintos.
            </p>
          </div>
        ) : (
          <p className="mt-8 rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800 text-center">
            Introduce tu salario mensual para calcular tu finiquito.
          </p>
        )}
      </div>
    </section>
  );
}
