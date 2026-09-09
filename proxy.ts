import { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";

const intlMiddleware = createMiddleware({
  locales: ["en", "de"],
  defaultLocale: "en",
});

export default function proxy(request: NextRequest) {
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/", "/(de|en)/:path*", "/((?!_next|_vercel|.*\\..*).*)"],
};
