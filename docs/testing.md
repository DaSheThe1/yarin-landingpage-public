# Testing

End-to-end tests for automations-website use [Playwright](https://playwright.dev/).
They run Chromium against a **production build** of the site (`next build` +
`next start`) for stable hydration and real CSS — the same thing that deploys.

## Quick start

```bash
pnpm install
pnpm test:e2e:install   # one-time: downloads the Chromium browser
pnpm test:e2e           # build + start the app, run the whole suite
```

Other scripts:

| Command | What it does |
| --- | --- |
| `pnpm test:e2e` | Run all tests (headless). |
| `pnpm test:e2e:headed` | Run with a visible browser. |
| `pnpm test:e2e:ui` | Open the Playwright UI runner. |
| `pnpm test:e2e:report` | Open the last HTML report. |
| `pnpm test:e2e:install` | Install the Chromium browser binary. |

## How it works

- `playwright.config.ts` starts its own server: `next build && next start` on
  `PLAYWRIGHT_PORT` (default **3100**), using an isolated build dir
  (`.next-e2e`) so it never clobbers a `pnpm dev` you may have running.
- Chromium launches with `--no-sandbox --disable-dev-shm-usage` (required on
  WSL and most CI images).
- Tests run serially (`workers: 1`) against the single server, with one local
  retry, to keep things deterministic.
- Local artifacts (HTML report, traces, screenshots) go to
  `/tmp/automations-website-playwright`; in CI they go to `./playwright-report`
  and `./test-results`. Both are git-ignored.

### Useful env vars

| Variable | Default | Purpose |
| --- | --- | --- |
| `PLAYWRIGHT_PORT` | `3100` | Port for the test server. |
| `PLAYWRIGHT_BASE_URL` | `http://127.0.0.1:<port>` | Target an existing server. |
| `PLAYWRIGHT_SKIP_WEBSERVER` | unset | `1` = don't start a server (use with `PLAYWRIGHT_BASE_URL`). |
| `PLAYWRIGHT_ARTIFACT_DIR` | `/tmp/automations-website-playwright` | Where local reports/traces land. |

To run against an already-running server (faster iteration):

```bash
PLAYWRIGHT_SKIP_WEBSERVER=1 PLAYWRIGHT_BASE_URL=http://127.0.0.1:3001 pnpm test:e2e
```

## What's covered (`e2e/`)

| File | Coverage |
| --- | --- |
| `smoke.spec.ts` | Every route (`/`, `/services`, `/examples`, `/about`, `/contact`, `/privacy`, `/terms`) returns 200 and renders its `<h1>`; key home sections and the footer email are present. |
| `navigation.spec.ts` | Desktop header links, the header CTA, the logo-home link, and the mobile menu all navigate correctly. |
| `contact-form.spec.ts` | The multi-step wizard: per-step validation blocks advancing, suggestion chips add/remove on toggle, the full flow reaches the success screen (network mocked), and a server error keeps the form intact. |
| `contact-api.spec.ts` | `/api/contact` contract: invalid payloads → 400, unknown fields → 400 (strict schema), honeypot submissions → 202 without forwarding. |

### Regression note

The wizard test guards a real bug it caught: clicking **Continue** to reach the
final step used to swap a `type="submit"` button under the click and submit the
form immediately. The form now uses a single persistent primary button and the
`<form>` never implicitly submits.

## n8n contact pipeline

Automated tests **never hit the live n8n webhook**:

- `contact-form.spec.ts` mocks `**/api/contact` in the browser.
- `contact-api.spec.ts` only exercises paths that short-circuit before
  forwarding (schema rejection and the honeypot).

To verify the real forward to n8n end-to-end manually (against a running app
with `N8N_WEBHOOK_URL` set in `.env.local`):

```bash
curl -i -X POST http://localhost:3001/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Manual Probe","businessName":"Test Co.","email":"probe@example.com",
    "phone":"+972500000000","website":"example.com",
    "automationGoal":"End-to-end verification of the contact pipeline.",
    "currentTools":"Gmail, Sheets","manualPain":"Manual copy-paste between tools.",
    "urgency":"Just exploring","preferredContactMethod":"Email","company":""
  }'
```

Expect `HTTP/1.1 202` and `{"ok":true,...}`, plus a new row + notification in
your n8n workflow (see `docs/n8n-contact-workflow.md`).

## CI notes

- `forbidOnly` and 2 retries are enabled when `CI=1`.
- The Chromium launch flags already cover headless CI runners; install the
  browser with `pnpm test:e2e:install` (or `playwright install --with-deps
  chromium` on a fresh image).
