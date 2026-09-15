import { useCallback, useEffect, useRef, useState } from "react";
import {
  adminFetchArticles,
  adminFetchArticle,
  adminCreateArticle,
  adminUpdateArticle,
  adminDeleteArticle,
  adminPublishArticle,
  adminUnpublishArticle,
  adminFetchCategories,
  type AdminArticleItem,
  type AdminArticleDetailResponse,
} from "@/lib/api";
import { authService } from "@/lib/auth/service";
import { categoryBySlug, type PortalArticle } from "@/newsData";
import { isRichTextEmpty } from "@/compenents/admin/richText";

/**
 * Admin article store backed by the real NestJS API.
 * Replaces the previous localStorage overlay system.
 */

const CHANGE_EVENT = "dta-admin-articles-changed";

/* ---------------- state ---------------- */

let cachedArticles: PortalArticle[] = [];
let cacheRaw: string = "";
let loading = false;

const notify = () => window.dispatchEvent(new Event(CHANGE_EVENT));

/** Map backend status to frontend status. */
function mapStatus(s: string): "published" | "draft" {
  return s === "PUBLISHED" ? "published" : "draft";
}

/** Format ISO date to dd/mm/yyyy. */
function fmtDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

/** Convert dd/mm/yyyy to ISO date string for backend. */
function vnDateToIso(dateStr: string): string | undefined {
  const parts = dateStr.split("/");
  if (parts.length !== 3) return undefined;
  const [dd, mm, yyyy] = parts;
  const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
  if (isNaN(d.getTime())) return undefined;
  return d.toISOString();
}

/** Map backend article item to frontend PortalArticle. */
function mapArticle(item: AdminArticleItem): PortalArticle {
  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    summary: item.summary ?? "",
    topic: item.topic,
    category: item.category,
    date: fmtDate(item.date),
    image: item.image ?? "",
    tags: item.tags ?? [],
    views: item.views ?? 0,
    isIntern: item.isIntern || undefined,
    author: item.author ?? undefined,
    status: mapStatus(item.status),
    body: [],
  };
}

/* ---------------- data fetching ---------------- */

export async function loadArticles(): Promise<PortalArticle[]> {
  if (loading) return cachedArticles;
  loading = true;
  try {
    const token = authService.getAccessToken();
    if (!token) {
      cachedArticles = [];
      return cachedArticles;
    }
    const res = await adminFetchArticles({ pageSize: 200 });
    cachedArticles = res.items.map(mapArticle);
    cacheRaw = JSON.stringify(cachedArticles);
    notify();
  } catch (err) {
    console.error("[adminStore] loadArticles failed:", err);
    // keep stale data on error
  } finally {
    loading = false;
  }
  return cachedArticles;
}

/** Map backend detail blocks to frontend ArticleBlock[]. */
function mapDetailBlocks(
  blocks: unknown[],
): import("@/newsData").ArticleBlock[] {
  return blocks.map((b) => {
    if (typeof b === "string") return b;
    if (b && typeof b === "object" && "src" in b) {
      return {
        src: (b as { src: string }).src,
        caption: (b as { caption?: string }).caption,
        align: (b as { align?: string }).align ?? "center",
        wrap: (b as { wrap?: string }).wrap ?? "none",
        width: (b as { width?: number }).width,
      } as import("@/newsData").ArticleImage;
    }
    if (b && typeof b === "object" && "box" in b) {
      return {
        box: (b as { box: string }).box,
      } as import("@/newsData").ArticleBox;
    }
    return "";
  });
}

/** Fetch a single article by ID from the API, including body blocks. */
export async function loadArticleDetail(
  id: string,
): Promise<PortalArticle | null> {
  try {
    const detail: AdminArticleDetailResponse = await adminFetchArticle(id);
    return {
      id: detail.id,
      slug: detail.slug,
      title: detail.title,
      summary: detail.summary ?? "",
      topic: detail.topic,
      category: detail.category,
      date: fmtDate(detail.publishedAt ?? detail.date),
      image: detail.image ?? "",
      tags: detail.tags ?? [],
      views: detail.views ?? 0,
      pdfUrl: detail.pdfUrl ?? undefined,
      memberUrl: detail.memberUrl ?? undefined,
      isIntern: detail.isIntern || undefined,
      author: detail.author ?? undefined,
      status: mapStatus(detail.status),
      body: mapDetailBlocks(detail.blocks ?? []),
    };
  } catch {
    return null;
  }
}

/* ---------------- reactive hook ---------------- */

const subscribe = (cb: () => void) => {
  window.addEventListener(CHANGE_EVENT, cb);
  return () => window.removeEventListener(CHANGE_EVENT, cb);
};

/** Reactive full list (drafts included) for admin views. */
export function useAdminArticles(): PortalArticle[] {
  const [articles, setArticles] = useState<PortalArticle[]>(cachedArticles);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    // Initial fetch
    loadArticles().then((a) => {
      if (mounted.current) setArticles(a);
    });
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    const unsub = subscribe(() => {
      setArticles([...cachedArticles]);
    });
    return unsub;
  }, []);

  return articles;
}

/* ---------------- mutations ---------------- */

/**
 * Resolve a category slug to its numeric ID for the backend API.
 * Fetches categories from the API if needed.
 * Không fallback cứng về 1 nữa — ném lỗi rõ để UI báo đúng nguyên nhân
 * (trước đây fallback 1 gây 400 "Danh mục không tồn tại" khó chẩn đoán).
 */
let categoryCache: Map<string, number> | null = null;

async function resolveCategoryId(
  topicSlug: string,
  categorySlug: string,
): Promise<number> {
  // Try the local data first (mainTopics giờ đã có id từ /api/news/topics)
  const local = categoryBySlug(topicSlug, categorySlug);
  if (local?.id != null) return local.id;

  // Fetch from API
  if (!categoryCache) {
    const cats = await adminFetchCategories();
    categoryCache = new Map(cats.map((c) => [c.slug, c.id]));
  }
  const found =
    categoryCache.get(categorySlug) ?? [...categoryCache.values()][0];
  if (found == null) {
    throw new Error(
      "Chưa tải được danh mục (topics rỗng). Đợi danh mục tải xong rồi chọn lại Chủ đề/Chuyên mục.",
    );
  }
  // Nếu slug yêu cầu không khớp DB nhưng đã có categories -> vẫn báo rõ
  if (!categorySlug || !categoryCache.has(categorySlug)) {
    throw new Error(
      `Chuyên mục "${categorySlug || "(trống)"}" không khớp dữ liệu server. Chọn lại Chủ đề/Chuyên mục sau khi danh mục đã tải.`,
    );
  }
  return found;
}

/** Create or update article via the API. */
export async function saveArticle(article: PortalArticle): Promise<void> {
  const token = authService.getAccessToken();
  if (!token) throw new Error("Chưa đăng nhập");

  const categoryId = await resolveCategoryId(article.topic, article.category);

  // Build blocks from body (giữ inline bold/màu trong text).
  // Lưu ý: string có thể chứa <strong>/<span style="color:..."> — backend
  // chỉ cần IsString nên không cần đổi DTO. BOX phải map BOX, không gộp IMAGE.
  const blocks = (article.body ?? [])
    .filter((b) => {
      if (typeof b === "string") return !isRichTextEmpty(b);
      if ("box" in b) return !isRichTextEmpty(b.box ?? "");
      return true;
    })
    .map((b, i) => {
      if (typeof b === "string") {
        return { type: "TEXT", text: b, position: i };
      }
      if ("box" in b) {
        return { type: "BOX", text: b.box, position: i };
      }
      // Image block
      const widthNum =
        typeof b.width === "number" && Number.isFinite(b.width)
          ? Math.min(100, Math.max(20, Math.round(b.width)))
          : undefined;
      return {
        type: "IMAGE",
        imageUrl:
          b.src?.startsWith("/uploads/") || b.src?.startsWith("/news-images/")
            ? undefined
            : b.src || undefined,
        imageLocalPath:
          b.src?.startsWith("/uploads/") || b.src?.startsWith("/news-images/")
            ? b.src
            : undefined,
        caption: b.caption || undefined,
        align: (b.align ?? "center").toUpperCase(),
        wrap: (b.wrap ?? "none").toUpperCase(),
        width: widthNum,
        position: i,
      };
    });

  const isExistingBackend =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      article.id,
    );

  const payload = {
    title: article.title,
    summary: article.summary || undefined,
    categoryId,
    thumbnailUrl: article.image || undefined,
    sourceUrl: undefined,
    tags: article.tags.length > 0 ? article.tags : undefined,
    pdfUrl: article.pdfUrl || undefined,
    memberUrl: article.memberUrl || undefined,
    isIntern: article.isIntern || undefined,
    status: article.status === "published" ? "PUBLISHED" : "DRAFT",
    publishedAt: article.date ? vnDateToIso(article.date) : undefined,
    blocks: blocks.length > 0 ? blocks : undefined,
  };

  try {
    if (isExistingBackend) {
      await adminUpdateArticle(article.id, payload);
    } else {
      await adminCreateArticle(payload);
    }
  } catch (err) {
    console.error("[adminStore] saveArticle failed:", err, { payload });
    throw err;
  }
  await loadArticles();
}

/** Toggle publish/draft status. */
export async function togglePublish(article: PortalArticle): Promise<void> {
  const token = authService.getAccessToken();
  if (!token) throw new Error("Chưa đăng nhập");

  if (article.status === "published") {
    await adminUnpublishArticle(article.id);
  } else {
    await adminPublishArticle(article.id);
  }
  await loadArticles();
}

/** Delete article via the API. */
export async function deleteArticle(id: string): Promise<void> {
  const token = authService.getAccessToken();
  if (!token) throw new Error("Chưa đăng nhập");
  await adminDeleteArticle(id);
  await loadArticles();
}

/** Drop every local change and re-fetch from API. */
export async function resetToMockData(): Promise<void> {
  await loadArticles();
}

/** Check if an article was created locally (not yet in backend). */
export function articleOrigin(id: string): "mock" | "admin" {
  const isBackend =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  return isBackend ? "admin" : "mock";
}

/** Generate a temporary client-side ID. */
export const newArticleId = () =>
  `adm-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;
