import Image from "next/image";
import type { ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  CheckCircle2,
  ClipboardList,
  FileText,
  Gauge,
  GitBranch,
  Library,
  MailCheck,
  Map,
  Network,
  Search,
  Server,
  ShieldCheck,
  Target,
  Workflow,
  Wrench,
} from "lucide-react";

import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { HeroVideo } from "@/components/sections/hero-video";
import { Reveal } from "@/components/ui/reveal";
import { WaveText } from "@/components/ui/wave-text";
import { serviceMedia } from "@/content/services";
import { processMedia } from "@/content/process";
import { offers } from "@/content/offers";
import { founderDisplayName, siteConfig } from "@/config/site";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const serviceIcons = [Workflow, Bot, FileText, Library, Network, Server];
const workflowIcons = [GitBranch, MailCheck, FileText, Workflow, Bot, Gauge];

type ServiceItem = { title: string; description: string; details: string[] };
type WorkflowItem = {
  title: string;
  flow: string;
  summary: string;
  outcome: string;
};
type OfferItem = {
  bestFor: string;
  title: string;
  summary: string;
  includes: string[];
  cta: string;
};
type TitledText = { title: string; text: string };

/* ──────────────────────────  Shared  ────────────────────────── */

export function PageShell({ children }: { children: ReactNode }) {
  return <main className="flex-1">{children}</main>;
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-surface-2/85 px-3.5 py-1.5 text-[13px] font-semibold tracking-[0.04em] text-brand-accent shadow-card backdrop-blur-sm">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-accent opacity-60" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-accent" />
      </span>
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  gradient = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  gradient?: boolean;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      {eyebrow ? (
        <div className={cn("mb-5", align === "center" && "flex justify-center")}>
          <Eyebrow>{eyebrow}</Eyebrow>
        </div>
      ) : null}
      <h2
        className={cn(
          "text-3xl font-medium tracking-tight text-balance sm:text-4xl",
          gradient ? "text-gradient" : "text-foreground"
        )}
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-[17px]">
          {description}
        </p>
      ) : null}
    </div>
  );
}

/* ──────────────────────────  Hero  ────────────────────────── */

export function HeroSection() {
  const t = useTranslations("hero");
  const badges = t.raw("badges") as string[];

  return (
    <section className="relative overflow-hidden">
      {/* Backdrop layers */}
      <div className="pointer-events-none absolute inset-0 bg-grid mask-fade opacity-60" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[42rem] w-[60rem] -translate-x-1/2 animate-aurora rounded-full bg-[radial-gradient(circle_at_center,rgba(37, 99, 235,0.45),transparent_60%)] blur-[90px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-10%] top-24 h-[28rem] w-[28rem] animate-float rounded-full bg-[radial-gradient(circle_at_center,rgba(37, 99, 235,0.3),transparent_60%)] blur-[100px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background"
      />

      {/* On mobile the showcase video is pulled up directly under the title so
          it's the immediate focal point (order-2); the subtitle + badges drop
          below it (order-3). On lg+ the natural reading order is restored. */}
      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center px-6 pb-16 pt-6 sm:pb-24 lg:pt-10">
        <div className="order-1 mx-auto max-w-3xl text-center">
          <Reveal className="flex justify-center">
            <Eyebrow>{t("eyebrow")}</Eyebrow>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-5 text-4xl font-medium leading-[1.05] tracking-tight text-balance sm:text-5xl lg:text-6xl">
              <WaveText
                cycle={10}
                text={`${t("titleLead")}${t("titleHighlight")}${t("titleTrail")}`}
              />
            </h1>
          </Reveal>
        </div>

        {/* Auto-playing render showcase — large and pulled high so it's the
            focal point. */}
        <Reveal delay={200} className="order-2 mt-8 w-full lg:order-3 lg:mt-14">
          <HeroVideo />
        </Reveal>

        {/* Trust badges sit directly under the video on every breakpoint, as
            readable pills (darker text + bordered chips) rather than faint
            inline text. */}
        <Reveal delay={220} className="order-3 mt-6 w-full lg:order-4 lg:mt-7">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {badges.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-2 rounded-full border border-brand/15 bg-surface-2/80 px-3.5 py-1.5 text-sm font-medium text-foreground-soft shadow-card backdrop-blur-sm"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-accent" />
                {item}
              </span>
            ))}
          </div>
        </Reveal>

        <div className="order-4 mx-auto mt-7 max-w-3xl text-center lg:order-2 lg:mt-6">
          <Reveal delay={160}>
            <p className="mx-auto max-w-2xl text-lg leading-8 text-foreground">
              {t("subtitle")}
            </p>
          </Reveal>
        </div>

        <Reveal delay={120} className="order-5 w-full">
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/contact"
              className={cn(
                buttonVariants({ variant: "brand" }),
                "h-11 rounded-lg px-5 text-[15px]"
              )}
            >
              {t("ctaPrimary")}
              <ArrowRight data-icon="inline-end" />
            </Link>
            <Link
              href="/examples"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-11 rounded-lg px-5 text-[15px]"
              )}
            >
              {t("ctaSecondary")}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ──────────────────────────  Problem  ────────────────────────── */

export function ProblemSection() {
  const t = useTranslations("problem");
  const problems = t.raw("items") as string[];

  return (
    <section className="bg-background px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            eyebrow={t("eyebrow")}
            title={t("title")}
            description={t("description")}
          />
        </Reveal>
        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {problems.map((problem, i) => (
            <Reveal key={problem} delay={i * 60}>
              <div className="group flex cursor-pointer select-none items-center gap-3 rounded-xl border border-black/[0.08] bg-black/[0.02] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-rose-400/40 hover:bg-rose-400/[0.06] hover:shadow-card">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400 transition-transform duration-300 group-hover:scale-110">
                  <span className="h-2 w-2 rounded-full bg-rose-400" />
                </span>
                <span className="text-sm font-medium text-foreground-soft transition-colors group-hover:text-foreground">
                  {problem}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────  Services  ────────────────────────── */

export function ServicesOverview({ expanded = false }: { expanded?: boolean }) {
  const t = useTranslations("services");
  const services = t.raw("items") as ServiceItem[];

  return (
    <section className="relative bg-background px-6 py-20 sm:py-24">
      <div className="pointer-events-none absolute inset-0 bg-dot mask-fade-b opacity-30" />
      <div className="relative mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            eyebrow={t("eyebrow")}
            title={t("title")}
            description={t("description")}
          />
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const Icon = serviceIcons[index] ?? Workflow;
            const media = serviceMedia[index];
            return (
              <Reveal key={service.title} delay={(index % 3) * 80}>
                <Card className="h-full">
                  <CardContent className="flex h-full flex-col">
                    {expanded && media ? (
                      <div className="relative mb-5 -mt-1 aspect-video overflow-hidden rounded-xl border border-black/[0.08] bg-surface-1">
                        {media.type === "video" ? (
                          <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            className="absolute inset-0 h-full w-full object-cover"
                          >
                            <source src={media.src} type="video/mp4" />
                          </video>
                        ) : (
                          <Image
                            src={media.src}
                            alt={media.alt ?? service.title}
                            fill
                            sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 90vw"
                            className="object-cover"
                          />
                        )}
                      </div>
                    ) : null}
                    <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-black/10 bg-brand/10 text-brand-accent transition-all duration-300 group-hover/card:scale-110 group-hover/card:border-brand/40 group-hover/card:bg-brand/20">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-medium tracking-tight text-foreground">
                      {service.title}
                    </h3>
                    <CardDescription className="mt-2 leading-6 text-muted-foreground">
                      {service.description}
                    </CardDescription>
                    {expanded ? (
                      <ul className="mt-5 space-y-2.5 border-t border-black/[0.06] pt-5 text-sm text-foreground-soft">
                        {service.details.map((detail) => (
                          <li key={detail} className="flex gap-2.5">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-accent" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </CardContent>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────  Workflow examples  ────────────────────────── */

export function WorkflowExamples({ expanded = false }: { expanded?: boolean }) {
  const t = useTranslations("workflows");
  const workflows = t.raw("items") as WorkflowItem[];

  return (
    <section className="bg-background px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            eyebrow={t("eyebrow")}
            title={t("title")}
            description={t("description")}
          />
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {workflows.map((workflow, index) => {
            const Icon = workflowIcons[index] ?? Workflow;
            return (
              <Reveal key={workflow.title} delay={(index % 3) * 80}>
                <Card className="h-full">
                  <CardContent className="flex h-full flex-col">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-black/[0.04] text-foreground-soft transition-all duration-300 group-hover/card:scale-110 group-hover/card:border-brand/40 group-hover/card:bg-brand/15 group-hover/card:text-brand-accent">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-[17px] font-medium tracking-tight text-foreground">
                      {workflow.title}
                    </h3>
                    <p className="mt-2 inline-flex w-fit rounded-md border border-black/[0.06] bg-black/[0.03] px-2 py-1 font-mono text-[11px] text-brand-accent">
                      {workflow.flow}
                    </p>
                    <CardDescription className="mt-3 leading-6 text-muted-foreground">
                      {workflow.summary}
                    </CardDescription>
                    {expanded ? (
                      <p className="mt-auto flex items-start gap-2 border-t border-black/[0.06] pt-4 text-sm text-emerald-700">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                        {workflow.outcome}
                      </p>
                    ) : null}
                  </CardContent>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────  Process  ────────────────────────── */

export function ProcessSection() {
  const t = useTranslations("process");
  const steps = t.raw("steps") as TitledText[];
  const icons = [Search, Map, Target, Wrench, ShieldCheck, ClipboardList];

  return (
    <section className="relative overflow-hidden bg-background px-6 pt-10 pb-16 sm:pt-12 sm:pb-20">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[24rem] w-[48rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/10 blur-[120px]"
      />
      <div className="relative mx-auto max-w-4xl">
        <Reveal>
          <SectionHeading
            eyebrow={t("eyebrow")}
            align="center"
            title={t("title")}
            description={t("description")}
          />
        </Reveal>

        <div className="relative mt-10 sm:mt-12">
          {/* Timeline spine */}
          <div
            aria-hidden
            className="absolute bottom-10 start-[1.34rem] top-3 w-px bg-gradient-to-b from-brand-accent/70 via-brand/35 to-transparent md:start-1/2 md:-translate-x-1/2 rtl:md:translate-x-1/2"
          />
          {/* On desktop each step is pulled up into the previous one's lower
              half (it sits on the opposite side of the spine, so they never
              collide) — so step 02 begins around the middle of step 01 and the
              nodes read as a tight, continuous timeline instead of an endless
              vertical scroll. On mobile they stack normally. */}
          <ol className="space-y-7 md:space-y-0">
            {steps.map((step, index) => {
              const Icon = icons[index] ?? Target;
              const onRight = index % 2 === 1;
              const media = processMedia[index];
              return (
                <li
                  key={step.title}
                  className={cn(
                    "relative ps-16 md:ps-0",
                    index > 0 && "md:-mt-20"
                  )}
                >
                  {/* Node on the spine */}
                  <Reveal
                    delay={60}
                    className="absolute start-0 top-0 md:start-1/2 md:-translate-x-1/2 rtl:md:translate-x-1/2"
                  >
                    <span className="relative flex h-11 w-11 items-center justify-center rounded-full border border-brand/40 bg-surface-2 text-brand-accent shadow-[0_0_0_4px_rgba(246,247,248,1),0_0_24px_-4px_rgba(37, 99, 235,0.6)]">
                      <Icon className="h-5 w-5" />
                    </span>
                  </Reveal>
                  <Reveal
                    delay={140}
                    className={cn(
                      "md:w-[calc(50%-3.25rem)]",
                      onRight
                        ? "md:ms-auto md:text-start"
                        : "md:me-auto md:text-end"
                    )}
                  >
                    <span className="font-mono text-xs uppercase tracking-[0.18em] text-brand-accent">
                      {t("stepLabel")} 0{index + 1}
                    </span>
                    <p className="mt-1 text-lg font-medium tracking-tight text-foreground">
                      {step.title}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-foreground">
                      {step.text}
                    </p>
                    {media ? (
                      <div
                        className={cn(
                          "group relative mt-3 aspect-[16/9] w-full max-w-[180px] overflow-hidden rounded-lg border border-black/[0.08] bg-surface-1 shadow-card",
                          onRight ? "md:me-auto" : "md:ms-auto"
                        )}
                      >
                        <Image
                          src={media.src}
                          alt={media.alt}
                          fill
                          sizes="(min-width: 768px) 180px, 90vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                        />
                      </div>
                    ) : null}
                  </Reveal>
                </li>
              );
            })}
          </ol>

          {/* Timeline endpoint */}
          <Reveal className="mt-10 flex justify-start ps-1 md:justify-center md:ps-0">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-sm text-brand-accent">
              <CheckCircle2 className="h-4 w-4" />
              {t("endpoint")}
            </span>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────  Services teaser (home)  ────────────────────────── */

export function ServicesTeaser() {
  const t = useTranslations("servicesTeaser");
  const tServices = useTranslations("services");
  const services = tServices.raw("items") as ServiceItem[];

  return (
    <section className="bg-background px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="ring-shine relative grid gap-10 overflow-hidden rounded-3xl border border-black/[0.08] bg-surface-1 p-7 sm:p-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div
              aria-hidden
              className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-brand/15 blur-[100px]"
            />
            <div className="relative">
              <SectionHeading
                eyebrow={t("eyebrow")}
                title={t("title")}
                description={t("description")}
              />
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/services"
                  className={cn(
                    buttonVariants({ variant: "brand" }),
                    "h-11 rounded-lg px-5 text-[15px]"
                  )}
                >
                  {t("cta")}
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </div>
            </div>
            <div className="relative grid gap-2.5 sm:grid-cols-2">
              {services.map((service, index) => {
                const Icon = serviceIcons[index] ?? Workflow;
                return (
                  <Link
                    key={service.title}
                    href="/services"
                    className="group flex items-center gap-3 rounded-xl border border-black/[0.08] bg-black/[0.02] p-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/30 hover:bg-black/[0.04]"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-black/10 bg-brand/10 text-brand-accent transition-transform duration-300 group-hover:scale-110">
                      <Icon className="h-4.5 w-4.5" />
                    </span>
                    <span className="text-sm font-medium leading-5 text-foreground-soft transition-colors group-hover:text-foreground">
                      {service.title}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ──────────────────────────  Offers  ────────────────────────── */

export function OffersSection() {
  const t = useTranslations("offers");
  const items = t.raw("items") as OfferItem[];
  // Until there's a real menu of packages, show the single flagship offer.
  const offer = items[offers.findIndex((o) => o.featured)] ?? items[0];

  return (
    <section className="bg-background px-6 pt-20 pb-12 sm:pt-24 sm:pb-14">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow={t("eyebrow")}
            title={t("title")}
            description={t("description")}
          />
        </Reveal>
        <Reveal delay={120}>
          <div className="ring-shine glow-breathe relative mx-auto mt-12 grid gap-8 overflow-hidden rounded-3xl border border-brand/35 bg-brand/[0.05] p-7 sm:p-10 md:grid-cols-[1fr_1px_1fr] md:items-center">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-20 h-72 w-72 rounded-full bg-brand/20 blur-[100px]"
            />
            <div className="relative">
              <span className="inline-flex w-fit rounded-full bg-brand px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-primary-foreground">
                {offer.bestFor}
              </span>
              <h3 className="mt-5 text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
                {offer.title}
              </h3>
              <p className="mt-3 leading-7 text-muted-foreground">
                {offer.summary}
              </p>
              <Link
                href="/contact"
                className={cn(
                  buttonVariants({ variant: "brand" }),
                  "mt-7 h-11 rounded-lg px-5 text-[15px]"
                )}
              >
                {offer.cta}
                <ArrowRight data-icon="inline-end" />
              </Link>
            </div>
            <div aria-hidden className="hidden h-full w-px bg-black/[0.08] md:block" />
            <ul className="relative space-y-3.5 text-sm text-foreground-soft">
              {offer.includes.map((item) => (
                <li key={item} className="flex gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-brand-accent" />
                  <span className="leading-6">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <Reveal>
          <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-subtle-foreground">
            {t("note")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ──────────────────────────  Why  ────────────────────────── */

export function WhySection() {
  const t = useTranslations("why");
  const reasons = t.raw("items") as TitledText[];

  return (
    <section className="bg-background px-6 py-20 sm:py-24">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <Reveal>
          <SectionHeading
            eyebrow={t("eyebrow")}
            title={t("title")}
            description={t("description")}
          />
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2">
          {reasons.map((reason, i) => (
            <Reveal key={reason.title} delay={i * 80} className="h-full">
              <div className="group h-full cursor-pointer select-none rounded-xl border border-black/[0.08] bg-black/[0.02] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:bg-black/[0.04] hover:shadow-card">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 bg-brand/10 text-brand-accent transition-all duration-300 group-hover:scale-110 group-hover:border-brand/40 group-hover:bg-brand/20">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <p className="mt-4 text-[15px] font-medium text-foreground">
                  {reason.title}
                </p>
                <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                  {reason.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────  Founder  ────────────────────────── */

export function FounderTeaser() {
  const t = useTranslations("founder");
  const locale = useLocale();
  const founderName = founderDisplayName(locale);
  const chips = t.raw("chips") as string[];

  return (
    <section className="bg-background px-6 py-12 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="ring-shine relative grid gap-8 overflow-hidden rounded-2xl border border-black/[0.08] bg-black/[0.02] p-6 md:grid-cols-[0.85fr_1.15fr] md:p-8">
            <div
              aria-hidden
              className="pointer-events-none absolute -left-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-brand/20 blur-[80px]"
            />
            <div className="relative min-h-80 overflow-hidden rounded-xl border border-black/[0.08] bg-surface-1">
              {/* Placeholder until a real portrait is provided — uses the same
                  brand mark as the header, on a soft blue wash. */}
              <div
                aria-hidden
                className="absolute inset-0 grid place-items-center bg-gradient-to-br from-brand/20 via-brand/5 to-surface-3"
              >
                <Image
                  src="/images/yarin-icon.webp"
                  alt=""
                  width={128}
                  height={128}
                  className="h-28 w-28 rounded-full object-cover shadow-[0_0_0_1px_rgba(37,99,235,0.45),0_12px_40px_-8px_rgba(37,99,235,0.6)]"
                />
              </div>
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent"
              />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <p className="text-lg font-medium tracking-tight">
                  {founderName}
                </p>
                <p className="mt-0.5 text-sm text-white/80">{t("role")}</p>
                <div className="mt-3 hidden flex-wrap gap-1.5 sm:flex">
                  {chips.map((chip) => (
                    <span
                      key={chip}
                      className="rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 font-mono text-[11px] text-white/90 backdrop-blur-sm"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="relative self-center">
              <Eyebrow>{t("eyebrow")}</Eyebrow>
              <h2 className="mt-4 text-3xl font-medium tracking-tight text-balance">
                {t("title")}
              </h2>
              <p className="mt-4 leading-7 text-muted-foreground">
                {t("body", {
                  brand: siteConfig.name,
                  founder: founderName,
                })}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/about"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "h-10 rounded-lg px-4"
                  )}
                >
                  {t("more", { founder: founderName })}
                  <ArrowUpRight data-icon="inline-end" />
                </Link>
                <a
                  href={`https://wa.me/${siteConfig.phoneE164.replace("+", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "h-10 rounded-lg px-4"
                  )}
                >
                  WhatsApp
                  <ArrowUpRight data-icon="inline-end" />
                </a>
                <a
                  href={`tel:${siteConfig.phoneE164}`}
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "h-10 rounded-lg px-4"
                  )}
                >
                  {siteConfig.phone}
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ──────────────────────────  Final CTA  ────────────────────────── */

export function FinalCta() {
  const t = useTranslations("finalCta");

  return (
    <section className="bg-background px-6 pb-28 pt-4">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-black/[0.08] bg-surface-1 px-6 py-16 text-center sm:px-10">
            <div className="pointer-events-none absolute inset-0 bg-grid mask-fade opacity-50" />
            <div
              aria-hidden
              className="pointer-events-none absolute -top-32 left-1/2 h-80 w-[44rem] -translate-x-1/2 animate-aurora rounded-full bg-[radial-gradient(circle_at_center,rgba(37, 99, 235,0.5),transparent_60%)] blur-[80px]"
            />
            <div className="relative">
              <h2 className="mx-auto max-w-2xl text-3xl font-medium tracking-tight text-balance sm:text-4xl">
                {t("titleLead")}
                <span className="text-gradient">{t("titleHighlight")}</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-muted-foreground">
                {t("body")}
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className={cn(
                    buttonVariants({ variant: "brand" }),
                    "h-11 rounded-lg px-5 text-[15px]"
                  )}
                >
                  {t("ctaPrimary")}
                  <ArrowRight data-icon="inline-end" />
                </Link>
                <Link
                  href="/services"
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "h-11 rounded-lg px-5 text-[15px]"
                  )}
                >
                  {t("ctaSecondary")}
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
