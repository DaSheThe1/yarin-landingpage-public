import { expect, test, type Page } from "@playwright/test";

// Hebrew is the default locale and is served at the root (/). English lives
// under /en. These smoke checks exercise the default (Hebrew) routes.
const routes = [
  { name: "home", path: "/", heading: /מערכות אוטומציה שמריצות/ },
  {
    name: "services",
    path: "/services",
    heading: /שלוש דרכים להעביר/,
  },
  { name: "examples", path: "/examples", heading: /תהליכי עבודה לדוגמה/ },
  { name: "reviews", path: "/reviews", heading: /מה לקוחות אומרים על/ },
  { name: "about", path: "/about", heading: /Daniel Shedrinsky/ },
  { name: "contact", path: "/contact", heading: /ספרו לנו מה חוזר/ },
  { name: "privacy", path: "/privacy", heading: /מדיניות פרטיות/ },
  { name: "terms", path: "/terms", heading: /תנאי שימוש/ },
] as const;

async function expectRouteToRender(
  page: Page,
  route: (typeof routes)[number]
) {
  const response = await page.goto(route.path, {
    waitUntil: "domcontentloaded",
  });
  expect(
    response?.ok(),
    `${route.name} should return a successful document response`
  ).toBe(true);
  await expect(
    page.getByRole("heading", { level: 1, name: route.heading })
  ).toBeVisible();
}

test.describe("route smoke checks", () => {
  for (const route of routes) {
    test(`renders ${route.name}`, async ({ page }) => {
      await expectRouteToRender(page, route);
    });
  }
});

test("the document is RTL and Hebrew on the default locale", async ({
  page,
}) => {
  await page.goto("/");
  const html = page.locator("html");
  await expect(html).toHaveAttribute("dir", "rtl");
  await expect(html).toHaveAttribute("lang", "he");
});

test("the English route renders under /en in LTR", async ({ page }) => {
  await page.goto("/en");
  const html = page.locator("html");
  await expect(html).toHaveAttribute("dir", "ltr");
  await expect(html).toHaveAttribute("lang", "en");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /Automation systems that run/,
    })
  ).toBeVisible();
});

test("home renders the key marketing sections", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /בחרו את רמת הליווי/ })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /ראו כמה זמן/ })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /שאלות, עם תשובות ישירות/ })
  ).toBeVisible();
});

test("health endpoint reports the app version", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.ok()).toBe(true);
  const body = await response.json();
  expect(body.ok).toBe(true);
  expect(body.version).toMatch(/^\d+\.\d+\.\d+$/);
});

test("the footer is present with the contact email", async ({ page }) => {
  await page.goto("/");
  const footer = page.getByRole("contentinfo");
  await expect(
    footer.getByRole("link", { name: /yarinavraham96@gmail\.com/ })
  ).toBeVisible();
});
