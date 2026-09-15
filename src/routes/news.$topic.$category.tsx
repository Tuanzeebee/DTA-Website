import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Download, Send, ExternalLink, UserPlus, IdCard } from "lucide-react";
import { allMembers, type DtaMember } from "@/data";
import { MemberDetailDialog } from "@/compenents/member/MemberDetailDialog";
import {
  topicShort,
  categoryName,
  categoryDesc,
  isArticleSort,
  isArticleFlag,
  DEFAULT_SORT,
  articleFlags,
  articleFlagLabels,
} from "@/newsData";
import { useTopics, useArticles } from "@/hooks/useNewsApi";
import { useLang } from "@/hooks/useLang";
import { authService } from "@/lib/auth/service";
import {
  ArticleCard,
  ArticleListControls,
  ArticlePagination,
  HomeDigest,
  SidebarAds,
  SidebarLogos,
  type ArticleListSearch,
} from "@/compenents/news/PortalBlocks";

export const Route = createFileRoute("/news/$topic/$category")({
  validateSearch: (search: Record<string, unknown>): ArticleListSearch => {
    const out: ArticleListSearch = {};
    if (isArticleSort(search.sort) && search.sort !== DEFAULT_SORT)
      out.sort = search.sort;
    if (isArticleFlag(search.flag)) out.flag = search.flag;
    const page = Number(search.page);
    if (Number.isInteger(page) && page > 1) out.page = page;
    return out;
  },
  component: CategoryPage,
});

function PartnershipForm() {
  const [need, setNeed] = useState("moi-thau");
  const [detail, setDetail] = useState("");
  const [contact, setContact] = useState("");

  const submit = () => {
    if (!detail.trim() || !contact.trim()) {
      toast.error("Vui lòng nhập nội dung nhu cầu và thông tin liên hệ.");
      return;
    }
    toast.success(
      "Đã gửi nhu cầu kết nối! Ban Thư ký sẽ liên hệ trong 3 ngày làm việc.",
    );
    setDetail("");
    setContact("");
  };

  return (
    <div className="card-surface rounded-2xl p-6 mb-8">
      <h3 className="text-sm font-black uppercase tracking-wider text-white mb-1">
        Gửi nhu cầu kết nối
      </h3>
      <p className="text-xs text-white/55 mb-4">
        Mời thầu, mời cung ứng hoặc tìm đối tác — nhập trực tiếp, Ban Thư ký
        tiếp nhận và điều phối.
      </p>
      <div className="space-y-3">
        <div>
          <label className="block text-[10px] uppercase tracking-wider text-white/60 font-bold mb-1.5">
            Loại nhu cầu
          </label>
          <select
            value={need}
            onChange={(e) => setNeed(e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400/60"
          >
            <option value="moi-thau">Mời thầu</option>
            <option value="moi-cung-ung">Mời cung ứng</option>
            <option value="tim-doi-tac">Tìm đối tác</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-wider text-white/60 font-bold mb-1.5">
            Nội dung nhu cầu
          </label>
          <textarea
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            rows={3}
            placeholder="Mô tả ngắn gọn phạm vi, thời hạn, yêu cầu năng lực…"
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-400/60 resize-none"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-wider text-white/60 font-bold mb-1.5">
            Đơn vị & liên hệ
          </label>
          <input
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="Tên đơn vị — email / số điện thoại"
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-400/60"
          />
        </div>
        <button
          onClick={submit}
          className="px-5 py-2.5 rounded-full text-xs font-bold text-primary-foreground flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all cursor-pointer"
          style={{
            background: "var(--gradient-primary)",
            boxShadow: "var(--shadow-glow)",
          }}
        >
          <Send className="w-3.5 h-3.5" />
          Gửi nhu cầu
        </button>
      </div>
    </div>
  );
}

function CommunityGrid({ lang }: { lang: "vn" | "en" }) {
  const [selected, setSelected] = useState<DtaMember | null>(null);
  return (
    <>
      <div className="grid sm:grid-cols-2 gap-5 mb-10">
        {allMembers()
          .filter((m) => m.type === "organization")
          .map((m) => (
            <div key={m.id} className="card-surface rounded-2xl p-4 flex gap-4">
            <a
              href={m.website ?? "#"}
              target="_blank"
              rel="noreferrer noopener"
              className="w-16 h-16 rounded-xl bg-white/90 border border-white/10 flex items-center justify-center overflow-hidden shrink-0 hover:border-cyan-400/50 transition-colors"
            >
              {m.logoUrl ? (
                <img
                  src={m.logoUrl}
                  alt={m.name}
                  referrerPolicy="no-referrer"
                  className="max-h-full max-w-full object-contain p-1"
                />
              ) : (
                <span className="text-xs font-black text-slate-700">
                  {m.name.split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase()}
                </span>
              )}
            </a>
            <div className="min-w-0">
              <div className="text-sm font-bold text-white leading-tight">
                {m.name}
              </div>
              <p className="text-[11px] text-white/55 mt-1 line-clamp-2">
                {m.domain}
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                <a
                  href={m.website ?? "#"}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-accent hover:text-cyan-300 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  Website hội viên
                </a>
                <button
                  onClick={() => setSelected(m)}
                  className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-white/60 hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  <IdCard className="w-3 h-3" />
                  {lang === "vn" ? "Hồ sơ hội viên" : "Profile"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <MemberDetailDialog
        member={selected}
        lang={lang}
        onClose={() => setSelected(null)}
      />
    </>
  );
}

function JoinPortalCta() {
  const role = authService.getRole();
  const portalPath = role === "admin" || role === "editor" ? "/admin" : "/portal";
  return (
    <div className="card-surface card-surface-gold rounded-2xl p-6 mb-8 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
      <div>
        <h3 className="text-sm font-black uppercase tracking-wider text-white">
          Nộp hồ sơ gia nhập trực tuyến
        </h3>
        <p className="text-xs text-white/60 mt-1 max-w-md">
          Hướng dẫn thủ tục, biểu mẫu và quy định hội phí — hoàn tất đăng ký
          ngay trên Không gian số DTA.
        </p>
      </div>
      <Link
        to={portalPath}
        className="shrink-0 px-6 py-3 rounded-full text-xs font-bold text-primary-foreground flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all"
        style={{
          background: "var(--gradient-gold)",
          boxShadow: "var(--shadow-gold)",
        }}
      >
        <UserPlus className="w-4 h-4" />
        Bắt đầu hồ sơ
      </Link>
    </div>
  );
}

function CategoryPage() {
  const { lang } = useLang();
  const { topic: topicSlug, category: categorySlug } = Route.useParams();
  const search = Route.useSearch();
  const { data: topics } = useTopics();

  const topic = topics?.find((t) => t.slug === topicSlug);
  const category = topic?.categories.find((c) => c.slug === categorySlug);

  const { data: result, isLoading } = useArticles({
    topic: topicSlug,
    category: categorySlug,
    sort: search.sort,
    flag: search.flag,
    page: search.page,
    pageSize: 6,
  });

  if (!topic || !category) throw notFound();

  const flags = [...articleFlags];
  const categoryHasArticles = (result?.total ?? 0) > 0 || search.flag !== undefined;

  return (
    <div className="grid lg:grid-cols-12 gap-x-8 gap-y-14">
      <div className="lg:col-span-6">
        <nav className="text-[11px] text-white/50 mb-4">
          <Link to="/news" className="hover:text-cyan-300 transition-colors">
            {lang === "vn" ? "Trang chủ" : "Home"}
          </Link>
          <span className="mx-1.5">/</span>
          <Link
            to="/news/$topic"
            params={{ topic: topic.slug }}
            className="hover:text-cyan-300 transition-colors"
          >
            {topicShort(topic, lang)}
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-white/80">{categoryName(category, lang)}</span>
        </nav>

        <h1 className="display text-2xl md:text-3xl font-black text-white tracking-tight mb-2">
          {categoryName(category, lang)}
        </h1>
        <p className="text-xs md:text-sm text-white/55 leading-relaxed max-w-2xl mb-8">
          {categoryDesc(category, lang)}
        </p>

        {categorySlug === "gia-nhap" && <JoinPortalCta />}
        {categorySlug === "noi-vong-tay-lon" && <PartnershipForm />}
        {categorySlug === "cong-dong" && <CommunityGrid lang={lang} />}

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : categoryHasArticles ? (
          <>
            <ArticleListControls
              topic={topic.slug}
              category={category.slug}
              search={search}
              total={result?.total ?? 0}
              flags={flags}
            />

            {(result?.items.length ?? 0) > 0 ? (
              <div className="divide-y divide-white/10">
                {result!.items.map((a) => (
                  <div key={a.id} className="relative">
                    <ArticleCard article={a} />
                    {a.pdfUrl && (
                      <a
                        href={a.pdfUrl}
                        download
                        className="absolute bottom-3 right-4 flex items-center gap-1 text-[10px] font-bold uppercase text-accent hover:text-cyan-300 transition-colors"
                      >
                        <Download className="w-3 h-3" />
                        {lang === "vn" ? "Tải PDF" : "PDF"}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-white/10 p-8 text-center text-xs text-white/45">
                {lang === "vn"
                  ? "Không có bài viết nào khớp bộ lọc."
                  : "No articles match the filter."}{" "}
                <Link
                  to="/news/$topic/$category"
                  params={{ topic: topic.slug, category: category.slug }}
                  search={{ ...search, flag: undefined, page: undefined }}
                  className="text-accent hover:text-cyan-300 font-bold transition-colors"
                >
                  {lang === "vn" ? "Bỏ lọc" : "Clear filter"}
                </Link>
              </div>
            )}

            <ArticlePagination
              topic={topic.slug}
              category={category.slug}
              search={search}
              page={result?.page ?? 1}
              pageCount={result?.pageCount ?? 1}
            />
          </>
        ) : (
          <div className="rounded-xl border border-dashed border-white/10 p-8 text-center text-xs text-white/45">
            {lang === "vn"
              ? "Chuyên mục đang chờ bài viết đầu tiên từ Ban Biên tập."
              : "This category is awaiting its first article."}
          </div>
        )}
      </div>

      <div className="lg:col-span-3">
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-4">
          {lang === "vn" ? "Trên trang chủ" : "On the homepage"}
        </h2>
        <HomeDigest />
      </div>

      <aside className="lg:col-span-3 space-y-6">
        <SidebarAds count={3} />
        <SidebarLogos />
      </aside>
    </div>
  );
}
