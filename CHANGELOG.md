# Changelog

All notable changes to this project are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and the project uses [Semantic Versioning](https://semver.org/) (`MAJOR.MINOR.PATCH`).
The version lives in `package.json` and is reported by `GET /api/health`.

Agents: every behavior-changing commit must bump the version and add an entry
here. See `AGENTS.md` → "Versioning rules".

## [0.11.1] - 2026-06-26

### Fixed

- **Gallery arrows were reversed.** On the LTR carousel track the right-side
  button stepped to the *left* image and vice-versa. The right button now brings
  the right neighbour to centre (next) and the left button the left neighbour
  (previous), on both the desktop side-arrows and the mobile control row; the
  `aria-label`s follow. Swipe direction is unchanged.
- **Hero title and other elements blanked out while scrolling on phones.** The
  fixed, full-viewport background re-animated a `saturate()/brightness()` filter
  on every scroll frame; on weaker mobile GPUs that whole-screen filter repaint
  dropped sibling paint layers (the headline vanished) and tiled the field into
  vertical banding streaks. The scroll-reactive filter is now gated to `≥768px`
  screens — phones render a static field; desktop is unchanged.

## [0.11.0] - 2026-06-26

### Added

- **Mobile gallery: one big swipeable image.** Below the `md` breakpoint the
  3-up coverflow (which made each image tiny on phones) is replaced by a single
  near-full-width image with a sliver of each neighbour peeking to hint the
  swipe. The image is **swipeable** (touch), and the prev/next arrows move to a
  row **below** the image instead of overlapping it. Desktop keeps the
  coverflow with side arrows unchanged.

## [0.10.5] - 2026-06-26

### Changed

- **Gallery side images pulled in toward the centre and enlarged.** They were
  sitting out at the frame edges (under the arrows) with a wide gap to the main
  image. Each neighbour is now nudged inward and scaled up a touch, so it sits
  just beside the centre image; the leftover edge gutters let the prev/next
  arrows float on the dark background instead of overlapping the photos.

## [0.10.4] - 2026-06-26

### Changed

- **Gallery centre image enlarged and side images restored to full colour.**
  The centre slot now spans ~42% of the frame (up from a third) so the main
  image reads much bigger on desktop; the two neighbours are scaled down but
  kept fully on-screen and in colour (dropped the grayscale/dim).

## [0.10.3] - 2026-06-26

### Changed

- **Gallery is now a centre-mode (coverflow) carousel.** One full-colour image
  sits enlarged in the middle with the two neighbours fully visible but smaller
  and greyed-out; each step slides the track by one and the new centre grows in
  colour as the old one shrinks to grey. Three tiles show at once at every
  breakpoint; arrows + auto-advance + seamless two-way loop unchanged.
- **Gallery order reshuffled** so visually-similar renders (the stone villas,
  the concrete desert-cliff set, the seaside cliffs) are never adjacent.

## [0.10.2] - 2026-06-26

### Fixed

- **Gallery carousel rendered blank in the RTL layout.** The sliding track set
  `dir="ltr"` on itself but not on its clipping container, so the surrounding
  RTL context right-anchored the over-wide track and `translateX()` pushed every
  tile off-screen to the left (heading + arrows showed, images did not). Moving
  `dir="ltr"` to the `overflow-hidden` container left-anchors the track so the
  tiles render and slide correctly on desktop and mobile.

## [0.10.1] - 2026-06-26

### Changed

- **Gallery carousel now has prev/next arrows and loops infinitely in both
  directions.** Clones are mirrored onto both ends and the track silently snaps
  to the matching real slide on either edge, so there is no visible rewind —
  it reads as one continuous loop. Arrows let the user step manually (and
  restart the auto-advance timer); auto-advance interval eased to ~2.6s.
- **Process timeline media** updated: step 02 (חזון ותכנון) → stone-villas
  set; step 03 (תכנון אדריכלי) → architectural floor-plan.
- **Services media:** the 5th card (שיפוצים ושינוי חלוקה) now shows its own
  renovations set instead of reusing the stone-villas render.

## [0.10.0] - 2026-06-26

### Added

- **Project gallery is now an auto-advancing carousel.** The home-page teaser
  and the `/examples` gallery slide through every project one tile at a time on
  a quick (~2.4s) timer, looping seamlessly, pausing on hover/focus and while
  the lightbox is open. Replaces the static grid (`GalleryGrid` → new
  `GalleryCarousel`).
- **14 individual project renders** added to the gallery — the previous
  four-in-one composite tiles were replaced with each project shown separately.

### Changed

- **About/founder section** on the home page now uses the brand icon photo
  (`yarin-icon`) instead of the standing portrait.
- **Stats:** the projects counter now reads **24+** (was 5).
- **Process timeline media:** step 03 (תכנון אדריכלי) shows the lower "design"
  half of the Wix office interior; step 04 (עיצוב פנים) shows the full Wix
  office render.
- **Services media** re-assigned per the client's selection: architectural
  planning reuses the renovations render; interior design shows the café
  interior; authorities/permits reuses the modern-pool-villa render; electrical
  & plumbing shows villa floor plans; on-site execution shows the desert-villas
  set.

## [0.9.2] - 2026-06-24

### Fixed

- **Hero title wave no longer makes letters jump on phones.** The travelling
  crest used to lift each letter a fraction of an em (and repaint a blurred
  text-shadow) as it passed; on mobile GPUs that per-frame transform churn read
  as letters jumping in place rather than recolouring. The crest is now a pure
  colour sweep — letters stay perfectly still and only change colour — so it is
  rock-steady on any device.
- **Lead popup entrance no longer glitches on mobile.** Dropped the backdrop
  `backdrop-blur` (a backdrop-filter re-rasterising under the animating panel
  produced a detached, ghosted copy of the popup on phones) and simplified the
  panel entrance from a stacked fade+zoom+slide to a single gentle fade + short
  rise, so the centred popup opens cleanly instead of stuttering.

## [0.9.1] - 2026-06-24

### Changed

- **Real demo video on the hero and thank-you page.** Replaced the placeholder
  reel with the client-provided recording (`public/hero-demo.mp4` and
  `public/thank-you.mp4`), so both surfaces now play the actual video instead of
  the render showcase / fallback.

## [0.9.0] - 2026-06-24

### Added

- **Google Analytics 4, running alongside the existing Umami integration.** GA4
  is for the client (free, hosted, familiar dashboards); Umami stays as our
  cookieless cross-check. Both are fully client-side, so both work on the static
  GitHub Pages export. The two trackers are independent: each loads only when
  its own PUBLIC env vars are set and is otherwise a complete no-op.
  - New `src/components/analytics/google-analytics.tsx` (gtag.js) and
    `analytics.tsx` (composes GA4 + Umami); the Umami component stays in
    `umami.tsx`. `trackEvent()` in `src/lib/analytics.ts` now fans each custom
    event out to both `window.gtag('event', …)` and `window.umami.track(…)`.
    The custom funnel event names are unchanged.
  - New env var `NEXT_PUBLIC_GA_ID` (the existing `NEXT_PUBLIC_UMAMI_*` vars are
    unchanged). Wired into `.env.example`, `.env.production.example`,
    `deploy-pages.yml` and `compose.yaml` build envs.
  - Privacy policy (`messages/he.json`) now discloses both trackers — GA4's
    cookies and Google as a processor, and Umami as cookieless/aggregate.
  - `docs/16-analytics.md` rewritten for the dual-tracker setup.

  The live GA4 measurement id (`G-SPLPV5SK6S`) and Umami website id are set in
  `deploy-pages.yml`. **Remaining before Umami ships:** set
  `NEXT_PUBLIC_UMAMI_SCRIPT_URL` to the instance's `…/script.js` URL (until then
  GA4 ships alone and Umami no-ops).

### Fixed

- **Mobile (real-device) layout polish — invisible on a minimized desktop
  window, only on an actual phone.**
  - Lead popup now centers vertically at all widths (was `items-end` below the
    `sm` breakpoint, so on a phone it stuck to the bottom of the screen) and
    scrolls if the form is taller than the viewport.
  - Hero `WaveText` no longer glitches over each letter: every letter keeps one
    stable GPU compositing layer (always `translate3d(...)`, pinned in CSS)
    instead of being promoted/demoted as the gold crest passes, and the
    per-frame text-shadow is lightened — both were re-rasterising every frame on
    weaker phone GPUs.
  - Tightened the vertical rhythm between the top home-page sections on mobile
    (hero → services → offers → process). Stacked `py-20`/`pb-16` paddings left
    ~140px dead gaps on phones; reduced to `py-12`/`pb-12` below `sm` while the
    desktop spacing (`sm:py-24`) is unchanged.

## [0.8.1] - 2026-06-24

### Changed

- **Live domain switched to the client's own `yarin-architecture.com`** (from the
  temporary `yarin.trickticmedia.com`). Updated `src/config/site.ts`,
  `NEXT_PUBLIC_SITE_URL` (`deploy-pages.yml` + `build:static`), `public/CNAME`,
  `public/llms.txt`, and the Cloudflare Worker (`SITE_ORIGIN`, route, `zone_name`).
  The domain now lives on the client's Cloudflare account; see the runbook at
  `docs/18-domain-switch.md`.

## [0.8.0] - 2026-06-24

Client-feedback rebrand round.

### Changed

- **Whole-site rebrand to a black · gold · white "dark luxury" palette.** The
  design-token system in `globals.css` was flipped from the cool light/slate
  scheme to a near-black canvas (`#0a0a0b`), warm-white text (`#f4f1ea`) and a
  metallic-gold brand accent (`#c9a84c`, brighter `#e4c878` for text/eyebrows).
  All derived surfaces, borders, gradients (`.text-gradient*`, `.text-shimmer`),
  the flowing `SiteBackground` blobs, scrollbar, beam/ring/glass utilities and
  the hero `WaveText` crest were re-tinted to the gold family; `color-scheme`
  and `themeColor` are now dark. Component-level `black/<alpha>` utilities were
  remapped to `white/<alpha>` for legibility on black, and dark-on-dark semantic
  text (success/error) was lightened.
- Buttons are livelier: the gold `brand` CTA now has a polished-metal sheen that
  sweeps on hover/focus (`.btn-sheen`), a subtle lift and a deeper gold glow.
- The professional title copy "מתכנן ומעצב פנים" → "אדריכל ומעצב פנים" across
  `messages/he.json` (per client request).
- Home page order: the services teaser now sits directly under the hero
  (swapped with the stats/numbers section) so it's the first content after the
  fold, notably on mobile.
- Home "about" (founder) block now shows the real full-bleed `yarin-portrait`
  (same image as the About page) filling a taller frame, instead of a small
  circular placeholder icon.

### Added

- **Lead-capture popup.** A single app-wide modal (`LeadDialogProvider` +
  `useLeadDialog` + `LeadButton`) reuses the existing name+phone `ContactForm`
  (→ `/api/contact` → `/thank-you`). Primary CTAs across the site (hero, offer,
  final CTA, header, footer) now open it instead of navigating to `/contact`.
  Closes on Escape, backdrop click, and on navigation (so it never lingers over
  the thank-you page).
- **Slide + fade page transitions** (`PageTransition`) replayed on every route
  change; respects `prefers-reduced-motion`.
- **Client testimonials on the home page.** The testimonials carousel (already
  on `/reviews`) now also appears on the home page for social proof, with six
  natural-Hebrew quotes (projects and locations across the center & north).
  These are real client feedback Yarin confirmed; names are changed at the
  clients' request, disclosed by a quiet privacy note. The "example reviews"
  notice is off (`testimonialsAreSamples = false`).
- **Contact links.** Instagram added to the header and footer; a persistent
  floating WhatsApp button (`FloatingWhatsApp`, inline-start corner) and the
  footer WhatsApp link now open WhatsApp with a ready-to-send Hebrew message.

## [0.7.0] - 2026-06-23

### Added

- A site-wide flowing colour-field background behind every page (home, all
  subpages and thank-you), mounted once in the locale layout as `SiteBackground`.
  Five large, soft blobs in the cool brand family (royal blue → sky → indigo →
  teal) drift on slow, independent loops over the off-white canvas; scrolling
  adds a gentle hue shift and parallax driven by a single rAF-throttled scroll
  listener (`--bg-scroll`, 0 → 1 down the page), so the palette visibly flows as
  you move. Honours `prefers-reduced-motion` (drops the scroll wiring and freezes
  the drift into a calm static mesh).

### Changed

- `--background` is now `transparent` and the solid off-white base moved to a new
  `--canvas` token painted on `<html>`. Every `bg-background` section is now a
  window onto the flowing field, while the sticky header backdrop and scrollbars
  switched to `bg-canvas` / `--canvas` so they keep their solid fill.

## [0.6.4] - 2026-06-23

### Fixed

- Gradient text (the stats numbers, page-hero highlights, trust-band quote, and
  the thank-you shimmer) became dark-on-dark and unreadable on phones whose
  browser force-darkens the page — e.g. Samsung Internet's "dark mode for
  websites". Such engines recolour text set via `color` but cannot touch text
  painted with `background-clip: text` (its ink is a background), so the
  gradient digits stayed dark while their card darkened. Added a
  `prefers-color-scheme: dark` fallback in `globals.css` that degrades
  `.text-gradient` / `.text-gradient-brand` / `.text-shimmer` to a solid
  foreground ink the engine can flip. No dark theme is introduced — the site
  stays light-locked; this only guarantees legibility if a browser overrides
  the lock.

## [0.6.3] - 2026-06-23

### Changed

- Removed the blue wash on the thank-you page. Three layers were tinting the
  hero blue and bleeding up behind the heading: the page's "aurora" radial
  gradient, the video's ambient `bg-brand/25 blur-[100px]` glow, and — the main
  culprit — the rotating `.beam` (a 180%-of-frame blue `conic-gradient`) on the
  video. All three are gone; the video keeps its `ring-shine` border + shadow,
  and the hero is now a clean light surface with only the neutral grid texture.

## [0.6.2] - 2026-06-23

### Changed

- **Live domain set to `yarin.trickticmedia.com`** (temporary; eventual target
  `yarin-avraham.co.il`). Updated `src/config/site.ts`, the Pages build env
  (`NEXT_PUBLIC_SITE_URL` in `deploy-pages.yml` + `build:static`), `public/CNAME`,
  `public/llms.txt`, and the Cloudflare Worker. The Worker's origin/siteUrl now
  come from a `SITE_ORIGIN` var in `worker/wrangler.toml` (route now
  `yarin.trickticmedia.com/api/contact`, zone `trickticmedia.com`), so future
  domain changes are a one-line edit.
- **Bigger thank-you video.** The post-conversion video is now the page
  centerpiece — the frame and surrounding sections widen from `max-w-4xl`/
  `max-w-5xl` to `max-w-6xl`, so on large screens it fills far more of the
  viewport instead of floating small with empty margin around it. Heading
  spacing tightened slightly to match.

## [0.6.1] - 2026-06-23

### Added

- **`sameAs` entity links + `image` in structured data.** `ProfessionalService`
  and `Person` JSON-LD now carry `sameAs` (Instagram) and a representative
  `image`, the strongest lever for AI answer engines to disambiguate and cite the
  entity. Profiles live in `siteConfig.profiles` and are filtered for empties, so
  new links activate with no code change.
- **WebP image pipeline.** New `scripts/optimize-images.mjs` (sharp) converts
  every `public/images/*.png` to a WebP sibling and is prepended to `build:static`
  (plus a standalone `optimize:images` script). Cut the referenced image payload
  ~90% (7.0 MB → 0.67 MB; the about portrait 1.8 MB → 0.22 MB) for a better LCP.
  Components reference the `.webp`; PNGs remain the in-repo source of truth.

### Fixed

- **Thank-you canonical** pointed at `/he/thank-you`, a locale-prefixed URL that
  doesn't exist on this root-served site. Now self-references `/thank-you`. The
  page stays `noindex,follow` and out of the sitemap.

### Security

- **Hardened the Cloudflare Worker lead endpoint** (`worker/src/contact.js`).
  Cross-origin browser submissions are now rejected (the `Origin`, when present,
  must be `https://yarin-avraham.co.il`), and the `name` field is escaped against
  spreadsheet formula injection — a leading `= + - @` (or tab/CR) is prefixed
  with `'` so a crafted name can't execute as a formula when the lead lands in
  the Google Sheet. `phone` needs no such guard (its charset allowlist already
  rejects `=`/`@`/letters). Volumetric abuse is covered by a Cloudflare Rate
  Limiting Rule on `/api/contact`.
- **Stopped committing the production n8n webhook URL.**
  `.env.production.example` now carries a `REPLACE_WITH_…` placeholder instead of
  the real webhook path; the `x-webhook-secret` shared secret remains the access
  gate.

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
