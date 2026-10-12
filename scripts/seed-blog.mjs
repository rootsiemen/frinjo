// Seed script: inserts blog posts from scripts/blog-seed.json as published posts.
// Run with: node scripts/seed-blog.mjs
// Safe to re-run: it skips slugs that already exist.
//
// Uses sql.js (pure JS/WASM) — same engine as the app, no native modules needed.
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";

const require = createRequire(import.meta.url);
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

function exec(sql) {
  for (const part of sql.split(";")) {
    const s = part.trim();
    if (s) handle.exec(s);
  }
  persist();
}
function prepare(sql) {
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
}

// Ensure table exists (same as src/lib/db.ts).
exec(`CREATE TABLE IF NOT EXISTS blog_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL, excerpt TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'General', content TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TEXT NOT NULL DEFAULT (datetime('now')))`);

const posts = JSON.parse(readFileSync(join(__dirname, "blog-seed.json"), "utf8"));
let inserted = 0, skipped = 0;
for (const p of posts) {
  const exists = prepare("SELECT id FROM blog_posts WHERE slug = ?").get(p.slug);
  if (exists) { skipped++; continue; }
  prepare(
    "INSERT INTO blog_posts (title, slug, excerpt, category, content, status, created_at) VALUES (?, ?, ?, ?, ?, 'published', datetime('now'))"
  ).run(p.title, p.slug, p.excerpt || "", p.category || "General", JSON.stringify(p.content || []));
  inserted++;
  console.log(`✔ ${p.slug}`);
}
persist();
console.log(`Done. Inserted ${inserted}, skipped ${skipped}.`);
