"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const LINKS = [
  ["Dashboard", "/admin"],
  ["Orders", "/admin/orders"],
  ["Inquiries", "/admin/inquiries"],
  ["Portfolio", "/admin/portfolio"],
  ["Blog Posts", "/admin/blog"],
  ["Testimonials", "/admin/testimonials"],
];

export default function AdminSidebar({ adminName }: { adminName: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  const nav = (
    <div className="flex flex-col h-full">
      <div className="p-5">
        <div className="flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-300 to-amber-600 grid place-items-center font-display font-bold text-emerald-950">W</span>
          <div>
            <div className="font-display font-bold text-stone-900 leading-tight">Frinjo</div>
            <div className="text-xs text-stone-500 truncate">{adminName}</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {LINKS.map(([label, href]) => (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className={`block rounded-lg px-3 py-2.5 text-sm font-medium ${
              pathname === href ? "bg-emerald-700 text-white" : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            {label}
          </Link>
        ))}
        <Link href="/" className="block rounded-lg px-3 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-100">
          ← View Site
        </Link>
      </nav>
      <div className="p-4">
        <button onClick={logout} className="w-full rounded-lg bg-stone-100 text-stone-700 text-sm font-medium py-2.5 hover:bg-stone-200">
          Log out
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="md:hidden fixed top-0 inset-x-0 z-40 bg-white text-stone-900 border-b border-stone-200 px-4 py-3 flex items-center justify-between">
        <span className="font-display font-bold">Admin Panel</span>
        <button onClick={() => setOpen(!open)} className="text-2xl leading-none" aria-label="Menu">☰</button>
      </div>
      <div className="md:hidden h-14" />
      {open && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-white border-r border-stone-200">{nav}</aside>
        </div>
      )}
      <aside className="hidden md:block w-60 shrink-0 bg-white border-r border-stone-200 min-h-screen sticky top-0 h-screen">{nav}</aside>
    </>
  );
}
