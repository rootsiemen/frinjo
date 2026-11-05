import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import IvaCalculator from "./IvaCalculator";
import { COUNTRY_PRESETS } from "./calc";

export const metadata = {
  title: "Calculadora de IVA 2026 — España, México y Latinoamérica | Frinjo",
  description:
    "Calculadora de IVA gratuita para España, México, Colombia, Argentina, Chile, Perú y más: factura con varias líneas, tipos por país, retenciones de ISR e IVA, modo añadir o quitar el impuesto y total en letra. Sin registro.",
  keywords: [
    "calculadora de IVA",
    "calcular IVA",
    "calculadora IVA España",
    "calculadora IVA México",
    "quitar el IVA",
    "añadir IVA a un precio",
    "calcular IVA de una factura",
    "total en letra",
  ],
  alternates: {
    canonical: "https://frinjo.me/es/calculadora-de-iva",
    languages: { es: "https://frinjo.me/es/calculadora-de-iva" },
  },
  openGraph: {
    title: "Calculadora de IVA 2026 — España, México y Latinoamérica | Frinjo",
    description:
      "Añade o quita el IVA con los tipos oficiales de 11 países: factura multilínea, retenciones, total en letra y copiar resumen. Gratis y sin registro.",
    url: "https://frinjo.me/es/calculadora-de-iva",
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Calculadora de IVA",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/es/calculadora-de-iva",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "Calculadora de IVA gratuita para España, México, Colombia, Argentina, Chile, Perú, Ecuador, Uruguay, República Dominicana, Costa Rica y Panamá. Metodología: para añadir el impuesto, cuota = base imponible × tipo ÷ 100; para quitar el impuesto de un precio con IVA incluido, base = total ÷ (1 + tipo ÷ 100) y cuota = total − base. Incluye facturas con varias líneas y tipos distintos por línea, retenciones opcionales de ISR (sobre la base) e IVA (sobre la cuota) y el total en letra en español. Todo el cálculo se realiza en el navegador del visitante; no se envía ni se guarda ningún dato.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Herramientas", item: "https://frinjo.me/es" },
    { "@type": "ListItem", position: 3, name: "Calculadora de IVA", item: "https://frinjo.me/es/calculadora-de-iva" },
  ],
};

const FAQS: [string, string][] = [
  [
    "¿Qué es el IVA y quién lo paga?",
    "El IVA (Impuesto sobre el Valor Añadido) es un impuesto indirecto sobre el consumo: lo paga el consumidor final, pero lo cobra y lo ingresa a Hacienda el vendedor o profesional en cada factura. Por eso la cuota de IVA no es un ingreso tuyo: es dinero que recaudas para el Estado y que después se liquida en la declaración correspondiente (en España, el modelo 303; en México, la declaración mensual del SAT).",
  ],
  [
    "¿Cuáles son los tipos de IVA en España en 2026?",
    "España mantiene tres tipos: el general del 21% (la mayoría de productos y servicios), el reducido del 10% (hostelería, transporte de viajeros, gran parte de la alimentación) y el superreducido del 4% (pan, leche, libros, medicamentos y otros bienes de primera necesidad). Algunas operaciones están exentas (0%), como la sanidad o la educación reglada. Esta calculadora trae los tres tipos más el 0% listos para elegir en cada línea.",
  ],
  [
    "¿Cómo se calcula el IVA de un precio?",
    "Depende de si el precio ya lleva el impuesto. Para AÑADIR el IVA: cuota = base × tipo ÷ 100 (ejemplo: 100 € al 21% → 21 € de IVA, total 121 €). Para QUITAR el IVA de un precio final: base = total ÷ (1 + tipo ÷ 100) (ejemplo: 121 € al 21% → base 100 €, cuota 21 €). El error más común es restar el porcentaje directamente (121 − 21% = 95,59 €), que es incorrecto: el porcentaje se calcula sobre la base, no sobre el total.",
  ],
  [
    "¿Cuál es la diferencia entre añadir y quitar el IVA?",
    "Añadir es el caso de la factura de venta: partes de tu precio neto y sumas el impuesto encima. Quitar (o desglosar) es el caso contrario: tienes un precio cerrado con impuesto incluido —una tarifa, un ticket, un presupuesto «IVA incluido»— y necesitas saber qué parte es base y qué parte es impuesto para contabilizarlo o deducirlo. El interruptor de esta calculadora cambia entre ambos modos sin tocar tus líneas.",
  ],
  [
    "¿Qué son las retenciones de ISR e IVA en México?",
    "Cuando una persona física presta servicios profesionales a una empresa (persona moral) en México, la empresa retiene una parte del pago: habitualmente el 10% de ISR sobre la base y dos tercios del IVA (66.67% de la cuota). En esta calculadora ambos campos son opcionales y están a cero por defecto: la retención de ISR se aplica sobre la base imponible y la de IVA sobre la cuota del impuesto, tal como se refleja en la factura. Si tu régimen es RESICO u otro caso, introduce los porcentajes que te apliquen.",
  ],
  [
    "¿La calculadora es gratis? ¿Se guardan mis datos?",
    "Sí, es completamente gratis y sin registro. Todas las operaciones se hacen en tu navegador: las cifras de tu factura no se envían a ningún servidor ni quedan guardadas. Puedes cerrar la página y no quedará rastro de los importes que calculaste.",
  ],
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map(([q, a]) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

const card =
  "rounded-3xl border border-stone-200 bg-white p-8 hover:shadow-xl hover:border-orange-200 transition";

const RATE_NOTES: Record<string, string> = {
  es: "General 21% · reducido 10% · superreducido 4%",
  mx: "General 16% · 8% en la frontera norte · 0% alimentos y medicinas",
  co: "General 19% · tarifa diferencial del 5%",
  ar: "General 21% · reducido 10.5% · aumentado 27%",
  cl: "Tipo único del 19%",
  pe: "IGV 18% = 16% de IGV + 2% de impuesto de promoción municipal",
  ec: "General 15% desde abril de 2024 · tarifa 0% en bienes básicos",
  uy: "General 22% · reducido 10%",
  do: "ITBIS general del 18%",
  cr: "General 13% · tarifas reducidas del 4%, 2% y 1%",
  pa: "ITBMS general del 7% (10% y 15% en casos especiales)",
};

export default function CalculadoraIvaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* HERO */}
      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Gratis · Sin registro · 11 países
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            Calculadora de <span className="text-gold-gradient">IVA</span>
          </h1>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-stone-800">
            España, México y toda Latinoamérica en una sola página
          </p>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Monta tu factura línea a línea, cada una con su tipo de impuesto, añade las retenciones si te
            aplican y obtén la base, la cuota, el total y el <strong>total en letra</strong> listo para
            copiar. Añade o quita el impuesto con un solo interruptor.
          </p>
        </div>
      </section>

      {/* CALCULATOR */}
      <IvaCalculator />

      {/* HOW IT WORKS */}
      <section className="py-16 sm:py-20 bg-white border-t border-stone-100">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead
            eyebrow="Cómo funciona"
            title="El cálculo del IVA, explicado sin rodeos"
            sub="Dos fórmulas lo resuelven todo. La calculadora las aplica línea a línea y suma con el redondeo a dos decimales que usa cualquier factura."
          />
          <div className="grid gap-5 md:grid-cols-2 text-left">
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 mb-3">Añadir el impuesto</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Cuota = base × tipo ÷ 100</h3>
              <p className="text-stone-600 leading-relaxed">
                Partes del precio neto. Una base de 1,000 al 21% genera una cuota de 210 y un total de
                1,210. Es el cálculo de la factura de venta: el impuesto va <strong>encima</strong> de tu precio.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 mb-3">Quitar el impuesto</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Base = total ÷ (1 + tipo ÷ 100)</h3>
              <p className="text-stone-600 leading-relaxed">
                Partes del precio cerrado. Un total de 1,210 al 21% esconde una base de 1,000 y una cuota
                de 210. Nunca restes el porcentaje al total: ese atajo da una base menor y una cuota
                equivocada.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-600 mb-3">Retenciones</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">ISR sobre la base, IVA sobre la cuota</h3>
              <p className="text-stone-600 leading-relaxed">
                En México, cuando un profesional factura a una empresa, esta retiene parte del pago: el
                ISR se calcula sobre la base imponible y la retención de IVA sobre la cuota (habitualmente
                dos tercios, 66.67%). Por defecto ambos campos están a cero: actívalos solo si te aplican.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-600 mb-3">Total en letra</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">El importe, también en palabras</h3>
              <p className="text-stone-600 leading-relaxed">
                Muchas facturas exigen el total escrito en letra para evitar alteraciones. La calculadora
                lo genera automáticamente con la moneda de tu país —euros, pesos, soles, colones o
                dólares— y lo incluye en el resumen que puedes copiar.
              </p>
            </div>
          </div>

          {/* RATE TABLE */}
          <div className="mt-14 max-w-4xl mx-auto">
            <h3 className="font-display text-2xl font-bold text-stone-900 text-center mb-6">
              Tipos de IVA por país (2026)
            </h3>
            <div className="overflow-x-auto rounded-3xl border border-stone-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-stone-50 text-left text-xs uppercase tracking-wide text-stone-500">
                    <th className="py-3 px-4">País</th>
                    <th className="py-3 px-4">Impuesto</th>
                    <th className="py-3 px-4 text-right">Tipo general</th>
                    <th className="py-3 px-4">Notas</th>
                  </tr>
                </thead>
                <tbody>
                  {COUNTRY_PRESETS.map((c) => (
                    <tr key={c.id} className="border-t border-stone-100">
                      <td className="py-3 px-4 font-bold text-stone-800">{c.name}</td>
                      <td className="py-3 px-4 text-stone-600">{c.taxName}</td>
                      <td className="py-3 px-4 text-right font-bold text-stone-800">{c.defaultRate}%</td>
                      <td className="py-3 px-4 text-stone-600">{RATE_NOTES[c.id]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-xs text-stone-400 text-center">
              Tipos generales vigentes a modo de referencia. Cada país tiene tarifas especiales por sector;
              el importe válido es el de tu normativa y tu factura concreta.
            </p>
          </div>
        </div>
      </section>

      {/* MORE TOOLS */}
      <section className="py-16 sm:py-20 bg-stone-950 text-white">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3 text-orange-400 text-center">
            Herramientas en español
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-center">
            El IVA es solo el principio de tus cuentas
          </h2>
          <p className="mt-6 text-stone-300 leading-relaxed">
            Si estás cotizando un trabajo, la otra gran cifra es la vivienda: con la{" "}
            <strong className="text-white">calculadora de hipoteca</strong> obtienes la cuota mensual en
            euros o en dólares, con tabla de amortización anual. Y si necesitas datos de prueba para tus
            formularios y registros, el <strong className="text-white">generador de identidad falsa</strong>{" "}
            crea perfiles completos en español, sin límite diario.
          </p>
          <p className="mt-8 text-center text-sm text-stone-400">
            <Link href="/es/calculadora-de-hipoteca" className="font-semibold text-orange-400 hover:text-orange-300">
              Calculadora de hipoteca
            </Link>{" "}
            ·{" "}
            <Link href="/es/generador-de-identidad-falsa" className="font-semibold text-orange-400 hover:text-orange-300">
              Generador de identidad falsa
            </Link>{" "}
            ·{" "}
            <Link href="/tools" className="font-semibold text-orange-400 hover:text-orange-300">
              Todas las herramientas
            </Link>
          </p>
        </div>
      </section>

      {/* SERVICES CTA */}
      <section className="py-16 sm:py-20 bg-orange-50 dot-grid">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <SectionHead
            eyebrow="Hecho para ti"
            title="¿Quieres una herramienta como esta en tu propia web?"
            sub="WebStore Pro crea sitios rápidos de Desarrollo Web Full Stack y calculadoras a medida que posicionan: diseñadas, programadas y listas para SEO desde el primer día."
          />
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className={btnPrimary}>
              Pide tu presupuesto gratis <Icon name="arrow" className="w-5 h-5" />
            </Link>
            <a href="https://wa.me/923258774221" target="_blank" rel="noopener noreferrer" className={btnOutline}>
              WhatsApp +92 325 8774221
            </a>
          </div>
          <p className="mt-5 text-sm text-stone-500">
            ¿Prefieres correo? <a href="mailto:neilsonsmarry@gmail.com" className="font-semibold text-orange-700 hover:text-orange-800">neilsonsmarry@gmail.com</a>
            {" "}· O revisa nuestros <Link href="/services" className="font-semibold text-orange-700 hover:text-orange-800">servicios</Link> y <Link href="/tools" className="font-semibold text-orange-700 hover:text-orange-800">herramientas gratuitas</Link>.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHead eyebrow="Preguntas frecuentes" title="Dudas sobre el IVA, resueltas" />
          <div className="space-y-3">
            {FAQS.map(([q, a]) => (
              <details key={q} className="rounded-2xl border border-stone-200 bg-stone-50/60 open:bg-white open:shadow-md transition group">
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4 px-6 py-5 font-bold text-stone-900 [&::-webkit-details-marker]:hidden">
                  {q}
                  <span className="shrink-0 w-8 h-8 rounded-full bg-orange-100 text-orange-700 grid place-items-center group-open:rotate-45 transition-transform text-xl leading-none">+</span>
                </summary>
                <p className="px-6 pb-6 text-stone-600 leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
          <div className="text-center mt-10">
            <a href="#top" className={btnPrimary}>
              Calcular mi IVA <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
          <p className="mt-8 text-center text-xs text-stone-400">
            Esta calculadora es información general, no asesoría fiscal. Para tu caso concreto, consulta
            a un asesor o a la administración tributaria de tu país.
          </p>
        </div>
      </section>
    </>
  );
}
