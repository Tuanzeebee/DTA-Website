import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Check, XCircle, Eye, EyeOff, Pencil, ExternalLink, Undo2 } from "lucide-react";
import {
  adminFetchArticles,
  adminPublishArticle,
  adminRejectArticle,
  adminUnpublishArticle,
  type AdminArticleItem,
} from "@/lib/api";
import { loadArticleDetail, PENDING_CHANGED } from "@/compenents/admin/adminStore";
import { ArticleBody } from "@/compenents/news/ArticleBody";
import type { ArticleBlock } from "@/newsData";
import { PageHeader, PRIMARY_BTN, PRIMARY_STYLE, GHOST_BTN, StatusChip } from "@/compenents/admin/ui";
import { RequireSection } from "@/compenents/admin/SectionGate";

/**
 * Hàng chờ duyệt bài hội viên gửi từ Không gian số (/portal). Bài luôn nằm ở
 * /hoi-vien/tin-doanh-nghiep; Duyệt = xuất bản, Từ chối = gỡ kèm lý do để
 * hội viên sửa & gửi lại. Hội viên sửa bài đã đăng thì bài quay về đây.
 */
export const Route = createFileRoute("/admin/duyet-bai")({
  component: () => (
    <RequireSection section="review">
      <AdminMemberReview />
    </RequireSection>
  ),
});

type Tab = "DRAFT" | "PUBLISHED" | "ARCHIVED";

const TABS: { value: Tab; label: string }[] = [
  { value: "DRAFT", label: "Chờ duyệt" },
  { value: "PUBLISHED", label: "Đã đăng" },
  { value: "ARCHIVED", label: "Từ chối" },
];

const fmt = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" }) : "";

function AdminMemberReview() {
  const [tab, setTab] = useState<Tab>("DRAFT");
  const [rows, setRows] = useState<AdminArticleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [preview, setPreview] = useState<{ id: string; body: ArticleBlock[] } | null>(null);

  const fetchRows = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminFetchArticles({ fromMembers: true, status: tab, pageSize: 100 });
      setRows(res.items);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Lỗi tải danh sách");
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  /** Chạy 1 thao tác duyệt rồi bỏ bài khỏi tab hiện tại. */
  const act = async (a: AdminArticleItem, run: () => Promise<unknown>, done: string) => {
    setBusyId(a.id);
    try {
      await run();
      setRows((prev) => prev.filter((x) => x.id !== a.id));
      window.dispatchEvent(new Event(PENDING_CHANGED));
      toast.success(done);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Thao tác thất bại");
    } finally {
      setBusyId(null);
    }
  };

  const approve = (a: AdminArticleItem) =>
    act(a, () => adminPublishArticle(a.id), `Đã duyệt & đăng "${a.title}".`);

  const reject = (a: AdminArticleItem) => {
    const note = window.prompt(
      `Từ chối bài "${a.title}".\nLý do (hội viên sẽ thấy để sửa & gửi lại):`,
    );
    if (note === null) return;
    act(a, () => adminRejectArticle(a.id, note), `Đã từ chối "${a.title}".`);
  };

  const unpublish = (a: AdminArticleItem) => {
    if (!window.confirm(`Gỡ bài "${a.title}" khỏi trang tin, đưa về hàng chờ duyệt?`)) return;
    act(a, () => adminUnpublishArticle(a.id), `Đã gỡ "${a.title}".`);
  };

  const togglePreview = async (a: AdminArticleItem) => {
    if (preview?.id === a.id) return setPreview(null);
    const detail = await loadArticleDetail(a.id);
    if (!detail) return toast.error("Không tải được nội dung bài.");
    setPreview({ id: a.id, body: detail.body });
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        title="Duyệt bài hội viên"
        desc="Bài hội viên gửi từ Không gian số, đăng vào Hội viên › Tin doanh nghiệp sau khi được duyệt. Hội viên sửa bài đã đăng thì bài tự gỡ xuống và quay lại hàng chờ."
      />

      <div className="flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => {
              setTab(t.value);
              setPreview(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              tab === t.value ? "bg-accent/15 text-accent" : "text-white/50 hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-white/40">Đang tải…</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-white/40 rounded-2xl border border-dashed border-white/10 p-8 text-center">
          {tab === "DRAFT" ? "Không có bài nào chờ duyệt." : "Chưa có bài nào."}
        </p>
      ) : (
        <ul className="space-y-3">
          {rows.map((a) => (
            <li key={a.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <div className="flex flex-wrap items-start gap-3">
                <div className="min-w-0 flex-1">
                  <h2 className="text-sm font-extrabold text-white leading-snug">{a.title}</h2>
                  <p className="mt-1 text-xs text-white/50">
                    {a.author ?? "Hội viên"} · gửi {fmt(a.createdAt)}
                    {a.updatedAt !== a.createdAt && ` · sửa ${fmt(a.updatedAt)}`}
                  </p>
                  {a.summary && (
                    <p className="mt-2 text-xs text-white/60 leading-relaxed">{a.summary}</p>
                  )}
                  {a.reviewNote && (
                    <p className="mt-2 text-xs text-red-300">Lý do từ chối: {a.reviewNote}</p>
                  )}
                </div>
                {tab === "DRAFT" && <StatusChip tone="amber">Chờ duyệt</StatusChip>}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button onClick={() => togglePreview(a)} className={GHOST_BTN}>
                  {preview?.id === a.id ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  {preview?.id === a.id ? "Ẩn nội dung" : "Xem nội dung"}
                </button>
                <Link to="/admin/bai-viet/$id" params={{ id: a.id }} className={GHOST_BTN}>
                  <Pencil className="w-3.5 h-3.5" />
                  Biên tập
                </Link>
                {tab === "PUBLISHED" ? (
                  <>
                    <Link to="/news/article/$slug" params={{ slug: a.slug }} target="_blank" className={GHOST_BTN}>
                      <ExternalLink className="w-3.5 h-3.5" />
                      Xem trên trang
                    </Link>
                    <button disabled={busyId === a.id} onClick={() => unpublish(a)} className={GHOST_BTN}>
                      <Undo2 className="w-3.5 h-3.5" />
                      Gỡ xuống
                    </button>
                  </>
                ) : (
                  <>
                    {tab === "DRAFT" && (
                      <button
                        disabled={busyId === a.id}
                        onClick={() => reject(a)}
                        className={`${GHOST_BTN} hover:text-red-300 hover:border-red-400/30`}
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Từ chối
                      </button>
                    )}
                    <button
                      disabled={busyId === a.id}
                      onClick={() => approve(a)}
                      className={`${PRIMARY_BTN} disabled:opacity-50`}
                      style={PRIMARY_STYLE}
                    >
                      <Check className="w-3.5 h-3.5" />
                      Duyệt & đăng
                    </button>
                  </>
                )}
              </div>

              {preview?.id === a.id && (
                <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-5">
                  <ArticleBody body={preview.body} />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

