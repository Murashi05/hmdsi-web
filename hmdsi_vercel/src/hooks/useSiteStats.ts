import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../config/query-keys';
import { siteStatService } from '../services/site-stat.service';

export function useSiteStats() {
  return useQuery({
    queryKey: queryKeys.stats,
    queryFn: siteStatService.getHomepageStats,
  });
}
