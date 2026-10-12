import { NextResponse } from "next/server";
import { requireCustomer } from "@/lib/customer-auth";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

// GET /api/auth/orders — logged-in customer's orders
export async function GET() {
  const { customer, error } = await requireCustomer();
  if (error) return error;
  const rows = await (await getDb()).prepare(
    "SELECT id, package, amount, pay_method, txn_id, status, created_at FROM orders WHERE customer_id = ? ORDER BY id DESC"
  ).all(customer.id) as Record<string, unknown>[];
  return NextResponse.json({ orders: rows });
}
