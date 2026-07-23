import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect } from "react";
import { Eye, Tag, Newspaper } from "lucide-react";
import {
  portalArticles,
  topicBySlug,
  categoryBySlug,
  type ArticleBlock,
  type ArticleImage,
} from "@/newsData";
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

/**
 * Article body renderer — Word-style layout options. `body` is a block list
 * the editor arranges freely:
 *  - string           -> paragraph
 *  - { box }          -> highlight box between paragraphs
 *  - { src, align, wrap, width } -> image; wrap "square" floats it so text
 *    flows around (Word: Square), wrap "none" puts it on its own line
 *    (Word: Top and Bottom) anchored left/right/center at the chosen width.
 * flow-root contains the floats so the author line and actions below never
 * wrap around a trailing image.
 */
function ArticleBody({ body }: { body: ArticleBlock[] }) {
  return (
    /* Full column width — the right edge of text and centred images lines
       up exactly with the lead image above (no narrower 70ch column). */
    <div className="mt-6 flow-root text-sm text-white/75 leading-relaxed">
      {body.map((block, i) => {
        if (typeof block === "string") {
          return (
            <p key={i} className="mb-4">
              {block}
            </p>
          );
        }

        if ("box" in block) {
          return (
            <aside
              key={i}
              className="clear-both my-6 rounded-xl border-l-2 border-accent/60 bg-white/[0.04] px-5 py-4 text-[13.5px] font-medium text-white/85 leading-relaxed"
            >
              {block.box}
            </aside>
          );
        }

        // Word defaults: left/right wraps text (Square), center is own-line.
        const wrap =
          block.wrap ?? (block.align === "center" ? "none" : "square");
        const width = block.width ?? (wrap === "square" ? 46 : 100);
        const style = { width: `${width}%` };

        if (wrap === "square" && block.align !== "center") {
          // Text flows around the image.
          const float =
            block.align === "left"
              ? "float-left mr-5 mb-3 mt-1"
              : "float-right ml-5 mb-3 mt-1";
          return (
            <figure
              key={i}
              style={style}
              className={`${float} min-w-[180px] max-w-full`}
            >
              <ArticleImageBox block={block} />
            </figure>
          );
        }

        // Own line (Top and Bottom), anchored by align at the chosen width.
        const anchor =
          block.align === "left"
            ? "mr-auto"
            : block.align === "right"
              ? "ml-auto"
              : "mx-auto";
        return (
          <figure
            key={i}
            style={style}
            className={`clear-both my-6 ${anchor} min-w-[220px] max-w-full`}
          >
            <ArticleImageBox block={block} />
          </figure>
        );
      })}
    </div>
  );
}

/** Image + caption, shared by every image placement. */
function ArticleImageBox({ block }: { block: ArticleImage }) {
  return (
    <>
      <div className="rounded-xl overflow-hidden border border-white/10">
        <img
          src={block.src}
          alt={block.caption ?? ""}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="w-full object-cover"
        />
      </div>
      {block.caption && (
        <figcaption className="mt-1.5 text-[10px] font-semibold text-white/50 leading-snug">
          {block.caption}
        </figcaption>
      )}
    </>
  );
}

function ArticlePage() {
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
                  {article.views.toLocaleString("vi-VN")} lượt đọc
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
          <span className="text-white/50 font-normal">Tác giả: </span>
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
