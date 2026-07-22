import React from "react";
import { GrainOverlay } from "@/compenents/SectionBackground";

/**
 * Shared page chrome: base colour, the fixed aurora field, and the grain.
 *
 * Both the home route and the portal previously inlined the same root <div>
 * with a remote Unsplash photo at `background-attachment: fixed` — a network
 * image the compositor re-samples on every scroll frame. One CSS gradient
 * layer replaces it in both places.
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
      <GrainOverlay />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
