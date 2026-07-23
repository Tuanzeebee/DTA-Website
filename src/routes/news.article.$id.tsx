import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Eye, Tag } from "lucide-react";
import { portalArticles, topicBySlug, categoryBySlug } from "@/newsData";
import {
  ArticleActions,
  ReaderUtilityBar,
  SidebarAds,
  SidebarSameCategory,
  SidebarAssociation,
  SidebarLogos,
} from "@/compenents/news/PortalBlocks";

/** Single-article page — the third of the three mandated layout types. */
export const Route = createFileRoute("/news/article/$id")({
  loader: ({ params }) => {
    const article = portalArticles.find((a) => a.id === params.id);
    if (!article) throw notFound();
    const topic = topicBySlug(article.topic);
    const category = categoryBySlug(article.topic, article.category);
    return { article, topic, category };
  },
  component: ArticlePage,
});

function ArticlePage() {
  const { article, topic, category } = Route.useLoaderData();

  return (
    <div className="grid lg:grid-cols-12 gap-x-10 gap-y-14">
      <article className="lg:col-span-9">
        <nav className="text-[11px] text-white/50 mb-4">
          <Link to="/news" className="hover:text-cyan-300 transition-colors">
            Trang chủ
          </Link>
          {topic && (
            <>
              <span className="mx-1.5">/</span>
              <Link
                to="/news/$topic"
                params={{ topic: topic.slug }}
                className="hover:text-cyan-300 transition-colors"
              >
                {topic.short}
              </Link>
            </>
          )}
          {topic && category && (
            <>
              <span className="mx-1.5">/</span>
              <Link
                to="/news/$topic/$category"
                params={{ topic: topic.slug, category: category.slug }}
                className="hover:text-cyan-300 transition-colors"
              >
                {category.name}
              </Link>
            </>
          )}
        </nav>

        <h1 className="display text-2xl md:text-4xl font-black text-white leading-[1.2] tracking-tight">
          {article.title}
        </h1>

        <div className="flex items-center flex-wrap gap-x-4 gap-y-2 mt-4 text-[11px] text-white/50">
          <span className="font-mono">{article.date}</span>
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {article.views.toLocaleString("vi-VN")} lượt đọc
          </span>
          {article.tags.map((t) => (
            <span
              key={t}
              className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-white/70"
            >
              <Tag className="w-2.5 h-2.5" />
              {t}
            </span>
          ))}
        </div>

        {/* Reader utility menu, directly under the header block — and
            repeated after the body, per the brief. */}
        <div className="mt-5">
          <ReaderUtilityBar title={article.title} />
        </div>

        <p className="mt-5 text-sm md:text-base text-white/85 font-medium leading-relaxed border-l-2 border-accent/60 pl-4">
          {article.summary}
        </p>

        <div className="mt-6 rounded-2xl overflow-hidden border border-white/10">
          <img
            src={article.image}
            alt=""
            referrerPolicy="no-referrer"
            className="w-full aspect-[16/9] object-cover"
          />
        </div>

        <div className="mt-6 space-y-4 text-sm text-white/75 leading-relaxed max-w-[70ch]">
          {article.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {/* Author, end of body, right-aligned per the brief. */}
        <p className="mt-6 max-w-[70ch] text-right text-sm text-white/85">
          <span className="text-white/50 font-normal">Tác giả: </span>
          <span className="font-bold">
            {article.author ?? "Ban Biên tập DTA"}
          </span>
        </p>

        <ArticleActions article={article} />

        {/* Utility menu repeated at the end of the article. */}
        <div className="mt-8">
          <ReaderUtilityBar title={article.title} />
        </div>
      </article>

      {/* Column 3, top-down order fixed by the brief: 3 ad banners ->
          5 same-category articles -> association -> member logos. */}
      <aside className="lg:col-span-3 space-y-6">
        <SidebarAds count={3} />
        <SidebarSameCategory article={article} />
        <SidebarAssociation />
        <SidebarLogos />
      </aside>
    </div>
  );
}
