import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright config for automations-website.
 *
 * By default Playwright boots its OWN Next dev server on PLAYWRIGHT_PORT using an
 * isolated build dir (.next-e2e), so it never clashes with a `pnpm dev` you may
 * already have running. To instead test an already-running server, set
 * PLAYWRIGHT_BASE_URL and PLAYWRIGHT_SKIP_WEBSERVER=1.
 */
const port = Number(process.env.PLAYWRIGHT_PORT ?? 3100);
const host = process.env.PLAYWRIGHT_HOST ?? "127.0.0.1";
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://${host}:${port}`;
const skipWebServer = process.env.PLAYWRIGHT_SKIP_WEBSERVER === "1";
const artifactDir =
  process.env.PLAYWRIGHT_ARTIFACT_DIR ?? "/tmp/automations-website-playwright";

export default defineConfig({
  testDir: "./e2e",
  // Serial against a single dev server avoids route-compile contention and
  // pre-hydration interaction flakes; one local retry absorbs rare timing.
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: 1,
  timeout: 45_000,
  expect: { timeout: 10_000 },
  outputDir: `${artifactDir}/test-results`,
  reporter: [
    ["list"],
    [
      "html",
      {
        open: "never",
        outputFolder: process.env.CI
          ? "./playwright-report"
          : `${artifactDir}/playwright-report`,
      },
    ],
  ],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    // Required on WSL / many CI images.
    launchOptions: {
      args: ["--no-sandbox", "--disable-dev-shm-usage"],
    },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: skipWebServer
    ? undefined
    : {
        // Production build + start: stable hydration and real CSS, matching
        // what actually deploys (avoids Turbopack dev's on-demand flakiness).
        // Uses an isolated build dir so it never clashes with `pnpm dev`.
        command: `pnpm exec next build && pnpm exec next start -H ${host} -p ${port}`,
        url: baseURL,
        timeout: 240_000,
        reuseExistingServer: !process.env.CI,
        stdout: "ignore",
        stderr: "pipe",
        env: {
          ...process.env,
          NEXT_DIST_DIR: process.env.NEXT_DIST_DIR ?? ".next-e2e",
        },
      },
});
