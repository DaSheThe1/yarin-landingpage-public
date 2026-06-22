import { expect, test } from "@playwright/test";

// Default locale (Hebrew) nav labels and the headings they lead to.
const navTargets = [
  { label: "שירותים", heading: /שלוש דרכים להעביר/ },
  { label: "דוגמאות", heading: /תהליכי עבודה לדוגמה/ },
  { label: "ביקורות", heading: /מה לקוחות אומרים על/ },
  { label: "אודות", heading: /Daniel Shedrinsky/ },
  { label: "צור קשר", heading: /ספרו לנו מה חוזר/ },
] as const;

test("desktop header navigates to each page", async ({ page }) => {
  await page.goto("/");
  const header = page.getByRole("banner");

  for (const target of navTargets) {
    await header.getByRole("link", { name: target.label, exact: true }).click();
    await expect(
      page.getByRole("heading", { level: 1, name: target.heading })
    ).toBeVisible();
    await page.goto("/");
  }
});

test("the header CTA leads to the contact page", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("banner")
    .getByRole("link", { name: /לקביעת אבחון חינם/ })
    .click();
  await expect(page).toHaveURL(/\/contact$/);
  await expect(
    page.getByRole("heading", { level: 1, name: /ספרו לנו מה חוזר/ })
  ).toBeVisible();
});

test("the logo returns home", async ({ page }) => {
  await page.goto("/about");
  await page
    .getByRole("banner")
    .getByRole("link", { name: /TrickTic Automation/ })
    .click();
  await expect(page).toHaveURL(/\/he$/);
  await expect(
    page.getByRole("heading", { level: 1, name: /מערכות אוטומציה שמריצות/ })
  ).toBeVisible();
});

test("the language switcher swaps to English and preserves the page", async ({
  page,
}) => {
  await page.goto("/services");
  await page
    .getByRole("banner")
    .getByRole("link", { name: "EN", exact: true })
    .click();
  await expect(page).toHaveURL(/\/en\/services$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /Three ways to put your operations/,
    })
  ).toBeVisible();

  // ...and back to Hebrew.
  await page
    .getByRole("banner")
    .getByRole("link", { name: "עב", exact: true })
    .click();
  await expect(page).toHaveURL(/\/services$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "he");
});

test("the mobile menu opens and navigates", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await page.getByRole("button", { name: "פתיחת תפריט" }).click();
  const mobileNav = page.getByRole("navigation", { name: "ניווט נייד" });
  await expect(mobileNav).toBeVisible();

  await mobileNav.getByRole("link", { name: "שירותים", exact: true }).click();
  await expect(
    page.getByRole("heading", { level: 1, name: /שלוש דרכים להעביר/ })
  ).toBeVisible();
});
