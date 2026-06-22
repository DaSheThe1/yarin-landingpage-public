import { Quote } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Reveal } from "@/components/ui/reveal";
import { founderDisplayName } from "@/config/site";

export function TrustBand() {
  const t = useTranslations("trustBand");
  const locale = useLocale();
  const principles = t.raw("principles") as string[];

  return (
    <section className="bg-background px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-black/[0.08] bg-surface-1 px-6 py-14 text-center sm:px-12">
            <div className="pointer-events-none absolute inset-0 bg-grid mask-fade opacity-40" />
            <div
              aria-hidden
              className="pointer-events-none absolute -top-24 left-1/2 h-56 w-[36rem] -translate-x-1/2 rounded-full bg-brand/15 blur-[100px]"
            />
            <div className="relative">
              <Quote className="mx-auto h-8 w-8 text-brand-accent" />
              <p className="mx-auto mt-6 max-w-2xl text-balance text-2xl font-medium leading-snug tracking-tight text-foreground sm:text-3xl">
                {t("quoteLead")}
                <span className="text-gradient">{t("quoteHighlight")}</span>
              </p>
              <p className="mt-6 font-mono text-xs uppercase tracking-wider text-subtle-foreground">
                {t("attribution", { founder: founderDisplayName(locale) })}
              </p>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-3">
                {principles.map((p) => (
                  <span
                    key={p}
                    className="rounded-full border border-black/[0.1] bg-black/[0.03] px-4 py-1.5 text-sm text-foreground-soft"
                  >
                    {p.replace("{founder}", founderDisplayName(locale))}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
