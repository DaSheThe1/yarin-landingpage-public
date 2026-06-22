// `key` maps to the `nav.*` message keys; labels are translated at render time.
export const mainNavigation = [
  { key: "services", href: "/services" },
  { key: "examples", href: "/examples" },
  { key: "about", href: "/about" },
  { key: "reviews", href: "/reviews" },
  { key: "contact", href: "/contact" },
] as const;

export const legalNavigation = [
  { key: "privacy", href: "/privacy" },
  { key: "terms", href: "/terms" },
] as const;
