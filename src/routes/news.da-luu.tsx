import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { BookmarkX, Bookmark } from "lucide-react";
import { toast } from "sonner";
import { publishedArticles } from "@/newsData";
import { useSavedArticles } from "@/hooks/useSavedArticles";
import {
  ArticleCard,
  SidebarAds,
  SidebarLogos,
} from "@/compenents/news/PortalBlocks";
import { useLang } from "@/hooks/useLang";

/**
 * "Bài đã lưu" — the reader's bookmarks ("lưu" utility in the brief).
 * Backed by localStorage until real accounts exist; ids whose article no
 * longer exists are silently skipped.
 */
export const Route = createFileRoute("/news/da-luu")({
  component: SavedPage,
});

function SavedPage() {
  const { lang } = useLang();
  const { saved, toggle } = useSavedArticles();

  // Newest-saved first; drop stale ids that no longer resolve.
  const articles = useMemo(
    () =>
      [...saved]
        .reverse()
        .map((id) => publishedArticles().find((a) => a.id === id))
        .filter((a) => a !== undefined),
    [saved],
  );

  return (
    <div className="grid lg:grid-cols-12 gap-x-10 gap-y-14">
      <div className="lg:col-span-9">
        <nav className="text-[11px] text-white/50 mb-4">
          <Link to="/news" className="hover:text-cyan-300 transition-colors">
            {lang === "vn" ? "Trang chủ" : "Home"}
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-white/80">
            {lang === "vn" ? "Bài đã lưu" : "Saved articles"}
          </span>
        </nav>

        <h1 className="display text-2xl md:text-3xl font-black text-white tracking-tight mb-2">
          {lang === "vn" ? "Bài đã lưu" : "Saved articles"}
        </h1>
        <p className="text-xs md:text-sm text-white/55 leading-relaxed max-w-2xl mb-8">
          {lang === "vn"
            ? "Danh sách lưu trên trình duyệt này — bấm “Lưu bài” trong thanh tiện ích của bất kỳ bài viết nào để thêm vào đây."
            : "Saved on this browser — press “Save” in any article's utility bar to add it here."}
        </p>

        {articles.length > 0 ? (
          <div className="space-y-5">
            {articles.map((a) => (
              <div key={a.id} className="relative">
                <ArticleCard article={a} />
                <button
                  onClick={() => {
                    toggle(a.id);
                    toast.success(
                      lang === "vn"
                        ? "Đã bỏ lưu bài viết."
                        : "Removed from saved articles.",
                    );
                  }}
                  className="absolute bottom-3 right-4 flex items-center gap-1 text-[10px] font-bold uppercase text-white/45 hover:text-red-300 transition-colors cursor-pointer"
                >
                  <BookmarkX className="w-3 h-3" />
                  {lang === "vn" ? "Bỏ lưu" : "Unsave"}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-white/10 p-10 text-center text-xs text-white/45">
            <Bookmark className="w-6 h-6 mx-auto mb-3 text-white/25" />
            {lang === "vn"
              ? "Chưa có bài viết nào được lưu."
              : "No saved articles yet."}
            <div className="mt-3">
              <Link
                to="/news"
                className="text-accent hover:text-cyan-300 font-bold transition-colors"
              >
                {lang === "vn"
                  ? "Về trang chủ DTA News"
                  : "Back to DTA News home"}
              </Link>
            </div>
          </div>
        )}
      </div>

      <aside className="lg:col-span-3 space-y-6">
        <SidebarAds count={1} />
        <SidebarLogos />
      </aside>
    </div>
  );
}
