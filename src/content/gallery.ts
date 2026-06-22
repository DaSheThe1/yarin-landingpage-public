export type GalleryImage = {
  /** Path under /public. */
  src: string;
  /** Hebrew alt text (accessibility). */
  alt: string;
  /** Intrinsic dimensions — keeps the masonry layout from shifting on load. */
  width: number;
  height: number;
};

/**
 * Project gallery shown on /examples. These are real renders/visualizations.
 * Add new images under /public/images and reference them here — the layout is a
 * responsive masonry that respects each image's natural aspect ratio.
 */
export const galleryImages: GalleryImage[] = [
  { src: "/images/render-architectural-plans.webp", alt: "תכנון אדריכלי — חזיתות ותכניות קומה לוילה", width: 512, height: 653 },
  { src: "/images/render-modern-pool-villas.webp", alt: "הדמיות וילה מודרנית עם בריכה", width: 639, height: 340 },
  { src: "/images/render-villa-pair.webp", alt: "הדמיות וילת אבן בנוף הרים", width: 515, height: 562 },
  { src: "/images/render-desert-elevations.webp", alt: "חזיתות וילה — מבט צפון ודרום", width: 512, height: 277 },
  { src: "/images/render-stone-villas.webp", alt: "הדמיות וילות אבן מודרניות", width: 519, height: 279 },
  { src: "/images/render-desert-villa.webp", alt: "הדמיית וילת מדבר עם בריכה ומטבח חוץ", width: 513, height: 284 },
  { src: "/images/project-wix-office.webp", alt: "עיצוב פנים למשרדים מסחריים", width: 781, height: 491 },
];
