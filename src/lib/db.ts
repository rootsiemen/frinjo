// SQLite data layer backed by Turso (libsql) — works on Vercel serverless.
// Local dev: set TURSO_DATABASE_URL=file:./dev.db (or leave unset) to use a
// local SQLite file. Production (Vercel): set TURSO_DATABASE_URL to the
// libsql:// URL and TURSO_AUTH_TOKEN to the database auth token.
import { createClient, type Client } from "@libsql/client";
import blogSeed from "./blog-seed.json";

export interface AdminUser {
  id: number; email: string; passwordHash: string; name: string; createdAt: string;
}

export interface Inquiry {
  id: number; name: string; email: string; whatsapp: string; package: string;
  message: string; status: string; createdAt: string;
}

export interface PortfolioItem {
  id: number; title: string; description: string;
  imageUrl: string; link: string; createdAt: string;
}

export interface Testimonial {
  id: number; name: string; text: string; rating: number;
  status: string; createdAt: string;
}

export interface Order {
  id: number; name: string; email: string; whatsapp: string;
  package: string; amount: number; payMethod: string; txnId: string;
  note: string; status: string; createdAt: string;
}

export interface BlogPost {
  id: number; title: string; slug: string; excerpt: string; metaDescription: string;
  category: string; content: string; status: string; createdAt: string;
}

/** Bind parameter type for SQL queries. */
export type SQLValue = number | bigint | string | Uint8Array | null | undefined;

type Row = Record<string, unknown>;

export interface Statement {
  get: (...params: SQLValue[]) => Promise<Row | undefined>;
  all: (...params: SQLValue[]) => Promise<Row[]>;
  run: (...params: SQLValue[]) => Promise<{ changes: number; lastInsertRowid: number }>;
}

export interface Db {
  prepare: (sql: string) => Statement;
  exec: (sql: string) => Promise<void>;
}

const SCHEMA = `
CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL DEFAULT 'Site Owner',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  token TEXT UNIQUE NOT NULL,
  admin_user_id INTEGER NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS password_resets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  token_hash TEXT UNIQUE NOT NULL,
  admin_user_id INTEGER NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS inquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL DEFAULT '',
  package TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'new',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS portfolio_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  link TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS testimonials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  text TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5,
  status TEXT NOT NULL DEFAULT 'approved',
  approved INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS blog_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT NOT NULL DEFAULT '',
  meta_description TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'General',
  content TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL DEFAULT '',
  package TEXT NOT NULL DEFAULT '',
  amount REAL NOT NULL DEFAULT 0,
  pay_method TEXT NOT NULL DEFAULT '',
  txn_id TEXT NOT NULL DEFAULT '',
  note TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending',
  customer_id INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  whatsapp TEXT NOT NULL DEFAULT '',
  email_verified INTEGER NOT NULL DEFAULT 0,
  verify_token_hash TEXT,
  verify_expires_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS customer_password_resets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  token_hash TEXT UNIQUE NOT NULL,
  customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS customer_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  token TEXT UNIQUE NOT NULL,
  customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
`;

// ---- client singleton ----
let _client: Client | null = null;
let _initPromise: Promise<Db> | null = null;

function resolveConfig(): { url: string; authToken?: string } {
  const url =
    process.env.TURSO_DATABASE_URL ||
    process.env.DATABASE_URL ||
    "file:./dev.db";
  const authToken = process.env.TURSO_AUTH_TOKEN;
  return { url, authToken };
}

function makeDb(client: Client): Db {
  return {
    exec: async (sql: string) => {
      await client.executeMultiple(sql);
    },
    prepare: (sql: string): Statement => ({
      get: async (...params: SQLValue[]) => {
        const rs = await client.execute({ sql, args: params as any[] });
        return (rs.rows[0] as Row | undefined) ?? undefined;
      },
      all: async (...params: SQLValue[]) => {
        const rs = await client.execute({ sql, args: params as any[] });
        return rs.rows as Row[];
      },
      run: async (...params: SQLValue[]) => {
        const rs = await client.execute({ sql, args: params as any[] });
        return {
          changes: Number(rs.rowsAffected ?? 0),
          lastInsertRowid: Number(rs.lastInsertRowid ?? 0),
        };
      },
    }),
  };
}

async function initDb(): Promise<Db> {
  const { url, authToken } = resolveConfig();
  const client = createClient({ url, authToken });
  _client = client;
  const db = makeDb(client);

  await db.exec(SCHEMA);

  // Migrate older databases: add columns that did not exist at first install.
  for (const ddl of [
    "ALTER TABLE testimonials ADD COLUMN status TEXT NOT NULL DEFAULT 'approved'",
    "ALTER TABLE testimonials ADD COLUMN approved INTEGER NOT NULL DEFAULT 1",
    "ALTER TABLE orders ADD COLUMN customer_id INTEGER NOT NULL DEFAULT 0",
    "ALTER TABLE customers ADD COLUMN email_verified INTEGER NOT NULL DEFAULT 0",
    "ALTER TABLE customers ADD COLUMN verify_token_hash TEXT",
    "ALTER TABLE customers ADD COLUMN verify_expires_at TEXT",
    "ALTER TABLE blog_posts ADD COLUMN meta_description TEXT NOT NULL DEFAULT ''",
  ]) {
    try {
      await db.exec(ddl);
    } catch {
      /* column already exists */
    }
  }
  // Backfill meta descriptions for posts published before the field existed.
  try {
    await db.exec(
      "UPDATE blog_posts SET meta_description = substr(excerpt, 1, 160) WHERE meta_description = '' AND excerpt <> ''"
    );
  } catch {
    /* best-effort */
  }
  // Grandfather existing customers (signed up before verification existed).
  try {
    await db.exec(
      "UPDATE customers SET email_verified = 1 WHERE email_verified = 0 AND verify_token_hash IS NULL"
    );
  } catch {
    /* best-effort */
  }
  // Auto-seed blog posts on a fresh/empty table.
  try {
    const rows = await db.prepare("SELECT COUNT(*) AS n FROM blog_posts").all();
    const n = Number((rows[0] as Row)?.n ?? 0);
    if (n === 0 && Array.isArray(blogSeed) && blogSeed.length) {
      for (const p of blogSeed as {
        title: string;
        slug: string;
        excerpt?: string;
        category?: string;
        content?: string[];
      }[]) {
        await db
          .prepare(
            "INSERT INTO blog_posts (title, slug, excerpt, category, content, status, created_at) VALUES (?, ?, ?, ?, ?, 'published', datetime('now'))"
          )
          .run(
            p.title,
            p.slug,
            p.excerpt ?? "",
            p.category ?? "General",
            JSON.stringify(p.content ?? [])
          );
      }
    }
  } catch {
    /* seeding is best-effort */
  }
  return db;
}

/** Singleton DB handle; creates tables on first use. */
export function getDb(): Promise<Db> {
  if (!_initPromise) _initPromise = initDb();
  return _initPromise;
}

/** Close the underlying client (useful for scripts). */
export async function closeDb(): Promise<void> {
  if (_client) {
    _client.close();
    _client = null;
    _initPromise = null;
  }
}

// --- Row mappers (snake_case columns → camelCase objects) ---

export function mapAdminUser(r: Row): AdminUser {
  return {
    id: r.id as number,
    email: r.email as string,
    passwordHash: r.password_hash as string,
    name: r.name as string,
    createdAt: r.created_at as string,
  };
}

export function mapInquiry(r: Row): Inquiry {
  return {
    id: r.id as number,
    name: r.name as string,
    email: r.email as string,
    whatsapp: (r.whatsapp as string) ?? "",
    package: (r.package as string) ?? "",
    message: (r.message as string) ?? "",
    status: r.status as string,
    createdAt: r.created_at as string,
  };
}

export function mapPortfolioItem(r: Row): PortfolioItem {
  return {
    id: r.id as number,
    title: r.title as string,
    description: (r.description as string) ?? "",
    imageUrl: (r.image_url as string) ?? "",
    link: (r.link as string) ?? "",
    createdAt: r.created_at as string,
  };
}

export function mapTestimonial(r: Row): Testimonial {
  return {
    id: r.id as number,
    name: r.name as string,
    text: r.text as string,
    rating: (r.rating as number) ?? 5,
    status: (r.status as string) ?? "approved",
    createdAt: r.created_at as string,
  };
}

export function mapBlogPost(r: Row): BlogPost {
  return {
    id: r.id as number,
    title: r.title as string,
    slug: r.slug as string,
    excerpt: (r.excerpt as string) ?? "",
    metaDescription: (r.meta_description as string) ?? "",
    category: (r.category as string) ?? "General",
    content: (r.content as string) ?? "",
    status: (r.status as string) ?? "draft",
    createdAt: r.created_at as string,
  };
}

export function mapOrder(r: Row): Order {
  return {
    id: r.id as number,
    name: r.name as string,
    email: r.email as string,
    whatsapp: r.whatsapp as string,
    package: r.package as string,
    amount: Number(r.amount ?? 0),
    payMethod: r.pay_method as string,
    txnId: r.txn_id as string,
    note: r.note as string,
    status: r.status as string,
    createdAt: r.created_at as string,
  };
}

export function nowIso(): string {
  return new Date().toISOString();
}
