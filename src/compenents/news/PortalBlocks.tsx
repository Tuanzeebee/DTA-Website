import { useMemo, useState, useEffect } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Clock,
  Flame,
  Download,
  ExternalLink,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  X,
  Newspaper,
  Share2,
  Link as LinkIcon,
  Printer,
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import { useSavedArticles } from "@/hooks/useSavedArticles";
import { membersData } from "@/data";
import {
  latestArticles,
  mostReadArticles,
  relatedArticles,
  articlesByTopic,
  mainTopics,
  boardMembers,
  articleSorts,
  articleSortLabels,
  articleFlagLabels,
  DEFAULT_SORT,
  type PortalArticle,
  type ArticleSort,
  type ArticleFlag,
} from "@/newsData";

/** URL-borne list state for a category page (?sort=&flag=&page=).
 *  Defaults are OMITTED from the URL, so plain links stay clean. */
export interface ArticleListSearch {
  sort?: ArticleSort;
  flag?: ArticleFlag;
  page?: number;
}

/** Shared building blocks for every portal page. */

export function ArticleCard({
  article,
  featured = false,
}: {
  article: PortalArticle;
  featured?: boolean;
}) {
  return (
    <Link
      to="/news/article/$id"
      params={{ id: article.id }}
      className="group block"
    >
      <article
        className={`card-surface rounded-2xl overflow-hidden ${
          featured ? "" : "flex gap-4"
        }`}
      >
        <div
          className={
            featured
              ? "aspect-[16/9] overflow-hidden"
              : "w-28 md:w-36 shrink-0 overflow-hidden"
          }
        >
          <img
            src={article.image}
            alt=""
            loading="lazy"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className={featured ? "p-5" : "py-3.5 pr-4 flex-1 min-w-0"}>
          <div className="flex items-center gap-2 flex-wrap mb-2">
            {article.isIntern && (
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 text-[9px] font-black uppercase tracking-wider">
                Thực tập sinh
              </span>
            )}
            {article.pdfUrl && (
              <span className="px-2 py-0.5 rounded-md bg-accent/15 text-accent text-[9px] font-black uppercase tracking-wider">
                Có văn bản PDF
              </span>
            )}
            <span className="text-[10px] text-white/45 font-mono">
              {article.date}
            </span>
          </div>
          <h3
            className={`font-bold text-white leading-snug group-hover:text-cyan-300 transition-colors ${
              featured ? "text-base md:text-lg" : "text-[13.5px] line-clamp-2"
            }`}
          >
            {article.title}
          </h3>
          {featured && (
            <p className="mt-2.5 text-xs text-white/60 leading-relaxed line-clamp-2">
              {article.summary}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}

/**
 * Sort + facet-filter toolbar for a category list. All state is URL search
 * params on /news/$topic/$category, so every control is a real <Link>:
 * shareable, back-button friendly, crawlable. Changing sort or filter drops
 * `page` (a new ordering invalidates the old page number).
 */
export function ArticleListControls({
  topic,
  category,
  search,
  total,
  flags,
}: {
  topic: string;
  category: string;
  search: ArticleListSearch;
  total: number;
  /** Flags with >=1 match in this category — zero-result chips are hidden. */
  flags: ArticleFlag[];
}) {
  const sort = search.sort ?? DEFAULT_SORT;

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-3 mb-6">
      {/* Segmented sort control */}
      <div
        role="group"
        aria-label="Sắp xếp bài viết"
        className="flex rounded-full border border-white/10 bg-white/[0.03] p-0.5"
      >
        {articleSorts.map((s) => (
          <Link
            key={s}
            to="/news/$topic/$category"
            params={{ topic, category }}
            search={{
              ...search,
              sort: s === DEFAULT_SORT ? undefined : s,
              page: undefined,
            }}
            aria-current={sort === s ? "true" : undefined}
            className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold transition-colors ${
              sort === s
                ? "bg-accent/15 text-accent"
                : "text-white/55 hover:text-white"
            }`}
          >
            {articleSortLabels[s]}
          </Link>
        ))}
      </div>

      {/* Facet chips — toggle on/off */}
      {flags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {flags.map((f) => {
            const active = search.flag === f;
            return (
              <Link
                key={f}
                to="/news/$topic/$category"
                params={{ topic, category }}
                search={{
                  ...search,
                  flag: active ? undefined : f,
                  page: undefined,
                }}
                aria-pressed={active}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-colors ${
                  active
                    ? "border-accent/50 bg-accent/15 text-accent"
                    : "border-white/10 bg-white/[0.03] text-white/55 hover:text-white hover:border-white/25"
                }`}
              >
                {articleFlagLabels[f]}
                {active && <X className="w-3 h-3" />}
              </Link>
            );
          })}
        </div>
      )}

      <span className="ml-auto text-[11px] text-white/45 font-mono">
        {total} bài viết
      </span>
    </div>
  );
}

/** 1 … 4 [5] 6 … 12 — first, last and the current neighbourhood, with
 *  ellipsis for the gaps. */
function pageItems(page: number, count: number): (number | "gap")[] {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1);
  const keep = new Set([1, count, page - 1, page, page + 1]);
  const out: (number | "gap")[] = [];
  for (let p = 1; p <= count; p++) {
    if (keep.has(p)) out.push(p);
    else if (out[out.length - 1] !== "gap") out.push("gap");
  }
  return out;
}

const PAGE_ARROW =
  "w-9 h-9 rounded-xl border border-white/10 bg-white/[0.03] flex items-center justify-center text-white/60 hover:text-white hover:border-white/25 transition-colors";
const PAGE_NUM =
  "min-w-9 h-9 px-2 rounded-xl border text-xs font-bold flex items-center justify-center transition-colors";
const PAGE_NUM_ACTIVE = "border-accent/50 bg-accent/15 text-accent";
const PAGE_NUM_IDLE =
  "border-white/10 bg-white/[0.03] text-white/60 hover:text-white hover:border-white/25";

/** Category-page pagination (?sort/&flag preserved across pages). */
export function ArticlePagination({
  topic,
  category,
  search,
  page,
  pageCount,
}: {
  topic: string;
  category: string;
  search: ArticleListSearch;
  page: number;
  pageCount: number;
}) {
  if (pageCount <= 1) return null;

  const pageLink = (p: number) => ({
    to: "/news/$topic/$category" as const,
    params: { topic, category },
    // page 1 is the default — keep it out of the URL.
    search: { ...search, page: p === 1 ? undefined : p },
  });
  const jumpTop = () => window.scrollTo({ top: 0 });

  return (
    <nav
      aria-label="Phân trang"
      className="mt-10 flex items-center justify-center gap-1.5"
    >
      {page > 1 && (
        <Link
          {...pageLink(page - 1)}
          onClick={jumpTop}
          aria-label="Trang trước"
          className={PAGE_ARROW}
        >
          <ChevronLeft className="w-4 h-4" />
        </Link>
      )}

      {pageItems(page, pageCount).map((p, i) =>
        p === "gap" ? (
          <span
            key={`gap-${i}`}
            aria-hidden
            className="w-6 text-center text-white/35 text-xs select-none"
          >
            …
          </span>
        ) : (
          <Link
            key={p}
            {...pageLink(p)}
            onClick={jumpTop}
            aria-current={p === page ? "page" : undefined}
            className={`${PAGE_NUM} ${p === page ? PAGE_NUM_ACTIVE : PAGE_NUM_IDLE}`}
          >
            {p}
          </Link>
        ),
      )}

      {page < pageCount && (
        <Link
          {...pageLink(page + 1)}
          onClick={jumpTop}
          aria-label="Trang sau"
          className={PAGE_ARROW}
        >
          <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </nav>
  );
}

/** Topic-page pagination — same look, links stay on /news/$topic with a
 *  bare ?page= param. */
export function TopicPagination({
  topic,
  page,
  pageCount,
}: {
  topic: string;
  page: number;
  pageCount: number;
}) {
  if (pageCount <= 1) return null;

  const pageLink = (p: number) => ({
    to: "/news/$topic" as const,
    params: { topic },
    search: p === 1 ? {} : { page: p },
  });
  const jumpTop = () => window.scrollTo({ top: 0 });

  return (
    <nav
      aria-label="Phân trang"
      className="mt-10 flex items-center justify-center gap-1.5"
    >
      {page > 1 && (
        <Link
          {...pageLink(page - 1)}
          onClick={jumpTop}
          aria-label="Trang trước"
          className={PAGE_ARROW}
        >
          <ChevronLeft className="w-4 h-4" />
        </Link>
      )}

      {pageItems(page, pageCount).map((p, i) =>
        p === "gap" ? (
          <span
            key={`gap-${i}`}
            aria-hidden
            className="w-6 text-center text-white/35 text-xs select-none"
          >
            …
          </span>
        ) : (
          <Link
            key={p}
            {...pageLink(p)}
            onClick={jumpTop}
            aria-current={p === page ? "page" : undefined}
            className={`${PAGE_NUM} ${p === page ? PAGE_NUM_ACTIVE : PAGE_NUM_IDLE}`}
          >
            {p}
          </Link>
        ),
      )}

      {page < pageCount && (
        <Link
          {...pageLink(page + 1)}
          onClick={jumpTop}
          aria-label="Trang sau"
          className={PAGE_ARROW}
        >
          <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </nav>
  );
}

/* ------------------------------------------------------------------ *
 * Column-3 building blocks. The brief prescribes a DIFFERENT rail per
 * page type (topic: news + logos; category: 3 ads + logos; article:
 * 3 ads + same-category + association + logos), so each block is
 * exported separately and pages compose them in the mandated order.
 * ------------------------------------------------------------------ */

/** 5 latest — "tin-bài mới đăng, số lượng 5" per the brief. Thumbnail-first
 *  rows so the rail scans visually, not just by title. */
export function SidebarLatest() {
  return (
    <section className="card-surface rounded-2xl p-4">
      <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-accent mb-3">
        <Clock className="w-3.5 h-3.5" /> Tin mới
      </h4>
      <ul className="divide-y divide-white/5">
        {latestArticles(5).map((a) => (
          <li key={a.id}>
            <Link
              to="/news/article/$id"
              params={{ id: a.id }}
              className="group flex gap-3 py-2.5"
            >
              <div className="w-24 h-16 shrink-0 rounded-lg overflow-hidden border border-white/10">
                <img
                  src={a.image}
                  alt=""
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="min-w-0">
                <span className="block text-[12.5px] text-white/85 group-hover:text-cyan-300 leading-snug transition-colors line-clamp-3">
                  {a.title}
                </span>
                <span className="block mt-1 text-[10px] text-white/40 font-mono">
                  {a.date}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function SidebarMostRead() {
  return (
    <section className="card-surface rounded-2xl p-4">
      <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-accent mb-3">
        <Flame className="w-3.5 h-3.5" /> Đọc nhiều
      </h4>
      <ol className="divide-y divide-white/5">
        {mostReadArticles(5).map((a, i) => (
          <li key={a.id}>
            <Link
              to="/news/article/$id"
              params={{ id: a.id }}
              className="group flex gap-3 py-2.5"
            >
              {/* Rank badge rides the thumbnail's corner to keep row width. */}
              <div className="relative w-24 h-16 shrink-0 rounded-lg overflow-hidden border border-white/10">
                <img
                  src={a.image}
                  alt=""
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-0 left-0 px-1.5 py-0.5 rounded-br-lg bg-black/70 display text-sm font-black text-gradient-cyan leading-none">
                  {i + 1}
                </span>
              </div>
              <div className="min-w-0">
                <span className="block text-[12.5px] text-white/85 group-hover:text-cyan-300 leading-snug transition-colors line-clamp-3">
                  {a.title}
                </span>
                <span className="block mt-1 text-[10px] text-white/40 font-mono">
                  {a.views.toLocaleString("vi-VN")} lượt đọc
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** Ad banners — the brief pins 3 stacked banners atop the rail on
 *  category and article pages. */
export function SidebarAds({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-dashed border-white/15 bg-white/[0.03] h-28 flex items-center justify-center text-white/40 text-[10px] uppercase tracking-[0.2em]"
        >
          Quảng cáo {count > 1 ? i + 1 : ""}
        </div>
      ))}
    </div>
  );
}

/** "Lặp lại như trang chủ: Logo hội viên" — member logos on every rail. */
export function SidebarLogos() {
  return (
    <section className="card-surface rounded-2xl p-4">
      <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-accent mb-3">
        <BadgeCheck className="w-3.5 h-3.5" /> Hội viên DTA
      </h4>
      <MemberLogoGrid compact />
    </section>
  );
}

/** Association card — the article-page rail repeats "Hiệp hội" above the
 *  member logos. */
export function SidebarAssociation() {
  return (
    <section className="card-surface card-surface-gold rounded-2xl p-4">
      <h4 className="text-xs font-black uppercase tracking-wider text-white mb-1.5">
        Hiệp hội Công nghệ số Đà Nẵng
      </h4>
      <p className="text-[11px] text-white/60 leading-relaxed">
        Mái nhà chung của cộng đồng doanh nghiệp công nghệ số thành phố — hợp
        tác, liên kết, phát triển bền vững.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-1 mt-2.5 text-[10px] font-bold uppercase text-accent hover:text-cyan-300 transition-colors"
      >
        <ExternalLink className="w-3 h-3" />
        Trang giới thiệu Hiệp hội
      </Link>
    </section>
  );
}

/** 5 articles from the same category — article-page rail, with a thumbnail
 *  per row so the list scans faster than titles alone. */
export function SidebarSameCategory({ article }: { article: PortalArticle }) {
  const related = relatedArticles(article, 5);
  if (related.length === 0) return null;
  return (
    <section className="card-surface rounded-2xl p-4">
      <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-accent mb-3">
        <Newspaper className="w-3.5 h-3.5" /> Cùng chuyên mục
      </h4>
      <ul className="divide-y divide-white/5">
        {related.map((a) => (
          <li key={a.id}>
            <Link
              to="/news/article/$id"
              params={{ id: a.id }}
              className="group flex gap-2.5 py-2.5"
            >
              <div className="w-16 h-11 shrink-0 rounded-lg overflow-hidden border border-white/10">
                <img
                  src={a.image}
                  alt=""
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="min-w-0">
                <span className="block text-[12.5px] text-white/85 group-hover:text-cyan-300 leading-snug transition-colors line-clamp-2">
                  {a.title}
                </span>
                <span className="block mt-0.5 text-[10px] text-white/40 font-mono">
                  {a.date}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * Default rail for the portal home and topic pages, per the brief:
 * 5 latest (+ most-read) then the member logos, exactly like the homepage.
 */
export function PortalSidebar() {
  return (
    <aside className="space-y-6">
      <SidebarLatest />
      <SidebarMostRead />
      <SidebarAds count={1} />
      <SidebarLogos />
    </aside>
  );
}

/**
 * Compact repeat of the homepage for the category page's COLUMN 2 —
 * "Cột 2: Lặp lại nội dung của trang chủ". Each main topic: header link
 * plus its newest headlines, text-only so the column stays narrow.
 */
export function HomeDigest() {
  return (
    <div className="space-y-8">
      {mainTopics.map((t) => {
        const heads = articlesByTopic(t.slug).slice(0, 3);
        return (
          <section key={t.slug}>
            <Link
              to="/news/$topic"
              params={{ topic: t.slug }}
              className="block border-b-2 border-accent/60 pb-1.5 mb-2.5 text-[11px] font-black uppercase tracking-wide text-white hover:text-cyan-300 transition-colors"
            >
              {t.name}
            </Link>
            <ul className="divide-y divide-white/5">
              {heads.map((a) => (
                <li key={a.id}>
                  <Link
                    to="/news/article/$id"
                    params={{ id: a.id }}
                    className="block py-2 text-[12.5px] text-white/80 hover:text-cyan-300 leading-snug transition-colors line-clamp-2"
                  >
                    {a.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

/**
 * Reader utility menu — mandated both directly under the article header
 * AND repeated at the end of the body, so readers never scroll back up
 * to act on the article. Full utility set per the brief: back, share,
 * copy link, save ("lưu"), print.
 */
export function ReaderUtilityBar({
  title,
  articleId,
}: {
  title: string;
  articleId: string;
}) {
  const router = useRouter();
  const { isSaved, toggle } = useSavedArticles();
  const saved = isSaved(articleId);

  const save = () => {
    toggle(articleId);
    toast.success(
      saved ? "Đã bỏ lưu bài viết." : "Đã lưu bài viết — xem lại ở mục Đã lưu.",
    );
  };

  const share = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title, url }).catch(() => {});
    } else {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        "_blank",
        "noopener",
      );
    }
  };
  const copy = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => toast.success("Đã sao chép liên kết bài viết."))
      .catch(() => toast.error("Không sao chép được liên kết."));
  };

  const btn =
    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-white/10 bg-white/[0.03] text-white/65 hover:text-white hover:border-white/25 transition-colors cursor-pointer";

  return (
    <div className="flex flex-wrap items-center gap-2 border-y border-white/10 py-2.5">
      <span className="text-[10px] uppercase tracking-wider text-white/40 font-bold mr-1">
        Tiện ích
      </span>
      <button onClick={() => router.history.back()} className={btn}>
        <ArrowLeft className="w-3 h-3" /> Quay lại
      </button>
      <button onClick={share} className={btn}>
        <Share2 className="w-3 h-3" /> Chia sẻ
      </button>
      <button onClick={copy} className={btn}>
        <LinkIcon className="w-3 h-3" /> Sao chép link
      </button>
      <button
        onClick={save}
        aria-pressed={saved}
        className={
          saved
            ? "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-accent/50 bg-accent/15 text-accent transition-colors cursor-pointer"
            : btn
        }
      >
        {saved ? (
          <>
            <BookmarkCheck className="w-3 h-3" /> Đã lưu
          </>
        ) : (
          <>
            <Bookmark className="w-3 h-3" /> Lưu bài
          </>
        )}
      </button>
      <button onClick={() => window.print()} className={btn}>
        <Printer className="w-3 h-3" /> In bài
      </button>
    </div>
  );
}

/** Fisher-Yates; runs only client-side after mount so the render is stable. */
function useShuffled<T>(items: readonly T[]) {
  const [list, setList] = useState<readonly T[]>(items);
  useEffect(() => {
    const a = [...items];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    setList(a);
  }, [items]);
  return list;
}

/**
 * Member logo strip. Order is shuffled on every load so each logo gets equal
 * odds of the first slot (an explicit fairness requirement in the brief),
 * and every logo links out to the member's site.
 */
export function MemberLogoGrid({ compact = false }: { compact?: boolean }) {
  const orgs = useMemo(
    () => membersData.filter((m) => m.type === "organization"),
    [],
  );
  const shuffled = useShuffled(orgs);

  return (
    <div
      className={
        compact
          ? "grid grid-cols-4 gap-2"
          : "flex flex-wrap items-center justify-center gap-3 md:gap-4"
      }
    >
      {shuffled.map((m) => (
        <a
          key={m.id}
          href={m.website ?? "#"}
          target="_blank"
          rel="noreferrer noopener"
          title={m.name.vn}
          className={`${
            compact ? "h-12" : "h-14 md:h-16 w-28 md:w-32"
          } rounded-xl bg-white/90 border border-white/10 flex items-center justify-center overflow-hidden hover:scale-105 hover:border-cyan-400/50 transition-all`}
        >
          {m.logoUrl ? (
            <img
              src={m.logoUrl}
              alt={m.name.vn}
              referrerPolicy="no-referrer"
              className="max-h-full max-w-full object-contain p-1.5"
            />
          ) : (
            <span className="text-[11px] font-black text-slate-700">
              {m.logoInitials}
            </span>
          )}
        </a>
      ))}
    </div>
  );
}

/** BCH – Ban Kiểm tra, photo + name + title, sits directly above the footer. */
export function BoardSection() {
  const groups = [
    { key: "bch" as const, label: "Ban Chấp hành" },
    { key: "kiem-tra" as const, label: "Ban Kiểm tra" },
  ];
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 mt-16">
      <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-white mb-6">
        <BadgeCheck className="w-4 h-4 text-accent" />
        Ban Chấp hành – Ban Kiểm tra
      </h3>
      <div className="space-y-8">
        {groups.map((g) => (
          <div key={g.key}>
            <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/50 mb-3">
              {g.label}
            </div>
            <div className="flex flex-wrap gap-4">
              {boardMembers
                .filter((b) => b.board === g.key)
                .map((b) => (
                  <figure
                    key={b.name}
                    className="card-surface rounded-2xl p-3 w-[150px] text-center"
                  >
                    <img
                      src={b.photo}
                      alt={b.name}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-full object-cover mx-auto border border-white/15"
                    />
                    <figcaption className="mt-2">
                      <div className="text-[12px] font-bold text-white leading-tight">
                        {b.name}
                      </div>
                      <div className="text-[10px] text-accent mt-0.5">
                        {b.role}
                      </div>
                    </figcaption>
                  </figure>
                ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Row with a PDF download action — mandatory for the policy library. */
export function ArticleActions({ article }: { article: PortalArticle }) {
  if (!article.pdfUrl && !article.memberUrl) return null;
  return (
    <div className="flex flex-wrap gap-3 mt-6">
      {article.pdfUrl && (
        <a
          href={article.pdfUrl}
          download
          className="px-5 py-2.5 rounded-full text-xs font-bold text-primary-foreground flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all"
          style={{
            background: "var(--gradient-primary)",
            boxShadow: "var(--shadow-glow)",
          }}
        >
          <Download className="w-4 h-4" />
          Tải văn bản (PDF)
        </a>
      )}
      {article.memberUrl && (
        <a
          href={article.memberUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="px-5 py-2.5 rounded-full text-xs font-bold text-white border border-white/15 bg-white/[0.04] flex items-center gap-2 hover:bg-white/10 active:scale-95 transition-all"
        >
          <ExternalLink className="w-4 h-4" />
          Xem tại website hội viên
        </a>
      )}
    </div>
  );
}
