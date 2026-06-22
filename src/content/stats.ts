export type Stat = {
  /** Numeric portion used by the animated counter; suffix kept separate. */
  to: number;
  suffix?: string;
  prefix?: string;
};

// Labels live in the message files (stats.items, he.json) and are matched by
// index. TODO(Yarin): confirm these numbers — only "5 years" is factual; the
// rest are placeholders. Keep each number aligned with its label in he.json.
export const stats: Stat[] = [
  { to: 5 }, // שנות ניסיון
  { to: 50, suffix: "+" }, // פרויקטים
  { to: 100, suffix: "%" }, // שביעות רצון
  { to: 2 }, // אזורי שירות (מרכז + צפון)
];
