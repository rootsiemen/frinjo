import Link from "next/link";
import { SectionHead, Icon } from "@/components/ui";

export const metadata = {
  title: "Herramientas Gratuitas en Español — Calculadoras Online | Frinjo",
  description:
    "Herramientas y calculadoras gratuitas en español de WebStore Pro: calculadora de IVA para España y Latinoamérica, generador de identidad falsa con correo temporal y calculadora de hipoteca en euros y dólares. Sin registro, en tu navegador.",
  keywords: [
    "herramientas online en español",
    "calculadoras gratuitas",
    "calculadora de iva",
    "generador de identidad falsa",
    "calculadora de hipoteca",
  ],
  alternates: {
    canonical: "https://frinjo.me/es",
    languages: { es: "https://frinjo.me/es", fr: "https://frinjo.me/fr", en: "https://frinjo.me/tools" },
  },
  openGraph: {
    title: "Herramientas Gratuitas en Español | WebStore Pro",
    description:
      "Calculadora de IVA, generador de identidad falsa y calculadora de hipoteca — gratis, sin registro y en español.",
    url: "https://frinjo.me/es",
    type: "website",
  },
};

const TOOLS = [
  {
    name: "Calculadora de IVA",
    href: "/es/calculadora-de-iva",
    tag: "Impuestos · Facturación",
    desc: "Calcula el IVA de España, México, Colombia, Argentina, Chile, Perú y más países: facturas con varias líneas, retenciones opcionales y el total en letra. Añade o quita el IVA al instante.",
  },
  {
    name: "Generador de Identidad Falsa",
    href: "/es/generador-de-identidad-falsa",
    tag: "Generador · Pruebas",
    desc: "Identidades ficticias completas de España, México, Colombia, Argentina, Chile, Perú y EE. UU.: nombre con dos apellidos, dirección, teléfono, correo temporal que sí recibe mensajes, contraseña y empleo. Hasta 100 a la vez, con exportación CSV/JSON. Sin documentos de identidad, por diseño.",
  },
  {
    name: "Calculadora de Hipoteca",
    href: "/es/calculadora-de-hipoteca",
    tag: "Finanzas · Vivienda",
    desc: "Tu cuota mensual en euros (€) o dólares ($): entrada, interés y plazo, con impuestos, seguro y HOA en el modo EE. UU., interés total y tabla de amortización año por año.",
  },
];

const itemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Herramientas gratuitas en español",
  itemListElement: TOOLS.map((t, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: t.name,
    url: `https://frinjo.me${t.href}`,
  })),
};

const card =
  "rounded-3xl border border-stone-200 bg-white p-8 hover:shadow-xl hover:border-orange-200 transition block";

export default function EsHubPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Gratis · Sin registro · En español
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            Herramientas en <span className="text-gold-gradient">Español</span>
          </h1>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Calculadoras pensadas para España y Latinoamérica: impuestos con los tipos de cada país,
            hipotecas en euros y dólares, e identidades de prueba con datos locales de verdad.
            Todo funciona en tu navegador.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead eyebrow="Herramientas" title="Elige una herramienta" />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 text-left">
            {TOOLS.map((t) => (
              <Link key={t.href} href={t.href} className={card}>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 mb-3">{t.tag}</p>
                <h2 className="font-display text-xl font-bold text-stone-900 mb-3">{t.name}</h2>
                <p className="text-stone-600 leading-relaxed">{t.desc}</p>
                <p className="mt-4 font-semibold text-orange-700 inline-flex items-center gap-2">
                  Abrir <Icon name="arrow" className="w-4 h-4" />
                </p>
              </Link>
            ))}
          </div>
          <p className="mt-10 text-center text-stone-500">
            ¿Buscas más? Tenemos más de 30 herramientas gratuitas en inglés en el{" "}
            <Link href="/tools" className="font-semibold text-orange-700 hover:text-orange-800">
              centro de herramientas
            </Link>
            , y la versión en francés está en{" "}
            <Link href="/fr" className="font-semibold text-orange-700 hover:text-orange-800">
              frinjo.me/fr
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
