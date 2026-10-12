"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function AdminForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [fallbackLink, setFallbackLink] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  async function requestLink(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    setFallbackLink("");
    try {
      const res = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setMessage(data.message || "Done.");
      if (data.link) setFallbackLink(data.link);
      setSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setBusy(false);
    }
  }

  const inputCls =
    "mt-1.5 w-full rounded-xl border border-stone-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500";

  return (
    <div className="min-h-screen grid place-items-center bg-stone-100 px-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl">
        <Link href="/" className="flex items-center whitespace-nowrap" aria-label="WebStore Pro home">
          <span className="flex items-center text-[24px] leading-none">
            <Image src="/logo-w.png" alt="" width={48} height={48} className="h-[1em] w-[1em] shrink-0" />
            <span className="font-display font-bold text-stone-700 tracking-[0.06em]">ebstore pro</span>
          </span>
        </Link>
        <h1 className="font-display text-2xl font-bold text-stone-900 mt-5">Reset Admin Password</h1>
        <p className="text-sm text-stone-500 mt-1">
          {sent
            ? "Check your email for the reset link."
            : "Enter your admin email — we'll send you a reset link."}
        </p>

        {!sent && (
          <form onSubmit={requestLink}>
            <label className="block mt-6 text-sm font-medium text-stone-700">Admin email
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={inputCls}
              />
            </label>
            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
            <button
              disabled={busy}
              className="mt-5 w-full rounded-full bg-orange-600 text-white font-bold py-3 hover:bg-orange-700 disabled:opacity-40"
            >
              {busy ? "Sending…" : "Send Reset Link"}
            </button>
          </form>
        )}

        {sent && (
          <div className="mt-6">
            <p className="text-sm text-orange-700 font-medium">{message}</p>
            {fallbackLink && (
              <p className="mt-3 text-sm text-stone-600 break-all">
                Email is not configured — use this link instead:
                <br />
                <Link href={fallbackLink} className="text-orange-700 underline">{fallbackLink}</Link>
              </p>
            )}
            <button
              onClick={() => { setSent(false); setEmail(""); setMessage(""); setFallbackLink(""); }}
              className="mt-5 w-full rounded-full border border-stone-300 text-stone-700 font-bold py-3 hover:bg-stone-50"
            >
              Try Another Email
            </button>
          </div>
        )}

        <p className="mt-4 text-center text-sm">
          <Link href="/admin/login" className="text-orange-700 font-medium hover:underline">← Back to login</Link>
        </p>
      </div>
    </div>
  );
}
