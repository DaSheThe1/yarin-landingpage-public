"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

/**
 * Renders text as individual letters lit by a single travelling crest: one band
 * of blue lifts and tints each letter in turn, sweeping once across the whole
 * phrase from the first letter to the last, then resting before it repeats.
 * Each letter carries its own shade of blue (azure → indigo, spread by index)
 * so the crest reads as a flowing gradient rather than a flat colour. Letters
 * rest at the readable foreground colour, so the text stays legible.
 *
 * The crest is driven by ONE requestAnimationFrame clock that writes each
 * letter's colour/lift inline every frame. This is deliberate: an earlier
 * version gave every letter its own infinite CSS animation with a staggered
 * delay, which only shows a single crest while all those per-letter animation
 * clocks stay perfectly in phase — on some loads (stylesheet applying after the
 * inline-styled spans, web-font reflow, hydration) they drift apart and the
 * wave visibly splits into two crests. A single shared clock makes exactly one
 * crest a structural guarantee.
 *
 * Letters are grouped into words (each word is `white-space: nowrap`) so the
 * phrase still wraps cleanly at spaces and never breaks mid-word. Splitting per
 * character is safe for Hebrew — no contextual shaping, final forms are distinct
 * codepoints. The full string is exposed to assistive tech via aria-label; the
 * per-letter spans are hidden from it.
 */
export function WaveText({
  text,
  className,
  cycle = 10,
  sweep = 0.6,
}: {
  text: string;
  className?: string;
  /** Total seconds for one full loop (sweep + rest). */
  cycle?: number;
  /** Fraction of the cycle the crest spends travelling first→last letter. */
  sweep?: number;
}) {
  const rootRef = useRef<HTMLSpanElement>(null);

  // Split into words and whitespace tokens, keeping the whitespace. The crest
  // addresses letters by their DOM order (see the effect below).
  const tokens = text.split(/(\s+)/);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const chars = Array.from(
      root.querySelectorAll<HTMLElement>(".wave-text-char")
    );
    const n = chars.length;
    if (n === 0) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Each letter's crest colour (gold → champagne) and the resting warm-white
    // ink, pre-resolved to RGB so the per-frame loop only does cheap interpolation.
    const rest: [number, number, number] = [244, 241, 234]; // --foreground #f4f1ea
    const crest = chars.map((_, i) => {
      const t = n > 1 ? i / (n - 1) : 0;
      // Sweep across the gold band: deep gold (≈42°) → bright champagne (≈50°).
      return hslToRgb(42 + t * 8, 0.72, 0.62);
    });

    const sweepDur = cycle * sweep;
    const sigma = 1.15; // crest half-width, in letters
    const lift = reduced ? 0 : 0.22; // em of vertical rise at full intensity
    const prev = new Array(n).fill(-1);
    let raf = 0;
    let start = 0;

    const frame = (now: number) => {
      if (!start) start = now;
      const phase = ((now - start) / 1000) % cycle;
      // Crest head sweeps from just before the first letter to just past the
      // last during the sweep window; parked far away (nothing lit) while
      // resting, so there is always exactly one crest — or none.
      const head =
        phase <= sweepDur
          ? -2 + (phase / sweepDur) * (n - 1 + 4)
          : Number.POSITIVE_INFINITY;

      for (let i = 0; i < n; i++) {
        const d = i - head;
        const intensity = Number.isFinite(d)
          ? Math.exp(-(d * d) / (2 * sigma * sigma))
          : 0;
        // Skip DOM writes when this letter hasn't visibly changed.
        if (Math.abs(intensity - prev[i]) < 0.012) continue;
        prev[i] = intensity;

        const el = chars[i];
        const [cr, cg, cb] = crest[i];
        const r = Math.round(rest[0] + (cr - rest[0]) * intensity);
        const g = Math.round(rest[1] + (cg - rest[1]) * intensity);
        const b = Math.round(rest[2] + (cb - rest[2]) * intensity);
        el.style.color = `rgb(${r}, ${g}, ${b})`;
        el.style.transform =
          intensity > 0.001 ? `translateY(${(-lift * intensity).toFixed(3)}em)` : "";
        el.style.textShadow =
          intensity > 0.05
            ? `0 6px 18px rgba(201, 168, 76, ${(0.4 * intensity).toFixed(3)})`
            : "";
      }

      raf = window.requestAnimationFrame(frame);
    };

    raf = window.requestAnimationFrame(frame);
    return () => window.cancelAnimationFrame(raf);
  }, [text, cycle, sweep]);

  return (
    <span ref={rootRef} className={cn("wave-text", className)} aria-label={text}>
      {tokens.map((token, ti) => {
        if (token === "") return null;
        if (/^\s+$/.test(token)) {
          // Breakable space between words.
          return <span key={ti}> </span>;
        }
        return (
          <span key={ti} className="wave-word">
            {Array.from(token).map((ch, ci) => (
              <span key={ci} aria-hidden className="wave-text-char">
                {ch}
              </span>
            ))}
          </span>
        );
      })}
    </span>
  );
}

/** HSL (h in degrees, s/l in 0..1) → [r, g, b] in 0..255. */
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hp = (((h % 360) + 360) % 360) / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let r = 0;
  let g = 0;
  let b = 0;
  if (hp < 1) [r, g, b] = [c, x, 0];
  else if (hp < 2) [r, g, b] = [x, c, 0];
  else if (hp < 3) [r, g, b] = [0, c, x];
  else if (hp < 4) [r, g, b] = [0, x, c];
  else if (hp < 5) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const m = l - c / 2;
  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255),
  ];
}
