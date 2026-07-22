import { Building, ShieldCheck, Layers, FileText } from "lucide-react";
import { TraditionalClouds, AssociationSeal } from "@/compenents/Aesthetic";
import { TrongDongDisc } from "@/compenents/TrongDongDisc";
import { SectionBackground } from "@/compenents/SectionBackground";
import { ScrollReveal } from "@/compenents/ScrollReveal";
import { membersData, translationStrings } from "@/data";
import type { Lang } from "@/types";

function credentials(lang: Lang) {
  const orgs = membersData.filter((m) => m.type === "organization").length;
  const people = membersData.filter((m) => m.type === "individual").length;
  const advisors = membersData.filter((m) => m.type === "advisory").length;

  return [
    {
      icon: Building,
      label: lang === "vn" ? "Cơ quan quản lý" : "Governing body",
      value:
        lang === "vn"
          ? "UBND TP. Đà Nẵng · Sở Nội vụ"
          : "Danang People's Committee",
    },
    {
      icon: ShieldCheck,
      label: lang === "vn" ? "Mô hình hoạt động" : "Operating model",
      value:
        lang === "vn"
          ? "Phi lợi nhuận · Tài chính công khai"
          : "Non-profit · Public ledger",
    },
    {
      icon: Layers,
      label: lang === "vn" ? "Cơ cấu hội viên" : "Directory composition",
      value:
        lang === "vn"
          ? `${orgs} tổ chức · ${people} cá nhân · ${advisors} cố vấn`
          : `${orgs} orgs · ${people} individuals · ${advisors} advisor`,
    },
  ];
}

// 3. ABOUT SECTION (TÔN CHỈ & MỤC ĐÍCH HOẠT ĐỘNG)
export function AboutSection({
  lang,
  setShowCharter,
}: {
  lang: Lang;
  setShowCharter: (b: boolean) => void;
}) {
  return (
    <section
      id="about"
      /* min-height is sized to the drum disc (750px at md, 850px at lg, plus
         breathing room) so the full artifact is visible instead of being
         clipped by the section's natural content height. The section becomes
         a flex container so the content grid stays vertically centred over
         the disc. */
      className="py-20 md:py-28 px-5 md:px-6 relative overflow-hidden md:flex md:items-center md:min-h-[53rem] lg:min-h-[60rem]"
    >
      {/* No top rule: the hero dissolves straight into this section with no
          seam. edge="bottom" keeps the top open (no dark top fade) so the
          hero's aurora carries through continuously. */}
      <SectionBackground variant={["spotlight", "grid"]} edge="bottom" />

      {/* Rotating Đông Sơn bronze drum, centred behind the content. Kept at a
          low opacity so the credential panel and copy stay legible over it. */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        <TrongDongDisc className="w-[550px] h-[550px] md:w-[750px] md:h-[750px] lg:w-[850px] lg:h-[850px] opacity-40" />
      </div>
      <TraditionalClouds className="absolute left-0 top-6 w-64 md:w-96 opacity-30 z-0 pointer-events-none" />
      <TraditionalClouds className="absolute right-12 bottom-6 w-56 md:w-80 opacity-20 z-0 pointer-events-none rotate-180" />

      <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-5 gap-8 md:gap-14 items-center relative z-10">
        <ScrollReveal
          direction="right"
          /* aspect-square + overflow-hidden would clip the credential rows once
             the column narrows; a min-height lets the panel grow instead. */
          className="lg:col-span-2 relative min-h-[26rem] rounded-3xl flex items-center justify-center"
          style={{
            background:
              "radial-gradient(circle, oklch(0.85 0.16 90 / 0.1) 0%, transparent 70%)",
          }}
        >
          {/* Credential panel. Every figure below is drawn from the charter,
              the member directory, or the regulatory bodies listed in the
              footer — nothing here is a placeholder statistic. */}
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center gap-6 p-6">
            <AssociationSeal
              className="w-40 h-40 md:w-48 md:h-48 shrink-0"
              caption={
                lang === "vn"
                  ? "Hiệp hội Công nghệ số Đà Nẵng"
                  : "Danang Digital Technology Association"
              }
            />

            <div className="w-full max-w-[19rem] space-y-2.5">
              {credentials(lang).map((c) => (
                <div
                  key={c.label}
                  className="flex items-start gap-2.5 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2.5"
                >
                  <c.icon className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <div className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted-foreground/70 leading-none">
                      {c.label}
                    </div>
                    <div className="text-[11px] font-semibold text-white leading-snug mt-1">
                      {c.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="left" delay={0.15} className="lg:col-span-3">
          <div className="text-xs tracking-[0.25em] font-bold text-accent mb-4 uppercase">
            {lang === "vn" ? "TÔN CHỈ & SỨ MỆNH" : "MISSION & CHARTER"}
          </div>
          <h2 className="display text-3xl md:text-5xl font-black leading-tight text-white uppercase">
            {lang === "vn"
              ? "Kiến tạo hệ sinh thái số"
              : "Fostering Digital Ecosystem"}
            <br />
            <span className="text-gradient-cyan">
              {lang === "vn" ? "đà nẵng vươn tầm" : "of danang globally"}
            </span>
          </h2>
          <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed text-sm md:text-base">
            <p>{translationStrings.charterDesc1[lang]}</p>
            <p>{translationStrings.charterDesc2[lang]}</p>
          </div>
          <div className="mt-8">
            <button
              onClick={() => setShowCharter(true)}
              className="px-6 py-3 rounded-full text-xs font-bold border border-white/20 hover:bg-white/5 active:scale-95 transition-all duration-300 flex items-center gap-2 cursor-pointer text-white"
            >
              <FileText className="w-4 h-4 text-accent" />
              <span>{translationStrings.btnCharterDetail[lang]}</span>
            </button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

// Helper for professional vector SVG tech badges
