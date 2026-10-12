// Customer session helpers (cookie-based). Sessions stored in customer_sessions table.
import { cookies } from "next/headers";
import { getDb, nowIso } from "./db";
import { randomUUID } from "crypto";

const COOKIE_NAME = "customer_session";
const SESSION_DAYS = 30;

export interface Customer {
  id: number;
  name: string;
  email: string;
  whatsapp: string;
  createdAt: string;
}

export async function createCustomerSession(customerId: number): Promise<string> {
  const token = randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000).toISOString();
  await (await getDb()).prepare(
    "INSERT INTO customer_sessions (token, customer_id, expires_at, created_at) VALUES (?, ?, ?, ?)"
  ).run(token, customerId, expiresAt, nowIso());
  return token;
}

export async function setCustomerSessionCookie(token: string) {
  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function clearCustomerSessionCookie() {
  (await cookies()).set(COOKIE_NAME, "", { httpOnly: true, path: "/", maxAge: 0 });
}

export async function getCustomer(): Promise<Customer | null> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;
  const db = await getDb();
  const row = await db.prepare(
    "SELECT s.*, c.name, c.email, c.whatsapp, c.created_at FROM customer_sessions s JOIN customers c ON c.id = s.customer_id WHERE s.token = ?"
  ).get(token) as Record<string, unknown> | undefined;
  if (!row) return null;
  if (new Date(row.expires_at as string) < new Date()) {
    await db.prepare("DELETE FROM customer_sessions WHERE token = ?").run(token);
    return null;
  }
  return {
    id: row.customer_id as number,
    name: row.name as string,
    email: row.email as string,
    whatsapp: (row.whatsapp as string) || "",
    createdAt: row.created_at as string,
  };
}

/** Use at the top of customer API routes: returns the customer or a 401 Response. */
export async function requireCustomer() {
  const customer = await getCustomer();
  if (!customer) {
    return { customer: null as null, error: Response.json({ error: "Please sign in" }, { status: 401 }) };
  }
  return { customer, error: null as null };
}
