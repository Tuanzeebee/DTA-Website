import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Download, Send, ExternalLink, UserPlus } from "lucide-react";
import { membersData } from "@/data";
import {
  topicBySlug,
  categoryBySlug,
  queryArticles,
  availableFlags,
  isArticleSort,
  isArticleFlag,
  DEFAULT_SORT,
} from "@/newsData";
import {
  ArticleCard,
  ArticleListControls,
  ArticlePagination,
  HomeDigest,
  SidebarAds,
  SidebarLogos,
  type ArticleListSearch,
} from "@/compenents/news/PortalBlocks";

/**
 * Category page. Most categories are a plain article list; a few carry the
 * extra functions the brief mandates:
 *  - tài nguyên – chính sách: per-article PDF download
 *  - cộng đồng: member logo + self-introduction grid
 *  - gia nhập: portal hand-off to /portal (application flow lives there)
 *  - nối vòng tay lớn: direct partnership-request form
 */
export const Route = createFileRoute("/news/$topic/$category")({
  /** List state lives in the URL. Unknown values are dropped (not errors)
   *  and defaults are normalised to `undefined` so canonical URLs stay
   *  clean: /news/a/b?sort=moi-nhat collapses to /news/a/b. */
  validateSearch: (search: Record<string, unknown>): ArticleListSearch => {
    const out: ArticleListSearch = {};
    if (isArticleSort(search.sort) && search.sort !== DEFAULT_SORT)
      out.sort = search.sort;
    if (isArticleFlag(search.flag)) out.flag = search.flag;
    const page = Number(search.page);
    if (Number.isInteger(page) && page > 1) out.page = page;
    return out;
  },
  loader: ({ params }) => {
    const topic = topicBySlug(params.topic);
    const category = categoryBySlug(params.topic, params.category);
    if (!topic || !category) throw notFound();
    return { topic, category };
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

function CommunityGrid() {
  return (
    <div className="grid sm:grid-cols-2 gap-5 mb-10">
      {membersData
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
                  alt={m.name.vn}
                  referrerPolicy="no-referrer"
                  className="max-h-full max-w-full object-contain p-1"
                />
              ) : (
                <span className="text-xs font-black text-slate-700">
                  {m.logoInitials}
                </span>
              )}
            </a>
            <div className="min-w-0">
              <div className="text-sm font-bold text-white leading-tight">
                {m.name.vn}
              </div>
              <p className="text-[11px] text-white/55 mt-1 line-clamp-2">
                {m.domain.vn}
              </p>
              <a
                href={m.website ?? "#"}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1 mt-2 text-[10px] font-bold uppercase text-accent hover:text-cyan-300 transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                Website hội viên
              </a>
            </div>
          </div>
        ))}
    </div>
  );
}

function JoinPortalCta() {
  return (
    <div className="card-surface card-surface-gold rounded-2xl p-6 mb-8 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
      <div>
        <h3 className="text-sm font-black uppercase tracking-wider text-white">
          Nộp hồ sơ gia nhập trực tuyến
        </h3>
        <p className="text-xs text-white/60 mt-1 max-w-md">
          Hướng dẫn thủ tục, biểu mẫu và quy định hội phí — hoàn tất đăng ký
          ngay trên Văn phòng số DTA.
        </p>
      </div>
      <Link
        to="/portal"
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
  const { topic, category } = Route.useLoaderData();
  const search = Route.useSearch();

  // Pure filter -> sort -> paginate over the in-memory dataset; memoised so
  // re-renders (forms, toasts) don't re-sort. With a backend this becomes a
  // loader/query fetch keyed on the same params.
  const result = useMemo(
    () =>
      queryArticles({
        topic: topic.slug,
        category: category.slug,
        ...search,
      }),
    [topic.slug, category.slug, search],
  );
  const flags = useMemo(
    () => availableFlags(topic.slug, category.slug),
    [topic.slug, category.slug],
  );
  // Distinguish "category is empty" from "the active filter matches nothing".
  const categoryHasArticles = result.total > 0 || search.flag !== undefined;

  /* Brief-mandated 3-column layout for a category page:
     col 1 — the category's own articles (list, filters, pagination)
     col 2 — compact repeat of the homepage
     col 3 — 3 ad banners on top, then the member logos */
  return (
    <div className="grid lg:grid-cols-12 gap-x-8 gap-y-14">
      <div className="lg:col-span-6">
        <nav className="text-[11px] text-white/50 mb-4">
          <Link to="/news" className="hover:text-cyan-300 transition-colors">
            Trang chủ
          </Link>
          <span className="mx-1.5">/</span>
          <Link
            to="/news/$topic"
            params={{ topic: topic.slug }}
            className="hover:text-cyan-300 transition-colors"
          >
            {topic.short}
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-white/80">{category.name}</span>
        </nav>

        <h1 className="display text-2xl md:text-3xl font-black text-white tracking-tight mb-2">
          {category.name}
        </h1>
        <p className="text-xs md:text-sm text-white/55 leading-relaxed max-w-2xl mb-8">
          {category.desc}
        </p>

        {category.slug === "gia-nhap" && <JoinPortalCta />}
        {category.slug === "noi-vong-tay-lon" && <PartnershipForm />}
        {category.slug === "cong-dong" && <CommunityGrid />}

        {categoryHasArticles ? (
          <>
            <ArticleListControls
              topic={topic.slug}
              category={category.slug}
              search={search}
              total={result.total}
              flags={flags}
            />

            {result.total > 0 ? (
              <div className="space-y-5">
                {result.items.map((a) => (
                  <div key={a.id} className="relative">
                    <ArticleCard article={a} />
                    {/* Policy library: download directly from the list. */}
                    {a.pdfUrl && (
                      <a
                        href={a.pdfUrl}
                        download
                        className="absolute bottom-3 right-4 flex items-center gap-1 text-[10px] font-bold uppercase text-accent hover:text-cyan-300 transition-colors"
                      >
                        <Download className="w-3 h-3" />
                        Tải PDF
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              /* Filter matched nothing — offer the way back out. */
              <div className="rounded-xl border border-dashed border-white/10 p-8 text-center text-xs text-white/45">
                Không có bài viết nào khớp bộ lọc.{" "}
                <Link
                  to="/news/$topic/$category"
                  params={{ topic: topic.slug, category: category.slug }}
                  search={{ ...search, flag: undefined, page: undefined }}
                  className="text-accent hover:text-cyan-300 font-bold transition-colors"
                >
                  Bỏ lọc
                </Link>
              </div>
            )}

            <ArticlePagination
              topic={topic.slug}
              category={category.slug}
              search={search}
              page={result.page}
              pageCount={result.pageCount}
            />
          </>
        ) : (
          <div className="rounded-xl border border-dashed border-white/10 p-8 text-center text-xs text-white/45">
            Chuyên mục đang chờ bài viết đầu tiên từ Ban Biên tập.
          </div>
        )}
      </div>

      {/* Column 2: homepage repeat. */}
      <div className="lg:col-span-3">
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-4">
          Trên trang chủ
        </h2>
        <HomeDigest />
      </div>

      {/* Column 3: ads then member logos, in that order per the brief. */}
      <aside className="lg:col-span-3 space-y-6">
        <SidebarAds count={3} />
        <SidebarLogos />
      </aside>
    </div>
  );
}
