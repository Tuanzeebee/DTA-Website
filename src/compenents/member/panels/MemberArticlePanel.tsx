import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Pencil,
  PlusCircle,
  ChevronLeft,
  Loader2,
} from "lucide-react";
import type { Lang } from "@/types";
import type { PortalArticle } from "@/newsData";
import { adminFetchArticles, type AdminArticleItem } from "@/lib/api";
import { loadArticleDetail, saveArticle } from "@/compenents/admin/adminStore";
import { ArticleEditor } from "@/compenents/admin/ArticleEditor";
import { useAuthSession } from "@/lib/auth/useAuth";

/**
 * "Bài viết của chúng tôi" — hội viên soạn bài bằng CÙNG trình soạn của admin
 * (khối chữ/ảnh/khung, nhập Word, xem trước đúng giao diện trang tin), ở chế
 * độ hội viên. Ban Thư ký duyệt ở /admin/duyet-bai rồi bài lên Hội viên › Tin
 * doanh nghiệp. Backend ép chuyên mục & trạng thái; hội viên chỉ thấy/sửa bài
 * của chính mình. Sửa bài đã đăng → bài gỡ xuống, chờ duyệt lại.
 */
export function MemberArticlePanel({ lang }: { lang: Lang }) {
  const session = useAuthSession();
  const [items, setItems] = useState<AdminArticleItem[]>([]);
  /** null = danh sách; "new" = viết mới; còn lại = bài đang sửa. */
  const [editing, setEditing] = useState<"new" | PortalArticle | null>(null);
  const [editingStatus, setEditingStatus] = useState<string>("");
  const [opening, setOpening] = useState<string | null>(null);

  const reload = () =>
    adminFetchArticles({ mine: true, pageSize: 50 })
      .then((res) => setItems(res.items))
      .catch(() => {});

  useEffect(() => {
    reload();
  }, []);

  const startEdit = async (a: AdminArticleItem) => {
    setOpening(a.id);
    const detail = await loadArticleDetail(a.id);
    setOpening(null);
    if (!detail) {
      toast.error(lang === "vn" ? "Không tải được bài viết." : "Could not load the post.");
      return;
    }
    setEditingStatus(a.status);
    setEditing(detail);
  };

  const save = async (article: PortalArticle) => {
    try {
      await saveArticle(article);
      setEditing(null);
      await reload();
      toast.success(
        lang === "vn"
          ? "Đã gửi bài! Ban Thư ký sẽ duyệt trước khi đăng lên Tin doanh nghiệp."
          : "Submitted! The Secretariat will review it before publishing.",
      );
    } catch (err: unknown) {
      // Bài chưa tới Ban Thư ký → báo rõ, giữ nguyên nội dung trong editor để gửi lại.
      const msg = err instanceof Error && err.message.trim() ? err.message : "";
      toast.error(
        msg.length > 320
          ? `${msg.slice(0, 320)}…`
          : msg ||
              (lang === "vn"
                ? "Gửi bài thất bại — vui lòng thử lại. Nội dung vẫn được giữ nguyên."
                : "Submission failed — please try again. Your content is kept."),
      );
    }
  };

  if (editing) {
    return (
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setEditing(null)}
            className="flex items-center gap-1 text-xs font-bold uppercase text-white/50 hover:text-white transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            {lang === "vn" ? "Bài đã gửi" : "My posts"}
          </button>
          <h4 className="display text-base font-black text-white">
            {editing === "new"
              ? lang === "vn"
                ? "Viết bài mới"
                : "New post"
              : lang === "vn"
                ? "Sửa bài viết"
                : "Edit post"}
          </h4>
        </div>
        {editing !== "new" && editingStatus === "PUBLISHED" && (
          <p className="rounded-xl border border-amber-400/25 bg-amber-500/10 p-3 text-xs text-amber-200">
            {lang === "vn"
              ? "Bài này đang hiển thị trên trang tin. Gửi bản sửa sẽ gỡ bài xuống để Ban Thư ký duyệt lại."
              : "This post is live. Submitting changes takes it down until the Secretariat re-approves it."}
          </p>
        )}
        <ArticleEditor
          key={editing === "new" ? "new" : editing.id}
          initial={editing === "new" ? undefined : editing}
          member
          defaultAuthor={session?.name || (lang === "vn" ? "Đơn vị của bạn" : "Your organization")}
          onSave={save}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3 pb-4 border-b border-white/8">
        <span className="w-9 h-9 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center">
          <FileText className="w-4 h-4 text-cyan-300" />
        </span>
        <div className="flex-1 min-w-0">
          <h4 className="display text-base font-black text-white">
            {lang === "vn" ? "Bài viết của chúng tôi" : "Our Articles"}
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            {lang === "vn"
              ? "Bài gửi lên chuyên mục Hội viên › Tin doanh nghiệp và chỉ hiển thị sau khi Ban Thư ký duyệt."
              : "Posts go to Members › Business News and appear only after the Secretariat approves them."}
          </p>
        </div>
        <button
          onClick={() => setEditing("new")}
          className="px-5 h-10 rounded-xl font-bold text-sm text-primary-foreground hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
          style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
        >
          <PlusCircle className="w-4 h-4" />
          {lang === "vn" ? "Viết bài mới" : "New post"}
        </button>
      </div>

      <div className="space-y-3">
        <h5 className="text-xs font-black uppercase text-muted-foreground tracking-[0.18em]">
          {lang === "vn" ? "Bài đã gửi" : "Submitted posts"}
        </h5>
        {items.length === 0 && (
          <p className="text-xs text-white/40 rounded-2xl border border-dashed border-white/10 p-6 text-center">
            {lang === "vn"
              ? "Chưa có bài nào — bấm \"Viết bài mới\" để giới thiệu đơn vị mình."
              : "No posts yet — click \"New post\" to introduce your organization."}
          </p>
        )}
        {items.map((a) => (
          <article key={a.id} className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
            <div className="flex justify-between items-start gap-3">
              <h6 className="text-sm font-extrabold text-white leading-snug">{a.title}</h6>
              <StatusBadge status={a.status} lang={lang} />
            </div>
            {a.summary && (
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{a.summary}</p>
            )}
            {a.status === "ARCHIVED" && a.reviewNote && (
              <p className="text-xs text-red-300 mt-2">
                {lang === "vn" ? "Lý do: " : "Reason: "}
                {a.reviewNote}
              </p>
            )}
            <div className="mt-3 flex gap-4 text-xs font-bold">
              <button
                onClick={() => startEdit(a)}
                disabled={opening === a.id}
                className="flex items-center gap-1 text-cyan-300 hover:text-white cursor-pointer disabled:opacity-60"
              >
                {opening === a.id ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Pencil className="w-3 h-3" />
                )}
                {lang === "vn" ? "Sửa" : "Edit"}
              </button>
              {a.status === "PUBLISHED" && (
                <Link to="/news/article/$slug" params={{ slug: a.slug }} className="text-white/60 hover:text-white">
                  {lang === "vn" ? "Xem trên trang tin" : "View on site"}
                </Link>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status, lang }: { status: string; lang: Lang }) {
  const [cls, Icon, vn, en] =
    status === "PUBLISHED"
      ? (["bg-emerald-500/15 text-emerald-300", CheckCircle2, "Đã đăng", "Published"] as const)
      : status === "ARCHIVED"
        ? (["bg-red-500/15 text-red-300", XCircle, "Bị từ chối", "Rejected"] as const)
        : (["bg-amber-500/15 text-amber-300", Clock, "Chờ duyệt", "Pending"] as const);
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider shrink-0 ${cls}`}
    >
      <Icon className="w-3 h-3" />
      {lang === "vn" ? vn : en}
    </span>
  );
}
