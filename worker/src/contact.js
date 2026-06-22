// Cloudflare Worker for the lead form's POST /api/contact endpoint.
//
// The site is a static GitHub Pages export, so there is no Next.js server to run
// the original route handler (src/app/api/contact/route.ts). This Worker is its
// stand-in on the same domain: it validates name + phone, honors the honeypot,
// and forwards the lead to n8n with the shared secret header. The webhook URL and
// secret live as Worker secrets (wrangler secret put ...) and never reach the
// browser. Per-IP rate limiting is handled by a Cloudflare WAF Rate Limiting Rule
// on /api/contact (configured in the dashboard), so this Worker stays stateless.
//
// Validation mirrors src/lib/contact-schema.ts so the Worker and the client form
// reject the same inputs.

// The site's own origin (used for the same-origin check and the payload's
// siteUrl) comes from the SITE_ORIGIN var in wrangler.toml, so a domain change
// is a one-line edit there. Falls back to the current domain if unset.
const DEFAULT_ORIGIN = "https://yarin.trickticmedia.com";

const PHONE_ALLOWED_CHARS = /^[\d\s+().-]+$/;

function isValidPhone(value) {
  const trimmed = (value ?? "").trim();
  if (!trimmed || !PHONE_ALLOWED_CHARS.test(trimmed)) return false;
  const digits = trimmed.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

// Neutralize spreadsheet formula injection: a name beginning with = + - @ (or a
// tab/CR) would execute as a formula when the lead lands in Google Sheets.
// Prefix a single quote so Sheets stores it as literal text. Real names never
// start with these, so legitimate leads are untouched. (phone needs no such
// guard — PHONE_ALLOWED_CHARS already rejects =, @, and letters, so it cannot
// carry a HYPERLINK/IMPORTDATA-style formula.)
function sanitizeForSheet(value) {
  return /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
}

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

const worker = {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return json({ ok: false, error: "Method Not Allowed" }, 405);
    }

    // Block cross-site browser submissions. A same-origin form POST sends our
    // own Origin; any other Origin is not our form. Non-browser clients send no
    // Origin — those are gated by the n8n shared secret and the Cloudflare
    // rate-limiting rule on this route.
    const allowedOrigin = env.SITE_ORIGIN || DEFAULT_ORIGIN;
    const origin = request.headers.get("Origin");
    if (origin && origin !== allowedOrigin) {
      return json({ ok: false, error: "Forbidden" }, 403);
    }

    const body = await request.json().catch(() => null);

    // Honeypot: bots fill the hidden `company` field. Pretend success.
    if (body && body.company) {
      return json({ ok: true, message: "תודה. הפנייה התקבלה." }, 202);
    }

    const name = (body?.name ?? "").trim();
    const phone = (body?.phone ?? "").trim();

    if (name.length < 2 || name.length > 120 || !isValidPhone(phone)) {
      return json(
        { ok: false, error: "אנא בדקו את הפרטים שמולאו ונסו שוב." },
        400
      );
    }

    if (!env.N8N_WEBHOOK_URL) {
      return json(
        {
          ok: false,
          error:
            "הטופס אינו זמין כרגע. אפשר לפנות במייל yarinavraham96@gmail.com.",
        },
        503
      );
    }

    const headers = { "content-type": "application/json" };
    // Authenticate to n8n with a shared secret so a leaked webhook URL alone
    // can't be spammed. Only sent when configured.
    if (env.N8N_WEBHOOK_SECRET) {
      headers["x-webhook-secret"] = env.N8N_WEBHOOK_SECRET;
    }

    // Same payload shape src/app/api/contact/route.ts sent, so the n8n workflow
    // needs no changes.
    const payload = {
      source: "yarin-landingpage",
      type: "lead_form_submission",
      submittedAt: new Date().toISOString(),
      contact: { name: sanitizeForSheet(name), phone, email: "" },
      meta: {
        page: "/contact",
        siteUrl: allowedOrigin,
        language: body?.language === "en" ? "en" : "he",
      },
    };

    try {
      const response = await fetch(env.N8N_WEBHOOK_URL, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`n8n responded with ${response.status}`);
      return json({ ok: true, message: "תודה. הפנייה נשלחה." }, 202);
    } catch {
      return json(
        {
          ok: false,
          error:
            "אירעה שגיאה בשליחת הטופס. אפשר לפנות במייל yarinavraham96@gmail.com.",
        },
        502
      );
    }
  },
};

export default worker;
