import { NextRequest, NextResponse } from "next/server";
import { runAdsenseAudit } from "@/lib/adsense-audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Simple in-memory throttle: max 20 audits per IP per minute (per instance).
const hits = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_HITS = 20;

function throttled(ip: string): boolean {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  list.push(now);
  hits.set(ip, list);
  return list.length > MAX_HITS;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (throttled(ip)) {
    return NextResponse.json(
      { error: "Too many checks from this network — please wait a minute and try again." },
      { status: 429 },
    );
  }

  let body: { url?: string };
  try {
    body = (await req.json()) as { url?: string };
  } catch {
    return NextResponse.json({ error: "Invalid request — send JSON { url }." }, { status: 400 });
  }
  if (!body.url?.trim()) {
    return NextResponse.json({ error: "Missing url." }, { status: 400 });
  }

  const result = await runAdsenseAudit(body.url);
  if ("error" in result) {
    return NextResponse.json(result, { status: 422, headers: { "Cache-Control": "no-store" } });
  }
  return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
}
