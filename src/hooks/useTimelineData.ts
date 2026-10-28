import { useArticles, useDigest } from "./useNewsApi";
import type { DtaNews, DtaEvent } from "@/data";
import { eventStatus } from "@/lib/eventStatus";

/** 3 Main Topic ở cột phải trang chủ, theo thứ tự hiển thị. */
const RIGHT_TOPICS = [
  { slug: "tin-trong-nganh", label: { vn: "Tin trong ngành", en: "Industry News" } },
  { slug: "su-kien", label: { vn: "Sự kiện", en: "Events" } },
  { slug: "dao-tao", label: { vn: "Đào tạo", en: "Training" } },
];

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
    // Lấy dư 9 bài để sau khi bỏ bài trùng với cột phải (tối đa 9) vẫn còn đủ 9.
    pageSize: 18,
  });

  const { data: digest, isLoading: eventLoading } = useDigest(
    RIGHT_TOPICS.map((t) => t.slug),
    3,
    true, // chỉ chuyên mục chính: bài DSA gắn nhiều chuyên mục sẽ không lặp giữa 3 khối
  );

  // Cột trái bỏ các bài đã hiện ở cột phải — cả trang không lặp bài.
  const rightIds = new Set(
    RIGHT_TOPICS.flatMap((t) => digest?.[t.slug] ?? []).map((i) => i.id),
  );
  const newsItems = (newsData?.items ?? [])
    .filter((i) => !rightIds.has(i.id))
    .slice(0, 9);

  const news: DtaNews[] = newsItems.map((item) => ({
    title: { vn: item.title, en: item.title },
    date: item.date,
    category: { vn: item.categoryName ?? "", en: item.categoryName ?? "" },
    summary: { vn: item.summary ?? "", en: item.summary ?? "" },
    image: item.image ?? "",
  }));

  // Cột phải: mỗi Main Topic một khối, 3 bài mới nhất (góp ý 27/10/2026).
  const columns = RIGHT_TOPICS.map((t) => ({
    ...t,
    items: (digest?.[t.slug] ?? []).map((item) => {
    const summary = item.summary ?? "";
    // Extract time/location from summary if present
    const timeMatch = summary.match(/(\d{1,2}[:h]\d{2}(?:\s*[-–]\s*\d{1,2}[:h]\d{2})?)/);
    const locationMatch = summary.match(/(?:địa\s*điểm|dia\s*diem|[đd]\/c)[:\s]+(.+?)(?:\s*[,.]|$)/i);
    // Có lịch sự kiện thì ngày/giờ trên thẻ là ngày diễn ra, không phải ngày đăng.
    const start = item.eventStartAt ? new Date(item.eventStartAt) : null;
    const pad = (n: number) => String(n).padStart(2, "0");
    const event: DtaEvent = {
      title: { vn: item.title, en: item.title },
      date: start
        ? `${pad(start.getDate())}/${pad(start.getMonth() + 1)}/${start.getFullYear()}`
        : item.date,
      time: start
        ? `${pad(start.getHours())}:${pad(start.getMinutes())}`
        : (timeMatch?.[1] ?? ""),
      location: {
        vn: locationMatch?.[1]?.trim() ?? summary.slice(0, 80),
        en: locationMatch?.[1]?.trim() ?? summary.slice(0, 80),
      },
      status: eventStatus(item),
      image: item.image ?? "",
    };
    return { event, summary, slug: item.id };
    }),
  }));

  const newsSlugs = newsItems.map((i) => i.id);

  return { news, columns, newsSlugs, newsLoading, eventLoading };
}
