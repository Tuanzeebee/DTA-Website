import { SectionBackground } from "@/compenents/SectionBackground";
import { seamTint } from "@/compenents/seamTint";
import { StaggerContainer, StaggerItem } from "@/compenents/ScrollReveal";
import { SectionHeader } from "@/compenents/SectionHeader";
import { faqs } from "@/data";
import type { Lang } from "@/types";

export function FAQSection({ lang }: { lang: Lang }) {
  return (
    <section
      id="faq"
      className="py-20 md:py-28 px-5 md:px-6 relative overflow-hidden"
    >
      <SectionBackground variant="vignette" tintTop={seamTint.gold} />

      <div className="max-w-4xl mx-auto relative z-10">
        <SectionHeader
          title={
            <>
              {lang === "vn"
                ? "Câu hỏi thường gặp"
                : "Frequently Asked Questions"}
              <br />
              <span className="text-gradient-gold">
                {lang === "vn" ? "Giải đáp Thắc mắc" : "Answers & Support"}
              </span>
            </>
          }
        />
        <StaggerContainer className="space-y-3">
          {faqs.map((f, i) => (
            <StaggerItem key={f.q.vn}>
              <details
                className="glass rounded-2xl p-6 group cursor-pointer border border-white/5"
                open={i === 0}
              >
                <summary className="cursor-pointer font-bold text-base md:text-lg flex justify-between items-center list-none text-white hover:text-accent transition-colors">
                  <span>{f.q[lang]}</span>
                  <span className="text-accent text-2xl group-open:rotate-45 transition-all duration-300">
                    +
                  </span>
                </summary>
                <p className="mt-4 text-xs md:text-sm text-muted-foreground leading-relaxed border-t border-white/5 pt-3">
                  {f.a[lang]}
                </p>
              </details>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
