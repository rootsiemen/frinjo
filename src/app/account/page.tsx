"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Order { id: number; package: string; amount: number; pay_method: string; txn_id: string; status: string; created_at: string; }

export default function AccountPage() {
  const router = useRouter();
  const [customer, setCustomer] = useState<{ name: string; email: string; whatsapp: string } | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const me = await fetch("/api/auth/session");
        if (!me.ok) { router.push("/login"); return; }
        const { customer } = await me.json();
        setCustomer(customer);
        const o = await fetch("/api/auth/orders");
        if (o.ok) setOrders((await o.json()).orders || []);
      } catch { router.push("/login"); }
      finally { setLoading(false); }
    })();
  }, [router]);

  async function logout() {
    await fetch("/api/auth/session", { method: "POST" });
    router.push("/");
  }

  if (loading) return <div className="max-w-3xl mx-auto px-4 py-16 text-center text-stone-500">Loading...</div>;
  if (!customer) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-stone-900">Hi, {customer.name} 👋</h1>
          <p className="text-sm text-stone-500 mt-1">{customer.email}{customer.whatsapp ? ` · ${customer.whatsapp}` : ""}</p>
        </div>
        <button onClick={logout} className="text-sm font-semibold text-stone-500 hover:text-red-600 border border-stone-200 rounded-xl px-4 py-2">Sign out</button>
      </div>

      <h2 className="font-display text-xl font-bold text-stone-900 mt-10 mb-4">Your orders</h2>
      {orders.length === 0 ? (
        <div className="rounded-3xl bg-white border border-stone-200 p-8 text-center">
          <p className="text-stone-500 text-sm">No orders yet. Ready to get your website built?</p>
          <Link href="/pricing" className="inline-block mt-4 rounded-xl bg-emerald-700 text-white font-bold px-6 py-3 hover:bg-emerald-800 transition">See packages</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="rounded-2xl bg-white border border-stone-200 p-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-bold text-stone-900">#{o.id} — {o.package}</p>
                <p className="text-xs text-stone-500 mt-1">{new Date(o.created_at).toLocaleDateString()} · {o.pay_method}{o.txn_id ? ` · ${o.txn_id}` : ""}</p>
              </div>
              <div className="text-right">
                <p className="font-display font-bold text-lg text-stone-900">${o.amount}</p>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${o.status === "paid" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{o.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
