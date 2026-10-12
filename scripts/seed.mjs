// Seed script: creates the admin user, one portfolio item and two testimonials.
// Run with: node scripts/seed.mjs
// Safe to re-run: it skips records that already exist.
//
// Uses sql.js (pure JS/WASM) — same engine as the app, no native modules needed.
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";

const require = createRequire(import.meta.url);
const bcrypt = require("bcryptjs");
const initSqlJs = require("sql.js");

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

let dbUrl = process.env.DATABASE_URL || "file:./dev.db";
if (dbUrl.startsWith("file:")) dbUrl = dbUrl.slice(5);
const dbPath = join(ROOT, dbUrl);
console.log("Database:", dbPath);
mkdirSync(dirname(dbPath), { recursive: true });

const SQL = await initSqlJs({
  locateFile: (f) => join(dirname(require.resolve("sql.js")), f),
});
const handle = existsSync(dbPath)
  ? new SQL.Database(readFileSync(dbPath))
  : new SQL.Database();
const persist = () => writeFileSync(dbPath, Buffer.from(handle.export()));

// Minimal better-sqlite3-compatible wrapper over sql.js.
const db = {
  exec(sql) {
    for (const part of sql.split(";")) {
      const s = part.trim();
      if (s) handle.exec(s);
    }
    persist();
  },
  prepare(sql) {
    return {
      get(...p) {
        const st = handle.prepare(sql);
        try { st.bind(p); return st.step() ? st.getAsObject() : undefined; }
        finally { st.free(); }
      },
      run(...p) {
        const st = handle.prepare(sql);
        try { st.bind(p); st.step(); }
        finally { st.free(); }
        persist();
      },
    };
  },
  close() { persist(); },
};

// Same tables as src/lib/db.ts (kept in sync manually — keep it simple).
db.exec(`
CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL, name TEXT NOT NULL DEFAULT 'Site Owner',
  created_at TEXT NOT NULL DEFAULT (datetime('now')));
CREATE TABLE IF NOT EXISTS sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT, token TEXT UNIQUE NOT NULL,
  admin_user_id INTEGER NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now')));
CREATE TABLE IF NOT EXISTS inquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL,
  whatsapp TEXT NOT NULL DEFAULT '', package TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL DEFAULT '', status TEXT NOT NULL DEFAULT 'new',
  created_at TEXT NOT NULL DEFAULT (datetime('now')));
CREATE TABLE IF NOT EXISTS portfolio_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '', image_url TEXT NOT NULL DEFAULT '',
  link TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL DEFAULT (datetime('now')));
CREATE TABLE IF NOT EXISTS testimonials (
  id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, text TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5, created_at TEXT NOT NULL DEFAULT (datetime('now')));
`);

// --- Admin user ---
const email = process.env.ADMIN_EMAIL || "admin@webstore.pro";
const exists = db.prepare("SELECT id FROM admin_users WHERE email = ?").get(email);
if (!exists) {
  const hash = bcrypt.hashSync(process.env.ADMIN_PASSWORD || "admin123", 10);
  db.prepare("INSERT INTO admin_users (email, password_hash, name) VALUES (?, ?, ?)").run(email, hash, "Site Owner");
  console.log(`✔ Admin user created: ${email}`);
} else {
  console.log(`• Admin user already exists: ${email}`);
}

// --- Seed portfolio item ---
const hasPortfolio = db.prepare("SELECT id FROM portfolio_items LIMIT 1").get();
if (!hasPortfolio) {
  db.prepare(
    "INSERT INTO portfolio_items (title, description, image_url, link) VALUES (?, ?, ?, ?)"
  ).run(
    "Libaas Collection — Complete Ecommerce Website",
    "Full online clothing store built for a real Pakistani client. Includes homepage, shop with filters, cart, checkout, Cash on Delivery, WhatsApp ordering, admin panel for managing products and orders, and mobile-responsive design.",
    "",
    ""
  );
  console.log("✔ Seeded portfolio item: Libaas Collection");
} else {
  console.log("• Portfolio items already seeded");
}

// --- Seed testimonials ---
const hasTestimonials = db.prepare("SELECT id FROM testimonials LIMIT 1").get();
if (!hasTestimonials) {
  db.prepare("INSERT INTO testimonials (name, text, rating) VALUES (?, ?, ?)").run(
    "Ahmed Raza, Boutique Owner",
    "My online store was ready in a week and orders started coming through WhatsApp on day one. The admin panel is so easy — I add new products myself without calling anyone.",
    5
  );
  db.prepare("INSERT INTO testimonials (name, text, rating) VALUES (?, ?, ?)").run(
    "Sarah Mitchell, Online Seller",
    "Professional, fast and great communication. The website looks premium on mobile and the checkout process is smooth. Worth every dollar.",
    5
  );
  console.log("✔ Seeded 2 testimonials");
} else {
  console.log("• Testimonials already seeded");
}

db.close();
console.log("Done.");
