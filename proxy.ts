import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import {
  COOKIE_KEYS,
  ENTRY_ROUTES,
  DEFAULT_ENTRY_ROUTE,
  EntryRoute,
} from "@/common/constants/routes";

const LOCALES = ["en", "de"] as const;
const DEFAULT_LOCALE = "en";

const intlMiddleware = createMiddleware({
  locales: [...LOCALES],
  defaultLocale: DEFAULT_LOCALE,
});

export default function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Extract locale and path segments
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];
  const isLocaleInPath = LOCALES.includes(firstSegment as (typeof LOCALES)[number]);
  const currentLocale = isLocaleInPath
    ? firstSegment
    : request.cookies.get("NEXT_LOCALE")?.value || DEFAULT_LOCALE;

  const normalizedPath = isLocaleInPath
    ? `/${segments.slice(1).join("/")}`
    : pathname;

  // Handle Root and localized root paths ('/', '/en', '/de')
  if (normalizedPath === "/" || normalizedPath === "") {
    const savedRoute = request.cookies.get(
      COOKIE_KEYS.PREFERRED_HOME_ROUTE
    )?.value;

    let targetRoute: EntryRoute =
      savedRoute &&
      Object.values(ENTRY_ROUTES).includes(savedRoute as EntryRoute)
        ? (savedRoute as EntryRoute)
        : DEFAULT_ENTRY_ROUTE;

    // Create a mutable copy of the search params
    const redirectSearchParams = new URLSearchParams(request.nextUrl.search);

    // If target is Classic route and jobId is missing from URL, use remembered jobId
    if (targetRoute === ENTRY_ROUTES.CLASSIC) {
      if (!redirectSearchParams.has("jobId")) {
        const savedJobId = request.cookies.get(
          COOKIE_KEYS.LAST_CLASSIC_JOB_ID
        )?.value;
        if (savedJobId) {
          redirectSearchParams.set("jobId", savedJobId);
        } else {
          // Fallback to default route if no jobId is remembered
          targetRoute = DEFAULT_ENTRY_ROUTE;
        }
      }
    }

    const searchString = redirectSearchParams.toString()
      ? `?${redirectSearchParams.toString()}`
      : "";

    const redirectUrl = new URL(
      `/${currentLocale}${targetRoute}${searchString}`,
      request.url
    );

    const redirectResponse = NextResponse.redirect(redirectUrl);
    redirectResponse.cookies.set("NEXT_LOCALE", currentLocale, {
      path: "/",
      sameSite: "lax",
    });
    return redirectResponse;
  }

  // Next-intl routing middleware
  const response = intlMiddleware(request);

  // If visiting an entry flow route, set or update the preferred_home_route cookie
  const matchedEntry = Object.values(ENTRY_ROUTES).find(
    (route) =>
      normalizedPath === route ||
      normalizedPath.startsWith(`${route}/`) ||
      (route === ENTRY_ROUTES.ACCESS_CARDS &&
        (normalizedPath === "/photo-galleries/access-card" ||
          normalizedPath.startsWith("/photo-galleries/access-card/")))
  );

  if (matchedEntry) {
    // Only save classic route as preferred if a valid jobId is present
    if (matchedEntry === ENTRY_ROUTES.CLASSIC) {
      const currentJobId = searchParams.get("jobId");
      if (currentJobId) {
        response.cookies.set({
          name: COOKIE_KEYS.PREFERRED_HOME_ROUTE,
          value: matchedEntry,
          path: "/",
          maxAge: 60 * 60 * 24 * 365, // 1 year
          sameSite: "lax",
          httpOnly: false,
        });
        response.cookies.set({
          name: COOKIE_KEYS.LAST_CLASSIC_JOB_ID,
          value: currentJobId.trim(),
          path: "/",
          maxAge: 60 * 60 * 24 * 365, // 1 year
          sameSite: "lax",
          httpOnly: false,
        });
      }
    } else {
      response.cookies.set({
        name: COOKIE_KEYS.PREFERRED_HOME_ROUTE,
        value: matchedEntry,
        path: "/",
        maxAge: 60 * 60 * 24 * 365, // 1 year
        sameSite: "lax",
        httpOnly: false,
      });
    }
  }

  return response;
}

export const config = {
  matcher: ["/", "/(de|en)/:path*", "/((?!_next|_vercel|.*\\..*).*)"],
};
