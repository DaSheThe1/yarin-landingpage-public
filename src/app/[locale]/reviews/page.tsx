import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { FinalCta, PageShell } from "@/components/sections/marketing-sections";
import { PageHero } from "@/components/sections/page-hero";
import { Testimonials } from "@/components/sections/testimonials";
import { TrustBand } from "@/components/sections/trust-band";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as "he" | "en", namespace: "pages.reviews" });
  return pageMetadata({
    locale,
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/reviews",
  });
}

export default async function ReviewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as "he" | "en");
  const t = await getTranslations({ locale: locale as "he" | "en", namespace: "pages.reviews" });
  const tNav = await getTranslations({ locale: locale as "he" | "en", namespace: "nav" });

  return (
    <PageShell>
      <JsonLd
        data={breadcrumbSchema(
          [{ name: tNav("reviews"), path: "/reviews" }],
          tNav("home")
        )}
      />
      <PageHero
        eyebrow={t("heroEyebrow")}
        title={
          <>
            {t("heroTitleLead")}
            <span className="text-gradient">{t("heroTitleHighlight")}</span>
          </>
        }
        description={t("heroDescription")}
      />
      <Testimonials showHeading={false} />
      <TrustBand />
      <FinalCta />
    </PageShell>
  );
}
