/**
 * Layered section backgrounds.
 *
 * Each variant composes 2-3 absolutely-positioned layers (colour field +
 * structure + edge falloff) so no two sections read as the same flat panel.
 * All layers are pointer-events-none and sit below the section content,
 * which must therefore carry `relative z-10`.
 */

type Variant =
  "aurora" | "grid" | "dots" | "spotlight" | "horizon" | "vignette" | "none";

/**
 * Seam handoff palette. Each section boundary is crossed by ONE of these
 * tints: the upper section paints it as its bottom band, the lower section
 * paints the SAME tint as its top band — so the colour of one section
 * visibly continues into the start of the next, all the way down the page.
 */
export const seamTint = {
  cyan: "oklch(0.45 0.14 235 / 0.25)",
  /** Stronger grade for seams between heavy image/colour backgrounds. */
  cyanStrong: "oklch(0.52 0.16 235 / 0.45)",
  indigo: "oklch(0.45 0.13 275 / 0.25)",
  gold: "oklch(0.62 0.12 90 / 0.18)",
};

interface SectionBackgroundProps {
  /** Layers to stack, painted in array order (first = furthest back). */
  variant?: Variant | Variant[];
  /** Handoff tint at the top edge — pass the PREVIOUS section's tintBottom. */
  tintTop?: string;
  /** Handoff tint at the bottom edge — the colour this section passes on. */
  tintBottom?: string;
  className?: string;
}

export function SectionBackground({
  variant = "aurora",
  tintTop,
  tintBottom,
  className = "",
}: SectionBackgroundProps) {
  const layers = Array.isArray(variant) ? variant : [variant];

  return (
    <div
      aria-hidden
      className={`absolute inset-0 z-0 overflow-hidden pointer-events-none select-none ${className}`}
    >
      {layers.map((v) => (
        <div key={v} className={`absolute inset-0 ${layerClass[v]}`} />
      ))}

      {/* Colour handoff bands: additive tints (never dark), one shared hue
          per boundary — see seamTint. */}
      {tintTop && (
        <div
          className="absolute inset-x-0 top-0 h-40"
          style={{
            background: `linear-gradient(to bottom, ${tintTop}, transparent)`,
          }}
        />
      )}
      {tintBottom && (
        <div
          className="absolute inset-x-0 bottom-0 h-40"
          style={{
            background: `linear-gradient(to top, ${tintBottom}, transparent)`,
          }}
        />
      )}
    </div>
  );
}

const layerClass: Record<Variant, string> = {
  aurora: "bg-aurora",
  none: "",
  grid: "bg-grid",
  dots: "bg-dots",
  spotlight: "bg-spotlight",
  horizon: "bg-horizon",
  vignette:
    "bg-[radial-gradient(ellipse_75%_60%_at_50%_50%,transparent_35%,oklch(0.10_0.05_265_/_0.35)_100%)]",
};

/**
 * Fixed film-grain overlay. Mount once at the page root, not per-section —
 * a fixed layer never repaints during scroll, a section-level one would.
 */
export function GrainOverlay() {
  return <div aria-hidden className="grain-overlay" />;
}

/**
 * Seam light — the section connector.
 *
 * Formerly a 1px hairline, which read as a fence between sections no matter
 * how faint. Replaced with a soft bloom of the page's shared cyan breathing
 * down from the boundary: light carries across a seam, a line blocks it. The
 * same device already joins the hero to the About section.
 *
 * Works over any background because every section edge resolves to the same
 * page base colour (edge bands / image edge blends) before this glow is laid
 * on top. Callers keep the same usage: `absolute inset-x-0 top-0`.
 */
export function RuleFade({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none h-32 bg-[radial-gradient(ellipse_90%_140%_at_50%_0%,oklch(0.75_0.19_235_/_0.1),transparent_70%)] ${className}`}
    />
  );
}
