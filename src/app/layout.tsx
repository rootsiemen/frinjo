import type { Metadata } from "next";
import Script from "next/script";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import "./globals.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL("https://frinjo.me"),
  title: {
    default: "WebStore Pro | Ecommerce Website Developer",
    template: "%s | WebStore Pro",
  },
  description:
    "WebStore Pro builds ecommerce websites & online stores with admin panel, cart, Cash on Delivery, JazzCash & WhatsApp ordering — delivered in days.",
  keywords: [
    "ecommerce website developer",
    "online store developer",
    "build ecommerce website",
    "business website developer",
    "COD ecommerce website",
    "WhatsApp ordering website",
    "JazzCash payment integration",
    "affordable website development",
    "freelance web developer",
  ],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "WebStore Pro | Ecommerce Website Developer",
    description:
      "Complete online stores with admin panel, shopping cart, Cash on Delivery, JazzCash & WhatsApp ordering — delivered ready to launch.",
    url: "https://frinjo.me",
    siteName: "WebStore Pro",
    type: "website",
    images: [{ url: "/logo-w.png", width: 1200, height: 630, alt: "WebStore Pro — Ecommerce Website Developer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "WebStore Pro | Ecommerce Website Developer",
    description:
      "Complete online stores with admin panel, cart, Cash on Delivery, JazzCash & WhatsApp ordering — delivered ready to launch.",
    images: ["/logo-w.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

const SITE_URL = "https://frinjo.me";

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE_URL}/#organization`,
  name: "WebStore Pro",
  url: SITE_URL,
  logo: `${SITE_URL}/logo-w.png`,
  description:
    "Web development agency building ecommerce websites and online stores with admin panel, shopping cart, Cash on Delivery, JazzCash/Easypaisa payments and WhatsApp ordering.",
  priceRange: "$$",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    availableLanguage: ["English", "Urdu"],
  },
  sameAs: [SITE_URL],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: "WebStore Pro",
  url: SITE_URL,
  publisher: { "@id": `${SITE_URL}/#organization` },
  inLanguage: "en",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9075805757065172"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      </head>
      <body>
        <Navbar />
        <main className="min-h-[70vh]">{children}</main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
