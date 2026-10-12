"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SERVICES } from "@/lib/content";

// Qomash-style menu: uppercase, wide tracking, dropdown chevrons
const MENU = [
  { label: "SERVICES", href: "/services", dropdown: true },
  { label: "PORTFOLIO", href: "/portfolio" },
  { label: "BLOG", href: "/blog", tag: "NEW" },
  { label: "PRICING", href: "/pricing" },
  { label: "CONTACT", href: "/contact" },
];

const linkCls = (active: boolean) =>
  `relative px-3 py-2 text-[13px] font-semibold uppercase tracking-[0.14em] transition whitespace-nowrap ${
    active ? "text-orange-600" : "text-stone-800 hover:text-orange-600"
  }`;

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mobileServices, setMobileServices] = useState(false);
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
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Wordmark: [W logo]ebstore pro — one row, logo height = text size */}
        <Link href="/" className="flex items-center whitespace-nowrap shrink-0" aria-label="WebStore Pro home">
          <span className="flex items-center text-[26px] leading-none">
            <Image
              src="/logo-w.png"
              alt=""
              width={52}
              height={52}
              className="h-[26px] w-[26px] shrink-0"
              priority
            />
            <span className="font-display font-bold text-stone-700 tracking-[0.06em]">
              ebstore pro
            </span>
          </span>
        </Link>

        {/* Desktop menu — Qomash style */}
        <nav className="hidden lg:flex items-center gap-1">
          {MENU.map((item) =>
            item.dropdown ? (
              <div key={item.label} className="relative group">
                <Link
                  href={item.href}
                  className={`${linkCls(pathname === item.href || pathname.startsWith(item.href + "/"))} flex items-center gap-1`}
                >
                  {item.label}
                  <svg className="w-3 h-3 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </Link>
                <div className="absolute left-0 top-full pt-2 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200">
                  <div className="w-64 bg-white border border-stone-200 shadow-xl py-2">
                    {SERVICES.map((s) => (
                      <Link
                        key={s.slug}
                        href={`/services/${s.slug}`}
                        className="block px-5 py-2.5 text-[13px] font-medium uppercase tracking-[0.1em] text-stone-700 hover:text-orange-600 hover:bg-stone-50 transition"
                      >
                        {s.title}
                      </Link>
                    ))}
                    <div className="border-t border-stone-100 mt-1 pt-1">
                      <Link
                        href="/services"
                        className="block px-5 py-2.5 text-[13px] font-bold uppercase tracking-[0.1em] text-orange-600 hover:bg-stone-50 transition"
                      >
                        All Services →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Link key={item.label} href={item.href} className={linkCls(pathname === item.href)}>
                <span className="relative inline-block">
                  {item.tag && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] font-bold tracking-[0.1em] text-orange-600">
                      {item.tag}
                    </span>
                  )}
                  {item.label}
                </span>
              </Link>
            )
          )}
          {customerName ? (
            <Link href="/account" className={linkCls(pathname === "/account")}>
              👤 {customerName}
            </Link>
          ) : (
            <Link href="/login" className={linkCls(pathname === "/login")}>
              Login
            </Link>
          )}
        </nav>

        {/* Right side: search + orange CTA */}
        <div className="hidden lg:flex items-center gap-4 shrink-0">
          <Link href="/blog" aria-label="Search" className="text-stone-800 hover:text-orange-600 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" />
            </svg>
          </Link>
          <Link
            href="/contact"
            className="bg-orange-600 hover:bg-orange-500 text-white text-[13px] font-bold uppercase tracking-[0.14em] px-6 py-2.5 transition"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setOpen(!open)} className="lg:hidden text-stone-900 text-2xl px-2" aria-label="Menu">
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="lg:hidden border-t border-stone-200 px-4 py-3 bg-white max-h-[80vh] overflow-y-auto">
          <button
            onClick={() => setMobileServices(!mobileServices)}
            className="w-full flex items-center justify-between px-3 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-stone-800"
          >
            Services
            <svg className={`w-4 h-4 transition-transform ${mobileServices ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {mobileServices && (
            <div className="pl-4 pb-1">
              {SERVICES.map((s) => (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2.5 text-[13px] font-medium uppercase tracking-[0.1em] text-stone-600"
                >
                  {s.title}
                </Link>
              ))}
            </div>
          )}
          {MENU.filter((m) => !m.dropdown).map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`block px-3 py-3 text-sm font-semibold uppercase tracking-[0.14em] ${
                pathname === item.href ? "text-orange-600" : "text-stone-800"
              }`}
            >
              {item.label}
              {item.tag && <span className="ml-2 text-[10px] font-bold text-orange-600">{item.tag}</span>}
            </Link>
          ))}
          <Link
            href={customerName ? "/account" : "/login"}
            onClick={() => setOpen(false)}
            className="block px-3 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-stone-800"
          >
            {customerName ? `👤 ${customerName}` : "Login"}
          </Link>
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="block text-center bg-orange-600 text-white text-sm font-bold uppercase tracking-[0.14em] px-5 py-3.5 mt-2"
          >
            Get Started
          </Link>
        </nav>
      )}
    </header>
  );
}
