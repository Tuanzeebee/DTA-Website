import { useQuery } from "@tanstack/react-query";
import {
  fetchTopics,
  fetchArticles,
  fetchArticleBySlug,
} from "@/lib/api";
import {
  mapTopicToMainTopic,
  mapListItemToPortal,
  mapDetailToPortal,
} from "@/lib/newsMappers";
import type { ArticlesQueryParams } from "@/lib/newsApiTypes";
import type { MainTopic, PortalArticle, ArticlePageResult } from "@/newsData";

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
