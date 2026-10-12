"use client";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function ResetContent() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") || "";
  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (pw1.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (pw1 !== pw2) { setError("Passwords do not match."); return; }
    setBusy(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: pw1 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setDone(true);
      setTimeout(() => router.push("/login"), 2500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setBusy(false);
    }
  }

  const input = "mt-1.5 w-full rounded-xl border border-stone-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600";

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="font-display text-3xl font-bold text-stone-900 text-center">Set a new password</h1>
      <div className="mt-8 rounded-3xl bg-white border border-stone-200 shadow-sm p-7">
        {!token ? (
          <div className="text-center">
            <p className="text-stone-600">This link is missing its token.</p>
            <Link href="/forgot-password" className="inline-block mt-4 rounded-xl bg-emerald-700 text-white font-bold px-8 py-3 hover:bg-emerald-800">Request a new link</Link>
          </div>
        ) : done ? (
          <div className="text-center">
            <div className="text-5xl">✅</div>
            <p className="mt-4 text-stone-700 font-medium">Password updated! Taking you to sign in…</p>
            <Link href="/login" className="inline-block mt-4 rounded-xl bg-emerald-700 text-white font-bold px-8 py-3 hover:bg-emerald-800">Sign in now</Link>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-5">
            <label className="block text-sm font-medium text-stone-700">New password *
              <input required type="password" value={pw1} onChange={(e) => setPw1(e.target.value)} placeholder="Min. 6 characters" className={input} />
            </label>
            <label className="block text-sm font-medium text-stone-700">Confirm new password *
              <input required type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} placeholder="Repeat password" className={input} />
            </label>
            {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{error}</p>}
            <button disabled={busy} className="w-full rounded-xl bg-emerald-700 text-white font-bold py-3.5 hover:bg-emerald-800 transition disabled:opacity-60">
              {busy ? "Saving…" : "Set new password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto px-4 py-16 text-center text-stone-500">Loading…</div>}>
      <ResetContent />
    </Suspense>
  );
}
