import { ChevronRight } from "lucide-react";
import { SectionBackground } from "@/compenents/SectionBackground";
import { seamTint } from "@/compenents/seamTint";
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
} from "@/compenents/ScrollReveal";
import { TechAreaIcon } from "@/compenents/icons/SectionIcons";
import { coreTechAreas } from "@/data";
import type { Lang } from "@/types";
import linhVucBg from "@/assets/LinhVuc.webp";

export function TopicsSection({ lang }: { lang: Lang }) {
  return (
    <section
      id="topics"
      className="py-20 md:py-28 px-5 md:px-6 relative overflow-hidden"
    >
      <SectionBackground
        variant="none"
        tintTop={seamTint.cyan}
        tintBottom={seamTint.indigo}
      />

      {/* Background contrast stack, bottom to top:
          image -> dark overlay -> black-to-transparent gradient
          -> faint noise -> (content). Keeps the mesh/network artwork visible
          while guaranteeing the display type stays high-contrast. */}
      <div
        aria-hidden
        className="absolute inset-0 z-0 pointer-events-none [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]"
      >
        <img
          src={linhVucBg}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* 2. Dark overlay (45%, middle of the requested 35-60% band). */}
        <div className="absolute inset-0 bg-black/30" />
        {/* 3. Black -> transparent gradient: deepest behind the display type
            at the top, clearing over the cards. */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-transparent" />
        {/* 4. Very light noise. */}
        <div className="noise-layer" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <ScrollReveal className="flex flex-wrap items-center justify-between gap-x-8 gap-y-6 mb-14">
          {/* Count + title on one row. items-center (not baseline): the title
              wraps to two lines, and baseline alignment hangs a wrapped line
              below the number — centring the title block against the digits
              is the alignment that actually reads as "beside the 05".
              flex-nowrap: the title must never drop under the number. */}
          <div className="flex flex-nowrap items-center gap-x-4 md:gap-x-6 min-w-0">
            <div className="display text-[4.5rem] md:text-[7.5rem] lg:text-[200px] leading-[0.8] font-black text-gradient-cyan shrink-0">
              05
            </div>
            <div className="display text-[1.35rem] md:text-[2rem] lg:text-[40px] leading-[1.05] font-black uppercase tracking-tight text-white max-w-[16ch]">
              {lang === "vn"
                ? "Lĩnh vực công nghệ trọng tâm"
                : "Strategic Tech Focus Areas"}
            </div>
          </div>
          <p className="max-w-md text-sm md:text-base text-muted-foreground leading-relaxed">
            {lang === "vn"
              ? "Bám sát các chủ trương phát triển kinh tế số của Thành phố Đà Nẵng, hiệp hội định hướng thúc đẩy 5 trụ cột công nghệ mũi nhọn sau."
              : "Aligning with the digital economy blueprint of Danang City, DTA actively promotes 5 spearhead technological pillars."}
          </p>
        </ScrollReveal>

        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {coreTechAreas.map((t, idx) => (
            <StaggerItem key={t.title.vn}>
              <div className="group card-prism rounded-3xl p-6 flex flex-col justify-between h-full">
                <div>
                  <TechAreaIcon id={idx} />
                  <div className="font-bold text-base text-white mb-2 leading-tight">
                    {t.title[lang]}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {t.desc[lang]}
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-1 text-[10px] uppercase font-bold text-accent">
                  <span>{lang === "vn" ? "Chi tiết" : "Explore"}</span>
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

// Helper for professional vector SVG badge icons for Core Engagement Pledges
