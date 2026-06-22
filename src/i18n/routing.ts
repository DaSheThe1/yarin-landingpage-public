import { defineRouting } from "next-intl/routing";

// Hebrew-only for now. Hebrew is the sole locale and lives at the root
// (/, /services, ...). The next-intl machinery stays in place so a second
// locale (e.g. English under /en) can be added later by appending it to
// `locales` and switching `localePrefix` back to "as-needed"/"always".
export const routing = defineRouting({
  locales: ["he"],
  defaultLocale: "he",
  localePrefix: "as-needed",
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];

export const localeDirection: Record<Locale, "rtl" | "ltr"> = {
  he: "rtl",
};
