import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb, nowIso } from "@/lib/db";
import { createCustomerSession, setCustomerSessionCookie } from "@/lib/customer-auth";
import { randomUUID } from "crypto";

export const dynamic = "force-dynamic";

// GET /api/auth/callback/google?code=... — Google OAuth callback
export async function GET(req: NextRequest) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://frinjo.me";
  try {
    const code = req.nextUrl.searchParams.get("code");
    const error = req.nextUrl.searchParams.get("error");
    if (error || !code) {
      return NextResponse.redirect(`${siteUrl}/login?error=google_cancelled`);
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      return NextResponse.redirect(`${siteUrl}/login?error=google_not_configured`);
    }

    const redirectUri = `${siteUrl}/api/auth/callback/google`;

    // Exchange code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });
    const tokens = await tokenRes.json();
    if (!tokens.access_token) {
      console.error("Google token exchange failed", tokens);
      return NextResponse.redirect(`${siteUrl}/login?error=google_failed`);
    }

    // Get user info
    const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const profile = await userRes.json();
    const email = String(profile.email || "").toLowerCase().trim();
    const name = String(profile.name || email.split("@")[0]).trim();
    if (!email) {
      return NextResponse.redirect(`${siteUrl}/login?error=google_failed`);
    }

    // Find or create customer
    const db = await getDb();
    let customer = await db.prepare("SELECT * FROM customers WHERE email = ?").get(email) as Record<string, unknown> | undefined;
    let isNew = false;
    if (!customer) {
      // Create account with random password (they'll use Google to sign in).
      // Google already verified this email, so mark it verified.
      const hash = await bcrypt.hash(randomUUID(), 10);
      const result = await db.prepare(
        "INSERT INTO customers (name, email, password_hash, whatsapp, email_verified, created_at) VALUES (?, ?, ?, '', 1, ?)"
      ).run(name, email, hash, nowIso());
      const id = Number((result as { lastInsertRowid: number }).lastInsertRowid);
      customer = { id, name, email };
      isNew = true;
    }

    const token = await createCustomerSession(customer.id as number);
    await setCustomerSessionCookie(token);
    // New customers complete their profile first
    if (isNew) {
      return NextResponse.redirect(`${siteUrl}/account/complete`);
    }
    return NextResponse.redirect(`${siteUrl}/account`);
  } catch (e) {
    console.error("Google callback failed", e);
    return NextResponse.redirect(`${siteUrl}/login?error=google_failed`);
  }
}
