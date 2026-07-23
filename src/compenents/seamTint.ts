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
  cyan: "oklch(0.45 0.14 235 / 0.25)",
  /** Stronger grade for seams between heavy image/colour backgrounds. */
  cyanStrong: "oklch(0.52 0.16 235 / 0.45)",
  indigo: "oklch(0.45 0.13 275 / 0.25)",
  gold: "oklch(0.62 0.12 90 / 0.18)",
};
