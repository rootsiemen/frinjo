import Link from "next/link";
import { BRAND } from "@/lib/content";
import { Icon } from "@/components/ui";

export const dynamic = "force-dynamic";

export default function ThankYouPage() {
  const waHref = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent("Hi! I just sent an inquiry about a website.")}`;
  return (
    <section className="bg-stone-50 py-24">
      <div className="max-w-xl mx-auto px-4 text-center">
        <span className="mx-auto w-20 h-20 rounded-full bg-emerald-100 grid place-items-center mb-8">
          <Icon name="check" className="w-10 h-10 text-emerald-700" />
        </span>
        <h1 className="font-display text-4xl font-bold text-stone-900">Inquiry received!</h1>
        <p className="mt-4 text-stone-600">
          Thanks for reaching out — I'll get back to you within a few hours with next steps and a quote.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a href={waHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#25D366] text-white font-bold px-7 py-3.5 hover:brightness-110 transition">
            Continue on WhatsApp
          </a>
          <Link href="/" className="inline-flex items-center gap-2 rounded-full border-2 border-stone-300 text-stone-700 font-semibold px-7 py-3 hover:border-emerald-700 hover:text-emerald-800 transition">
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
}
