import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../config/query-keys';
import { resourceService } from '../services/resource.service';

export function useResources(filters?: {
  category?: string;
  academic_year?: string;
  search?: string;
  page?: number;
}) {
  return useQuery({
    queryKey: queryKeys.resources(filters),
    queryFn: () => resourceService.getResources(filters),
  });
}
