import { useEffect, useState, type FormEvent } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { Plus, Search, Image, X, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { apiClient } from '../../config/axios';
import type { ApiResponse, GalleryEvent, PaginatedData } from '../../services/api.types';

interface AlbumForm {
  title: string;
  description: string;
  event_date: string;
  cover_image_url: string;
  is_published: boolean;
}

const EMPTY_FORM: AlbumForm = {
  title: '',
  description: '',
  event_date: '',
  cover_image_url: '',
  is_published: true,
};

export default function AdminGalleryPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<AlbumForm>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Gallery · HMDSI Admin';
  }, []);

  const { data: galleries, isLoading, error } = useQuery({
    queryKey: ['admin-galleries'],
    queryFn: () =>
      apiClient
        .get<ApiResponse<PaginatedData<GalleryEvent>>>('/admin/gallery', {
          params: { per_page: 20 },
        })
        .then((r) => r.data.data),
  });

  const saveMutation = useMutation({
    mutationFn: () => {
      const body = {
        title: form.title,
        description: form.description || null,
        event_date: form.event_date || null,
        cover_image_url: form.cover_image_url || null,
        is_published: form.is_published,
      };
      if (editingId) {
        return apiClient.put(`/admin/gallery/${editingId}`, body);
      }
      return apiClient.post('/admin/gallery', body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-galleries'] });
      closeModal();
    },
    onError: (err: any) => {
      setFormError(err?.response?.data?.message || 'Gagal menyimpan album');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiClient.delete(`/admin/gallery/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-galleries'] }),
  });

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setShowModal(true);
  };

  const openEdit = (gallery: GalleryEvent) => {
    setEditingId(gallery.id);
    setForm({
      title: gallery.title,
      description: gallery.description || '',
      event_date: gallery.event_date?.split('T')[0] || '',
      cover_image_url: gallery.cover_image_url || '',
      is_published: gallery.is_published,
    });
    setFormError(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!form.title.trim()) {
      setFormError('Judul album wajib diisi');
      return;
    }
    saveMutation.mutate();
  };

  const filteredGalleries = galleries?.items?.filter((g) =>
    g.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-white font-sans font-bold text-xl">Galeri</h2>
          <p className="text-white/40 text-sm font-sans mt-1">
            Kelola album & dokumentasi kegiatan
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#0200B5] to-[#0000F0] text-white text-sm font-sans font-medium rounded-lg transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          Tambah Album
        </button>
      </div>

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

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-red-300 text-sm font-sans font-medium">Gagal memuat data</p>
            <p className="text-red-300/70 text-xs font-sans mt-1">{(error as any)?.message || 'Periksa koneksi Anda'}</p>
          </div>
        </div>
      )}

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
                  <button
                    onClick={() => openEdit(gallery)}
                    className="flex-1 py-1.5 bg-[#0200B5]/80 hover:bg-[#0200B5] text-white text-xs font-sans font-medium rounded transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Hapus album ini?')) deleteMutation.mutate(gallery.id);
                    }}
                    className="p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeModal} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative bg-[#0a0a1a] border border-white/10 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-sans font-bold text-lg">
                {editingId ? 'Edit Album' : 'Album Baru'}
              </h3>
              <button onClick={closeModal} className="text-white/40 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {formError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm font-sans">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-sans font-medium text-white/60 uppercase tracking-wider mb-1.5">
                  Judul Album <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 text-sm font-sans focus:border-[#0200B5] focus:outline-none"
                  placeholder="Contoh: Mubes 2026"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-sans font-medium text-white/60 uppercase tracking-wider mb-1.5">
                  Deskripsi
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 text-sm font-sans focus:border-[#0200B5] focus:outline-none resize-none"
                  placeholder="Deskripsi singkat..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans font-medium text-white/60 uppercase tracking-wider mb-1.5">
                    Tanggal Kegiatan
                  </label>
                  <input
                    type="date"
                    value={form.event_date}
                    onChange={(e) => setForm({ ...form, event_date: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm font-sans focus:border-[#0200B5] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-sans font-medium text-white/60 uppercase tracking-wider mb-1.5">
                    URL Cover
                  </label>
                  <input
                    type="url"
                    value={form.cover_image_url}
                    onChange={(e) => setForm({ ...form, cover_image_url: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 text-sm font-sans focus:border-[#0200B5] focus:outline-none"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={form.is_published}
                  onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                  className="w-4 h-4 accent-[#0200B5]"
                />
                <label htmlFor="published" className="text-sm text-white/60 font-sans">
                  Publikasikan album
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white/70 text-sm font-sans font-medium rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#0200B5] to-[#0000F0] hover:from-[#0000B0] text-white text-sm font-sans font-medium rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saveMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingId ? 'Update' : 'Simpan'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
