import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../config/query-keys';
import { galleryService } from '../services/gallery.service';

export function useGalleryEvents(filters?: { period_id?: number; page?: number }) {
  return useQuery({
    queryKey: queryKeys.gallery(filters),
    queryFn: () => galleryService.getEvents(filters),
  });
}

export function useGalleryEvent(slug: string) {
  return useQuery({
    queryKey: queryKeys.galleryEvent(slug),
    queryFn: () => galleryService.getEvent(slug),
    enabled: Boolean(slug),
  });
}
