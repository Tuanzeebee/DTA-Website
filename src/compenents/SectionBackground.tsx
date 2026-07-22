/**
 * Layered section backgrounds.
 *
 * Each variant composes 2-3 absolutely-positioned layers (colour field +
 * structure + edge falloff) so no two sections read as the same flat panel.
 * All layers are pointer-events-none and sit below the section content,
 * which must therefore carry `relative z-10`.
 */

type Variant =
  "aurora" | "grid" | "dots" | "spotlight" | "horizon" | "vignette";

interface SectionBackgroundProps {
  /** Layers to stack, painted in array order (first = furthest back). */
  variant?: Variant | Variant[];
  /** Fade the section into its neighbours at the top and/or bottom edge. */
  edge?: "none" | "top" | "bottom" | "both";
  className?: string;
}

export function SectionBackground({
  variant = "aurora",
  edge = "both",
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

      {/* Edge bands at 0.55 (not 0.85): enough to smooth section seams
          without sinking every boundary into a dark valley. */}
      {(edge === "top" || edge === "both") && (
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[oklch(0.10_0.06_265_/_0.55)] to-transparent" />
      )}
      {(edge === "bottom" || edge === "both") && (
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[oklch(0.10_0.06_265_/_0.55)] to-transparent" />
      )}
    </div>
  );
}

const layerClass: Record<Variant, string> = {
  aurora: "bg-aurora",
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
      className={`pointer-events-none h-24 bg-[radial-gradient(ellipse_65%_130%_at_50%_0%,oklch(0.75_0.19_235_/_0.09),transparent_70%)] ${className}`}
    />
  );
}
