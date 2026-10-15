// Posts shipped with the repo. These are merged with DB posts on the blog
// index, article pages, and sitemap — so pushing to main publishes them
// without touching the production database. Keep slugs unique vs the DB.

import type { BlogPost } from "./db";

const LANDING_VS_WEBSITE_BLOCKS: string[] = [
  "Quick answer: pick a landing page if you have one offer and one goal (get the click, the call, or the order). Pick a full website if you sell multiple products, offer several services, or want to be found on Google. Most Pakistani small businesses outgrow a landing page within a year — so choose based on where your business is heading, not just where it is today.",

  "## What each option actually is",

  "A landing page is a single page with one job: convert the visitor. No menu, no distractions — just a headline, the offer, proof (reviews, photos), and a big order button. It is the page your Facebook or TikTok ad should point to.",

  "A full website is a set of pages: home, products or services, about, contact, and often a blog. Visitors can browse, compare, and learn. Google can index every page, which means every page is a chance to be found in search.",

  "## Landing page vs full website: side-by-side",

  "- Cost: landing page $30–$80 one-time; full website $80–$300+ (WebStore Pro Starter is $80)",
  "- Build time: landing page 1–3 days; full website 5–10 days",
  "- Best goal: landing page = one action (order/call/signup); full website = browsing, trust-building, repeat visits",
  "- Google ranking: landing pages rarely rank; full websites rank page by page (services, blog, location pages)",
  "- Products: landing page = 1 offer; full website = 20–100+ products with cart and checkout",
  "- When ads stop: landing page traffic dies; a full website keeps earning free Google traffic",

  "## Choose a landing page if…",

  "- You sell ONE product or one bundle (e.g. a single herbal oil, one course, one service package)",
  "- Your traffic comes from paid ads (Facebook, TikTok, Google Ads) and you want maximum conversion",
  "- You need it live this week and the budget is tight",
  "- You are testing an idea before committing to a full store",

  "> Real example: a Lahore seller ran TikTok ads for one weight-loss tea to a landing page with JazzCash/COD ordering and converted 3x better than sending the same traffic to a full store homepage. One offer, one page, one button.",

  "## Choose a full website if…",

  "- You sell multiple products or offer several services",
  "- Customers compare before buying (clothes, electronics, furniture)",
  "- You want free traffic from Google — blog posts and service pages rank, landing pages don't",
  "- You need trust signals: about page, reviews, policies, contact info",
  "- You plan WhatsApp ordering, COD, and an admin panel to manage everything yourself",

  "## The hybrid most businesses actually need",

  "You don't have to pick forever. The smartest setup for a growing Pakistani business is a full website WITH landing pages inside it: the website builds trust and Google traffic, while dedicated landing pages catch ad traffic for each hero product. WebStore Pro's Business package ($150) covers exactly this — a multi-page site where each product can have its own focused sales page.",

  "## FAQ",

  "## How much does a landing page cost in Pakistan?",

  "Freelancers charge roughly Rs 8,000–25,000 ($30–$80) for a single landing page. A full small-business website starts around $80 (WebStore Pro Starter: 5 pages, 20 products, COD setup, 5-day delivery).",

  "## Can I start with a landing page and upgrade later?",

  "Yes — and it's the most common path. Start with a landing page to validate demand with ads, then expand to a full website once orders are steady. Ask your developer to build the landing page on the same platform so the upgrade doesn't mean starting over.",

  "## Which converts better for Facebook ads?",

  "A dedicated landing page, almost always. Fewer links mean fewer exits: visitors either order or leave, and with one clear offer plus COD/WhatsApp ordering, order rates are typically 2–3x higher than ad traffic sent to a generic homepage.",

  "## The bottom line",

  "One offer + paid ads = landing page. Multiple products + Google traffic + long-term brand = full website. If you're unsure, start with the full website's Starter package — at $80 it's barely more than a good landing page, and it gives you room to grow without rebuilding in six months.",
];

export const REPO_POSTS: BlogPost[] = [
  {
    id: -1,
    title: "Landing Page vs Full Website: Which Does Your Business Need?",
    slug: "landing-page-vs-full-website-which-does-your-business-need",
    excerpt:
      "One offer and paid ads? Get a landing page. Multiple products and Google traffic? Get a full website. The honest 2026 breakdown for Pakistani businesses — costs, timelines, and the hybrid most stores actually need.",
    metaDescription:
      "Landing page vs full website in Pakistan (2026): costs, build time, and which one your business needs. Honest comparison for small businesses running ads or selling online.",
    category: "Websites",
    content: JSON.stringify(LANDING_VS_WEBSITE_BLOCKS),
    status: "published",
    createdAt: "2026-10-15T00:00:00",
  },
];

/** Repo posts not already present in the DB (DB wins on slug conflicts). */
export function mergeRepoPosts<T extends { slug: string }>(dbPosts: T[], repoPosts: BlogPost[] = REPO_POSTS): (T | BlogPost)[] {
  const slugs = new Set(dbPosts.map((p) => p.slug));
  return [...dbPosts, ...repoPosts.filter((p) => p.slug && !slugs.has(p.slug))];
}
