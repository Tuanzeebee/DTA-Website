import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, Newspaper } from "lucide-react";
import { mainTopics } from "@/newsData";

/**
 * Portal chrome that lives UNDER the shared site header (layout/Nav):
 * a sticky topic-menu bar plus the portal footer. The menu shows ONLY the
 * four main topics — categories appear in dropdowns, never as top-level
 * items (per the association's brief). The live date-time required by the
 * brief sits at the right end of the bar.
 */

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);
  return new Intl.DateTimeFormat("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(now);
}

export function PortalMenuBar() {
  const clock = useClock();

  /* State-driven dropdown instead of pure CSS hover/focus-within: navigation
     here is client-side (no page reload), so a clicked link KEEPS focus and a
     :focus-within dropdown would stay open until the user clicked elsewhere.
     With state, any click closes it immediately. */
  const [openTopic, setOpenTopic] = useState<string | null>(null);

  return (
    /* top-16 = height of the fixed shared header, so the bar docks right
       under it while scrolling. */
    <nav className="sticky top-16 z-40 border-y border-white/10 bg-[oklch(0.14_0.06_265_/_0.88)] backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center gap-1">
        <Link
          to="/news"
          className="flex items-center gap-1.5 pr-3 mr-1 h-11 border-r border-white/10 text-[12px] md:text-[13px] font-black uppercase tracking-wide text-accent hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0"
        >
          <Newspaper className="w-3.5 h-3.5" />
          <span>DTA News</span>
        </Link>

        {/* overflow-x-auto only below md (horizontal swipe for narrow screens,
            where hover dropdowns don't exist anyway). From md up the row must
            be overflow-visible: an auto overflow on EITHER axis forces the
            other axis to auto too, so the absolute dropdown was creating an
            inner vertical scrollbar on hover — the "scroll down" glitch. */}
        <div className="flex items-stretch gap-1 overflow-x-auto md:overflow-visible">
          {mainTopics.map((t) => {
            const isOpen = openTopic === t.slug;
            return (
              <div
                key={t.slug}
                className="relative shrink-0"
                onMouseEnter={() => setOpenTopic(t.slug)}
                onMouseLeave={() => setOpenTopic(null)}
                /* Keyboard: opens when any link inside receives focus, closes
                   when focus moves outside this topic's subtree. */
                onFocusCapture={() => setOpenTopic(t.slug)}
                onBlurCapture={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    setOpenTopic(null);
                  }
                }}
              >
                <Link
                  to="/news/$topic"
                  params={{ topic: t.slug }}
                  onClick={() => setOpenTopic(null)}
                  className="flex items-center gap-1 px-3 md:px-4 h-11 text-[12px] md:text-[13px] font-bold uppercase tracking-wide text-white hover:text-cyan-300 transition-colors whitespace-nowrap"
                >
                  <span>{t.short}</span>
                  <ChevronDown
                    className={`w-3 h-3 opacity-60 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </Link>
                {/* visibility+opacity (not display) so it eases in instead of
                    popping. */}
                <div
                  className={`absolute left-0 top-full transition-all duration-200 ease-out min-w-[260px] z-50 ${
                    isOpen
                      ? "visible opacity-100 translate-y-0"
                      : "invisible opacity-0 translate-y-1 pointer-events-none"
                  }`}
                >
                  <div className="glass rounded-b-xl border border-white/10 py-2 shadow-2xl">
                    {t.categories.map((c) => (
                      <Link
                        key={c.slug}
                        to="/news/$topic/$category"
                        params={{ topic: t.slug, category: c.slug }}
                        onClick={(e) => {
                          setOpenTopic(null);
                          e.currentTarget.blur();
                        }}
                        className="block px-4 py-2 text-[12px] text-white/85 hover:text-cyan-300 hover:bg-white/5 transition-colors"
                      >
                        {c.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live date-time ("góc thời gian" in the brief). */}
        <span className="ml-auto hidden lg:block pl-4 text-[11px] text-white/50 capitalize whitespace-nowrap shrink-0">
          {clock}
        </span>
      </div>
    </nav>
  );
}

/** Banner zone: propaganda / campaign area; carries paid placement when no
 *  campaign is running (per brief). Placeholder until real creative. */
export function PortalBanner() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 mt-6">
      <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.03] h-20 md:h-28 flex items-center justify-center text-white/40 text-xs uppercase tracking-[0.2em]">
        Khu vực banner tuyên truyền / quảng cáo
      </div>
    </div>
  );
}

export function PortalFooter() {
  return (
    <footer className="border-t border-white/10 bg-black/40 mt-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 grid md:grid-cols-3 gap-8 text-xs text-white/60">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Newspaper className="w-4 h-4 text-accent" />
            <span className="font-black text-white uppercase tracking-wider">
              DTA News
            </span>
          </div>
          <p className="leading-relaxed">
            Trang thông tin điện tử tổng hợp của Hiệp hội Công nghệ số Đà Nẵng.
            Giấy phép số <strong className="text-white/85">447/GP-STTTT</strong>{" "}
            do Sở Thông tin và Truyền thông TP. Đà Nẵng cấp.
          </p>
          <p className="mt-2 leading-relaxed">
            Đây không phải báo điện tử; nội dung tổng hợp tuân thủ giới hạn của
            giấy phép trang thông tin điện tử tổng hợp.
          </p>
        </div>

        <div>
          <div className="font-bold text-white uppercase tracking-wider mb-3">
            Ban biên tập & Liên hệ
          </div>
          <ul className="space-y-1.5 leading-relaxed">
            <li>Chịu trách nhiệm nội dung: Ban Biên tập DTA</li>
            <li>Tầng 4, Tòa nhà Công Viên Phần Mềm, 02 Quang Trung, Đà Nẵng</li>
            <li>Điện thoại: +84 (0236) 3888-299</li>
            <li>
              Email:{" "}
              <a
                href="mailto:office@dtadanang.org.vn"
                className="hover:text-cyan-300 transition-colors"
              >
                office@dtadanang.org.vn
              </a>
            </li>
            <li>Đơn vị phát triển: Văn phòng số DTA</li>
          </ul>
        </div>

        {/* The brief asks the menu to repeat in the footer. */}
        <div>
          <div className="font-bold text-white uppercase tracking-wider mb-3">
            Chuyên trang
          </div>
          <ul className="space-y-1.5">
            {mainTopics.map((t) => (
              <li key={t.slug}>
                <Link
                  to="/news/$topic"
                  params={{ topic: t.slug }}
                  className="hover:text-cyan-300 transition-colors"
                >
                  {t.name}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/" className="hover:text-cyan-300 transition-colors">
                Trang chủ Hiệp hội
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5 py-4 text-center text-[10px] text-white/40">
        © 2026 Hiệp hội Công nghệ số Đà Nẵng (DTA). Bảo lưu mọi quyền.
      </div>
    </footer>
  );
}
