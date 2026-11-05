import Link from "next/link";
import { SectionHead, Icon } from "@/components/ui";

export const metadata = {
  title: "Herramientas Gratuitas en Español",
  description:
    "8 herramientas gratuitas en español: IVA, hipoteca, préstamos, aguinaldo y finiquito (México), días entre fechas, códigos QR e identidad falsa.",
  keywords: [
    "herramientas online en español",
    "calculadoras gratuitas",
    "calculadora de iva",
    "generador de identidad falsa",
    "calculadora de hipoteca",
    "calculadora de préstamos",
    "calculadora de aguinaldo",
    "calculadora de finiquito",
    "días entre fechas",
    "generador de códigos qr",
  ],
  alternates: {
    canonical: "https://frinjo.me/es",
    languages: {
      es: "https://frinjo.me/es",
      fr: "https://frinjo.me/fr",
      en: "https://frinjo.me/tools",
      "x-default": "https://frinjo.me/tools",
    },
  },
  openGraph: {
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "WebStore Pro — Frinjo" }],
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
  {
    name: "Calculadora de Préstamos",
    href: "/es/calculadora-de-prestamos",
    tag: "Finanzas · Créditos",
    desc: "Cuota mensual, intereses totales y tabla de amortización de cualquier préstamo personal, en dólares, pesos mexicanos, euros, pesos colombianos, argentinos o soles. Compara plazos antes de firmar.",
  },
  {
    name: "Calculadora de Aguinaldo",
    href: "/es/calculadora-de-aguinaldo",
    tag: "Trabajo · México",
    desc: "Tu aguinaldo según la Ley Federal del Trabajo: mínimo 15 días, año completo o parte proporcional por días trabajados o desde tu fecha de ingreso. Pago antes del 20 de diciembre.",
  },
  {
    name: "Calculadora de Finiquito",
    href: "/es/calculadora-de-finiquito",
    tag: "Trabajo · México",
    desc: "Lo que te debe la empresa al salir, desglosado: salarios pendientes, aguinaldo proporcional, vacaciones con la tabla de Vacaciones Dignas y prima vacacional del 25%. Finiquito no es liquidación: aquí no se mezclan.",
  },
  {
    name: "Días Entre Fechas",
    href: "/es/calculadora-de-dias-entre-fechas",
    tag: "Fechas · Plazos",
    desc: "Días naturales y días hábiles reales entre dos fechas, descontando los festivos oficiales de México (descansos LFT con sus lunes de traslado) o de España. Con la lista de festivos del periodo.",
  },
  {
    name: "Generador de Códigos QR",
    href: "/es/generador-de-codigos-qr",
    tag: "Generador · Negocios",
    desc: "Códigos QR gratis y sin marca de agua: URL, texto, WiFi, contacto vCard, WhatsApp, correo y teléfono. Descarga en PNG de 1024 px o SVG vectorial; todo se genera en tu navegador.",
  },
];

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Herramientas en Español", item: "https://frinjo.me/es" },
  ],
};

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
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
            hipotecas y préstamos en euros y dólares, aguinaldo y finiquito de México, días hábiles con
            festivos oficiales, códigos QR e identidades de prueba con datos locales de verdad.
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
