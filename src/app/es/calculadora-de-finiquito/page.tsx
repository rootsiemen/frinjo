import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import FiniquitoCalculator from "./FiniquitoCalculator";

export const metadata = {
  title: "Calculadora de Finiquito 2026 — México",
  description:
    "Calculadora de finiquito gratis para México: salarios pendientes, aguinaldo proporcional, vacaciones y prima vacacional del 25%, concepto por concepto.",
  keywords: [
    "calculadora de finiquito",
    "finiquito México",
    "cuánto me toca de finiquito",
    "finiquito por renuncia",
    "prima vacacional finiquito",
    "vacaciones proporcionales",
  ],
  alternates: {
    canonical: "https://frinjo.me/es/calculadora-de-finiquito",
    languages: { es: "https://frinjo.me/es/calculadora-de-finiquito", en: "https://frinjo.me/tools" },
  },
  openGraph: {
    title: "Calculadora de Finiquito 2026 — México, LFT | Frinjo",
    description:
      "Tu finiquito desglosado: salarios pendientes + aguinaldo proporcional + vacaciones + prima vacacional del 25%. Gratis y con la tabla vigente de vacaciones.",
    url: "https://frinjo.me/es/calculadora-de-finiquito",
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Calculadora de Finiquito",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/es/calculadora-de-finiquito",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "Calculadora de finiquito para México según la Ley Federal del Trabajo. El finiquito (renuncia voluntaria o terminación por mutuo acuerdo) incluye: salarios devengados pendientes de pago, aguinaldo proporcional (mínimo 15 días al año, art. 87), vacaciones no gozadas y vacaciones proporcionales del año en curso según la tabla del art. 76 reformada por Vacaciones Dignas (año 1: 12 días, año 2: 14, año 3: 16, año 4: 18, año 5: 20, años 6–10: 22, y +2 días por cada 5 años adicionales), y la prima vacacional del 25 % sobre el monto de vacaciones (art. 80). Salario diario = salario mensual ÷ 30. No incluye los conceptos de la liquidación por despido injustificado (indemnización de 3 meses, art. 48 y 50, y prima de antigüedad), que son jurídicamente distintos. Resultado bruto, antes de ISR. Todo el cálculo se realiza en el navegador.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Herramientas", item: "https://frinjo.me/es" },
    { "@type": "ListItem", position: 3, name: "Calculadora de Finiquito", item: "https://frinjo.me/es/calculadora-de-finiquito" },
  ],
};

const FAQS: [string, string][] = [
  [
    "¿Qué incluye un finiquito en México?",
    "Cuatro bloques: (1) los salarios ya trabajados y aún no pagados hasta tu último día; (2) el aguinaldo proporcional del año en curso (mínimo 15 días al año, prorrateado por días trabajados); (3) las vacaciones que te corresponden y no tomaste —las de años anteriores completas y las proporcionales del año en curso, con la tabla de Vacaciones Dignas—; y (4) la prima vacacional del 25% sobre el monto total de vacaciones. Todo bruto: pueden aplicar retenciones de ISR e IMSS.",
  ],
  [
    "¿Cuál es la diferencia entre finiquito y liquidación?",
    "El finiquito se paga cuando la relación termina por renuncia del trabajador o por mutuo acuerdo: solo incluye las prestaciones ya devengadas (lo que esta calculadora suma). La liquidación aplica cuando la empresa te despide sin causa justificada: a los mismos conceptos se agregan la indemnización constitucional de 3 meses de salario, en ciertos casos 20 días por año trabajado, y la prima de antigüedad (12 días por año, con tope). Son figuras distintas y los montos no se deben mezclar.",
  ],
  [
    "¿Cuántos días de vacaciones me tocan al salir?",
    "Dos partes. Las de años anteriores que nunca tomaste se pagan completas. Las del año en curso se prorratean: días de la tabla según tu año de servicio × días trabajados del año ÷ 365. La tabla vigente (art. 76 LFT): año 1 = 12 días, 2 = 14, 3 = 16, 4 = 18, 5 = 20, años 6–10 = 22, 11–15 = 24, y sigue subiendo 2 días por cada 5 años. Sobre todo ese monto de vacaciones va la prima vacacional del 25%.",
  ],
  [
    "Ejemplo completo: ¿cuánto sería mi finiquito?",
    "Con salario de 12,000 mensuales (400 diarios), 1 año completo cumplido, 200 días trabajados del año en curso, 15 días de salario pendiente y ninguna vacación anterior sin tomar: salarios pendientes 6,000; aguinaldo proporcional 400 × 15 × 200 ÷ 365 = 3,287.67; vacaciones proporcionales (año de servicio 2 = 14 días): 400 × 14 × 200 ÷ 365 = 3,068.48; prima vacacional 25% = 767.12. Total bruto ≈ 13,123.27. Introduce tus números arriba y compara con el desglose de tu empresa.",
  ],
  [
    "¿Cuándo deben pagarme el finiquito?",
    "La LFT no fija un plazo único en días para el finiquito, pero debe pagarse al terminar la relación laboral; en la práctica muchas empresas lo entregan el último día o en la siguiente fecha de nómina. Si no te lo pagan, tienes hasta un año para reclamar las prestaciones ante el Centro de Conciliación Laboral o el tribunal. La PROFEDET asesora y representa gratis: guarda tu carta de renuncia, recibos de nómina y el desglose firmado.",
  ],
  [
    "¿Debo firmar el finiquito en cuanto me lo entreguen?",
    "No firmes a ciegas. Pide el desglose por concepto y compáralo con esta calculadora: salario diario (mensual ÷ 30), días pendientes, aguinaldo proporcional, vacaciones y prima del 25%. Las diferencias más comunes son usar un salario menor, olvidar vacaciones no gozadas o prorratear con 360 días en lugar de 365. Si el documento dice «finiquito total y completo» y el monto no coincide, pide la corrección antes de firmar o acude a la PROFEDET.",
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

export default function CalculadoraFiniquitoPage() {
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
            Calculadora de <span className="text-gold-gradient">Finiquito</span>
          </h1>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-stone-800">
            Lo que la empresa te debe al salir, concepto por concepto
          </p>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Salarios pendientes, aguinaldo proporcional, vacaciones con la tabla de{" "}
            <strong>Vacaciones Dignas</strong> y prima vacacional del 25%: el desglose completo para que
            verifiques el documento antes de firmar.
          </p>
        </div>
      </section>

      <FiniquitoCalculator />

      <section className="py-16 sm:py-20 bg-white border-t border-stone-100">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead
            eyebrow="Cómo funciona"
            title="Los cuatro bloques del finiquito"
            sub="Nada de indemnizaciones mezcladas: el finiquito paga solo lo ya devengado. Estos son sus componentes y su base legal."
          />
          <div className="grid gap-5 md:grid-cols-2 text-left">
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 mb-3">Bloque 1</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Salarios pendientes</h3>
              <p className="text-stone-600 leading-relaxed">
                Los días trabajados desde tu último pago hasta tu último día, a salario diario (mensual ÷
                30). Si te pagan por quincena y sales el día 15, son 15 días.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 mb-3">Bloque 2 · Art. 87</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Aguinaldo proporcional</h3>
              <p className="text-stone-600 leading-relaxed">
                Mínimo 15 días al año, prorrateados: diario × 15 × días trabajados del año ÷ 365. Es el
                mismo cálculo de la calculadora de aguinaldo, aplicado a tu fecha de salida.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-600 mb-3">Bloque 3 · Art. 76</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Vacaciones: tabla de Vacaciones Dignas</h3>
              <p className="text-stone-600 leading-relaxed">
                Año 1: 12 días; 2: 14; 3: 16; 4: 18; 5: 20; 6–10: 22; y +2 por cada 5 años. Se pagan las de
                años anteriores no tomadas (completas) más las proporcionales del año en curso.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-600 mb-3">Bloque 4 · Art. 80</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Prima vacacional del 25%</h3>
              <p className="text-stone-600 leading-relaxed">
                Sobre el monto total de vacaciones pagadas va un 25% adicional. Es el concepto que más se
                «olvida» en los desgloses: verifícalo siempre.
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
            Verifica cada número con su propia calculadora
          </h2>
          <p className="mt-6 text-stone-300 leading-relaxed">
            El aguinaldo proporcional tiene su propia herramienta —la{" "}
            <strong className="text-white">calculadora de aguinaldo</strong>— para contrastarlo por
            separado, y la <strong className="text-white">calculadora de días entre fechas</strong> te da
            los días exactos entre tu ingreso y tu salida, con los festivos oficiales de México.
          </p>
          <p className="mt-8 text-center text-sm text-stone-400">
            <Link href="/es/calculadora-de-aguinaldo" className="font-semibold text-orange-400 hover:text-orange-300">
              Calculadora de aguinaldo
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
          <SectionHead eyebrow="Preguntas frecuentes" title="Dudas sobre el finiquito, resueltas" />
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
              Calcular mi finiquito <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
          <p className="mt-8 text-center text-xs text-stone-400">
            Información general según la LFT, no asesoría legal. Para tu caso concreto, la PROFEDET ofrece
            orientación y representación gratuitas.
          </p>
        </div>
      </section>
    </>
  );
}
