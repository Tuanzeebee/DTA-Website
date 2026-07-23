import { SectionBackground } from "@/compenents/SectionBackground";
import { seamTint } from "@/compenents/seamTint";
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
} from "@/compenents/ScrollReveal";
import { SectionHeader } from "@/compenents/SectionHeader";
import { PillarIcon, PledgeIcon } from "@/compenents/icons/SectionIcons";
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
        tintTop={seamTint.indigo}
        tintBottom={seamTint.cyan}
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
        <StaggerContainer className="grid md:grid-cols-4 gap-4 mb-16">
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

        {/* Financial Transparency & Digital office summary box */}
        {/* Double-bezel: this is the page's centrepiece claim, so it sits in an
            outer tray with a concentric inner radius rather than flat on the
            section — the one card that gets the extra enclosure. */}
        <ScrollReveal className="bezel mb-12">
          <div className="card-surface p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-44 h-44 bg-accent/5 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-44 h-44 bg-cyan-500/5 rounded-full blur-2xl" />
            <div className="relative">
              <div className="text-xs tracking-[0.25em] font-black text-muted-foreground uppercase">
                {lang === "vn"
                  ? "TỔ CHỨC VÌ CỘNG ĐỒNG - DÂN CHỦ - MINH BẠCH"
                  : "A DEMOCRATIC & TRANSPARENT COMMUNITY"}
              </div>
              <div className="display text-3xl md:text-5xl font-black mt-3 text-gradient-gold uppercase leading-tight">
                {lang === "vn"
                  ? "100% Phi Lợi Nhuận"
                  : "100% Non-Profit Operation"}
              </div>
              <p className="mt-4 text-xs md:text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                {lang === "vn"
                  ? "DTA công khai 100% các báo cáo tài chính hàng tháng, danh bạ hội viên và nghị quyết của Ban Chấp hành lên Văn phòng số để mọi hội viên trực tiếp quản trị và giám sát hoạt động."
                  : "DTA publishes 100% of financial reports, directories, and executive board resolutions onto our Digital Office, enabling total democratic supervision by all members."}
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Member core privileges */}
        <ScrollReveal>
          <h3 className="text-xs tracking-[0.25em] font-black text-muted-foreground mb-6 uppercase">
            {lang === "vn"
              ? "03 Cam kết Đồng hành Cốt lõi"
              : "03 Core Engagement Pledges"}
          </h3>
        </ScrollReveal>
        <StaggerContainer className="grid md:grid-cols-3 gap-5 items-stretch">
          {[
            {
              type: 0,
              rank:
                lang === "vn" ? "Cầu nối chính sách" : "Policy Advocacy Bridge",
              amount: lang === "vn" ? "Ý kiến trực tiếp" : "Direct Voice",
              note:
                lang === "vn"
                  ? "DTA tổng hợp các phản ánh khó khăn của hội viên để kiến nghị trực tiếp lên lãnh đạo UBND TP. Đà Nẵng tháo gỡ."
                  : "DTA channels member inquiries and challenges directly to Danang municipal leaders and digital regulatory departments.",
              color: "cyan",
            },
            {
              type: 1,
              rank:
                lang === "vn" ? "Bảo vệ pháp lý" : "Legal & Copyright Shield",
              amount: lang === "vn" ? "Sở hữu trí tuệ" : "IP Defense",
              note:
                lang === "vn"
                  ? "Bảo vệ bản quyền phần mềm, hỗ trợ thủ tục đăng ký bằng sáng chế công nghệ và phòng chống cạnh tranh bất bình đẳng."
                  : "Assisting with software copyright registries, technology patent filings, and preventing anticompetitive behaviors.",
              color: "gold",
              featured: true,
            },
            {
              type: 2,
              rank: lang === "vn" ? "Cơ hội liên minh" : "Strategic Alliances",
              amount: lang === "vn" ? "Hợp tác Viện - Trường" : "R&D Linkages",
              note:
                lang === "vn"
                  ? "Kết nối trực tiếp doanh nghiệp với các phòng Lab nghiên cứu, tuyển dụng trực tiếp kỹ sư từ các đại học CNTT hàng đầu."
                  : "Linking member enterprises directly with university labs, securing direct recruitments of tech graduates.",
              color: "cyan",
            },
          ].map((p, idx) => (
            <StaggerItem key={p.rank}>
              <div
                className={`card-surface rounded-3xl p-8 relative flex flex-col justify-between h-full ${
                  p.featured
                    ? "card-surface-gold md:-mt-4 md:pt-10 md:pb-10"
                    : ""
                }`}
              >
                <div>
                  <PledgeIcon idx={p.type} />
                  <div className="text-[10px] tracking-[0.2em] font-black text-muted-foreground uppercase">
                    {p.rank}
                  </div>
                  <div
                    className={`display text-2xl md:text-3xl font-black mt-2 ${p.featured ? "text-gradient-gold" : "text-gradient-cyan"}`}
                  >
                    {p.amount}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
                  {p.note}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
