import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo } from "react";
import { ChevronRight, Newspaper } from "lucide-react";
import {
  topicBySlug,
  articlesByCategory,
  queryArticles,
  topicName,
  categoryName,
  categoryDesc,
} from "@/newsData";
import {
  ArticleCard,
  PortalSidebar,
  TopicPagination,
} from "@/compenents/news/PortalBlocks";
import { useLang } from "@/hooks/useLang";

/**
 * Main-topic page: one teaser section per sub-category (2–4 articles each,
 * per the brief), then a flat, PAGINATED list of every article in the topic
 * (?page= in the URL) so large topics stay browsable without opening each
 * category.
 */
export const Route = createFileRoute("/news/$topic/")({
  validateSearch: (search: Record<string, unknown>): { page?: number } => {
    const page = Number(search.page);
    return Number.isInteger(page) && page > 1 ? { page } : {};
  },
  loader: ({ params }) => {
    const topic = topicBySlug(params.topic);
    if (!topic) throw notFound();
    return { topic };
  },
  component: TopicPage,
});

function TopicPage() {
  const { lang } = useLang();
  const { topic } = Route.useLoaderData();
  const { page } = Route.useSearch();

  // Whole-topic flat list, newest first, paginated.
  const all = useMemo(
    () => queryArticles({ topic: topic.slug, page, pageSize: 8 }),
    [topic.slug, page],
  );

  return (
    <div className="grid lg:grid-cols-12 gap-x-10 gap-y-14">
      <div className="lg:col-span-9">
        <nav className="text-[11px] text-white/50 mb-4">
          <Link to="/news" className="hover:text-cyan-300 transition-colors">
            {lang === "vn" ? "Trang chủ" : "Home"}
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-white/80">{topicName(topic, lang)}</span>
        </nav>

        <h1 className="display text-2xl md:text-4xl font-black text-white uppercase tracking-tight mb-10">
          {topicName(topic, lang)}
        </h1>

        <div className="space-y-14">
          {topic.categories.map((c) => {
            const articles = articlesByCategory(topic.slug, c.slug);
            return (
              <section key={c.slug}>
                <Link
                  to="/news/$topic/$category"
                  params={{ topic: topic.slug, category: c.slug }}
                  className="group flex items-center justify-between border-b border-white/10 pb-2 mb-2"
                >
                  <h2 className="text-sm md:text-base font-black uppercase tracking-wide text-accent group-hover:text-cyan-300 transition-colors">
                    {categoryName(c, lang)}
                  </h2>
                  <ChevronRight className="w-4 h-4 text-accent group-hover:translate-x-1 transition-transform" />
                </Link>
                <p className="text-xs text-white/55 leading-relaxed mb-5 max-w-2xl">
                  {categoryDesc(c, lang)}
                </p>
                {articles.length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-5">
                    {articles.slice(0, 4).map((a) => (
                      <ArticleCard key={a.id} article={a} featured />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-white/10 p-6 text-center text-xs text-white/45">
                    {lang === "vn"
                      ? "Chuyên mục đang chờ bài viết đầu tiên từ Ban Biên tập."
                      : "This category is awaiting its first article."}
                  </div>
                )}
              </section>
            );
          })}
        </div>

        {/* Flat, paginated list of everything in the topic — the way to
            browse deep archives without opening each category. */}
        {all.total > 0 && (
          <section className="mt-14">
            <div className="flex items-baseline justify-between border-b-2 border-accent/60 pb-2 mb-5">
              <h2 className="flex items-center gap-2 text-sm md:text-base font-black uppercase tracking-wide text-white">
                <Newspaper className="w-4 h-4 text-accent" />
                {lang === "vn" ? "Tất cả bài viết" : "All articles"}
              </h2>
              <span className="text-[11px] text-white/45 font-mono">
                {all.total} {lang === "vn" ? "bài viết" : "articles"}
              </span>
            </div>
            <div className="space-y-5">
              {all.items.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
            <TopicPagination
              topic={topic.slug}
              page={all.page}
              pageCount={all.pageCount}
            />
          </section>
        )}
      </div>

      <div className="lg:col-span-3">
        <PortalSidebar />
      </div>
    </div>
  );
}
