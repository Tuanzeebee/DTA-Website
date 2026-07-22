import { useMemo, useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Clock, Flame, Download, ExternalLink, BadgeCheck } from "lucide-react";
import { membersData } from "@/data";
import {
  latestArticles,
  mostReadArticles,
  boardMembers,
  type PortalArticle,
} from "@/newsData";

/** Shared building blocks for every portal page. */

export function ArticleCard({
  article,
  featured = false,
}: {
  article: PortalArticle;
  featured?: boolean;
}) {
  return (
    <Link
      to="/news/article/$id"
      params={{ id: article.id }}
      className="group block"
    >
      <article
        className={`card-surface rounded-2xl overflow-hidden ${
          featured ? "" : "flex gap-4"
        }`}
      >
        <div
          className={
            featured
              ? "aspect-[16/9] overflow-hidden"
              : "w-28 md:w-36 shrink-0 overflow-hidden"
          }
        >
          <img
            src={article.image}
            alt=""
            loading="lazy"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className={featured ? "p-5" : "py-3.5 pr-4 flex-1 min-w-0"}>
          <div className="flex items-center gap-2 flex-wrap mb-2">
            {article.isIntern && (
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 text-[9px] font-black uppercase tracking-wider">
                Thực tập sinh
              </span>
            )}
            {article.pdfUrl && (
              <span className="px-2 py-0.5 rounded-md bg-accent/15 text-accent text-[9px] font-black uppercase tracking-wider">
                Có văn bản PDF
              </span>
            )}
            <span className="text-[10px] text-white/45 font-mono">
              {article.date}
            </span>
          </div>
          <h3
            className={`font-bold text-white leading-snug group-hover:text-cyan-300 transition-colors ${
              featured ? "text-base md:text-lg" : "text-[13.5px] line-clamp-2"
            }`}
          >
            {article.title}
          </h3>
          {featured && (
            <p className="mt-2.5 text-xs text-white/60 leading-relaxed line-clamp-2">
              {article.summary}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}

/**
 * Column 3, repeated on every portal page per the brief:
 * latest + most-read + ad banner + member logos.
 */
export function PortalSidebar() {
  return (
    <aside className="space-y-6">
      <section className="card-surface rounded-2xl p-4">
        <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-accent mb-3">
          <Clock className="w-3.5 h-3.5" /> Tin mới
        </h4>
        <ul className="divide-y divide-white/5">
          {latestArticles(5).map((a) => (
            <li key={a.id}>
              <Link
                to="/news/article/$id"
                params={{ id: a.id }}
                className="block py-2.5 text-[12.5px] text-white/85 hover:text-cyan-300 leading-snug transition-colors line-clamp-2"
              >
                {a.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="card-surface rounded-2xl p-4">
        <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-accent mb-3">
          <Flame className="w-3.5 h-3.5" /> Đọc nhiều
        </h4>
        <ol className="space-y-3">
          {mostReadArticles(5).map((a, i) => (
            <li key={a.id} className="flex gap-2.5 items-start">
              <span className="display text-lg font-black text-gradient-cyan leading-none w-5 shrink-0">
                {i + 1}
              </span>
              <Link
                to="/news/article/$id"
                params={{ id: a.id }}
                className="text-[12.5px] text-white/85 hover:text-cyan-300 leading-snug transition-colors line-clamp-2"
              >
                {a.title}
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* Ad slot */}
      <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.03] h-40 flex items-center justify-center text-white/40 text-[10px] uppercase tracking-[0.2em]">
        Quảng cáo
      </div>
    </aside>
  );
}

/** Fisher-Yates; runs only client-side after mount so the render is stable. */
function useShuffled<T>(items: readonly T[]) {
  const [list, setList] = useState<readonly T[]>(items);
  useEffect(() => {
    const a = [...items];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    setList(a);
  }, [items]);
  return list;
}

/**
 * Member logo strip. Order is shuffled on every load so each logo gets equal
 * odds of the first slot (an explicit fairness requirement in the brief),
 * and every logo links out to the member's site.
 */
export function MemberLogoGrid({ compact = false }: { compact?: boolean }) {
  const orgs = useMemo(
    () => membersData.filter((m) => m.type === "organization"),
    [],
  );
  const shuffled = useShuffled(orgs);

  return (
    <div
      className={
        compact
          ? "grid grid-cols-4 gap-2"
          : "flex flex-wrap items-center justify-center gap-3 md:gap-4"
      }
    >
      {shuffled.map((m) => (
        <a
          key={m.id}
          href={m.website ?? "#"}
          target="_blank"
          rel="noreferrer noopener"
          title={m.name.vn}
          className={`${
            compact ? "h-12" : "h-14 md:h-16 w-28 md:w-32"
          } rounded-xl bg-white/90 border border-white/10 flex items-center justify-center overflow-hidden hover:scale-105 hover:border-cyan-400/50 transition-all`}
        >
          {m.logoUrl ? (
            <img
              src={m.logoUrl}
              alt={m.name.vn}
              referrerPolicy="no-referrer"
              className="max-h-full max-w-full object-contain p-1.5"
            />
          ) : (
            <span className="text-[11px] font-black text-slate-700">
              {m.logoInitials}
            </span>
          )}
        </a>
      ))}
    </div>
  );
}

/** BCH – Ban Kiểm tra, photo + name + title, sits directly above the footer. */
export function BoardSection() {
  const groups = [
    { key: "bch" as const, label: "Ban Chấp hành" },
    { key: "kiem-tra" as const, label: "Ban Kiểm tra" },
  ];
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 mt-16">
      <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-white mb-6">
        <BadgeCheck className="w-4 h-4 text-accent" />
        Ban Chấp hành – Ban Kiểm tra
      </h3>
      <div className="space-y-8">
        {groups.map((g) => (
          <div key={g.key}>
            <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/50 mb-3">
              {g.label}
            </div>
            <div className="flex flex-wrap gap-4">
              {boardMembers
                .filter((b) => b.board === g.key)
                .map((b) => (
                  <figure
                    key={b.name}
                    className="card-surface rounded-2xl p-3 w-[150px] text-center"
                  >
                    <img
                      src={b.photo}
                      alt={b.name}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-full object-cover mx-auto border border-white/15"
                    />
                    <figcaption className="mt-2">
                      <div className="text-[12px] font-bold text-white leading-tight">
                        {b.name}
                      </div>
                      <div className="text-[10px] text-accent mt-0.5">
                        {b.role}
                      </div>
                    </figcaption>
                  </figure>
                ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Row with a PDF download action — mandatory for the policy library. */
export function ArticleActions({ article }: { article: PortalArticle }) {
  if (!article.pdfUrl && !article.memberUrl) return null;
  return (
    <div className="flex flex-wrap gap-3 mt-6">
      {article.pdfUrl && (
        <a
          href={article.pdfUrl}
          download
          className="px-5 py-2.5 rounded-full text-xs font-bold text-primary-foreground flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all"
          style={{
            background: "var(--gradient-primary)",
            boxShadow: "var(--shadow-glow)",
          }}
        >
          <Download className="w-4 h-4" />
          Tải văn bản (PDF)
        </a>
      )}
      {article.memberUrl && (
        <a
          href={article.memberUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="px-5 py-2.5 rounded-full text-xs font-bold text-white border border-white/15 bg-white/[0.04] flex items-center gap-2 hover:bg-white/10 active:scale-95 transition-all"
        >
          <ExternalLink className="w-4 h-4" />
          Xem tại website hội viên
        </a>
      )}
    </div>
  );
}
