"use client";
import { useEffect, useState } from "react";

interface Order {
  id: number; name: string; email: string; whatsapp: string;
  package: string; amount: number; payMethod: string; txnId: string;
  note: string; status: string; createdAt: string;
}

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  paid: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-stone-200 text-stone-600",
};

const PAY_LABEL: Record<string, string> = {
  jazzcash: "JazzCash",
  easypaisa: "Easypaisa",
  binance: "Binance Pay",
  payoneer: "Payoneer",
  "usdt-trc20": "USDT (TRC20)",
  "usdt-bep20": "USDT (BEP20)",
};

export default function OrdersPage() {
  const [items, setItems] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch("/api/admin/orders");
    const data = await res.json();
    setItems(data.orders || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function setStatus(id: number, status: string) {
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  async function remove(id: number) {
    if (!confirm("Delete this order?")) return;
    await fetch(`/api/admin/orders/${id}`, { method: "DELETE" });
    load();
  }

  const pending = items.filter((o) => o.status === "pending").length;

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-stone-900">Orders</h1>
      <p className="text-stone-500 mt-1 text-sm">
        {items.length} total · <span className="font-semibold text-amber-700">{pending} awaiting payment verification</span>
      </p>
      {loading ? (
        <p className="mt-8 text-stone-500">Loading…</p>
      ) : items.length === 0 ? (
        <p className="mt-8 text-stone-500">No orders yet.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {items.map((o) => (
            <div key={o.id} className="rounded-2xl bg-white border border-stone-200 p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-stone-900">
                    Order #{o.id} — {o.name}
                  </p>
                  <p className="text-sm text-stone-500">{o.email} · {o.whatsapp}</p>
                  <p className="text-sm text-stone-600 mt-2">
                    <span className="font-semibold">{o.package}</span> · ${o.amount} · {PAY_LABEL[o.payMethod] || o.payMethod}
                  </p>
                  <p className="text-sm text-stone-600 mt-1">
                    <span className="font-semibold">Txn:</span>{" "}
                    <span className="font-mono text-xs bg-stone-100 rounded px-2 py-1 break-all">{o.txnId}</span>
                  </p>
                  {o.note && <p className="text-sm text-stone-500 mt-2 italic">"{o.note}"</p>}
                  <p className="text-xs text-stone-400 mt-2">{new Date(o.createdAt).toLocaleString()}</p>
                </div>
                <span className={`text-xs font-bold uppercase tracking-wide rounded-full px-3 py-1.5 ${STATUS_STYLE[o.status] || STATUS_STYLE.pending}`}>
                  {o.status}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {o.status === "pending" && (
                  <button
                    onClick={() => setStatus(o.id, "paid")}
                    className="rounded-full bg-emerald-600 text-white text-xs font-bold px-4 py-2 hover:bg-emerald-700 transition"
                  >
                    ✓ Mark as Paid
                  </button>
                )}
                {o.status !== "cancelled" && (
                  <button
                    onClick={() => setStatus(o.id, "cancelled")}
                    className="rounded-full bg-stone-200 text-stone-700 text-xs font-bold px-4 py-2 hover:bg-stone-300 transition"
                  >
                    Cancel
                  </button>
                )}
                {o.status !== "pending" && (
                  <button
                    onClick={() => setStatus(o.id, "pending")}
                    className="rounded-full bg-amber-100 text-amber-800 text-xs font-bold px-4 py-2 hover:bg-amber-200 transition"
                  >
                    Back to Pending
                  </button>
                )}
                <button
                  onClick={() => remove(o.id)}
                  className="rounded-full bg-red-50 text-red-600 text-xs font-bold px-4 py-2 hover:bg-red-100 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
