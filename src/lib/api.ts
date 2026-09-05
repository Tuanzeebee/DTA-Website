import type {
  ArticleDetailResponse,
  ArticleListResponse,
  ArticlesQueryParams,
  TopicResponse,
} from "./newsApiTypes";

const API_BASE = "/api";

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, init);
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${body || res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export function fetchTopics(): Promise<TopicResponse[]> {
  return fetchJson("/news/topics");
}

export function fetchCategories(topicSlug?: string): Promise<unknown[]> {
  const qs = topicSlug ? `?topic=${encodeURIComponent(topicSlug)}` : "";
  return fetchJson(`/news/categories${qs}`);
}

export function fetchArticles(
  params: ArticlesQueryParams = {},
): Promise<ArticleListResponse> {
  const qs = new URLSearchParams();
  if (params.topic) qs.set("topic", params.topic);
  if (params.category) qs.set("category", params.category);
  if (params.sort && params.sort !== "latest") qs.set("sort", params.sort);
  if (params.flag) qs.set("flag", params.flag);
  if (params.q) qs.set("q", params.q);
  if (params.page && params.page > 1) qs.set("page", String(params.page));
  if (params.pageSize) qs.set("pageSize", String(params.pageSize));
  const query = qs.toString();
  return fetchJson(`/news/articles${query ? `?${query}` : ""}`);
}

export function fetchArticleBySlug(
  slug: string,
): Promise<ArticleDetailResponse> {
  return fetchJson(`/news/articles/${encodeURIComponent(slug)}`);
}
