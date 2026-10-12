"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CompleteProfilePage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", whatsapp: "", business: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const input = "mt-1.5 w-full rounded-xl border border-stone-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600";

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/auth/session");
        if (!r.ok) { router.push("/login"); return; }
        const { customer } = await r.json();
        setForm({ name: customer.name || "", whatsapp: customer.whatsapp || "", business: "" });
      } catch { router.push("/login"); }
      finally { setLoading(false); }
    })();
  }, [router]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setBusy(true);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to save"); return; }
      router.push("/account");
    } catch { setError("Something went wrong. Please try again."); }
    finally { setBusy(false); }
  }

  if (loading) return <div className="max-w-md mx-auto px-4 py-16 text-center text-stone-500">Loading...</div>;

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="font-display text-3xl font-bold text-stone-900 text-center">Almost done! 🎉</h1>
      <p className="text-stone-500 text-sm text-center mt-2">Complete your profile to get started.</p>
      <form onSubmit={submit} className="mt-8 rounded-3xl bg-white border border-stone-200 shadow-sm p-7 space-y-5">
        <label className="block text-sm font-medium text-stone-700">Full name *
          <input required value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Ahmed Khan" className={input} />
        </label>
        <label className="block text-sm font-medium text-stone-700">WhatsApp number *
          <input required value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} placeholder="+92 300 1234567" className={input} />
        </label>
        <label className="block text-sm font-medium text-stone-700">Business / Website type
          <input value={form.business} onChange={(e) => set("business", e.target.value)} placeholder="e.g. Clothing store, Restaurant (optional)" className={input} />
        </label>
        {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{error}</p>}
        <button disabled={busy} className="w-full rounded-xl bg-emerald-700 text-white font-bold py-3.5 hover:bg-emerald-800 transition disabled:opacity-60">
          {busy ? "Saving..." : "Complete profile →"}
        </button>
      </form>
    </div>
  );
}
