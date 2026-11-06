import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";

export const metadata = {
  title: "Free Tools — Calculators & Checkers",
  description:
    "100+ free online tools: SEO checkers (BotView, Keyword Traffic Checker), calculators, generators and the IP Address Tracker. Free, no sign-up.",
  alternates: {
    canonical: "https://frinjo.me/tools",
    languages: {
      en: "https://frinjo.me/tools",
      es: "https://frinjo.me/es",
      fr: "https://frinjo.me/fr",
      "x-default": "https://frinjo.me/tools",
    },
  },
  openGraph: {
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "WebStore Pro — Frinjo" }],
    title: "Free Tools | WebStore Pro",
    description:
      "BotView, Keyword Traffic Checker, IP Address Tracker, SEO Agent Kit, Temp Mail and PlayZone — every free WebStore Pro tool, in one hub.",
    url: "https://frinjo.me/tools",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Tools — Calculators & Checkers | WebStore Pro",
    description:
      "100+ free online tools: SEO checkers (BotView, Keyword Traffic Checker), calculators, generators and the IP Address Tracker. Free, no sign-up.",
    images: ["/og-default.jpg"],
  },
};

interface Tool {
  name: string;
  href: string;
  external?: boolean;
  tag: string;
  desc: string;
}

const TOOLS: Tool[] = [
  {
    name: "BotView",
    href: "/botview",
    tag: "SEO · AEO · GEO",
    desc: "Paste any URL and get SEO, AEO and GEO (AI visibility) scores out of 100 — every failing check and its fix, free.",
  },
  {
    name: "Keyword Traffic Checker",
    href: "/keyword-traffic-checker",
    tag: "Keyword research",
    desc: "Enter a keyword and get a live SERP competition report, a difficulty score with its full breakdown, demand signals and related long-tail keywords.",
  },
  {
    name: "IP Address Tracker",
    href: "/ip-address-tracker",
    tag: "Privacy · Network",
    desc: "See what your connection reveals: your IP address, location and ISP, plus an anonymity score from six live leak checks (WebRTC, DNS, timezone and more) — and track any other IP the same way.",
  },
  {
    name: "SEO Agent Kit",
    href: "/seo-agent-kit",
    tag: "Open source",
    desc: "The open-source SEO toolkit behind this site: 8 workflow modules for technical audits, AI visibility, schema, content clusters and more.",
  },
  {
    name: "Word Counter",
    href: "/word-counter",
    tag: "Writing · SEO",
    desc: "Words, characters, sentences and unique words — plus selection-only counting, adjustable reading/speaking times, real Flesch readability, top-word density with CSV export, and .txt file loading.",
  },
  {
    name: "GPA Calculator",
    href: "/gpa-calculator",
    tag: "School · College",
    desc: "Semester and cumulative GPA with letter or % grades, weighted 5.0 scale with Honors/AP bonuses, courses that auto-save in your browser, CSV export, standing label and a target-GPA planner.",
  },
  {
    name: "Weighted Grade Calculator",
    href: "/weighted-grade-calculator",
    tag: "School · Courses",
    desc: "Course grade by category — grades entered as percentages OR raw points (45/50 works as-is), extra credit, secured-points tracking, and the average you still need for 90/80/70/60.",
  },
  {
    name: "Test Score Calculator (EZ Grader)",
    href: "/test-score-calculator",
    tag: "School · Teachers",
    desc: "Number wrong → percentage and letter grade with half-points and two scales, the full grading chart — and a class mode that grades a whole pasted roster with average, median, distribution and CSV export.",
  },
  {
    name: "Age Calculator",
    href: "/age-calculator",
    tag: "Dates · Fun facts",
    desc: "Exact age with optional time of birth, a live ticking seconds counter, next-birthday countdown, half birthday, generation, a Chinese zodiac that uses the real Lunar New Year, and an age-difference tool.",
  },
  {
    name: "Concrete Calculator",
    href: "/concrete-calculator",
    tag: "DIY · Construction",
    desc: "Slabs, round pours and post holes combined in one total: cubic yards, 40/50/60/80 lb bags, pallets, mixing water, a bagged-vs-ready-mix cost verdict and a copyable shopping list.",
  },
  {
    name: "Zodiac Sign Calculator",
    href: "/zodiac-sign-calculator",
    tag: "Astrology · Fun",
    desc: "Your sign by birth date — instantly, with element, ruling planet, traits, best matches, a correct Chinese zodiac, and an honest cusp warning for boundary birthdays.",
  },
  {
    name: "Random Number Generator",
    href: "/random-number-generator",
    tag: "Random · Games",
    desc: "Up to 1,000 numbers at once, duplicate-free mode, copy-all and download — plus lottery quick picks for Powerball, Mega Millions, EuroMillions, UK Lotto and Cash4Life.",
  },
  {
    name: "Coin Flip",
    href: "/coin-flip",
    tag: "Random · Decisions",
    desc: "Flip 1–3 coins at once, name the sides to decide anything, race best-of formats, flip batches of 10/100/1,000 with percentages, and keep a saved history. Crypto-fair 50/50.",
  },
  {
    name: "Mulch Calculator",
    href: "/mulch-calculator",
    tag: "Garden · DIY",
    desc: "Multiple beds of any shape measured properly: cubic yards, bags in 1.5/2/3 cu ft, total weight by mulch type, bags-vs-bulk verdict and a copyable shopping list.",
  },
  {
    name: "Fake Name Generator",
    href: "/fake-name-generator",
    tag: "Generator · Testing",
    desc: "Generate full fake identities for the US, UK, Canada, Australia and Pakistan — name, address, phone, email, username, password, birthday, job and company — up to 100 at once with CSV/JSON export, or names only. No daily limit, all in your browser.",
  },
  {
    name: "Herramientas en Español",
    href: "/es",
    tag: "Español · IVA · Hipoteca",
    desc: "Free tools in Spanish: a multi-country IVA (VAT) calculator for Spain and Latin America with invoices and totals in words, a fake identity generator with local data and working temp email, and a mortgage calculator in euros and dollars.",
  },
  {
    name: "Outils en Français",
    href: "/fr",
    tag: "Français · Salaire · IMC",
    desc: "Free tools in French: a salaire brut en net converter (cadre, non-cadre, fonction publique, after income tax), a générateur de faux nom with local French, Belgian, Swiss and Québec data, and a calcul IMC on the WHO scale.",
  },
  {
    name: "SMM Panel",
    href: "/smm-panel",
    tag: "SMM · Growth Service",
    desc: "WebStore Pro's social media panel: Instagram, YouTube, TikTok, Facebook, X and Telegram followers, views, likes and subscribers with wallet balance, transparent per-1,000 rates and live order tracking. Funds via Binance, Payoneer, JazzCash or Easypaisa.",
  },
  {
    name: "Password Generator",
    href: "/password-generator",
    tag: "Security · Privacy",
    desc: "Strong passwords from your browser's cryptographic random source — length and character sets you control, look-alike characters excluded, real entropy shown in bits. Nothing is ever sent or stored.",
  },
  {
    name: "Case Converter",
    href: "/case-converter",
    tag: "Text · Writing",
    desc: "Sixteen instant conversions: Title Case, UPPER, Sentence case, camelCase, snake_case, kebab-case URL slugs and more — everything runs in your browser, nothing is uploaded.",
  },
  {
    name: "Time Duration Calculator",
    href: "/time-duration-calculator",
    tag: "Time · Payroll",
    desc: "The exact duration between two dates and times in hours, minutes and seconds — plus decimal hours for timesheets, and add/subtract hours and minutes.",
  },
  {
    name: "Dice Roller",
    href: "/dice-roller",
    tag: "Games · RPG",
    desc: "Roll up to 10 dice at once — d4 through d100 — with pip-face visuals, totals, averages, expected values and a roll history. Fair crypto-grade randomness.",
  },
  {
    name: "Board Foot Calculator",
    href: "/board-foot-calculator",
    tag: "Woodworking · DIY",
    desc: "Board feet from thickness × width × length ÷ 144, with quantity and lumber pricing — and the nominal-vs-actual size table (a 2×4 is 1.5×3.5) built in.",
  },
  {
    name: "Water Intake Calculator",
    href: "/water-intake-calculator",
    tag: "Health · Hydration",
    desc: "Your daily drinking-water target from body weight, exercise, climate, pregnancy and breastfeeding — in litres, ounces, cups and glasses, with EFSA reference values for context.",
  },
  {
    name: "Calorie Calculator",
    href: "/calorie-calculator",
    tag: "Health · Nutrition",
    desc: "Your BMR, maintenance calories (TDEE) and the exact daily target for losing, maintaining or gaining — from the Mifflin-St Jeor equation, with a protein/carb/fat split in grams.",
  },
  {
    name: "Ovulation Calculator",
    href: "/ovulation-calculator",
    tag: "Health · Fertility",
    desc: "Ovulation date and fertile window from your last period, plus next period, earliest test day and an estimated due date — with the real limits of calendar methods stated upfront.",
  },
  {
    name: "Percentage Calculator",
    href: "/percentage-calculator",
    tag: "Math · Money",
    desc: "All five percentage modes on one page — % of a number, percentage increase/decrease, discounts, and reverse percentages, each with its formula printed under the result.",
  },
  {
    name: "Final Grade Calculator",
    href: "/final-grade-calculator",
    tag: "School · Exams",
    desc: "Exactly what you need to score on the final to get the grade you want — with an honest verdict when a target is locked in, a stretch, or mathematically out of reach.",
  },
  {
    name: "Hourly to Salary Calculator",
    href: "/hourly-to-salary-calculator",
    tag: "Pay · Careers",
    desc: "Convert any hourly rate to daily, weekly, biweekly, monthly and annual pay at your real hours and weeks — plus full breakdown pages for every rate from $12 to $100 an hour.",
  },
  {
    name: "Home Affordability Calculator",
    href: "/home-affordability-calculator",
    tag: "Mortgage · DTI",
    desc: "How much house you can afford, the lender's way: Conventional/FHA/VA ratio presets, property tax, insurance, HOA and PMI priced in — plus a reverse mode that solves the income a home price needs.",
  },
  {
    name: "DTI Calculator",
    href: "/dti-calculator",
    tag: "Mortgage · Ratios",
    desc: "Front-end and back-end debt-to-income ratios from your real payments, judged against Conventional 28/36, FHA 31/43 and VA guidelines — plus how much more monthly debt fits at 36% and 43%.",
  },
  {
    name: "Mortgage Payoff Calculator",
    href: "/mortgage-payoff-calculator",
    tag: "Mortgage · PMI",
    desc: "Your mortgage-free date with extra principal or biweekly payments, the PMI drop-off date on the current and accelerated paths, and a solver for the extra needed to finish by your target year.",
  },
  {
    name: "Amortization Calculator",
    href: "/amortization-calculator",
    tag: "Loans · Schedules",
    desc: "The full amortization schedule with extra monthly, annual and one-time payments built in, the principal/interest crossover month, CSV download and print.",
  },
  {
    name: "Loan Payoff Calculator",
    href: "/loan-payoff-calculator",
    tag: "Loans · Payoff",
    desc: "Pay any installment loan off early: extra monthly payments and dated lump sums, a payoff-by-a-target-date solver, interest saved and a year-by-year schedule.",
  },
  {
    name: "Debt Consolidation Calculator",
    href: "/debt-consolidation-calculator",
    tag: "Debt · Comparison",
    desc: "Every debt modeled on its own balance, APR and payment — staying put vs a consolidation loan with its fee counted vs a balance transfer — with an honest cheapest-path verdict. No lender ads.",
  },
  {
    name: "Credit Card Payoff Calculator",
    href: "/credit-card-payoff-calculator",
    tag: "Cards · Strategy",
    desc: "Avalanche vs snowball across multiple cards with real issuer minimum-payment formulas, payoff order and dates — and the minimum-payment trap priced in months and interest first.",
  },
  {
    name: "Personal Loan Calculator",
    href: "/personal-loan-calculator",
    tag: "Loans · True APR",
    desc: "The origination fee counted both ways (deducted or financed): true APR, cash you actually receive, total cost of the loan, a yearly schedule and a DTI affordability check.",
  },
  {
    name: "Life Insurance Needs Calculator",
    href: "/life-insurance-calculator",
    tag: "Insurance · DIME",
    desc: "How much life insurance you need by the DIME method, with the spouse-income and Social Security survivor-benefit offsets most calculators skip — compared with HLV and the 10× rule. No lead form.",
  },
  {
    name: "Car Insurance Calculator",
    href: "/car-insurance-calculator",
    tag: "Insurance · Coverage",
    desc: "How much car insurance you need: liability limits sized to your net worth and income, checked against all 50 state minimums (full table on the page), with UM/UIM advice and honest cost context. No quote form.",
  },
  {
    name: "Compound Interest Calculator",
    href: "/compound-interest-calculator",
    tag: "Savings · Growth",
    desc: "Compound growth with monthly contributions, an inflation-adjusted real value, an optional annual tax drag on interest, effective APY, a time-to-goal solver and a CD mode with early-withdrawal penalties.",
  },
  {
    name: "Income Tax Calculator Pakistan",
    href: "/salary-tax-calculator-pakistan",
    tag: "Pakistan · Salary Tax",
    desc: "Pakistan salary income tax for 2026-27 under the Finance Act 2026 FBR slabs: monthly tax, take-home pay, effective rate and the slab table with your slab highlighted.",
  },
  {
    name: "PTA Tax Calculator",
    href: "/pta-tax-calculator",
    tag: "Pakistan · DIRBS",
    desc: "PTA mobile registration tax for 2026-27 on passport or CNIC — customs duty, regulatory duty, sales tax, income tax and handset levy, every charge line by line.",
  },
  {
    name: "Zakat Calculator",
    href: "/zakat-calculator",
    tag: "Pakistan · Zakat",
    desc: "2.5% zakat on cash, gold, silver and business assets, with nisab worked out from editable gold and silver per-tola rates — and a plain due / not-due verdict.",
  },
  {
    name: "UK Take-Home Pay Calculator",
    href: "/uk-take-home-pay-calculator",
    tag: "UK · Tax 2026/27",
    desc: "UK take-home pay for 2026/27 from a salary or hourly rate: income tax, employee National Insurance and net pay for England, Wales & NI or Scotland's six bands.",
  },
  {
    name: "IR35 Calculator",
    href: "/ir35-calculator",
    tag: "UK · Contractors",
    desc: "Inside vs outside IR35 take-home from your day rate: employer NI and the skills levy out of the rate, then PAYE tax and employee NI on the deemed salary — line by line.",
  },
  {
    name: "Umbrella vs Limited Company",
    href: "/umbrella-vs-limited-company",
    tag: "UK · Contractor Guide",
    desc: "The plain-English comparison: how umbrella deductions really work (margin, employer NI, levy), limited company basics, a side-by-side table and who should pick which.",
  },
  {
    name: "H-1B Lottery Calculator",
    href: "/h1b-lottery-calculator",
    tag: "US Visas · H-1B",
    desc: "Your H-1B selection odds under the FY2027 wage-weighted lottery, by DOL prevailing wage level — Level I ~15% to Level IV ~61% — from official USCIS data.",
  },
  {
    name: "Visa Bulletin Priority Date Checker",
    href: "/visa-bulletin",
    tag: "US Visas · Green Card",
    desc: "October 2026 visa bulletin final action dates for EB-1, EB-2 and EB-3 (India, China, Rest of World) — enter your priority date to check if your category is current.",
  },
  {
    name: "F1 Visa Interview Questions",
    href: "/f1-visa-interview-questions",
    tag: "US Visas · Students",
    desc: "F1 student visa interview prep: the five question groups officers use, sample questions for each, and 10 practical tips on finances, home ties and confidence.",
  },
  {
    name: "Countdown Timer",
    href: "/countdown-timer",
    tag: "Time · Focus",
    desc: "An online countdown timer with an alarm that stays accurate in background tabs and shows the time left in the tab title — plus preset pages from 1 to 60 minutes, including a 25-minute Pomodoro.",
  },
  {
    name: "Days Between Dates Calculator",
    href: "/days-between-dates-calculator",
    tag: "Dates · Deadlines",
    desc: "Total days, business days and weeks between two dates — plus add or subtract calendar or business days from any date, with the counting rule stated plainly.",
  },
  {
    name: "Square Feet Calculator",
    href: "/square-feet-calculator",
    tag: "Home · DIY",
    desc: "Square footage for multiple rooms and shapes at once, with a waste allowance, sq yd / m² conversions and a material cost estimate for flooring, tile and paint jobs.",
  },
  {
    name: "Love Calculator",
    href: "/love-calculator",
    tag: "Astrology · Compatibility",
    desc: "A love compatibility test that doesn't roll dice: a deterministic score from two names — the same every time — plus a zodiac element reading when you add your signs.",
  },
  {
    name: "BMI Calculator",
    href: "/bmi-calculator",
    tag: "Health · Body",
    desc: "Your Body Mass Index on the WHO scale in imperial or metric, with the healthy weight range for your exact height. Instant and private.",
  },
  {
    name: "Sun, Moon & Rising Calculator",
    href: "/sun-moon-rising-calculator",
    tag: "Astrology · Big Three",
    desc: "Your Big Three from your birth date, time and city: Sun, Moon and Rising signs with exact degrees, calculated in your browser from real astronomical positions. Free, no sign-up.",
  },
  {
    name: "Temp Mail",
    href: "https://tempmaill.tech",
    external: true,
    tag: "Disposable email",
    desc: "Free disposable email addresses — get an inbox in seconds for sign-ups and testing, and keep your real inbox spam-free.",
  },
  {
    name: "PlayZone",
    href: "https://games.tempmaill.tech",
    external: true,
    tag: "Browser games",
    desc: "Free browser games that run instantly with no download — plus guides and tips for classic card and puzzle games.",
  },
];

const collectionJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Free Tools — WebStore Pro",
  url: "https://frinjo.me/tools",
  description:
    "A hub of WebStore Pro's free tools: BotView, Keyword Traffic Checker, IP Address Tracker, SEO Agent Kit, Temp Mail and PlayZone.",
  mainEntity: {
    "@type": "ItemList",
    itemListElement: TOOLS.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      url: t.href.startsWith("http") ? t.href : `https://frinjo.me${t.href}`,
    })),
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Free Tools", item: "https://frinjo.me/tools" },
  ],
};

const FAQS: [string, string][] = [
  [
    "Are these tools really free?",
    "Yes. BotView, the Keyword Traffic Checker and the SEO Agent Kit are free with no sign-up, and Temp Mail and PlayZone are free to use. They are the same tools WebStore Pro uses on its own sites.",
  ],
  [
    "Which tool should I start with?",
    "Start with the Keyword Traffic Checker to pick a keyword you can actually win, write the page, then run it through BotView to check its SEO, AEO and AI visibility before you promote it.",
  ],
  [
    "Do the tools store my data?",
    "BotView and the Keyword Traffic Checker generate their reports live from public data and do not require an account. Temp Mail inboxes are disposable by design.",
  ],
  [
    "Do I need an account to use these tools?",
    "No. Every calculator, checker and generator here works without an account, and most of them run entirely in your browser — the numbers, text and files you enter never leave your device. Nothing to install, nothing to sign up for.",
  ],
  [
    "How many free tools are there?",
    "More than 100 tool pages: 50+ calculators, checkers and generators in English, 8 tools in Spanish and 8 in French, plus a dedicated page for every popular hourly wage ($12–$100 an hour) and preset timer pages from 1 to 60 minutes. All of them are free.",
  ],
  [
    "Can I use these tools in my business or classroom?",
    "Yes — they are free for personal, classroom and commercial use. Teachers run the grade calculators, test-score grader and dice roller; businesses check keywords and audit their sites with the SEO tools; and anyone can link to a tool from their own site. If you want a custom tool built for your own website, that is what WebStore Pro does for clients.",
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
  "rounded-3xl border border-stone-200 bg-white p-8 hover:shadow-xl hover:border-orange-200 transition flex flex-col";

export default function ToolsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* HERO */}
      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 pb-16 sm:pb-20 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Free · No sign-up
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            Our <span className="text-gold-gradient">Tools</span>
          </h1>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Every free tool WebStore Pro builds and uses — in one place. Check a site, research a
            keyword, grab a disposable inbox, or take a game break.
          </p>
        </div>
      </section>

      {/* TOOL CARDS */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead
            eyebrow="The toolbox"
            title="All tools"
            sub="Each tool lives on its own page — this hub just keeps them together."
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 text-left">
            {TOOLS.map((t) =>
              t.external ? (
                <a key={t.name} href={t.href} target="_blank" rel="noopener noreferrer" className={card}>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700 mb-3">{t.tag}</p>
                  <h3 className="font-display text-xl font-bold text-stone-900 mb-3">{t.name}</h3>
                  <p className="text-stone-600 leading-relaxed flex-1">{t.desc}</p>
                  <span className="mt-5 inline-flex items-center gap-2 font-semibold text-orange-700">
                    Open tool <Icon name="arrow" className="w-4 h-4" />
                  </span>
                </a>
              ) : (
                <Link key={t.name} href={t.href} className={card}>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700 mb-3">{t.tag}</p>
                  <h3 className="font-display text-xl font-bold text-stone-900 mb-3">{t.name}</h3>
                  <p className="text-stone-600 leading-relaxed flex-1">{t.desc}</p>
                  <span className="mt-5 inline-flex items-center gap-2 font-semibold text-orange-700">
                    Open tool <Icon name="arrow" className="w-4 h-4" />
                  </span>
                </Link>
              ),
            )}
          </div>
        </div>
      </section>

      {/* HOW THEY FIT TOGETHER */}
      <section className="py-16 sm:py-20 bg-stone-950 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3 text-orange-400">Workflow</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold">How the SEO tools fit together</h2>
          <p className="mt-6 text-stone-300 leading-relaxed">
            Pick a winnable keyword with the Keyword Traffic Checker, publish the page, then audit it with
            BotView for SEO, AEO and AI visibility. The SEO Agent Kit documents the full workflow behind
            both — the same process WebStore Pro runs for its own sites and clients.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/keyword-traffic-checker" className={btnPrimary}>
              Start with a keyword <Icon name="arrow" className="w-5 h-5" />
            </Link>
            <Link href="/botview" className={btnOutline}>
              Then audit the page
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHead eyebrow="FAQ" title="Tools questions, answered" />
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
        </div>
      </section>
    </>
  );
}
