import { useMutation, useQuery } from '@tanstack/react-query';
import { queryKeys } from '../config/query-keys';
import { aspirationService, type AspirationPayload } from '../services/aspiration.service';

export function useAspirationStats() {
  return useQuery({
    queryKey: queryKeys.aspirationStats,
    queryFn: aspirationService.getStats,
  });
}

export function useTrackAspiration(code: string) {
  return useQuery({
    queryKey: queryKeys.aspirationTrack(code),
    queryFn: () => aspirationService.track(code),
    enabled: Boolean(code),
  });
}

export function useSubmitAspiration() {
  return useMutation({
    mutationFn: (payload: AspirationPayload) => aspirationService.submit(payload),
  });
}
