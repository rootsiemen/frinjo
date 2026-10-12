"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Stats { inquiries: number; newInquiries: number; portfolio: number; testimonials: number; orders: number; pendingOrders: number; paidRevenue: number; }

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats").then((r) => r.json()).then(setStats).catch(() => {});
  }, []);

  const cards = stats ? [
    ["Total Orders", stats.orders, "/admin/orders", `${stats.pendingOrders} pending`],
    ["Revenue (Paid)", `$${stats.paidRevenue}`, "/admin/orders", "from paid orders"],
    ["Total Inquiries", stats.inquiries, "/admin/inquiries", `${stats.newInquiries} new`],
    ["Portfolio Items", stats.portfolio, "/admin/portfolio", "manage"],
    ["Testimonials", stats.testimonials, "/admin/testimonials", "manage"],
  ] as const : [];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-stone-900">Dashboard</h1>
      <p className="text-stone-500 mt-1 text-sm">Welcome back — here's what's happening.</p>
      {!stats ? (
        <p className="mt-8 text-stone-500">Loading…</p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {cards.map(([label, value, href, note]) => (
            <Link key={label} href={href} className="rounded-2xl bg-white border border-stone-200 p-6 hover:shadow-md transition">
              <p className="text-sm text-stone-500">{label}</p>
              <p className="font-display text-4xl font-bold text-emerald-950 mt-2">{value}</p>
              <p className="text-xs text-amber-600 font-semibold mt-2 uppercase tracking-wide">{note}</p>
            </Link>
          ))}
        </div>
      )}
      <div className="mt-8 rounded-2xl bg-emerald-50 border border-emerald-200 p-6">
        <h2 className="font-bold mb-2 text-stone-900">Quick actions</h2>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link href="/admin/orders" className="rounded-full bg-amber-400 text-emerald-950 font-bold px-4 py-2 hover:bg-amber-300">Review pending orders →</Link>
          <Link href="/admin/inquiries" className="rounded-full bg-white border border-stone-200 text-stone-700 px-4 py-2 hover:bg-stone-50">Review new inquiries →</Link>
          <Link href="/admin/portfolio/new" className="rounded-full bg-white border border-stone-200 text-stone-700 px-4 py-2 hover:bg-stone-50">Add portfolio item →</Link>
          <Link href="/" className="rounded-full bg-white border border-stone-200 text-stone-700 px-4 py-2 hover:bg-stone-50">View live site →</Link>
        </div>
      </div>
    </div>
  );
}
