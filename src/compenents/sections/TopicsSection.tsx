import { ChevronRight } from "lucide-react";
import { SectionBackground, RuleFade } from "@/compenents/SectionBackground";
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
} from "@/compenents/ScrollReveal";
import { TechAreaIcon } from "@/compenents/icons/SectionIcons";
import { coreTechAreas } from "@/data";
import type { Lang } from "@/types";

export function TopicsSection({ lang }: { lang: Lang }) {
  return (
    <section
      id="topics"
      className="py-20 md:py-28 px-5 md:px-6 relative overflow-hidden"
    >
      <RuleFade className="absolute inset-x-0 top-0" />
      <SectionBackground variant={["dots", "vignette"]} />

      <div className="max-w-7xl mx-auto relative z-10">
        <ScrollReveal className="flex flex-wrap items-end justify-between gap-6 mb-14">
          <div>
            <div className="display text-6xl md:text-7xl font-black text-gradient-cyan">
              05
            </div>
            <div className="text-base md:text-lg font-bold tracking-wider uppercase mt-2 text-white">
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
