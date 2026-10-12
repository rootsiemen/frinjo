"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

const input = "mt-1.5 w-full rounded-xl border border-stone-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600";

export default function EditPortfolioPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState({ title: "", description: "", image_url: "", link: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/portfolio").then((r) => r.json()).then((d) => {
      const found = (d.items || []).find((p: { id: number }) => String(p.id) === String(id));
      if (found) setForm({ title: found.title, description: found.description, image_url: found.imageUrl, link: found.link });
    });
  }, [id]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch(`/api/admin/portfolio/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error || "Failed"); setBusy(false); return; }
    router.push("/admin/portfolio");
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl font-bold text-stone-900">Edit Portfolio Item</h1>
      <form onSubmit={submit} className="mt-6 rounded-2xl bg-white border border-stone-200 p-6 space-y-4">
        <label className="block text-sm font-medium text-stone-700">Title *
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={input} />
        </label>
        <label className="block text-sm font-medium text-stone-700">Description
          <textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={input} />
        </label>
        <label className="block text-sm font-medium text-stone-700">Image URL
          <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className={input} />
        </label>
        <label className="block text-sm font-medium text-stone-700">Live link
          <input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} className={input} />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-3">
          <button disabled={busy} className="rounded-full bg-emerald-950 text-white font-bold px-6 py-2.5 text-sm hover:bg-emerald-900 disabled:opacity-40">
            {busy ? "Saving…" : "Save Changes"}
          </button>
          <Link href="/admin/portfolio" className="rounded-full border border-stone-300 px-6 py-2.5 text-sm font-semibold">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
