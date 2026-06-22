import { siteConfig } from "@/config/site";

export const publicEnv = {
  siteUrl: siteConfig.url,
  // Umami (privacy-friendly, cookieless analytics). Both are PUBLIC by design —
  // the tracker script URL and website id are meant to ship to the browser.
  // Both are OPTIONAL: when EITHER is unset, analytics is a complete no-op
  // (no script rendered, trackEvent does nothing), so dev/test/CI/preview
  // builds without Umami env keep working unchanged.
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
