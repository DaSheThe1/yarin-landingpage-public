import { getTranslations, setRequestLocale } from "next-intl/server";

import {
  FinalCta,
  FounderTeaser,
  HeroSection,
  OffersSection,
  PageShell,
  ProcessSection,
  ServicesTeaser,
} from "@/components/sections/marketing-sections";
import { FaqSection } from "@/components/sections/faq";
import { GalleryTeaser } from "@/components/sections/project-gallery";
import { JsonLd } from "@/components/seo/json-ld";
import type { Faq } from "@/content/faq";
import {
  faqPageSchema,
  organizationSchema,
  personSchema,
  webSiteSchema,
} from "@/lib/seo";
import { StatsSection } from "@/components/sections/stats";
import { Testimonials } from "@/components/sections/testimonials";
import { TrustBand } from "@/components/sections/trust-band";

// Single-page lead funnel: hero → services teaser → offer → proof → process →
// trust → founder → FAQ → CTA. Services sits directly under the hero (swapped
// with the stats/numbers section) so it's the first thing after the fold,
// notably on mobile. The deep dives (full services, project gallery, reviews,
// about) live on their own pages.
export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as "he");
  const t = await getTranslations({ locale: locale as "he", namespace: "faq" });
  const faqs = t.raw("items") as Faq[];

  return (
    <PageShell>
      <JsonLd data={organizationSchema()} />
      <JsonLd data={webSiteSchema(locale)} />
      <JsonLd data={personSchema()} />
      <JsonLd data={faqPageSchema(faqs)} />
      <HeroSection />
      <ServicesTeaser />
      <OffersSection />
      <StatsSection />
      <ProcessSection />
      <GalleryTeaser />
      <TrustBand />
      <Testimonials />
      <FounderTeaser />
      <FaqSection />
      <FinalCta />
    </PageShell>
  );
}
