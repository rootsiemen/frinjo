export const metadata = {
  title: "Contact — Get a Free Website Quote",
  description:
    "Contact WebStore Pro for a free website quote. Message on WhatsApp — I reply fast, usually within a few hours. Full stack websites delivered in days.",
  alternates: { canonical: "https://frinjo.me/contact" },
  openGraph: {
    title: "Contact — Get a Free Website Quote",
    description:
      "Contact WebStore Pro for a free website quote. Message on WhatsApp — I reply fast, usually within a few hours. Full stack websites delivered in days.",
    url: "https://frinjo.me/contact",
    type: "website",
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "Contact WebStore Pro — get a free website quote" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact — Get a Free Website Quote",
    description:
      "Contact WebStore Pro for a free website quote. Message on WhatsApp — I reply fast, usually within a few hours. Full stack websites delivered in days.",
    images: ["/og-default.jpg"],
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
