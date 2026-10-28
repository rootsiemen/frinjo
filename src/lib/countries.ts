/**
 * Country table for the Keyword Traffic Checker.
 *
 * Every ISO 3166-1 alpha-2 country is listed so a user can check a keyword
 * for ANY market — not just Pakistan. Per source:
 *  - `ddgKl`: DuckDuckGo's `kl` region code. DDG only publishes region codes
 *    for a subset of countries; where it is missing the DDG request is sent
 *    without a region and localization is carried by Bing (see below).
 *  - `bingMkt`: Bing's `setmkt` market. Bing only defines markets for a
 *    subset of countries; where it is missing the request still sends
 *    `cc=<code>`, which localizes results somewhat on its own.
 * Google Autocomplete takes `gl=<alpha-2 lowercase>` and Google Trends takes
 * `geo=<alpha-2>` for every country, so those need no per-country mapping.
 *  - `yahooHost`: Yahoo Search's regional host for the country (Yahoo is a
 *    late SERP fallback; it localizes by host, so countries without a
 *    regional Yahoo host simply skip that fallback — no fake localization).
 *  - `geoTargetId`: the country's Google Ads geo target constant id, used
 *    by the Keyword Planner volume lookup (see src/lib/keyword-check.ts).
 *    Only countries with a reliably known constant carry one; the rest
 *    return no exact volume rather than a guessed target.
 */
export interface Country {
  code: string; // ISO 3166-1 alpha-2, uppercase
  name: string;
  ddgKl?: string;
  bingMkt?: string;
  yahooHost?: string;
  geoTargetId?: number; // Google Ads geo target constant (Keyword Planner)
}

export const DEFAULT_COUNTRY_CODE = "PK";

export const COUNTRIES: Country[] = [
  { code: "AF", name: "Afghanistan" },
  { code: "AL", name: "Albania" },
  { code: "DZ", name: "Algeria" },
  { code: "AD", name: "Andorra" },
  { code: "AO", name: "Angola" },
  { code: "AI", name: "Anguilla" },
  { code: "AG", name: "Antigua and Barbuda" },
  { code: "AR", name: "Argentina", ddgKl: "ar-es", bingMkt: "es-AR", yahooHost: "ar.search.yahoo.com", geoTargetId: 2032 },
  { code: "AM", name: "Armenia" },
  { code: "AW", name: "Aruba" },
  { code: "AU", name: "Australia", ddgKl: "au-en", bingMkt: "en-AU", yahooHost: "au.search.yahoo.com", geoTargetId: 2036 },
  { code: "AT", name: "Austria", ddgKl: "at-de", bingMkt: "de-AT", geoTargetId: 2040 },
  { code: "AZ", name: "Azerbaijan" },
  { code: "BS", name: "Bahamas" },
  { code: "BH", name: "Bahrain" },
  { code: "BD", name: "Bangladesh", geoTargetId: 2050 },
  { code: "BB", name: "Barbados" },
  { code: "BY", name: "Belarus" },
  { code: "BE", name: "Belgium", ddgKl: "be-nl", bingMkt: "nl-BE", geoTargetId: 2056 },
  { code: "BZ", name: "Belize" },
  { code: "BJ", name: "Benin" },
  { code: "BM", name: "Bermuda" },
  { code: "BT", name: "Bhutan" },
  { code: "BO", name: "Bolivia" },
  { code: "BA", name: "Bosnia and Herzegovina" },
  { code: "BW", name: "Botswana" },
  { code: "BR", name: "Brazil", ddgKl: "br-pt", bingMkt: "pt-BR", yahooHost: "br.search.yahoo.com", geoTargetId: 2076 },
  { code: "IO", name: "British Indian Ocean Territory" },
  { code: "VG", name: "British Virgin Islands" },
  { code: "BN", name: "Brunei" },
  { code: "BG", name: "Bulgaria", ddgKl: "bg-bg" },
  { code: "BF", name: "Burkina Faso" },
  { code: "BI", name: "Burundi" },
  { code: "KH", name: "Cambodia" },
  { code: "CM", name: "Cameroon" },
  { code: "CA", name: "Canada", ddgKl: "ca-en", bingMkt: "en-CA", yahooHost: "ca.search.yahoo.com", geoTargetId: 2124 },
  { code: "CV", name: "Cape Verde" },
  { code: "KY", name: "Cayman Islands" },
  { code: "CF", name: "Central African Republic" },
  { code: "TD", name: "Chad" },
  { code: "CL", name: "Chile", ddgKl: "cl-es", bingMkt: "es-CL" },
  { code: "CN", name: "China", ddgKl: "cn-zh", bingMkt: "zh-CN", geoTargetId: 2156 },
  { code: "CO", name: "Colombia", ddgKl: "co-es", bingMkt: "es-CO" },
  { code: "KM", name: "Comoros" },
  { code: "CG", name: "Congo" },
  { code: "CD", name: "Congo (DRC)" },
  { code: "CR", name: "Costa Rica" },
  { code: "CI", name: "Côte d'Ivoire" },
  { code: "HR", name: "Croatia", ddgKl: "hr-hr" },
  { code: "CU", name: "Cuba" },
  { code: "CY", name: "Cyprus" },
  { code: "CZ", name: "Czechia", ddgKl: "cz-cs" },
  { code: "DK", name: "Denmark", ddgKl: "dk-da", bingMkt: "da-DK", geoTargetId: 2208 },
  { code: "DJ", name: "Djibouti" },
  { code: "DM", name: "Dominica" },
  { code: "DO", name: "Dominican Republic" },
  { code: "EC", name: "Ecuador" },
  { code: "EG", name: "Egypt", ddgKl: "eg-ar", bingMkt: "ar-EG", geoTargetId: 2818 },
  { code: "SV", name: "El Salvador" },
  { code: "GQ", name: "Equatorial Guinea" },
  { code: "ER", name: "Eritrea" },
  { code: "EE", name: "Estonia" },
  { code: "ET", name: "Ethiopia" },
  { code: "FJ", name: "Fiji" },
  { code: "FI", name: "Finland", ddgKl: "fi-fi", bingMkt: "fi-FI", geoTargetId: 2246 },
  { code: "FR", name: "France", ddgKl: "fr-fr", bingMkt: "fr-FR", yahooHost: "fr.search.yahoo.com", geoTargetId: 2250 },
  { code: "GA", name: "Gabon" },
  { code: "GM", name: "Gambia" },
  { code: "GE", name: "Georgia" },
  { code: "DE", name: "Germany", ddgKl: "de-de", bingMkt: "de-DE", yahooHost: "de.search.yahoo.com", geoTargetId: 2276 },
  { code: "GH", name: "Ghana" },
  { code: "GI", name: "Gibraltar" },
  { code: "GR", name: "Greece", ddgKl: "gr-el" },
  { code: "GD", name: "Grenada" },
  { code: "GT", name: "Guatemala" },
  { code: "GN", name: "Guinea" },
  { code: "GW", name: "Guinea-Bissau" },
  { code: "GY", name: "Guyana" },
  { code: "HT", name: "Haiti" },
  { code: "HN", name: "Honduras" },
  { code: "HK", name: "Hong Kong", ddgKl: "hk-tzh", bingMkt: "zh-HK", yahooHost: "hk.search.yahoo.com" },
  { code: "HU", name: "Hungary", ddgKl: "hu-hu" },
  { code: "IS", name: "Iceland" },
  { code: "IN", name: "India", ddgKl: "in-en", bingMkt: "en-IN", yahooHost: "in.search.yahoo.com", geoTargetId: 2356 },
  { code: "ID", name: "Indonesia", ddgKl: "id-en", bingMkt: "id-ID", yahooHost: "id.search.yahoo.com", geoTargetId: 2360 },
  { code: "IR", name: "Iran" },
  { code: "IQ", name: "Iraq" },
  { code: "IE", name: "Ireland", ddgKl: "ie-en", bingMkt: "en-IE", geoTargetId: 2372 },
  { code: "IL", name: "Israel", ddgKl: "il-en" },
  { code: "IT", name: "Italy", ddgKl: "it-it", bingMkt: "it-IT", yahooHost: "it.search.yahoo.com", geoTargetId: 2380 },
  { code: "JM", name: "Jamaica" },
  { code: "JP", name: "Japan", ddgKl: "jp-jp", bingMkt: "ja-JP", geoTargetId: 2392 },
  { code: "JO", name: "Jordan" },
  { code: "KZ", name: "Kazakhstan" },
  { code: "KE", name: "Kenya", geoTargetId: 2404 },
  { code: "KI", name: "Kiribati" },
  { code: "KW", name: "Kuwait", geoTargetId: 2414 },
  { code: "KG", name: "Kyrgyzstan" },
  { code: "LA", name: "Laos" },
  { code: "LV", name: "Latvia", ddgKl: "lv-lv" },
  { code: "LB", name: "Lebanon" },
  { code: "LS", name: "Lesotho" },
  { code: "LR", name: "Liberia" },
  { code: "LY", name: "Libya" },
  { code: "LI", name: "Liechtenstein" },
  { code: "LT", name: "Lithuania", ddgKl: "lt-lt" },
  { code: "LU", name: "Luxembourg" },
  { code: "MO", name: "Macao" },
  { code: "MG", name: "Madagascar" },
  { code: "MW", name: "Malawi" },
  { code: "MY", name: "Malaysia", ddgKl: "my-en", bingMkt: "ms-MY", yahooHost: "malaysia.search.yahoo.com", geoTargetId: 2458 },
  { code: "MV", name: "Maldives" },
  { code: "ML", name: "Mali" },
  { code: "MT", name: "Malta" },
  { code: "MR", name: "Mauritania" },
  { code: "MU", name: "Mauritius" },
  { code: "MX", name: "Mexico", ddgKl: "mx-es", bingMkt: "es-MX", yahooHost: "mx.search.yahoo.com", geoTargetId: 2484 },
  { code: "MD", name: "Moldova" },
  { code: "MC", name: "Monaco" },
  { code: "MN", name: "Mongolia" },
  { code: "ME", name: "Montenegro" },
  { code: "MA", name: "Morocco" },
  { code: "MZ", name: "Mozambique" },
  { code: "MM", name: "Myanmar" },
  { code: "NA", name: "Namibia" },
  { code: "NP", name: "Nepal", geoTargetId: 2524 },
  { code: "NL", name: "Netherlands", ddgKl: "nl-nl", bingMkt: "nl-NL", geoTargetId: 2528 },
  { code: "NZ", name: "New Zealand", ddgKl: "nz-en", bingMkt: "en-NZ", geoTargetId: 2554 },
  { code: "NI", name: "Nicaragua" },
  { code: "NE", name: "Niger" },
  { code: "NG", name: "Nigeria", geoTargetId: 2566 },
  { code: "KP", name: "North Korea" },
  { code: "MK", name: "North Macedonia" },
  { code: "NO", name: "Norway", ddgKl: "no-no", bingMkt: "nb-NO", geoTargetId: 2578 },
  { code: "OM", name: "Oman", geoTargetId: 2512 },
  { code: "PK", name: "Pakistan", ddgKl: "pk-en", geoTargetId: 2586 },
  { code: "PS", name: "Palestine" },
  { code: "PA", name: "Panama" },
  { code: "PG", name: "Papua New Guinea" },
  { code: "PY", name: "Paraguay" },
  { code: "PE", name: "Peru", ddgKl: "pe-es", bingMkt: "es-PE" },
  { code: "PH", name: "Philippines", ddgKl: "ph-en", bingMkt: "en-PH", yahooHost: "ph.search.yahoo.com", geoTargetId: 2608 },
  { code: "PL", name: "Poland", ddgKl: "pl-pl", bingMkt: "pl-PL", geoTargetId: 2616 },
  { code: "PT", name: "Portugal", ddgKl: "pt-pt", bingMkt: "pt-PT", geoTargetId: 2620 },
  { code: "QA", name: "Qatar", geoTargetId: 2634 },
  { code: "RO", name: "Romania", ddgKl: "ro-ro" },
  { code: "RU", name: "Russia", ddgKl: "ru-ru", bingMkt: "ru-RU" },
  { code: "RW", name: "Rwanda" },
  { code: "WS", name: "Samoa" },
  { code: "SA", name: "Saudi Arabia", ddgKl: "sa-ar", bingMkt: "ar-SA", geoTargetId: 2682 },
  { code: "SN", name: "Senegal" },
  { code: "RS", name: "Serbia" },
  { code: "SC", name: "Seychelles" },
  { code: "SL", name: "Sierra Leone" },
  { code: "SG", name: "Singapore", ddgKl: "sg-en", bingMkt: "en-SG", yahooHost: "sg.search.yahoo.com", geoTargetId: 2702 },
  { code: "SK", name: "Slovakia", ddgKl: "sk-sk" },
  { code: "SI", name: "Slovenia", ddgKl: "sl-sl" },
  { code: "SB", name: "Solomon Islands" },
  { code: "SO", name: "Somalia" },
  { code: "ZA", name: "South Africa", ddgKl: "za-en", bingMkt: "en-ZA", geoTargetId: 2710 },
  { code: "KR", name: "South Korea", ddgKl: "kr-kr", bingMkt: "ko-KR", geoTargetId: 2410 },
  { code: "SS", name: "South Sudan" },
  { code: "ES", name: "Spain", ddgKl: "es-es", bingMkt: "es-ES", yahooHost: "es.search.yahoo.com", geoTargetId: 2724 },
  { code: "LK", name: "Sri Lanka", geoTargetId: 2144 },
  { code: "SD", name: "Sudan" },
  { code: "SR", name: "Suriname" },
  { code: "SE", name: "Sweden", ddgKl: "se-sv", bingMkt: "sv-SE", geoTargetId: 2752 },
  { code: "CH", name: "Switzerland", ddgKl: "ch-de", bingMkt: "de-CH", geoTargetId: 2756 },
  { code: "SY", name: "Syria" },
  { code: "TW", name: "Taiwan", ddgKl: "tw-tzh", bingMkt: "zh-TW", yahooHost: "tw.search.yahoo.com" },
  { code: "TJ", name: "Tajikistan" },
  { code: "TZ", name: "Tanzania" },
  { code: "TH", name: "Thailand", ddgKl: "th-th", bingMkt: "th-TH" },
  { code: "TL", name: "Timor-Leste" },
  { code: "TG", name: "Togo" },
  { code: "TO", name: "Tonga" },
  { code: "TT", name: "Trinidad and Tobago" },
  { code: "TN", name: "Tunisia" },
  { code: "TR", name: "Türkiye", ddgKl: "tr-tr", bingMkt: "tr-TR", geoTargetId: 2792 },
  { code: "TM", name: "Turkmenistan" },
  { code: "UG", name: "Uganda" },
  { code: "UA", name: "Ukraine", ddgKl: "ua-uk" },
  { code: "AE", name: "United Arab Emirates", geoTargetId: 2784 },
  { code: "GB", name: "United Kingdom", ddgKl: "uk-en", bingMkt: "en-GB", yahooHost: "uk.search.yahoo.com", geoTargetId: 2826 },
  { code: "US", name: "United States", ddgKl: "us-en", bingMkt: "en-US", yahooHost: "search.yahoo.com", geoTargetId: 2840 },
  { code: "UY", name: "Uruguay" },
  { code: "VI", name: "U.S. Virgin Islands" },
  { code: "UZ", name: "Uzbekistan" },
  { code: "VU", name: "Vanuatu" },
  { code: "VA", name: "Vatican City" },
  { code: "VE", name: "Venezuela", ddgKl: "ve-es", bingMkt: "es-VE" },
  { code: "VN", name: "Vietnam", ddgKl: "vn-vi", bingMkt: "vi-VN" },
  { code: "YE", name: "Yemen" },
  { code: "ZM", name: "Zambia" },
  { code: "ZW", name: "Zimbabwe" },
];

const BY_CODE = new Map(COUNTRIES.map((c) => [c.code, c]));

export function resolveCountry(code: string | null | undefined): Country {
  if (code) {
    const found = BY_CODE.get(code.trim().toUpperCase());
    if (found) return found;
  }
  return BY_CODE.get(DEFAULT_COUNTRY_CODE)!;
}

export function isKnownCountry(code: string | null | undefined): boolean {
  return !!code && BY_CODE.has(code.trim().toUpperCase());
}
