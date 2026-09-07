import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../config/query-keys';
import { aboutService } from '../services/about.service';

export function useAboutContent() {
  return useQuery({
    queryKey: queryKeys.about,
    queryFn: aboutService.getAbout,
  });
}
