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
// Ordered so visually-similar renders (the stone villas, the concrete desert-
// cliff set, the seaside cliffs) are never adjacent — each neighbour pair looks
// distinct as the carousel slides.
export const galleryImages: GalleryImage[] = [
  { src: "/images/project-stone-villa-hillside.webp", alt: "הדמיית וילת אבן מודרנית עם גג שטוח ושביל אבן בנוף גבעות", width: 506, height: 278 },
  { src: "/images/project-concrete-cliff-terrace.webp", alt: "הדמיית בית בטון על מצוק עם מרפסת רחבה הצופה לנוף מדברי", width: 532, height: 286 },
  { src: "/images/project-desert-villa-sunset.webp", alt: "וילה במדבר באור שקיעה עם פינת ישיבה ליד הבריכה", width: 542, height: 293 },
  { src: "/images/project-wood-villa-pool.webp", alt: "הדמיית וילה מודרנית בחיפוי עץ עם בריכה ופטיו בחזית", width: 465, height: 241 },
  { src: "/images/project-desert-cliff-cantilever.webp", alt: "הדמיית וילת בטון משופעת על מצוק מדברי עם בריכה ונוף קניון", width: 533, height: 292 },
  { src: "/images/project-coastal-cliff-villa.webp", alt: "וילת יוקרה על צוק מול הים עם בריכת אינפיניטי ומרפסות", width: 538, height: 301 },
  { src: "/images/project-ochre-villa-garage.webp", alt: "וילה בגוון אוכרה דו-קומתית עם חניות ומכוניות בחזית", width: 500, height: 262 },
  { src: "/images/project-stone-villa-infinity-pool.webp", alt: "הדמיית וילת אבן עם מרפסת מקורה ובריכה הצופה לנוף פתוח", width: 505, height: 263 },
  { src: "/images/project-concrete-glass-house.webp", alt: "הדמיית בית בטון וזכוכית עם בריכה מול הרים מדבריים", width: 532, height: 292 },
  { src: "/images/project-poolside-outdoor-kitchen.webp", alt: "הדמיית בריכה עם מטבח חוץ ופינת אש לצד וילה מודרנית", width: 455, height: 252 },
  { src: "/images/project-adobe-desert-villa.webp", alt: "וילת אדובי בסגנון מדברי עם חניה צמודה על רקע הרים", width: 551, height: 301 },
  { src: "/images/project-black-stone-villa.webp", alt: "הדמיית וילה מודרנית בחיפוי אבן כהה עם דקלים ובריכה גדולה", width: 506, height: 292 },
  { src: "/images/project-desert-villa-floating-pool.webp", alt: "הדמיית וילה מודרנית בנוף מדברי עם בריכה צפה ומרפסת קונזולית", width: 532, height: 292 },
  { src: "/images/project-mediterranean-villa-firepit.webp", alt: "וילה ים-תיכונית דו-קומתית עם בריכה ופינת אש מול נוף הים", width: 492, height: 257 },
];
