"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, Info, Quote } from "lucide-react";

import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/sections/marketing-sections";
import { testimonialsAreSamples } from "@/content/testimonials";
import { cn } from "@/lib/utils";

const AUTO_MS = 6000;

type Testimonial = {
  quote: string;
  author: string;
  role: string;
  result?: string;
};

export function Testimonials({ showHeading = true }: { showHeading?: boolean }) {
  const t = useTranslations("testimonials");
  const items = t.raw("items") as Testimonial[];
  const count = items.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback(
    (dir: number) => setActive((i) => (i + dir + count) % count),
    [count]
  );

  // Auto-advance, paused on hover/focus or when reduced motion is requested.
  useEffect(() => {
    if (count <= 1 || paused) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const id = setInterval(() => setActive((i) => (i + 1) % count), AUTO_MS);
    return () => clearInterval(id);
  }, [count, paused, active]);

  // Nothing fake ships — hide the whole section until quotes exist.
  if (count === 0) return null;

  return (
    <section className="bg-background px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-4xl">
        {showHeading ? (
          <Reveal className="text-center">
            <SectionHeading
              eyebrow={t("eyebrow")}
              align="center"
              title={t("title")}
              description={t("description")}
            />
          </Reveal>
        ) : null}

        {testimonialsAreSamples ? (
          <Reveal delay={60}>
            <p
              className={cn(
                "mx-auto flex w-fit items-center gap-2 rounded-full border border-black/10 bg-black/[0.03] px-4 py-1.5 text-xs text-muted-foreground",
                showHeading ? "mt-8" : "mt-0"
              )}
            >
              <Info className="h-3.5 w-3.5 shrink-0" />
              {t("samplesNotice")}
            </p>
          </Reveal>
        ) : null}

        <Reveal delay={120}>
          <div
            className="relative mt-8 sm:mt-10"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={() => setPaused(false)}
          >
            <Carousel
              items={items}
              active={active}
              go={go}
              count={count}
              onDragStateChange={setPaused}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Carousel({
  items,
  active,
  go,
  count,
  onDragStateChange,
}: {
  items: Testimonial[];
  active: number;
  go: (dir: number) => void;
  count: number;
  onDragStateChange: (dragging: boolean) => void;
}) {
  const t = useTranslations("testimonials");
  // Drag-to-navigate with mouse or finger: the track follows the pointer,
  // then snaps to the nearest slide on release.
  const viewportRef = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<{ startX: number; dx: number } | null>(null);

  const onPointerDown = (e: React.PointerEvent) => {
    if (count <= 1) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDrag({ startX: e.clientX, dx: 0 });
    onDragStateChange(true);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    setDrag((d) => (d ? { ...d, dx: e.clientX - d.startX } : d));
  };
  const endDrag = () => {
    if (!drag) return;
    const width = viewportRef.current?.offsetWidth ?? 1;
    if (Math.abs(drag.dx) > Math.max(48, width * 0.15)) {
      go(drag.dx < 0 ? 1 : -1);
    }
    setDrag(null);
    onDragStateChange(false);
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") go(-1);
    if (e.key === "ArrowRight") go(1);
  };

  return (
    // Force LTR so the slide transform/drag math is independent of page
    // direction; the quote content is centered, so it reads fine either way.
    <div dir="ltr">
      <div
        ref={viewportRef}
        role="region"
        aria-roledescription="carousel"
        aria-label={t("region")}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className={cn(
          "relative overflow-hidden rounded-3xl border border-black/[0.08] bg-surface-1 outline-none",
          "touch-pan-y select-none focus-visible:ring-2 focus-visible:ring-brand-accent/50",
          count > 1 && (drag ? "cursor-grabbing" : "cursor-grab")
        )}
      >
        <div className="pointer-events-none absolute inset-0 bg-grid mask-fade opacity-30" />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 h-56 w-[36rem] -translate-x-1/2 rounded-full bg-brand/15 blur-[100px]"
        />

        <div
          className="relative flex"
          style={{
            transform: `translateX(calc(${active * -100}% + ${drag?.dx ?? 0}px))`,
            transition: drag
              ? "none"
              : "transform 550ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {items.map((t, i) => (
            <figure
              key={t.author + i}
              aria-hidden={i !== active}
              className="w-full shrink-0 px-6 py-12 sm:px-14 sm:py-14"
            >
              <Quote className="mx-auto h-8 w-8 text-brand-accent" />
              <blockquote className="mx-auto mt-7 max-w-2xl text-balance text-center text-xl font-medium leading-snug tracking-tight text-foreground sm:text-2xl">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-7 flex flex-col items-center gap-2">
                {t.result ? (
                  <span className="rounded-full border border-brand/30 bg-brand/10 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-brand-accent">
                    {t.result}
                  </span>
                ) : null}
                <span className="mt-1 text-sm font-medium text-foreground">
                  {t.author}
                </span>
                <span className="font-mono text-xs uppercase tracking-wider text-subtle-foreground">
                  {t.role}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      {/* Controls */}
      {count > 1 ? (
        <div className="mt-7 flex items-center justify-center gap-5">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label={t("prev")}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/12 bg-black/[0.03] text-foreground-soft transition-all hover:-translate-x-0.5 hover:border-black/25 hover:text-foreground"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2">
            {items.map((item, i) => (
              <button
                key={item.author + i}
                type="button"
                onClick={() => go(i - active)}
                aria-label={t("goto", { n: i + 1 })}
                aria-current={i === active}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === active
                    ? "w-6 bg-brand-accent"
                    : "w-1.5 bg-black/20 hover:bg-black/40"
                )}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => go(1)}
            aria-label={t("next")}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/12 bg-black/[0.03] text-foreground-soft transition-all hover:translate-x-0.5 hover:border-black/25 hover:text-foreground"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
