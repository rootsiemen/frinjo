"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [needsVerify, setNeedsVerify] = useState(false);
  const [resent, setResent] = useState(false);
  const [busy, setBusy] = useState(false);
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const input = "mt-1.5 w-full rounded-xl border border-stone-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setNeedsVerify(false); setResent(false); setBusy(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        if (data.needsVerification) setNeedsVerify(true);
        return;
      }
      router.push("/account");
    } catch { setError("Something went wrong. Please try again."); }
    finally { setBusy(false); }
  }

  async function resend() {
    try {
      await fetch("/api/auth/resend-verification", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });
    } catch { /* never reveal */ }
    setResent(true);
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="font-display text-3xl font-bold text-stone-900 text-center">Welcome back</h1>
      <p className="text-stone-500 text-sm text-center mt-2">Sign in to track your orders.</p>
      <form onSubmit={submit} className="mt-8 rounded-3xl bg-white border border-stone-200 shadow-sm p-7 space-y-5">
        <label className="block text-sm font-medium text-stone-700">Email *
          <input required type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@example.com" className={input} />
        </label>
        <label className="block text-sm font-medium text-stone-700">Password *
          <input required type="password" value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="Your password" className={input} />
        </label>
        <div className="text-right -mt-2">
          <Link href="/forgot-password" className="text-sm text-emerald-700 font-medium hover:underline">Forgot password?</Link>
        </div>
        {error && (
          <div className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">
            <p>{error}</p>
            {needsVerify && !resent && (
              <button type="button" onClick={resend} className="mt-2 font-semibold underline hover:no-underline">
                Resend verification email
              </button>
            )}
            {needsVerify && resent && (
              <p className="mt-2 text-emerald-700 font-medium">Verification email sent — check your inbox (and spam).</p>
            )}
          </div>
        )}
        <button disabled={busy} className="w-full rounded-xl bg-emerald-700 text-white font-bold py-3.5 hover:bg-emerald-800 transition disabled:opacity-60">
          {busy ? "Signing in..." : "Sign in"}
        </button>
        <div className="flex items-center gap-3 text-xs text-stone-400">
          <span className="flex-1 border-t border-stone-200" />
          <span>or</span>
          <span className="flex-1 border-t border-stone-200" />
        </div>
        <a href="/api/auth/google" className="flex w-full items-center justify-center gap-3 rounded-xl border border-stone-300 bg-white font-bold py-3.5 hover:bg-stone-50 transition text-stone-700">
          <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.5 12.3c0-.9-.1-1.5-.3-2.3H12v4.5h6.5c-.1 1.1-.8 2.7-2.4 3.8l-.1.1 3.5 2.7.2.1c2.2-2 3.8-5 3.8-8.9z"/><path fill="#34A853" d="M12 24c3.2 0 6-1.1 7.9-2.9l-3.8-2.9c-1 .7-2.4 1.2-4.1 1.2-3.1 0-5.8-2.1-6.8-5l-.1.1-3.7 2.9v.1C3.3 21.3 7.3 24 12 24z"/><path fill="#FBBC05" d="M5.2 14.4c-.2-.7-.4-1.5-.4-2.4s.1-1.7.4-2.4l-.1-.1-3.7-2.9-.1.1C.5 8.2 0 10 0 12s.5 3.8 1.3 5.4l3.9-3z"/><path fill="#EA4335" d="M12 4.7c1.8 0 3 .8 3.7 1.4l3.3-3.2C17.9 1.1 15.2 0 12 0 7.3 0 3.3 2.7 1.3 6.6l3.9 3c1-2.9 3.7-4.9 6.8-4.9z"/></svg>
          Continue with Google
        </a>
        <p className="text-sm text-stone-500 text-center">New here? <Link href="/signup" className="text-emerald-700 font-semibold underline">Create an account</Link></p>
      </form>
    </div>
  );
}
