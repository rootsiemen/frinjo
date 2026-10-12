import Link from "next/link";
import { BRAND, PACKAGES } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="bg-stone-50 text-stone-600 border-t border-stone-200">
      <div className="max-w-6xl mx-auto px-4 py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-300 to-amber-600 grid place-items-center font-display font-bold text-emerald-950 text-lg">W</span>
            <span className="font-display font-bold text-stone-900 text-lg">{BRAND.name}</span>
          </div>
          <p className="text-sm max-w-sm text-stone-500">{BRAND.tagline}. I build complete, mobile-friendly online stores and business websites for clients worldwide.</p>
          <p className="text-sm mt-4 text-stone-500">📧 {BRAND.email}</p>
        </div>
        <div>
          <h3 className="text-stone-900 font-bold mb-4 text-sm uppercase tracking-wider">Pages</h3>
          <ul className="space-y-2.5 text-sm">
            {[["About", "/about"], ["Services", "/services"], ["Portfolio", "/portfolio"], ["Pricing", "/pricing"], ["Blog", "/blog"], ["Contact", "/contact"]].map(([l, h]) => (
              <li key={h}><Link href={h} className="hover:text-amber-600 transition">{l}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-stone-900 font-bold mb-4 text-sm uppercase tracking-wider">Packages</h3>
          <ul className="space-y-2.5 text-sm">
            {PACKAGES.map((p) => (
              <li key={p.name}>
                <Link href="/pricing" className="hover:text-amber-600 transition">
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-stone-200">
        <div className="max-w-6xl mx-auto px-4 py-5 text-xs text-stone-500 flex flex-col sm:flex-row justify-between gap-2">
          <span>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</span>
          <span className="flex gap-4">
            <Link href="/privacy" className="hover:text-amber-600 transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-amber-600 transition">Terms of Service</Link>
            <Link href="/about" className="hover:text-amber-600 transition">About</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
