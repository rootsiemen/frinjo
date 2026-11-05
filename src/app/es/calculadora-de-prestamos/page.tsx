import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import PrestamosCalculator from "./PrestamosCalculator";

export const metadata = {
  title: "Calculadora de Préstamos 2026 — Cuotas",
  description:
    "Calculadora de préstamos gratis: cuota mensual, intereses totales y amortización en 6 monedas ($, MXN, €, COP, ARS, PEN). Sin registro.",
  keywords: [
    "calculadora de préstamos",
    "calculadora de préstamo personal",
    "calcular cuota de préstamo",
    "simulador de préstamos",
    "tabla de amortización",
    "cuánto pago de interés",
  ],
  alternates: {
    canonical: "https://frinjo.me/es/calculadora-de-prestamos",
    languages: { es: "https://frinjo.me/es/calculadora-de-prestamos", fr: "https://frinjo.me/fr/calcul-tva", en: "https://frinjo.me/tools" },
  },
  openGraph: {
    title: "Calculadora de Préstamos 2026 — Cuota e Intereses Totales | Frinjo",
    description:
      "Calcula la cuota mensual de cualquier préstamo y cuánto pagas de intereses en total, con tabla de amortización anual. Gratis y sin registro.",
    url: "https://frinjo.me/es/calculadora-de-prestamos",
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Calculadora de Préstamos",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/es/calculadora-de-prestamos",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "Calculadora de préstamos personales gratuita con el sistema de amortización francés (cuota fija): cuota = capital × r(1+r)^n ÷ ((1+r)^n − 1), con r = tasa anual ÷ 100 ÷ 12 y n = número de meses. Muestra intereses totales, costo total del préstamo y tabla de amortización año por año. Monedas: dólares, pesos mexicanos, euros, pesos colombianos, pesos argentinos y soles. No incluye comisiones, seguros ni impuestos del contrato: para comparar ofertas, súmalos a la tasa. Todo el cálculo se realiza en el navegador; no se envía ni se guarda ningún dato.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Herramientas", item: "https://frinjo.me/es" },
    { "@type": "ListItem", position: 3, name: "Calculadora de Préstamos", item: "https://frinjo.me/es/calculadora-de-prestamos" },
  ],
};

const FAQS: [string, string][] = [
  [
    "¿Cómo se calcula la cuota mensual de un préstamo?",
    "Con el sistema francés (el más usado en préstamos personales): cuota = capital × r(1+r)^n ÷ ((1+r)^n − 1), donde r es la tasa mensual (tasa anual ÷ 100 ÷ 12) y n el número de meses. Ejemplo: 10,000 al 12% anual durante 12 meses → r = 0.01, cuota = 888.49. Al principio pagas más intereses que capital; al final, al revés, pero la cuota no cambia.",
  ],
  [
    "¿Qué diferencia hay entre un préstamo y una hipoteca?",
    "La mecánica es la misma —por eso esta calculadora comparte motor con la de hipotecas—, pero cambian el plazo, la tasa y la garantía: un préstamo personal dura meses o pocos años, no exige garantía y suele tener tasas más altas; una hipoteca dura décadas, está garantizada por la vivienda y tiene tasas menores. Para una vivienda usa la calculadora de hipoteca, que suma entrada, impuestos y seguros.",
  ],
  [
    "¿La tasa que debo introducir es la mensual o la anual?",
    "La anual, tal como aparece en la oferta o el contrato. En México los bancos publican la tasa anual y el CAT (Costo Anual Total); en España, la TIN y la TAE; en Colombia, la tasa efectiva anual (E.A.). Si quieres comparar el costo real entre dos bancos, usa la tasa que incluya comisiones (CAT o TAE): la cuota resultante se acerca mucho más a lo que pagarás de verdad.",
  ],
  [
    "¿Por qué alargar el plazo baja la cuota pero encarece el préstamo?",
    "Porque pagas intereses durante más meses sobre un saldo que baja más despacio. Ejemplo con 10,000 al 12%: a 12 meses la cuota es 888.49 y los intereses totales 661.85; a 36 meses la cuota baja a 332.14, pero los intereses suben a 1,957.15 —casi el triple—. La regla práctica: el plazo más corto que tu presupuesto aguante sin ahogarte.",
  ],
  [
    "¿Qué no incluye esta calculadora?",
    "Comisiones de apertura, seguros de vida o de desempleo, impuestos de timbre y gastos de estudio, que dependen de cada banco y país. Tampoco modela tasas variables: si tu préstamo es a tasa variable, el resultado es una foto con la tasa actual. Para decisiones importantes, pide siempre la tabla de amortización oficial del banco y compara el costo total, no solo la cuota.",
  ],
  [
    "¿Es gratis? ¿Se guardan mis datos?",
    "Sí, es gratis y sin registro. Todo se calcula en tu navegador: el monto y la tasa que introduces no salen de esta página ni quedan guardados.",
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

export default function CalculadoraPrestamosPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Gratis · Sin registro · 6 monedas
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            Calculadora de <span className="text-gold-gradient">Préstamos</span>
          </h1>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-stone-800">
            Tu cuota mensual y el interés real que vas a pagar
          </p>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Introduce el monto, la tasa anual y el plazo: obtienes la cuota fija, los{" "}
            <strong>intereses totales</strong> y la tabla de amortización año por año, en dólares, pesos o
            euros. Compara plazos antes de firmar.
          </p>
        </div>
      </section>

      <PrestamosCalculator />

      <section className="py-16 sm:py-20 bg-white border-t border-stone-100">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead
            eyebrow="Cómo funciona"
            title="La cuota fija, explicada sin humo"
            sub="El sistema francés reparte cada cuota entre intereses y capital: la cuota es la misma, la mezcla cambia mes a mes."
          />
          <div className="grid gap-5 md:grid-cols-2 text-left">
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 mb-3">La fórmula</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Cuota = P × r(1+r)ⁿ ÷ ((1+r)ⁿ − 1)</h3>
              <p className="text-stone-600 leading-relaxed">
                P es el capital, r la tasa mensual (anual ÷ 12 ÷ 100) y n los meses. Con 10,000 al 12% a
                12 meses, la cuota exacta es <strong>888.49</strong>: el primer mes pagas 100 de intereses
                y 788.49 de capital.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 mb-3">El plazo manda</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Más meses = menos cuota, más intereses</h3>
              <p className="text-stone-600 leading-relaxed">
                El mismo préstamo a 36 meses baja la cuota a 332.14, pero los intereses pasan de 661.85 a
                1,957.15. Prueba ambos plazos arriba y compara el <strong>costo total</strong>, no solo la
                cuota mensual.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-600 mb-3">Compara bien</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">CAT, TAE, E.A.: la tasa con todo dentro</h3>
              <p className="text-stone-600 leading-relaxed">
                Los bancos anuncian la tasa «limpia», pero cobran comisiones y seguros. Para comparar dos
                ofertas, introduce la tasa integral (CAT en México, TAE en España, efectiva anual en
                Colombia): la cuota se acerca al pago real.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-600 mb-3">Sin interés</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Tasa 0%: la cuota es monto ÷ meses</h3>
              <p className="text-stone-600 leading-relaxed">
                En compras a meses sin intereses, la cuota es simplemente el precio dividido entre el
                plazo. La calculadora lo maneja automáticamente cuando la tasa es cero.
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
            ¿El préstamo es para una casa? ¿O para tu negocio?
          </h2>
          <p className="mt-6 text-stone-300 leading-relaxed">
            Para vivienda, la <strong className="text-white">calculadora de hipoteca</strong> suma entrada,
            impuestos y seguros. Para facturar sin errores, la{" "}
            <strong className="text-white">calculadora de IVA</strong> arma tu factura línea por línea con
            el total en letra. Y si trabajas en México, calcula tu{" "}
            <strong className="text-white">aguinaldo</strong> y tu <strong className="text-white">finiquito</strong>{" "}
            con las reglas de la LFT.
          </p>
          <p className="mt-8 text-center text-sm text-stone-400">
            <Link href="/es/calculadora-de-hipoteca" className="font-semibold text-orange-400 hover:text-orange-300">
              Calculadora de hipoteca
            </Link>{" "}
            ·{" "}
            <Link href="/es/calculadora-de-iva" className="font-semibold text-orange-400 hover:text-orange-300">
              Calculadora de IVA
            </Link>{" "}
            ·{" "}
            <Link href="/es/calculadora-de-aguinaldo" className="font-semibold text-orange-400 hover:text-orange-300">
              Calculadora de aguinaldo
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
          <SectionHead eyebrow="Preguntas frecuentes" title="Dudas sobre préstamos, resueltas" />
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
              Calcular mi préstamo <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
          <p className="mt-8 text-center text-xs text-stone-400">
            Esta calculadora es información general, no asesoría financiera. Antes de contratar, pide la
            tabla de amortización oficial y el costo total por escrito a tu banco.
          </p>
        </div>
      </section>
    </>
  );
}
