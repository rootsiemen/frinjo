"use client";

import { useMemo, useState } from "react";
import { computePta } from "./calc";
import { pkr } from "../salary-tax-calculator-pakistan/calc";

const inputCls =
  "w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 font-semibold text-stone-900 placeholder-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition";
const labelCls = "block text-sm font-bold text-stone-800 mb-2";
const segBtn = (active: boolean) =>
  `flex-1 rounded-xl px-3 py-2.5 text-sm font-bold transition ${active ? "bg-orange-600 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"}`;

export default function PtaTaxCalculator() {
  const [usd, setUsd] = useState("600");
  const [rate, setRate] = useState("280");
  const [regType, setRegType] = useState<"cnic" | "passport">("cnic");
  const [filer, setFiler] = useState(true);
  const [smartphone, setSmartphone] = useState(true);

  const r = useMemo(
    () =>
      computePta({
        usd: parseFloat(usd) || 0,
        rate: parseFloat(rate) || 0,
        regType,
        filer,
        smartphone,
      }),
    [usd, rate, regType, filer, smartphone],
  );

  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-8 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelCls}>Phone value (USD)</label>
              <input type="text" inputMode="decimal" value={usd} onChange={(e) => setUsd(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Exchange rate (Rs per $)</label>
              <input type="text" inputMode="decimal" value={rate} onChange={(e) => setRate(e.target.value)} className={inputCls} />
            </div>
          </div>

          <div className="mt-5">
            <label className={labelCls}>Registration type</label>
            <div className="flex gap-2">
              <button className={segBtn(regType === "cnic")} onClick={() => setRegType("cnic")}>CNIC</button>
              <button className={segBtn(regType === "passport")} onClick={() => setRegType("passport")}>Passport</button>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelCls}>
                Filer status {regType === "passport" && <span className="font-normal text-stone-400">(no effect on passport)</span>}
              </label>
              <div className="flex gap-2">
                <button className={segBtn(filer)} onClick={() => setFiler(true)}>Filer</button>
                <button className={segBtn(!filer)} onClick={() => setFiler(false)}>Non-filer</button>
              </div>
            </div>
            <div>
              <label className={labelCls}>Phone type</label>
              <div className="flex gap-2">
                <button className={segBtn(smartphone)} onClick={() => setSmartphone(true)}>Smartphone</button>
                <button className={segBtn(!smartphone)} onClick={() => setSmartphone(false)}>Basic</button>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-orange-50 border border-orange-100 p-5">
            <p className="text-sm font-bold text-orange-700">Total PTA tax</p>
            <p className="font-display text-3xl font-extrabold text-stone-900">{pkr(r.total)}</p>
            <p className="mt-1 text-xs text-stone-500">
              {regType === "cnic" ? "On CNIC" : "On passport"} · Band: {r.band.label}
            </p>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <tbody>
                {[
                  ["Value in rupees", pkr(r.valueRs)],
                  ["Customs duty", pkr(r.cd)],
                  ["Regulatory duty", pkr(r.rd)],
                  [`Sales tax (${Math.round(r.band.stRate * 100)}%)`, pkr(r.st)],
                  ["Income tax" + (regType === "passport" ? " (exempt on passport)" : !filer ? " (non-filer ×2)" : ""), pkr(r.it)],
                  ["Mobile handset levy", pkr(r.levy)],
                ].map(([k, v]) => (
                  <tr key={k} className="border-b border-stone-100">
                    <td className="py-2 text-stone-600">{k}</td>
                    <td className="py-2 text-right font-semibold text-stone-900">{v}</td>
                  </tr>
                ))}
                <tr className="font-extrabold text-stone-900">
                  <td className="py-2">Total</td>
                  <td className="py-2 text-right">{pkr(r.total)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-4 text-xs text-stone-500">
          Estimate based on SRO 1064(I)/2026 and the Finance Act 2026. Customs uses
          its own assessed value for your exact model — the DIRBS amount on your
          PSID is final. Not official advice.
        </p>
      </div>
    </section>
  );
}
