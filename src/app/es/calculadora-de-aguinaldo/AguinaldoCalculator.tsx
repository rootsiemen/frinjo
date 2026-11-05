"use client";

import { useMemo, useState } from "react";
import { computeAguinaldo, diasTrabajadosEnAnio } from "./calc";

const inputCls =
  "w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition";
const labelCls = "block text-sm font-bold text-stone-800 mb-2";

const num = (s: string): number => {
  const v = parseFloat(s.replace(",", "."));
  return Number.isFinite(v) ? v : 0;
};

export default function AguinaldoCalculator() {
  const [salario, setSalario] = useState("12000");
  const [modo, setModo] = useState<"dias" | "fecha">("dias");
  const [dias, setDias] = useState("365");
  const [fechaIngreso, setFechaIngreso] = useState("2026-01-01");
  const [diasOtorgados, setDiasOtorgados] = useState("15");

  const fmt = useMemo(
    () => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }),
    [],
  );

  const diasEfectivos = useMemo(() => {
    if (modo === "fecha") {
      const anio = new Date().getFullYear();
      return diasTrabajadosEnAnio(fechaIngreso, anio);
    }
    return Math.round(num(dias));
  }, [modo, dias, fechaIngreso]);

  const calc = useMemo(() => {
    if (!(num(salario) > 0)) return null;
    return computeAguinaldo({
      salarioMensual: num(salario),
      diasTrabajados: diasEfectivos,
      diasAguinaldo: num(diasOtorgados),
    });
  }, [salario, diasEfectivos, diasOtorgados]);

  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-10 shadow-sm">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="ag-salario">Salario mensual bruto ($)</label>
              <input id="ag-salario" type="number" min="0" step="100" className={inputCls}
                value={salario} onChange={(e) => setSalario(e.target.value)} />
              <p className="mt-2 text-xs text-stone-400">Tu salario mensual antes de impuestos. El salario diario se obtiene dividiendo entre 30.</p>
            </div>
            <div>
              <label className={labelCls} htmlFor="ag-dias-otorgados">Días de aguinaldo de tu empresa</label>
              <input id="ag-dias-otorgados" type="number" min="15" step="1" className={inputCls}
                value={diasOtorgados} onChange={(e) => setDiasOtorgados(e.target.value)} />
              <p className="mt-2 text-xs text-stone-400">El mínimo legal es 15 días (art. 87 LFT). Algunas empresas otorgan 20, 30 o más.</p>
            </div>
          </div>

          <div className="mt-6">
            <span className={labelCls}>¿Cuánto tiempo trabajaste este año?</span>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => setModo("dias")}
                className={`rounded-full px-5 py-2.5 font-bold text-sm transition ${modo === "dias" ? "bg-orange-600 text-white" : "bg-white border border-stone-300 text-stone-700 hover:border-orange-400"}`}>
                Por días trabajados
              </button>
              <button type="button" onClick={() => setModo("fecha")}
                className={`rounded-full px-5 py-2.5 font-bold text-sm transition ${modo === "fecha" ? "bg-orange-600 text-white" : "bg-white border border-stone-300 text-stone-700 hover:border-orange-400"}`}>
                Por fecha de ingreso
              </button>
            </div>
          </div>

          {modo === "dias" ? (
            <div className="mt-5 max-w-sm">
              <label className={labelCls} htmlFor="ag-dias">Días trabajados en el año (1–365)</label>
              <input id="ag-dias" type="number" min="0" max="365" step="1" className={inputCls}
                value={dias} onChange={(e) => setDias(e.target.value)} />
              <input type="range" min="1" max="365" step="1" aria-label="Días trabajados"
                className="mt-3 w-full accent-orange-600" value={dias}
                onChange={(e) => setDias(e.target.value)} />
              <div className="flex justify-between text-[11px] font-bold text-stone-400 uppercase tracking-wide">
                <span>1 día</span><span>Año completo (365)</span>
              </div>
            </div>
          ) : (
            <div className="mt-5 max-w-sm">
              <label className={labelCls} htmlFor="ag-fecha">Fecha de ingreso a la empresa</label>
              <input id="ag-fecha" type="date" className={inputCls}
                value={fechaIngreso} onChange={(e) => setFechaIngreso(e.target.value)} />
              <p className="mt-2 text-xs text-stone-400">
                Días trabajados este año según tu fecha: <strong className="text-stone-700">{diasEfectivos}</strong>
              </p>
            </div>
          )}

          <p className="mt-4 text-xs text-stone-400">
            Resultado bruto, antes de ISR. Todo se calcula en tu navegador; nada queda guardado.
          </p>
        </div>

        {calc ? (
          <div className="mt-10 rounded-3xl border border-stone-200 bg-white p-8 sm:p-10 shadow-sm">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">
                Tu aguinaldo {calc.esProporcional ? "proporcional " : ""}2026 (bruto)
              </p>
              <p className="mt-3 font-display text-6xl sm:text-7xl font-bold text-stone-900">
                {fmt.format(calc.aguinaldoBruto)}
              </p>
              <p className="mt-2 text-stone-500">
                Fecha límite legal de pago: <strong>antes del 20 de diciembre</strong> (art. 87 LFT)
              </p>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-3 max-w-3xl mx-auto">
              <div className="rounded-2xl bg-stone-50 border border-stone-100 p-5 text-center">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">Salario diario</p>
                <p className="mt-2 font-display text-xl font-bold text-stone-900">{fmt.format(calc.salarioDiario)}</p>
              </div>
              <div className="rounded-2xl bg-stone-50 border border-stone-100 p-5 text-center">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">Año completo sería</p>
                <p className="mt-2 font-display text-xl font-bold text-stone-900">{fmt.format(calc.aguinaldoAnioCompleto)}</p>
              </div>
              <div className="rounded-2xl bg-stone-50 border border-stone-100 p-5 text-center">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">Días trabajados</p>
                <p className="mt-2 font-display text-xl font-bold text-stone-900">{calc.diasTrabajados} de 365</p>
              </div>
            </div>
            {calc.esProporcional && (
              <p className="mt-6 text-center text-sm text-stone-500 max-w-2xl mx-auto">
                Como no cumpliste el año completo, te corresponde la parte proporcional:{" "}
                {calc.diasTrabajados} ÷ 365 × {fmt.format(calc.aguinaldoAnioCompleto)} ={" "}
                {fmt.format(calc.aguinaldoBruto)}. La ley garantiza esa proporción aunque hayas trabajado
                solo unos meses — y también forma parte de tu finiquito si sales antes de diciembre.
              </p>
            )}
          </div>
        ) : (
          <p className="mt-8 rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800 text-center">
            Introduce tu salario mensual para calcular tu aguinaldo.
          </p>
        )}
      </div>
    </section>
  );
}
