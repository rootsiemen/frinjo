"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const GOOGLE_G_ICON = (
  <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.5 12.3c0-.9-.1-1.5-.3-2.3H12v4.5h6.5c-.1 1.1-.8 2.7-2.4 3.8l-.1.1 3.5 2.7.2.1c2.2-2 3.8-5 3.8-8.9z"/><path fill="#34A853" d="M12 24c3.2 0 6-1.1 7.9-2.9l-3.8-2.9c-1 .7-2.4 1.2-4.1 1.2-3.1 0-5.8-2.1-6.8-5l-.1.1-3.7 2.9v.1C3.3 21.3 7.3 24 12 24z"/><path fill="#FBBC05" d="M5.2 14.4c-.2-.7-.4-1.5-.4-2.4s.1-1.7.4-2.4l-.1-.1-3.7-2.9-.1.1C.5 8.2 0 10 0 12s.5 3.8 1.3 5.4l3.9-3z"/><path fill="#EA4335" d="M12 4.7c1.8 0 3 .8 3.7 1.4l3.3-3.2C17.9 1.1 15.2 0 12 0 7.3 0 3.3 2.7 1.3 6.6l3.9 3c1-2.9 3.7-4.9 6.8-4.9z"/></svg>
);

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const err = new URLSearchParams(window.location.search).get("error");
    if (err === "not_admin") setError("This Google account is not registered as an admin.");
    else if (err) setError("Google sign-in failed. Please try again.");
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      router.push("/admin");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-orange-50 dot-grid px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl">
        <span className="flex items-center text-[26px] leading-none mb-5">
          <Image src="/logo-w.png" alt="" width={52} height={52} className="h-[1em] w-[1em] shrink-0" />
          <span className="font-display font-bold text-stone-700 tracking-[0.06em]">ebstore pro</span>
        </span>
        <h1 className="font-display text-2xl font-bold text-stone-900">Admin Login</h1>
        <p className="text-sm text-stone-500 mt-1">WebStore Pro owner area.</p>
        <label className="block mt-6 text-sm font-medium text-stone-700">Email
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-stone-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-600" />
        </label>
        <label className="block mt-3 text-sm font-medium text-stone-700">Password
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-stone-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-600" />
        </label>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <button disabled={busy} className="mt-5 w-full rounded-full bg-orange-950 text-white font-bold py-3 hover:bg-orange-900 disabled:opacity-40">
          {busy ? "Signing in…" : "Sign In"}
        </button>
        <div className="mt-4 flex items-center gap-3">
          <span className="flex-1 border-t border-stone-200" />
          <span className="text-xs text-stone-400 font-medium">OR</span>
          <span className="flex-1 border-t border-stone-200" />
        </div>
        <a href="/api/admin/auth/google" className="mt-4 flex w-full items-center justify-center gap-3 rounded-full border border-stone-300 bg-white font-bold py-3 hover:bg-stone-50 transition text-stone-700">
          {GOOGLE_G_ICON}
          Continue with Google
        </a>
        <p className="mt-4 text-center text-sm">
          <a href="/admin/forgot-password" className="text-orange-700 font-medium hover:underline">Forgot password?</a>
        </p>
      </form>
    </div>
  );
}
