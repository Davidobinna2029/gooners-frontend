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
   * Protect only the editorial/admin areas.
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
   * to the new /news/[slug] structure.
   */
  const destination = getLegacyRedirect(pathname);

  if (destination) {
    const url = request.nextUrl.clone();

    url.pathname = destination;

    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * IMPORTANT:
     * API routes must bypass this proxy completely.
     *
     * This prevents the proxy from interfering with:
     * /api/posts
     * /api/auth/session
     * /api/auth/_log
     * and future API endpoints.
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};