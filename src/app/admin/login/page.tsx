"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

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
        <p className="mt-4 text-center text-sm">
          <a href="/admin/forgot-password" className="text-orange-700 font-medium hover:underline">Forgot password?</a>
        </p>
      </form>
    </div>
  );
}
