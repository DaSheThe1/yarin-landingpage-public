"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowUpRight, ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";

import { SectionHeading } from "@/components/sections/marketing-sections";
import { buttonVariants } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { galleryImages, type GalleryImage } from "@/content/gallery";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/**
 * Presentational grid of project renders. Every tile shares one 4:3 frame so the
 * rows line up cleanly — tops and bottoms aligned, no ragged masonry edges.
 * Clicking a tile opens it full-size in a centered lightbox. Shared by the
 * /examples gallery and the home-page teaser.
 */
export function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const navigate = useCallback(
    (dir: number) =>
      setOpenIdx((i) =>
        i === null ? i : (i + dir + images.length) % images.length
      ),
    [images.length]
  );

  return (
    <>
      <div className="mt-14 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
        {images.map((image, index) => (
          <Reveal key={image.src} delay={(index % 3) * 90} className="block">
            <button
              type="button"
              onClick={() => setOpenIdx(index)}
              aria-label={image.alt}
              className="group relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden rounded-2xl border border-black/[0.08] bg-surface-1 shadow-card transition-all duration-500 hover:-translate-y-1 hover:border-brand/30 hover:shadow-[0_28px_60px_-28px_rgba(37, 99, 235,0.5)]"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 50vw"
                className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
              <span
                aria-hidden
                className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white opacity-0 backdrop-blur transition-all duration-300 group-hover:opacity-100"
              >
                <Maximize2 className="h-4 w-4" />
              </span>
              <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 p-4 text-start text-sm font-medium leading-snug text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                {image.alt}
              </span>
            </button>
          </Reveal>
        ))}
      </div>

      {openIdx !== null ? (
        <GalleryLightbox
          images={images}
          index={openIdx}
          onClose={() => setOpenIdx(null)}
          onNavigate={navigate}
        />
      ) : null}
    </>
  );
}

/**
 * Full-screen image viewer. Backdrop click or Esc closes; ← / → (and the on-
 * screen arrows) step through the set; the close control sits top-start.
 */
function GalleryLightbox({
  images,
  index,
  onClose,
  onNavigate,
}: {
  images: GalleryImage[];
  index: number;
  onClose: () => void;
  onNavigate: (dir: number) => void;
}) {
  const t = useTranslations("common");
  const image = images[index];
  const many = images.length > 1;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate(1);
      if (e.key === "ArrowLeft") onNavigate(-1);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, onNavigate]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={image.alt}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200 sm:p-8"
    >
      {/* Close — top-start (top-left in this RTL layout) */}
      <button
        type="button"
        onClick={onClose}
        aria-label={t("close")}
        className="absolute left-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20"
      >
        <X className="h-5 w-5" />
      </button>

      {many ? (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(-1);
            }}
            aria-label={t("previous")}
            className="absolute left-4 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(1);
            }}
            aria-label={t("next")}
            className="absolute right-4 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      ) : null}

      {/* Image — clicks here don't close the viewer */}
      <figure
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-full max-w-5xl flex-col items-center animate-in zoom-in-95 duration-200"
      >
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes="90vw"
          style={{ width: "auto", height: "auto" }}
          className="max-h-[82vh] max-w-full rounded-xl object-contain shadow-2xl"
        />
        <figcaption className="mt-4 max-w-2xl text-center text-sm text-white/80">
          {image.alt}
        </figcaption>
      </figure>
    </div>
  );
}

/**
 * Full project gallery shown on /examples — centered heading over the grid.
 */
export function ProjectGallery() {
  const t = useTranslations("pages.examples");

  return (
    <section className="relative bg-background px-6 py-20 sm:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-dot mask-fade-b opacity-30"
      />
      <div className="relative mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow={t("galleryEyebrow")}
            title={t("galleryTitle")}
            description={t("galleryDescription")}
          />
        </Reveal>
        <GalleryGrid images={galleryImages} />
      </div>
    </section>
  );
}

/**
 * Home-page teaser — a curated subset of the gallery with a link through to the
 * full /examples page.
 */
export function GalleryTeaser() {
  const t = useTranslations("homeGallery");

  return (
    <section className="bg-background px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow={t("eyebrow")}
            title={t("title")}
            description={t("description")}
          />
        </Reveal>
        <GalleryGrid images={galleryImages.slice(0, 6)} />
        <Reveal>
          <div className="mt-12 flex justify-center">
            <Link
              href="/examples"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-11 rounded-lg px-5 text-[15px]"
              )}
            >
              {t("cta")}
              <ArrowUpRight data-icon="inline-end" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
