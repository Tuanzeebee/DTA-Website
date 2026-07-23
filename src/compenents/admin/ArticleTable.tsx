import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Pencil,
  Trash2,
  Send,
  Undo2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { mainTopics, categoryBySlug, type PortalArticle } from "@/newsData";
import {
  useAdminArticles,
  saveArticle,
  deleteArticle,
  articleOrigin,
} from "@/compenents/admin/adminStore";

const PAGE_SIZE = 15;

/** 1 … 4 [5] 6 … 12 — first, last and the current neighbourhood. */
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

/** Article management table: search + topic filter, status/origin chips,
 *  edit / publish-toggle / delete per row, 15 rows per page. */
export function ArticleTable() {
  const articles = useAdminArticles();
  const [q, setQ] = useState("");
  const [topicFilter, setTopicFilter] = useState("");
  const [page, setPage] = useState(1);

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return articles.filter(
      (a) =>
        (topicFilter === "" || a.topic === topicFilter) &&
        (needle === "" || a.title.toLowerCase().includes(needle)),
    );
  }, [articles, q, topicFilter]);

  // Clamp instead of storing: filters shrinking the list (or a delete on
  // the last page) can never strand the table on an empty page.
  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const paged = rows.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const togglePublish = (a: PortalArticle) => {
    const publish = a.status === "draft";
    saveArticle({ ...a, status: publish ? "published" : "draft" });
    toast.success(
      publish ? "Đã xuất bản bài viết." : "Đã gỡ bài về trạng thái nháp.",
    );
  };

  const remove = (a: PortalArticle) => {
    if (!window.confirm(`Xóa bài “${a.title}”?`)) return;
    deleteArticle(a.id);
    toast.success("Đã xóa bài viết.");
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
          placeholder="Lọc theo tiêu đề…"
          className="w-64 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-400/60"
        />
        <select
          value={topicFilter}
          onChange={(e) => {
            setTopicFilter(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400/60"
        >
          <option value="">Tất cả chủ đề</option>
          {mainTopics.map((t) => (
            <option key={t.slug} value={t.slug}>
              {t.name}
            </option>
          ))}
        </select>
        <span className="ml-auto text-[11px] text-white/45 font-mono">
          {rows.length === 0
            ? "0 bài viết"
            : `${(current - 1) * PAGE_SIZE + 1}–${Math.min(
                current * PAGE_SIZE,
                rows.length,
              )} / ${rows.length} bài viết`}
        </span>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/10 overflow-x-auto">
        <table className="w-full text-left text-xs min-w-[760px]">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.03] text-[10px] uppercase tracking-wider text-white/50">
              <th className="px-4 py-3 font-bold">Bài viết</th>
              <th className="px-4 py-3 font-bold">Chuyên mục</th>
              <th className="px-4 py-3 font-bold">Ngày</th>
              <th className="px-4 py-3 font-bold">Lượt đọc</th>
              <th className="px-4 py-3 font-bold">Trạng thái</th>
              <th className="px-4 py-3 font-bold text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {paged.map((a) => {
              const draft = a.status === "draft";
              const origin = articleOrigin(a.id);
              return (
                <tr key={a.id} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={a.image}
                        alt=""
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="w-14 h-9 rounded-md object-cover border border-white/10 shrink-0"
                      />
                      <div className="min-w-0 max-w-[340px]">
                        <div className="font-bold text-white/90 truncate">
                          {a.title}
                        </div>
                        <div className="text-[10px] text-white/40 font-mono">
                          {a.id} · {origin === "mock" ? "dữ liệu mẫu" : "admin"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-white/70 whitespace-nowrap">
                    {categoryBySlug(a.topic, a.category)?.name ?? a.category}
                  </td>
                  <td className="px-4 py-3 text-white/60 font-mono whitespace-nowrap">
                    {a.date}
                  </td>
                  <td className="px-4 py-3 text-white/60 font-mono">
                    {a.views.toLocaleString("vi-VN")}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${
                        draft
                          ? "bg-amber-500/15 text-amber-300"
                          : "bg-emerald-500/15 text-emerald-300"
                      }`}
                    >
                      {draft ? "Nháp" : "Đã đăng"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      {!draft && (
                        <Link
                          to="/news/article/$id"
                          params={{ id: a.id }}
                          title="Xem trên trang tin"
                          className="p-1.5 rounded-lg border border-white/10 text-white/50 hover:text-cyan-300 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      )}
                      <Link
                        to="/admin/bai-viet/$id"
                        params={{ id: a.id }}
                        title="Sửa bài"
                        className="p-1.5 rounded-lg border border-white/10 text-white/50 hover:text-white transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => togglePublish(a)}
                        title={draft ? "Xuất bản" : "Gỡ về nháp"}
                        className="p-1.5 rounded-lg border border-white/10 text-white/50 hover:text-accent transition-colors cursor-pointer"
                      >
                        {draft ? (
                          <Send className="w-3.5 h-3.5" />
                        ) : (
                          <Undo2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => remove(a)}
                        title="Xóa bài"
                        className="p-1.5 rounded-lg border border-white/10 text-white/50 hover:text-red-300 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-white/45"
                >
                  Không có bài viết nào khớp bộ lọc.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination — buttons (not links): the page is local table state. */}
      {pageCount > 1 && (
        <nav
          aria-label="Phân trang bảng bài viết"
          className="flex items-center justify-center gap-1.5"
        >
          {current > 1 && (
            <button
              onClick={() => setPage(current - 1)}
              aria-label="Trang trước"
              className={PAGE_ARROW}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          {pageItems(current, pageCount).map((p, i) =>
            p === "gap" ? (
              <span
                key={`gap-${i}`}
                aria-hidden
                className="w-6 text-center text-white/35 text-xs select-none"
              >
                …
              </span>
            ) : (
              <button
                key={p}
                onClick={() => setPage(p)}
                aria-current={p === current ? "page" : undefined}
                className={`min-w-9 h-9 px-2 rounded-xl border text-xs font-bold flex items-center justify-center transition-colors cursor-pointer ${
                  p === current
                    ? "border-accent/50 bg-accent/15 text-accent"
                    : "border-white/10 bg-white/[0.03] text-white/60 hover:text-white hover:border-white/25"
                }`}
              >
                {p}
              </button>
            ),
          )}
          {current < pageCount && (
            <button
              onClick={() => setPage(current + 1)}
              aria-label="Trang sau"
              className={PAGE_ARROW}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </nav>
      )}
    </div>
  );
}

const PAGE_ARROW =
  "w-9 h-9 rounded-xl border border-white/10 bg-white/[0.03] flex items-center justify-center text-white/60 hover:text-white hover:border-white/25 transition-colors cursor-pointer";
