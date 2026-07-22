/** The two locales the site ships. Previously written inline as
 *  `{ lang: "vn" | "en" }` on roughly forty component signatures. */
export type Lang = "vn" | "en";

/** A string that exists in both locales — the shape used throughout `data.ts`. */
export type Localized = Record<Lang, string>;
