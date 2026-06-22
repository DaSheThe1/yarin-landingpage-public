# Changelog

All notable changes to this project are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and the project uses [Semantic Versioning](https://semver.org/) (`MAJOR.MINOR.PATCH`).
The version lives in `package.json` and is reported by `GET /api/health`.

Agents: every behavior-changing commit must bump the version and add an entry
here. See `AGENTS.md` → "Versioning rules".

## [0.6.0] - 2026-06-23

### Added

- **GitHub Pages deployment.** New `.github/workflows/deploy-pages.yml` builds a
  static export (`STATIC_EXPORT=true next build`) on every push to `main` and
  publishes it to GitHub Pages. `next.config.ts` gained a gated `output: "export"`
  branch (`images.unoptimized`, `trailingSlash`) that activates only under
  `STATIC_EXPORT=true`; local dev, the Docker/standalone build, and the e2e
  harness are unchanged. Added `public/CNAME` (`yarin-avraham.co.il`) and
  `public/.nojekyll`, plus a `build:static` script.
- **Cloudflare Worker for the lead form** (`worker/`). Because GitHub Pages is
  static-only, `/api/contact` is now served by a Worker on the same domain that
  validates name + phone, honors the honeypot, and forwards to the n8n webhook
  with the shared secret — keeping the webhook URL/secret server-side and off the
  static bundle. The form component is unchanged (still posts to `/api/contact`).
  The Next API routes (`/api/contact`, `/api/health`) remain for local dev, e2e,
  and Docker; the Pages CI drops `src/app/api` from the checkout before building
  (static export can't compile the POST/`force-dynamic` handlers).

## [0.5.4] - 2026-06-23

### Changed

- Brand accent is now a confident royal blue (`--brand` `#2563eb`) instead of
  the muted slate-navy, so every primary CTA button and brand-tinted accent,
  glow, and border reads as blue across the site. Swept the matching hardcoded
  slate RGBA glows/shadows to the blue equivalents in one pass.
- Hero title wave: the crest now flows through a gradient of blues (azure →
  indigo) instead of a single warm-gold peak, and the sweep is slower (10s
  cycle, was 5s) so it reads as a calmer wave.
- Hero title wave is now driven by a single `requestAnimationFrame` clock in
  `WaveText` (colour + lift written inline per frame) instead of one infinite
  CSS animation per letter. The old approach only showed a single crest while
  every per-letter animation clock stayed in phase; on some loads (stylesheet
  applying after the inline-styled spans, web-font reflow, hydration) they
  drifted and the wave split into two crests. One shared clock makes exactly one
  crest a structural guarantee. Removed the now-dead `letter-wave` keyframes and
  `--wave-crest` token.
- Tightened the gap between the offers note ("כל פרויקט מתחיל…") and the process
  timeline: smaller bottom padding on the offers section and top padding on the
  process section removed the large empty band between them.
- Darkened the hero subtitle and the process step descriptions to the full
  `foreground` ink so they read more clearly.
- Founder section now shows a placeholder instead of the personal portrait
  photo, pending a real brand portrait: the same blue brand mark used in the
  header, centered on a soft blue wash. Reduced the section's vertical padding
  so it sits closer to the sections above and below it.

## [0.5.3] - 2026-06-22

### Changed

- Hero title wave: reworked into a single travelling crest that sweeps once
  from the first letter to the last (per-letter stagger is now derived from the
  letter count so long phrases show one crest, not several at once), with a
  warmer gold peak and a subtle glow. New `--wave-crest` token.
- Hero eyebrow ("תכנון ועיצוב פנים לבתי יוקרה") is more legible: larger, bolder,
  tighter letter-spacing, no all-caps, and a stronger frosted chip so it reads
  against the animated aurora backdrop.
- Hero trust badges now sit directly beneath the showcase video on every
  breakpoint and render as readable bordered chips (darker `foreground-soft`
  text) instead of faint inline text.
- Process timeline: on desktop each step is pulled up into the previous step's
  lower half (opposite side of the spine) so step 02 begins near the middle of
  step 01 — the steps interleave into a compact timeline instead of an endless
  vertical scroll. Mobile stacking is unchanged.

## [0.5.2] - 2026-06-22

### Changed

- Mobile hero layout: the auto-playing render showcase video is now pulled up
  directly beneath the title (above the subtitle and trust badges) so it's the
  immediate focal point on phones. The subtitle + badges drop below it. On `lg`
  and up the original reading order (title → subtitle → video → CTAs) is
  preserved via flex `order` utilities. Hero bottom padding also tightened on
  mobile.

## [0.5.1] - 2026-06-22

### Fixed

- Lock the intentionally light design against dark mode: added a `light`
  `colorScheme` viewport (emits `<meta name="color-scheme" content="light">` +
  `theme-color`) and a `darkreader-lock` meta so the Dark Reader extension no
  longer inverts the page into an ugly state.
- Workflow "outcome" text under "סוגי פרויקטים שאני מלווה" was light emerald on
  the light canvas (near-invisible) — now a readable `emerald-700`. Same fix for
  the faint "live" badge on the thank-you video.

### Changed

- Process timeline tightened (smaller step images, less vertical spacing and
  padding) so it no longer reads as an endless scroll.

## [0.5.0] - 2026-06-22

### Added

- Click-to-enlarge lightbox on the project gallery: a tile opens full-size and
  centered over a dimmed backdrop, with a close control top-start, ←/→ (and on-
  screen arrows) to step through, and backdrop-click / Esc to close. New
  `common.close` / `common.previous` / `common.next` copy.

### Changed

- **Theme recoloured to a cool slate-navy system** (was warm brass/gold):
  cool off-white canvas, ink text, muted slate-navy accent. All design tokens
  plus the hardcoded glow/gradient/aurora colours were swept to match.
- Contact form: replaced the paragraph that duplicated the hero with a short
  heading + one line (`contactForm.simpleTitle`), and made the error text
  readable on a light background (`rose-300` → `rose-600/700`).
- Subpage hero (`PageHero`): the hard full-width bottom rule is now a soft
  centered hairline that fades at the edges.

### Fixed

- Testimonials "sample reviews" notice was light amber on the light canvas
  (effectively invisible) — now a readable neutral pill.

## [0.4.0] - 2026-06-22

### Added

- WhatsApp call-to-action in the header (icon button + mobile-menu link) and the
  footer contact block, all pointing at `siteConfig.whatsappUrl`. New brand
  `WhatsAppIcon` component and `header.whatsapp` / `footer.whatsapp` copy.
- Per-step renders in the process timeline (`src/content/process.ts`,
  `processMedia`) — a small supporting image sits under each step's text.
- Real autoplaying hero video: `public/hero-demo.mp4` (placeholder copied from
  course-platform; swap for genuine project footage). It fades in over the
  render showcase once it can play.

### Changed

- Offers section now presents the single flagship package as one centered
  feature card instead of three columns (the other two `offers.items` stay in
  the messages for when real tiers exist).
- Navigation order: "אודות" (about) now sits before "המלצות" (reviews).
- Project gallery is a uniform aligned 4:3 grid (shared `GalleryGrid`) so rows
  line up cleanly — fixes the ragged/offset masonry tiles on `/examples`.
- Subpage hero (`PageHero`) top padding reduced (`pt-20 lg:pt-28` →
  `pt-8 lg:pt-12`) to match the tightened home hero across all pages.
- Contact page: the lead form is now sticky and follows the scroll alongside the
  taller info sidebar (releases when the sidebar ends), mirroring the
  automations-website calculator pattern.
- Colour system refined: cleaner warm-ivory canvas, deeper espresso text, and a
  richer antique-gold accent across the design tokens.

## [0.3.0] - 2026-06-22

### Added

- Project gallery teaser on the home page (`GalleryTeaser`): a curated subset of
  the renders with a "to all projects" link through to `/examples`, plus a new
  `homeGallery` copy namespace in `messages/he.json`.

### Changed

- Gallery placement and spacing reworked. The masonry is now a shared
  `GalleryGrid` (used by both `/examples` and the home teaser) with wider
  gutters, larger rounded frames, a lift-on-hover, and a Hebrew caption that
  fades in over the image. The `/examples` gallery heading is now centered over
  a dotted backdrop.
- Hero top spacing tightened (`pt-14 lg:pt-20` → `pt-6 lg:pt-10`) so the eyebrow
  and headline sit closer to the header and more of the hero is visible on first
  load.

## [0.2.1] - 2026-06-22

### Changed

- Header logo now uses the real brand mark (`public/images/yarin-icon.png`) via
  `next/image` instead of the text monogram badge.
- Reworked the n8n contact intake into `n8n-workflows/contact-form.json` and
  refreshed `n8n-workflows/README.md` and `docs/n8n-contact-workflow.md` to match.

### Removed

- Obsolete `n8n-workflows/website-contact-intake.json` and the leftover
  `src/app/favicon.ico` (icons are generated routes).

## [0.2.0] - 2026-06-22

### Added

- Warm light "editorial" theme replacing the dark template: warm cream canvas,
  charcoal text and a brass-gold accent across every component and design-system
  utility. `color-scheme: light` is pinned so OS dark mode can no longer invert
  the page; the leftover `dark` class and indigo accents were removed.
- Animated hero headline: a per-letter travelling gold colour wave (`WaveText`)
  sweeps the full title, stays legible at rest, and falls back to a colour-only
  sweep under `prefers-reduced-motion`.
- Project gallery on `/examples`: a responsive masonry of real architectural
  renders (`ProjectGallery`, `src/content/gallery.ts`, images under
  `public/images/`) with Hebrew alt text.

### Changed

- Hero layout: the render showcase is pulled up as the focal point with the
  primary/secondary CTAs directly beneath it.
- Footer contact block: email and phone are now a consistently right-aligned
  group with mail/phone icon badges, fixing the phone number that previously
  floated mid-column (caused by `dir="ltr"` + `block` in the RTL layout).
- Copy and content updates in `messages/he.json` and services content.

## [0.1.0] - 2026-06-22

### Added

- Initial Hebrew-first landing page for ירין אליה אברהם (תכנון ועיצוב פנים),
  scaffolded from the automations-website template.
- Lead-capture flow built around a free initial consultation offer (₪997
  value): name + phone form → `/api/contact` → n8n webhook → `/thank-you`.

### Changed

- Converted the site to a single Hebrew (RTL) locale served at the root `/`;
  removed the English locale and the language switcher (next-intl machinery
  kept so English can be re-enabled later).
- Rebranded identity (name, phone, email, monogram, SEO/JSON-LD, OG image,
  `llms.txt`) from TrickTic Automation to Yarin Avraham interior design.
- Trimmed automation-specific homepage sections (tools marquee, ROI calculator,
  manual-vs-automated) and their components.
- Replaced founder LinkedIn/GitHub links with phone + WhatsApp.

### Notes

- Production domain is a placeholder (`yarin-avraham.co.il`) — confirm before launch.
- Marketing copy and testimonials are interior-design placeholders pending real
  content; testimonials are flagged as samples. See `docs/CONTENT-GUIDE.md`.
