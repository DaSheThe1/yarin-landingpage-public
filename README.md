# ירין אליה אברהם — אתר נחיתה / Yarin Avraham Landing Page

Hebrew-first landing page for **ירין אליה אברהם**, architect & interior designer
(תכנון ועיצוב פנים לוילות ובתי יוקרה במרכז ובצפון). The single goal of the page
is lead capture: book a free initial consultation (₪997 value) — the form
collects **name + phone only**.

Built on the same Next.js stack as the source automations-website template, but
**Hebrew-only** (RTL, served at the root `/`). The next-intl machinery is kept
in place so English can be added later by re-enabling a second locale in
`src/i18n/routing.ts`.

> **Where to add content:** see [`docs/CONTENT-GUIDE.md`](docs/CONTENT-GUIDE.md)
> — it maps every piece of copy, image, and video to the exact file/key to edit.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS + shadcn/ui (`@base-ui/react`)
- next-intl (Hebrew locale)
- pnpm · Docker · Docker Compose
- Playwright e2e

## Local Development

```bash
pnpm install
pnpm dev          # http://localhost:3005
```

Checks:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

## Content & assets

- **Copy** lives in [`messages/he.json`](messages/he.json) (keyed by section).
- **Images / videos** go in [`public/`](public/) — hero video at
  `public/hero-demo.mp4`, thank-you video at `public/thank-you.mp4`, service/
  project media under `public/services` & `public/projects` (referenced from
  `src/content/*.ts`). Missing media degrades gracefully to a placeholder.
- **Identity** (name, phone, email, domain) lives in
  [`src/config/site.ts`](src/config/site.ts).
- **Reviews** are currently flagged as samples in
  `src/content/testimonials.ts` (`testimonialsAreSamples = true`); flip to
  `false` once real client quotes replace the placeholders in `messages/he.json`.

See [`docs/CONTENT-GUIDE.md`](docs/CONTENT-GUIDE.md) for the full checklist.

## Environment Variables

Copy `.env.example` to `.env.local` for development; set production values in
`.env.production` on the host (see `.env.production.example`). The contact form
forwards to an n8n webhook (`N8N_WEBHOOK_URL`); until it's configured the form
returns a friendly "temporarily unavailable" message.

## Versioning

The version lives in `package.json` and is reported by `GET /api/health`. Every
behavior-changing commit bumps it (semver) and adds a `CHANGELOG.md` entry —
rules in [`AGENTS.md`](AGENTS.md).

## Deployment

The Docker / compose / `deploy.sh` / nginx setup is carried over from the
template as a starting point. **Before deploying:** confirm the real domain and
update `src/config/site.ts`, the env files, `compose.yaml`, `deploy.sh`, and
`infra/nginx/`. See [`docs/07-deployment-target.md`](docs/07-deployment-target.md).

```bash
# on the host, with .env.production present:
./deploy.sh
```

- `next.config.ts` uses `output: "standalone"` for container deployment.
- `GET /api/health` is the liveness probe and reports the running version.
