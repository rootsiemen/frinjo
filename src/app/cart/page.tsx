"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PACKAGES } from "@/lib/content";
import { pkgSlug, getCartSlug, setCartSlug } from "@/lib/cart";
import { Icon } from "@/components/ui";

export const dynamic = "force-dynamic";

export default function CartPage() {
  const router = useRouter();
  const [slug, setSlug] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setSlug(getCartSlug());    setLoaded(true);
  }, []);

  const pkg = PACKAGES.find((p) => pkgSlug(p.name) === slug);

  function remove() {
    setCartSlug(null);
    setSlug(null);
  }

  if (!loaded) {
    return (
      <section className="py-24 bg-stone-50 min-h-[60vh]">
        <div className="max-w-3xl mx-auto px-4 text-center text-stone-500">Loading cart…</div>
      </section>
    );
  }

  return (
    <>
      <section className="bg-emerald-50 dot-grid py-14 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-700 mb-3">Your Cart</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-stone-900">Review your selection</h1>
        </div>
      </section>

      <section className="py-14 bg-stone-50 min-h-[50vh]">
        <div className="max-w-3xl mx-auto px-4">
          {!pkg ? (
            <div className="rounded-3xl bg-white border border-stone-200 p-12 text-center">
              <div className="text-5xl mb-4">🛒</div>
              <h2 className="font-display text-2xl font-bold text-stone-900 mb-2">Your cart is empty</h2>
              <p className="text-stone-600 mb-8">Pick a website package to get started.</p>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-950 text-white font-bold px-8 py-4 hover:bg-emerald-900 transition"
              >
                Browse Packages <Icon name="arrow" className="w-5 h-5" />
              </Link>
            </div>
          ) : (
            <div className="rounded-3xl bg-white border border-stone-200 overflow-hidden">
              <div className="p-8 sm:p-10">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700 mb-2">Website Package</p>
                    <h2 className="font-display text-3xl font-bold text-stone-900">{pkg.name}</h2>
                    <p className="mt-1 text-sm text-stone-500">{pkg.pages} · {pkg.delivery}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-display text-4xl font-bold text-emerald-800">${pkg.price}</p>
                    <p className="text-xs text-stone-500 mt-1">one-time</p>
                  </div>
                </div>
                <ul className="mt-8 grid sm:grid-cols-2 gap-3">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex gap-2.5 text-sm text-stone-700">
                      <Icon name="check" className="w-5 h-5 shrink-0 text-emerald-600" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-stone-200 bg-stone-50 px-8 sm:px-10 py-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={remove}
                  className="rounded-full border border-stone-300 text-stone-600 font-semibold px-6 py-3 hover:bg-stone-100 transition text-sm"
                >
                  Remove
                </button>
                <Link
                  href="/pricing"
                  className="rounded-full border border-stone-300 text-stone-700 font-semibold px-6 py-3 hover:bg-stone-100 transition text-sm text-center"
                >
                  Change package
                </Link>
                <button
                  onClick={() => router.push(`/checkout?package=${pkgSlug(pkg.name)}`)}
                  className="sm:ml-auto inline-flex items-center justify-center gap-2 rounded-full bg-emerald-950 text-white font-bold px-8 py-3.5 hover:bg-emerald-900 transition"
                >
                  Proceed to Checkout <Icon name="arrow" className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
