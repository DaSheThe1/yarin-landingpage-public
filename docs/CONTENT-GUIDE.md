# Content Guide — where everything goes

This page maps every piece of content to the exact file (and key) to edit. The
scaffold runs and looks complete with interior-design placeholder copy; replace
the placeholders below with Yarin's real content, photos, videos, and reviews.

> Hebrew is the only language. All visible copy lives in **`messages/he.json`**,
> keyed by section. Edit the string values — don't add/remove keys.

## 1. Identity (already wired) — `src/config/site.ts`

| Field | Current value | Action |
| --- | --- | --- |
| `name` | ירין אליה אברהם | ✅ |
| `email` | yarinavraham96@gmail.com | ✅ |
| `phone` / `phoneE164` | 050-901-0688 / +972509010688 | ✅ |
| `monogram` | יא | change if you want a different mark |
| `domain` / `url` | **`yarin.trickticmedia.com` (placeholder)** | ⚠️ confirm the real domain |

The phone powers `tel:` links and the WhatsApp buttons (`wa.me`). Email powers
the footer + form fallback.

## 2. The copy — `messages/he.json`

Top-level sections and where they render:

| Key | Where | Notes |
| --- | --- | --- |
| `hero` | homepage top | headline + the ₪997 free-consultation CTA |
| `stats` | homepage | labels only — **numbers** live in `src/content/stats.ts` |
| `offers` | homepage | 3 cards, middle one featured (`src/content/offers.ts`) |
| `process` | homepage | how the 1:1 guidance works, step by step |
| `servicesTeaser` / `services` | homepage + `/services` | what you do (new build vs renovation, ממ"ד, permits, electrical/plumbing) |
| `founder` | homepage + `/about` | about Yarin (5 yrs experience) |
| `trustBand` | homepage | reassurance strip |
| `testimonials` | homepage + `/reviews` | **sample reviews** — see §4 |
| `faq` | homepage | FAQs (process, timelines, areas, permits) |
| `finalCta` / `contactForm` | homepage + `/contact` | the lead form (name + phone) |
| `nav` / `header` / `footer` / `common` | global chrome | labels & buttons |
| `pages` / `og` | per-page `<title>`/meta + social card | SEO copy |
| `legal` | `/privacy`, `/terms` | generic legal text — have it reviewed |

## 3. Images & videos — `public/`

Missing media degrades gracefully (a placeholder shows), so you can add files
anytime. Drop files with these exact names/paths:

- **Hero video** → `public/hero-demo.mp4` (autoplays muted on loop; click to
  expand). A short reel of finished interiors works great.
- **Thank-you video** → `public/thank-you.mp4` (personal message after a lead
  submits; shown on `/thank-you`).
- **Service previews** → put files under `public/services/` and reference them
  in `src/content/services.ts` (`serviceMedia` array, 6 slots, matched to the
  6 services in `he.json`). Images need `alt` text; videos autoplay muted.
- **Project gallery / examples** → `public/projects/` (referenced from the
  `/examples` page content). Send photos and we'll wire the gallery.
- **OG / social share image** → currently auto-generated
  (`src/app/opengraph-image.tsx`). ⚠️ It uses the default font, so Hebrew may not
  render in the share image until a Hebrew webfont is loaded, or replace it with
  a static `public/og.png` (1200×630).
- **Favicon** → `src/app/favicon.ico` (replace the template's).

Recommended formats: photos as `.webp`/`.jpg`, videos as `.mp4` (H.264), kept
reasonably small for fast mobile load.

## 4. Reviews / testimonials

The carousel currently shows **clearly-labeled sample reviews**. Once you have
real client quotes:

1. Replace the quotes in `messages/he.json` → `testimonials.items` (keep the
   array length, or tell us to change it).
2. Flip `testimonialsAreSamples` to `false` in `src/content/testimonials.ts` —
   the "sample" notice then disappears automatically.

## 5. The offer & lead form

- The form collects **name + phone only** (by design — lowest friction).
- Submissions POST to `/api/contact`, which forwards to an **n8n webhook**.
  Until `N8N_WEBHOOK_URL` is set (see `.env.example`), the form shows a friendly
  "temporarily unavailable" message — so wire n8n before going live (see
  `docs/n8n-contact-workflow.md`).
- After a successful submit the visitor is sent to `/thank-you`.

## 6. Look & feel (optional)

The design system (dark theme + indigo/violet accent) is reused from the
template. To shift to a warmer, lighter luxury palette, edit the color tokens at
the top of `src/app/globals.css`. The dark mode is set via the `dark` class on
`<html>` in `src/app/[locale]/layout.tsx`.

## 7. Before launch checklist

- [ ] Confirm real domain → `src/config/site.ts`, env files, `compose.yaml`,
      `deploy.sh`, `infra/nginx/`.
- [ ] Replace placeholder copy in `messages/he.json`.
- [ ] Add hero/thank-you videos + project photos to `public/`.
- [ ] Replace sample reviews and flip the samples flag.
- [ ] Confirm stat numbers in `src/content/stats.ts`.
- [ ] Configure the n8n webhook + secret in `.env.production`.
- [ ] Replace the favicon and (optionally) the OG image.
- [ ] Have the privacy/terms text reviewed.
