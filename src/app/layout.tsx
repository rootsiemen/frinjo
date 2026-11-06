import type { Metadata } from "next";
import { headers } from "next/headers";
import Script from "next/script";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import "./globals.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL("https://frinjo.me"),
  title: {
    default: "WebStore Pro | Full Stack Web Developer",
    template: "%s | WebStore Pro",
  },
  description:
    "WebStore Pro builds full stack websites & web apps with admin panel, dashboards, Cash on Delivery, JazzCash & WhatsApp ordering — delivered in days.",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "WebStore Pro | Full Stack Web Developer",
    description:
      "Complete full stack websites and web apps with admin panel, shopping cart, Cash on Delivery, JazzCash & WhatsApp ordering — delivered ready to launch.",
    url: "https://frinjo.me",
    siteName: "WebStore Pro",
    type: "website",
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "WebStore Pro — Full Stack Web Developer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "WebStore Pro | Full Stack Web Developer",
    description:
      "Complete full stack websites and web apps with admin panel, cart, Cash on Delivery, JazzCash & WhatsApp ordering — delivered ready to launch.",
    images: ["/og-default.jpg"],
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
  "@type": ["Organization", "ProfessionalService"],
  "@id": `${SITE_URL}/#organization`,
  name: "WebStore Pro",
  url: SITE_URL,
  logo: `${SITE_URL}/logo-w.png`,
  email: "neilsonsmarry@gmail.com",
  description:
    "Web development agency building full stack websites and web applications with admin panel, shopping cart, Cash on Delivery, JazzCash/Easypaisa payments and WhatsApp ordering.",
  priceRange: "$$",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    email: "neilsonsmarry@gmail.com",
    availableLanguage: ["English", "Urdu"],
  },
  founder: { "@id": `${SITE_URL}/about#raza` },
  areaServed: "Worldwide",
  sameAs: [
    "https://github.com/rootsiemen",
    "https://rootsiemen.github.io/Portfolio/",
    "https://www.linkedin.com/in/mrazahaider1215/",
    "https://www.fiverr.com/s/r3Ev2K0",
    "https://www.instagram.com/yours.raza/",
    "https://x.com/irazamirza",
  ],
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = (await headers()).get("x-pathname") || "";
  const lang = pathname.startsWith("/es") ? "es" : pathname.startsWith("/fr") ? "fr" : "en";
  return (
    <html lang={lang}>
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9075805757065172"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {/* Google Analytics (GA4) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-9G9BEJS1PS" />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-9G9BEJS1PS');",
          }}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      </head>
      <body>
        <Navbar />
        <main className="min-h-[70vh]">{children}</main>
        <Footer />
        <WhatsAppFloat />
        {/* 100% privacy-first analytics */}
        <script async src="https://scripts.simpleanalyticscdn.com/latest.js" />
        {/* Zanderio AI chat widget — installed 2026-11-06 on the user's explicit order after a full code scan (clean) and risk briefing. The remote loader is monitored by the hourly `zanderio-security-watch` cron: any change to the file is reported to the user. Remove this one tag to uninstall completely. */}
        <script src="https://cdn.zanderio.ai/widget/loader.js" data-id="wdg_4gBdsUoDFfI8ehnw8ChVqwxL" defer />
      </body>
    </html>
  );
}
