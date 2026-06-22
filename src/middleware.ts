import createMiddleware from "next-intl/middleware";

import { routing } from "@/i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Run on every path except API routes, Next internals, and files with an
  // extension (static assets). Locale detection/routing happens here.
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
