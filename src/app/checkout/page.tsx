"use client";
import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { PACKAGES, PAYMENTS, BRAND } from "@/lib/content";
import { Icon, btnPrimary } from "@/components/ui";

export const dynamic = "force-dynamic";

const pkgSlug = (name: string) => name.toLowerCase().split(" ")[0]; // starter/business/pro

const STEPS = ["Package", "Your Details", "Payment", "Confirm"];

const input =
  "w-full rounded-xl border border-stone-300 px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600";

function CheckoutForm() {
  const params = useSearchParams();
  const router = useRouter();
  const initialPkg = useMemo(() => {
    const q = (params.get("package") || "").toLowerCase();
    let found = PACKAGES.find((p) => pkgSlug(p.name) === q || p.name.toLowerCase() === q);
    if (!found) {
      try {
        const cart = localStorage.getItem("webstore_cart");
        if (cart) found = PACKAGES.find((p) => pkgSlug(p.name) === cart);
      } catch {}
    }
    return found || PACKAGES[1];
  }, [params]);

  const [step, setStep] = useState(1);
  const [pkg, setPkg] = useState(initialPkg);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [customerLoaded, setCustomerLoaded] = useState(false);

  // Pre-fill details if customer is signed in
  useEffect(() => {
    fetch("/api/auth/session").then(async (r) => {
      if (r.ok) {
        const { customer } = await r.json();
        setName((v) => v || customer.name);
        setEmail((v) => v || customer.email);
        setWhatsapp((v) => v || customer.whatsapp);
      }
      setCustomerLoaded(true);
    }).catch(() => setCustomerLoaded(true));
  }, []);
  const [whatsapp, setWhatsapp] = useState("");
  const [payMethod, setPayMethod] = useState(PAYMENTS[0].id);
  const [txnId, setTxnId] = useState("");
  const [note, setNote] = useState("");
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const pay = PAYMENTS.find((p) => p.id === payMethod)!;

  function copyAccount() {
    navigator.clipboard.writeText(pay.account).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function next() {
    setError("");
    if (step === 2 && (!name.trim() || !email.trim() || !whatsapp.trim())) {
      setError("Please fill in your name, email and WhatsApp number.");
      return;
    }
    if (step === 2 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    setStep((s) => Math.min(4, s + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function placeOrder() {
    setError("");
    if (!txnId.trim()) {
      setError("Please enter your Transaction ID / Hash after sending the payment.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, email, whatsapp,
          package: pkgSlug(pkg.name),
          payMethod, txnId, note,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order failed");
      try { localStorage.removeItem("webstore_cart"); } catch {}
      router.push(`/checkout/success?id=${data.id}`);
    } catch (e: any) {
      setError(e.message || "Could not place your order. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4">
      {/* Stepper */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 mb-10">
        {STEPS.map((label, i) => {
          const n = i + 1;
          const active = step === n;
          const done = step > n;
          return (
            <div key={label} className="flex items-center gap-2 sm:gap-3">
              <div className="flex flex-col items-center">
                <span
                  className={`w-9 h-9 rounded-full grid place-items-center font-bold text-sm transition ${
                    done ? "bg-emerald-600 text-white" : active ? "bg-amber-400 text-emerald-950" : "bg-stone-200 text-stone-500"
                  }`}
                >
                  {done ? <Icon name="check" className="w-4 h-4" /> : n}
                </span>
                <span className={`mt-1.5 text-[11px] sm:text-xs font-semibold ${active ? "text-emerald-900" : "text-stone-400"}`}>
                  {label}
                </span>
              </div>
              {n < STEPS.length && <div className={`w-6 sm:w-12 h-0.5 mb-6 ${done ? "bg-emerald-600" : "bg-stone-200"}`} />}
            </div>
          );
        })}
      </div>

      {error && (
        <div className="mb-6 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium px-4 py-3">
          {error}
        </div>
      )}

      {/* STEP 1 — package */}
      {step === 1 && (
        <div>
          <h2 className="font-display text-2xl font-bold text-stone-900 mb-6 text-center">Choose your package</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {PACKAGES.map((p) => {
              const selected = p.name === pkg.name;
              return (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => setPkg(p)}
                  className={`rounded-2xl border-2 p-6 text-left transition ${
                    selected ? "border-emerald-700 bg-emerald-50 shadow-lg" : "border-stone-200 bg-white hover:border-emerald-300"
                  }`}
                >
                  <p className="font-display font-bold text-stone-900">{p.name}</p>
                  <p className="font-display text-3xl font-bold text-emerald-800 mt-2">${p.price}</p>
                  <p className="text-xs text-stone-500 mt-1">{p.pages} · {p.delivery}</p>
                  {p.popular && (
                    <span className="inline-block mt-3 rounded-full bg-amber-400 text-emerald-950 text-[11px] font-bold px-3 py-1">
                      ★ MOST POPULAR
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 2 — details */}
      {step === 2 && (
        <div>
          <h2 className="font-display text-2xl font-bold text-stone-900 mb-6 text-center">Your details</h2>
          <div className="rounded-3xl bg-white border border-stone-200 p-6 sm:p-8 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">Full name *</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className={input} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">Email *</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" type="email" className={input} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">WhatsApp number *</label>
              <input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="+92 300 1234567" className={input} />
              <p className="text-xs text-stone-500 mt-1.5">I'll contact you here about your project.</p>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3 — payment */}
      {step === 3 && (
        <div>
          <h2 className="font-display text-2xl font-bold text-stone-900 mb-2 text-center">Pay ${pkg.price}</h2>
          <p className="text-center text-stone-500 text-sm mb-6">Choose a payment method and send the amount, then continue.</p>
          <div className="grid gap-3 grid-cols-2 lg:grid-cols-3 mb-6">
            {PAYMENTS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPayMethod(p.id)}
                className={`rounded-2xl border-2 p-5 text-left transition ${
                  payMethod === p.id ? "border-emerald-700 bg-emerald-50 shadow" : "border-stone-200 bg-white hover:border-emerald-300"
                }`}
              >
                <p className="font-bold text-stone-900">{p.name}</p>
                <p className="text-xs text-stone-500 mt-1">{p.title}</p>
              </button>
            ))}
          </div>
          <div className="rounded-3xl bg-emerald-50 border border-emerald-200 p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-700 mb-4">Send {pay.name} payment to</p>
            <div className="flex items-center justify-between gap-4 rounded-2xl bg-white border border-stone-200 px-5 py-4">
              <div className="min-w-0">
                <p className="font-mono font-bold text-lg break-all text-stone-900">{pay.account}</p>
                <p className="text-sm text-stone-600 mt-1">{pay.title}</p>
              </div>
              <button
                type="button"
                onClick={copyAccount}
                className="shrink-0 rounded-full bg-amber-400 text-emerald-950 text-sm font-bold px-5 py-2.5 hover:bg-amber-300 transition"
              >
                {copied ? "Copied ✓" : "Copy"}
              </button>
            </div>
            <p className="text-sm text-stone-600 mt-4 leading-relaxed">{pay.note}</p>
            <p className="mt-4 rounded-xl bg-white border border-stone-200 px-4 py-3 text-sm">
              <span className="font-bold text-amber-700">Amount: ${pkg.price}</span>
              <span className="text-stone-600"> — {pkg.name}</span>
            </p>
          </div>
        </div>
      )}

      {/* STEP 4 — confirm */}
      {step === 4 && (
        <div>
          <h2 className="font-display text-2xl font-bold text-stone-900 mb-6 text-center">Confirm your order</h2>
          <div className="rounded-3xl bg-white border border-stone-200 p-6 sm:p-8 space-y-5">
            <div className="flex justify-between items-center rounded-2xl bg-stone-50 px-5 py-4">
              <div>
                <p className="font-bold text-stone-900">{pkg.name}</p>
                <p className="text-xs text-stone-500">{pkg.pages} · {pkg.delivery}</p>
              </div>
              <p className="font-display text-2xl font-bold text-emerald-800">${pkg.price}</p>
            </div>
            <div className="text-sm text-stone-600 space-y-1.5">
              <p><span className="font-semibold text-stone-900">Name:</span> {name}</p>
              <p><span className="font-semibold text-stone-900">Email:</span> {email}</p>
              <p><span className="font-semibold text-stone-900">WhatsApp:</span> {whatsapp}</p>
              <p><span className="font-semibold text-stone-900">Payment:</span> {pay.name}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">
                {pay.txnLabel} *
              </label>
              <input
                value={txnId}
                onChange={(e) => setTxnId(e.target.value)}
                placeholder={pay.txnLabel === "Transaction Hash" ? "Paste transaction hash" : "e.g. 12345678901"}
                className={`${input} font-mono`}
              />
              <p className="text-xs text-stone-500 mt-1.5">The reference number from your {pay.name} payment.</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">Note (optional)</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Anything I should know about your project?"
                rows={3}
                className={input}
              />
            </div>
          </div>
        </div>
      )}

      {/* Nav buttons */}
      <div className="mt-8 flex justify-between">
        {step > 1 ? (
          <button
            type="button"
            onClick={() => { setStep((s) => s - 1); setError(""); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className="rounded-full border-2 border-stone-300 text-stone-700 font-semibold px-7 py-3 hover:border-emerald-700 hover:text-emerald-800 transition"
          >
            ← Back
          </button>
        ) : <span />}
        {step < 4 ? (
          <button type="button" onClick={next} className={btnPrimary}>
            Continue <Icon name="arrow" className="w-5 h-5" />
          </button>
        ) : (
          <button type="button" onClick={placeOrder} disabled={submitting} className={`${btnPrimary} disabled:opacity-60`}>
            {submitting ? "Placing order…" : `Place Order — $${pkg.price}`} <Icon name="check" className="w-5 h-5" />
          </button>
        )}
      </div>

      <p className="text-center text-xs text-stone-400 mt-8">
        Having trouble? <a href={`https://wa.me/${BRAND.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-emerald-700 font-semibold hover:underline">Message me on WhatsApp</a>
      </p>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <section className="bg-stone-50 py-14 sm:py-20 min-h-[70vh]">
      <Suspense fallback={<p className="text-center text-stone-500">Loading checkout…</p>}>
        <CheckoutForm />
      </Suspense>
    </section>
  );
}
