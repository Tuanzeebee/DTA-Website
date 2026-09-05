import { useArticles } from "./useNewsApi";
import type { DtaNews, DtaEvent } from "@/data";

/** Format ISO date string to dd/mm/yyyy. */
function fmtDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

/**
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
    date: fmtDate(item.date),
    category: { vn: item.categoryName, en: item.categoryName },
    summary: { vn: item.summary ?? "", en: item.summary ?? "" },
    image: item.image ?? "",
  }));

  const events: DtaEvent[] = eventItems.map((item) => {
    const summary = item.summary ?? "";
    // Extract time/location from summary if present
    const timeMatch = summary.match(/(\d{1,2}[:h]\d{2}(?:\s*[-–]\s*\d{1,2}[:h]\d{2})?)/);
    const locationMatch = summary.match(/(?:dia\s*diem|dia diem|d\/c?)[:\s]+(.+?)(?:\s*[,.]|$)/i);
    return {
      title: { vn: item.title, en: item.title },
      date: fmtDate(item.date),
      time: timeMatch?.[1] ?? "",
      location: {
        vn: locationMatch?.[1]?.trim() ?? summary.slice(0, 80),
        en: locationMatch?.[1]?.trim() ?? summary.slice(0, 80),
      },
      status: { vn: "Sap dien ra", en: "Upcoming" },
      image: item.image ?? "",
    };
  });

  const newsSlugs = newsItems.map((i) => i.id);
  const eventSlugs = eventItems.map((i) => i.id);

  return { news, events, newsSlugs, eventSlugs, newsLoading, eventLoading };
}
