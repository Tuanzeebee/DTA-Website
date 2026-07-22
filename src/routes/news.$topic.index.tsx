import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { topicBySlug, articlesByCategory } from "@/newsData";
import { ArticleCard, PortalSidebar } from "@/compenents/news/PortalBlocks";

/** Main-topic page: one section per sub-category, sidebar always present. */
export const Route = createFileRoute("/news/$topic/")({
  loader: ({ params }) => {
    const topic = topicBySlug(params.topic);
    if (!topic) throw notFound();
    return { topic };
  },
  component: TopicPage,
});

function TopicPage() {
  const { topic } = Route.useLoaderData();

  return (
    <div className="grid lg:grid-cols-12 gap-x-10 gap-y-14">
      <div className="lg:col-span-9">
        <nav className="text-[11px] text-white/50 mb-4">
          <Link to="/news" className="hover:text-cyan-300 transition-colors">
            Trang chủ
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-white/80">{topic.name}</span>
        </nav>

        <h1 className="display text-2xl md:text-4xl font-black text-white uppercase tracking-tight mb-10">
          {topic.name}
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
                    {c.name}
                  </h2>
                  <ChevronRight className="w-4 h-4 text-accent group-hover:translate-x-1 transition-transform" />
                </Link>
                <p className="text-xs text-white/55 leading-relaxed mb-5 max-w-2xl">
                  {c.desc}
                </p>
                {articles.length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-5">
                    {articles.slice(0, 4).map((a) => (
                      <ArticleCard key={a.id} article={a} featured />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-white/10 p-6 text-center text-xs text-white/45">
                    Chuyên mục đang chờ bài viết đầu tiên từ Ban Biên tập.
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>

      <div className="lg:col-span-3">
        <PortalSidebar />
      </div>
    </div>
  );
}
