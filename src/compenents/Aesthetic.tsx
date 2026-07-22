import React from "react";

interface AestheticProps {
  className?: string;
  glowColor?: string;
}

export function TrongDongWatermark({
  className = "",
  glowColor = "rgba(0, 251, 252, 0.15)",
}: AestheticProps) {
  return (
    <div className={`pointer-events-none select-none relative ${className}`}>
      <svg
        viewBox="0 0 800 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full opacity-20 md:opacity-30"
        style={{
          filter: `drop-shadow(0 0 25px ${glowColor})`,
        }}
      >
        {/* Outer Circular Bounds */}
        <circle
          cx="400"
          cy="400"
          r="390"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="4 4"
          className="text-slate-500/20"
        />
        <circle
          cx="400"
          cy="400"
          r="375"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-slate-500/40"
        />

        {/* Ring 1: External pattern of dots and lines */}
        <circle
          cx="400"
          cy="400"
          r="360"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="8 8"
          className="text-[#3DBEFF]/40"
        />
        <circle
          cx="400"
          cy="400"
          r="350"
          stroke="currentColor"
          strokeWidth="2"
          className="text-[#00FBFC]/30"
        />

        {/* Ring 2: Chim Lac Flying Cranes Silhouettes Rotating around the ring */}
        <g className="text-[#3DBEFF]/50 animate-[spin_120s_linear_infinite] origin-center">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => (
            <g key={index} transform={`rotate(${angle} 400 400)`}>
              <path
                d="M 400 70 C 390 73, 385 70, 375 75 C 385 78, 390 85, 400 85 C 410 85, 415 78, 425 75 C 415 70, 410 73, 400 70 Z M 400 65 L 400 55 M 392 73 C 388 68, 380 65, 370 65 C 382 68, 388 71, 392 73 Z"
                fill="currentColor"
              />
              <circle
                cx="400"
                cy="80"
                r="2"
                fill="currentColor"
                className="text-[#00FBFC]"
              />
              <line
                x1="395"
                y1="88"
                x2="405"
                y2="88"
                stroke="currentColor"
                strokeWidth="1"
              />
            </g>
          ))}
        </g>

        {/* Ring 3: Concentric Geometric Tangent Circles */}
        <circle
          cx="400"
          cy="400"
          r="310"
          stroke="currentColor"
          strokeWidth="1"
          className="text-slate-500/30"
        />
        <circle
          cx="400"
          cy="400"
          r="300"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeDasharray="15 5"
          className="text-[#0059EE]/40"
        />
        <circle
          cx="400"
          cy="400"
          r="285"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-[#3DBEFF]/30"
        />

        {/* Ring 4: Human and animal stylized dancing patterns */}
        <g className="text-slate-500/30">
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(
            (angle, index) => (
              <g key={index} transform={`rotate(${angle} 400 400)`}>
                <path
                  d="M 400 135 L 403 145 L 397 145 Z M 400 145 L 400 155 M 400 150 L 393 148 M 400 150 L 407 148 M 400 155 L 395 165 M 400 155 L 405 165"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                />
                <circle cx="400" cy="130" r="1.5" fill="currentColor" />
              </g>
            ),
          )}
        </g>

        <circle
          cx="400"
          cy="400"
          r="240"
          stroke="currentColor"
          strokeWidth="1"
          className="text-[#00FBFC]/20"
        />
        <circle
          cx="400"
          cy="400"
          r="225"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="4 6"
          className="text-[#3DBEFF]/30"
        />
        <circle
          cx="400"
          cy="400"
          r="210"
          stroke="currentColor"
          strokeWidth="1"
          className="text-slate-500/30"
        />

        {/* Ring 5: Starburst of 14 Rays in the Center */}
        <g className="text-[#00FBFC]/60 animate-[spin_240s_linear_infinite] origin-center">
          <circle
            cx="400"
            cy="400"
            r="130"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-[#00FBFC]/30"
          />
          <circle
            cx="400"
            cy="400"
            r="115"
            stroke="currentColor"
            strokeWidth="1"
            className="text-slate-500/20"
          />

          {[...Array(14)].map((_, i) => {
            const angle = (i * 360) / 14;
            const rad = (angle * Math.PI) / 180;
            const x1 = 400 + Math.sin(rad) * 40;
            const y1 = 400 - Math.cos(rad) * 40;
            const x2 = 400 + Math.sin(rad) * 115;
            const y2 = 400 - Math.cos(rad) * 115;

            const nextAngle = ((i + 0.5) * 360) / 14;
            const nextRad = (nextAngle * Math.PI) / 180;
            const xMid = 400 + Math.sin(nextRad) * 60;
            const yMid = 400 - Math.cos(nextRad) * 60;

            return (
              <g key={i}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d={`M 400 400 L ${x2} ${y2} L ${xMid} ${yMid} Z`}
                  fill="currentColor"
                  className="text-[#00FBFC]/10"
                />
              </g>
            );
          })}

          <circle
            cx="400"
            cy="400"
            r="40"
            fill="currentColor"
            className="text-[#00FBFC]/20"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle
            cx="400"
            cy="400"
            r="15"
            fill="currentColor"
            className="text-[#00FBFC]/50"
          />
        </g>
      </svg>
    </div>
  );
}

/**
 * Official association seal.
 *
 * Deliberately static — a rotating emblem reads as decoration, a fixed one
 * reads as a credential. The 14-ray centre is the Trống Đồng star already
 * used as the page watermark, so the crest belongs to the same visual family.
 *
 * The ring caption is set with textLength so it fits the arc exactly at any
 * string length, which keeps VN and EN captions on the same geometry.
 */
export function AssociationSeal({
  className = "",
  caption,
}: {
  className?: string;
  caption: string;
}) {
  return (
    <svg
      viewBox="0 0 240 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={caption}
    >
      <defs>
        {/* Traverses the top of the circle left-to-right, so the caption sits
            upright and reads normally. */}
        {/* r=86 so the caption band sits between the inner keyline (r=76) and
            the engine-turned ring (r=99). Glyphs grow outward from the arc, so
            a larger radius here would run them into the ring. */}
        <path id="dta-seal-arc" d="M 34,120 A 86,86 0 0 1 206,120" />
        <radialGradient id="dta-seal-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00FBFC" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#00FBFC" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="dta-seal-ring" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00FBFC" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#818CF8" stopOpacity="0.45" />
        </linearGradient>
      </defs>

      {/* Ambient core glow */}
      <circle cx="120" cy="120" r="86" fill="url(#dta-seal-core)" />

      {/* Seal rings: solid outer, hairline, engine-turned dashes, inner keyline */}
      <circle
        cx="120"
        cy="120"
        r="116"
        stroke="url(#dta-seal-ring)"
        strokeWidth="1.5"
      />
      <circle
        cx="120"
        cy="120"
        r="103"
        stroke="#00FBFC"
        strokeOpacity="0.22"
        strokeWidth="1"
      />
      <circle
        cx="120"
        cy="120"
        r="99"
        stroke="#00FBFC"
        strokeOpacity="0.35"
        strokeWidth="3"
        strokeDasharray="1 6"
        strokeLinecap="round"
      />
      <circle
        cx="120"
        cy="120"
        r="76"
        stroke="url(#dta-seal-ring)"
        strokeWidth="1.5"
      />

      {/* Ring caption */}
      <text
        fill="#E8FBFF"
        fillOpacity="0.85"
        fontSize="11"
        fontWeight="700"
        letterSpacing="1.5"
        style={{ textTransform: "uppercase" }}
      >
        <textPath
          href="#dta-seal-arc"
          startOffset="50%"
          textAnchor="middle"
          textLength="248"
          lengthAdjust="spacingAndGlyphs"
        >
          {caption}
        </textPath>
      </text>

      {/* Anchor stars where the caption arc terminates */}
      <circle cx="34" cy="120" r="2.5" fill="#00FBFC" fillOpacity="0.8" />
      <circle cx="206" cy="120" r="2.5" fill="#00FBFC" fillOpacity="0.8" />

      {/* Trống Đồng 14-ray core — same motif as the page watermark */}
      <g>
        {[...Array(14)].map((_, i) => {
          const rad = ((i * 360) / 14) * (Math.PI / 180);
          const half = (0.5 * 360) / 14 / 2;
          const radA = (((i * 360) / 14 - half) * Math.PI) / 180;
          const radB = (((i * 360) / 14 + half) * Math.PI) / 180;
          const tip = [
            120 + Math.sin(rad) * 56,
            120 - Math.cos(rad) * 56,
          ] as const;
          const a = [
            120 + Math.sin(radA) * 22,
            120 - Math.cos(radA) * 22,
          ] as const;
          const b = [
            120 + Math.sin(radB) * 22,
            120 - Math.cos(radB) * 22,
          ] as const;
          return (
            <path
              key={i}
              d={`M ${tip[0]} ${tip[1]} L ${a[0]} ${a[1]} L ${b[0]} ${b[1]} Z`}
              fill="#00FBFC"
              fillOpacity="0.16"
              stroke="#00FBFC"
              strokeOpacity="0.4"
              strokeWidth="0.75"
              strokeLinejoin="round"
            />
          );
        })}
        <circle
          cx="120"
          cy="120"
          r="22"
          fill="#0B1220"
          stroke="#00FBFC"
          strokeOpacity="0.55"
          strokeWidth="1.5"
        />
      </g>

      {/* Monogram */}
      <text
        x="120"
        y="120"
        textAnchor="middle"
        dominantBaseline="central"
        fill="#00FBFC"
        fontSize="17"
        fontWeight="900"
        letterSpacing="0.5"
      >
        DTA
      </text>
    </svg>
  );
}

export function TraditionalClouds({
  className = "",
  color = "currentColor",
}: AestheticProps & { color?: string }) {
  return (
    <div className={`pointer-events-none select-none ${className}`}>
      <svg
        viewBox="0 0 400 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full opacity-15 md:opacity-25 text-[#E8A56F]/40"
      >
        <g
          stroke={color}
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            d="M 50 120 C 40 100, 70 80, 100 90 C 110 70, 150 70, 160 90 C 180 80, 210 100, 200 120 C 210 140, 180 160, 150 150 C 130 170, 80 170, 60 150 C 40 150, 30 130, 50 120 Z"
            strokeDasharray="300"
            strokeDashoffset="0"
          />
          <path d="M 100 120 Q 110 110, 120 120 T 130 120 Q 135 135, 120 140 T 100 125" />
          <path d="M 150 120 Q 160 110, 170 120 T 180 120 Q 185 135, 170 140" />
          <path d="M 70 130 Q 75 125, 80 130" />

          <path d="M 230 80 C 220 70, 240 50, 260 60 C 270 45, 300 45, 310 60 C 320 55, 340 65, 330 80 C 335 90, 320 105, 300 100 C 290 110, 260 110, 245 100 Z" />
          <path d="M 270 80 Q 275 75, 280 80 T 285 80" />

          <path
            d="M 30 50 Q 60 30, 100 40 T 150 20"
            strokeWidth="1"
            strokeDasharray="5 5"
          />
          <path
            d="M 220 150 Q 250 170, 290 160 T 350 180"
            strokeWidth="1"
            strokeDasharray="8 4"
          />
          <path d="M 280 130 Q 300 120, 330 130" strokeWidth="1" />
        </g>
      </svg>
    </div>
  );
}
