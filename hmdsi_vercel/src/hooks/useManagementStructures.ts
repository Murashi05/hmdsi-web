import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../config/query-keys';
import { structureService } from '../services/structure.service';

export function useManagementStructures(filters?: {
  period_id?: number;
  department_id?: number;
  department_slug?: string;
}) {
  return useQuery({
    queryKey: queryKeys.managementStructures(filters),
    queryFn: () => structureService.getStructures(filters),
  });
}
