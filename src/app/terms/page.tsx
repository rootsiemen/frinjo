import Link from "next/link";
import { BRAND } from "@/lib/content";
import { SectionHead, btnPrimary } from "@/components/ui";

export const dynamic = "force-dynamic";

export const metadata = {
  title: `Terms of Service — ${BRAND.name}`,
  description: `Terms of Service of ${BRAND.name}. The terms and conditions for using our website and ordering web development services.`,
};

const SECTIONS: { h: string; body: string[] }[] = [
  {
    h: "1. Services",
    body: [
      `${BRAND.name} provides web development services including business websites, ecommerce websites, landing pages, and related digital services as described on our Services and Pricing pages.`,
      "Each package includes the features listed on the Pricing page at the time of order. Any work beyond the package scope will be quoted separately and requires your approval before we begin.",
    ],
  },
  {
    h: "2. Orders and Payment",
    body: [
      "To place an order, select a package and complete the checkout with your contact details and payment transaction reference.",
      "Your order is confirmed once we verify your payment. We will contact you on WhatsApp or email within 24 hours to start the project.",
      "Prices are listed in USD. For Pakistani clients, the PKR equivalent is calculated at the current interbank rate on the day of payment.",
      "We accept JazzCash, Easypaisa, bank transfer, and other methods listed on the checkout page.",
    ],
  },
  {
    h: "3. Delivery Timelines",
    body: [
      "Starter websites are typically delivered within 5 working days, business websites within 7 working days, and pro ecommerce stores within 14 working days — starting from the day we receive all required content (text, images, logos) from you.",
      "Delays caused by late content delivery from the client extend the timeline accordingly. We will always communicate proactively if a delay occurs.",
    ],
  },
  {
    h: "4. Revisions",
    body: [
      "Each package includes 2 rounds of revisions after the initial delivery. A revision round means a consolidated list of changes sent at one time.",
      "Additional revision rounds or major scope changes after delivery are billed separately at an hourly rate agreed in advance.",
    ],
  },
  {
    h: "5. Refund Policy",
    body: [
      "If we have not yet started work on your project, you are entitled to a full refund.",
      "Once work has begun, refunds are calculated based on the work completed: you pay only for the portion delivered, and the remainder is refunded.",
      "No refunds are issued after final delivery and your written approval of the completed website.",
      "Refund requests must be sent to our contact email or WhatsApp within 7 days of the issue arising.",
    ],
  },
  {
    h: "6. Ownership",
    body: [
      "Upon full payment, you own 100% of your website — the domain, hosting account, source code, and content are yours.",
      "We retain the right to showcase your website in our portfolio unless you request otherwise in writing.",
    ],
  },
  {
    h: "7. Client Responsibilities",
    body: [
      "You are responsible for providing accurate business information, text content, images, and logos in a timely manner.",
      "You confirm that all content you provide (text, images, logos) is either owned by you or properly licensed, and does not infringe on third-party rights.",
    ],
  },
  {
    h: "8. Limitation of Liability",
    body: [
      "While we build every website to professional standards, we cannot guarantee specific business outcomes such as sales figures or search rankings.",
      "Our total liability for any claim related to our services is limited to the amount you paid for the specific project.",
    ],
  },
  {
    h: "9. Changes to These Terms",
    body: [
      "We may update these terms from time to time. The version in effect at the time of your order applies to that order.",
      "Continued use of the website after changes constitutes acceptance of the updated terms.",
    ],
  },
  {
    h: "10. Contact",
    body: [
      `Questions about these terms? Reach us anytime:`,
      `📧 ${BRAND.email}`,
      `Or use our contact page — we reply within 24 hours.`,
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <SectionHead
        eyebrow="Legal"
        title="Terms of Service"
        sub={`Last updated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}. Please read these terms carefully before ordering.`}
      />
      <div className="mt-8 space-y-8">
        {SECTIONS.map((s) => (
          <section key={s.h} className="rounded-3xl bg-white border border-stone-200 p-7">
            <h2 className="font-display text-xl font-bold text-stone-900 mb-3">{s.h}</h2>
            {s.body.map((p, i) => (
              <p key={i} className="text-sm text-stone-600 leading-relaxed mb-2.5 last:mb-0">{p}</p>
            ))}
          </section>
        ))}
      </div>
      <div className="mt-10 text-center">
        <Link href="/contact" className={btnPrimary}>Questions? Contact us</Link>
      </div>
    </div>
  );
}
