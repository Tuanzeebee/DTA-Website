import {
  Globe,
  Building,
  Cpu,
  Layers,
  Briefcase,
  ShieldCheck,
  User,
  ArrowUpRight,
} from "lucide-react";
import { SectionBackground, seamTint } from "@/compenents/SectionBackground";
import { SectionHeader } from "@/compenents/SectionHeader";
import { allMembers } from "@/data";
import type { Lang } from "@/types";
import type { LucideIcon } from "lucide-react";
import doiTacBg from "@/assets/DoiTac.png";

interface SliderOrg {
  id: string;
  name: { vn: string; en: string };
  domain: { vn: string; en: string };
  type: "organization" | "individual" | "advisory";
  logoInitials: string;
  logoUrl?: string;
  website?: string;
  icon: LucideIcon;
  gradient: string;
  borderColor: string;
  textColor: string;
}

/** One marquee card. Members with a website become external links (open in a
 *  new tab — the marquee pauses on hover, so the card is clickable at rest);
 *  members without one (individuals, advisors) stay plain divs. */
function MemberCard({ org, lang }: { org: SliderOrg; lang: Lang }) {
  const IconComp = org.icon;
  const typeLabel =
    org.type === "organization"
      ? lang === "vn"
        ? "Tổ chức"
        : "Corp"
      : org.type === "individual"
        ? lang === "vn"
          ? "Cá nhân"
          : "Indiv"
        : lang === "vn"
          ? "Cố vấn"
          : "Advisor";

  const body = (
    <>
      {/* Brand Logo graphic */}
      <div
        className={`w-[75px] h-[75px] rounded-2xl flex items-center justify-center text-sm font-black shrink-0 bg-gradient-to-br ${org.gradient} border border-white/10 shadow-md overflow-hidden`}
      >
        {org.logoUrl ? (
          <img
            src={org.logoUrl}
            alt={org.name[lang]}
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain p-0.5 bg-white rounded-2xl"
          />
        ) : (
          <IconComp className={`w-9 h-9 ${org.textColor}`} />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="font-bold text-sm text-white tracking-wide truncate">
          {org.name[lang]}
        </h4>
        <p className="text-[10px] text-muted-foreground mt-0.5 uppercase leading-none font-semibold font-mono tracking-wider">
          {org.logoInitials} · {typeLabel}
        </p>
        <p className="text-[11px] text-accent/80 truncate mt-1.5 leading-none">
          {org.domain[lang]}
        </p>
      </div>
    </>
  );

  const cardClass =
    "card-surface card-solid rounded-3xl p-4 w-[330px] shrink-0 flex items-center gap-4 relative";

  if (!org.website) {
    return (
      <div className={cardClass} style={{ borderColor: org.borderColor }}>
        {body}
      </div>
    );
  }

  return (
    <a
      href={org.website}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={`${org.name[lang]} — website`}
      className={`${cardClass} group cursor-pointer transition-all duration-300 hover:border-accent/50 hover:shadow-[0_0_24px_oklch(0.75_0.19_235_/_0.15)] hover:-translate-y-0.5`}
      style={{ borderColor: org.borderColor }}
    >
      {body}
      {/* Link affordance: quiet corner arrow, brightens on hover */}
      <ArrowUpRight className="absolute top-3 right-3 w-3.5 h-3.5 text-white/25 group-hover:text-accent transition-colors duration-300" />
    </a>
  );
}

export function MembersDirectorySection({ lang }: { lang: Lang }) {
  const sliderOrganizations = allMembers().map((m) => {
    let meta = {
      gradient: "from-slate-500/10 to-slate-600/10",
      borderColor: "rgba(148, 163, 184, 0.2)",
      textColor: "text-slate-400",
      icon: Building,
    };

    if (m.logoInitials === "FPT") {
      meta = {
        gradient: "from-orange-500/10 to-red-600/10",
        borderColor: "rgba(249, 115, 22, 0.25)",
        textColor: "text-orange-400",
        icon: Cpu,
      };
    } else if (m.logoInitials === "DUT") {
      meta = {
        gradient: "from-blue-500/10 to-indigo-600/10",
        borderColor: "rgba(59, 130, 246, 0.25)",
        textColor: "text-blue-400",
        icon: Globe,
      };
    } else if (m.logoInitials === "ACR") {
      meta = {
        gradient: "from-emerald-500/10 to-teal-600/10",
        borderColor: "rgba(16, 185, 129, 0.25)",
        textColor: "text-emerald-400",
        icon: Layers,
      };
    } else if (m.logoInitials === "ENV") {
      meta = {
        gradient: "from-pink-500/10 to-rose-600/10",
        borderColor: "rgba(236, 72, 153, 0.25)",
        textColor: "text-pink-400",
        icon: Briefcase,
      };
    } else if (m.logoInitials === "BAP") {
      meta = {
        gradient: "from-violet-500/10 to-fuchsia-600/10",
        borderColor: "rgba(139, 92, 246, 0.25)",
        textColor: "text-violet-400",
        icon: ShieldCheck,
      };
    } else if (
      m.logoInitials === "NTB" ||
      m.logoInitials === "LNB" ||
      m.logoInitials === "TKC"
    ) {
      meta = {
        gradient: "from-teal-500/10 to-cyan-600/10",
        borderColor: "rgba(20, 184, 166, 0.25)",
        textColor: "text-teal-400",
        icon: User,
      };
    } else if (m.logoInitials === "HHH") {
      meta = {
        gradient: "from-amber-500/10 to-yellow-600/10",
        borderColor: "rgba(245, 158, 11, 0.25)",
        textColor: "text-amber-400",
        icon: ShieldCheck,
      };
    }

    return {
      ...m,
      icon: meta.icon,
      gradient: meta.gradient,
      borderColor: meta.borderColor,
      textColor: meta.textColor,
    };
  });

  const track1 = [...sliderOrganizations, ...sliderOrganizations];
  const track2 = [...sliderOrganizations, ...sliderOrganizations].reverse();

  return (
    <section id="members" className="py-20 md:py-28 relative overflow-hidden">
      <SectionBackground
        variant="none"
        tintTop={seamTint.indigo}
        tintBottom={seamTint.cyan}
      />

      {/* Background contrast stack (same recipe as TopicsSection):
          image -> dark overlay -> black-to-transparent gradient
          -> faint noise -> content. */}
      <div
        aria-hidden
        className="absolute inset-0 z-0 pointer-events-none [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]"
      >
        {/* scale-[1.04] hides the transparent fringe a CSS blur creates at
            the element edges. */}
        <img
          src={doiTacBg}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-transparent" />
        <div className="noise-layer" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionHeader
          title={
            <>
              {lang === "vn"
                ? "Danh bạ Hội viên Công khai"
                : "Public Member Directory"}
              <br />
              <span className="text-gradient-cyan">
                {lang === "vn"
                  ? "Tìm kiếm & Kết nối Doanh nghiệp"
                  : "Find & Connect ICT Businesses"}
              </span>
            </>
          }
          subtitle={
            lang === "vn"
              ? "Hệ sinh thái quy tụ các tập đoàn, doanh nghiệp công nghệ số hàng đầu, các viện trường nghiên cứu cùng ban cố vấn & chuyên gia vi mạch tại Đà Nẵng."
              : "Our ecosystem brings together leading digital technology corporations, research universities, advisory boards, and chip design specialists in Danang."
          }
        />
      </div>

      {/* Infinite Logo Slider Section */}
      <div className="relative z-10 my-12 overflow-hidden py-4 select-none w-full [mask-image:linear-gradient(90deg,transparent,black_6%,black_94%,transparent)]">
        {/* Row 1: Left sliding */}
        <div className="flex gap-5 animate-marquee mb-5 py-2">
          {track1.map((org, idx) => (
            <MemberCard key={`${org.id}-t1-${idx}`} org={org} lang={lang} />
          ))}
        </div>

        {/* Row 2: Right sliding */}
        <div className="flex gap-5 animate-marquee-reverse py-2">
          {track2.map((org, idx) => (
            <MemberCard key={`${org.id}-t2-${idx}`} org={org} lang={lang} />
          ))}
        </div>
      </div>
    </section>
  );
}
