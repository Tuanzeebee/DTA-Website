import { authService } from "@/lib/auth/service";
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

/** Fetch with JWT auth header. Auto-refresh on 401. */
async function authFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const token = authService.getAccessToken();
  const headers = new Headers(init?.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let res = await fetch(`${API_BASE}${path}`, { ...init, headers });

  if (res.status === 401) {
    const refreshed = await authService.refreshAccessToken();
    if (refreshed) {
      const newToken = authService.getAccessToken();
      const retryHeaders = new Headers(init?.headers);
      if (newToken) retryHeaders.set("Authorization", `Bearer ${newToken}`);
      res = await fetch(`${API_BASE}${path}`, { ...init, headers: retryHeaders });
    }
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    if (res.status === 401) {
      authService.logout();
      window.location.href = "/dang-nhap";
    }
    throw new Error(`API ${res.status}: ${body || res.statusText}`);
  }
  return res.json() as Promise<T>;
}

/* ---------------- public endpoints ---------------- */

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

/* ---------------- admin endpoints ---------------- */

export interface AdminArticleItem {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  image: string | null;
  topic: string;
  topicName: string;
  category: string;
  categoryName: string;
  date: string | null;
  tags: string[];
  views: number;
  isIntern: boolean;
  author: string | null;
  status: string;
  updatedAt: string;
  wpId: number | null;
}

export interface AdminArticleListResponse {
  items: AdminArticleItem[];
  total: number;
  page: number;
  pageCount: number;
}

export interface AdminArticleDetailResponse extends AdminArticleItem {
  pdfUrl: string | null;
  memberUrl: string | null;
  sourceUrl: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  rawHtml: string | null;
  blocks: unknown[];
}

export function adminFetchArticles(params?: {
  q?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): Promise<AdminArticleListResponse> {
  const qs = new URLSearchParams();
  if (params?.q) qs.set("q", params.q);
  if (params?.status) qs.set("status", params.status);
  if (params?.page && params.page > 1) qs.set("page", String(params.page));
  if (params?.pageSize) qs.set("pageSize", String(params.pageSize));
  const query = qs.toString();
  return authFetch(`/admin/news/articles${query ? `?${query}` : ""}`);
}

export function adminFetchArticle(
  id: string,
): Promise<AdminArticleDetailResponse> {
  return authFetch(`/admin/news/articles/${encodeURIComponent(id)}`);
}

export function adminCreateArticle(data: {
  title: string;
  slug?: string;
  summary?: string;
  categoryId: number;
  thumbnailUrl?: string;
  sourceUrl?: string;
  rawHtml?: string;
  tags?: string[];
  pdfUrl?: string;
  memberUrl?: string;
  isIntern?: boolean;
  status?: string;
  blocks?: unknown[];
}): Promise<AdminArticleDetailResponse> {
  return authFetch("/admin/news/articles", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export function adminUpdateArticle(
  id: string,
  data: {
    title?: string;
    slug?: string;
    summary?: string;
    categoryId?: number;
    thumbnailUrl?: string;
    sourceUrl?: string;
    rawHtml?: string;
    tags?: string[];
    pdfUrl?: string;
    memberUrl?: string;
    isIntern?: boolean;
    status?: string;
    blocks?: unknown[];
  },
): Promise<AdminArticleDetailResponse> {
  return authFetch(`/admin/news/articles/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export function adminDeleteArticle(id: string): Promise<{ id: string; deleted: boolean }> {
  return authFetch(`/admin/news/articles/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export function adminPublishArticle(
  id: string,
): Promise<AdminArticleDetailResponse> {
  return authFetch(`/admin/news/articles/${encodeURIComponent(id)}/publish`, {
    method: "PATCH",
  });
}

export function adminUnpublishArticle(
  id: string,
): Promise<AdminArticleDetailResponse> {
  return authFetch(`/admin/news/articles/${encodeURIComponent(id)}/unpublish`, {
    method: "PATCH",
  });
}

/** Upload an image file to the backend. Returns the serveable URL. */
export async function uploadImage(file: File): Promise<string> {
  const doUpload = async (token: string | null) => {
    const formData = new FormData();
    formData.append("file", file);
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return fetch(`${API_BASE}/admin/news/upload`, {
      method: "POST",
      headers,
      body: formData,
    });
  };

  const token = authService.getAccessToken();
  let res = await doUpload(token);

  if (res.status === 401) {
    const refreshed = await authService.refreshAccessToken();
    if (refreshed) {
      res = await doUpload(authService.getAccessToken());
    }
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    if (res.status === 401) {
      authService.logout();
      window.location.href = "/dang-nhap";
    }
    throw new Error(body || `Upload failed (${res.status})`);
  }
  const data = (await res.json()) as { url: string };
  return data.url;
}

/** Fetch all topics for admin use. */
export function adminFetchTopics(): Promise<TopicResponse[]> {
  return authFetch("/news/topics");
}

/** Fetch categories for a topic. */
export function adminFetchCategories(
  topicSlug?: string,
): Promise<{ id: number; name: string; slug: string; topicId: number }[]> {
  const qs = topicSlug ? `?topic=${encodeURIComponent(topicSlug)}` : "";
  return authFetch(`/news/categories${qs}`);
}

/* ---------------- admin user endpoints ---------------- */

export interface AdminUserItem {
  id: string;
  email: string;
  fullName: string;
  status: string;
  avatarUrl: string | null;
  roles: string[];
  createdAt: string;
}

export function adminFetchUsers(): Promise<AdminUserItem[]> {
  return authFetch("/admin/users");
}

export function adminCreateUser(data: {
  email: string;
  fullName: string;
  password: string;
  roles?: string[];
}): Promise<AdminUserItem> {
  return authFetch("/admin/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export function adminSetUserRoles(
  id: string,
  roles: string[],
): Promise<{ id: string; roles: string[] }> {
  return authFetch(`/admin/users/${id}/roles`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ roles }),
  });
}

export function adminSetUserStatus(
  id: string,
  status: string,
): Promise<{ id: string; status: string }> {
  return authFetch(`/admin/users/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
}

export function adminDeleteUser(
  id: string,
): Promise<{ id: string; deleted: boolean }> {
  return authFetch(`/admin/users/${id}`, { method: "DELETE" });
}

/* ---------------- member endpoints ---------------- */

export interface MemberItem {
  id: string;
  name: string;
  role: string;
  type: string;
  domain: string;
  logoUrl: string | null;
  website: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

/** Public: fetch all members for homepage. */
export function fetchMembers(): Promise<MemberItem[]> {
  return fetchJson("/news/members");
}

/** Admin: fetch all members. */
export function adminFetchMembers(): Promise<MemberItem[]> {
  return authFetch("/admin/members");
}

/** Admin: create a new member. */
export function adminCreateMember(data: {
  name: string;
  role?: string;
  type?: string;
  domain?: string;
  logoUrl?: string;
  website?: string;
  sortOrder?: number;
}): Promise<MemberItem> {
  return authFetch("/admin/members", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

/** Admin: update an existing member. */
export function adminUpdateMember(
  id: string,
  data: {
    name?: string;
    role?: string;
    type?: string;
    domain?: string;
    logoUrl?: string;
    website?: string;
    sortOrder?: number;
  },
): Promise<MemberItem> {
  return authFetch(`/admin/members/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

/** Admin: delete a member. */
export function adminDeleteMember(
  id: string,
): Promise<{ id: string; deleted: boolean }> {
  return authFetch(`/admin/members/${id}`, { method: "DELETE" });
}

/* ---------------- ad placement endpoints ---------------- */

export interface AdPlacementItem {
  id: string;
  title: string;
  slot: string;
  imageUrl: string;
  linkUrl: string;
  active: boolean;
  note: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Public: fetch active ads for a slot. */
export function fetchAdsBySlot(slot: string): Promise<AdPlacementItem[]> {
  return fetchJson(`/news/ads?slot=${encodeURIComponent(slot)}`);
}

/** Admin: fetch all ads. */
export function adminFetchAds(): Promise<AdPlacementItem[]> {
  return authFetch("/admin/ads");
}

/** Admin: create a new ad. */
export function adminCreateAd(data: {
  title: string;
  slot?: string;
  imageUrl: string;
  linkUrl: string;
  active?: boolean;
  note?: string;
}): Promise<AdPlacementItem> {
  return authFetch("/admin/ads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

/** Admin: update an existing ad. */
export function adminUpdateAd(
  id: string,
  data: {
    title?: string;
    slot?: string;
    imageUrl?: string;
    linkUrl?: string;
    active?: boolean;
    note?: string;
  },
): Promise<AdPlacementItem> {
  return authFetch(`/admin/ads/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

/** Admin: toggle ad active status. */
export function adminToggleAd(
  id: string,
): Promise<AdPlacementItem> {
  return authFetch(`/admin/ads/${id}/toggle`, { method: "PATCH" });
}

/** Admin: delete an ad. */
export function adminDeleteAd(
  id: string,
): Promise<{ id: string; deleted: boolean }> {
  return authFetch(`/admin/ads/${id}`, { method: "DELETE" });
}

/** Upload an ad image file to the backend. Returns the serveable URL. */
export async function uploadAdImage(file: File): Promise<string> {
  const doUpload = async (token: string | null) => {
    const formData = new FormData();
    formData.append("file", file);
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return fetch(`${API_BASE}/admin/ads/upload`, {
      method: "POST",
      headers,
      body: formData,
    });
  };

  const token = authService.getAccessToken();
  let res = await doUpload(token);

  if (res.status === 401) {
    const refreshed = await authService.refreshAccessToken();
    if (refreshed) {
      res = await doUpload(authService.getAccessToken());
    }
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    if (res.status === 401) {
      authService.logout();
      window.location.href = "/dang-nhap";
    }
    throw new Error(body || `Upload failed (${res.status})`);
  }
  const data = (await res.json()) as { url: string };
  return data.url;
}
