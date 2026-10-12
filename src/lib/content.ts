// Shared site content: packages, services, FAQs. Single source of truth.
export const BRAND = {
  name: "WebStore Pro",
  tagline: "Ecommerce Website Developer | Online Stores That Sell",
  whatsapp: "9647710737529",
  email: "muhammadraza512512@gmail.com",
};

export interface Pkg {
  name: string;
  price: number;
  delivery: string;
  pages: string;
  features: string[];
  popular?: boolean;
}

export const PACKAGES: Pkg[] = [
  {
    name: "Starter Website",
    price: 80,
    delivery: "5-day delivery",
    pages: "5 pages",
    features: [
      "5-page website",
      "Up to 20 products",
      "Mobile responsive design",
      "Shopping cart & checkout",
      "Cash on Delivery setup",
      "7-day support",
    ],
  },
  {
    name: "Business Website",
    price: 150,
    delivery: "7-day delivery",
    pages: "8 pages",
    popular: true,
    features: [
      "Everything in Starter",
      "Up to 100 products",
      "Admin panel — manage it yourself",
      "WhatsApp ordering + COD",
      "Order notifications",
      "14-day support",
    ],
  },
  {
    name: "Pro Website",
    price: 300,
    delivery: "10-day delivery",
    pages: "12 pages",
    features: [
      "Everything in Business",
      "Payment gateway integration",
      "Custom banners & branding",
      "Order email alerts",
      "SEO basics",
      "30-day priority support",
    ],
  },
];

export interface Service {
  title: string;
  slug: string;
  desc: string;
  icon: string;
  longDesc: string;
  features: string[];
  bestFor: string;
}

export const SERVICES: Service[] = [
  {
    title: "Ecommerce Website",
    slug: "ecommerce-website",
    desc: "Complete online store with product catalog, cart, checkout and order management — ready to sell from day one.",
    icon: "cart",
    longDesc:
      "A complete online store built to sell — beautiful storefront, smooth shopping experience and everything you need to take orders from day one. Your customers browse products, add to cart and check out in minutes, on any device.",
    features: [
      "Modern homepage with banners and categories",
      "Product pages with images, prices and variants",
      "Shopping cart with secure checkout flow",
      "Cash on Delivery built in",
      "Order notifications on every sale",
      "Fully mobile responsive design",
    ],
    bestFor: "Clothing brands, cosmetics, electronics, groceries — any business that wants to sell products online.",
  },
  {
    title: "Business Website",
    slug: "business-website",
    desc: "Professional company website with services, portfolio, contact forms and everything your brand needs online.",
    icon: "globe",
    longDesc:
      "A polished, professional website that makes your business look established and trustworthy. Showcase your services, past work and customer reviews — and turn visitors into inquiries with smart contact forms and WhatsApp chat.",
    features: [
      "Stunning homepage that tells your story",
      "Services section with detail pages",
      "Portfolio / past-work gallery",
      "Testimonials and reviews section",
      "Contact form with instant alerts",
      "WhatsApp chat button on every page",
    ],
    bestFor: "Agencies, freelancers, clinics, restaurants, real estate and local businesses that need a strong online presence.",
  },
  {
    title: "Admin Panel",
    slug: "admin-panel",
    desc: "Easy dashboard to add products, update prices and track orders yourself — no coding knowledge required.",
    icon: "dashboard",
    longDesc:
      "You stay in full control after launch. The admin panel is your website's back office — add new products, change prices, mark orders as delivered and update your portfolio, all from a simple dashboard. No developer needed, no coding at all.",
    features: [
      "Add, edit and delete products in seconds",
      "Update prices and stock instantly",
      "View and manage all customer orders",
      "Track inquiries from the contact form",
      "Manage portfolio items and testimonials",
      "Simple login — works on phone too",
    ],
    bestFor: "Store owners who want to run their website themselves without paying a developer for every small change.",
  },
  {
    title: "Payment Integration",
    slug: "payment-integration",
    desc: "Stripe, PayPal, JazzCash and more — accept online payments securely with your own merchant account.",
    icon: "card",
    longDesc:
      "Let customers pay you online, not just Cash on Delivery. I integrate trusted payment gateways into your checkout — cards, bank transfers and mobile wallets — all connected to YOUR merchant account, so every rupee goes straight to you.",
    features: [
      "Stripe and PayPal for international cards",
      "JazzCash / Easypaisa for local customers",
      "Secure checkout with trusted providers",
      "Your own merchant account — money comes to you",
      "Payment status tracked with each order",
      "COD and WhatsApp ordering still available",
    ],
    bestFor: "Stores ready to accept card and mobile-wallet payments alongside Cash on Delivery.",
  },
  {
    title: "WhatsApp Ordering",
    slug: "whatsapp-ordering",
    desc: "Let customers order directly through WhatsApp with one tap — perfect for small businesses and local shops.",
    icon: "chat",
    longDesc:
      "Most of your customers are already on WhatsApp — so let them order there. One tap on your website opens a chat with their cart or inquiry pre-written. You confirm the order in chat and deliver. Simple, personal, and it converts.",
    features: [
      "One-tap WhatsApp order button",
      "Cart details sent straight to your chat",
      "Floating WhatsApp button on every page",
      "Pre-written messages — customer just hits send",
      "Works with COD for easy fulfillment",
      "No app or signup needed for customers",
    ],
    bestFor: "Small shops, home-based businesses and anyone whose customers prefer chatting over online checkout.",
  },
  {
    title: "SEO Basics",
    slug: "seo-basics",
    desc: "Search-friendly structure, fast loading and proper meta tags so customers can actually find you on Google.",
    icon: "search",
    longDesc:
      "A beautiful website is useless if nobody finds it. Every site I build comes with SEO fundamentals baked in — clean structure Google understands, lightning-fast loading, and proper titles and descriptions on every page so you start ranking from day one.",
    features: [
      "SEO-friendly page structure and URLs",
      "Fast loading for better rankings",
      "Meta titles and descriptions on every page",
      "Mobile-first — Google's top priority",
      "Google-friendly sitemap included",
      "Social sharing previews set up",
    ],
    bestFor: "Any business that wants customers to discover them through Google search.",
  },
];

export const FAQS = [
  {
    q: "How long does it take to build my website?",
    a: "Starter websites are delivered in 5 days, Business in 7 days and Pro in 10 days. Need it faster? Ask about express delivery.",
  },
  {
    q: "Do I need to buy domain and hosting myself?",
    a: "Yes, but I guide you step by step — it costs around $15/year and takes 10 minutes. Your site stays 100% yours.",
  },
  {
    q: "Can I update products myself after launch?",
    a: "Absolutely. The Business and Pro packages include an admin panel where you can add products, change prices and manage orders with zero coding. I'll show you how in a short walkthrough.",
  },
  {
    q: "Which payment methods are supported?",
    a: "Cash on Delivery, JazzCash, Stripe, PayPal and WhatsApp ordering. Online gateways use your own merchant account, so the money goes straight to you.",
  },
  {
    q: "Will my website work on mobile phones?",
    a: "Yes — every website is fully mobile responsive and tested on phones, tablets and desktops.",
  },
  {
    q: "What do you need from me to start?",
    a: "Just your business name, logo (if you have one), product list with prices and photos, and your WhatsApp number. I handle everything else.",
  },
];

export interface PaymentMethod {
  id: string;
  name: string;
  account: string;
  title: string;
  note: string;
  txnLabel: string;
}

export const PAYMENTS: PaymentMethod[] = [
  {
    id: "jazzcash",
    name: "JazzCash",
    account: "03360723375",
    title: "JazzCash Digital Account",
    note: "Send the package amount to this JazzCash account, then enter your Transaction ID below.",
    txnLabel: "Transaction ID",
  },
  {
    id: "easypaisa",
    name: "Easypaisa",
    account: "03360723375",
    title: "IBAN: PK12TMFB0000000051882511",
    note: "Send the package amount to this Easypaisa account, then enter your Transaction ID below.",
    txnLabel: "Transaction ID",
  },
  {
    id: "binance",
    name: "Binance Pay",
    account: "Muhammadraza512512@gmail.com",
    title: "Binance UID: 770155112",
    note: "Send the payment via Binance Pay to this email / UID, then enter your Transaction ID below.",
    txnLabel: "Transaction ID",
  },
  {
    id: "payoneer",
    name: "Payoneer",
    account: "muhammadraza512512@gmail.com",
    title: "Payoneer Email",
    note: "Send the payment to this Payoneer email, then enter your Transaction ID below.",
    txnLabel: "Transaction ID",
  },
  {
    id: "usdt-trc20",
    name: "USDT (TRC20)",
    account: "TCfmrV4vtZ1DyYtvvxPhvWabmXt4nbg6D6",
    title: "TRC20 Network",
    note: "Send the exact USDT amount to this wallet on TRC20 network only, then enter your Transaction Hash below.",
    txnLabel: "Transaction Hash",
  },
  {
    id: "usdt-bep20",
    name: "USDT (BEP20)",
    account: "0xed783b3f0b1815f6f61130914240cff8a75d9381",
    title: "BEP20 (BSC) Network",
    note: "Send the exact USDT amount to this wallet on BEP20 (BSC) network only, then enter your Transaction Hash below.",
    txnLabel: "Transaction Hash",
  },
];
