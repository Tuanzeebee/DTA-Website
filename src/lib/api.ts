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

export type DigestResponse = Record<string, ArticleListItem[]>;

export function fetchDigest(
  topicSlugs: string[],
  pageSize = 3,
): Promise<DigestResponse> {
  const qs = new URLSearchParams({
    topics: topicSlugs.join(","),
    pageSize: String(pageSize),
  });
  return fetchJson(`/news/articles/digest?${qs.toString()}`);
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
  mine?: boolean;
  topic?: string;
  category?: string;
  page?: number;
  pageSize?: number;
}): Promise<AdminArticleListResponse> {
  const qs = new URLSearchParams();
  if (params?.q) qs.set("q", params.q);
  if (params?.status) qs.set("status", params.status);
  if (params?.mine) qs.set("mine", "true");
  if (params?.topic) qs.set("topic", params.topic);
  if (params?.category) qs.set("category", params.category);
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
  nameEn?: string | null;
  role: string;
  type: string;
  domain: string;
  ownership?: string | null;
  leader?: string | null;
  phone?: string | null;
  strengths?: string | null;
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
  nameEn?: string;
  role?: string;
  type?: string;
  domain?: string;
  ownership?: string;
  leader?: string;
  phone?: string;
  strengths?: string;
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
    nameEn?: string;
    role?: string;
    type?: string;
    domain?: string;
    ownership?: string;
    leader?: string;
    phone?: string;
    strengths?: string;
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

/* ---------------- member application endpoints ---------------- */

export type ApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface ApplicationItem {
  id: string;
  trackingCode: string;
  orgName: string;
  nameEn: string | null;
  ownership: string | null;
  leader: string | null;
  contactName: string | null;
  email: string;
  phone: string | null;
  type: string;
  domain: string;
  strengths: string | null;
  techField: string | null;
  consentDocUrl: string | null;
  legalDocUrl: string | null;
  message: string | null;
  status: ApplicationStatus;
  createdMemberId: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Public: nộp đơn gia nhập (multipart gồm 7 trường + 2 file). */
export function submitApplication(form: FormData): Promise<ApplicationItem> {
  return fetchJson("/applications", { method: "POST", body: form });
}

/** Admin: danh sách đơn (lọc theo trạng thái). */
export function adminFetchApplications(
  status?: ApplicationStatus,
): Promise<ApplicationItem[]> {
  const qs = status ? `?status=${status}` : "";
  return authFetch(`/admin/applications${qs}`);
}

/** Admin: duyệt đơn — tạo Member trong Danh bạ. */
export interface ApproveApplicationResult {
  application: ApplicationItem;
  member: {
    id: string;
    name: string;
  };
  /** Mật khẩu tạm — backend chỉ trả 1 lần duy nhất. */
  tempPassword: string;
}

export function adminApproveApplication(
  id: string,
): Promise<ApproveApplicationResult> {
  return authFetch(`/admin/applications/${id}/approve`, { method: "PATCH" });
}

/** Admin: cấp lại mật khẩu hội viên đã duyệt — cũng chỉ trả 1 lần. */
export function adminResetMemberPassword(
  id: string,
): Promise<{ email: string; tempPassword: string }> {
  return authFetch(`/admin/applications/${id}/reset-password`, {
    method: "PATCH",
  });
}

/** Admin: từ chối đơn. */
export function adminRejectApplication(
  id: string,
): Promise<ApplicationItem> {
  return authFetch(`/admin/applications/${id}/reject`, { method: "PATCH" });
}

/* ---------------- member self-service (Không gian số) ---------------- */

/** Hội viên lấy hồ sơ của chính mình. */
export function memberFetchProfile(): Promise<MemberItem> {
  return authFetch("/member/profile");
}

/** Hội viên tự cập nhật các trường được phép của chính mình. */
export function memberUpdateProfile(data: {
  name?: string;
  nameEn?: string;
  domain?: string;
  ownership?: string;
  leader?: string;
  phone?: string;
  strengths?: string;
  logoUrl?: string;
  website?: string;
}): Promise<MemberItem> {
  return authFetch("/member/profile", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
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

/* ---------------- gallery endpoints ---------------- */

export interface GalleryPhotoItem {
  id: string;
  imageUrl: string;
  caption: string | null;
  sortOrder: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Public: fetch visible gallery photos for landing page. */
export function fetchGallery(): Promise<GalleryPhotoItem[]> {
  return fetchJson("/news/gallery");
}

/** Admin: fetch all gallery photos. */
export function adminFetchGallery(): Promise<GalleryPhotoItem[]> {
  return authFetch("/admin/gallery");
}

/** Admin: create a gallery photo record. */
export function adminCreateGalleryPhoto(data: {
  imageUrl: string;
  caption?: string;
  sortOrder?: number;
  active?: boolean;
}): Promise<GalleryPhotoItem> {
  return authFetch("/admin/gallery", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

/** Admin: update a gallery photo. */
export function adminUpdateGalleryPhoto(
  id: string,
  data: {
    imageUrl?: string;
    caption?: string;
    sortOrder?: number;
    active?: boolean;
  },
): Promise<GalleryPhotoItem> {
  return authFetch(`/admin/gallery/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

/** Admin: toggle gallery photo visibility. */
export function adminToggleGalleryPhoto(
  id: string,
): Promise<GalleryPhotoItem> {
  return authFetch(`/admin/gallery/${id}/toggle`, { method: "PATCH" });
}

/** Admin: delete a gallery photo. */
export function adminDeleteGalleryPhoto(
  id: string,
): Promise<{ id: string; deleted: boolean }> {
  return authFetch(`/admin/gallery/${id}`, { method: "DELETE" });
}

/** Upload a gallery image file to the backend. Returns the serveable URL. */
export async function uploadGalleryImage(file: File): Promise<string> {
  const doUpload = async (token: string | null) => {
    const formData = new FormData();
    formData.append("file", file);
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return fetch(`${API_BASE}/admin/gallery/upload`, {
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
  const galleryData = (await res.json()) as { url: string };
  return galleryData.url;
}
