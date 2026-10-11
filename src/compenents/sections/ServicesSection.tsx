import { SectionBackground } from "@/compenents/SectionBackground";
import { seamTint } from "@/compenents/seamTint";
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
} from "@/compenents/ScrollReveal";
import { SectionHeader } from "@/compenents/SectionHeader";
import { PillarIcon } from "@/compenents/icons/SectionIcons";
import { programsAndServices } from "@/data";
import type { Lang } from "@/types";

export function ServicesSection({ lang }: { lang: Lang }) {
  return (
    <section
      id="services"
      className="relative py-20 md:py-28 px-5 md:px-6 overflow-hidden"
    >
      <SectionBackground
        variant="horizon"
        tintTop={seamTint.deepMoss}
        tintBottom={seamTint.moss}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader
          eyebrow={
            lang === "vn"
              ? "NHIỆM VỤ & CHƯƠNG TRÌNH HÀNH ĐỘNG"
              : "MISSIONS & CORE SERVICES"
          }
          title={
            <>
              {lang === "vn" ? "Nền tảng hỗ trợ." : "Supportive Platform."}
              <br />
              <span className="text-gradient-gold">
                {lang === "vn"
                  ? "Hội viên là trọng tâm."
                  : "Empowering Member Business."}
              </span>
            </>
          }
          subtitle={
            lang === "vn"
              ? "DTA triển khai các dịch vụ tư vấn pháp lý, phát triển thị trường và kết nối nhân lực chuyên nghiệp nhằm tối ưu hóa quyền lợi và thúc đẩy sức mạnh liên kết cho cộng đồng hội viên."
              : "DTA deploys practical programs in legal support, market matchmaking, and professional digital training to optimize the growth of our member companies."
          }
        />

        {/* 4 Pillars Grid */}
        <StaggerContainer className="grid md:grid-cols-4 gap-4 mb-6">
          {programsAndServices.map((c, idx) => (
            <StaggerItem key={c.tag}>
              <div className="card-flow rounded-3xl p-6 h-full flex flex-col justify-between">
                <div>
                  <PillarIcon idx={idx} />
                  <div className="text-[10px] tracking-[0.25em] font-black text-accent mb-2 uppercase">
                    {c.tag}
                  </div>
                  <div className="text-lg font-bold text-white mb-2 leading-tight">
                    {c.title[lang]}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {c.desc[lang]}
                  </p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Góp ý 10/2026: gộp "100% Phi lợi nhuận" và "03 Cam kết" vào chung
            phần này — 03 Cam kết trùng ý với 4 trụ cột nên bỏ, khối phi lợi
            nhuận thu gọn thành một dải để nhường diện tích cho Logo hội viên. */}
        <ScrollReveal>
          <div className="card-surface rounded-3xl p-6 md:p-8 grid md:grid-cols-[auto_1fr] gap-4 md:gap-10 items-center">
            <div>
              <div className="text-[10px] tracking-[0.25em] font-black text-muted-foreground uppercase">
                {lang === "vn"
                  ? "Vì cộng đồng - Dân chủ - Minh bạch"
                  : "Democratic & Transparent"}
              </div>
              <div className="display text-2xl md:text-4xl font-black mt-2 text-gradient-gold uppercase leading-tight">
                {lang === "vn" ? "100% Phi Lợi Nhuận" : "100% Non-Profit"}
              </div>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
              {lang === "vn"
                ? "DTA là cầu nối liên kết giữa các thành viên trong Hiệp hội, hỗ trợ trao đổi thông tin, kinh nghiệm và thị trường; hỗ trợ thành viên trong sản xuất, kinh doanh, cung ứng giải pháp, tư vấn và dịch vụ công nghệ số theo quy định pháp luật; đồng thời hỗ trợ quảng bá hình ảnh, thương hiệu, học hiệu, sản phẩm, đào tạo và cung ứng nguồn nhân lực."
                : "DTA bridges association members, supporting information, experience and market exchange; assisting members in production, business, solution delivery, consulting and digital technology services in line with the law; and promoting their image, brands, reputation, products, training and workforce supply."}
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
