import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronRight, Newspaper } from "lucide-react";
import { topicName, categoryName, categoryDesc } from "@/newsData";
import { useTopics, useArticles } from "@/hooks/useNewsApi";
import {
  ArticleCard,
  PortalSidebar,
  TopicPagination,
} from "@/compenents/news/PortalBlocks";
import { useLang } from "@/hooks/useLang";

export const Route = createFileRoute("/news/$topic/")({
  validateSearch: (search: Record<string, unknown>): { page?: number } => {
    const page = Number(search.page);
    return Number.isInteger(page) && page > 1 ? { page } : {};
  },
  component: TopicPage,
});

function CategoryTeaser({
  topicSlug,
  category,
}: {
  topicSlug: string;
  category: { slug: string; name: string; desc: string };
}) {
  const { lang } = useLang();
  const { data, isLoading } = useArticles({
    topic: topicSlug,
    category: category.slug,
    pageSize: 4,
  });
  const articles = data?.items ?? [];

  return (
    <section>
      <Link
        to="/news/$topic/$category"
        params={{ topic: topicSlug, category: category.slug }}
        className="group flex items-center justify-between border-b border-white/10 pb-2 mb-2"
      >
        <h2 className="text-sm md:text-base font-black uppercase tracking-wide text-accent group-hover:text-cyan-300 transition-colors">
          {category.name}
        </h2>
        <ChevronRight className="w-4 h-4 text-accent group-hover:translate-x-1 transition-transform" />
      </Link>
      <p className="text-xs text-white/55 leading-relaxed mb-5 max-w-2xl">
        {category.desc}
      </p>
      {isLoading ? (
        <div className="grid sm:grid-cols-2 gap-5">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="aspect-[16/9] bg-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : articles.length > 0 ? (
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
}

function TopicPage() {
  const { lang } = useLang();
  const { topic: topicSlug } = Route.useParams();
  const { page } = Route.useSearch();
  const { data: topics, isLoading: topicsLoading } = useTopics();
  const topic = topics?.find((t) => t.slug === topicSlug);

  const { data: allData, isLoading: articlesLoading } = useArticles({
    topic: topicSlug,
    page,
    pageSize: 8,
  });

  if (topicsLoading) {
    return (
      <div className="grid lg:grid-cols-12 gap-x-10 gap-y-14">
        <div className="lg:col-span-9">
          <div className="animate-pulse space-y-4">
            <div className="h-3 w-48 bg-white/10 rounded" />
            <div className="h-8 w-64 bg-white/10 rounded" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-40 bg-white/5 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!topic) throw notFound();

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
          {topic.categories.map((c) => (
            <CategoryTeaser
              key={c.slug}
              topicSlug={topic.slug}
              category={{
                slug: c.slug,
                name: categoryName(c, lang),
                desc: categoryDesc(c, lang),
              }}
            />
          ))}
        </div>

        {allData && allData.total > 0 && (
          <section className="mt-14">
            <div className="flex items-baseline justify-between border-b-2 border-accent/60 pb-2 mb-5">
              <h2 className="flex items-center gap-2 text-sm md:text-base font-black uppercase tracking-wide text-white">
                <Newspaper className="w-4 h-4 text-accent" />
                {lang === "vn" ? "Tất cả bài viết" : "All articles"}
              </h2>
              <span className="text-[11px] text-white/45 font-mono">
                {allData.total}{" "}
                {lang === "vn" ? "bài viết" : "articles"}
              </span>
            </div>
            <div className="divide-y divide-white/10">
              {allData.items.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
            <TopicPagination
              topic={topic.slug}
              page={allData.page}
              pageCount={allData.pageCount}
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
