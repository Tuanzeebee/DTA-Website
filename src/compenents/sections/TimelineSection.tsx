import { toast } from "sonner";
import { FileText, Calendar, Download } from "lucide-react";
import { SectionBackground, RuleFade } from "@/compenents/SectionBackground";
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
} from "@/compenents/ScrollReveal";
import { SectionHeader } from "@/compenents/SectionHeader";
import { dtaNews, dtaEvents } from "@/data";
import type { Lang } from "@/types";

export function TimelineSection({ lang }: { lang: Lang }) {
  return (
    <section
      id="news"
      className="py-20 md:py-28 px-5 md:px-6 relative overflow-hidden"
    >
      <RuleFade className="absolute inset-x-0 top-0" />
      <SectionBackground variant={["grid", "vignette"]} />

      <div className="max-w-6xl mx-auto relative z-10">
        <SectionHeader
          eyebrow={
            lang === "vn"
              ? "ẤN PHẨM & LỊCH TRÌNH HOẠT ĐỘNG"
              : "PUBLICATIONS & SCHEDULES"
          }
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
              {dtaNews.slice(0, 3).map((news) => (
                <StaggerItem key={news.title.vn}>
                  <div className="card-surface rounded-3xl flex overflow-hidden group">
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
                      <div className="mt-4 pt-3 border-t border-white/5 flex justify-end">
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
                          className="text-[10px] uppercase font-bold text-cyan-400 flex items-center gap-1 cursor-pointer hover:underline"
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
                  <div className="card-surface rounded-3xl relative overflow-hidden flex flex-col md:flex-row group">
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
                          <div className="mt-4">
                            <button
                              onClick={() => {
                                toast.success(
                                  lang === "vn"
                                    ? "Đăng ký thành công! Vé tham dự điện tử đã gửi tới Email của bạn."
                                    : "Registered successfully! Ticket sent to email.",
                                );
                              }}
                              className="px-4 py-1.5 rounded-full text-[10px] font-bold border border-white/10 hover:bg-white/10 active:scale-95 transition-all duration-200 text-white cursor-pointer"
                            >
                              {lang === "vn"
                                ? "Đăng ký Tham gia"
                                : "Register Now"}
                            </button>
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
