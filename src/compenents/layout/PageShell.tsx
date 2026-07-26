import React from "react";
import { GrainOverlay } from "@/compenents/SectionBackground";
import gradientMid from "@/assets/GradientMid.webp";

/**
 * Shared page chrome: base colour, the fixed colour field, and the grain.
 *
 * The colour field is two FIXED layers — the CSS aurora plus the GradientMid
 * artwork on `mix-blend-screen`. Screen blending can only ADD light, never
 * darken, so it lifts the whole page; and because both layers are fixed
 * (they do not scroll), every section drifts over the same continuous colour
 * field — which is what makes the sections read as joined rather than
 * stacked.
 *
 * Content is wrapped in a `relative z-10` layer so sections never need to
 * think about stacking against the background.
 */
export function PageShell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`min-h-screen text-foreground overflow-x-hidden relative bg-[oklch(0.10_0.06_265)] ${className}`}
    >
      <div
        aria-hidden
        className="fixed inset-0 z-0 pointer-events-none bg-aurora"
      />
      {/* The fixed GradientMid lift is a full-screen mix-blend-screen layer,
          which the GPU must re-blend against the moving page on every scroll
          frame — the main cause of scroll jank on phones. It is hidden below md;
          the fixed bg-aurora gradient above still carries the colour field, so
          mobile keeps the palette without the per-frame blend cost. */}
      <img
        aria-hidden
        src={gradientMid}
        alt=""
        className="hidden md:block fixed inset-0 z-0 w-full h-full object-cover pointer-events-none mix-blend-screen opacity-40"
      />
      <GrainOverlay />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
