"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Maximize2, Play, Volume2 } from "lucide-react";

import { trackEvent } from "@/lib/analytics";

// iOS Safari has no Element.requestFullscreen — videos expand through the
// native player via this vendor method instead.
type FullscreenVideo = HTMLVideoElement & {
  webkitEnterFullscreen?: () => void;
};

// Personal thank-you message. Drop the file at /public/thank-you.mp4 to swap it
// for a dedicated recording; until then it reuses the workflow demo so the page
// is never empty. One constant, one place to change.
const VIDEO_SRC = "/thank-you.mp4";
const FALLBACK_SRC = "/hero-demo.mp4";

export function ThankYouVideo() {
  const t = useTranslations("pages.thankYou.video");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  // Before the first interaction the video runs muted on loop — motion keeps
  // the eye on the page. The first "Play with sound" tap turns it into a real,
  // one-shot playthrough of the message.
  const [started, setStarted] = useState(false);
  const [src, setSrc] = useState(VIDEO_SRC);
  // Fire the "watched" analytics event only once per mount.
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
    // A <source> that 404s fires its `error` event before hydration attaches
    // any React listener, and that event does NOT bubble to <video> — so the
    // primary src can already have failed by the time we mount. Detect it
    // (NETWORK_NO_SOURCE / a set media error) and fall back here too, mirroring
    // the readyState check above, otherwise the frame stays stuck on loading.
    if (
      src !== FALLBACK_SRC &&
      (video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE || video.error)
    ) {
      setSrc(FALLBACK_SRC);
      return;
    }
    const onCanPlay = () => setReady(true);
    video.addEventListener("canplay", onCanPlay);
    return () => video.removeEventListener("canplay", onCanPlay);
  }, [src]);

  // If the dedicated recording isn't deployed yet, fall back to the demo reel
  // rather than showing a broken frame. Wired on both <video> (post-hydration
  // load errors) and <source> (the source-level error that doesn't bubble).
  const onError = () => {
    if (src !== FALLBACK_SRC) {
      setReady(false);
      setSrc(FALLBACK_SRC);
    }
  };

  // Show native controls only while fullscreen — inline it stays a clean frame.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onChange = () => {
      video.controls =
        document.fullscreenElement === video || (started && !video.paused);
    };
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, [started]);

  const playWithSound = () => {
    const video = videoRef.current;
    if (!video) return;
    if (!trackedRef.current) {
      trackedRef.current = true;
      trackEvent("thankyou_video_watch");
    }
    video.loop = false;
    video.muted = false;
    video.controls = true;
    video.currentTime = 0;
    void video.play().catch(() => {
      // Autoplay policies can still block audio on some browsers — at least
      // make sure something plays.
      video.muted = true;
      void video.play();
    });
    setStarted(true);
  };

  const expand = () => {
    const video = videoRef.current as FullscreenVideo | null;
    if (!video || !ready) return;
    if (video.requestFullscreen) {
      void video.requestFullscreen().catch(() => {
        video.webkitEnterFullscreen?.();
      });
    } else {
      video.webkitEnterFullscreen?.();
    }
  };

  return (
    <div dir="ltr" className="relative mx-auto max-w-6xl">
      {/* A clean ring-shine border + shadow frame the video. The previous
          rotating "beam" (a 180%-sized blue conic-gradient) and the ambient
          glow were removed — both bled blue up behind the page heading. */}
      <div className="rounded-[1.4rem]">
        <div className="ring-shine relative overflow-hidden rounded-2xl border border-white/[0.1] bg-surface-1 shadow-card">
          {/* Window chrome */}
          <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-rose-400/70" />
            <span className="h-3 w-3 rounded-full bg-amber-400/70" />
            <span className="h-3 w-3 rounded-full bg-emerald-400/70" />
            <span className="ml-3 inline-flex items-center gap-1.5 rounded-md border border-white/[0.06] bg-white/[0.03] px-2.5 py-1 font-mono text-[11px] text-subtle-foreground">
              {t("badge")}
            </span>
            <span className="ml-auto inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-emerald-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              {started ? t("nowPlaying") : t("duration")}
            </span>
          </div>

          <div className="relative aspect-video">
            <video
              ref={videoRef}
              key={src}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              onError={onError}
              onClick={started ? undefined : playWithSound}
              className={`absolute inset-0 h-full w-full object-cover ${ready && !started ? "cursor-pointer" : ""}`}
            >
              {/* A failed <source> fires `error` on the <source> element (it
                  does NOT bubble to <video>), so the fallback must be wired
                  here too — otherwise a missing /thank-you.mp4 leaves the
                  video stuck on the loading placeholder forever. */}
              <source src={src} type="video/mp4" onError={onError} />
            </video>

            {!ready ? <VideoPlaceholder /> : null}

            {/* Big tap target before the first play — dimmed video + CTA */}
            {ready && !started ? (
              <button
                type="button"
                onClick={playWithSound}
                aria-label={t("playAria")}
                className="group absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-black/30 via-black/40 to-black/60 transition-colors hover:from-black/40 hover:to-black/70"
              >
                <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-brand text-primary-foreground shadow-[0_0_0_1px_rgba(228, 200, 120,0.5),0_12px_44px_-6px_rgba(201, 168, 76,0.9)] transition-transform duration-300 group-hover:scale-110">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-accent/30" />
                  <Play className="relative ml-1 h-8 w-8 fill-current" />
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/50 px-4 py-1.5 text-sm font-medium text-primary-foreground backdrop-blur">
                  <Volume2 className="h-4 w-4 text-brand-accent" />
                  {t("playWithSound")}
                </span>
              </button>
            ) : null}

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
      </div>

      {/* Floating hint chip */}
      <div className="absolute -right-4 -top-4 hidden rotate-3 items-center gap-2 rounded-full border border-white/12 bg-surface-2/90 px-3 py-1.5 text-xs text-foreground-soft shadow-card backdrop-blur sm:flex">
        <Play className="h-3 w-3 fill-brand-accent text-brand-accent" />
        {t("watchFirst")}
      </div>
    </div>
  );
}

function VideoPlaceholder() {
  const t = useTranslations("pages.thankYou.video");
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-surface-1">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201, 168, 76,0.18),transparent_70%)]"
      />
      <span className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.04] text-brand-accent">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-2xl bg-brand-accent/20" />
        <Play className="relative h-7 w-7 fill-current" />
      </span>
      <p className="relative text-sm font-medium text-foreground">
        {t("loading")}
      </p>
    </div>
  );
}
