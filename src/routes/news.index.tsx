import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import {
  mainTopics,
  latestArticles,
  articlesByTopic,
  topicName,
  type MainTopic,
} from "@/newsData";
import {
  ArticleCard,
  PortalSidebar,
  TopStories,
} from "@/compenents/news/PortalBlocks";
import { ScrollReveal } from "@/compenents/ScrollReveal";
import { useLang } from "@/hooks/useLang";

/**
 * Portal homepage. A "Tin tiêu điểm" splash (1 lead + 3 secondary, newest
 * across the whole portal) anchors the fold directly under the banner zone;
 * below it the brief's three horizontal columns
 * (reference layout: vietnamdaily.trithuccuocsong.vn):
 *   col 1 — Sự kiện + Nguồn nhân lực Digi-Tech
 *   col 2 — Mái nhà chung DTA + Đà Nẵng 24h
 *   col 3 — member/association priority rail (latest, most read, ads, logos)
 */
export const Route = createFileRoute("/news/")({
  component: PortalHome,
});

function TopicBlock({
  topic,
  exclude,
}: {
  topic: MainTopic;
  /** Stories already shown in the top splash — skipped here so the same
   *  headline never appears twice on one screen. Only honoured when the
   *  topic still has something left to show afterwards. */
  exclude?: ReadonlySet<string>;
}) {
  const { lang } = useLang();
  const all = articlesByTopic(topic.slug);
  const spare = all.filter((a) => !exclude?.has(a.id));
  const articles = spare.length >= 2 ? spare : all;
  const [featured, ...rest] = articles;

  return (
    <section>
      <Link
        to="/news/$topic"
        params={{ topic: topic.slug }}
        className="group flex items-center justify-between border-b-2 border-accent/60 pb-2.5 mb-2"
      >
        <span className="flex items-baseline gap-2 min-w-0">
          <h2 className="display text-base md:text-lg font-black uppercase tracking-wide text-white group-hover:text-cyan-300 transition-colors truncate">
            {topicName(topic, lang)}
          </h2>
          <span className="shrink-0 text-[10px] font-mono text-white/35">
            {all.length}
          </span>
        </span>
        <span className="flex items-center gap-0.5 text-[10px] font-bold uppercase text-accent shrink-0">
          {lang === "vn" ? "Xem tất cả" : "View all"}
          <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </span>
      </Link>
      {featured && (
        <div className="mt-5">
          <ArticleCard article={featured} featured />
        </div>
      )}
      <div className="divide-y divide-white/10">
        {rest.slice(0, 3).map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>
    </section>
  );
}

function PortalHome() {
  const [suKien, digiTech, maiNhaChung, daNang24h] = mainTopics;

  // The splash takes the 4 newest stories portal-wide; topic columns below
  // skip those ids (when they can afford to) to avoid duplicate headlines.
  const leads = latestArticles(4);
  const leadIds = new Set(leads.map((a) => a.id));

  return (
    <div className="space-y-16">
      <ScrollReveal distance={25}>
        <TopStories articles={leads} />
      </ScrollReveal>

      <div className="grid lg:grid-cols-12 gap-x-10 gap-y-14">
        {/* Column 1 */}
        <div className="lg:col-span-4 space-y-14">
          <ScrollReveal distance={25}>
            <TopicBlock topic={suKien} exclude={leadIds} />
          </ScrollReveal>
          <ScrollReveal distance={25}>
            <TopicBlock topic={digiTech} exclude={leadIds} />
          </ScrollReveal>
        </div>

        {/* Column 2 */}
        <div className="lg:col-span-5 space-y-14">
          <ScrollReveal distance={25}>
            <TopicBlock topic={maiNhaChung} exclude={leadIds} />
          </ScrollReveal>
          <ScrollReveal distance={25}>
            <TopicBlock topic={daNang24h} exclude={leadIds} />
          </ScrollReveal>
        </div>

        {/* Column 3 */}
        <div className="lg:col-span-3">
          <PortalSidebar />
        </div>
      </div>
    </div>
  );
}
