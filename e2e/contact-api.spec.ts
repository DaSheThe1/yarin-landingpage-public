import { expect, test } from "@playwright/test";

/**
 * API-contract tests for /api/contact.
 *
 * These intentionally exercise only paths that DO NOT forward to the live n8n
 * webhook: an invalid payload (rejected by schema before forwarding) and a
 * honeypot-triggered submission (short-circuited as accepted). The real
 * forward path is verified manually — see docs/testing.md — to avoid spamming
 * the production workflow on every test run.
 */

// The live form posts name + phone only; everything else is optional. This is
// the minimal valid payload the API now accepts.
const validPayload = {
  name: "API Test",
  phone: "+972500000000",
  company: "",
};

test("rejects an invalid payload with 400", async ({ request }) => {
  const res = await request.post("/api/contact", { data: { name: "x" } });
  expect(res.status()).toBe(400);
  const body = await res.json();
  expect(body.ok).toBe(false);
  expect(body.issues).toBeTruthy();
});

test("rejects a non-numeric phone with 400", async ({ request }) => {
  const res = await request.post("/api/contact", {
    data: { ...validPayload, phone: "TEXT" },
  });
  expect(res.status()).toBe(400);
  const body = await res.json();
  expect(body.issues?.phone).toBeTruthy();
});

test("rejects unknown extra fields (strict schema)", async ({ request }) => {
  const res = await request.post("/api/contact", {
    data: { ...validPayload, somethingExtra: "nope" },
  });
  expect(res.status()).toBe(400);
});

test("accepts a honeypot submission without forwarding", async ({
  request,
}) => {
  const res = await request.post("/api/contact", {
    data: { ...validPayload, company: "i-am-a-bot" },
  });
  expect(res.status()).toBe(202);
  const body = await res.json();
  expect(body.ok).toBe(true);
});
