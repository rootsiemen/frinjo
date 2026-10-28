import { NextRequest, NextResponse } from "next/server";
import { runKeywordCheck } from "@/lib/keyword-check";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Simple in-memory throttle: max 20 checks per IP per minute (per instance),
// same pattern as /api/botview-audit.
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
  const keyword = req.nextUrl.searchParams.get("keyword") ?? "";
  if (!keyword.trim()) {
    return NextResponse.json({ error: "Missing ?keyword= parameter." }, { status: 400 });
  }
  try {
    const result = await runKeywordCheck(keyword);
    return NextResponse.json(result, {
      status: result.error ? 422 : 200,
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json(
      { error: "The keyword check failed unexpectedly. Please try again." },
      { status: 500 },
    );
  }
}
