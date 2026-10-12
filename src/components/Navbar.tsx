"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BRAND } from "@/lib/content";

const LINKS = [
  ["Home", "/"],
  ["Services", "/services"],
  ["Portfolio", "/portfolio"],
  ["Web Portfolio", "/web-developer-portfolio.html"],
  ["Pricing", "/pricing"],
  ["Blog", "/blog"],
  ["Contact", "/contact"],
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [customerName, setCustomerName] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/session").then(async (r) => {
      if (r.ok) {
        const { customer } = await r.json();
        setCustomerName(customer.name.split(" ")[0]);
      }
    }).catch(() => {});
  }, [pathname]);
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-300 to-amber-600 grid place-items-center font-display font-bold text-emerald-950 text-lg">W</span>
          <span className="leading-tight">
            <span className="block font-display font-bold text-stone-900">{BRAND.name}</span>
            <span className="block text-[10px] uppercase tracking-widest text-amber-600">Websites that sell</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {LINKS.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                pathname === href ? "bg-emerald-100 text-emerald-800" : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
              }`}
            >
              {label}
            </Link>
          ))}
          <Link href="/cart" className={`px-4 py-2 rounded-full text-sm font-medium transition flex items-center gap-1.5 ${pathname === "/cart" ? "bg-emerald-100 text-emerald-800" : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"}`}>
            🛒 Cart
          </Link>
          {customerName ? (
            <Link href="/account" className="ml-1 rounded-full border border-stone-300 text-emerald-700 text-sm font-bold px-5 py-2.5 hover:bg-stone-100 transition">
              👤 {customerName}
            </Link>
          ) : (
            <>
              <Link href="/login" className={`px-4 py-2 rounded-full text-sm font-medium transition ${pathname === "/login" ? "bg-emerald-100 text-emerald-800" : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"}`}>
                Sign in
              </Link>
              <Link href="/signup" className="ml-1 rounded-full border border-amber-500 text-amber-700 text-sm font-bold px-5 py-2.5 hover:bg-amber-400 hover:text-emerald-950 transition">
                Sign up
              </Link>
            </>
          )}
          <Link href="/contact" className="ml-2 rounded-full bg-amber-400 text-emerald-950 text-sm font-bold px-5 py-2.5 hover:bg-amber-300 transition">
            Get a Website
          </Link>
        </nav>
        <button onClick={() => setOpen(!open)} className="md:hidden text-stone-900 text-2xl px-2" aria-label="Menu">☰</button>
      </div>
      {open && (
        <nav className="md:hidden border-t border-stone-200 px-4 py-3 space-y-1 bg-white">
          {LINKS.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${pathname === href ? "bg-emerald-100 text-emerald-800" : "text-stone-600"}`}
            >
              {label}
            </Link>
          ))}
          <Link href="/cart" onClick={() => setOpen(false)} className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${pathname === "/cart" ? "bg-emerald-100 text-emerald-800" : "text-stone-600"}`}>
            🛒 Cart
          </Link>
          <Link href={customerName ? "/account" : "/login"} onClick={() => setOpen(false)} className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${pathname === "/login" || pathname === "/account" ? "bg-emerald-100 text-emerald-800" : "text-stone-600"}`}>
            {customerName ? `👤 ${customerName}` : "Sign in"}
          </Link>
          {!customerName && (
            <Link href="/signup" onClick={() => setOpen(false)} className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${pathname === "/signup" ? "bg-emerald-100 text-emerald-800" : "text-stone-600"}`}>
              Sign up
            </Link>
          )}
          <Link href="/contact" onClick={() => setOpen(false)} className="block text-center rounded-full bg-amber-400 text-emerald-950 text-sm font-bold px-5 py-3 mt-2">
            Get a Website
          </Link>
        </nav>
      )}
    </header>
  );
}
