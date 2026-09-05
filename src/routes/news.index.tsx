import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { topicName, type MainTopic } from "@/newsData";
import { useTopics, useArticles } from "@/hooks/useNewsApi";
import {
  ArticleCard,
  PortalSidebar,
  TopStories,
} from "@/compenents/news/PortalBlocks";
import { ScrollReveal } from "@/compenents/ScrollReveal";
import { useLang } from "@/hooks/useLang";

export const Route = createFileRoute("/news/")({
  component: PortalHome,
});

function TopicBlock({
  topic,
  exclude,
}: {
  topic: MainTopic;
  exclude?: ReadonlySet<string>;
}) {
  const { lang } = useLang();
  const { data, isLoading } = useArticles({
    topic: topic.slug,
    pageSize: 4,
    sort: "moi-nhat",
  });
  const all = data?.items ?? [];
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
            {data?.total ?? 0}
          </span>
        </span>
        <span className="flex items-center gap-0.5 text-[10px] font-bold uppercase text-accent shrink-0">
          {lang === "vn" ? "Xem tất cả" : "View all"}
          <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </span>
      </Link>
      {isLoading ? (
        <div className="mt-5 space-y-4">
          <div className="aspect-[16/9] bg-white/5 rounded-2xl animate-pulse" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <>
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
        </>
      )}
    </section>
  );
}

function PortalHome() {
  const { data: topics } = useTopics();
  const { data: topData, isLoading: topLoading } = useArticles({
    sort: "moi-nhat",
    pageSize: 4,
  });

  const [suKien, digiTech, maiNhaChung, daNang24h] = topics ?? [];
  const leads = topData?.items ?? [];
  const leadIds = new Set(leads.map((a) => a.id));

  return (
    <div className="space-y-16">
      {topLoading ? (
        <div className="space-y-4">
          <div className="aspect-[21/9] bg-white/5 rounded-2xl animate-pulse" />
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      ) : (
        <ScrollReveal distance={25}>
          <TopStories articles={leads} />
        </ScrollReveal>
      )}

      <div className="grid lg:grid-cols-12 gap-x-10 gap-y-14">
        <div className="lg:col-span-4 space-y-14">
          {suKien && (
            <ScrollReveal distance={25}>
              <TopicBlock topic={suKien} exclude={leadIds} />
            </ScrollReveal>
          )}
          {digiTech && (
            <ScrollReveal distance={25}>
              <TopicBlock topic={digiTech} exclude={leadIds} />
            </ScrollReveal>
          )}
        </div>

        <div className="lg:col-span-5 space-y-14">
          {maiNhaChung && (
            <ScrollReveal distance={25}>
              <TopicBlock topic={maiNhaChung} exclude={leadIds} />
            </ScrollReveal>
          )}
          {daNang24h && (
            <ScrollReveal distance={25}>
              <TopicBlock topic={daNang24h} exclude={leadIds} />
            </ScrollReveal>
          )}
        </div>

        <div className="lg:col-span-3">
          <PortalSidebar />
        </div>
      </div>
    </div>
  );
}
