"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Item { id: number; title: string; description: string; imageUrl: string; link: string; createdAt: string; }

export default function PortfolioListPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch("/api/admin/portfolio");
    const data = await res.json();
    setItems(data.items || []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function remove(id: number) {
    if (!confirm("Delete this portfolio item?")) return;
    await fetch(`/api/admin/portfolio/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-stone-900">Portfolio</h1>
          <p className="text-stone-500 mt-1 text-sm">{items.length} items</p>
        </div>
        <Link href="/admin/portfolio/new" className="rounded-full bg-emerald-950 text-white text-sm font-bold px-5 py-2.5 hover:bg-emerald-900">
          + Add Item
        </Link>
      </div>
      {loading ? <p className="mt-8 text-stone-500">Loading…</p> : (
        <div className="mt-6 space-y-4">
          {items.map((p) => (
            <div key={p.id} className="rounded-2xl bg-white border border-stone-200 p-6 flex flex-wrap justify-between gap-4">
              <div className="min-w-0">
                <p className="font-bold text-stone-900">{p.title}</p>
                <p className="text-sm text-stone-500 mt-1 line-clamp-2 max-w-xl">{p.description}</p>
                {p.link && <a href={p.link} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-700 underline">{p.link}</a>}
              </div>
              <div className="flex gap-2 items-start">
                <Link href={`/admin/portfolio/${p.id}`} className="text-xs font-semibold rounded-full border border-stone-300 px-4 py-1.5 hover:border-emerald-600 hover:text-emerald-700">Edit</Link>
                <button onClick={() => remove(p.id)} className="text-xs font-semibold rounded-full border border-red-200 text-red-600 px-4 py-1.5 hover:bg-red-50">Delete</button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-stone-500">No portfolio items yet.</p>}
        </div>
      )}
    </div>
  );
}
