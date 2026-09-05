import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { Eye, Tag, Newspaper } from "lucide-react";
import { topicShort, categoryName } from "@/newsData";
import { useArticleDetail, useTopics } from "@/hooks/useNewsApi";
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

export const Route = createFileRoute("/news/article/$slug")({
  component: ArticlePage,
});

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
  const { slug } = Route.useParams();
  const { data: topics } = useTopics();
  const { data: article, isLoading, isError } = useArticleDetail(slug);

  const topic = topics?.find((t) => t.slug === article?.topic);
  const category = topic?.categories.find(
    (c) => c.slug === article?.category,
  );

  useEffect(() => {
    if (article) {
      const prev = document.title;
      document.title = `${article.title} | DTA News`;
      return () => {
        document.title = prev;
      };
    }
  }, [article?.title]);

  if (isLoading) {
    return (
      <div className="grid lg:grid-cols-12 gap-x-10 gap-y-14">
        <article className="lg:col-span-9">
          <div className="animate-pulse space-y-4">
            <div className="h-3 w-48 bg-white/10 rounded" />
            <div className="h-8 w-3/4 bg-white/10 rounded" />
            <div className="h-4 w-64 bg-white/10 rounded" />
            <div className="aspect-[16/9] bg-white/10 rounded-2xl" />
            <div className="space-y-2">
              <div className="h-4 bg-white/10 rounded" />
              <div className="h-4 bg-white/10 rounded w-5/6" />
              <div className="h-4 bg-white/10 rounded w-4/5" />
            </div>
          </div>
        </article>
        <aside className="lg:col-span-3 space-y-6">
          <div className="h-32 bg-white/5 rounded-2xl animate-pulse" />
        </aside>
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-black text-white mb-4">
          {lang === "vn" ? "Không tìm thấy bài viết" : "Article not found"}
        </h1>
        <Link
          to="/news"
          className="text-accent hover:text-cyan-300 font-bold transition-colors"
        >
          {lang === "vn" ? "Về trang chủ" : "Back to home"}
        </Link>
      </div>
    );
  }

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
          {category && (
            <>
              <span className="mx-1.5">/</span>
              <Link
                to="/news/$topic/$category"
                params={{
                  topic: topic!.slug,
                  category: category.slug,
                }}
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

        <p className="mt-6 text-right text-sm text-white/85">
          <span className="text-white/50 font-normal">
            {lang === "vn" ? "Tác giả: " : "Author: "}
          </span>
          <span className="font-bold">
            {article.author ?? "Ban Biên tập DTA"}
          </span>
        </p>

        <ArticleActions article={article} />

        <div className="mt-8">
          <ReaderUtilityBar title={article.title} articleId={article.id} />
        </div>
      </article>

      <aside className="lg:col-span-3 space-y-6">
        <SidebarAds count={3} />
        <SidebarSameCategory article={article} />
        <SidebarAssociation />
        <SidebarLogos />
      </aside>
    </div>
  );
}
