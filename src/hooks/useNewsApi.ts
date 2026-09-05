import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import {
  fetchTopics,
  fetchArticles,
  fetchArticleBySlug,
  fetchAdsBySlot,
  fetchDigest,
} from "@/lib/api";
import {
  mapTopicToMainTopic,
  mapListItemToPortal,
  mapDetailToPortal,
} from "@/lib/newsMappers";
import type { ArticlesQueryParams } from "@/lib/newsApiTypes";
import type { MainTopic, PortalArticle, ArticlePageResult } from "@/newsData";
import type { AdPlacementItem } from "@/lib/api";

/** Sort mapping: frontend slug → backend value. */
const sortMap: Record<string, ArticlesQueryParams["sort"]> = {
  "moi-nhat": "latest",
  "cu-nhat": "oldest",
  "doc-nhieu": "views",
};

/** Flag mapping: frontend slug → backend value. */
const flagMap: Record<string, ArticlesQueryParams["flag"]> = {
  "thuc-tap": "intern",
};

export function useTopics() {
  return useQuery<MainTopic[]>({
    queryKey: ["topics"],
    queryFn: async () => {
      const data = await fetchTopics();
      return data.map(mapTopicToMainTopic);
    },
    staleTime: 5 * 60 * 1000,
  });
}

interface UseArticlesParams {
  topic?: string;
  category?: string;
  sort?: string;
  flag?: string;
  q?: string;
  page?: number;
  pageSize?: number;
}

export function useArticles(params: UseArticlesParams = {}) {
  const queryParams: ArticlesQueryParams = {
    topic: params.topic,
    category: params.category,
    sort: params.sort ? sortMap[params.sort] ?? "latest" : "latest",
    flag: params.flag ? flagMap[params.flag] : undefined,
    q: params.q,
    page: params.page,
    pageSize: params.pageSize,
  };

  return useQuery<ArticlePageResult>({
    queryKey: ["articles", queryParams],
    queryFn: async () => {
      const data = await fetchArticles(queryParams);
      return {
        items: data.items.map(mapListItemToPortal),
        total: data.total,
        page: data.page,
        pageCount: data.pageCount,
      };
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useArticleDetail(slug: string) {
  return useQuery<PortalArticle>({
    queryKey: ["article", slug],
    queryFn: async () => {
      const data = await fetchArticleBySlug(slug);
      return mapDetailToPortal(data);
    },
    staleTime: 2 * 60 * 1000,
  });
}

/** Convenience hook: latest N articles portal-wide. */
export function useLatestArticles(n = 5) {
  return useArticles({ sort: "moi-nhat", pageSize: n });
}

/** Convenience hook: most-read N articles portal-wide. */
export function useMostReadArticles(n = 5) {
  return useArticles({ sort: "doc-nhieu", pageSize: n });
}

/** Ads for a given slot — cached 5 min via React Query. */
export function useAds(slot: string) {
  return useQuery<AdPlacementItem[]>({
    queryKey: ["ads", slot],
    queryFn: () => fetchAdsBySlot(slot),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Digest: single API call that returns latest articles grouped by topic.
 * Replaces 4 separate useArticles() calls in HomeDigest.
 */
export function useDigest(
  topicSlugs: string[],
  pageSize = 3,
) {
  return useQuery<Record<string, PortalArticle[]>>({
    queryKey: ["digest", topicSlugs, pageSize],
    queryFn: async () => {
      const raw = await fetchDigest(topicSlugs, pageSize);
      const result: Record<string, PortalArticle[]> = {};
      for (const [topic, items] of Object.entries(raw)) {
        result[topic] = items.map(mapListItemToPortal);
      }
      return result;
    },
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Prefetch articles for a topic/category on hover.
 * Returns an onMouseEnter handler to attach to nav links.
 */
export function usePrefetchArticles() {
  const qc = useQueryClient();
  return useCallback(
    (topic?: string, category?: string) => {
      const queryParams = {
        topic,
        category,
        sort: "latest" as const,
        pageSize: 8,
      };
      qc.prefetchQuery({
        queryKey: ["articles", queryParams],
        queryFn: async () => {
          const data = await fetchArticles(queryParams);
          return {
            items: data.items.map(mapListItemToPortal),
            total: data.total,
            page: data.page,
            pageCount: data.pageCount,
          };
        },
        staleTime: 2 * 60 * 1000,
      });
    },
    [qc],
  );
}
