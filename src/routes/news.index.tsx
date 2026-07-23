import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import {
  mainTopics,
  articlesByTopic,
  topicName,
  type MainTopic,
} from "@/newsData";
import { ArticleCard, PortalSidebar } from "@/compenents/news/PortalBlocks";
import { useLang } from "@/hooks/useLang";

/**
 * Portal homepage: three horizontal columns, per the brief
 * (reference layout: vietnamdaily.trithuccuocsong.vn).
 *   col 1 — Sự kiện + Nguồn nhân lực Digi-Tech
 *   col 2 — Mái nhà chung DTA + Đà Nẵng 24h
 *   col 3 — member/association priority rail (latest, most read, ads, logos)
 */
export const Route = createFileRoute("/news/")({
  component: PortalHome,
});

function TopicBlock({ topic }: { topic: MainTopic }) {
  const { lang } = useLang();
  const articles = articlesByTopic(topic.slug);
  const [featured, ...rest] = articles;

  return (
    <section>
      <Link
        to="/news/$topic"
        params={{ topic: topic.slug }}
        className="group flex items-center justify-between border-b-2 border-accent/60 pb-2.5 mb-5"
      >
        <h2 className="display text-base md:text-lg font-black uppercase tracking-wide text-white group-hover:text-cyan-300 transition-colors">
          {topicName(topic, lang)}
        </h2>
        <span className="flex items-center gap-0.5 text-[10px] font-bold uppercase text-accent">
          {lang === "vn" ? "Xem tất cả" : "View all"}
          <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </span>
      </Link>
      <div className="space-y-5">
        {featured && <ArticleCard article={featured} featured />}
        {rest.slice(0, 3).map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>
    </section>
  );
}

function PortalHome() {
  const [suKien, digiTech, maiNhaChung, daNang24h] = mainTopics;

  return (
    <div className="grid lg:grid-cols-12 gap-x-10 gap-y-14">
      {/* Column 1 */}
      <div className="lg:col-span-4 space-y-14">
        <TopicBlock topic={suKien} />
        <TopicBlock topic={digiTech} />
      </div>

      {/* Column 2 */}
      <div className="lg:col-span-5 space-y-14">
        <TopicBlock topic={maiNhaChung} />
        <TopicBlock topic={daNang24h} />
      </div>

      {/* Column 3 */}
      <div className="lg:col-span-3">
        <PortalSidebar />
      </div>
    </div>
  );
}
