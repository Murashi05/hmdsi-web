import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../config/query-keys';
import { periodService } from '../services/period.service';

export function usePeriods() {
  return useQuery({
    queryKey: queryKeys.periods,
    queryFn: periodService.getAll,
    staleTime: 5 * 60 * 1000,
  });
}

export function useActivePeriod() {
  return useQuery({
    queryKey: queryKeys.periodActive,
    queryFn: periodService.getActive,
    staleTime: 5 * 60 * 1000,
  });
}
