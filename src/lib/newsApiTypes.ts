/** Raw response shapes from the NestJS backend (news-public.controller). */

export interface TopicResponse {
  id: number;
  slug: string;
  name: string;
  shortName: string | null;
  nameEn: string | null;
  shortEn: string | null;
  sortOrder: number;
  categories: CategoryResponse[];
}

export interface CategoryResponse {
  id: number;
  wpId: number | null;
  slug: string;
  name: string;
  description: string | null;
  sortOrder: number;
  topicId: number;
  topic: { slug: string; name: string };
}

export interface ArticleListItem {
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
}

export interface ArticleListResponse {
  items: ArticleListItem[];
  total: number;
  page: number;
  pageCount: number;
}

/** Backend block shapes — matches the toDetail mapper in articles.service.ts */
export type ArticleBlockRaw =
  | string
  | { src: string; caption?: string; align: string; wrap: string; width?: number }
  | { box: string };

export interface ArticleDetailResponse extends ArticleListItem {
  pdfUrl: string | null;
  memberUrl: string | null;
  sourceUrl: string | null;
  status: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  blocks: ArticleBlockRaw[];
}

export interface ArticlesQueryParams {
  topic?: string;
  category?: string;
  sort?: "latest" | "oldest" | "views";
  flag?: "intern";
  q?: string;
  page?: number;
  pageSize?: number;
}
