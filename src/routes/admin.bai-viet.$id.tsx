import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";
import { allArticles } from "@/newsData";
import { saveArticle } from "@/compenents/admin/adminStore";
import { ArticleEditor } from "@/compenents/admin/ArticleEditor";

/** Editor page — $id is an article id, or "moi" for a fresh article. */
export const Route = createFileRoute("/admin/bai-viet/$id")({
  // Read the article at render time (not a loader cache): edits from this
  // very session must be visible when the editor re-opens.
  component: AdminArticleEditorPage,
});

function AdminArticleEditorPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();

  const isNew = id === "moi";
  const article = isNew ? undefined : allArticles().find((a) => a.id === id);

  if (!isNew && !article) {
    return (
      <div className="max-w-3xl">
        <p className="text-sm text-white/60">Không tìm thấy bài viết “{id}”.</p>
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
        // Remount when switching between articles so state resets cleanly.
        key={id}
        initial={article}
        onSave={(next, publish) => {
          saveArticle(next);
          toast.success(
            publish
              ? "Đã xuất bản — bài viết đang hiển thị trên trang tin."
              : "Đã lưu nháp.",
          );
          navigate({ to: "/admin/bai-viet" });
        }}
      />
    </div>
  );
}
