"use client";

import { useMemo, useState } from "react";
import { amortizationByYear } from "./calc";

const inputCls =
  "w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition";
const labelCls = "block text-sm font-bold text-stone-800 mb-2";

/** Spanish users type decimal commas — accept both. */
const num = (s: string): number => {
  const v = parseFloat(s.replace(",", "."));
  return Number.isFinite(v) ? v : 0;
};

type Region = "es" | "us";

export default function HipotecaCalculator() {
  const [region, setRegion] = useState<Region>("es");
  const [precio, setPrecio] = useState("200000");
  const [entradaMode, setEntradaMode] = useState<"pct" | "amount">("pct");
  const [entradaVal, setEntradaVal] = useState("20");
  const [interes, setInteres] = useState("3.5");
  const [plazo, setPlazo] = useState("30");
  // EE. UU. extras
  const [taxPct, setTaxPct] = useState("1.1");
  const [seguroAnual, setSeguroAnual] = useState("1200");
  const [hoa, setHoa] = useState("0");

  const currency = region === "es" ? "EUR" : "USD";
  const fmt = useMemo(
    () => new Intl.NumberFormat("es-ES", { style: "currency", currency }),
    [currency],
  );

  const changeRegion = (r: Region) => {
    setRegion(r);
    if (r === "us") {
      setPrecio("350000");
      setInteres("6.5");
    } else {
      setPrecio("200000");
      setInteres("3.5");
    }
    setEntradaMode("pct");
    setEntradaVal("20");
  };

  const calc = useMemo(() => {
    const price = num(precio);
    const down = entradaMode === "pct" ? (price * num(entradaVal)) / 100 : num(entradaVal);
    const principal = price - down;
    const years = Math.min(40, Math.max(1, Math.round(num(plazo)) || 0));
    if (!(price > 0) || !(principal > 0) || years <= 0) return null;
    const amort = amortizationByYear(principal, num(interes), years);
    const taxMonthly = region === "us" ? (price * num(taxPct)) / 100 / 12 : 0;
    const insuranceMonthly = region === "us" ? num(seguroAnual) / 12 : 0;
    const hoaMonthly = region === "us" ? num(hoa) : 0;
    return {
      price,
      down,
      principal,
      years,
      amort,
      taxMonthly,
      insuranceMonthly,
      hoaMonthly,
      totalMonthly: amort.monthlyPayment + taxMonthly + insuranceMonthly + hoaMonthly,
    };
  }, [precio, entradaMode, entradaVal, interes, plazo, region, taxPct, seguroAnual, hoa]);

  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-10 shadow-sm">
          {/* Region toggle */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button type="button" onClick={() => changeRegion("es")}
              className={`rounded-full px-5 py-2 font-bold text-sm transition ${region === "es" ? "bg-orange-600 text-white" : "bg-white border border-stone-300 text-stone-700 hover:border-orange-400"}`}>
              España (€)
            </button>
            <button type="button" onClick={() => changeRegion("us")}
              className={`rounded-full px-5 py-2 font-bold text-sm transition ${region === "us" ? "bg-orange-600 text-white" : "bg-white border border-stone-300 text-stone-700 hover:border-orange-400"}`}>
              EE. UU. y Latinoamérica ($)
            </button>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="hip-precio">Precio de la vivienda</label>
              <input id="hip-precio" type="number" min="0" step="1000" className={inputCls}
                value={precio} onChange={(e) => setPrecio(e.target.value)} />
            </div>
            <div>
              <label className={labelCls} htmlFor="hip-entrada">
                Entrada {entradaMode === "pct" ? "(%)" : region === "es" ? "(€)" : "($)"}
              </label>
              <div className="flex gap-2">
                <input id="hip-entrada" type="number" min="0" step="0.5" className={inputCls}
                  value={entradaVal} onChange={(e) => setEntradaVal(e.target.value)} />
                <div className="flex shrink-0 overflow-hidden rounded-2xl border border-stone-300">
                  <button type="button" onClick={() => setEntradaMode("pct")}
                    className={`px-4 font-bold text-sm transition ${entradaMode === "pct" ? "bg-orange-600 text-white" : "bg-white text-stone-600"}`}>%</button>
                  <button type="button" onClick={() => setEntradaMode("amount")}
                    className={`px-4 font-bold text-sm transition ${entradaMode === "amount" ? "bg-orange-600 text-white" : "bg-white text-stone-600"}`}>
                    {region === "es" ? "€" : "$"}
                  </button>
                </div>
              </div>
            </div>
            <div>
              <label className={labelCls} htmlFor="hip-interes">Tipo de interés anual (%)</label>
              <input id="hip-interes" type="number" min="0" step="0.05" className={inputCls}
                value={interes} onChange={(e) => setInteres(e.target.value)} />
            </div>
            <div>
              <label className={labelCls} htmlFor="hip-plazo">Plazo (años)</label>
              <input id="hip-plazo" type="number" min="5" max="40" step="1" className={inputCls}
                value={plazo} onChange={(e) => setPlazo(e.target.value)} />
              <input type="range" min="5" max="40" step="1" aria-label="Plazo en años"
                className="mt-3 w-full accent-orange-600" value={plazo}
                onChange={(e) => setPlazo(e.target.value)} />
              <div className="flex justify-between text-[11px] font-bold text-stone-400 uppercase tracking-wide">
                <span>5 años</span><span>40 años</span>
              </div>
            </div>
          </div>

          {region === "us" && (
            <div className="mt-5 grid gap-5 sm:grid-cols-3">
              <div>
                <label className={labelCls} htmlFor="hip-tax">Impuesto predial anual (%)</label>
                <input id="hip-tax" type="number" min="0" step="0.05" className={inputCls}
                  value={taxPct} onChange={(e) => setTaxPct(e.target.value)} />
                <p className="mt-2 text-xs text-stone-400">% del precio de la vivienda. Media en EE. UU.: ~1.1%.</p>
              </div>
              <div>
                <label className={labelCls} htmlFor="hip-seguro">Seguro de hogar anual ($)</label>
                <input id="hip-seguro" type="number" min="0" step="50" className={inputCls}
                  value={seguroAnual} onChange={(e) => setSeguroAnual(e.target.value)} />
              </div>
              <div>
                <label className={labelCls} htmlFor="hip-hoa">HOA mensual ($)</label>
                <input id="hip-hoa" type="number" min="0" step="10" className={inputCls}
                  value={hoa} onChange={(e) => setHoa(e.target.value)} />
                <p className="mt-2 text-xs text-stone-400">Cuota de la comunidad/asociación, si aplica.</p>
              </div>
            </div>
          )}

          <p className="mt-4 text-xs text-stone-400">
            Sistema de amortización francés (cuota fija). Todo se calcula en tu navegador; nada queda guardado.
          </p>
        </div>

        {calc ? (
          <>
            <div className="mt-10 rounded-3xl border border-stone-200 bg-white p-8 sm:p-10 shadow-sm">
              <div className="text-center">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">
                  {region === "us" ? "Pago mensual total" : "Tu cuota mensual"}
                </p>
                <p className="mt-3 font-display text-6xl sm:text-7xl font-bold text-stone-900">
                  {fmt.format(region === "us" ? calc.totalMonthly : calc.amort.monthlyPayment)}
                </p>
                <p className="mt-2 text-stone-500">
                  Préstamo de {fmt.format(calc.principal)} a {calc.years} años
                  {num(interes) > 0 ? ` al ${num(interes)}%` : " sin intereses"}
                </p>
              </div>

              {region === "us" && (
                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-3xl mx-auto">
                  <div className="rounded-2xl bg-stone-50 border border-stone-100 p-5 text-center">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">Capital + intereses</p>
                    <p className="mt-2 font-display text-xl font-bold text-stone-900">{fmt.format(calc.amort.monthlyPayment)}</p>
                  </div>
                  <div className="rounded-2xl bg-stone-50 border border-stone-100 p-5 text-center">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">Impuestos / mes</p>
                    <p className="mt-2 font-display text-xl font-bold text-stone-900">{fmt.format(calc.taxMonthly)}</p>
                  </div>
                  <div className="rounded-2xl bg-stone-50 border border-stone-100 p-5 text-center">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">Seguro / mes</p>
                    <p className="mt-2 font-display text-xl font-bold text-stone-900">{fmt.format(calc.insuranceMonthly)}</p>
                  </div>
                  <div className="rounded-2xl bg-stone-50 border border-stone-100 p-5 text-center">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">HOA / mes</p>
                    <p className="mt-2 font-display text-xl font-bold text-stone-900">{fmt.format(calc.hoaMonthly)}</p>
                  </div>
                </div>
              )}

              <div className="mt-8 grid gap-4 sm:grid-cols-3 max-w-3xl mx-auto">
                <div className="rounded-2xl bg-stone-50 border border-stone-100 p-5 text-center">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">Entrada</p>
                  <p className="mt-2 font-display text-xl font-bold text-stone-900">{fmt.format(calc.down)}</p>
                </div>
                <div className="rounded-2xl bg-stone-50 border border-stone-100 p-5 text-center">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">Intereses totales</p>
                  <p className="mt-2 font-display text-xl font-bold text-stone-900">{fmt.format(calc.amort.totalInterest)}</p>
                </div>
                <div className="rounded-2xl bg-stone-50 border border-stone-100 p-5 text-center">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">Coste total del préstamo</p>
                  <p className="mt-2 font-display text-xl font-bold text-stone-900">{fmt.format(calc.amort.totalPaid)}</p>
                </div>
              </div>
            </div>

            <details className="mt-6 rounded-3xl border border-stone-200 bg-white open:shadow-md transition group">
              <summary className="cursor-pointer list-none flex items-center justify-between gap-4 px-6 sm:px-8 py-5 font-bold text-stone-900 [&::-webkit-details-marker]:hidden">
                Tabla de amortización anual ({calc.amort.rows.length} años)
                <span className="shrink-0 w-8 h-8 rounded-full bg-orange-100 text-orange-700 grid place-items-center group-open:rotate-45 transition-transform text-xl leading-none">+</span>
              </summary>
              <div className="px-6 sm:px-8 pb-6 max-h-96 overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wide text-stone-400 border-b border-stone-200">
                      <th className="py-2 pr-3">Año</th>
                      <th className="py-2 pr-3 text-right">Capital amortizado</th>
                      <th className="py-2 pr-3 text-right">Intereses</th>
                      <th className="py-2 text-right">Saldo pendiente</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calc.amort.rows.map((row) => (
                      <tr key={row.year} className="border-b border-stone-100 last:border-0">
                        <td className="py-2 pr-3 font-bold text-stone-800">{row.year}</td>
                        <td className="py-2 pr-3 text-right text-stone-600">{fmt.format(row.principalPaid)}</td>
                        <td className="py-2 pr-3 text-right text-stone-600">{fmt.format(row.interestPaid)}</td>
                        <td className="py-2 text-right text-stone-600">{fmt.format(row.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          </>
        ) : (
          <p className="mt-8 rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800 text-center">
            Introduce un precio válido y una entrada menor que el precio para ver tu cuota.
          </p>
        )}
      </div>
    </section>
  );
}
