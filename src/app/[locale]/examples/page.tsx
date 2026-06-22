import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import {
  FinalCta,
  PageShell,
  WorkflowExamples,
} from "@/components/sections/marketing-sections";
import { PageHero } from "@/components/sections/page-hero";
import { ProjectGallery } from "@/components/sections/project-gallery";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as "he" | "en", namespace: "pages.examples" });
  return pageMetadata({
    locale,
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/examples",
  });
}

export default async function ExamplesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as "he" | "en");
  const t = await getTranslations({ locale: locale as "he" | "en", namespace: "pages.examples" });
  const tNav = await getTranslations({ locale: locale as "he" | "en", namespace: "nav" });

  return (
    <PageShell>
      <JsonLd
        data={breadcrumbSchema(
          [{ name: tNav("examples"), path: "/examples" }],
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
      <ProjectGallery />
      <WorkflowExamples expanded />
      <FinalCta />
    </PageShell>
  );
}
