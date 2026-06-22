import { NextResponse } from "next/server";

import { siteConfig } from "@/config/site";
import { contactSchema } from "@/lib/contact-schema";
import { getServerEnv } from "@/lib/env";
import { clientIp, rateLimit } from "@/lib/rate-limit";

// Per-IP throttle so the endpoint (and the n8n workflow it triggers) can't be
// scripted at scale. Generous enough that a real person retrying never hits it.
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

export async function POST(request: Request) {
  const limit = rateLimit(
    `contact:${clientIp(request)}`,
    RATE_LIMIT_MAX,
    RATE_LIMIT_WINDOW_MS
  );
  if (!limit.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: "יותר מדי בקשות. נסו שוב עוד מספר דקות.",
      },
      {
        status: 429,
        headers: { "retry-after": String(limit.retryAfterSeconds) },
      }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "אנא בדקו את הפרטים שמולאו ונסו שוב.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  // Honeypot: bots fill the hidden `company` field. Pretend success.
  if (parsed.data.company) {
    return NextResponse.json(
      {
        ok: true,
        message: "תודה. הפנייה התקבלה.",
      },
      { status: 202 }
    );
  }

  const env = getServerEnv();
  const submittedAt = new Date().toISOString();
  // The live lead form sends name + phone only.
  const payload = {
    source: "yarin-landingpage",
    type: "lead_form_submission",
    submittedAt,
    contact: {
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email ?? "",
    },
    meta: {
      page: "/contact",
      siteUrl: siteConfig.url,
      language: parsed.data.language,
    },
  };

  if (!env.n8nWebhookUrl) {
    console.error(
      JSON.stringify({
        event: "lead_form_submission",
        status: "webhook_not_configured",
        timestamp: submittedAt,
      })
    );

    return NextResponse.json(
      {
        ok: false,
        error: `הטופס אינו זמין כרגע. אפשר לפנות במייל ${siteConfig.email}.`,
      },
      { status: 503 }
    );
  }

  const headers: Record<string, string> = {
    "content-type": "application/json",
  };
  // Authenticate to n8n with a shared secret so a leaked webhook URL can't be
  // spammed directly. Only sent when configured (keeps local/dev flexible).
  if (env.n8nWebhookSecret) {
    headers["x-webhook-secret"] = env.n8nWebhookSecret;
  }

  try {
    const response = await fetch(env.n8nWebhookUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`n8n responded with ${response.status}`);
    }

    console.info(
      JSON.stringify({
        event: "lead_form_submission",
        status: "sent_to_n8n",
        timestamp: submittedAt,
      })
    );

    return NextResponse.json(
      {
        ok: true,
        message: "תודה. הפנייה נשלחה.",
      },
      { status: 202 }
    );
  } catch {
    console.error(
      JSON.stringify({
        event: "lead_form_submission",
        status: "n8n_forward_failed",
        timestamp: submittedAt,
      })
    );

    return NextResponse.json(
      {
        ok: false,
        error: `אירעה שגיאה בשליחת הטופס. אפשר לפנות במייל ${siteConfig.email}.`,
      },
      { status: 502 }
    );
  }
}
