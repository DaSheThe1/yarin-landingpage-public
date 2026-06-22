import { expect, test } from "@playwright/test";

// The default locale (Hebrew) form is what loads at /contact. The live form is
// the minimal name + phone lead-capture form (the richer qualification form is
// stashed in contact-form-full.tsx).
const details = {
  name: "Playwright User",
  phone: "0500000000",
};

const submit = "שיחזרו אליי בטלפון";

test("shows inline errors when submitted empty", async ({ page }) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: submit }).click();

  await expect(page.getByText("אנא הזינו את שמכם.")).toBeVisible();
  await expect(
    page.getByText("אנא הזינו מספר טלפון או WhatsApp.")
  ).toBeVisible();
  // No navigation happened — still on the contact page.
  await expect(page).toHaveURL(/\/contact$/);
});

test("submits name + phone and redirects to thank-you (mocked)", async ({
  page,
}) => {
  await page.route("**/api/contact", (route) =>
    route.fulfill({
      status: 202,
      contentType: "application/json",
      body: JSON.stringify({ ok: true, message: "Thanks." }),
    })
  );

  await page.goto("/contact");
  await page.getByPlaceholder("ישראל ישראלי").fill(details.name);
  await page.getByPlaceholder(/050/).fill(details.phone);
  await page.getByRole("button", { name: submit }).click();

  await expect(page).toHaveURL(/\/thank-you$/);
  await expect(
    page.getByRole("heading", { level: 1, name: /עשיתם עכשיו את הצעד הראשון/ })
  ).toBeVisible();
});

test("surfaces a server error without losing the form (mocked 503)", async ({
  page,
}) => {
  await page.route("**/api/contact", (route) =>
    route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({
        ok: false,
        error:
          "הטופס אינו זמין כרגע. אנא שלחו אימייל אל yarinavraham96@gmail.com.",
      }),
    })
  );

  await page.goto("/contact");
  await page.getByPlaceholder("ישראל ישראלי").fill(details.name);
  await page.getByPlaceholder(/050/).fill(details.phone);
  await page.getByRole("button", { name: submit }).click();

  await expect(page.getByText(/אינו זמין כרגע/)).toBeVisible();
  // Still on the contact page (not redirected to thank-you).
  await expect(page).toHaveURL(/\/contact$/);
});
