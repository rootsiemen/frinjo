"use client";
import { useState } from "react";
import Link from "next/link";

export default function AdminForgotPasswordPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [resetKey, setResetKey] = useState("");
  const [emails, setEmails] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function verifyKey(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetKey }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      if (!data.emails || data.emails.length === 0) {
        throw new Error("No admin account exists on this site yet.");
      }
      setEmails(data.emails);
      setEmail(data.emails[0]);
      setStep(2);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setBusy(false);
    }
  }

  async function requestToken(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetKey, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setToken(data.token);
      setStep(3);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setBusy(false);
    }
  }

  async function setNewPassword(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (pw1.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (pw1 !== pw2) {
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: pw1 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setStep(4);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setBusy(false);
    }
  }

  const inputCls =
    "mt-1.5 w-full rounded-xl border border-stone-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600";

  return (
    <div className="min-h-screen grid place-items-center bg-emerald-50 dot-grid px-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-300 to-amber-600 grid place-items-center font-display font-bold text-emerald-950 text-xl mb-5">W</div>
        <h1 className="font-display text-2xl font-bold text-stone-900">Reset Admin Password</h1>
        <p className="text-sm text-stone-500 mt-1">
          {step === 1 && "Enter the reset key from your server settings."}
          {step === 2 && "Pick the admin account to reset."}
          {step === 3 && "Choose a new password (min. 8 characters)."}
          {step === 4 && "Done!"}
        </p>

        {step === 1 && (
          <form onSubmit={verifyKey}>
            <label className="block mt-6 text-sm font-medium text-stone-700">Reset key
              <input type="password" required value={resetKey} onChange={(e) => setResetKey(e.target.value)}
                placeholder="ADMIN_RESET_KEY from server"
                className={inputCls} />
            </label>
            <p className="mt-2 text-xs text-stone-500">Found in your hosting .env file (set it there first if missing).</p>
            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
            <button disabled={busy} className="mt-5 w-full rounded-full bg-emerald-950 text-white font-bold py-3 hover:bg-emerald-900 disabled:opacity-40">
              {busy ? "Checking…" : "Continue"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={requestToken}>
            <label className="block mt-6 text-sm font-medium text-stone-700">Admin account
              <select value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls}>
                {emails.map((em) => (
                  <option key={em} value={em}>{em}</option>
                ))}
              </select>
            </label>
            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
            <button disabled={busy} className="mt-5 w-full rounded-full bg-emerald-950 text-white font-bold py-3 hover:bg-emerald-900 disabled:opacity-40">
              {busy ? "Checking…" : "Continue"}
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={setNewPassword}>
            <label className="block mt-6 text-sm font-medium text-stone-700">New password
              <input type="password" required value={pw1} onChange={(e) => setPw1(e.target.value)} className={inputCls} />
            </label>
            <label className="block mt-3 text-sm font-medium text-stone-700">Confirm new password
              <input type="password" required value={pw2} onChange={(e) => setPw2(e.target.value)} className={inputCls} />
            </label>
            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
            <button disabled={busy} className="mt-5 w-full rounded-full bg-emerald-950 text-white font-bold py-3 hover:bg-emerald-900 disabled:opacity-40">
              {busy ? "Saving…" : "Set New Password"}
            </button>
          </form>
        )}

        {step === 4 && (
          <div className="mt-6">
            <p className="text-sm text-emerald-700 font-medium">Password updated! All other sessions were signed out.</p>
            <Link href="/admin/login" className="mt-5 block text-center w-full rounded-full bg-emerald-950 text-white font-bold py-3 hover:bg-emerald-900">
              Back to Login
            </Link>
          </div>
        )}

        {step !== 4 && (
          <p className="mt-4 text-center text-sm">
            <Link href="/admin/login" className="text-emerald-700 font-medium hover:underline">← Back to login</Link>
          </p>
        )}
      </div>
    </div>
  );
}
