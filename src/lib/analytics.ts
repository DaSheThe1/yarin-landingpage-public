// Typed wrapper around Umami's client-side tracker.
//
// Umami auto-captures pageviews (including Next App Router client-side route
// changes, because the tracker patches history.pushState), so unique visitors
// and the /thank-you pageview come for free. This helper is only for the small
// set of CUSTOM events we hand-fire on intentful user interactions.
//
// PRIVACY: never pass PII (no name / email / phone) in event data — only
// non-identifying categorical fields.

// Allowed custom event names. Keep these snake_case, stable, and documented
// (see docs/16-analytics.md → Event map). Changing a name breaks historical
// continuity in the Umami dashboard, so treat them as a contract.
export type AnalyticsEvent =
  | "hero_video_watch" // user clicks the hero demo to watch it fullscreen
  | "lead_submitted" // contact form submitted successfully
  | "thankyou_video_watch"; // user clicks to hear Daniel's thank-you message

declare global {
  interface Window {
    // Present only after Umami's tracker script has loaded. Optional so every
    // access is null-safe — when analytics is unconfigured it never exists.
    umami?: {
      track: (name: string, data?: Record<string, unknown>) => void;
    };
  }
}

/**
 * Fire a custom Umami event. Safe to call anywhere:
 * - on the server (typeof window === "undefined") it returns immediately;
 * - when Umami isn't configured / loaded, `window.umami` is undefined and the
 *   optional chaining makes this a no-op. Never throws.
 */
export function trackEvent(
  name: AnalyticsEvent,
  data?: Record<string, unknown>
): void {
  if (typeof window === "undefined") return;
  window.umami?.track(name, data);
}
