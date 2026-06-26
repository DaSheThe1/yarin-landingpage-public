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
  { src: "/images/render-modern-pool-villas.webp", alt: "פגישת היכרות — הדמיית וילה מודרנית" }, // היכרות
  { src: "/images/project-stone-villas-grid.webp", alt: "גיבוש חזון ותכנון ראשוני — הדמיות וילות אבן" }, // חזון ותכנון
  { src: "/images/project-architectural-floorplan.webp", alt: "תכניות אדריכליות — תכנון קומה ופריסת חללים לוילה" }, // תכנון אדריכלי
  { src: "/images/project-wix-office.webp", alt: "עיצוב פנים למשרדי wix בתל אביב" }, // עיצוב פנים
  { src: "/images/render-desert-elevations.webp", alt: "ליווי הביצוע בשטח לפי התכנון" }, // ליווי ביצוע
  { src: "/images/render-desert-villa.webp", alt: "בית מוגמר ומוכן למסירה" }, // מסירה
];
