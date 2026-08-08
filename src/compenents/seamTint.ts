/**
 * Seam handoff palette. Each section boundary is crossed by ONE of these
 * tints: the upper section paints it as its bottom band, the lower section
 * paints the SAME tint as its top band — so the colour of one section
 * visibly continues into the start of the next, all the way down the page.
 *
 * Lives in its own module (not SectionBackground.tsx) so component files
 * keep fast-refresh: mixing constant and component exports breaks HMR.
 */
export const seamTint = {
  moss: "oklch(0.40 0.10 158 / 0.25)",
  /** Stronger grade for seams between heavy image/colour backgrounds. */
  mossStrong: "oklch(0.48 0.11 158 / 0.45)",
  deepMoss: "oklch(0.38 0.08 168 / 0.25)",
  bronze: "oklch(0.56 0.10 78 / 0.18)",
};
