"use client";
import { useEffect, useState } from "react";

interface Inquiry {
  id: number; name: string; email: string; whatsapp: string;
  package: string; message: string; status: string; createdAt: string;
}

const STATUS_STYLE: Record<string, string> = {
  new: "bg-amber-100 text-amber-800",
  contacted: "bg-blue-100 text-blue-800",
  done: "bg-emerald-100 text-emerald-800",
};

export default function InquiriesPage() {
  const [items, setItems] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch("/api/admin/inquiries");
    const data = await res.json();
    setItems(data.inquiries || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function setStatus(id: number, status: string) {
    await fetch(`/api/admin/inquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  async function remove(id: number) {
    if (!confirm("Delete this inquiry?")) return;
    await fetch(`/api/admin/inquiries/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-stone-900">Inquiries</h1>
      <p className="text-stone-500 mt-1 text-sm">{items.length} total</p>
      {loading ? (
        <p className="mt-8 text-stone-500">Loading…</p>
      ) : items.length === 0 ? (
        <p className="mt-8 text-stone-500">No inquiries yet.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {items.map((q) => (
            <div key={q.id} className="rounded-2xl bg-white border border-stone-200 p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-stone-900">{q.name}</p>
                  <p className="text-sm text-stone-500">{q.email} · {q.whatsapp}</p>
                </div>
                <span className={`text-xs font-bold uppercase tracking-wide rounded-full px-3 py-1.5 ${STATUS_STYLE[q.status] || STATUS_STYLE.new}`}>
                  {q.status}
                </span>
              </div>
              {q.package && <p className="mt-2 text-sm"><span className="font-semibold text-emerald-800">Interested in:</span> {q.package}</p>}
              <p className="mt-3 text-sm text-stone-600 whitespace-pre-wrap bg-stone-50 rounded-xl p-4">{q.message}</p>
              <p className="mt-2 text-xs text-stone-400">{new Date(q.createdAt).toLocaleString()}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["new", "contacted", "done"].filter((s) => s !== q.status).map((s) => (
                  <button key={s} onClick={() => setStatus(q.id, s)}
                    className="text-xs font-semibold rounded-full border border-stone-300 px-4 py-1.5 hover:border-emerald-600 hover:text-emerald-700">
                    Mark {s}
                  </button>
                ))}
                <a href={`https://wa.me/${q.whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer"
                  className="text-xs font-semibold rounded-full bg-[#25D366] text-white px-4 py-1.5 hover:brightness-110">
                  WhatsApp
                </a>
                <button onClick={() => remove(q.id)} className="text-xs font-semibold rounded-full border border-red-200 text-red-600 px-4 py-1.5 hover:bg-red-50">
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
