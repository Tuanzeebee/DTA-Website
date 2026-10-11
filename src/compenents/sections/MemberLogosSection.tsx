import { useEffect, useState } from "react";
import { SectionBackground } from "@/compenents/SectionBackground";
import { seamTint } from "@/compenents/seamTint";
import { SectionHeader } from "@/compenents/SectionHeader";
import { allMembers, loadMembersFromApi, type DtaMember } from "@/data";
import type { Lang } from "@/types";

/** Số ô chừa sẵn khi Hiệp hội chưa gửi đủ logo chuẩn. */
const PLACEHOLDER_SLOTS = 12;

/**
 * Tường Logo Hội viên — hiển thị ĐẦY ĐỦ logo (lưới tĩnh, không chạy) theo góp ý
 * 10/2026. Chỉ lấy hội viên tổ chức; logo do Hiệp hội gửi, nhập ở admin
 * (Member.logoUrl). Chưa có logo thì hiện tên, chưa có hội viên thì chừa ô trống.
 */
export function MemberLogosSection({ lang }: { lang: Lang }) {
  const [members, setMembers] = useState<DtaMember[]>(() => allMembers());

  useEffect(() => {
    loadMembersFromApi().then(setMembers);
  }, []);

  const orgs = members.filter((m) => m.type === "organization");
  const empty = Math.max(0, PLACEHOLDER_SLOTS - orgs.length);

  return (
    <section
      id="member-logos"
      className="relative py-16 md:py-20 px-5 md:px-6 overflow-hidden"
    >
      <SectionBackground
        variant="none"
        tintTop={seamTint.moss}
        tintBottom={seamTint.deepMoss}
      />
      {/* Nhận nốt vệt sáng "horizon" ở đáy Nền tảng hỗ trợ (cùng màu, cùng
          độ rộng 80%, neo tại ranh giới) — không có lớp này thì vệt sáng bị
          cắt thẳng ở mép trên. */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-56 md:h-72 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 100% at 50% -12%, oklch(0.62 0.11 158 / 0.22), transparent 62%), linear-gradient(to bottom, oklch(0.78 0.12 78 / 0.05), transparent)",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader
          eyebrow={lang === "vn" ? "Hội viên chính thức" : "Official Members"}
          title={
            <span className="text-gradient-cyan">
              {lang === "vn" ? "Logo Hội viên DTA" : "DTA Member Logos"}
            </span>
          }
        />

        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
          {orgs.map((m) => {
            const tile = m.logoUrl ? (
              <img
                src={m.logoUrl}
                alt={m.name}
                loading="lazy"
                referrerPolicy="no-referrer"
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <span className="text-xs font-bold text-slate-700 text-center leading-snug">
                {m.name}
              </span>
            );
            return (
              <li key={m.id}>
                {m.website ? (
                  <a
                    href={m.website}
                    target="_blank"
                    rel="noreferrer noopener"
                    title={m.name}
                    className="h-24 rounded-2xl bg-white p-4 flex items-center justify-center hover:scale-[1.03] transition-transform"
                  >
                    {tile}
                  </a>
                ) : (
                  <div
                    title={m.name}
                    className="h-24 rounded-2xl bg-white p-4 flex items-center justify-center"
                  >
                    {tile}
                  </div>
                )}
              </li>
            );
          })}
          {Array.from({ length: empty }, (_, i) => (
            <li
              key={`slot-${i}`}
              aria-hidden
              className="h-24 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] flex items-center justify-center text-[10px] uppercase tracking-widest text-white/25"
            >
              {lang === "vn" ? "Logo hội viên" : "Member logo"}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
