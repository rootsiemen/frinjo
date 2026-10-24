import { NextRequest, NextResponse } from "next/server";
import { runAudit } from "@/lib/botview-audit";

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

export async function GET(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (throttled(ip)) {
    return NextResponse.json(
      { error: "Too many checks from this network — please wait a minute and try again." },
      { status: 429 },
    );
  }
  const url = req.nextUrl.searchParams.get("url") ?? "";
  if (!url) {
    return NextResponse.json({ error: "Missing ?url= parameter." }, { status: 400 });
  }
  try {
    const result = await runAudit(url);
    return NextResponse.json(result, {
      status: result.error ? 422 : 200,
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json(
      { error: "The audit failed unexpectedly. Please try again." },
      { status: 500 },
    );
  }
}
