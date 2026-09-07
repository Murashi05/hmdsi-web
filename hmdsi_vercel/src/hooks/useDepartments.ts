import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../config/query-keys';
import { departmentService } from '../services/department.service';

export function useDepartments(periodId?: number) {
  return useQuery({
    queryKey: queryKeys.departments(periodId),
    queryFn: () => departmentService.getDepartments(periodId),
  });
}

export function useDepartmentStructure(slug: string) {
  return useQuery({
    queryKey: queryKeys.departmentStructure(slug),
    queryFn: () => departmentService.getManagementStructure(slug),
    enabled: Boolean(slug),
  });
}
