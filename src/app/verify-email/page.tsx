"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function VerifyContent() {
  const params = useSearchParams();
  const router = useRouter();
  const [state, setState] = useState<"working" | "done" | "error">("working");
  const [message, setMessage] = useState("");
  const [expired, setExpired] = useState(false);
  const [email, setEmail] = useState("");
  const [resent, setResent] = useState(false);

  useEffect(() => {
    const token = params.get("token");
    if (!token) {
      setState("error");
      setMessage("No verification token in this link.");
      return;
    }
    (async () => {
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Verification failed");
        setState("done");
        setMessage(data.already ? "Your email was already verified. Welcome back!" : `Thanks ${data.name || ""}! Your email is verified.`.trim());
        setTimeout(() => router.push("/account"), 2500);
      } catch (err: unknown) {
        setState("error");
        const msg = err instanceof Error ? err.message : "Verification failed";
        setMessage(msg);
        setExpired(/expired/i.test(msg));
      }
    })();
  }, [params, router]);

  async function resend(e: React.FormEvent) {
    e.preventDefault();
    try {
      await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setResent(true);
    } catch { /* never reveal */ }
    setResent(true);
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center">
      <div className="rounded-3xl bg-white border border-stone-200 shadow-sm p-8">
        {state === "working" && (
          <>
            <h1 className="font-display text-2xl font-bold text-stone-900">Verifying…</h1>
            <p className="text-stone-500 text-sm mt-2">Please wait a moment.</p>
          </>
        )}
        {state === "done" && (
          <>
            <div className="text-5xl">✅</div>
            <h1 className="font-display text-2xl font-bold text-stone-900 mt-4">Email verified!</h1>
            <p className="text-stone-500 text-sm mt-2">{message} Taking you to your account…</p>
            <Link href="/account" className="inline-block mt-6 rounded-xl bg-emerald-700 text-white font-bold px-8 py-3 hover:bg-emerald-800">Go to My Account</Link>
          </>
        )}
        {state === "error" && (
          <>
            <div className="text-5xl">⚠️</div>
            <h1 className="font-display text-2xl font-bold text-stone-900 mt-4">Couldn't verify</h1>
            <p className="text-stone-500 text-sm mt-2">{message}</p>
            {expired || /invalid/i.test(message) ? (
              resent ? (
                <p className="mt-6 text-sm text-emerald-700 font-medium">If that email is registered, a fresh link is on its way. Check your inbox (and spam).</p>
              ) : (
                <form onSubmit={resend} className="mt-6 space-y-3">
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
                    className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600" />
                  <button className="w-full rounded-xl bg-emerald-700 text-white font-bold py-3 hover:bg-emerald-800">Send a new link</button>
                </form>
              )
            ) : (
              <Link href="/login" className="inline-block mt-6 rounded-xl bg-emerald-700 text-white font-bold px-8 py-3 hover:bg-emerald-800">Back to Sign in</Link>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto px-4 py-16 text-center text-stone-500">Loading…</div>}>
      <VerifyContent />
    </Suspense>
  );
}
