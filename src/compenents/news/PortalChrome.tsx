import { useState, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ChevronDown,
  Newspaper,
  Search,
  Bookmark,
  LayoutGrid,
} from "lucide-react";
import { mainTopics, topicName, topicShort, categoryName } from "@/newsData";
import { useLang } from "@/hooks/useLang";
import type { Lang } from "@/types";

/**
 * Portal chrome that lives UNDER the shared site header (layout/Nav):
 * a sticky topic-menu bar plus the portal footer. The menu shows ONLY the
 * four main topics — categories appear in dropdowns, never as top-level
 * items (per the association's brief). The live date-time required by the
 * brief sits at the right end of the bar.
 */

function useClock(lang: Lang) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);
  return new Intl.DateTimeFormat(lang === "vn" ? "vi-VN" : "en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(now);
}

export function PortalMenuBar() {
  const { lang } = useLang();
  const clock = useClock(lang);

  /* State-driven dropdown instead of pure CSS hover/focus-within: navigation
     here is client-side (no page reload), so a clicked link KEEPS focus and a
     :focus-within dropdown would stay open until the user clicked elsewhere.
     With state, any click closes it immediately. */
  const [openTopic, setOpenTopic] = useState<string | null>(null);

  /* Mobile: a swipeable strip felt fiddly — below md the topics collapse
     into one "Chuyên mục" button that drops a grouped panel instead. */
  const [mobileOpen, setMobileOpen] = useState(false);

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

        {/* Mobile trigger: one button replaces the topic strip below md —
            tapping drops the grouped panel underneath (no swiping). */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-controls="portal-mobile-menu"
          className="md:hidden flex items-center gap-1.5 h-11 px-3 text-[12px] font-bold uppercase tracking-wide text-white hover:text-cyan-300 transition-colors cursor-pointer"
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>{lang === "vn" ? "Chuyên mục" : "Categories"}</span>
          <ChevronDown
            className={`w-3 h-3 opacity-60 transition-transform duration-300 ${
              mobileOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Desktop topic strip (md+). flex-1 min-w-0 keeps the bar one row:
            the strip absorbs leftover space instead of pushing the row wider.
            Must stay overflow-visible from md up — an auto overflow on
            EITHER axis forces the other to auto, and the absolute dropdown
            then creates an inner scrollbar on hover (the old glitch). */}
        <div className="hidden md:flex flex-1 min-w-0 items-stretch gap-1 overflow-visible">
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
                  <span>{topicShort(t, lang)}</span>
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
                        {categoryName(c, lang)}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right cluster: keyword search + saved articles + live date-time
            ("góc thời gian" in the brief). Everything here is shrink-0 and
            width-staged (input grows md->xl, labels/clock appear xl+) so the
            cluster never forces the bar to wrap. */}
        <div className="ml-auto flex items-center gap-1 md:gap-2 pl-2 md:pl-3 shrink-0">
          <MenuSearchForm />
          <Link
            to="/news/da-luu"
            title={lang === "vn" ? "Bài đã lưu" : "Saved articles"}
            aria-label={lang === "vn" ? "Bài đã lưu" : "Saved articles"}
            className="flex items-center gap-1 h-8 px-2 rounded-lg text-white/60 hover:text-cyan-300 transition-colors shrink-0"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span className="hidden xl:inline text-[11px] font-bold uppercase tracking-wide">
              {lang === "vn" ? "Đã lưu" : "Saved"}
            </span>
          </Link>
          <span className="hidden xl:block text-[11px] text-white/50 capitalize whitespace-nowrap">
            {clock}
          </span>
        </div>
      </div>

      {/* Mobile drop panel: all 4 topics with their categories, grouped —
          tap anywhere on the backdrop or any link to close. Scrolls inside
          itself past 70vh so long lists never trap the page. */}
      {mobileOpen && (
        <>
          <div
            aria-hidden
            onClick={() => setMobileOpen(false)}
            className="md:hidden fixed inset-0 top-[6.75rem] z-40 bg-black/50"
          />
          <div
            id="portal-mobile-menu"
            className="md:hidden absolute left-0 right-0 top-full z-50 border-b border-white/10 bg-[oklch(0.14_0.06_265_/_0.97)] backdrop-blur-md max-h-[70vh] overflow-y-auto"
          >
            <div className="px-4 py-3 grid grid-cols-1 gap-1">
              {mainTopics.map((t) => (
                <div key={t.slug} className="py-1.5">
                  <Link
                    to="/news/$topic"
                    params={{ topic: t.slug }}
                    onClick={() => setMobileOpen(false)}
                    className="block text-[12px] font-black uppercase tracking-wide text-accent hover:text-cyan-300 transition-colors"
                  >
                    {topicName(t, lang)}
                  </Link>
                  <div className="mt-1">
                    {t.categories.map((c) => (
                      <Link
                        key={c.slug}
                        to="/news/$topic/$category"
                        params={{ topic: t.slug, category: c.slug }}
                        onClick={() => setMobileOpen(false)}
                        className="block py-1.5 pl-3 border-l border-white/10 text-[13px] text-white/80 hover:text-cyan-300 transition-colors"
                      >
                        {categoryName(c, lang)}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </nav>
  );
}

/** Keyword search ("từ khóa - tìm kiếm" utility). Inline input from md up;
 *  below md just an icon link to the search page, which has its own input. */
function MenuSearchForm() {
  const { lang } = useLang();
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  return (
    <>
      <form
        role="search"
        className="hidden md:flex items-center h-8 rounded-lg border border-white/10 bg-white/[0.04] focus-within:border-cyan-400/50 transition-colors"
        onSubmit={(e) => {
          e.preventDefault();
          const query = q.trim();
          if (!query) return;
          navigate({ to: "/news/tim-kiem", search: { q: query } });
          setQ("");
        }}
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={lang === "vn" ? "Tìm kiếm…" : "Search…"}
          aria-label={lang === "vn" ? "Tìm kiếm tin bài" : "Search articles"}
          className="w-24 xl:w-36 bg-transparent pl-3 pr-1 text-[12px] text-white placeholder:text-white/35 focus:outline-none"
        />
        <button
          type="submit"
          aria-label="Tìm kiếm"
          className="h-full px-2 text-white/50 hover:text-cyan-300 transition-colors cursor-pointer"
        >
          <Search className="w-3.5 h-3.5" />
        </button>
      </form>
      <Link
        to="/news/tim-kiem"
        aria-label="Tìm kiếm"
        className="md:hidden flex items-center h-8 px-2 rounded-lg text-white/60 hover:text-cyan-300 transition-colors"
      >
        <Search className="w-3.5 h-3.5" />
      </Link>
    </>
  );
}

/** Banner zone, laid out per the brief's illustration: one large
 *  propaganda/campaign banner on the left (carries paid placement when no
 *  campaign runs), and to its right two stacked slots — "quảng cáo" and
 *  "tài trợ" — separated by breathing room ("khoảng cách vừa đủ").
 *  All placeholders until real creative. */
export function PortalBanner() {
  const { lang } = useLang();
  const slot =
    "rounded-2xl border border-dashed border-white/15 bg-white/[0.03] flex items-center justify-center text-white/40 uppercase tracking-[0.2em]";
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 mt-6">
      <div className="grid md:grid-cols-3 gap-3 md:gap-4">
        <div className={`${slot} md:col-span-2 h-20 md:h-28 text-xs`}>
          {lang === "vn"
            ? "Banner tuyên truyền / cổ động"
            : "Campaign / promotional banner"}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-1 gap-3 md:gap-4">
          <div className={`${slot} h-14 md:h-12 text-[10px]`}>
            {lang === "vn" ? "Dành cho quảng cáo" : "Advertising slot"}
          </div>
          <div className={`${slot} h-14 md:h-12 text-[10px]`}>
            {lang === "vn" ? "Dành cho tài trợ" : "Sponsorship slot"}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Bottom repeat of the FULL topic menu — main topics AND their categories —
 * placed at the end of every portal page so readers reaching the bottom can
 * jump anywhere without scrolling back up (brief: "Lặp lại danh mục chủ đề
 * chính... và các chuyên mục... ở chân trang"; reference: laodong.vn).
 */
export function PortalBottomMenu() {
  const { lang } = useLang();
  return (
    <nav
      aria-label={
        lang === "vn" ? "Chuyên mục (cuối trang)" : "Categories (footer)"
      }
      className="border-t border-white/10 bg-black/25 mt-16"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8">
        {mainTopics.map((t) => (
          <div key={t.slug}>
            <Link
              to="/news/$topic"
              params={{ topic: t.slug }}
              className="block text-[11px] font-black uppercase tracking-wider text-accent hover:text-cyan-300 transition-colors border-b border-white/10 pb-2 mb-2.5"
            >
              {topicName(t, lang)}
            </Link>
            <ul className="space-y-1.5">
              {t.categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    to="/news/$topic/$category"
                    params={{ topic: t.slug, category: c.slug }}
                    className="text-xs text-white/60 hover:text-cyan-300 transition-colors leading-snug"
                  >
                    {categoryName(c, lang)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </nav>
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
