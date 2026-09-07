import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../config/query-keys';
import { workProgramService, type WorkProgramFilters } from '../services/work-program.service';

export function useWorkPrograms(filters?: WorkProgramFilters) {
  return useQuery({
    queryKey: queryKeys.workPrograms(filters),
    queryFn: () => workProgramService.getWorkPrograms(filters),
  });
}

export function useWorkProgramHighlights() {
  return useQuery({
    queryKey: queryKeys.workProgramHighlights,
    queryFn: () => workProgramService.getHighlights(),
  });
}

export function useWorkProgram(slug: string) {
  return useQuery({
    queryKey: queryKeys.workProgram(slug),
    queryFn: () => workProgramService.getBySlug(slug),
    enabled: Boolean(slug),
  });
}
