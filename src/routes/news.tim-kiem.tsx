import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { useArticles } from "@/hooks/useNewsApi";
import {
  ArticleCard,
  SidebarAds,
  SidebarLogos,
} from "@/compenents/news/PortalBlocks";
import { useLang } from "@/hooks/useLang";

export const Route = createFileRoute("/news/tim-kiem")({
  validateSearch: (search: Record<string, unknown>): { q?: string } => {
    const q = typeof search.q === "string" ? search.q.trim() : "";
    return q ? { q } : {};
  },
  component: SearchPage,
});

function SearchPage() {
  const { lang } = useLang();
  const { q } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [draft, setDraft] = useState(q ?? "");

  const { data: result, isLoading } = useArticles({
    q: q ?? undefined,
    pageSize: 20,
  });

  return (
    <div className="grid lg:grid-cols-12 gap-x-10 gap-y-14">
      <div className="lg:col-span-9">
        <nav className="text-[11px] text-white/50 mb-4">
          <Link to="/news" className="hover:text-cyan-300 transition-colors">
            {lang === "vn" ? "Trang chủ" : "Home"}
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-white/80">
            {lang === "vn" ? "Tìm kiếm" : "Search"}
          </span>
        </nav>

        <h1 className="display text-2xl md:text-3xl font-black text-white tracking-tight mb-6">
          {lang === "vn" ? "Tìm kiếm tin bài" : "Search articles"}
        </h1>

        <form
          role="search"
          className="flex items-center h-11 max-w-xl rounded-xl border border-white/10 bg-white/[0.04] focus-within:border-cyan-400/50 transition-colors mb-8"
          onSubmit={(e) => {
            e.preventDefault();
            const query = draft.trim();
            navigate({ search: query ? { q: query } : {} });
          }}
        >
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={
              lang === "vn"
                ? "Nhập từ khóa… (không cần gõ dấu)"
                : "Enter keywords…"
            }
            aria-label={lang === "vn" ? "Từ khóa tìm kiếm" : "Search keywords"}
            autoFocus
            className="flex-1 bg-transparent pl-4 pr-2 text-sm text-white placeholder:text-white/35 focus:outline-none"
          />
          <button
            type="submit"
            className="h-full px-4 text-white/60 hover:text-cyan-300 transition-colors cursor-pointer"
            aria-label="Tìm kiếm"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>

        {q ? (
          <>
            <p className="text-[11px] text-white/45 font-mono mb-6">
              {result?.total ?? 0}{" "}
              {lang === "vn" ? "kết quả cho" : "results for"} "{q}"
            </p>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (result?.items.length ?? 0) > 0 ? (
              <div className="space-y-5">
                {result!.items.map((a) => (
                  <ArticleCard key={a.id} article={a} />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-white/10 p-8 text-center text-xs text-white/45">
                {lang === "vn"
                  ? "Không tìm thấy bài viết nào khớp từ khóa. Thử từ khóa ngắn hơn hoặc kiểm tra chính tả."
                  : "No articles match those keywords. Try shorter terms or check the spelling."}
              </div>
            )}
          </>
        ) : (
          <div className="rounded-xl border border-dashed border-white/10 p-8 text-center text-xs text-white/45">
            {lang === "vn"
              ? "Nhập từ khóa để tìm trong toàn bộ tin bài của DTA News."
              : "Enter keywords to search all DTA News articles."}
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
