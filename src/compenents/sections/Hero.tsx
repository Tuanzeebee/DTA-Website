import { Link } from "@tanstack/react-router";
import { MapPin, Plus, Search } from "lucide-react";
import heroVideo from "@/assets/video-4cc9f480-2026-07-21T15-38-38-1-cyc046.mp4";
import { TrongDongWatermark } from "@/compenents/Aesthetic";
import { ScrollReveal } from "@/compenents/ScrollReveal";
import { translationStrings } from "@/data";
import type { Lang } from "@/types";

export function Hero({ lang }: { lang: Lang }) {
  return (
    <section
      id="top"
      className="relative min-h-[100dvh] flex items-center pt-20 md:pt-24 pb-12 md:pb-16 overflow-hidden"
    >
      {/* preload="metadata": the clip is ~5 MB, so on a phone connection we
          fetch the poster frame and let it stream rather than blocking the
          hero on a full download. */}
      <video
        src={heroVideo}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover opacity-100 filter-none"
      />
      {/* Directional scrim: heaviest behind the copy on the left, clearing to
          nothing on the right so the video stays visible. Guarantees the
          headline and CTAs keep AA contrast over any video frame. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, oklch(0.10 0.06 265 / 0.88) 0%, oklch(0.10 0.06 265 / 0.55) 45%, oklch(0.10 0.06 265 / 0.15) 100%)",
        }}
      />
      {/* Bottom falloff so the hero dissolves into the page rather than
          ending on a hard video edge. */}
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[oklch(0.10_0.06_265)] via-[oklch(0.10_0.06_265_/_0.7)] to-transparent" />
      <div className="absolute inset-0 bg-horizon opacity-70" />
      {/* Centered Trống Đồng Watermark Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        <TrongDongWatermark
          className="w-[600px] h-[600px] md:w-[850px] md:h-[850px] opacity-25"
          glowColor="rgba(0, 251, 252, 0.25)"
        />
      </div>
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
    </section>
  );
}

// SECTION HEADER HELPERS
