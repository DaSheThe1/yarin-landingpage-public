# Agent Handoff Index

Use this file when starting a new coding session.

## Project identity

- Business: ירין אליה אברהם — תכנון ועיצוב פנים (architect & interior designer)
- Repo: `git@github.com:DaSheThe1/yarin-landingpage.git`
- Domain: `yarin.trickticmedia.com` (⚠️ placeholder — confirm before launch)
- Email: `yarinavraham96@gmail.com` · Phone: `050-901-0688`

## Start here

- `../AGENTS.md` — coding rules, folder ownership, versioning.
- `CONTENT-GUIDE.md` — **where all content/photos/videos/reviews go.**

## Reference docs (template-derived — update domain/image names as needed)

- `05-technical-architecture.md` — app architecture overview.
- `07-deployment-target.md` — Docker / VPS / nginx deploy runbook.
- `08-security-and-secrets.md` — secrets handling.
- `16-analytics.md` — Umami (privacy-friendly, cookieless) setup.
- `17-decision-local-ci-and-build-deploy.md` — local-CI + build-deploy model.
- `n8n-contact-workflow.md` — the lead → n8n webhook workflow.
- `testing.md` — Playwright e2e notes.

## Non-negotiables

- Hebrew-only for now (single `he` locale, RTL, root URLs).
- Lead form is name + phone only.
- No secrets in repo; n8n webhook is server-only.
- No database, payments, or public pricing.
- Don't present sample reviews as real (`testimonialsAreSamples`).
