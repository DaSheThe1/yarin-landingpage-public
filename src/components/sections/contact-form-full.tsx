"use client";

import { Fragment, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Send,
  Sparkles,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import {
  preferredContactMethodOptions,
  urgencyOptions,
} from "@/lib/contact-schema";
import { siteConfig } from "@/config/site";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type Values = {
  name: string;
  businessName: string;
  email: string;
  phone: string;
  website: string;
  automationGoal: string;
  currentTools: string;
  manualPain: string;
  urgency: string;
  preferredContactMethod: string;
};

const STEP_COUNT = 3;

const fieldBase =
  "h-11 w-full rounded-lg border bg-black/[0.03] px-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-subtle-foreground hover:border-black/20 focus:ring-3 focus:ring-brand-accent/20";
const textareaBase =
  "w-full rounded-lg border bg-black/[0.03] px-3.5 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-subtle-foreground hover:border-black/20 focus:ring-3 focus:ring-brand-accent/20";

function borderFor(error?: string) {
  return error
    ? "border-rose-400/60 focus:border-rose-400/60"
    : "border-black/10 focus:border-brand-accent/60";
}

const initialValues: Values = {
  name: "",
  businessName: "",
  email: "",
  phone: "",
  website: "",
  automationGoal: "",
  currentTools: "",
  manualPain: "",
  // Enum *values* stay stable (English) so the API contract never shifts; the
  // labels shown to the user are translated at render time.
  urgency: urgencyOptions[0],
  preferredContactMethod: preferredContactMethodOptions[0],
};

// STASHED (v0.11.0): the original 3-step qualification form. Replaced on the
// live /contact page by the minimal name + phone form in `contact-form.tsx`.
// Kept here, fully working, so it can be restored without git archaeology —
// swap the import in `src/app/[locale]/contact/page.tsx` back to this export.
export function ContactFormFull() {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("contactForm");
  const tFields = useTranslations("contactForm.fields");
  const tErrors = useTranslations("contactForm.errors");
  const steps = t.raw("steps") as string[];
  const goalSuggestions = t.raw("goalSuggestions") as string[];
  const toolSuggestions = t.raw("toolSuggestions") as string[];

  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Values>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState("");

  const set = (key: keyof Values, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const toggleToken = (key: keyof Values, token: string) => {
    setValues((prev) => {
      const current = prev[key];
      const at = current.toLowerCase().indexOf(token.toLowerCase());
      let next: string;
      if (at >= 0) {
        // Remove the first occurrence and tidy up stray separators.
        next = (current.slice(0, at) + current.slice(at + token.length))
          .replace(/\s{2,}/g, " ")
          .replace(/\s*,\s*,/g, ", ")
          .replace(/^[\s,]+|[\s,]+$/g, "")
          .trim();
      } else {
        next = current.trim() ? `${current.trim()}, ${token}` : token;
      }
      return { ...prev, [key]: next };
    });
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  function validateStep(s: number) {
    const e: Partial<Record<keyof Values, string>> = {};
    if (s === 0) {
      if (values.name.trim().length < 2) e.name = tErrors("name");
      if (values.businessName.trim().length < 2)
        e.businessName = tErrors("business");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
        e.email = tErrors("email");
      if (values.phone.trim().length < 3) e.phone = tErrors("phone");
    }
    if (s === 1) {
      if (values.automationGoal.trim().length < 10)
        e.automationGoal = tErrors("goal");
      if (values.currentTools.trim().length < 2)
        e.currentTools = tErrors("tools");
      if (values.manualPain.trim().length < 10) e.manualPain = tErrors("pain");
    }
    return e;
  }

  function next() {
    const e = validateStep(step);
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setErrors({});
    setStep((s) => Math.min(s + 1, STEP_COUNT - 1));
  }

  function back() {
    setServerError("");
    setStep((s) => Math.max(s - 1, 0));
  }

  async function submitForm() {
    const e = { ...validateStep(0), ...validateStep(1) };
    if (Object.keys(e).length) {
      setErrors(e);
      setStep(e.name || e.businessName || e.email || e.phone ? 0 : 1);
      return;
    }

    setIsSubmitting(true);
    setServerError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...values, language: locale, company: "" }),
      });
      const result = (await response.json()) as {
        ok?: boolean;
        error?: string;
      };

      if (!response.ok || !result.ok) {
        setServerError(
          result.error ?? t("serverError", { email: siteConfig.email })
        );
        setIsSubmitting(false);
        return;
      }
      // Funnel: a successful lead. Only non-identifying categorical fields —
      // never name/email/phone.
      trackEvent("lead_submitted", {
        urgency: values.urgency,
        preferredContactMethod: values.preferredContactMethod,
      });
      // Hand the lead off to the dedicated thank-you page (video + next steps).
      // Keep the submitting/redirecting state on until the navigation lands so
      // the form never flashes back to an interactive state.
      setDone(true);
      router.push("/thank-you");
    } catch {
      setServerError(t("serverError", { email: siteConfig.email }));
      setIsSubmitting(false);
    }
  }

  const isLastStep = step === STEP_COUNT - 1;

  if (done) return <RedirectingCard />;

  return (
    <form onSubmit={(event) => event.preventDefault()} noValidate>
      <Stepper step={step} steps={steps} />

      <div key={step} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {step === 0 ? (
          <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label={tFields("name.label")} error={errors.name}>
                <input
                  className={cn(fieldBase, borderFor(errors.name))}
                  placeholder={tFields("name.placeholder")}
                  autoComplete="name"
                  value={values.name}
                  onChange={(e) => set("name", e.target.value)}
                />
              </Field>
              <Field label={tFields("business.label")} error={errors.businessName}>
                <input
                  className={cn(fieldBase, borderFor(errors.businessName))}
                  placeholder={tFields("business.placeholder")}
                  autoComplete="organization"
                  value={values.businessName}
                  onChange={(e) => set("businessName", e.target.value)}
                />
              </Field>
              <Field label={tFields("email.label")} error={errors.email}>
                <input
                  type="email"
                  className={cn(fieldBase, borderFor(errors.email))}
                  placeholder={tFields("email.placeholder")}
                  autoComplete="email"
                  value={values.email}
                  onChange={(e) => set("email", e.target.value)}
                />
              </Field>
              <Field label={tFields("phone.label")} error={errors.phone}>
                <input
                  className={cn(fieldBase, borderFor(errors.phone))}
                  placeholder={tFields("phone.placeholder")}
                  autoComplete="tel"
                  value={values.phone}
                  onChange={(e) => set("phone", e.target.value)}
                />
              </Field>
            </div>
            <Field label={tFields("website.label")} optional error={undefined}>
              <input
                className={cn(fieldBase, borderFor())}
                placeholder={tFields("website.placeholder")}
                autoComplete="url"
                value={values.website}
                onChange={(e) => set("website", e.target.value)}
              />
            </Field>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="space-y-5">
            <Field label={tFields("goal.label")} error={errors.automationGoal}>
              <textarea
                className={cn(textareaBase, "min-h-24", borderFor(errors.automationGoal))}
                placeholder={tFields("goal.placeholder")}
                value={values.automationGoal}
                onChange={(e) => set("automationGoal", e.target.value)}
              />
              <SuggestionChips
                items={goalSuggestions}
                value={values.automationGoal}
                onPick={(t) => toggleToken("automationGoal", t)}
              />
            </Field>

            <Field label={tFields("tools.label")} error={errors.currentTools}>
              <textarea
                className={cn(textareaBase, "min-h-20", borderFor(errors.currentTools))}
                placeholder={tFields("tools.placeholder")}
                value={values.currentTools}
                onChange={(e) => set("currentTools", e.target.value)}
              />
              <SuggestionChips
                items={toolSuggestions}
                value={values.currentTools}
                onPick={(t) => toggleToken("currentTools", t)}
              />
            </Field>

            <Field label={tFields("pain.label")} error={errors.manualPain}>
              <textarea
                className={cn(textareaBase, "min-h-24", borderFor(errors.manualPain))}
                placeholder={tFields("pain.placeholder")}
                value={values.manualPain}
                onChange={(e) => set("manualPain", e.target.value)}
              />
            </Field>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label={tFields("urgency.label")} error={undefined}>
                <select
                  className={cn(fieldBase, borderFor(), "[&>option]:bg-surface-2")}
                  value={values.urgency}
                  onChange={(e) => set("urgency", e.target.value)}
                >
                  {urgencyOptions.map((o) => (
                    <option key={o} value={o}>
                      {t(`urgencyOptions.${o}`)}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={tFields("contactMethod.label")} error={undefined}>
                <select
                  className={cn(fieldBase, borderFor(), "[&>option]:bg-surface-2")}
                  value={values.preferredContactMethod}
                  onChange={(e) => set("preferredContactMethod", e.target.value)}
                >
                  {preferredContactMethodOptions.map((o) => (
                    <option key={o} value={o}>
                      {t(`contactMethodOptions.${o}`)}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <ReviewSummary values={values} />

            {serverError ? (
              <p
                role="alert"
                className="rounded-lg border border-rose-400/30 bg-rose-400/10 p-3 text-sm text-rose-300"
              >
                {serverError}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between gap-3 border-t border-black/[0.06] pt-6">
        {step > 0 ? (
          <button
            type="button"
            onClick={back}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 rtl:-scale-x-100" />
            {t("back")}
          </button>
        ) : (
          <span className="text-xs text-subtle-foreground">{t("takesTwoMin")}</span>
        )}

        {/* One persistent button (same DOM node across steps) so advancing to
            the final step never swaps a submit button under the click. */}
        <button
          type="button"
          disabled={isSubmitting}
          onClick={isLastStep ? submitForm : next}
          className={cn(
            buttonVariants({ variant: "brand" }),
            "h-11 rounded-lg px-5 text-[15px]"
          )}
        >
          {isSubmitting ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              {t("sending")}
            </>
          ) : isLastStep ? (
            <>
              <Send data-icon="inline-start" />
              {t("send")}
            </>
          ) : (
            <>
              {t("continue")}
              <ArrowRight data-icon="inline-end" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}

function Stepper({ step, steps }: { step: number; steps: string[] }) {
  const t = useTranslations("contactForm");
  return (
    <div className="mb-8">
      <p className="mb-3 font-mono text-xs uppercase tracking-wider text-subtle-foreground">
        {t("stepOf", { current: step + 1, total: STEP_COUNT })} · {steps[step]}
      </p>
      <div className="flex items-center">
        {steps.map((label, i) => {
          const complete = i < step;
          const current = i === step;
          return (
            <Fragment key={label}>
              <div className="flex items-center gap-2.5">
                <span
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-medium transition-colors",
                    complete
                      ? "border-brand bg-brand text-primary-foreground"
                      : current
                        ? "border-brand-accent/60 bg-brand/15 text-brand-accent"
                        : "border-black/10 bg-black/[0.03] text-subtle-foreground"
                  )}
                >
                  {complete ? <Check className="h-4 w-4" /> : i + 1}
                </span>
                <span
                  className={cn(
                    "hidden text-sm transition-colors sm:inline",
                    current || complete
                      ? "text-foreground"
                      : "text-subtle-foreground"
                  )}
                >
                  {label}
                </span>
              </div>
              {i < steps.length - 1 ? (
                <div className="mx-3 h-px flex-1 overflow-hidden rounded-full bg-black/[0.08]">
                  <div
                    className={cn(
                      "h-full bg-gradient-to-r from-brand to-brand-accent transition-all duration-500",
                      complete ? "w-full" : "w-0"
                    )}
                  />
                </div>
              ) : null}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

function SuggestionChips({
  items,
  value,
  onPick,
}: {
  items: string[];
  value: string;
  onPick: (t: string) => void;
}) {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {items.map((item) => {
        const active = value.toLowerCase().includes(item.toLowerCase());
        return (
          <button
            type="button"
            key={item}
            onClick={() => onPick(item)}
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs transition-colors",
              active
                ? "border-brand/40 bg-brand/15 text-brand-accent"
                : "border-black/10 bg-black/[0.02] text-muted-foreground hover:border-black/20 hover:text-foreground"
            )}
          >
            {active ? (
              <Check className="h-3 w-3" />
            ) : (
              <span className="text-subtle-foreground">+</span>
            )}
            {item}
          </button>
        );
      })}
    </div>
  );
}

function ReviewSummary({ values }: { values: Values }) {
  const t = useTranslations("contactForm.review");
  const rows: { label: string; value: string }[] = [
    { label: t("name"), value: values.name },
    { label: t("business"), value: values.businessName },
    { label: t("email"), value: values.email },
    { label: t("goal"), value: values.automationGoal },
  ];
  return (
    <div className="rounded-xl border border-black/[0.08] bg-black/[0.02] p-4">
      <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-subtle-foreground">
        <Sparkles className="h-3.5 w-3.5 text-brand-accent" />
        {t("title")}
      </p>
      <dl className="mt-3 space-y-2 text-sm">
        {rows.map((row) => (
          <div key={row.label} className="flex gap-3">
            <dt className="w-20 shrink-0 text-subtle-foreground">{row.label}</dt>
            <dd className="min-w-0 flex-1 truncate text-foreground-soft">
              {row.value || t("empty")}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

// Brief bridge state shown while we navigate to /thank-you. The thank-you page
// (video + next steps) is the real confirmation — this just covers the gap so
// the form never flashes back to an editable state after a successful send.
function RedirectingCard() {
  const t = useTranslations("contactForm.redirecting");
  return (
    <div className="animate-in fade-in zoom-in-95 py-10 text-center duration-500">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand text-primary-foreground glow-brand">
        <CheckCircle2 className="h-8 w-8" />
      </div>
      <h3 className="mt-6 text-2xl font-medium tracking-tight">{t("title")}</h3>
      <p className="mx-auto mt-3 max-w-sm leading-7 text-muted-foreground">
        {t("text")}
      </p>
      <span className="mx-auto mt-6 block h-5 w-5 animate-spin rounded-full border-2 border-black/20 border-t-brand-soft" />
    </div>
  );
}

function Field({
  label,
  optional,
  error,
  children,
}: {
  label: string;
  optional?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  const t = useTranslations("contactForm");
  return (
    <div>
      <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-foreground-soft">
        {label}
        {optional ? (
          <span className="text-xs font-normal text-subtle-foreground">
            {t("optional")}
          </span>
        ) : null}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-xs text-rose-300">{error}</p>
      ) : null}
    </div>
  );
}
