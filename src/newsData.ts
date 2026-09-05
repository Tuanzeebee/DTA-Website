/**
 * Data model & helpers for the DTA news portal (/news).
 *
 * Interfaces and pure helpers live here. All data fetching is handled by
 * React Query hooks in src/hooks/useNewsApi.ts which call the backend API.
 */

export interface NewsCategory {
  slug: string;
  name: string;
  desc: string;
  nameEn?: string;
  descEn?: string;
}

export interface MainTopic {
  slug: string;
  name: string;
  short: string;
  nameEn?: string;
  shortEn?: string;
  categories: NewsCategory[];
}

import type { Lang } from "@/types";
export const topicName = (t: MainTopic, lang: Lang) =>
  lang === "en" ? (t.nameEn ?? t.name) : t.name;
export const topicShort = (t: MainTopic, lang: Lang) =>
  lang === "en" ? (t.shortEn ?? t.short) : t.short;
export const categoryName = (c: NewsCategory, lang: Lang) =>
  lang === "en" ? (c.nameEn ?? c.name) : c.name;
export const categoryDesc = (c: NewsCategory, lang: Lang) =>
  lang === "en" ? (c.descEn ?? c.desc) : c.desc;

/**
 * Lookup helpers that work on a MainTopic[] array.
 * Components should pass in the topics from useTopics().
 */
export function topicBySlug(topics: MainTopic[], slug: string) {
  return topics.find((t) => t.slug === slug);
}

/**
 * Find a category by topic + category slugs.
 * New code: categoryBySlug(topics, topicSlug, categorySlug)
 * Legacy admin code: categoryBySlug(topicSlug, categorySlug) — uses mainTopics.
 */
export function categoryBySlug(
  topicsOrSlug: MainTopic[] | string,
  topicSlug?: string,
  categorySlug?: string,
): ReturnType<typeof topicBySlug> extends infer T
  ? T extends MainTopic | undefined
    ? T extends MainTopic
      ? NewsCategory | undefined
      : NewsCategory | undefined
    : never
  : never {
  if (Array.isArray(topicsOrSlug)) {
    return topicBySlug(topicsOrSlug, topicSlug!)?.categories.find(
      (c) => c.slug === categorySlug,
    );
  }
  // Legacy 2-arg call: use mainTopics
  return mainTopics
    .find((t) => t.slug === topicsOrSlug)
    ?.categories.find((c) => c.slug === topicSlug);
}

/* ------------------------------------------------------------------ *
 * Admin-compatible re-exports (localStorage overlay system).
 * The admin dashboard still uses localStorage; these keep it functional.
 * ------------------------------------------------------------------ */

export const mainTopics: MainTopic[] = [];

export const ADMIN_ARTICLES_KEY = "dta-admin-articles";
export const ADMIN_HIDDEN_KEY = "dta-admin-hidden";

export const portalArticles: PortalArticle[] = [];

interface MergedCache {
  key: string;
  all: PortalArticle[];
  published: PortalArticle[];
}
let mergedCache: MergedCache | null = null;

function readMerged(): MergedCache {
  let rawA = "";
  let rawH = "";
  try {
    rawA = localStorage.getItem(ADMIN_ARTICLES_KEY) ?? "";
    rawH = localStorage.getItem(ADMIN_HIDDEN_KEY) ?? "";
  } catch {
    /* storage unavailable */
  }
  const key = `${rawA} ${rawH}`;
  if (mergedCache?.key === key) return mergedCache;

  let overrides: PortalArticle[] = [];
  let hidden: string[] = [];
  try {
    const a: unknown = rawA ? JSON.parse(rawA) : [];
    if (Array.isArray(a)) overrides = a as PortalArticle[];
    const h: unknown = rawH ? JSON.parse(rawH) : [];
    if (Array.isArray(h)) hidden = h.filter((x) => typeof x === "string");
  } catch {
    /* corrupted storage */
  }

  const byId = new Map(overrides.map((o) => [o.id, o]));
  const baseIds = new Set(portalArticles.map((a) => a.id));
  const all = [
    ...portalArticles
      .filter((a) => !hidden.includes(a.id))
      .map((a) => byId.get(a.id) ?? a),
    ...overrides.filter((o) => !baseIds.has(o.id)),
  ];
  mergedCache = {
    key,
    all,
    published: all.filter((a) => a.status !== "draft"),
  };
  return mergedCache;
}

export const allArticles = () => readMerged().all;
export const publishedArticles = () => readMerged().published;

export interface ArticleImage {
  src: string;
  caption?: string;
  align: "left" | "right" | "center";
  wrap?: "square" | "none";
  width?: number;
}

export interface ArticleBox {
  box: string;
}

export type ArticleBlock = string | ArticleImage | ArticleBox;

export interface PortalArticle {
  id: string;
  title: string;
  summary: string;
  topic: string;
  category: string;
  date: string;
  image: string;
  tags: string[];
  views: number;
  pdfUrl?: string;
  memberUrl?: string;
  isIntern?: boolean;
  author?: string;
  status?: "draft" | "published";
  body: ArticleBlock[];
}

export interface BoardMember {
  name: string;
  role: string;
  board: "bch" | "kiem-tra";
  photo: string;
}

/* ------------------------------------------------------------------ *
 * Sort / flag constants & type guards
 * ------------------------------------------------------------------ */

export const articleSorts = ["moi-nhat", "cu-nhat", "doc-nhieu"] as const;
export type ArticleSort = (typeof articleSorts)[number];
export const articleSortLabels: Record<
  ArticleSort,
  { vn: string; en: string }
> = {
  "moi-nhat": { vn: "Mới nhất", en: "Newest" },
  "cu-nhat": { vn: "Cũ nhất", en: "Oldest" },
  "doc-nhieu": { vn: "Đọc nhiều", en: "Most read" },
};
export const DEFAULT_SORT: ArticleSort = "moi-nhat";

export const articleFlags = ["pdf", "thuc-tap", "lien-ket"] as const;
export type ArticleFlag = (typeof articleFlags)[number];
export const articleFlagLabels: Record<
  ArticleFlag,
  { vn: string; en: string }
> = {
  pdf: { vn: "Có văn bản PDF", en: "PDF attached" },
  "thuc-tap": { vn: "Thực tập sinh", en: "Interns" },
  "lien-ket": { vn: "Link hội viên", en: "Member link" },
};

export const isArticleSort = (v: unknown): v is ArticleSort =>
  articleSorts.includes(v as ArticleSort);
export const isArticleFlag = (v: unknown): v is ArticleFlag =>
  articleFlags.includes(v as ArticleFlag);

export const ARTICLES_PAGE_SIZE = 6;

export interface ArticleQuery {
  topic: string;
  category?: string;
  sort?: ArticleSort;
  flag?: ArticleFlag;
  page?: number;
  pageSize?: number;
}

export interface ArticlePageResult {
  items: PortalArticle[];
  total: number;
  page: number;
  pageCount: number;
}

/* ------------------------------------------------------------------ *
 * Date / time helpers
 * ------------------------------------------------------------------ */

/** dd/mm/yyyy -> Date object (midday, to dodge DST edge cases). */
export function parseNewsDate(d: string): Date {
  const [dd, mm, yyyy] = d.split("/").map(Number);
  return new Date(yyyy, mm - 1, dd, 12);
}

/** Relative freshness label — "3 giờ trước" reads faster than a raw date. */
export function timeAgo(dateStr: string, lang: Lang): string {
  const diffMs = Date.now() - parseNewsDate(dateStr).getTime();
  const days = Math.floor(diffMs / 86_400_000);
  if (days <= 0) return lang === "vn" ? "Hôm nay" : "Today";
  if (days === 1) return lang === "vn" ? "Hôm qua" : "Yesterday";
  if (days < 7)
    return lang === "vn" ? `${days} ngày trước` : `${days} days ago`;
  if (days < 30) {
    const w = Math.floor(days / 7);
    return lang === "vn" ? `${w} tuần trước` : `${w}w ago`;
  }
  return dateStr;
}

/** A story is "Mới" while it is younger than `days` (default 3). */
export function isFresh(dateStr: string, days = 3): boolean {
  return Date.now() - parseNewsDate(dateStr).getTime() < days * 86_400_000;
}
