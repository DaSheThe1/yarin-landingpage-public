import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  ArrowRight,
  ArrowUpRight,
  Boxes,
  FileText,
  MapPin,
  Network,
  Server,
  ShieldCheck,
  Terminal,
  Workflow,
  Wrench,
} from "lucide-react";

import {
  Eyebrow,
  FinalCta,
  PageShell,
  WhySection,
} from "@/components/sections/marketing-sections";
import { PageHero } from "@/components/sections/page-hero";
import { JsonLd } from "@/components/seo/json-ld";
import { Reveal } from "@/components/ui/reveal";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { Link } from "@/i18n/navigation";
import { breadcrumbSchema, pageMetadata, personSchema } from "@/lib/seo";
import { cn } from "@/lib/utils";

const credentialIcons = [
  Server,
  Terminal,
  Workflow,
  FileText,
  Network,
  ShieldCheck,
];
const quickFactIcons = [MapPin, Wrench, Boxes];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as "he" | "en", namespace: "pages.about" });
  return pageMetadata({
    locale,
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/about",
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as "he" | "en");
  const t = await getTranslations({ locale: locale as "he" | "en", namespace: "pages.about" });
  const tNav = await getTranslations({ locale: locale as "he" | "en", namespace: "nav" });
  const tCommon = await getTranslations({ locale: locale as "he" | "en", namespace: "common" });
  const quickFacts = t.raw("quickFacts") as string[];
  const story = t.raw("story") as string[];
  const credentials = t.raw("credentials") as string[];

  return (
    <PageShell>
      <JsonLd
        data={breadcrumbSchema(
          [{ name: tNav("about"), path: "/about" }],
          tNav("home")
        )}
      />
      <JsonLd data={personSchema()} />
      <PageHero
        eyebrow={t("heroEyebrow")}
        title={
          <>
            {t("heroTitleLead")}
            <span className="text-gradient">{t("heroTitleHighlight")}</span>
          </>
        }
        description={t("heroDescription")}
      >
        <div className="mt-7 flex flex-wrap gap-2.5">
          {quickFacts.map((fact, i) => {
            const Icon = quickFactIcons[i] ?? MapPin;
            return (
              <span
                key={fact}
                className="inline-flex items-center gap-2 rounded-full border border-black/[0.1] bg-black/[0.03] px-3.5 py-1.5 text-sm text-foreground-soft"
              >
                <Icon className="h-4 w-4 text-brand-accent" />
                {fact}
              </span>
            );
          })}
        </div>
      </PageHero>

      <section className="bg-background px-6 py-20 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <div>
              <div className="relative mb-8 aspect-[4/3] overflow-hidden rounded-2xl border border-black/[0.08] bg-surface-1 shadow-card">
                <Image
                  src="/images/yarin-portrait.png"
                  alt={siteConfig.founder.nameHe}
                  fill
                  sizes="(min-width: 1024px) 45vw, 90vw"
                  className="object-cover object-top"
                  priority
                />
              </div>
              <Eyebrow>{t("storyEyebrow")}</Eyebrow>
              <h2 className="mt-5 text-3xl font-medium tracking-tight text-balance">
                {t("storyTitle")}
              </h2>
              {story.map((paragraph) => (
                <p
                  key={paragraph}
                  className="mt-4 leading-7 text-muted-foreground"
                >
                  {paragraph}
                </p>
              ))}
              <p className="mt-4 font-medium leading-7 text-foreground">
                {t("storyClose")}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className={cn(
                    buttonVariants({ variant: "brand" }),
                    "h-11 rounded-lg px-5 text-[15px]"
                  )}
                >
                  {tCommon("bookAuditPrimary")}
                  <ArrowRight data-icon="inline-end" />
                </Link>
                <a
                  href={`https://wa.me/${siteConfig.phoneE164.replace("+", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "h-11 rounded-lg px-5 text-[15px]"
                  )}
                >
                  WhatsApp
                  <ArrowUpRight data-icon="inline-end" />
                </a>
                <a
                  href={`tel:${siteConfig.phoneE164}`}
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "h-11 rounded-lg px-5 text-[15px]"
                  )}
                >
                  {siteConfig.phone}
                </a>
              </div>
            </div>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {credentials.map((text, i) => {
              const Icon = credentialIcons[i] ?? Server;
              return (
                <Reveal key={text} delay={i * 70}>
                  <div className="group h-full rounded-xl border border-black/[0.08] bg-black/[0.02] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/30 hover:bg-black/[0.04] hover:shadow-card">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 bg-brand/10 text-brand-accent transition-transform duration-300 group-hover:scale-110">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="mt-4 text-sm font-medium leading-6 text-foreground-soft">
                      {text}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <WhySection />
      <FinalCta />
    </PageShell>
  );
}
