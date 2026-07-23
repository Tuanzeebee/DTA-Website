import { toast } from "sonner";
import { Link } from "@tanstack/react-router";
import { FileText, Calendar, Download, ArrowUpRight } from "lucide-react";
import { SectionBackground, seamTint } from "@/compenents/SectionBackground";
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
} from "@/compenents/ScrollReveal";
import { SectionHeader } from "@/compenents/SectionHeader";
import { dtaNews, dtaEvents } from "@/data";
import type { Lang } from "@/types";
import tinTucCutout from "@/assets/image-1566.webp";
import leftGradientBg from "@/assets/left-gradient-start-background.webp";

/** Landing-page teaser -> portal article mapping, by card position. The
 *  landing teasers (dtaNews) and the portal articles (newsData.ts) are
 *  separate mock datasets, so until they share a real backend each teaser
 *  simply deep-links to a representative published article. */
const teaserArticleIds = ["cs-01", "nganh-01", "dn-02"];

/** Same idea for the events column: each upcoming-event card deep-links to a
 *  representative portal article until events get real detail pages. */
const eventArticleIds = ["td-01", "td-02", "dn-03"];

export function TimelineSection({ lang }: { lang: Lang }) {
  return (
    <section
      id="news"
      className="py-20 md:py-28 px-5 md:px-6 relative overflow-hidden"
    >
      <SectionBackground
        variant="grid"
        tintTop={seamTint.cyan}
        tintBottom={seamTint.indigo}
      />

      {/* Diagonal image panel, right side, lg+ only (stacked mobile columns
          would just be visually noisy over it).

          Technique: the outer wrapper is skewed -8deg and clips; the image
          inside is counter-skewed +8deg (and over-scaled) so the artwork
          itself is not distorted — only its left edge is cut on the diagonal.
          Because the seam accents live INSIDE the skewed wrapper, they are
          parallel to the cut by construction, no angle math. */}
      <div
        aria-hidden
        className="absolute inset-y-0 right-0 w-[58%] hidden lg:block pointer-events-none [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]"
      >
        {/* Skewed backdrop: the gradient artwork fills the diagonal panel.
            The subject is a separate background-removed cutout layered on
            top, so overlays here stay LIGHT — the old 45% black stack would
            just sink this corner into darkness. */}
        <div className="absolute -inset-y-10 left-20 -right-32 -skew-x-[8deg] overflow-hidden">
          <img
            src={leftGradientBg}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover skew-x-[8deg] scale-[1.18]"
          />
          {/* Left-weighted fade only, for the text column's contrast — no
              full dark overlay. */}
          <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.10_0.06_265_/_0.92)] via-[oklch(0.10_0.06_265_/_0.3)] to-transparent" />
          <div className="noise-layer" />

          {/* Seam accents: two gradient beams stitched along the diagonal
              cut — cyan hairline plus a gold thread, the page's two accent
              hues. Skewed with the wrapper, so always parallel to the edge. */}
          <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-cyan-400/60 to-transparent" />
          <div className="absolute inset-y-0 left-2.5 w-[2px] bg-gradient-to-b from-transparent via-[oklch(0.85_0.16_90_/_0.35)] to-transparent" />
          {/* Soft bloom along the seam so the cut reads as lit, not sliced. */}
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-cyan-400/10 to-transparent" />
        </div>

        {/* The cutout subject: NOT skewed and object-contain, so the whole
            artwork is visible at a modest size instead of being cropped by
            the panel. Anchored to the right, vertically centred. */}
        <img
          src={tinTucCutout}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute -right-[13%] top-[29%] -translate-y-1/2 h-[62%] max-w-[92%] w-auto object-contain drop-shadow-[0_24px_48px_rgba(0,0,0,0.45)]"
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <SectionHeader
          title={
            <>
              {lang === "vn"
                ? "Tin tức Chuyển đổi số"
                : "Digital Transformation News"}
              <br />
              <span className="text-gradient-cyan">
                {lang === "vn" ? "& Sự kiện nổi bật" : "& Featured Events"}
              </span>
            </>
          }
          subtitle={
            lang === "vn"
              ? "Cập nhật các chính sách chuyển đổi số, ấn phẩm CNTT nội bộ DTA cùng lịch trình hội thảo quốc tế, đối thoại trực tiếp sắp diễn ra."
              : "Stay updated with digital legislation, DTA journals, and our upcoming interactive seminars and forums."
          }
        />

        <div className="grid lg:grid-cols-12 gap-10">
          {/* Left Column: News */}
          <div className="lg:col-span-5 space-y-4">
            <ScrollReveal>
              <h3 className="text-xs tracking-[0.2em] font-bold text-accent uppercase mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-accent" />
                <span>
                  {lang === "vn"
                    ? "Tin tức & Ấn phẩm mới nhất"
                    : "Latest News & Publications"}
                </span>
              </h3>
            </ScrollReveal>

            <StaggerContainer className="space-y-4">
              {dtaNews.slice(0, 3).map((news, idx) => (
                <StaggerItem key={news.title.vn}>
                  <div className="card-surface card-solid rounded-3xl flex overflow-hidden group relative transition-all duration-300 hover:border-accent/40 hover:-translate-y-0.5">
                    {/* Card-wide click target -> the portal article page.
                        An overlay Link (not a wrapping <a>) because the card
                        also contains the PDF button — nesting interactive
                        elements is invalid; the button sits above on z-[2]. */}
                    <Link
                      to="/news/article/$id"
                      params={{ id: teaserArticleIds[idx] }}
                      aria-label={news.title[lang]}
                      className="absolute inset-0 z-[1] rounded-3xl"
                    />
                    {/* News Image Metadata */}
                    <div className="w-28 h-auto shrink-0 relative overflow-hidden hidden sm:block">
                      <img
                        src={news.image}
                        alt={news.title[lang]}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="px-2.5 py-1 rounded-md text-[9px] font-bold bg-accent/10 text-accent uppercase tracking-wider">
                            {news.category[lang]}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {news.date}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-white mb-2 leading-snug group-hover:text-accent transition-colors duration-200 line-clamp-2">
                          {news.title[lang]}
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                          {news.summary[lang]}
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between gap-3">
                        {/* Visual affordance only — the overlay Link handles
                            the actual click, so this stays non-interactive. */}
                        <span className="text-[10px] uppercase font-bold text-white/40 group-hover:text-accent transition-colors duration-300 flex items-center gap-1 pointer-events-none">
                          <span>
                            {lang === "vn" ? "Đọc bài viết" : "Read article"}
                          </span>
                          <ArrowUpRight className="w-3 h-3" />
                        </span>
                        <button
                          onClick={() => {
                            toast.info(
                              lang === "vn"
                                ? "Đang tải tài liệu nội bộ..."
                                : "Downloading resource...",
                            );
                            setTimeout(() => {
                              toast.success(
                                lang === "vn"
                                  ? "Tải xuống hoàn tất!"
                                  : "Download complete!",
                              );
                            }, 1500);
                          }}
                          className="relative z-[2] text-[10px] uppercase font-bold text-cyan-400 flex items-center gap-1 cursor-pointer hover:underline"
                        >
                          <Download className="w-3 h-3" />
                          <span>
                            {lang === "vn"
                              ? "Tải Ấn phẩm (PDF)"
                              : "Download PDF"}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>

          {/* Right Column: Events */}
          <div className="lg:col-span-7 space-y-6">
            <ScrollReveal>
              <h3 className="text-xs tracking-[0.2em] font-bold text-accent uppercase mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-accent" />
                <span>
                  {lang === "vn"
                    ? "Sự kiện sắp diễn ra"
                    : "Upcoming Events Calendar"}
                </span>
              </h3>
            </ScrollReveal>

            <StaggerContainer className="space-y-6">
              {dtaEvents.map((event, idx) => (
                <StaggerItem key={event.title.vn}>
                  <div className="card-surface card-solid rounded-3xl relative overflow-hidden flex flex-col md:flex-row group transition-all duration-300 hover:border-accent/40 hover:-translate-y-0.5">
                    {/* Card-wide click target -> the portal article page,
                        same overlay-Link pattern as the news column: the
                        register button keeps its own click on z-[2]. */}
                    <Link
                      to="/news/article/$id"
                      params={{ id: eventArticleIds[idx] }}
                      aria-label={event.title[lang]}
                      className="absolute inset-0 z-[1] rounded-3xl"
                    />
                    {/* Event Image */}
                    <div className="w-full md:w-44 h-36 md:h-auto shrink-0 relative overflow-hidden">
                      <img
                        src={
                          idx === 0
                            ? "https://picsum.photos/seed/microchip/400/300"
                            : idx === 1
                              ? "https://picsum.photos/seed/dataserver/400/300"
                              : "https://picsum.photos/seed/robotics/400/300"
                        }
                        alt={event.title[lang]}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 md:hidden">
                        <span className="px-2.5 py-1 bg-emerald-500/90 text-white text-[8px] font-black uppercase tracking-widest rounded-lg border border-emerald-500/20">
                          {event.status[lang]}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 md:p-6 flex-1 relative flex flex-col justify-between">
                      <div className="absolute top-0 right-0 hidden md:block">
                        <span className="px-3 py-1 bg-emerald-500/15 text-emerald-400 text-[8px] font-black uppercase tracking-widest rounded-bl-xl border-l border-b border-emerald-500/10">
                          {event.status[lang]}
                        </span>
                      </div>
                      <div className="flex items-start gap-4">
                        {/* Calendar Date Block */}
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center text-center shrink-0 min-w-[70px]">
                          <span className="text-[10px] font-bold text-accent font-mono">
                            2026
                          </span>
                          <span className="text-base font-black text-white font-mono mt-0.5">
                            {event.date.split("/")[0]}/
                            {event.date.split("/")[1]}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-white leading-snug">
                            {event.title[lang]}
                          </h4>
                          <div className="mt-2.5 space-y-1 text-xs text-muted-foreground">
                            <p className="flex items-center gap-1.5">
                              <span className="font-semibold text-white">
                                {lang === "vn" ? "Thời gian:" : "Time:"}
                              </span>{" "}
                              {event.time}
                            </p>
                            <p className="flex items-center gap-1.5 leading-tight">
                              <span className="font-semibold text-white">
                                {lang === "vn" ? "Địa điểm:" : "Venue:"}
                              </span>{" "}
                              {event.location[lang]}
                            </p>
                          </div>
                          <div className="mt-4 flex items-center gap-4">
                            <button
                              onClick={() => {
                                toast.success(
                                  lang === "vn"
                                    ? "Đăng ký thành công! Vé tham dự điện tử đã gửi tới Email của bạn."
                                    : "Registered successfully! Ticket sent to email.",
                                );
                              }}
                              className="relative z-[2] px-4 py-1.5 rounded-full text-[10px] font-bold border border-white/10 hover:bg-white/10 active:scale-95 transition-all duration-200 text-white cursor-pointer"
                            >
                              {lang === "vn"
                                ? "Đăng ký Tham gia"
                                : "Register Now"}
                            </button>
                            {/* Visual affordance only — the overlay Link
                                handles the actual click. */}
                            <span className="text-[10px] uppercase font-bold text-white/40 group-hover:text-accent transition-colors duration-300 flex items-center gap-1 pointer-events-none">
                              <span>
                                {lang === "vn" ? "Xem chi tiết" : "Details"}
                              </span>
                              <ArrowUpRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
