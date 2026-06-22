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
  { type: "image", src: "/images/render-desert-elevations.webp", alt: "הדמיית חזיתות וילה" }, // תכנון אדריכלי
  { type: "image", src: "/images/render-modern-pool-villas.webp", alt: "הדמיית עיצוב פנים וחוץ לוילה מודרנית" }, // עיצוב פנים
  { type: "image", src: "/images/render-architectural-plans.webp", alt: "תכניות ותכנון אדריכלי להיתר בנייה" }, // ליווי מול רשויות והיתרי בנייה
  { type: "image", src: "/images/render-desert-villa.webp", alt: "הדמיית וילה עם תשתיות מתוכננות" }, // תכניות חשמל ואינסטלציה
  { type: "image", src: "/images/render-stone-villas.webp", alt: "הדמיות וילות אבן" },
  { type: "image", src: "/images/render-villa-pair.webp", alt: "הדמיות וילה" },
];
