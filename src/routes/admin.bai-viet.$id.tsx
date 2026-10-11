import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ChevronLeft, Loader2 } from "lucide-react";
import { saveArticle, loadArticleDetail } from "@/compenents/admin/adminStore";
import { ArticleEditor } from "@/compenents/admin/ArticleEditor";
import { RequireSection } from "@/compenents/admin/SectionGate";
import type { PortalArticle } from "@/newsData";

/** Editor page — $id is an article id, or "moi" for a fresh article. */
export const Route = createFileRoute("/admin/bai-viet/$id")({
  component: () => (
    <RequireSection section="articles">
      <AdminArticleEditorPage />
    </RequireSection>
  ),
});

function AdminArticleEditorPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const isNew = id === "moi";

  const [article, setArticle] = useState<PortalArticle | null>(null);
  const [fetching, setFetching] = useState(!isNew);
  const [fetchDone, setFetchDone] = useState(isNew);

  // Luôn tải chi tiết từ API: bản trong danh sách (useAdminArticles) chỉ là
  // tóm tắt với body: [] — dùng nó làm editor mở ra trống block.
  useEffect(() => {
    if (isNew) return;
    let alive = true;
    setFetching(true);
    setFetchDone(false);
    loadArticleDetail(id).then((detail) => {
      if (!alive) return;
      setArticle(detail);
      setFetching(false);
      setFetchDone(true);
    });
    return () => {
      alive = false;
    };
  }, [id, isNew]);

  if (!isNew && fetching) {
    return (
      <div className="max-w-3xl">
        <div className="flex items-center gap-3 mb-6">
          <Link
            to="/admin/bai-viet"
            className="flex items-center gap-1 text-[11px] font-bold uppercase text-white/50 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Bài viết
          </Link>
          <h1 className="text-xl font-black text-white">Sửa bài viết</h1>
        </div>
        <div className="flex items-center justify-center py-16 text-white/40 gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Đang tải bài viết...</span>
        </div>
      </div>
    );
  }

  if (!isNew && fetchDone && !article) {
    return (
      <div className="max-w-3xl">
        <p className="text-sm text-white/60">Không tìm thấy bài viết "{id}".</p>
        <Link
          to="/admin/bai-viet"
          className="inline-flex items-center gap-1.5 mt-4 text-[11px] font-bold uppercase text-accent hover:text-cyan-300 transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Về danh sách bài viết
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px]">
      <div className="flex items-center gap-3 mb-6">
        <Link
          to="/admin/bai-viet"
          className="flex items-center gap-1 text-[11px] font-bold uppercase text-white/50 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Bài viết
        </Link>
        <h1 className="text-xl font-black text-white">
          {isNew ? "Viết bài mới" : "Sửa bài viết"}
        </h1>
      </div>

      <ArticleEditor
        key={id}
        initial={article ?? undefined}
        onSave={async (next, publish) => {
          try {
            await saveArticle(next);
            toast.success(
              publish
                ? "Đã xuất bản — bài viết đang hiển thị trên trang tin."
                : "Đã lưu nháp.",
            );
            navigate({ to: "/admin/bai-viet" });
          } catch (err) {
            console.error("[admin/bai-viet] save failed:", err);
            const msg =
              err instanceof Error && err.message.trim()
                ? err.message
                : "Không thể lưu bài viết. Vui lòng thử lại.";
            // Rút gọn body JSON dài của API để toast đọc được
            const short = msg.length > 320 ? `${msg.slice(0, 320)}…` : msg;
            toast.error(short);
          }
        }}
      />
    </div>
  );
}
