"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Item { id: number; name: string; text: string; rating: number; status: string; createdAt: string; }

export default function TestimonialsListPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch("/api/admin/testimonials");
    const data = await res.json();
    setItems(data.items || []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function remove(id: number) {
    if (!confirm("Delete this testimonial?")) return;
    await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
    load();
  }

  async function setStatus(id: number, status: string) {
    await fetch(`/api/admin/testimonials/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  const pending = items.filter((t) => t.status === "pending");
  const approved = items.filter((t) => t.status !== "pending");

  function row(t: Item) {
    return (
      <div key={t.id} className="rounded-2xl bg-white border border-stone-200 p-6 flex flex-wrap justify-between gap-4">
        <div className="min-w-0">
          <p className="font-bold text-stone-900">
            {t.name} <span className="text-amber-500">{"★".repeat(t.rating)}</span>{" "}
            {t.status === "pending" && (
              <span className="text-xs font-semibold rounded-full px-2.5 py-0.5 bg-amber-100 text-amber-700">new feedback</span>
            )}
          </p>
          <p className="text-sm text-stone-500 mt-1 line-clamp-2 max-w-xl">“{t.text}”</p>
        </div>
        <div className="flex gap-2 items-start flex-wrap">
          {t.status === "pending" && (
            <button onClick={() => setStatus(t.id, "approved")} className="text-xs font-semibold rounded-full bg-emerald-950 text-white px-4 py-1.5 hover:bg-emerald-800">Approve</button>
          )}
          {t.status === "approved" && (
            <button onClick={() => setStatus(t.id, "pending")} className="text-xs font-semibold rounded-full border border-stone-300 px-4 py-1.5 hover:border-amber-500 hover:text-amber-600">Hide</button>
          )}
          <Link href={`/admin/testimonials/${t.id}`} className="text-xs font-semibold rounded-full border border-stone-300 px-4 py-1.5 hover:border-emerald-600 hover:text-emerald-700">Edit</Link>
          <button onClick={() => remove(t.id)} className="text-xs font-semibold rounded-full border border-red-200 text-red-600 px-4 py-1.5 hover:bg-red-50">Delete</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-stone-900">Testimonials</h1>
          <p className="text-stone-500 mt-1 text-sm">{approved.length} approved · {pending.length} pending feedback</p>
        </div>
        <Link href="/admin/testimonials/new" className="rounded-full bg-emerald-950 text-white text-sm font-bold px-5 py-2.5 hover:bg-emerald-900">
          + Add Testimonial
        </Link>
      </div>
      {loading ? <p className="mt-8 text-stone-500">Loading…</p> : (
        <>
          {pending.length > 0 && (
            <div className="mt-6">
              <h2 className="font-bold text-stone-900 mb-3">⏳ New customer feedback — approve to show on site</h2>
              <div className="space-y-4">{pending.map(row)}</div>
            </div>
          )}
          <div className="mt-6">
            {pending.length > 0 && <h2 className="font-bold text-stone-900 mb-3">✅ Live on site</h2>}
            <div className="space-y-4">{approved.map(row)}</div>
            {items.length === 0 && <p className="text-stone-500">No testimonials yet.</p>}
          </div>
        </>
      )}
    </div>
  );
}
