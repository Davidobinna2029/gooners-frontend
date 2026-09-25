import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type {
  NextFetchEvent,
  NextRequest,
} from "next/server";
import type { NextRequestWithAuth } from "next-auth/middleware";

import legacyRedirects from "./generated/legacy-redirects.json";

const RESERVED_ROUTES = new Set([
  "admin",
  "api",
  "category",
  "control-room",
  "fixtures",
  "live",
  "login",
  "news",
  "opinion",
  "search",
  "standings",
  "transfers",
  "videos",
  "_next",
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
]);

function getLegacyRedirect(
  pathname: string
): string | null {
  const cleanPath = pathname.replace(
    /^\/+|\/+$/g,
    ""
  );

  if (!cleanPath) {
    return null;
  }

  // Only redirect old root-level article URLs.
  if (cleanPath.includes("/")) {
    return null;
  }

  const lowerPath = cleanPath.toLowerCase();

  if (RESERVED_ROUTES.has(lowerPath)) {
    return null;
  }

  const destination =
    legacyRedirects[
      cleanPath as keyof typeof legacyRedirects
    ];

  if (!destination) {
    return null;
  }

  return destination;
}

const authMiddleware = withAuth({
  pages: {
    signIn: "/login",
  },
});

export default function proxy(
  request: NextRequest,
  event: NextFetchEvent
) {
  const { pathname } = request.nextUrl;

  /*
   * Keep authentication protection for
   * /admin and /control-room.
   */
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/control-room")
  ) {
    return authMiddleware(
      request as NextRequestWithAuth,
      event
    );
  }

  /*
   * Redirect old root-level WordPress article URLs
   * to the new /news/[slug]/ structure.
   */
  const destination =
    getLegacyRedirect(pathname);

  if (destination) {
    const url = request.nextUrl.clone();

    url.pathname = destination;

    return NextResponse.redirect(
      url,
      301
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};