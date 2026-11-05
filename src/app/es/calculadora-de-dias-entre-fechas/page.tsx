import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import DiasCalculator from "./DiasCalculator";

export const metadata = {
  title: "Días Entre Fechas — Días Hábiles con Festivos de México y España | Frinjo",
  description:
    "Calculadora de días entre fechas con días hábiles reales: descuenta fines de semana Y los días festivos oficiales de México (descansos obligatorios LFT, con los lunes de traslado) o de España. Duración total, semanas y lista de festivos. Gratis.",
  keywords: [
    "calculadora de días entre fechas",
    "días entre fechas",
    "días hábiles",
    "contar días entre dos fechas",
    "días laborables México",
    "días festivos oficiales",
  ],
  alternates: {
    canonical: "https://frinjo.me/es/calculadora-de-dias-entre-fechas",
    languages: { es: "https://frinjo.me/es/calculadora-de-dias-entre-fechas", fr: "https://frinjo.me/fr/jours-entre-deux-dates", en: "https://frinjo.me/days-between-dates-calculator" },
  },
  openGraph: {
    title: "Días Entre Fechas — Hábiles con Festivos Oficiales | Frinjo",
    description:
      "Días naturales, días hábiles y festivos del periodo con el calendario oficial de México o España. Gratis, sin registro.",
    url: "https://frinjo.me/es/calculadora-de-dias-entre-fechas",
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Calculadora de Días Entre Fechas",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/es/calculadora-de-dias-entre-fechas",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "Cálculo de días entre dos fechas con días hábiles reales: además de la duración natural y las semanas, descuenta los fines de semana y los días festivos oficiales. Calendario de México según el artículo 74 de la Ley Federal del Trabajo: Año Nuevo, primer lunes de febrero (Constitución), tercer lunes de marzo (Natalicio de Juárez), 1.º de mayo, 16 de septiembre, tercer lunes de noviembre (Revolución), 25 de diciembre y el 1.º de octubre cada seis años (transmisión del Poder Ejecutivo). Calendario de España con los festivos nacionales, incluido el Viernes Santo calculado desde la Pascua. Muestra la lista de festivos contenidos en el periodo. Cálculo realizado en el navegador.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Herramientas", item: "https://frinjo.me/es" },
    { "@type": "ListItem", position: 3, name: "Días Entre Fechas", item: "https://frinjo.me/es/calculadora-de-dias-entre-fechas" },
  ],
};

const FAQS: [string, string][] = [
  [
    "¿Qué es un día hábil y cómo se cuenta?",
    "Un día hábil (o laborable) es un día de lunes a viernes que no es festivo oficial. Contar días hábiles entre dos fechas exige recorrer el calendario día por día y descontar sábados, domingos y festivos: por eso un mes «de 30 días» suele tener solo 20–22 días hábiles. Esta calculadora hace ese recorrido con el calendario oficial que elijas y te muestra también qué festivos cayeron en el periodo.",
  ],
  [
    "¿Cuáles son los días de descanso obligatorio en México?",
    "Los del artículo 74 de la LFT: el 1.º de enero; el primer lunes de febrero (aniversario de la Constitución, 5 de febrero); el tercer lunes de marzo (natalicio de Benito Juárez, 21 de marzo); el 1.º de mayo; el 16 de septiembre; el tercer lunes de noviembre (aniversario de la Revolución, 20 de noviembre); el 25 de diciembre; y cada seis años el 1.º de octubre, por la transmisión del Poder Ejecutivo (2024, 2030…). La calculadora aplica los traslados al lunes automáticamente: en 2026 caen el 2 de febrero, el 16 de marzo y el 16 de noviembre.",
  ],
  [
    "¿Por qué otras calculadoras dan más días hábiles que esta?",
    "Porque la mayoría solo descuenta fines de semana y trata los festivos como días laborables. Si tu periodo incluye, por ejemplo, el 1.º de mayo o el 16 de septiembre entre semana, esas calculadoras lo cuentan como hábil y esta no. Para plazos legales, contratos y nóminas, el número correcto es el que descuenta los festivos oficiales — y aquí puedes ver la lista para verificarlo.",
  ],
  [
    "¿Cómo uso esto para un plazo en días hábiles?",
    "Pon como inicio la fecha desde la que corre el plazo (normalmente el día siguiente a la notificación o firma) y como fin la fecha límite que quieres comprobar: el contador de días hábiles te dice cuántos días laborables reales contiene ese tramo. Si necesitas llegar a un número exacto de días hábiles, mueve la fecha de fin hasta que el contador marque tu plazo. Ojo: cada ley o contrato define su propio punto de partida; verifica esa convención en tu documento.",
  ],
  [
    "¿El calendario de España incluye los festivos autonómicos?",
    "Incluye los festivos nacionales comunes (Año Nuevo, Reyes, Viernes Santo, 1.º de mayo, Asunción, Fiesta Nacional, Todos los Santos, Constitución, Inmaculada y Navidad). Cada comunidad autónoma y cada ayuntamiento añaden festivos propios (San José, Jueves Santo, fiestas locales…), que varían por ciudad: para un cálculo oficial en una localidad concreta, resta manualmente esos días del resultado o verifica el calendario laboral de tu comunidad.",
  ],
  [
    "¿La fecha de fin se incluye en el conteo?",
    "La duración total es la diferencia entre las dos fechas (fin − inicio), la forma estándar de responder «¿cuántos días hay entre…?»: del 1 al 8 de enero hay 7 días. Cada día del intervalo [inicio, fin) se clasifica una sola vez como hábil, fin de semana o festivo, así que los contadores siempre suman el total. Si tu caso cuenta ambos extremos (plazos «a partir del día siguiente» o estancias de hotel), ajusta las fechas un día según tu convención.",
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

export default function CalculadoraDiasEntreFechasPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Gratis · Festivos oficiales incluidos · Sin registro
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            Días Entre <span className="text-gold-gradient">Fechas</span>
          </h1>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-stone-800">
            Días hábiles de verdad: con los festivos de México o España
          </p>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Casi todas las calculadoras solo restan fines de semana. Esta descuenta también los{" "}
            <strong>días de descanso obligatorio</strong> de la LFT —con sus traslados al lunes— o los
            festivos nacionales de España, y te enseña la lista completa del periodo.
          </p>
        </div>
      </section>

      <DiasCalculator />

      <section className="py-16 sm:py-20 bg-white border-t border-stone-100">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead
            eyebrow="Cómo funciona"
            title="Cada día, clasificado una sola vez"
            sub="El motor recorre el intervalo día por día: natural, fin de semana o festivo oficial. De ahí salen los conteos, sin aproximaciones."
          />
          <div className="grid gap-5 md:grid-cols-2 text-left">
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 mb-3">Días hábiles</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Lunes a viernes, sin festivos</h3>
              <p className="text-stone-600 leading-relaxed">
                El número que usan los plazos legales, los contratos y las nóminas. Un festivo entre semana
                lo reduce; uno en fin de semana, no (ya estaba descontado).
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 mb-3">México · LFT art. 74</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Los «puentes» ya están en su lunes</h3>
              <p className="text-stone-600 leading-relaxed">
                Constitución, natalicio de Juárez y Revolución se descansan el lunes que marca la ley, no
                en su fecha histórica. El calendario los coloca ya trasladados, como los vive cualquier
                oficina en México.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-600 mb-3">España</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Festivos nacionales, Viernes Santo incluido</h3>
              <p className="text-stone-600 leading-relaxed">
                El Viernes Santo se calcula desde la Pascua de cada año (computus gregoriano), igual que
                los demás festivos móviles. Los autonómicos y locales se indican aparte en las preguntas
                frecuentes.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-600 mb-3">Transparencia</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">La lista de festivos, visible</h3>
              <p className="text-stone-600 leading-relaxed">
                Nada de cajas negras: la página lista cada festivo que cayó en tu periodo, con fecha y
                nombre, y el calendario completo del año. Si un número no te cuadra, puedes auditarlo día
                por día.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-stone-950 text-white">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3 text-orange-400 text-center">
            Herramientas en español y en francés
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-center">
            Plazos laborales y días de trabajo, en un solo lugar
          </h2>
          <p className="mt-6 text-stone-300 leading-relaxed">
            Con los días exactos entre tu ingreso y tu salida, calcula tu{" "}
            <strong className="text-white">aguinaldo proporcional</strong> y tu{" "}
            <strong className="text-white">finiquito</strong> completos. Y si tu plazo es en Francia, la
            versión francesa cuenta los <strong className="text-white">jours ouvrés</strong> con sus jours
            fériés.
          </p>
          <p className="mt-8 text-center text-sm text-stone-400">
            <Link href="/es/calculadora-de-aguinaldo" className="font-semibold text-orange-400 hover:text-orange-300">
              Calculadora de aguinaldo
            </Link>{" "}
            ·{" "}
            <Link href="/es/calculadora-de-finiquito" className="font-semibold text-orange-400 hover:text-orange-300">
              Calculadora de finiquito
            </Link>{" "}
            ·{" "}
            <Link href="/fr/jours-entre-deux-dates" className="font-semibold text-orange-400 hover:text-orange-300">
              Jours entre deux dates (FR)
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
          <SectionHead eyebrow="Preguntas frecuentes" title="Dudas sobre días hábiles y festivos" />
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
              Contar mis días <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
          <p className="mt-8 text-center text-xs text-stone-400">
            Información general: para un plazo legal concreto, verifica el punto de partida y la convención
            de conteo en la ley o el contrato que te aplique.
          </p>
        </div>
      </section>
    </>
  );
}
