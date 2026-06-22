export type Testimonial = {
  /** The client's words, verbatim. */
  quote: string;
  /** Who said it. */
  author: string;
  /** Their role + company, e.g. "Operations Lead, Acme Logistics". */
  role: string;
  /** Optional measurable outcome shown as a small chip, e.g. "12 hrs/week saved". */
  result?: string;
};

/**
 * While this is true the carousel shows a visible "example reviews" notice so
 * nothing reads as a real endorsement. Flip it to false the moment the
 * placeholder quotes (testimonials.items in the message files) are replaced
 * with genuine client quotes — the notice disappears automatically.
 */
export const testimonialsAreSamples = true;
