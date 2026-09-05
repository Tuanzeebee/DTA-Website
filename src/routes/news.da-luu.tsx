import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { BookmarkX, Bookmark } from "lucide-react";
import { toast } from "sonner";
import { useSavedArticles } from "@/hooks/useSavedArticles";
import { useArticleDetail } from "@/hooks/useNewsApi";
import {
  SidebarAds,
  SidebarLogos,
} from "@/compenents/news/PortalBlocks";
import { useLang } from "@/hooks/useLang";

export const Route = createFileRoute("/news/da-luu")({
  component: SavedPage,
});

function SavedArticleCard({ slug }: { slug: string }) {
  const { lang } = useLang();
  const { saved, toggle } = useSavedArticles();
  const { data: article, isLoading } = useArticleDetail(slug);

  if (isLoading) {
    return <div className="h-20 bg-white/5 rounded-xl animate-pulse" />;
  }

  if (!article) return null;

  return (
    <div className="relative group flex gap-4 py-4">
      <Link
        to="/news/article/$slug"
        params={{ slug: article.id }}
        className="flex gap-4 flex-1 min-w-0"
      >
        <div className="w-28 md:w-36 shrink-0 overflow-hidden rounded-xl border border-white/10">
          <img
            src={article.image}
            alt=""
            loading="lazy"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0 self-center">
          <h3 className="text-sm font-bold text-white leading-snug line-clamp-2">
            {article.title}
          </h3>
          <p className="text-[11px] text-white/55 mt-1 line-clamp-1">
            {article.summary}
          </p>
        </div>
      </Link>
      <button
        onClick={() => {
          toggle(slug);
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
  );
}

function SavedPage() {
  const { lang } = useLang();
  const { saved } = useSavedArticles();
  const slugs = useMemo(() => [...saved].reverse(), [saved]);

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
            : "Saved on this browser — press 'Save' in any article's utility bar to add it here."}
        </p>

        {slugs.length > 0 ? (
          <div className="space-y-5">
            {slugs.map((slug) => (
              <SavedArticleCard key={slug} slug={slug} />
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
