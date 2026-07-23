import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect } from "react";
import { Eye, Tag, Newspaper } from "lucide-react";
import {
  publishedArticles,
  topicBySlug,
  categoryBySlug,
  topicShort,
  categoryName,
} from "@/newsData";
import { ArticleBody } from "@/compenents/news/ArticleBody";
import { useLang } from "@/hooks/useLang";
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
    const article = publishedArticles().find((a) => a.id === params.id);
    if (!article) throw notFound();
    const topic = topicBySlug(article.topic);
    const category = categoryBySlug(article.topic, article.category);
    return { article, topic, category };
  },
  component: ArticlePage,
});

/**
 * Facebook-style author avatar: initials of the author's last two name
 * words on the brand gradient; the editorial default ("DTA News") gets the
 * newspaper mark instead of initials. No photo data yet — when the CMS
 * arrives this swaps to a real avatar image with the same slot.
 */
function AuthorAvatar({ author }: { author?: string }) {
  const initials = author
    ?.split(/\s+/)
    .filter(Boolean)
    .slice(-2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div
      aria-hidden
      className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-[13px] font-black text-primary-foreground border border-white/20"
      style={{ background: "var(--gradient-primary)" }}
    >
      {initials ?? <Newspaper className="w-4.5 h-4.5" />}
    </div>
  );
}

function ArticlePage() {
  const { lang } = useLang();
  const { article, topic, category } = Route.useLoaderData();

  /* Tab/history title follows the article (helps "Quay lại" and sharing).
     Proper OG tags for Zalo/FB previews need SSR — backend backlog. */
  useEffect(() => {
    const prev = document.title;
    document.title = `${article.title} | DTA News`;
    return () => {
      document.title = prev;
    };
  }, [article.title]);

  return (
    <div className="grid lg:grid-cols-12 gap-x-10 gap-y-14">
      <article className="lg:col-span-9">
        <nav className="text-[11px] text-white/50 mb-4">
          <Link to="/news" className="hover:text-cyan-300 transition-colors">
            {lang === "vn" ? "Trang chủ" : "Home"}
          </Link>
          {topic && (
            <>
              <span className="mx-1.5">/</span>
              <Link
                to="/news/$topic"
                params={{ topic: topic.slug }}
                className="hover:text-cyan-300 transition-colors"
              >
                {topicShort(topic, lang)}
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
                {categoryName(category, lang)}
              </Link>
            </>
          )}
        </nav>

        <h1 className="display text-2xl md:text-4xl font-black text-white leading-[1.2] tracking-tight">
          {article.title}
        </h1>

        {/* Byline, social-style: avatar + author name, with date + view
            count stacked under the name; topic tags trail on the right. */}
        <div className="flex items-center flex-wrap gap-x-4 gap-y-3 mt-5">
          <div className="flex items-center gap-3">
            <AuthorAvatar author={article.author} />
            <div>
              <div className="text-sm font-bold text-white leading-tight">
                {article.author ?? "DTA News"}
              </div>
              <div className="flex items-center gap-2 mt-0.5 text-[11px] text-white/50">
                <span className="font-mono">{article.date}</span>
                <span aria-hidden>·</span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {article.views.toLocaleString("vi-VN")}{" "}
                  {lang === "vn" ? "lượt đọc" : "reads"}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center flex-wrap gap-2 sm:ml-auto text-[11px] text-white/50">
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
        </div>

        {/* Reader utility menu, directly under the header block — and
            repeated after the body, per the brief. */}
        <div className="mt-5">
          <ReaderUtilityBar title={article.title} articleId={article.id} />
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

        <ArticleBody body={article.body} />

        {/* Author, end of body, right-aligned per the brief — same right
            edge as the lead image and body. */}
        <p className="mt-6 text-right text-sm text-white/85">
          <span className="text-white/50 font-normal">
            {lang === "vn" ? "Tác giả: " : "Author: "}
          </span>
          <span className="font-bold">
            {article.author ?? "Ban Biên tập DTA"}
          </span>
        </p>

        <ArticleActions article={article} />

        {/* Utility menu repeated at the end of the article. */}
        <div className="mt-8">
          <ReaderUtilityBar title={article.title} articleId={article.id} />
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
