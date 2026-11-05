import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Passes the request pathname to the root layout (via a request header) so
 * <html lang> can be rendered per locale (/es -> "es", /fr -> "fr").
 */
export function middleware(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.set("x-pathname", request.nextUrl.pathname);
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.).*)"],
};
