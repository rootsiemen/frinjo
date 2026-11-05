const EMAIL_DOMAINS = ["abahi.tech", "abahi.page", "abahi.me"];
const ADDRESS_RE = new RegExp(
  `^[a-z0-9._-]+@(${EMAIL_DOMAINS.map((d) => d.replace(/\./g, "\\.")).join("|")})$`
);

/**
 * GET /api/temp-inbox?address=someone@abahi.tech
 * Same-site proxy to tempmaill.tech's public inbox API so the Fake Name
 * Generator can show a generated address's inbox right on frinjo.me
 * (avoids cross-origin CORS and keeps temp-mail untouched).
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = (searchParams.get("address") || "").trim().toLowerCase();

  if (!ADDRESS_RE.test(address)) {
    return Response.json(
      { emails: [], error: `A valid temp address (${EMAIL_DOMAINS.map((d) => "@" + d).join(", ")}) is required.` },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(
      `https://tempmaill.tech/api/inbox?address=${encodeURIComponent(address)}`,
      { cache: "no-store" }
    );
    if (!res.ok) {
      return Response.json({ emails: [], error: "Inbox temporarily unavailable." }, { status: 502 });
    }
    const data = (await res.json()) as { emails?: unknown[] };
    return Response.json({ emails: Array.isArray(data.emails) ? data.emails : [] });
  } catch {
    return Response.json({ emails: [], error: "Inbox temporarily unavailable." }, { status: 502 });
  }
}
