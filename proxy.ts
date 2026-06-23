import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Login cookie set by lib/players.ts (COOKIE_NAME). Hardcoded here because that
// module pulls in js-cookie (client-only) and can't run in proxy/edge.
const PID_COOKIE = "pid";

// Gate every page behind a login: without a `pid` cookie the user can only reach
// the login page ("/"). Static assets and API are excluded via the matcher.
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/") return NextResponse.next();

  if (!req.cookies.get(PID_COOKIE)?.value) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Skip API, Next internals, and any file with an extension (so /mediapipe/*,
  // /sounds/*.mp3, images, etc. load without auth).
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
