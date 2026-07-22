import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Calendar,
  Clock,
  MapPin,
  Tag,
  ChevronRight,
  Newspaper,
  BookOpen,
  ArrowRight,
  Filter,
  CheckCircle,
} from "lucide-react";
import { useLang } from "@/hooks/useLang";
import { PageShell } from "@/compenents/layout/PageShell";
import { Nav } from "@/compenents/layout/Nav";
import { Footer } from "@/compenents/layout/Footer";
import { dtaNews, dtaEvents, DtaNews, DtaEvent } from "@/data";

export const Route = createFileRoute("/news")({
  component: NewsPage,
});

function NewsPage() {
  const { lang, toggleLang } = useLang();
  const [activeTab, setActiveTab] = useState<"news" | "events">("news");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Get unique categories for News
  const categories = ["all", ...new Set(dtaNews.map((n) => n.category[lang]))];

  // Filter News
  const filteredNews = dtaNews.filter((item) => {
    const matchesCategory =
      activeCategory === "all" || item.category[lang] === activeCategory;
    const matchesSearch =
      item.title[lang].toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary[lang].toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category[lang].toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Filter Events
  const filteredEvents = dtaEvents.filter((item) => {
    const matchesSearch =
      item.title[lang].toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location[lang].toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.status[lang].toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <PageShell>
      <Nav lang={lang} toggleLang={toggleLang} isLoggedIn={false} />

      {/* Hero Header Section */}
      <section className="relative pt-36 pb-16 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-oklch(0.12 0.04 250) pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl">
            <span className="text-[10px] tracking-[0.25em] font-black text-accent uppercase block mb-3">
              {lang === "vn"
                ? "TRUYỀN THÔNG & TIN TỨC DTA"
                : "DTA MEDIA & PUBLICITY"}
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight uppercase">
              {lang === "vn" ? "Tin tức & Sự kiện" : "News & Events"}
            </h1>
            <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
              {lang === "vn"
                ? "Cập nhật các chính sách kinh tế số mới nhất, các báo cáo nghiên cứu công nghệ vi mạch, AI và các chương trình kết nối giao thương của Hiệp hội."
                : "Stay updated with the latest digital economy policies, semiconductor and AI research journals, and trade matchmaking activities from DTA."}
            </p>
          </div>
        </div>
      </section>

      {/* Main Interactive Controls Row */}
      <section className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/5">
          {/* VN / EN tabs */}
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 w-full md:w-auto shrink-0">
            <button
              onClick={() => {
                setActiveTab("news");
                setActiveCategory("all");
              }}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "news"
                  ? "bg-accent text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              <Newspaper className="w-4 h-4" />
              <span>
                {lang === "vn" ? "Tin tức hoạt động" : "Articles & News"}
              </span>
            </button>
            <button
              onClick={() => {
                setActiveTab("events");
                setActiveCategory("all");
              }}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "events"
                  ? "bg-accent text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>
                {lang === "vn" ? "Sự kiện - Hội thảo" : "Events & Seminars"}
              </span>
            </button>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground" />
            <input
              type="text"
              placeholder={
                activeTab === "news"
                  ? lang === "vn"
                    ? "Tìm kiếm bài viết, chính sách..."
                    : "Search articles, publications..."
                  : lang === "vn"
                    ? "Tìm kiếm hội thảo, địa điểm..."
                    : "Search events, locations..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white/5 border border-white/5 focus:border-accent/40 rounded-xl text-sm text-white placeholder-muted-foreground focus:outline-none transition-all"
            />
          </div>
        </div>
      </section>

      {/* Categorized Content */}
      <section className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === "news" ? (
              <motion.div
                key="news-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-10"
              >
                {/* News Categories Filters */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="text-xs text-muted-foreground flex items-center gap-1.5 mr-2">
                    <Filter className="w-3.5 h-3.5" />
                    <span>{lang === "vn" ? "Phân loại:" : "Categories:"}</span>
                  </div>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all border cursor-pointer ${
                        activeCategory === cat
                          ? "bg-white text-black border-white"
                          : "bg-white/5 text-muted-foreground border-white/5 hover:border-white/10 hover:text-white"
                      }`}
                    >
                      {cat === "all" ? (lang === "vn" ? "TẤT CẢ" : "ALL") : cat}
                    </button>
                  ))}
                </div>

                {/* News Grid */}
                {filteredNews.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredNews.map((news, idx) => (
                      <motion.div
                        key={news.title.en}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: idx * 0.05 }}
                        className="glass border border-white/10 rounded-[2rem] overflow-hidden group flex flex-col hover:border-white/20 transition-all duration-300 relative"
                      >
                        {/* News Image */}
                        <div className="relative h-48 w-full overflow-hidden shrink-0">
                          <img
                            src={news.image}
                            alt={news.title[lang]}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 pointer-events-none" />
                        </div>

                        {/* Shimmer gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

                        <div className="p-6 md:p-8 flex flex-col h-full justify-between relative z-10 flex-1">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between text-[10px] font-mono tracking-wider text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-accent" />
                                {news.date}
                              </span>
                              <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 font-semibold text-accent uppercase text-[9px]">
                                {news.category[lang]}
                              </span>
                            </div>

                            <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-accent transition-colors duration-200 line-clamp-2 leading-snug">
                              {news.title[lang]}
                            </h3>

                            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed line-clamp-4">
                              {news.summary[lang]}
                            </p>
                          </div>

                          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                            <button
                              onClick={() => {
                                toast.info(
                                  lang === "vn"
                                    ? "Tính năng xem chi tiết bài báo sẽ sớm được cập nhật."
                                    : "Article details page will be integrated soon.",
                                );
                              }}
                              className="text-xs font-bold text-white group-hover:text-accent transition-colors flex items-center gap-1.5 cursor-pointer"
                            >
                              <span>
                                {lang === "vn"
                                  ? "Đọc bài viết"
                                  : "Read Full Article"}
                              </span>
                              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center glass rounded-3xl border border-white/5 max-w-lg mx-auto">
                    <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-40" />
                    <h3 className="text-lg font-bold text-white">
                      {lang === "vn"
                        ? "Không tìm thấy bài viết"
                        : "No articles found"}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
                      {lang === "vn"
                        ? "Vui lòng kiểm tra lại từ khóa hoặc chọn phân loại khác."
                        : "Please try another search keyword or clear filters."}
                    </p>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="events-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Events list */}
                {filteredEvents.length > 0 ? (
                  <div className="space-y-4">
                    {filteredEvents.map((evt, idx) => (
                      <motion.div
                        key={evt.title.en}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: idx * 0.05 }}
                        className="glass border border-white/5 hover:border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 group hover:bg-white/[0.01] transition-all"
                      >
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 flex-1">
                          {/* Event Image Metadata */}
                          <div className="w-full md:w-44 h-28 rounded-2xl overflow-hidden shrink-0 relative border border-white/5">
                            <img
                              src={evt.image}
                              alt={evt.title[lang]}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                          </div>

                          <div className="flex-1 space-y-4">
                            <div className="flex flex-wrap items-center gap-3">
                              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-accent/10 border border-accent/20 text-accent flex items-center gap-1">
                                <CheckCircle className="w-3.5 h-3.5" />
                                {evt.status[lang]}
                              </span>
                              <span className="text-xs text-muted-foreground font-mono flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-accent" />
                                {evt.date}
                              </span>
                            </div>

                            <h3 className="text-xl font-bold text-white group-hover:text-accent transition-colors leading-snug">
                              {evt.title[lang]}
                            </h3>

                            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-accent shrink-0" />
                                {evt.time}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
                                {evt.location[lang]}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-white/5 flex">
                          <button
                            onClick={() => {
                              toast.success(
                                lang === "vn"
                                  ? "Gửi yêu cầu đăng ký tham gia hội thảo thành công!"
                                  : "Successfully submitted registration request!",
                              );
                            }}
                            className="w-full lg:w-auto px-6 py-3 rounded-xl font-bold text-xs text-primary-foreground hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                            style={{
                              background: "var(--gradient-primary)",
                              boxShadow: "var(--shadow-glow)",
                            }}
                          >
                            <span>
                              {lang === "vn"
                                ? "Đăng ký tham gia"
                                : "Register Now"}
                            </span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center glass rounded-3xl border border-white/5 max-w-lg mx-auto">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-40" />
                    <h3 className="text-lg font-bold text-white">
                      {lang === "vn"
                        ? "Không tìm thấy sự kiện"
                        : "No events found"}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
                      {lang === "vn"
                        ? "Vui lòng kiểm tra lại từ khóa hoặc xem lại bài viết tin tức."
                        : "Please try another search keyword or browse news articles."}
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <Footer lang={lang} />
    </PageShell>
  );
}
