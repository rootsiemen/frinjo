import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// GET /api/admin/auth/google — start Google OAuth for admin login.
// Reuses the already-registered customer callback URI (/api/auth/callback/google)
// with state=admin, so no Google Cloud Console redirect-URI change is needed.
export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json({ error: "Google login is not configured yet." }, { status: 500 });
  }
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://frinjo.me";
  const redirectUri = `${siteUrl}/api/auth/callback/google`;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "online",
    prompt: "select_account",
    state: "admin",
  });
  return NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
}
