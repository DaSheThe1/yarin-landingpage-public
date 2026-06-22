# Agent playbook — yarin-landingpage

Read this file plus `README.md` and `docs/CONTENT-GUIDE.md` before editing.

## Project summary

Hebrew-first landing page for **ירין אליה אברהם** — architect & interior
designer (תכנון ועיצוב פנים לוילות ובתי יוקרה במרכז ובצפון). Single goal:
capture leads for a free initial consultation (₪997 value). The lead form
collects **name + phone only** → `/api/contact` → n8n webhook → `/thank-you`.

Next.js App Router + TypeScript + Tailwind/shadcn, pnpm, Playwright e2e.
**Hebrew-only** (single `he` locale, RTL, served at the root `/`). No database,
no public pricing, no payments. Scaffolded from the `automations-website`
template; the next-intl machinery stays so English can be added later.

## Repositories & publishing (mandatory)

There are **two** repos, with **one source of truth**:

- **This (private) repo** — the single source of truth. ALL work happens here:
  branch, PR, merge, version-bump. It also holds private material the public site
  must never expose (`n8n-workflows/`, VPS `infra/`, `Dockerfile`/`compose.yaml`/
  `deploy.sh`, the `video/` project, ad-hoc screenshots, `.env.local`).
- **The public repo** (`github.com/DaSheThe1/yarin-landingpage-public`) — a
  **generated mirror** that GitHub Pages builds from. **Never edit, commit, or
  merge in it directly.** It has no independent history worth preserving.

Workflow — nothing is done twice:

1. Develop + merge to `main` **here**.
2. Run `scripts/publish-public.sh`. It mirrors the working tree into the public
   clone (deny-listing the private paths above), normalizes the two e2e specs,
   runs a **hard leak gate** (aborts if any infra hostname, the leads Sheet id,
   the n8n webhook path, the real `.env.local` secret, or a private key appears),
   then commits + pushes.
3. The **public** repo's `deploy-pages.yml` builds the static export and deploys
   to Pages (public repos get free Actions minutes). This repo does not deploy.

Current live host: **`yarin.trickticmedia.com`** (temporary; eventual target is
`yarin-avraham.co.il`). The host lives in `src/config/site.ts` /
`NEXT_PUBLIC_SITE_URL` (build), `public/CNAME` (Pages), and `worker/wrangler.toml`
`SITE_ORIGIN` + route (Worker). To change domains, update those, re-publish, and
update the Pages custom domain + Cloudflare DNS/Worker route.

Rules: never commit real secrets or infra hostnames even **here** (examples use
`REPLACE_WITH_…` placeholders; real values live in `.env.local` / Cloudflare /
the n8n node). If you add a new private-only file, add it to the deny list in
`scripts/publish-public.sh` — but the leak gate is the real backstop, so a miss
fails the publish rather than leaking.

## Hebrew & i18n

- All user-facing copy lives in `messages/he.json`, keyed by section. Do not
  hardcode Hebrew strings in components — add a key and translate it.
- The site is RTL. `localeDirection.he = "rtl"`; the `<html dir>` is set from it.
- To add English later: append `"en"` to `locales` in `src/i18n/routing.ts`,
  switch `localePrefix` to `"as-needed"`, add `messages/en.json`, and restore a
  language switcher in the header.

## Versioning rules (mandatory)

Every change that alters app behavior, content, API responses, deployment, or
infrastructure ships with a version bump and a `CHANGELOG.md` entry in the same
commit.

1. Single source of truth: `version` in `package.json` (semver). `src/lib/
   version.ts` re-exports it as `APP_VERSION`; `GET /api/health` returns it.
2. Bump rules: **PATCH** = fixes/copy tweaks/refactors; **MINOR** = new
   pages/sections/features/env vars; **MAJOR** = breaking URL/contact-API/deploy
   changes.
3. Update `CHANGELOG.md` (Keep a Changelog format) under
   `## [x.y.z] - YYYY-MM-DD`.
4. Docs/comment/test-only edits skip the bump (note under `## [Unreleased]` if
   relevant).

## Folder ownership

- `src/app/[locale]/` — routes (home + services/examples/reviews/about/contact/
  thank-you/privacy/terms).
- `src/app/api/` — `/api/contact` (lead → n8n), `/api/health`.
- `src/components/sections/` — page sections. `src/components/layout/` — header/
  footer. `src/components/ui/` — primitives (no business logic in components).
- `src/config/` — `site.ts` (identity) and `navigation.ts`.
- `src/content/` — structural flags matched by index to `messages/he.json`
  (`offers`, `services` media, `stats`, `testimonials` sample flag, `faq` type).
- `src/lib/` — env access (`env.ts`), contact schema, seo, version, utils.
- `messages/he.json` — all copy.
- `public/` — images & videos (see `docs/CONTENT-GUIDE.md`). `public/CNAME` is
  the Pages custom domain; `public/.nojekyll` keeps `_next/` from being dropped.
- `.github/workflows/deploy-pages.yml` — the live deploy (static export → Pages).
- `worker/` — Cloudflare Worker that serves `POST /api/contact` in production
  (holds the n8n URL/secret). `scripts/flatten-locale-export.mjs` hoists the
  single-locale export to the site root; `scripts/optimize-images.mjs` makes WebP.
- `infra/`, `Dockerfile`, `compose.yaml`, `deploy.sh`, `.github/workflows/ci.yml`
  — **legacy VPS path, no longer used and excluded from the public mirror.** Do
  not wire new deployment to these; the site ships via GitHub Pages.

## Instructions for coding agents

- Use pnpm only (`packageManager: pnpm@11.5.2`); never npm/yarn.
- Match existing patterns: `@/` imports, Zod validation in `src/lib`, env access
  only through `src/lib/env.ts`, copy in `messages/he.json`.
- Server-only values (n8n webhook URL/secret) must never reach the browser, get
  a `NEXT_PUBLIC_` prefix, or appear in logs or source.
- The lead form is intentionally name + phone only — do not add fields without
  asking (lowest-friction lead capture is the whole point).

## Forbidden actions

- Committing secrets: real `.env*` files, webhook URLs, keys, tokens.
- Adding a database, payments, or public pricing.
- Presenting placeholder reviews as real (keep `testimonialsAreSamples = true`
  until genuine quotes exist).

## Testing

```bash
pnpm lint && pnpm typecheck && pnpm build
pnpm test:e2e      # when touching pages, navigation, or the lead flow
```

## Local preview (mandatory after applying changes)

After finishing a change — and always after a merge or after applying/pulling
new work — refresh the local dev server so the result is visible at
`http://localhost:3005`, then tell the user it is live there.

Simplest path — the helper script is idempotent (starts the server only if it
is down; Next.js hot-reload already reflects edited files in a running server):

```bash
scripts/dev-refresh.sh
```

Manual equivalent if you need a clean restart:

1. Stop any running server, then start a fresh one:
   ```bash
   pkill -f "next dev" 2>/dev/null; pnpm dev   # serves on port 3005
   ```
2. Confirm it is actually serving before reporting done:
   ```bash
   curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3005/   # expect 200
   ```
3. If the UI looks stale after a big change, clear the Next cache first
   (`rm -rf .next`) and restart.
