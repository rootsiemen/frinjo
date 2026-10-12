"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const input = "mt-1.5 w-full rounded-xl border border-stone-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600";

export default function NewTestimonialPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", text: "", rating: 5 });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/admin/testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error || "Failed"); setBusy(false); return; }
    router.push("/admin/testimonials");
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl font-bold text-stone-900">Add Testimonial</h1>
      <form onSubmit={submit} className="mt-6 rounded-2xl bg-white border border-stone-200 p-6 space-y-4">
        <label className="block text-sm font-medium text-stone-700">Client name *
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={input} placeholder="e.g. Ahmed Khan, Boutique Owner" />
        </label>
        <label className="block text-sm font-medium text-stone-700">Testimonial *
          <textarea required rows={4} value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} className={input} placeholder="What did the client say?" />
        </label>
        <label className="block text-sm font-medium text-stone-700">Rating
          <select value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className={input}>
            {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} stars</option>)}
          </select>
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-3">
          <button disabled={busy} className="rounded-full bg-emerald-950 text-white font-bold px-6 py-2.5 text-sm hover:bg-emerald-900 disabled:opacity-40">
            {busy ? "Saving…" : "Save Testimonial"}
          </button>
          <Link href="/admin/testimonials" className="rounded-full border border-stone-300 px-6 py-2.5 text-sm font-semibold">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
