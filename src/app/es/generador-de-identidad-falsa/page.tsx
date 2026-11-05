import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import IdentidadFalsa from "./IdentidadFalsa";

const SELF = "https://frinjo.me/es/generador-de-identidad-falsa";

export const metadata = {
  title: "Generador de Identidad Falsa Gratis",
  description:
    "Generador de identidad falsa gratis: datos de prueba completos para 7 países — nombre, dirección, teléfono y correo temporal que sí recibe mensajes.",
  keywords: ["generador de identidad falsa", "generador de nombres falsos", "nombres falsos", "datos de prueba", "generador de personas falsas", "identidad falsa para pruebas"],
  alternates: {
    canonical: SELF,
    languages: {
      es: "https://frinjo.me/es/generador-de-identidad-falsa",
      en: "https://frinjo.me/fake-name-generator",
      fr: "https://frinjo.me/fr/generateur-de-faux-nom",
      "x-default": "https://frinjo.me/fake-name-generator",
    },
  },
  openGraph: {
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "WebStore Pro — Frinjo" }],
    title: "Generador de Identidad Falsa — Identidades de Prueba Completas | Frinjo",
    description:
      "Nombre, dirección, teléfono, correo con bandeja real, fecha de nacimiento y profesión — 7 países hispanos, lotes de hasta 100, sin límites. Por WebStore Pro.",
    url: SELF,
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Generador de Identidad Falsa",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  url: SELF,
  inLanguage: "es",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "Genera identidades ficticias de prueba para España, México, Colombia, Argentina, Chile, Perú y Estados Unidos con datos hispanos. Cada identidad completa contiene un nombre y dos apellidos de pools hispanohablantes, una dirección con el tipo de vía y el formato propios de cada país (calle/avenida en España, colonia y código postal en México, carrera y barrio en Colombia, código postal argentino en Buenos Aires, comuna en Chile, distrito en Perú), un código postal dentro del rango real de la ciudad (Madrid 28xxx, Barcelona 08xxx, Valencia 46xxx, Sevilla 41xxx, Bogotá 11xxxx), un teléfono móvil en el formato nacional (+34 6XX, +52, +57 3XX, +54 9, +56 9, +51 9), un correo en dominios propios de correo temporal (abahi.tech, abahi.page, abahi.me — los dominios de tempmaill.tech, con bandeja pública consultable en la misma página que se borra en una hora), un usuario, una contraseña de 12 caracteres generada con aleatoriedad criptográfica (crypto.getRandomValues), una fecha de nacimiento entre 1958 y 2005 con la edad calculada, una profesión y una empresa con la forma societaria local (S.L., S.A. de C.V., S.A.S., SpA, S.A.C.). Lotes de 1 a 100 sin límite diario; exportación a CSV, JSON o TXT; modos de solo nombres (completos, nombre o apellidos). Todo se genera en el navegador del visitante: nada se transmite ni se almacena. Por diseño nunca genera números de documento de identidad (DNI/NIE), números fiscales ni números de tarjeta bancaria.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Herramientas", item: "https://frinjo.me/es" },
    { "@type": "ListItem", position: 3, name: "Generador de Identidad Falsa", item: SELF },
  ],
};

const FAQS: [string, string][] = [
  [
    "¿Las identidades generadas son personas reales?",
    "No. Cada identidad es una combinación aleatoria de nombres, apellidos, calles y ciudades frecuentes, así que no corresponde a ninguna persona real. Un nombre común junto a una ciudad real puede parecerse por casualidad a alguien, y por eso los correos viven en dominios de correo temporal con bandeja pública que se borra en una hora, y nunca se genera ningún número de documento.",
  ],
  [
    "¿Qué países están disponibles?",
    "Siete, cada uno con sus propios pools de nombres, formatos de dirección, teléfonos y rangos de código postal: España, México, Colombia, Argentina, Chile, Perú y Estados Unidos con datos hispanos (nombres y apellidos en español en ciudades como Miami, Houston o Los Ángeles). En España y América Latina el nombre completo incluye los dos apellidos, como en los documentos reales.",
  ],
  [
    "¿Cuántas identidades puedo generar? ¿Hay límite?",
    "Hasta 100 por clic, con todos los clics que quieras: no hay límite diario ni registro, a diferencia de generadores conocidos que limitan a los invitados. Puedes exportar cualquier lote como CSV, JSON o TXT para poblar bases de datos de desarrollo y crear datos de prueba.",
  ],
  [
    "¿Para qué puedo usar una identidad falsa?",
    "Para probar software y formularios, poblar bases de datos de desarrollo, maquetas y prototipos de diseño, capturas para documentación, ejemplos en clase y personajes de ficción. No debe usarse para suplantar a nadie, abrir cuentas reales ni enviar información falsa a sistemas oficiales: eso es fraude.",
  ],
  [
    "¿Los correos generados reciben mensajes de verdad?",
    "Sí, a propósito. Cada correo está en uno de nuestros dominios de Temp Mail (abahi.tech, abahi.page, abahi.me), así que un código de verificación o un mensaje de prueba enviado a esa dirección llega de verdad: cada tarjeta de identidad tiene un botón de bandeja y el correo se abre en esta misma página. Dos avisos: esa bandeja es pública (cualquiera que tenga la dirección puede leerla) y se borra en una hora, así que nunca uses una identidad generada para nada privado, financiero ni importante.",
  ],
  [
    "¿Se guarda o se envía algo a un servidor?",
    "No. La generación ocurre por completo en tu navegador con la Web Crypto API (crypto.getRandomValues), la misma aleatoriedad criptográfica que usa nuestro generador de contraseñas. Tus identidades nunca salen de tu dispositivo, salvo que tú mismo las descargues.",
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
  "rounded-3xl border border-stone-200 bg-white p-8 hover:shadow-xl hover:border-orange-200 transition block";

export default function GeneradorIdentidadFalsaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Herramienta gratuita · Sin límite diario · Exportación CSV / JSON
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            Generador de <span className="text-gold-gradient">Identidad Falsa</span>
          </h1>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            No solo nombres: la <strong>identidad de prueba completa</strong> — nombre con dos apellidos, dirección,
            teléfono, correo, usuario, contraseña, fecha de nacimiento, profesión y empresa, con los formatos reales de
            España, México, Colombia, Argentina, Chile, Perú y Estados Unidos hispano. Hasta 100 por lote y sin límite
            diario: ideal para probar formularios, poblar bases de datos y diseñar maquetas.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-2.5 text-sm font-semibold text-stone-600">
            {["Identidad completa, no solo nombres", "7 países hispanos", "Hasta 100 por lote", "Sin DNI / sin tarjetas — nunca"].map((chip) => (
              <span key={chip} className="rounded-full bg-white border border-stone-200 px-4 py-2">{chip}</span>
            ))}
          </div>
        </div>
      </section>

      <IdentidadFalsa />

      <section className="py-16 sm:py-20 bg-white border-t border-stone-100">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead
            eyebrow="Seguir explorando"
            title="Más herramientas en español"
            sub="Calculadoras y generadores gratuitos de Frinjo en español, sin registro y sin límites."
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4 text-left">
            <Link href="/es/calculadora-de-iva" className={card}>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-2">Calculadora de IVA</h3>
              <p className="text-stone-600 leading-relaxed">Añade o quita el IVA con los tipos de España, México, Colombia y más países, línea por línea.</p>
            </Link>
            <Link href="/es/calculadora-de-hipoteca" className={card}>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-2">Calculadora de Hipoteca</h3>
              <p className="text-stone-600 leading-relaxed">Cuota mensual, intereses totales y tabla de amortización para España y América.</p>
            </Link>
            <Link href="/fake-name-generator" className={card}>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-2">Versión en inglés</h3>
              <p className="text-stone-600 leading-relaxed">El generador original con datos de EE. UU., Reino Unido, Canadá, Australia y Pakistán.</p>
            </Link>
            <Link href="/tools" className={card}>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-2">Todas las herramientas</h3>
              <p className="text-stone-600 leading-relaxed">Más de 25 calculadoras y generadores gratuitos en el centro de herramientas de Frinjo.</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-orange-50 dot-grid">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <SectionHead
            eyebrow="WebStore Pro"
            title="¿Necesitas datos de prueba… o un sitio web completo?"
            sub="Creamos sitios web Full Stack y herramientas como esta para empresas y creadores: desarrollo web completo, rápido y listo para SEO desde el primer día."
          />
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className={btnPrimary}>
              Pedir presupuesto gratis <Icon name="arrow" className="w-5 h-5" />
            </Link>
            <a href="https://wa.me/923258774221" target="_blank" rel="noopener noreferrer" className={btnOutline}>
              WhatsApp +92 325 8774221
            </a>
          </div>
          <p className="mt-5 text-sm text-stone-500">
            ¿Prefieres correo? <a href="mailto:neilsonsmarry@gmail.com" className="font-semibold text-orange-700 hover:text-orange-800">neilsonsmarry@gmail.com</a>
            {" "}· Más herramientas gratuitas: <Link href="/tools" className="font-semibold text-orange-700 hover:text-orange-800">todas las calculadoras y herramientas</Link>.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHead eyebrow="Preguntas frecuentes" title="Dudas sobre el generador, resueltas" />
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
              Generar identidades <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
