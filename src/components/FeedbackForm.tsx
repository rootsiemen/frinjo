"use client";
import { useState } from "react";

const input = "mt-1.5 w-full rounded-xl border border-stone-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white";

export default function FeedbackForm() {
  const [form, setForm] = useState({ name: "", text: "", rating: 5 });
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) { setError(data.error || "Something went wrong"); return; }
    setDone(true);
  }

  if (done) {
    return (
      <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-8 text-center">
        <p className="text-3xl mb-3">🙏</p>
        <h3 className="font-display text-xl font-bold text-stone-900">Thank you for your feedback!</h3>
        <p className="text-sm text-stone-600 mt-2">Your review has been received and will appear on the site after a quick review.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-2xl bg-white border border-stone-200 p-6 sm:p-8 shadow-sm">
      <h3 className="font-display text-xl font-bold text-stone-900">Worked with us? Leave a review ⭐</h3>
      <p className="text-sm text-stone-500 mt-1 mb-5">Your feedback helps other business owners trust our work.</p>
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block text-sm font-medium text-stone-700">Your name *
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={input} placeholder="e.g. Ahmed Khan" maxLength={200} />
        </label>
        <div className="text-sm font-medium text-stone-700">Your rating
          <div className="mt-2 flex gap-1">
            {[1, 2, 3, 4, 5].map((r) => (
              <button key={r} type="button" onClick={() => setForm({ ...form, rating: r })} aria-label={`${r} stars`} className="text-2xl">
                <span className={r <= form.rating ? "text-amber-400" : "text-stone-300"}>★</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <label className="block text-sm font-medium text-stone-700 mt-4">Your feedback *
        <textarea required rows={4} value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} className={input} placeholder="How was your experience working with us?" maxLength={5000} />
      </label>
      {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
      <button disabled={busy} className="mt-5 rounded-full bg-emerald-950 text-white font-bold px-7 py-3 text-sm hover:bg-emerald-900 disabled:opacity-40">
        {busy ? "Sending…" : "Submit Feedback"}
      </button>
    </form>
  );
}
