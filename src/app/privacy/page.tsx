import Link from "next/link";
import { BRAND } from "@/lib/content";
import { SectionHead, btnPrimary, Icon } from "@/components/ui";

export const dynamic = "force-dynamic";

export const metadata = {
  title: `Privacy Policy — ${BRAND.name}`,
  description: `Privacy Policy of ${BRAND.name}. How we collect, use and protect your personal information.`,
};

const SECTIONS: { h: string; body: string[] }[] = [
  {
    h: "1. Information We Collect",
    body: [
      "When you use our website, place an order, or contact us, we may collect the following information:",
      "- Contact details you provide: name, email address, phone/WhatsApp number.",
      "- Order details: selected package, business information, and transaction references you submit.",
      "- Technical data: pages visited, device type, and approximate location — collected via standard analytics tools to improve the website.",
      "We do not collect or store your bank/card details. Online payments are processed by third-party gateways (e.g. JazzCash, Easypaisa, Stripe, PayPal, Binance) on their own secure pages.",
    ],
  },
  {
    h: "2. How We Use Your Information",
    body: [
      "We use the information we collect to:",
      "- Process and deliver your website order and provide customer support.",
      "- Respond to inquiries sent through our contact forms or WhatsApp.",
      "- Send order updates and service-related notifications.",
      "- Improve our website, services and content.",
      "We do not sell, rent or share your personal information with third parties for marketing purposes.",
    ],
  },
  {
    h: "3. Cookies",
    body: [
      "Our website may use basic cookies and similar technologies to remember your preferences (such as cart contents) and to understand how visitors use the site. You can disable cookies in your browser settings, though some features may not work correctly without them.",
    ],
  },
  {
    h: "4. Third-Party Services",
    body: [
      "We may use trusted third-party services that process data on our behalf:",
      "- Analytics (e.g. Google Analytics) to understand site traffic.",
      "- Payment gateways to process your payments securely.",
      "- Messaging platforms (e.g. WhatsApp) when you choose to contact or order through them.",
      "These services have their own privacy policies governing their use of your information.",
    ],
  },
  {
    h: "5. Data Security",
    body: [
      "We take reasonable technical and organizational measures to protect your information against unauthorized access, alteration or disclosure. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.",
    ],
  },
  {
    h: "6. Your Rights",
    body: [
      "You may request access to, correction of, or deletion of your personal information at any time by contacting us. We will respond to reasonable requests within a reasonable timeframe.",
    ],
  },
  {
    h: "7. Changes to This Policy",
    body: [
      "We may update this Privacy Policy from time to time. The latest version will always be published on this page, with the effective date shown below.",
    ],
  },
  {
    h: "8. Contact Us",
    body: [
      `If you have any questions about this Privacy Policy, contact us at ${BRAND.email} or via WhatsApp using the button on this site.`,
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <section className="bg-emerald-50 dot-grid py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-700 mb-3">Legal</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-stone-900">Privacy Policy</h1>
          <p className="mt-4 text-stone-600">Effective date: October 1, 2026</p>
        </div>
      </section>

      <section className="py-14 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-stone-600 leading-relaxed mb-10">
            {BRAND.name} ("we", "our", "us") respects your privacy. This policy explains what information
            we collect when you visit {BRAND.name} (frinjo.me), how we use it, and the choices you have.
          </p>
          <div className="space-y-10">
            {SECTIONS.map((s) => (
              <div key={s.h}>
                <h2 className="font-display text-2xl font-bold text-stone-900 mb-4">{s.h}</h2>
                <div className="space-y-3">
                  {s.body.map((p, i) =>
                    p.startsWith("- ") ? (
                      <p key={i} className="text-stone-600 leading-relaxed pl-5 relative">
                        <span className="absolute left-0 text-amber-500 font-bold">•</span>
                        {p.slice(2)}
                      </p>
                    ) : (
                      <p key={i} className="text-stone-600 leading-relaxed">{p}</p>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 rounded-3xl bg-emerald-50 border border-emerald-200 p-8 text-center">
            <SectionHead eyebrow="Questions?" title="We're happy to help" />
            <Link href="/contact" className={btnPrimary}>
              Contact Us <Icon name="arrow" className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
