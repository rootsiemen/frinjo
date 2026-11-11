import type { MetadataRoute } from "next";
import { getDb, mapBlogPost } from "@/lib/db";
import { SERVICES } from "@/lib/content";
import { REPO_POSTS } from "@/lib/repo-posts";

const SITE_URL = "https://frinjo.me";

export const dynamic = "force-dynamic";

/** Hreflang clusters for pages with true language equivalents (mirrors the
 *  alternates.languages metadata on those pages). */
const LANG_ALTERNATES: Record<string, Record<string, string>> = {
  [`${SITE_URL}/tools`]: { en: `${SITE_URL}/tools`, es: `${SITE_URL}/es`, fr: `${SITE_URL}/fr`, "x-default": `${SITE_URL}/tools` },
  [`${SITE_URL}/es`]: { es: `${SITE_URL}/es`, fr: `${SITE_URL}/fr`, en: `${SITE_URL}/tools`, "x-default": `${SITE_URL}/tools` },
  [`${SITE_URL}/fr`]: { fr: `${SITE_URL}/fr`, es: `${SITE_URL}/es`, en: `${SITE_URL}/tools`, "x-default": `${SITE_URL}/tools` },
  [`${SITE_URL}/bmi-calculator`]: { en: `${SITE_URL}/bmi-calculator`, fr: `${SITE_URL}/fr/calcul-imc`, "x-default": `${SITE_URL}/bmi-calculator` },
  [`${SITE_URL}/fr/calcul-imc`]: { fr: `${SITE_URL}/fr/calcul-imc`, en: `${SITE_URL}/bmi-calculator`, "x-default": `${SITE_URL}/bmi-calculator` },
  [`${SITE_URL}/fake-name-generator`]: { en: `${SITE_URL}/fake-name-generator`, es: `${SITE_URL}/es/generador-de-identidad-falsa`, fr: `${SITE_URL}/fr/generateur-de-faux-nom`, "x-default": `${SITE_URL}/fake-name-generator` },
  [`${SITE_URL}/es/generador-de-identidad-falsa`]: { es: `${SITE_URL}/es/generador-de-identidad-falsa`, en: `${SITE_URL}/fake-name-generator`, fr: `${SITE_URL}/fr/generateur-de-faux-nom`, "x-default": `${SITE_URL}/fake-name-generator` },
  [`${SITE_URL}/fr/generateur-de-faux-nom`]: { fr: `${SITE_URL}/fr/generateur-de-faux-nom`, en: `${SITE_URL}/fake-name-generator`, es: `${SITE_URL}/es/generador-de-identidad-falsa`, "x-default": `${SITE_URL}/fake-name-generator` },
  [`${SITE_URL}/days-between-dates-calculator`]: { en: `${SITE_URL}/days-between-dates-calculator`, es: `${SITE_URL}/es/calculadora-de-dias-entre-fechas`, fr: `${SITE_URL}/fr/jours-entre-deux-dates`, "x-default": `${SITE_URL}/days-between-dates-calculator` },
  [`${SITE_URL}/es/calculadora-de-dias-entre-fechas`]: { es: `${SITE_URL}/es/calculadora-de-dias-entre-fechas`, fr: `${SITE_URL}/fr/jours-entre-deux-dates`, en: `${SITE_URL}/days-between-dates-calculator`, "x-default": `${SITE_URL}/days-between-dates-calculator` },
  [`${SITE_URL}/fr/jours-entre-deux-dates`]: { fr: `${SITE_URL}/fr/jours-entre-deux-dates`, es: `${SITE_URL}/es/calculadora-de-dias-entre-fechas`, en: `${SITE_URL}/days-between-dates-calculator`, "x-default": `${SITE_URL}/days-between-dates-calculator` },
  [`${SITE_URL}/es/calculadora-de-iva`]: { es: `${SITE_URL}/es/calculadora-de-iva`, fr: `${SITE_URL}/fr/calcul-tva`, "x-default": `${SITE_URL}/es/calculadora-de-iva` },
  [`${SITE_URL}/fr/calcul-tva`]: { fr: `${SITE_URL}/fr/calcul-tva`, es: `${SITE_URL}/es/calculadora-de-iva`, "x-default": `${SITE_URL}/es/calculadora-de-iva` },
  [`${SITE_URL}/es/generador-de-codigos-qr`]: { es: `${SITE_URL}/es/generador-de-codigos-qr`, fr: `${SITE_URL}/fr/generateur-de-qr-code`, "x-default": `${SITE_URL}/es/generador-de-codigos-qr` },
  [`${SITE_URL}/fr/generateur-de-qr-code`]: { fr: `${SITE_URL}/fr/generateur-de-qr-code`, es: `${SITE_URL}/es/generador-de-codigos-qr`, "x-default": `${SITE_URL}/es/generador-de-codigos-qr` },
  [`${SITE_URL}/personal-loan-calculator`]: { en: `${SITE_URL}/personal-loan-calculator`, es: `${SITE_URL}/es/calculadora-de-prestamos`, "x-default": `${SITE_URL}/personal-loan-calculator` },
  [`${SITE_URL}/es/calculadora-de-prestamos`]: { es: `${SITE_URL}/es/calculadora-de-prestamos`, en: `${SITE_URL}/personal-loan-calculator`, "x-default": `${SITE_URL}/personal-loan-calculator` },
  [`${SITE_URL}/compound-interest-calculator`]: { en: `${SITE_URL}/compound-interest-calculator`, fr: `${SITE_URL}/fr/interets-composes`, "x-default": `${SITE_URL}/compound-interest-calculator` },
  [`${SITE_URL}/fr/interets-composes`]: { fr: `${SITE_URL}/fr/interets-composes`, en: `${SITE_URL}/compound-interest-calculator`, "x-default": `${SITE_URL}/compound-interest-calculator` },
  [`${SITE_URL}/es/calculadora-de-aguinaldo`]: { es: `${SITE_URL}/es/calculadora-de-aguinaldo`, "x-default": `${SITE_URL}/es/calculadora-de-aguinaldo` },
  [`${SITE_URL}/es/calculadora-de-finiquito`]: { es: `${SITE_URL}/es/calculadora-de-finiquito`, "x-default": `${SITE_URL}/es/calculadora-de-finiquito` },
  [`${SITE_URL}/es/calculadora-de-hipoteca`]: { es: `${SITE_URL}/es/calculadora-de-hipoteca`, "x-default": `${SITE_URL}/es/calculadora-de-hipoteca` },
  [`${SITE_URL}/fr/frais-de-notaire`]: { fr: `${SITE_URL}/fr/frais-de-notaire`, "x-default": `${SITE_URL}/fr/frais-de-notaire` },
  [`${SITE_URL}/fr/salaire-brut-en-net`]: { fr: `${SITE_URL}/fr/salaire-brut-en-net`, "x-default": `${SITE_URL}/fr/salaire-brut-en-net` },
};

/** Blog slugs whose canonical is consolidated onto another post (see
 *  CANONICAL_OVERRIDES in blog/[slug]) — they must not appear in the sitemap. */
const SITEMAP_EXCLUDED_SLUGS = new Set(["how-much-does-a-website-cost-in-pakistan-2026-price-guide"]);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/automations`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/seo-agent-kit`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/botview`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/tools`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/keyword-traffic-checker`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/adsense-low-value-content-checker`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/ip-address-tracker`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/sun-moon-rising-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/love-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/bmi-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/countdown-timer`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/countdown-timer/1-minute-timer`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/countdown-timer/2-minute-timer`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/countdown-timer/3-minute-timer`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/countdown-timer/5-minute-timer`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/countdown-timer/10-minute-timer`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/countdown-timer/15-minute-timer`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/countdown-timer/20-minute-timer`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/countdown-timer/25-minute-timer`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/countdown-timer/30-minute-timer`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/countdown-timer/45-minute-timer`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/countdown-timer/60-minute-timer`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/word-counter`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/gpa-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/weighted-grade-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/test-score-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/age-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/concrete-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/zodiac-sign-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/random-number-generator`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/coin-flip`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/mulch-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/fake-name-generator`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/es`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/es/calculadora-de-iva`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/es/generador-de-identidad-falsa`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/es/calculadora-de-hipoteca`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/es/calculadora-de-prestamos`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/es/calculadora-de-aguinaldo`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/es/calculadora-de-finiquito`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/es/calculadora-de-dias-entre-fechas`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/es/generador-de-codigos-qr`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/fr`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/fr/salaire-brut-en-net`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/fr/generateur-de-faux-nom`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/fr/calcul-imc`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/fr/calcul-tva`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/fr/frais-de-notaire`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/fr/jours-entre-deux-dates`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/fr/interets-composes`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/fr/generateur-de-qr-code`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/smm-panel`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/password-generator`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/case-converter`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/time-duration-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/epoch-converter`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/uuid-generator`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/base64-encoder-decoder`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/dice-roller`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/board-foot-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/water-intake-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/calorie-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/ovulation-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/period-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/body-fat-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/running-pace-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/percentage-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/tip-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/discount-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/final-grade-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/hourly-to-salary-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/hourly-to-salary-calculator/12-an-hour-is-how-much-a-year`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/hourly-to-salary-calculator/14-an-hour-is-how-much-a-year`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/hourly-to-salary-calculator/15-an-hour-is-how-much-a-year`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/hourly-to-salary-calculator/16-an-hour-is-how-much-a-year`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/hourly-to-salary-calculator/17-an-hour-is-how-much-a-year`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/hourly-to-salary-calculator/18-an-hour-is-how-much-a-year`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/hourly-to-salary-calculator/19-an-hour-is-how-much-a-year`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/hourly-to-salary-calculator/20-an-hour-is-how-much-a-year`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/hourly-to-salary-calculator/21-an-hour-is-how-much-a-year`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/hourly-to-salary-calculator/22-an-hour-is-how-much-a-year`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/hourly-to-salary-calculator/23-an-hour-is-how-much-a-year`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/hourly-to-salary-calculator/24-an-hour-is-how-much-a-year`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/hourly-to-salary-calculator/25-an-hour-is-how-much-a-year`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/hourly-to-salary-calculator/26-an-hour-is-how-much-a-year`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/hourly-to-salary-calculator/27-an-hour-is-how-much-a-year`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/hourly-to-salary-calculator/28-an-hour-is-how-much-a-year`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/hourly-to-salary-calculator/29-an-hour-is-how-much-a-year`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/hourly-to-salary-calculator/30-an-hour-is-how-much-a-year`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/hourly-to-salary-calculator/31-an-hour-is-how-much-a-year`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/hourly-to-salary-calculator/32-an-hour-is-how-much-a-year`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/hourly-to-salary-calculator/33-an-hour-is-how-much-a-year`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/hourly-to-salary-calculator/34-an-hour-is-how-much-a-year`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/hourly-to-salary-calculator/35-an-hour-is-how-much-a-year`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/hourly-to-salary-calculator/36-an-hour-is-how-much-a-year`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/hourly-to-salary-calculator/38-an-hour-is-how-much-a-year`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/hourly-to-salary-calculator/40-an-hour-is-how-much-a-year`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/hourly-to-salary-calculator/42-an-hour-is-how-much-a-year`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/hourly-to-salary-calculator/45-an-hour-is-how-much-a-year`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/hourly-to-salary-calculator/48-an-hour-is-how-much-a-year`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/hourly-to-salary-calculator/50-an-hour-is-how-much-a-year`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/hourly-to-salary-calculator/55-an-hour-is-how-much-a-year`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/hourly-to-salary-calculator/60-an-hour-is-how-much-a-year`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/hourly-to-salary-calculator/65-an-hour-is-how-much-a-year`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/hourly-to-salary-calculator/70-an-hour-is-how-much-a-year`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/hourly-to-salary-calculator/75-an-hour-is-how-much-a-year`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/hourly-to-salary-calculator/80-an-hour-is-how-much-a-year`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/hourly-to-salary-calculator/90-an-hour-is-how-much-a-year`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/hourly-to-salary-calculator/100-an-hour-is-how-much-a-year`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/days-between-dates-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/home-affordability-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/dti-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/mortgage-payoff-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/amortization-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/loan-payoff-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/debt-consolidation-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/credit-card-payoff-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/personal-loan-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/life-insurance-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/car-insurance-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/compound-interest-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/square-feet-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/salary-tax-calculator-pakistan`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/pta-tax-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/zakat-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/uk-take-home-pay-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/ir35-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/umbrella-vs-limited-company`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/h1b-lottery-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/visa-bulletin`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/f1-visa-interview-questions`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/portfolio`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = SERVICES.map((s) => ({
    url: `${SITE_URL}/services/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const db = await getDb();
    const rows = await db.prepare("SELECT * FROM blog_posts WHERE status = 'published'").all();
    const slugs = new Set(rows.map(mapBlogPost).map((p) => p.slug));
    const dbRoutes = rows.map(mapBlogPost).filter((p) => !SITEMAP_EXCLUDED_SLUGS.has(p.slug)).map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: new Date(p.createdAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
    // Repo-shipped posts (git-push publishing).
    const repoRoutes = REPO_POSTS.filter((p) => !slugs.has(p.slug) && !SITEMAP_EXCLUDED_SLUGS.has(p.slug)).map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: new Date(p.createdAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
    blogRoutes = [...dbRoutes, ...repoRoutes];
  } catch {
    // DB unavailable at build time — blog URLs fall back to the /blog index.
  }

  const withAlternates = (entry: MetadataRoute.Sitemap[number]) =>
    LANG_ALTERNATES[entry.url] ? { ...entry, alternates: { languages: LANG_ALTERNATES[entry.url] } } : entry;

  return [...staticRoutes.map(withAlternates), ...serviceRoutes, ...blogRoutes];
}
