import { expect, test, type Page } from "@playwright/test";

// Google Analytics (GA4) funnel events. These tests STUB the tracker (no live
// GA property or env needed): before any navigation we inject a capturing stub
// at `window.gtag` that pushes every event into `window.__gaEvents`, then drive
// the REAL UI and assert what got captured via page.evaluate.
//
// The default e2e server has NO GA env, so `<Analytics/>` renders nothing and
// the real `window.gtag` is never defined — our stub is the only thing
// providing it, which is exactly the contract we want to exercise.

type CapturedEvent = { name: string; data?: Record<string, unknown> };

declare global {
  interface Window {
    __gaEvents?: CapturedEvent[];
  }
}

// Inject the capturing stub before the page's own scripts run so no real
// trackEvent() call is ever missed. trackEvent() calls
// `gtag('event', name, data)`, so we capture the 2nd/3rd args.
async function installGtagStub(page: Page) {
  await page.addInitScript(() => {
    window.__gaEvents = [];
    window.gtag = (
      command: string,
      name: string,
      data?: Record<string, unknown>
    ) => {
      if (command === "event") {
        window.__gaEvents?.push({ name, data });
      }
    };
  });
}

function readEvents(page: Page): Promise<CapturedEvent[]> {
  return page.evaluate(() => window.__gaEvents ?? []);
}

// --- Contact-form wizard helpers (mirrors e2e/contact-form.spec.ts) ----------
const details = {
  name: "Playwright User",
  business: "Test Co.",
  email: "playwright@example.com",
  phone: "0500000000",
};

async function fillStepOne(page: Page) {
  await page.getByPlaceholder("ישראל ישראלי").fill(details.name);
  await page.getByPlaceholder('אקמה בע"מ').fill(details.business);
  await page.getByPlaceholder("name@acme.co.il").fill(details.email);
  await page.getByPlaceholder(/050/).fill(details.phone);
  await page.getByRole("button", { name: "המשך" }).click();
}

async function fillStepTwo(page: Page) {
  await expect(page.getByPlaceholder(/כל ליד חדש/)).toBeVisible();
  await page.getByRole("button", { name: /מעקבי לידים/ }).click();
  await page.getByRole("button", { name: /Gmail/ }).click();
  await page
    .getByPlaceholder(/מעתיקים פרטים/)
    .fill("אנחנו מעתיקים נתונים בין שלושה כלים ידנית בכל יום.");
  await page.getByRole("button", { name: "המשך" }).click();
}

// 1. lead_submitted — the most important event. Fires once on a successful
//    submission with a non-PII payload (urgency + preferredContactMethod only).
test("lead_submitted fires once with a non-PII payload on success", async ({
  page,
}) => {
  await installGtagStub(page);
  await page.route("**/api/contact", (route) =>
    route.fulfill({
      status: 202,
      contentType: "application/json",
      body: JSON.stringify({ ok: true, message: "Thanks." }),
    })
  );

  await page.goto("/contact");
  await fillStepOne(page);
  await fillStepTwo(page);

  await expect(page.getByText("סקירה מהירה")).toBeVisible();
  await page.getByRole("button", { name: "שליחת הבקשה" }).click();
  await expect(page).toHaveURL(/\/thank-you$/);

  const events = await readEvents(page);
  const leads = events.filter((e) => e.name === "lead_submitted");
  expect(leads).toHaveLength(1);

  const data = leads[0].data ?? {};
  // Correct categorical shape...
  expect(data).toHaveProperty("urgency");
  expect(data).toHaveProperty("preferredContactMethod");
  expect(typeof data.urgency).toBe("string");
  expect(typeof data.preferredContactMethod).toBe("string");
  // ...and absolutely no PII.
  const keys = Object.keys(data);
  for (const pii of ["name", "email", "phone", "businessName", "business"]) {
    expect(keys).not.toContain(pii);
  }
  // Defence in depth: no captured value leaks the submitted PII anywhere.
  const serialized = JSON.stringify(data);
  expect(serialized).not.toContain(details.email);
  expect(serialized).not.toContain(details.name);
  expect(serialized).not.toContain(details.phone);
});

// 2. thankyou_video_watch — fires when the user clicks "play with sound".
test("thankyou_video_watch fires on the play-with-sound click", async ({
  page,
}) => {
  await installGtagStub(page);
  await page.goto("/thank-you");

  // The play-with-sound control only appears once the video is ready. Its
  // accessible name is the Hebrew "הפעלת ההודעה עם סאונד" (playAria).
  const playButton = page.getByRole("button", {
    name: "הפעלת ההודעה עם סאונד",
  });
  await expect(playButton).toBeVisible();
  await playButton.click();

  // Event is fired synchronously inside playWithSound(), before video.play().
  await expect
    .poll(async () =>
      (await readEvents(page)).filter((e) => e.name === "thankyou_video_watch")
        .length
    )
    .toBe(1);
});

// 3. hero_video_watch — fires when the user triggers the hero demo's fullscreen
//    control. expand() returns early unless the video is `ready`, so the test
//    waits for the "fullscreen" button (which only renders once ready) before
//    clicking. The event fires BEFORE requestFullscreen(), so fullscreen does
//    not need to actually succeed headless.
test("hero_video_watch fires when the hero demo fullscreen control is used", async ({
  page,
}) => {
  await installGtagStub(page);
  await page.goto("/");

  // The fullscreen button renders only after the <video> reaches a ready
  // state (canplay / readyState >= HAVE_FUTURE_DATA). public/hero-demo.mp4
  // exists, so this resolves in the prod build; give it generous time.
  const fullscreenButton = page.getByRole("button", {
    name: "צפייה בהדגמה במסך מלא",
  });
  await expect(fullscreenButton).toBeVisible({ timeout: 30_000 });

  // trackEvent fires synchronously at the TOP of expand(), before the actual
  // requestFullscreen() call — so we don't need fullscreen to succeed. We read
  // events immediately after the click. (A real headless requestFullscreen can
  // briefly destabilise the page, so avoid further interactions afterwards.)
  await fullscreenButton.click();

  const events = await readEvents(page);
  const hero = events.filter((e) => e.name === "hero_video_watch");
  expect(hero).toEqual([{ name: "hero_video_watch", data: { location: "hero" } }]);
});

// 4. No-op safety — with NO gtag stub and NO GA env (the default server), the
//    loader script is absent and interacting never throws.
test("unconfigured analytics is inert: no loader script, no throw on submit", async ({
  page,
}) => {
  const pageErrors: Error[] = [];
  page.on("pageerror", (err) => pageErrors.push(err));

  await page.route("**/api/contact", (route) =>
    route.fulfill({
      status: 202,
      contentType: "application/json",
      body: JSON.stringify({ ok: true, message: "Thanks." }),
    })
  );

  await page.goto("/contact");

  // Neither tracker's loader must be present when its env is unset (loader-
  // rendering with env set is a trivial build-time guard, covered by code
  // review — see src/components/analytics/{google-analytics,umami}.tsx).
  await expect(
    page.locator('script[src*="googletagmanager.com/gtag"]')
  ).toHaveCount(0);
  await expect(page.locator("script[data-website-id]")).toHaveCount(0);
  // And neither global was defined (we did not install the stub here).
  expect(await page.evaluate(() => typeof window.gtag)).toBe("undefined");
  expect(await page.evaluate(() => typeof window.umami)).toBe("undefined");

  // Drive a real interaction whose success path calls trackEvent(): it must be
  // a silent no-op, not a throw.
  await fillStepOne(page);
  await fillStepTwo(page);
  await page.getByRole("button", { name: "שליחת הבקשה" }).click();
  await expect(page).toHaveURL(/\/thank-you$/);

  expect(pageErrors).toEqual([]);
});
