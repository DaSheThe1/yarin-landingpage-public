export type ServiceMedia = {
  type: "image" | "video";
  /** Path under /public, e.g. "/services/document-ocr.mp4". */
  src: string;
  /** Required for images (accessibility); ignored for video. */
  alt?: string;
};

/**
 * Optional real example shown on the expanded /services cards, matched by index
 * to the localized service copy (services.items in the message files). Drop a
 * screenshot or short screen recording under /public/services and reference it
 * here — videos autoplay muted on loop, images render as-is. Slots left
 * `undefined` simply render without the preview.
 */
export const serviceMedia: (ServiceMedia | undefined)[] = [
  // Matched by index to services.items in messages/he.json.
  { type: "image", src: "/images/render-stone-villas.webp", alt: "הדמיית שיפוץ ושינוי חלוקה לווילת אבן" }, // תכנון אדריכלי
  { type: "image", src: "/images/project-nika-cafe.webp", alt: "עיצוב פנים לחלל אירוח, בית קפה מעוצב" }, // עיצוב פנים
  { type: "image", src: "/images/render-modern-pool-villas.webp", alt: "הדמיית עיצוב פנים וחוץ לוילה מודרנית" }, // ליווי מול רשויות והיתרי בנייה
  { type: "image", src: "/images/project-villa-floorplans.webp", alt: "תוכניות אדריכליות, פריסת חשמל ואינסטלציה לוילה" }, // תכניות חשמל ואינסטלציה
  { type: "image", src: "/images/project-renovations-grid.webp", alt: "שיפוצים ושינוי חלוקה, וילות מדבר לאחר שיפוץ" }, // שיפוצים ושינוי חלוקה
  { type: "image", src: "/images/project-desert-villas-grid.webp", alt: "פרויקטים בשטח, וילות מדבר בליווי ביצוע" }, // ליווי ביצוע בשטח
];
