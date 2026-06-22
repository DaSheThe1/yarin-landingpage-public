"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowRight, Menu, X } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { mainNavigation } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const t = useTranslations("header");
  const tNav = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-300",
        scrolled
          ? "border-black/[0.08] bg-background/80 backdrop-blur-xl"
          : "border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-6">
        <Link
          href="/"
          className="group flex items-center gap-2.5 text-[15px] font-semibold tracking-tight text-foreground"
        >
          <Image
            src="/images/yarin-icon.png"
            alt={siteConfig.name}
            width={32}
            height={32}
            priority
            className="h-8 w-8 rounded-full object-cover shadow-[0_0_0_1px_rgba(37, 99, 235,0.5),0_4px_16px_-4px_rgba(37, 99, 235,0.8)] transition-transform group-hover:scale-105"
          />
          {siteConfig.name}
        </Link>

        <nav
          aria-label={t("mainNav")}
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex"
        >
          {mainNavigation.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm transition-colors",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tNav(item.key)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={siteConfig.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("whatsapp")}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#25d366]/30 bg-[#25d366]/10 text-[#1b9c4c] transition-colors hover:border-[#25d366]/50 hover:bg-[#25d366]/15"
          >
            <WhatsAppIcon className="h-4.5 w-4.5" />
          </a>
          <Link
            href="/contact"
            className={cn(
              buttonVariants({ variant: "brand", size: "sm" }),
              "hidden h-9 rounded-lg px-4 sm:inline-flex"
            )}
          >
            {t("cta")}
            <ArrowRight data-icon="inline-end" />
          </Link>
          <button
            type="button"
            aria-label={t("toggleMenu")}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 bg-black/[0.03] text-foreground-soft transition-colors hover:bg-black/[0.08] md:hidden"
          >
            {open ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "overflow-hidden border-t border-black/[0.06] bg-background/95 backdrop-blur-xl transition-[max-height,opacity] duration-300 md:hidden",
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav
          aria-label={t("mobileNav")}
          className="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-4"
        >
          {mainNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "rounded-lg px-3 py-2.5 text-sm transition-colors",
                pathname === item.href
                  ? "bg-black/[0.05] text-foreground"
                  : "text-muted-foreground hover:bg-black/[0.04] hover:text-foreground"
              )}
            >
              {tNav(item.key)}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className={cn(
              buttonVariants({ variant: "brand" }),
              "mt-2 h-10 rounded-lg px-4"
            )}
          >
            {t("cta")}
            <ArrowRight data-icon="inline-end" />
          </Link>
          <a
            href={siteConfig.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#25d366]/30 bg-[#25d366]/10 px-4 text-sm font-medium text-[#1b9c4c] transition-colors hover:bg-[#25d366]/15"
          >
            <WhatsAppIcon className="h-4.5 w-4.5" />
            {t("whatsapp")}
          </a>
        </nav>
      </div>
    </header>
  );
}
