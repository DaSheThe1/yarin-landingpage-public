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
 * The quotes in `testimonials.items` are real client feedback that Yarin
 * confirmed; the names are changed at the clients' request (high-value clients
 * who want privacy), which the section discloses via `testimonials.privacyNote`.
 * This flag stays false. If you ever add genuinely placeholder/example quotes,
 * flip it to true to show the visible "example reviews" notice instead.
 */
export const testimonialsAreSamples = false;
