import type { CSSProperties } from "react";
import trongDong from "@/assets/TrongDongV3.jpg";

/**
 * Rotating Đông Sơn bronze drum with a metallic light-sweep and gold dust.
 *
 * Three stacked layers, all purely decorative (aria-hidden, pointer-events-none):
 *   1. the drum image, clipped to a circle, rotating slowly (see .drum-spin);
 *   2. a warm sheen that sweeps the face, fixed in space while the drum turns;
 *   3. gold motes drifting upward in front.
 *
 * The parent controls size and opacity via `className`. The motes are a fixed
 * list (not random) so the render is deterministic and never causes hydration
 * mismatch; each carries its own drift vector and timing.
 */

// x/y are % positions within the box; dx/dy px drift; dur seconds; size px.
const MOTES = [
  { x: 22, y: 74, dx: 14, dy: -60, dur: 26, delay: 0, size: 3 },
  { x: 38, y: 88, dx: -10, dy: -72, dur: 32, delay: 4, size: 2 },
  { x: 55, y: 80, dx: 8, dy: -54, dur: 24, delay: 1.5, size: 4 },
  { x: 68, y: 92, dx: -14, dy: -66, dur: 30, delay: 6, size: 2 },
  { x: 80, y: 70, dx: 10, dy: -58, dur: 28, delay: 2.5, size: 3 },
  { x: 30, y: 60, dx: -8, dy: -50, dur: 34, delay: 8, size: 2 },
  { x: 48, y: 66, dx: 12, dy: -64, dur: 27, delay: 3.5, size: 3 },
  { x: 62, y: 58, dx: -12, dy: -56, dur: 31, delay: 10, size: 2 },
  { x: 74, y: 84, dx: 6, dy: -70, dur: 25, delay: 5.5, size: 3 },
  { x: 18, y: 86, dx: 10, dy: -52, dur: 33, delay: 7.5, size: 2 },
  { x: 44, y: 78, dx: -6, dy: -62, dur: 29, delay: 9, size: 3 },
  { x: 86, y: 82, dx: -10, dy: -60, dur: 26, delay: 12, size: 2 },
] as const;

export function TrongDongDisc({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`relative pointer-events-none select-none ${className}`}
    >
      {/* Circular clip: the rotating image and the sheen are masked to the disc. */}
      <div className="absolute inset-0 rounded-full overflow-hidden">
        {/* 112% + negative inset so the square image always covers the inscribed
            circle as it rotates (no corner gaps). Rotation is about its centre. */}
        <img
          src={trongDong}
          alt=""
          loading="lazy"
          decoding="async"
          className="drum-spin absolute inset-[-6%] w-[112%] h-[112%] max-w-none object-cover"
        />

        {/* Edge vignette blends the disc rim into the section background. */}
        <div className="absolute inset-0 rounded-full [background:radial-gradient(circle,transparent_52%,oklch(0.10_0.06_265/_0.9)_100%)]" />

        {/* Metallic light sweep. */}
        <div className="drum-sheen" />
      </div>

      {/* Gold dust, in front of the disc and outside the clip so motes can
          drift past the rim. */}
      {MOTES.map((m, i) => (
        <span
          key={i}
          className="gold-mote"
          style={
            {
              left: `${m.x}%`,
              top: `${m.y}%`,
              width: `${m.size}px`,
              height: `${m.size}px`,
              "--dx": `${m.dx}px`,
              "--dy": `${m.dy}px`,
              "--dur": `${m.dur}s`,
              animationDelay: `${m.delay}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
