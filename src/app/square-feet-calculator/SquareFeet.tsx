"use client";

import { useMemo, useState } from "react";

const inputCls =
  "w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition";
const labelCls = "block text-sm font-bold text-stone-800 mb-2";

export type Shape = "rectangle" | "triangle" | "circle";

export function areaSqFt(shape: Shape, a: number, b: number): number {
  if (!(a > 0)) return 0;
  if (shape === "rectangle") return b > 0 ? a * b : 0;
  if (shape === "triangle") return b > 0 ? (a * b) / 2 : 0;
  return Math.PI * a * a; // circle: a = radius
}

interface Room {
  id: number;
  name: string;
  shape: Shape;
  a: string;
  b: string;
}

let nextId = 2;

export default function SquareFeet() {
  const [rooms, setRooms] = useState<Room[]>([
    { id: 1, name: "Room 1", shape: "rectangle", a: "12", b: "10" },
  ]);
  const [price, setPrice] = useState("");
  const [waste, setWaste] = useState("10");

  const roomAreas = useMemo(
    () => rooms.map((r) => areaSqFt(r.shape, Number(r.a), Number(r.b))),
    [rooms]
  );
  const total = roomAreas.reduce((x, y) => x + y, 0);
  const wastePct = Math.max(0, Number(waste) || 0);
  const withWaste = total * (1 + wastePct / 100);
  const priceNum = Number(price);
  const cost = priceNum > 0 ? withWaste * priceNum : null;

  function update(id: number, patch: Partial<Room>) {
    setRooms((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }
  function addRoom() {
    setRooms((rs) => [...rs, { id: nextId, name: `Room ${rs.length + 1}`, shape: "rectangle", a: "", b: "" }]);
    nextId++;
  }
  function removeRoom(id: number) {
    setRooms((rs) => rs.filter((r) => r.id !== id));
  }

  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="space-y-5">
          {rooms.map((r, i) => (
            <div key={r.id} className="rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <input value={r.name} onChange={(e) => update(r.id, { name: e.target.value })}
                  className="font-display text-xl font-bold text-stone-900 bg-transparent border-b border-transparent focus:border-orange-400 focus:outline-none w-44"
                  aria-label="Area name" />
                <div className="flex items-center gap-3">
                  <select value={r.shape} onChange={(e) => update(r.id, { shape: e.target.value as Shape })}
                    className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 focus:border-orange-500 focus:outline-none"
                    aria-label="Shape">
                    <option value="rectangle">Rectangle / square</option>
                    <option value="triangle">Triangle</option>
                    <option value="circle">Circle</option>
                  </select>
                  {rooms.length > 1 && (
                    <button type="button" onClick={() => removeRoom(r.id)}
                      className="text-sm font-semibold text-red-600 hover:text-red-700">
                      Remove
                    </button>
                  )}
                </div>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelCls}>{r.shape === "circle" ? "Radius (ft)" : r.shape === "triangle" ? "Base (ft)" : "Length (ft)"}</label>
                  <input type="number" min="0" step="any" className={inputCls} value={r.a}
                    onChange={(e) => update(r.id, { a: e.target.value })} placeholder="e.g. 12" />
                </div>
                {r.shape !== "circle" && (
                  <div>
                    <label className={labelCls}>{r.shape === "triangle" ? "Height (ft)" : "Width (ft)"}</label>
                    <input type="number" min="0" step="any" className={inputCls} value={r.b}
                      onChange={(e) => update(r.id, { b: e.target.value })} placeholder="e.g. 10" />
                  </div>
                )}
              </div>
              <p className="mt-4 font-display text-2xl font-bold text-stone-900">
                {roomAreas[i].toLocaleString("en-US", { maximumFractionDigits: 2 })} <span className="text-orange-500 text-lg">sq ft</span>
                <span className="ml-3 text-sm font-semibold text-stone-400">
                  = {(roomAreas[i] / 9).toLocaleString("en-US", { maximumFractionDigits: 2 })} sq yd · {(roomAreas[i] * 0.092903).toLocaleString("en-US", { maximumFractionDigits: 2 })} m²
                </span>
              </p>
            </div>
          ))}
        </div>

        <button type="button" onClick={addRoom}
          className="mt-5 inline-flex items-center gap-2 rounded-full border-2 border-orange-700 text-orange-800 font-semibold px-6 py-2.5 hover:border-orange-800 hover:bg-orange-50 transition">
          + Add another room or area
        </button>

        <div className="mt-8 rounded-3xl border border-stone-200 bg-white p-6 sm:p-10 shadow-sm">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="sf-waste">Waste / cutting allowance %</label>
              <input id="sf-waste" type="number" min="0" max="100" className={inputCls} value={waste}
                onChange={(e) => setWaste(e.target.value)} />
              <p className="mt-1.5 text-xs text-stone-400">10% is standard for flooring; 15% for diagonal tile or patterned installs.</p>
            </div>
            <div>
              <label className={labelCls} htmlFor="sf-price">Material price per sq ft (optional, $)</label>
              <input id="sf-price" type="number" min="0" step="any" className={inputCls} value={price}
                onChange={(e) => setPrice(e.target.value)} placeholder="e.g. 3.50" />
            </div>
          </div>
          <div className="mt-7 grid gap-4 sm:grid-cols-3 text-center">
            <div className="rounded-2xl bg-stone-50 border border-stone-100 p-5">
              <p className="font-display text-3xl font-bold text-stone-900">{total.toLocaleString("en-US", { maximumFractionDigits: 2 })}</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-wider text-stone-500">Total sq ft</p>
            </div>
            <div className="rounded-2xl bg-stone-50 border border-stone-100 p-5">
              <p className="font-display text-3xl font-bold text-stone-900">{withWaste.toLocaleString("en-US", { maximumFractionDigits: 1 })}</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-wider text-stone-500">Sq ft to buy (with waste)</p>
            </div>
            <div className="rounded-2xl bg-stone-50 border border-stone-100 p-5">
              <p className="font-display text-3xl font-bold text-stone-900">
                {cost !== null ? `$${cost.toLocaleString("en-US", { maximumFractionDigits: 0 })}` : "—"}
              </p>
              <p className="mt-1 text-xs font-bold uppercase tracking-wider text-stone-500">Estimated material cost</p>
            </div>
          </div>
          <p className="mt-4 text-xs text-stone-400 text-center">
            Runs in your browser; measurements are never stored. Measure each space, add it as its own
            area — closets and hallways included — and the totals stay honest.
          </p>
        </div>
      </div>
    </section>
  );
}
