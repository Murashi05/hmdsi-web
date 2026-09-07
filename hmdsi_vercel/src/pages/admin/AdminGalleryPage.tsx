import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Image, Upload, X, Eye } from 'lucide-react';
import { apiClient } from '../../config/axios';
import type { ApiResponse, GalleryEvent, PaginatedData } from '../../services/api.types';

export default function AdminGalleryPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');

  useEffect(() => {
    document.title = 'Gallery · HMDSI Admin';
  }, []);

  const { data: galleries, isLoading } = useQuery({
    queryKey: ['admin-galleries'],
    queryFn: () =>
      apiClient
        .get<ApiResponse<PaginatedData<GalleryEvent>>>('/admin/gallery', {
          params: { per_page: 20 },
        })
        .then((r) => r.data.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiClient.delete(`/admin/gallery/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-galleries'] }),
  });

  const filteredGalleries = galleries?.items?.filter((g) =>
    g.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-white font-sans font-bold text-xl">Galeri</h2>
          <p className="text-white/40 text-sm font-sans mt-1">
            Kelola album & dokumentasi kegiatan
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#0200B5] to-[#0000F0] text-white text-sm font-sans font-medium rounded-lg transition-all shrink-0">
          <Plus className="w-4 h-4" />
          Tambah Album
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        <input
          type="text"
          placeholder="Cari album..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:border-[#0200B5] focus:outline-none text-sm font-sans"
        />
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square bg-white/5 rounded-2xl animate-pulse" />
          ))
        ) : filteredGalleries && filteredGalleries.length > 0 ? (
          filteredGalleries.map((gallery) => (
            <div
              key={gallery.id}
              className="group relative aspect-square bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-colors"
            >
              {gallery.cover_image_url ? (
                <img
                  src={gallery.cover_image_url}
                  alt={gallery.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0200B5]/20 to-[#0000F0]/20">
                  <Image className="w-12 h-12 text-white/20" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform">
                <p className="text-white font-sans font-bold text-sm line-clamp-1">{gallery.title}</p>
                <p className="text-white/60 text-xs font-sans mt-1">
                  {gallery.items_count || 0} foto
                  {gallery.event_date && ` · ${new Date(gallery.event_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <button className="flex-1 py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-sans font-medium rounded flex items-center justify-center gap-1.5">
                    <Eye className="w-3 h-3" /> Lihat
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Hapus album ini?')) deleteMutation.mutate(gallery.id);
                    }}
                    className="p-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              {!gallery.is_published && (
                <span className="absolute top-3 right-3 px-2 py-1 bg-amber-500/80 text-white text-[10px] font-sans font-bold rounded">
                  DRAFT
                </span>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-white/40 text-sm font-sans">
            {search ? 'Tidak ada album yang cocok' : 'Belum ada album. Buat album pertama!'}
          </div>
        )}
      </div>
    </div>
  );
}
