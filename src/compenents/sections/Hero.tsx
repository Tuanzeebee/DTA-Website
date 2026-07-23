import { Link } from "@tanstack/react-router";
import { MapPin, Plus, Search } from "lucide-react";
import heroImage from "@/assets/HerosectionBackGroundV3.webp";
import { ScrollReveal } from "@/compenents/ScrollReveal";
import { SectionBackground, seamTint } from "@/compenents/SectionBackground";
import { translationStrings } from "@/data";
import type { Lang } from "@/types";

export function Hero({ lang }: { lang: Lang }) {
  return (
    <section
      id="top"
      /* Mobile: a normal one-screen hero (image covers, cropped).
         md+: the section height is 80% of the image's full-width height
         (3396 x 4167 -> 80% => 3396/3334), so object-cover object-top shows
         the top 80% of the poster and trims the bottom 20%. That keeps the
         hero "long enough to see most of the image" without the full-portrait
         height that felt too tall. Content is pinned to the first screen, and
         overflow-hidden keeps the masked tail tidy. */
      className="relative w-full min-h-[100dvh] md:min-h-0 md:aspect-[3396/2709] overflow-hidden"
    >
      {/* Poster background. Container aspect is 80% of the image aspect on md+,
          so object-cover object-top shows the top 80% of the poster. The
          bottom mask fades the lower 12% into the page colour so the hero
          dissolves into the next section rather than ending on a hard edge.

          eager + high priority because this is the LCP element. */}
      <img
        src={heroImage}
        alt=""
        aria-hidden
        loading="eager"
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover object-top"
        style={{
          maskImage: "linear-gradient(#000 88%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(#000 88%, transparent 100%)",
        }}
      />
      {/* Seam handoff, same system as every other boundary on the page: the
          hero's bottom band paints seamTint.cyan and About's top band paints
          the SAME tint, so the colour crosses the boundary as one wave. The
          image itself dissolves to transparent via its own mask, revealing
          the shared fixed colour field underneath. */}
      <SectionBackground variant="none" tintBottom={seamTint.cyan} />

      {/* Centre bloom, mirroring the spotlight About opens with at its
          top-centre (same hue, same intensity, ellipse anchored on the shared
          boundary from THIS side). The corners of the seam already match
          because both sides are plain base + uniform band there; this makes
          the centre symmetric too, so the middle melts exactly like the
          corners do. */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-56 md:h-72 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 100% at 50% 100%, oklch(0.75 0.19 235 / 0.22), transparent 70%)",
        }}
      />

      {/* Content is pinned to the FIRST viewport (top-0, one screen tall) so it
          stays above the fold no matter how tall the poster makes the section. */}
      <div className="absolute inset-x-0 top-0 h-[100dvh] flex items-center pt-20 md:pt-24">
        <div className="relative max-w-7xl mx-auto px-6 w-full z-10">
          <ScrollReveal className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold glass mb-6 border border-white/5">
              <span className="w-2 h-2 rounded-full bg-[oklch(0.85_0.16_90)] animate-pulse" />
              <span className="tracking-wider uppercase text-[10px] text-accent font-bold">
                {translationStrings.heroEyebrow[lang]}
              </span>
            </div>

            <h1 className="display text-[1.7rem] sm:text-4xl md:text-6xl lg:text-7xl font-black leading-[1.35] tracking-tight py-2 overflow-visible">
              <span className="text-gradient-cyan inline-block uppercase py-1 leading-[1.35]">
                {lang === "vn" ? "Hợp Tác · Liên Kết" : "Collaboration"}
              </span>
              <span className="text-white block uppercase mt-2 py-1 leading-[1.35]">
                {lang === "vn" ? "Phát Triển Bền Vững" : "Sustainable Growth"}
              </span>
            </h1>

            <p className="mt-4 md:mt-6 text-base sm:text-lg md:text-2xl font-normal text-white/90 leading-relaxed">
              {translationStrings.heroSub[lang]}
            </p>

            {/* Hidden below md. This address is the fifth text element in the
              hero and it is what pushes the CTAs below the fold on a phone —
              it already appears in full in the Location section and footer. */}
            <p className="mt-6 hidden md:flex text-xs tracking-[0.2em] font-bold text-accent uppercase items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-accent" />
              <span>
                {lang === "vn"
                  ? "TRỤ SỞ: TẦNG 2, 15 QUANG TRUNG, TP. ĐÀ NẴNG"
                  : "HQ: LEVEL 2, 15 QUANG TRUNG, DANANG CITY"}
              </span>
            </p>

            {/* Stacked full-width on phones: side-by-side these two wrap their
              labels at 375px, and a wrapped CTA label reads as broken. */}
            <div className="mt-7 md:mt-8 flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4">
              <Link
                to="/portal"
                className="w-full sm:w-auto min-h-13 px-7 rounded-full font-bold text-sm text-primary-foreground hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                style={{
                  background: "var(--gradient-primary)",
                  boxShadow: "var(--shadow-glow)",
                }}
              >
                <Plus className="w-4 h-4" />
                <span>{translationStrings.heroBtn1[lang]}</span>
              </Link>
              <a
                href="#members"
                className="w-full sm:w-auto min-h-13 px-7 rounded-full font-bold text-sm border border-white/15 bg-white/[0.04] hover:bg-white/10 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4 text-white/70" />
                <span>{translationStrings.heroBtn2[lang]}</span>
              </a>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
