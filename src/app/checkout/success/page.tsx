import Link from "next/link";
import { BRAND } from "@/lib/content";
import { Icon } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  const waHref = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(
    `Hi! I just placed an order${id ? ` (#${id})` : ""} on your website.`
  )}`;

  return (
    <section className="bg-stone-50 py-24 min-h-[70vh]">
      <div className="max-w-xl mx-auto px-4 text-center">
        <span className="mx-auto w-20 h-20 rounded-full bg-emerald-100 grid place-items-center mb-8">
          <Icon name="check" className="w-10 h-10 text-emerald-700" />
        </span>
        <h1 className="font-display text-4xl font-bold text-stone-900">Order received!</h1>
        {id && (
          <p className="mt-3 inline-block rounded-full bg-emerald-100 text-emerald-900 font-bold px-5 py-2 text-sm">
            Order #{id}
          </p>
        )}
        <p className="mt-4 text-stone-600 leading-relaxed">
          Thanks! I'll verify your payment and contact you on WhatsApp within a few hours
          to start your project.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#25D366] text-white font-bold px-7 py-3.5 hover:brightness-110 transition"
          >
            <Icon name="chat" className="w-5 h-5" /> Message me on WhatsApp
          </a>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border-2 border-stone-300 text-stone-700 font-semibold px-7 py-3 hover:border-emerald-700 hover:text-emerald-800 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
}
