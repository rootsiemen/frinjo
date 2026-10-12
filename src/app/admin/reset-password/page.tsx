"use client";
import { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

function ResetForm() {
  const params = useSearchParams();
  const token = params.get("token") || "";
  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
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
      setDone(true);
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
        <h1 className="font-display text-2xl font-bold text-stone-900 mt-5">Set New Password</h1>
        <p className="text-sm text-stone-500 mt-1">
          {done ? "Done!" : token ? "Choose a new admin password (min. 8 characters)." : "This reset link is invalid or missing."}
        </p>

        {!token && !done && (
          <div className="mt-6">
            <p className="text-sm text-red-600">No reset token found in the link. Please request a new reset link.</p>
            <Link href="/admin/forgot-password" className="mt-5 block text-center w-full rounded-full bg-orange-600 text-white font-bold py-3 hover:bg-orange-700">
              Request New Link
            </Link>
          </div>
        )}

        {token && !done && (
          <form onSubmit={submit}>
            <label className="block mt-6 text-sm font-medium text-stone-700">New password
              <input type="password" required value={pw1} onChange={(e) => setPw1(e.target.value)} className={inputCls} />
            </label>
            <label className="block mt-3 text-sm font-medium text-stone-700">Confirm new password
              <input type="password" required value={pw2} onChange={(e) => setPw2(e.target.value)} className={inputCls} />
            </label>
            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
            <button disabled={busy} className="mt-5 w-full rounded-full bg-orange-600 text-white font-bold py-3 hover:bg-orange-700 disabled:opacity-40">
              {busy ? "Saving…" : "Set New Password"}
            </button>
          </form>
        )}

        {done && (
          <div className="mt-6">
            <p className="text-sm text-orange-700 font-medium">Password updated! All other sessions were signed out.</p>
            <Link href="/admin/login" className="mt-5 block text-center w-full rounded-full bg-orange-600 text-white font-bold py-3 hover:bg-orange-700">
              Back to Login
            </Link>
          </div>
        )}

        {!done && (
          <p className="mt-4 text-center text-sm">
            <Link href="/admin/login" className="text-orange-700 font-medium hover:underline">← Back to login</Link>
          </p>
        )}
      </div>
    </div>
  );
}

export default function AdminResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen grid place-items-center text-stone-500">Loading…</div>}>
      <ResetForm />
    </Suspense>
  );
}
