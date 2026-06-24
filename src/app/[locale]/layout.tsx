import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Analytics } from "@/components/analytics/analytics";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { BackToTop, ScrollProgress } from "@/components/layout/scroll-utils";
import { SiteBackground } from "@/components/layout/site-background";
import { FloatingWhatsApp } from "@/components/layout/floating-whatsapp";
import { PageTransition } from "@/components/layout/page-transition";
import { LeadDialogProvider } from "@/components/lead/lead-dialog";
import { siteConfig } from "@/config/site";
import { localeDirection, routing, type Locale } from "@/i18n/routing";

import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// This is an intentionally dark-only ("black · gold · white") design. Declare
// the dark scheme to the UA so form controls/scrollbars render dark and no
// engine tries to re-light the page; `darkreader-lock` (below, in the metadata)
// opts out of the Dark Reader extension, which ignores color-scheme.
export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#0a0a0b",
};

// Per-locale root metadata. Hebrew (default) lives under /he and English under
// /en — alternates expose both to crawlers via hreflang.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as "he", namespace: "pages.home" });
  const canonical = siteConfig.url;

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: t("metaTitle"),
      template: `%s | ${siteConfig.name}`,
    },
    description: t("metaDescription"),
    alternates: {
      canonical,
    },
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: canonical,
      siteName: siteConfig.name,
      locale: "he_IL",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("metaTitle"),
      description: t("metaDescription"),
    },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
    // Opt out of the Dark Reader extension — it would otherwise re-tint this
    // intentionally dark, hand-tuned black/gold design.
    other: {
      "darkreader-lock": "1",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  // Enables static rendering for this locale.
  setRequestLocale(locale as "he" | "en");

  const dir = localeDirection[locale as Locale];

  return (
    <html
      lang={locale}
      dir={dir}
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <NextIntlClientProvider>
          <SiteBackground />
          <ScrollProgress />
          <LeadDialogProvider>
            <SiteHeader />
            <PageTransition>{children}</PageTransition>
            <SiteFooter />
            <BackToTop />
            <FloatingWhatsApp />
          </LeadDialogProvider>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
