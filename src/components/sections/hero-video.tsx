"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Maximize2, Play } from "lucide-react";

import { trackEvent } from "@/lib/analytics";

// iOS Safari has no Element.requestFullscreen — videos expand through the
// native player via this vendor method instead.
type FullscreenVideo = HTMLVideoElement & {
  webkitEnterFullscreen?: () => void;
};

// Auto-playing showcase shown until a real demo lands at /public/hero-demo.mp4.
// One image per ~7s slot; keep the count in sync with the cycle math below.
const showcase = [
  { src: "/images/render-modern-pool-villas.webp", alt: "הדמיית וילה מודרנית עם בריכה" },
  { src: "/images/render-stone-villas.webp", alt: "הדמיות וילות אבן בנוף הרים" },
  { src: "/images/render-desert-villa.webp", alt: "הדמיית וילת מדבר עם בריכה" },
  { src: "/images/render-desert-elevations.webp", alt: "חזיתות וילה, מבט צפון ודרום" },
];
const slotSeconds = 7;

export function HeroVideo() {
  const t = useTranslations("heroVideo");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  // Fire the "watched" analytics event at most once per mount, so repeated
  // expand clicks don't spam Umami.
  const trackedRef = useRef(false);

  // `canplay` can fire before hydration attaches a React listener (the video
  // starts loading with the SSR HTML), so check readyState on mount too.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      setReady(true);
      return;
    }
    const onCanPlay = () => setReady(true);
    video.addEventListener("canplay", onCanPlay);
    return () => video.removeEventListener("canplay", onCanPlay);
  }, []);

  // Show native controls only while fullscreen — inline it stays a clean,
  // chromeless autoplaying loop.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onChange = () => {
      video.controls = document.fullscreenElement === video;
    };
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const expand = () => {
    const video = videoRef.current as FullscreenVideo | null;
    if (!video || !ready) return;
    if (!trackedRef.current) {
      trackedRef.current = true;
      trackEvent("hero_video_watch", { location: "hero" });
    }
    if (video.requestFullscreen) {
      void video.requestFullscreen().catch(() => {
        video.webkitEnterFullscreen?.();
      });
    } else {
      video.webkitEnterFullscreen?.();
    }
  };

  return (
    <div className="relative mx-auto max-w-6xl">
      {/* Ambient glow behind the frame */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-10 -top-10 bottom-0 rounded-[2.5rem] bg-brand/20 blur-[90px]"
      />

      <div className="ring-shine relative overflow-hidden rounded-2xl border border-white/[0.1] bg-surface-1 shadow-card sm:rounded-3xl">
        <div className="relative aspect-video">
          {/* The auto-playing render showcase sits underneath; once a real
              /public/hero-demo.mp4 can play, the video fades in over it. */}
          {!ready ? <HeroShowcase /> : null}

          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onClick={expand}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
              ready ? "cursor-zoom-in opacity-100" : "opacity-0"
            }`}
          >
            <source src="/hero-demo.mp4" type="video/mp4" />
          </video>

          {/* Autoplay live indicator */}
          <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/45 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-white/90 backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            {t("autoplay")}
          </div>

          {ready ? (
            <button
              type="button"
              onClick={expand}
              aria-label={t("fullscreenAria")}
              className="absolute bottom-3 right-3 inline-flex h-9 items-center gap-2 rounded-lg border border-white/15 bg-black/60 px-3 text-xs font-medium text-primary-foreground backdrop-blur transition-colors hover:border-white/30 hover:bg-black/75 sm:bottom-4 sm:right-4"
            >
              <Maximize2 className="h-3.5 w-3.5" />
              {t("fullscreen")}
            </button>
          ) : null}

          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/[0.06]" />
        </div>
      </div>

      {/* Floating hint chip */}
      <div className="absolute -right-4 -top-4 hidden rotate-3 items-center gap-2 rounded-full border border-white/12 bg-surface-2/90 px-3 py-1.5 text-xs text-foreground-soft shadow-card backdrop-blur sm:flex">
        <Play className="h-3 w-3 fill-brand-accent text-brand-accent" />
        {t("watchRun")}
      </div>
    </div>
  );
}

function HeroShowcase() {
  const cycle = showcase.length * slotSeconds;
  return (
    <div className="absolute inset-0 bg-surface-1">
      {showcase.map((image, i) => (
        <div
          key={image.src}
          className="absolute inset-0 opacity-0"
          style={{
            animation: `hero-slide ${cycle}s ease-in-out infinite`,
            animationDelay: `${i * slotSeconds}s`,
          }}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority={i === 0}
            sizes="(min-width: 1024px) 1100px, 100vw"
            className="object-cover"
          />
        </div>
      ))}
      {/* Cinematic vignette to seat the overlays */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-white/12"
      />
    </div>
  );
}
