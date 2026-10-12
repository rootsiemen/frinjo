"use client";
import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch { /* never reveal */ }
    setBusy(false);
    setSent(true);
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="font-display text-3xl font-bold text-stone-900 text-center">Forgot password?</h1>
      <p className="text-stone-500 text-sm text-center mt-2">No worries — we'll email you a reset link.</p>
      <div className="mt-8 rounded-3xl bg-white border border-stone-200 shadow-sm p-7">
        {sent ? (
          <div className="text-center">
            <div className="text-5xl">📧</div>
            <p className="mt-4 text-stone-700 font-medium">If an account exists for <b>{email}</b>, a reset link is on its way.</p>
            <p className="mt-2 text-sm text-stone-500">Check your inbox (and spam folder). The link expires in 1 hour.</p>
            <Link href="/login" className="inline-block mt-6 rounded-xl bg-emerald-700 text-white font-bold px-8 py-3 hover:bg-emerald-800">Back to Sign in</Link>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-5">
            <label className="block text-sm font-medium text-stone-700">Email *
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
                className="mt-1.5 w-full rounded-xl border border-stone-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600" />
            </label>
            <button disabled={busy} className="w-full rounded-xl bg-emerald-700 text-white font-bold py-3.5 hover:bg-emerald-800 transition disabled:opacity-60">
              {busy ? "Sending…" : "Send reset link"}
            </button>
            <p className="text-center text-sm"><Link href="/login" className="text-emerald-700 font-medium hover:underline">← Back to sign in</Link></p>
          </form>
        )}
      </div>
    </div>
  );
}
