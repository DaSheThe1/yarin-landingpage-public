export type ProcessMedia = {
  /** Path under /public. */
  src: string;
  /** Hebrew alt text (accessibility). */
  alt: string;
};

/**
 * A small supporting render for each process step, matched by index to
 * `process.steps` in the message files. Swap these for real per-stage photos
 * (sketch, plan, on-site, handover) as the project library grows.
 */
export const processMedia: ProcessMedia[] = [
  { src: "/images/render-modern-pool-villas.png", alt: "פגישת היכרות — הדמיית וילה מודרנית" }, // היכרות
  { src: "/images/render-villa-pair.png", alt: "גיבוש חזון ותכנון ראשוני" }, // חזון ותכנון
  { src: "/images/render-architectural-plans.png", alt: "תכניות עבודה ותכנון אדריכלי" }, // תכנון אדריכלי
  { src: "/images/render-stone-villas.png", alt: "בחירת חומרים וגוונים לעיצוב הפנים" }, // עיצוב פנים
  { src: "/images/render-desert-elevations.png", alt: "ליווי הביצוע בשטח לפי התכנון" }, // ליווי ביצוע
  { src: "/images/render-desert-villa.png", alt: "בית מוגמר ומוכן למסירה" }, // מסירה
];
