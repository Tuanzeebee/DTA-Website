import { useArticles } from "./useNewsApi";
import type { DtaNews, DtaEvent } from "@/data";

/**
 * item.date đã là dd/mm/yyyy (mapListItemToPortal) — không format lại: parse
 * lại bằng new Date("25/09/2026") ra NaN/NaN/NaN và đảo ngày/tháng khi ngày ≤ 12.
 *
 * Fetch latest news + events from the backend API and map them to the
 * DtaNews / DtaEvent format used by TimelineSection on the landing page.
 */
export function useTimelineData() {
  const { data: newsData, isLoading: newsLoading } = useArticles({
    sort: "latest",
    pageSize: 3,
  });

  const { data: eventData, isLoading: eventLoading } = useArticles({
    topic: "su-kien",
    sort: "latest",
    pageSize: 3,
  });

  const newsItems = newsData?.items ?? [];
  const eventItems = eventData?.items ?? [];

  const news: DtaNews[] = newsItems.map((item) => ({
    title: { vn: item.title, en: item.title },
    date: item.date,
    category: { vn: item.categoryName ?? "", en: item.categoryName ?? "" },
    summary: { vn: item.summary ?? "", en: item.summary ?? "" },
    image: item.image ?? "",
  }));

  const events: DtaEvent[] = eventItems.map((item) => {
    const summary = item.summary ?? "";
    // Extract time/location from summary if present
    const timeMatch = summary.match(/(\d{1,2}[:h]\d{2}(?:\s*[-–]\s*\d{1,2}[:h]\d{2})?)/);
    const locationMatch = summary.match(/(?:địa\s*điểm|dia\s*diem|[đd]\/c)[:\s]+(.+?)(?:\s*[,.]|$)/i);
    return {
      title: { vn: item.title, en: item.title },
      date: item.date,
      time: timeMatch?.[1] ?? "",
      location: {
        vn: locationMatch?.[1]?.trim() ?? summary.slice(0, 80),
        en: locationMatch?.[1]?.trim() ?? summary.slice(0, 80),
      },
      status: { vn: "Sắp diễn ra", en: "Upcoming" },
      image: item.image ?? "",
    };
  });

  const newsSlugs = newsItems.map((i) => i.id);
  const eventSlugs = eventItems.map((i) => i.id);

  return { news, events, newsSlugs, eventSlugs, newsLoading, eventLoading };
}
