import { z } from "zod";

export const urgencyOptions = [
  "Just exploring",
  "This month",
  "As soon as possible",
  "Ongoing need",
] as const;

export const preferredContactMethodOptions = [
  "Email",
  "Phone",
  "WhatsApp",
] as const;

// Lenient international phone check, shared by the client form and the API so
// both reject the same way. We only allow phone-shaped characters (digits,
// spaces, and + - . ( ) separators) and require a sane digit count — enough to
// kill "TEXT"-style junk without rejecting any real Israeli or foreign number.
const PHONE_ALLOWED_CHARS = /^[\d\s+().-]+$/;

export function isValidPhone(value: string): boolean {
  const trimmed = value.trim();
  if (!PHONE_ALLOWED_CHARS.test(trimmed)) return false;
  const digits = trimmed.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => value ?? "");

// The live form asks for name + phone only (lowest-friction lead capture), so
// those are the only required fields. Every other field is optional and kept
// in the schema so the stashed full qualification form (contact-form-full.tsx)
// still validates unchanged if it is ever restored, and so n8n keeps receiving
// the same field shape.
export const contactSchema = z
  .object({
    name: z.string().trim().min(2).max(120),
    phone: z.string().trim().max(60).refine(isValidPhone),
    businessName: optionalText(160),
    email: z.email().max(254).optional().or(z.literal("")),
    website: optionalText(300),
    automationGoal: optionalText(2000),
    currentTools: optionalText(1500),
    manualPain: optionalText(2000),
    urgency: z.enum(urgencyOptions).optional(),
    preferredContactMethod: z.enum(preferredContactMethodOptions).optional(),
    // Locale the form was submitted in, so n8n can route/format the reply.
    // Optional + defaulted so older clients keep working.
    language: z.enum(["he", "en"]).optional().default("he"),
    company: z.string().trim().max(120).optional().default(""),
  })
  .strict();

export type ContactPayload = z.infer<typeof contactSchema>;
