import Image from "next/image";
import { ArrowUpRight, Mail, Phone } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { legalNavigation, mainNavigation } from "@/config/navigation";
import { founderDisplayName, siteConfig } from "@/config/site";
import { LeadButton } from "@/components/lead/lead-button";
import { InstagramIcon } from "@/components/ui/instagram-icon";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { Link } from "@/i18n/navigation";

export function SiteFooter() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const tWa = useTranslations("floatingWhatsapp");
  const locale = useLocale();
  const year = new Date().getFullYear();
  // WhatsApp deep link with a ready-to-send Hebrew message.
  const whatsappHref = `${siteConfig.whatsappUrl}?text=${encodeURIComponent(
    tWa("message")
  )}`;

  return (
    <footer className="relative overflow-hidden border-t border-white/[0.08] bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[44rem] -translate-x-1/2 rounded-full bg-brand/20 blur-[120px]"
      />

      <div className="relative mx-auto w-full max-w-6xl px-6">
        {/* CTA strip */}
        <div className="flex flex-col items-start justify-between gap-6 border-b border-white/[0.06] py-12 md:flex-row md:items-center">
          <div>
            {/* Not a heading: this CTA repeats on every page and would add a
                duplicate h2 to every document outline. */}
            <p className="text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
              {t("ctaTitle")}
            </p>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              {t("ctaText")}
            </p>
          </div>
          <LeadButton
            variant="brand"
            className="h-11 shrink-0 rounded-lg px-5 text-[15px]"
          >
            {t("cta")}
            <ArrowUpRight data-icon="inline-end" />
          </LeadButton>
        </div>

        {/* Columns */}
        <div className="grid gap-10 py-14 text-sm md:grid-cols-[1.4fr_0.8fr_0.8fr]">
          <div>
            <Link
              href="/"
              className="flex items-center gap-2.5 text-[15px] font-semibold tracking-tight text-foreground"
            >
              <Image
                src="/images/yarin-icon.webp"
                alt={siteConfig.name}
                width={28}
                height={28}
                className="h-7 w-7 rounded-full object-cover shadow-[0_0_0_1px_rgba(201,168,76,0.5)]"
              />
              {siteConfig.name}
            </Link>
            <p className="mt-4 max-w-sm leading-6 text-muted-foreground">
              {t("blurb", { founder: founderDisplayName(locale) })}
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <a
                href={`mailto:${siteConfig.email}`}
                className="group inline-flex w-fit items-center gap-2.5 text-brand-accent transition-colors hover:text-brand-hover"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand-accent transition-colors group-hover:bg-brand/15">
                  <Mail className="h-4 w-4" />
                </span>
                <span dir="ltr">{siteConfig.email}</span>
              </a>
              <a
                href={`tel:${siteConfig.phoneE164}`}
                className="group inline-flex w-fit items-center gap-2.5 text-brand-accent transition-colors hover:text-brand-hover"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand-accent transition-colors group-hover:bg-brand/15">
                  <Phone className="h-4 w-4" />
                </span>
                <span dir="ltr">{siteConfig.phone}</span>
              </a>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex w-fit items-center gap-2.5 text-[#34d36f] transition-colors hover:text-[#4ade80]"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#25d366]/12 text-[#34d36f] transition-colors group-hover:bg-[#25d366]/20">
                  <WhatsAppIcon className="h-4 w-4" />
                </span>
                {t("whatsapp")}
              </a>
              <a
                href={siteConfig.profiles.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex w-fit items-center gap-2.5 text-brand-accent transition-colors hover:text-brand-hover"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand-accent transition-colors group-hover:bg-brand/15">
                  <InstagramIcon className="h-4 w-4" />
                </span>
                {t("instagram")}
              </a>
            </div>
          </div>

          <nav aria-label={t("footerNav")} className="flex flex-col gap-3">
            <p className="font-mono text-xs uppercase tracking-wider text-subtle-foreground">
              {t("pages")}
            </p>
            {mainNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="w-fit text-muted-foreground transition-colors hover:text-foreground"
              >
                {tNav(item.key)}
              </Link>
            ))}
          </nav>

          <nav aria-label={t("legalNav")} className="flex flex-col gap-3">
            <p className="font-mono text-xs uppercase tracking-wider text-subtle-foreground">
              {t("legal")}
            </p>
            {legalNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="w-fit text-muted-foreground transition-colors hover:text-foreground"
              >
                {tNav(item.key)}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col items-start justify-between gap-3 border-t border-white/[0.06] py-7 text-xs text-subtle-foreground sm:flex-row sm:items-center">
          <p>{t("rights", { year, brand: siteConfig.name })}</p>
          <p>{t("tagline")}</p>
        </div>
      </div>
    </footer>
  );
}
