import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import AguinaldoCalculator from "./AguinaldoCalculator";

export const metadata = {
  title: "Calculadora de Aguinaldo 2026 — México",
  description:
    "Calculadora de aguinaldo gratis para México: mínimo 15 días según la LFT, proporcional por días trabajados, pago antes del 20 de diciembre.",
  keywords: [
    "calculadora de aguinaldo",
    "aguinaldo 2026",
    "aguinaldo proporcional",
    "cuánto me toca de aguinaldo",
    "aguinaldo México",
    "15 días de aguinaldo",
  ],
  alternates: {
    canonical: "https://frinjo.me/es/calculadora-de-aguinaldo",
    languages: {
      es: "https://frinjo.me/es/calculadora-de-aguinaldo",
      "x-default": "https://frinjo.me/es/calculadora-de-aguinaldo",
    },
  },
  openGraph: {
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "WebStore Pro — Frinjo" }],
    title: "Calculadora de Aguinaldo 2026 — México, LFT | Frinjo",
    description:
      "Tu aguinaldo exacto: año completo o proporcional, por días trabajados o por fecha de ingreso. Gratis, con las reglas del artículo 87 de la LFT.",
    url: "https://frinjo.me/es/calculadora-de-aguinaldo",
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Calculadora de Aguinaldo",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/es/calculadora-de-aguinaldo",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "Calculadora de aguinaldo para México según el artículo 87 de la Ley Federal del Trabajo: aguinaldo anual mínimo equivalente a 15 días de salario, pagadero antes del 20 de diciembre. Salario diario = salario mensual ÷ 30. Año completo: aguinaldo = salario diario × días otorgados (mínimo 15). Parte proporcional: aguinaldo del año completo × días trabajados ÷ 365, también calculable desde la fecha de ingreso. Resultado bruto, antes de ISR. Todo el cálculo se realiza en el navegador; no se envía ni se guarda ningún dato.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Herramientas", item: "https://frinjo.me/es" },
    { "@type": "ListItem", position: 3, name: "Calculadora de Aguinaldo", item: "https://frinjo.me/es/calculadora-de-aguinaldo" },
  ],
};

const FAQS: [string, string][] = [
  [
    "¿Cuánto me toca de aguinaldo en 2026?",
    "Por ley (art. 87 de la LFT), el mínimo es 15 días de tu salario diario por un año completo de trabajo. El salario diario se obtiene dividiendo tu salario mensual entre 30. Ejemplo: con 12,000 mensuales, tu diario es 400 y tu aguinaldo de año completo es 400 × 15 = 6,000. Si tu empresa otorga más días (20, 30…), cambia el campo de días en la calculadora: el monto sube en la misma proporción.",
  ],
  [
    "¿Cómo se calcula el aguinaldo proporcional?",
    "Si no cumpliste el año, te toca la parte proporcional: aguinaldo de año completo × días trabajados ÷ 365. Ejemplo: entraste el 2 de julio (183 días trabajados al 31 de diciembre) con salario de 9,000 mensuales (300 diarios): año completo serían 4,500, y tu proporcional es 4,500 × 183 ÷ 365 = 2,256.16. La calculadora lo hace por días o directamente desde tu fecha de ingreso.",
  ],
  [
    "¿Cuándo deben pagar el aguinaldo?",
    "Antes del 20 de diciembre de cada año, según el artículo 87 de la Ley Federal del Trabajo. Algunas empresas lo adelantan al Buen Fin (noviembre) o lo dividen en dos partes, pero la fecha límite legal es el 20 de diciembre. Si no te lo pagan completo y a tiempo, puedes acudir a la PROFEDET (Procuraduría Federal de la Defensa del Trabajo), que asesora gratis.",
  ],
  [
    "¿El aguinaldo paga impuestos (ISR)?",
    "Parcialmente. El aguinaldo está exento de ISR hasta el equivalente a 30 días de salario mínimo (30 UMA); el excedente sí paga ISR, y la empresa lo retiene en el pago. Esta calculadora muestra el monto BRUTO, que es el que marca la ley: tu recibo puede variar según ese cálculo de ISR. Por eso dos personas con el mismo salario pueden recibir depósitos ligeramente distintos si una gana mucho más que la otra.",
  ],
  [
    "¿Me toca aguinaldo si renuncio o me despiden antes de diciembre?",
    "Sí. La parte proporcional del aguinaldo es un derecho adquirido día a día: si sales de la empresa en cualquier momento del año, ese proporcional debe incluirse en tu finiquito (renuncia) o en tu liquidación (despido). Calcúlalo con esta misma herramienta usando tus días trabajados, y compáralo con el desglose que te entregue la empresa antes de firmar.",
  ],
  [
    "¿Quiénes tienen derecho al aguinaldo?",
    "Todos los trabajadores regidos por la Ley Federal del Trabajo en México: de base, de confianza, eventuales, por obra determinada, comisionistas y vendedores, entre otros. No importa que no hayas cumplido el año: el proporcional también es obligatorio. Los trabajadores por honorarios (sin relación laboral subordinada) no están cubiertos por esta prestación.",
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

export default function CalculadoraAguinaldoPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Gratis · México · Ley Federal del Trabajo
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            Calculadora de <span className="text-gold-gradient">Aguinaldo</span>
          </h1>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-stone-800">
            Año completo o proporcional: tu monto exacto en segundos
          </p>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            El artículo 87 de la LFT garantiza un mínimo de <strong>15 días de salario</strong>, pagaderos
            antes del 20 de diciembre. Calcula el tuyo por días trabajados o desde tu fecha de ingreso.
          </p>
        </div>
      </section>

      <AguinaldoCalculator />

      <section className="py-16 sm:py-20 bg-white border-t border-stone-100">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead
            eyebrow="Cómo funciona"
            title="La fórmula del aguinaldo, paso a paso"
            sub="Tres operaciones. La calculadora las hace por ti, pero aquí está la lógica completa para que verifiques cualquier recibo."
          />
          <div className="grid gap-5 md:grid-cols-2 text-left">
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 mb-3">Paso 1</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Salario diario = mensual ÷ 30</h3>
              <p className="text-stone-600 leading-relaxed">
                La convención laboral mexicana divide el salario mensual entre 30 días. Con 12,000 al mes,
                tu salario diario es 400. Sobre ese diario se calcula todo lo demás.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 mb-3">Paso 2</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Año completo = diario × 15 días (mínimo)</h3>
              <p className="text-stone-600 leading-relaxed">
                400 × 15 = <strong>6,000</strong> de aguinaldo por el año completo. Es el mínimo legal: tu
                contrato o tu empresa pueden dar más días, nunca menos.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-600 mb-3">Paso 3</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Proporcional = año completo × días ÷ 365</h3>
              <p className="text-stone-600 leading-relaxed">
                Si trabajaste parte del año, el monto se prorratea. Medio año (183 días) con el ejemplo
                anterior: 6,000 × 183 ÷ 365 ≈ 3,008. Este proporcional también se paga en el finiquito si
                sales antes de diciembre.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-600 mb-3">La fecha</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Antes del 20 de diciembre, por ley</h3>
              <p className="text-stone-600 leading-relaxed">
                El pago fuera de tiempo o incompleto se puede reclamar ante la PROFEDET. Guarda tu recibo
                y compáralo con el monto bruto de esta calculadora (recuerda: el ISR puede retener una
                parte del excedente sobre 30 UMA).
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-stone-950 text-white">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3 text-orange-400 text-center">
            Herramientas en español
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-center">
            ¿Sales de la empresa? Tu aguinaldo va dentro del finiquito
          </h2>
          <p className="mt-6 text-stone-300 leading-relaxed">
            La <strong className="text-white">calculadora de finiquito</strong> suma este aguinaldo
            proporcional con tus salarios pendientes, tus vacaciones y la prima vacacional del 25%. Y para
            planear plazos y pagos, usa la <strong className="text-white">calculadora de días entre
            fechas</strong> con los días festivos oficiales de México ya incluidos.
          </p>
          <p className="mt-8 text-center text-sm text-stone-400">
            <Link href="/es/calculadora-de-finiquito" className="font-semibold text-orange-400 hover:text-orange-300">
              Calculadora de finiquito
            </Link>{" "}
            ·{" "}
            <Link href="/es/calculadora-de-dias-entre-fechas" className="font-semibold text-orange-400 hover:text-orange-300">
              Días entre fechas
            </Link>{" "}
            ·{" "}
            <Link href="/es/calculadora-de-prestamos" className="font-semibold text-orange-400 hover:text-orange-300">
              Calculadora de préstamos
            </Link>{" "}
            ·{" "}
            <Link href="/tools" className="font-semibold text-orange-400 hover:text-orange-300">
              Todas las herramientas
            </Link>
          </p>
        </div>
      </section>

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

      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHead eyebrow="Preguntas frecuentes" title="Dudas sobre el aguinaldo, resueltas" />
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
              Calcular mi aguinaldo <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
          <p className="mt-8 text-center text-xs text-stone-400">
            Información general según la LFT, no asesoría legal. Para tu caso concreto, la PROFEDET ofrece
            orientación gratuita.
          </p>
        </div>
      </section>
    </>
  );
}
