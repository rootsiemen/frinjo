"use client";

import { useMemo, useState } from "react";
import { computeLoan } from "./calc";

const inputCls =
  "w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition";
const labelCls = "block text-sm font-bold text-stone-800 mb-2";

const num = (s: string): number => {
  const v = parseFloat(s.replace(",", "."));
  return Number.isFinite(v) ? v : 0;
};

const CURRENCIES: { code: string; label: string; locale: string; rate: string; amount: string }[] = [
  { code: "USD", label: "Dólares ($) — EE. UU. / genérico", locale: "es-US", rate: "12", amount: "10000" },
  { code: "MXN", label: "Pesos mexicanos ($)", locale: "es-MX", rate: "18", amount: "50000" },
  { code: "EUR", label: "Euros (€) — España", locale: "es-ES", rate: "8", amount: "10000" },
  { code: "COP", label: "Pesos colombianos ($)", locale: "es-CO", rate: "16", amount: "20000000" },
  { code: "ARS", label: "Pesos argentinos ($)", locale: "es-AR", rate: "60", amount: "1000000" },
  { code: "PEN", label: "Soles (S/) — Perú", locale: "es-PE", rate: "15", amount: "20000" },
];

export default function PrestamosCalculator() {
  const [currencyCode, setCurrencyCode] = useState("USD");
  const [monto, setMonto] = useState("10000");
  const [tasa, setTasa] = useState("12");
  const [plazoMeses, setPlazoMeses] = useState("36");

  const currency = CURRENCIES.find((c) => c.code === currencyCode) ?? CURRENCIES[0];
  const fmt = useMemo(
    () => new Intl.NumberFormat(currency.locale, { style: "currency", currency: currency.code }),
    [currency],
  );

  const changeCurrency = (code: string) => {
    const next = CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0];
    setCurrencyCode(code);
    setMonto(next.amount);
    setTasa(next.rate);
  };

  const calc = useMemo(() => {
    const principal = num(monto);
    const months = Math.min(360, Math.max(1, Math.round(num(plazoMeses)) || 0));
    if (!(principal > 0) || months <= 0) return null;
    return { principal, months, loan: computeLoan(principal, num(tasa), months) };
  }, [monto, tasa, plazoMeses]);

  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-10 shadow-sm">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="pre-moneda">Moneda</label>
              <select id="pre-moneda" className={inputCls} value={currencyCode} onChange={(e) => changeCurrency(e.target.value)}>
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls} htmlFor="pre-monto">Monto del préstamo</label>
              <input id="pre-monto" type="number" min="0" step="100" className={inputCls}
                value={monto} onChange={(e) => setMonto(e.target.value)} />
            </div>
            <div>
              <label className={labelCls} htmlFor="pre-tasa">Tasa de interés anual (%)</label>
              <input id="pre-tasa" type="number" min="0" step="0.1" className={inputCls}
                value={tasa} onChange={(e) => setTasa(e.target.value)} />
              <p className="mt-2 text-xs text-stone-400">Usa la tasa del contrato (en muchos países se expresa como tasa efectiva anual). Sin comisiones ni seguros: agrégalos a la tasa para comparar el costo real.</p>
            </div>
            <div>
              <label className={labelCls} htmlFor="pre-plazo">Plazo (meses)</label>
              <input id="pre-plazo" type="number" min="1" max="360" step="1" className={inputCls}
                value={plazoMeses} onChange={(e) => setPlazoMeses(e.target.value)} />
              <input type="range" min="6" max="120" step="6" aria-label="Plazo en meses"
                className="mt-3 w-full accent-orange-600" value={plazoMeses}
                onChange={(e) => setPlazoMeses(e.target.value)} />
              <div className="flex justify-between text-[11px] font-bold text-stone-400 uppercase tracking-wide">
                <span>6 meses</span><span>120 meses</span>
              </div>
            </div>
          </div>
          <p className="mt-4 text-xs text-stone-400">
            Sistema de amortización francés (cuota fija mensual). Todo se calcula en tu navegador; nada queda guardado.
          </p>
        </div>

        {calc ? (
          <>
            <div className="mt-10 rounded-3xl border border-stone-200 bg-white p-8 sm:p-10 shadow-sm">
              <div className="text-center">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">Tu cuota mensual</p>
                <p className="mt-3 font-display text-6xl sm:text-7xl font-bold text-stone-900">
                  {fmt.format(calc.loan.monthlyPayment)}
                </p>
                <p className="mt-2 text-stone-500">
                  Préstamo de {fmt.format(calc.principal)} a {calc.months} meses
                  {num(tasa) > 0 ? ` al ${num(tasa)}% anual` : " sin intereses"}
                </p>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-3 max-w-3xl mx-auto">
                <div className="rounded-2xl bg-stone-50 border border-stone-100 p-5 text-center">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">Intereses totales</p>
                  <p className="mt-2 font-display text-xl font-bold text-stone-900">{fmt.format(calc.loan.totalInterest)}</p>
                </div>
                <div className="rounded-2xl bg-stone-50 border border-stone-100 p-5 text-center">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">Total a pagar</p>
                  <p className="mt-2 font-display text-xl font-bold text-stone-900">{fmt.format(calc.loan.totalPaid)}</p>
                </div>
                <div className="rounded-2xl bg-stone-50 border border-stone-100 p-5 text-center">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">Costo del crédito</p>
                  <p className="mt-2 font-display text-xl font-bold text-stone-900">
                    {calc.principal > 0 ? `${((calc.loan.totalInterest / calc.principal) * 100).toFixed(1)}%` : "—"}
                  </p>
                </div>
              </div>
            </div>

            <details className="mt-6 rounded-3xl border border-stone-200 bg-white open:shadow-md transition group">
              <summary className="cursor-pointer list-none flex items-center justify-between gap-4 px-6 sm:px-8 py-5 font-bold text-stone-900 [&::-webkit-details-marker]:hidden">
                Tabla de amortización anual
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
                    {calc.loan.byYear.map((row) => (
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
            Introduce un monto válido para ver tu cuota mensual.
          </p>
        )}
      </div>
    </section>
  );
}
