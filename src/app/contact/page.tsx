"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BRAND, PACKAGES } from "@/lib/content";
import { Icon } from "@/components/ui";

function ContactForm() {
  const router = useRouter();
  const params = useSearchParams();
  const preselected = params.get("package") || "";
  const [form, setForm] = useState({
    name: "", email: "", whatsapp: "",
    package: PACKAGES.some((p) => p.name === preselected) ? preselected : "",
    message: "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function set(k: string, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      router.push("/thank-you");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setBusy(false);
    }
  }

  const input =
    "mt-1.5 w-full rounded-xl border border-stone-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600";

  return (
    <form onSubmit={submit} className="rounded-3xl bg-white border border-stone-200 shadow-sm p-7 sm:p-9">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-medium text-stone-700">Your name *
          <input required value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Ahmed Khan" className={input} />
        </label>
        <label className="text-sm font-medium text-stone-700">Email *
          <input required type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@example.com" className={input} />
        </label>
        <label className="text-sm font-medium text-stone-700">WhatsApp number *
          <input required value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} placeholder="+92 300 1234567" className={input} />
        </label>
        <label className="text-sm font-medium text-stone-700">Package you're interested in
          <select value={form.package} onChange={(e) => set("package", e.target.value)} className={input}>
            <option value="">Not sure yet</option>
            {PACKAGES.map((p) => (
              <option key={p.name} value={p.name}>{p.name}</option>
            ))}
            <option value="Custom">Something custom</option>
          </select>
        </label>
      </div>
      <label className="block mt-5 text-sm font-medium text-stone-700">Tell me about your project *
        <textarea required rows={5} value={form.message} onChange={(e) => set("message", e.target.value)}
          placeholder="What do you sell? How many products? Anything specific you need?"
          className={input} />
      </label>
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      <button disabled={busy} className="mt-6 w-full rounded-full bg-emerald-950 text-white font-bold py-4 hover:bg-emerald-900 disabled:opacity-40 transition inline-flex justify-center items-center gap-2">
        {busy ? "Sending…" : (<>Send Inquiry <Icon name="arrow" className="w-5 h-5" /></>)}
      </button>
      <p className="mt-4 text-xs text-center text-stone-500">I usually reply within a few hours. No spam, ever.</p>
    </form>
  );
}

export default function ContactPage() {
  const waHref = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent("Hi! I want a website for my business.")}`;
  return (
    <>
      <section className="bg-emerald-50 dot-grid py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-700 mb-3">Contact</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-stone-900">Let's build your website</h1>
          <p className="mt-4 text-stone-600 max-w-2xl">Fill in the form — or just message me directly on WhatsApp. Either way, I reply fast.</p>
        </div>
      </section>
      <section className="py-14 bg-stone-50">
        <div className="max-w-6xl mx-auto px-4 grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <Suspense fallback={<div className="rounded-3xl bg-white border border-stone-200 p-10 text-center text-stone-500">Loading form…</div>}>
              <ContactForm />
            </Suspense>
          </div>
          <aside className="lg:col-span-2 space-y-5">
            <div className="rounded-3xl bg-emerald-50 border border-emerald-200 p-8">
              <h2 className="font-display text-xl font-bold mb-4 text-stone-900">Prefer to chat?</h2>
              <p className="text-stone-600 text-sm mb-6">Message me on WhatsApp with your business name and what you want to sell — I'll take it from there.</p>
              <a href={waHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#25D366] text-white font-bold px-6 py-3 hover:brightness-110 transition">
                WhatsApp Me
              </a>
              <p className="mt-6 text-sm text-stone-500">📧 {BRAND.email}</p>
            </div>
            <div className="rounded-3xl bg-white border border-stone-200 p-8">
              <h2 className="font-bold text-stone-900 mb-4">What happens next?</h2>
              <ol className="space-y-3 text-sm text-stone-600">
                <li className="flex gap-3"><span className="font-bold text-emerald-700">1.</span> I read your inquiry and reply with questions or a quote.</li>
                <li className="flex gap-3"><span className="font-bold text-emerald-700">2.</span> We agree on the package, timeline and design direction.</li>
                <li className="flex gap-3"><span className="font-bold text-emerald-700">3.</span> I build your website and launch it with you.</li>
              </ol>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
