export const siteConfig = {
  // Hebrew display brand used across the UI.
  name: "ירין אליה אברהם",
  // Latin/canonical name for schema.org and SEO (kept stable across locales).
  legalName: "Yarin Eliya Avraham",
  // Two-letter monogram shown in the header/footer logo badge.
  monogram: "יא",
  // TODO: confirm the real production domain with Yarin before launch.
  domain: "yarin-architecture.com",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://yarin-architecture.com",
  email: "yarinavraham96@gmail.com",
  // Display phone (Hebrew/local format) + E.164 for tel: links.
  phone: "050-901-0688",
  phoneE164: "+972509010688",
  // wa.me wants the number in international form without "+" or separators.
  whatsappUrl: "https://wa.me/972509010688",
  // Public profiles, surfaced as schema.org `sameAs` for entity disambiguation
  // (the strongest lever for AI answer engines to pin and cite the entity).
  // Add more as they go live — empty strings are filtered out before use.
  profiles: {
    instagram: "https://www.instagram.com/yarin.architecture",
  },
  defaultTitle:
    "ירין אליה אברהם | תכנון ועיצוב פנים לוילות ובתי יוקרה",
  description:
    "ליווי פרימיום אישי בתכנון ועיצוב פנים לוילות ובתי יוקרה במרכז ובצפון — מבנייה חדשה ועד שיפוץ. השאירו פרטים לפגישת ייעוץ ראשונית בשווי ₪997, בחינם.",
  founder: {
    // Latin name stays canonical for SEO / schema.org.
    name: "Yarin Eliya Avraham",
    // Hebrew display name for user-facing copy.
    nameHe: "ירין אליה אברהם",
    role: "אדריכלות ועיצוב פנים",
    roleEn: "Architect & Interior Designer",
    location: "Israel",
    experienceYears: 5,
  },
};

/** Founder display name for UI copy — Hebrew on the he locale, Latin elsewhere. */
export function founderDisplayName(locale: string) {
  return locale === "he" ? siteConfig.founder.nameHe : siteConfig.founder.name;
}
