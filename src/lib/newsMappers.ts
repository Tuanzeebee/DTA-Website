/**
 * Map backend API responses to the frontend data shapes that UI components expect.
 */

import type { MainTopic, PortalArticle, ArticleBlock, ArticleImage } from "@/newsData";
import type {
  ArticleDetailResponse,
  ArticleListItem,
  ArticleBlockRaw,
  TopicResponse,
} from "./newsApiTypes";

/** Format ISO date string → dd/mm/yyyy. */
function fmtDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

/** Map a single raw block from the backend into a PortalArticle body entry. */
function mapBlockRaw(raw: ArticleBlockRaw): ArticleBlock {
  if (typeof raw === "string") return raw;
  if ("box" in raw) return { box: raw.box };
  // Image block
  return {
    src: raw.src,
    caption: raw.caption,
    align: raw.align as ArticleImage["align"],
    wrap: raw.wrap as ArticleImage["wrap"],
    width: raw.width,
  } satisfies ArticleImage;
}

/** Map a list-item response from the backend to PortalArticle (body = []). */
export function mapListItemToPortal(item: ArticleListItem): PortalArticle {
  return {
    id: item.slug, // frontend uses slug as the link identifier
    title: item.title,
    summary: item.summary ?? "",
    topic: item.topic,
    category: item.category,
    date: fmtDate(item.date),
    image: item.image ?? "",
    tags: item.tags,
    views: item.views,
    isIntern: item.isIntern,
    author: item.author ?? undefined,
    body: [],
  };
}

/** Map a full article detail response to PortalArticle (with body blocks). */
export function mapDetailToPortal(
  detail: ArticleDetailResponse,
): PortalArticle {
  return {
    ...mapListItemToPortal(detail),
    pdfUrl: detail.pdfUrl ?? undefined,
    memberUrl: detail.memberUrl ?? undefined,
    body: detail.blocks.map(mapBlockRaw),
  };
}

/** Map a topic response from the backend to MainTopic for the frontend. */
export function mapTopicToMainTopic(t: TopicResponse): MainTopic {
  return {
    slug: t.slug,
    name: t.name,
    short: t.shortName ?? t.name,
    nameEn: t.nameEn ?? undefined,
    shortEn: t.shortEn ?? undefined,
    categories: t.categories.map((c) => ({
      slug: c.slug,
      name: c.name,
      desc: c.description ?? "",
      nameEn: undefined,
      descEn: undefined,
    })),
  };
}
