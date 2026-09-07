import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../config/query-keys';
import { newsService } from '../services/news.service';

export function useNewsArticles(filters?: {
  category?: string;
  search?: string;
  is_featured?: boolean;
  page?: number;
}) {
  return useQuery({
    queryKey: queryKeys.news(filters),
    queryFn: () => newsService.getArticles(filters),
  });
}

export function useNewsArticle(slug: string) {
  return useQuery({
    queryKey: queryKeys.newsArticle(slug),
    queryFn: () => newsService.getArticle(slug),
    enabled: Boolean(slug),
  });
}
