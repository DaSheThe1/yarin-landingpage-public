import { siteConfig } from "@/config/site";

export const publicEnv = {
  siteUrl: siteConfig.url,
  // We run two trackers in parallel and each is INDEPENDENT: GA4 for the client
  // (familiar dashboards) and Umami for cookieless cross-checks. Every var below
  // is PUBLIC by design (it ships to the browser) and OPTIONAL — when a tracker's
  // var(s) are unset it is a complete no-op (no script rendered, trackEvent skips
  // it), so dev/test/CI/preview builds keep working unchanged.

  // Google Analytics 4 measurement id (e.g. "G-XXXXXXXXXX").
  gaId: process.env.NEXT_PUBLIC_GA_ID,
  // Umami: tracker script URL + the website UUID from its dashboard. Both are
  // required for Umami to load; either missing makes Umami a no-op.
  umamiScriptUrl: process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL,
  umamiWebsiteId: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
};

export function getServerEnv() {
  return {
    contactToEmail:
      process.env.CONTACT_TO_EMAIL ?? "yarinavraham96@gmail.com",
    n8nWebhookUrl: process.env.N8N_WEBHOOK_URL,
    // Shared secret sent as a header on every webhook call so a leaked webhook
    // URL alone can't be spammed — n8n rejects calls without the matching value.
    n8nWebhookSecret: process.env.N8N_WEBHOOK_SECRET,
  };
}
