import { useEffect, useState, type FormEvent } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { Plus, Edit2, Trash2, Search, Eye, FileText, X, Loader2, AlertCircle } from 'lucide-react';
import { apiClient } from '../../config/axios';
import type { ApiResponse, NewsArticle, PaginatedData } from '../../services/api.types';

interface ArticleForm {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  status: string;
  is_featured: boolean;
  cover_image_url: string;
  tags: string;
}

const EMPTY_FORM: ArticleForm = {
  title: '',
  excerpt: '',
  content: '',
  category: 'news',
  status: 'draft',
  is_featured: false,
  cover_image_url: '',
  tags: '',
};

const CATEGORIES = [
  { value: 'news', label: 'News' },
  { value: 'announcement', label: 'Announcement' },
  { value: 'achievement', label: 'Achievement' },
  { value: 'academic', label: 'Academic' },
  { value: 'event', label: 'Event' },
];

const CATEGORY_COLORS: Record<string, string> = {
  news: 'bg-blue-500/10 text-blue-400',
  announcement: 'bg-red-500/10 text-red-400',
  achievement: 'bg-amber-500/10 text-amber-400',
  academic: 'bg-emerald-500/10 text-emerald-400',
  event: 'bg-purple-500/10 text-purple-400',
};

const STATUS_COLORS: Record<string, string> = {
  published: 'bg-emerald-500/10 text-emerald-400',
  draft: 'bg-amber-500/10 text-amber-400',
  archived: 'bg-gray-500/10 text-gray-400',
};

export default function AdminNewsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ArticleForm>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'News · HMDSI Admin';
  }, []);

  const { data: news, isLoading, error } = useQuery({
    queryKey: ['admin-news', categoryFilter, statusFilter],
    queryFn: () =>
      apiClient
        .get<ApiResponse<PaginatedData<NewsArticle>>>('/admin/news', {
          params: {
            category: categoryFilter || undefined,
            status: statusFilter || undefined,
            per_page: 20,
          },
        })
        .then((r) => r.data.data),
  });

  const saveMutation = useMutation({
    mutationFn: () => {
      const tags = form.tags.split(',').map((t) => t.trim()).filter(Boolean);
      const body = {
        title: form.title,
        excerpt: form.excerpt,
        content: form.content,
        category: form.category,
        status: form.status,
        is_featured: form.is_featured,
        cover_image_url: form.cover_image_url || null,
        tags,
      };
      if (editingId) {
        return apiClient.put(`/admin/news/${editingId}`, body);
      }
      return apiClient.post('/admin/news', body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-news'] });
      closeModal();
    },
    onError: (err: any) => {
      setFormError(err?.response?.data?.message || 'Gagal menyimpan artikel');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiClient.delete(`/admin/news/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-news'] }),
  });

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setShowModal(true);
  };

  const openEdit = (article: NewsArticle) => {
    setEditingId(article.id);
    setForm({
      title: article.title,
      excerpt: article.excerpt || '',
      content: article.content || '',
      category: article.category,
      status: article.status,
      is_featured: article.is_featured,
      cover_image_url: article.cover_image_url || '',
      tags: (article.tags || []).join(', '),
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
      setFormError('Judul artikel wajib diisi');
      return;
    }
    saveMutation.mutate();
  };

  const filteredNews = news?.items?.filter((n) =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.excerpt?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-white font-sans font-bold text-xl">Berita & Artikel</h2>
          <p className="text-white/40 text-sm font-sans mt-1">
            Kelola semua artikel website
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#0200B5] to-[#0000F0] text-white text-sm font-sans font-medium rounded-lg transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          Tulis Artikel
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Cari artikel..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:border-[#0200B5] focus:outline-none text-sm font-sans"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm font-sans focus:border-[#0200B5] focus:outline-none cursor-pointer"
        >
          <option value="">Semua Kategori</option>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm font-sans focus:border-[#0200B5] focus:outline-none cursor-pointer"
        >
          <option value="">Semua Status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-red-300 text-sm font-sans font-medium">Gagal memuat data</p>
            <p className="text-red-300/70 text-xs font-sans mt-1">{(error as any)?.message || 'Periksa koneksi Anda'}</p>
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/10 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-white/10 rounded w-1/3" />
                  <div className="h-3 bg-white/10 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))
        ) : filteredNews && filteredNews.length > 0 ? (
          filteredNews.map((article) => (
            <div
              key={article.id}
              className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                  {article.cover_image_url ? (
                    <img src={article.cover_image_url} alt={article.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#0200B5] to-[#0000F0] flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-sans font-medium capitalize ${CATEGORY_COLORS[article.category] || CATEGORY_COLORS.news}`}>
                      {article.category}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-sans font-medium capitalize ${STATUS_COLORS[article.status]}`}>
                      {article.status}
                    </span>
                    {article.is_featured && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-sans font-medium bg-amber-500/10 text-amber-400">
                        ⭐ Featured
                      </span>
                    )}
                  </div>
                  <h3 className="text-white font-sans font-bold text-sm line-clamp-1 mb-1">{article.title}</h3>
                  {article.excerpt && (
                    <p className="text-white/40 text-xs font-sans line-clamp-1">{article.excerpt}</p>
                  )}
                  <p className="text-white/30 text-xs font-sans mt-2 flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" /> {article.view_count || 0}
                    </span>
                    {article.published_at && (
                      <span>
                        {new Date(article.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => openEdit(article)}
                    className="p-2 text-white/40 hover:text-[#0200B5] hover:bg-white/10 rounded transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Hapus artikel ini?')) deleteMutation.mutate(article.id);
                    }}
                    disabled={deleteMutation.isPending}
                    className="p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors disabled:opacity-50"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center text-white/40 text-sm font-sans">
            {search || categoryFilter || statusFilter
              ? 'Tidak ada artikel yang cocok'
              : 'Belum ada artikel. Buat artikel pertama Anda!'}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeModal} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative bg-[#0a0a1a] border border-white/10 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-sans font-bold text-lg">
                {editingId ? 'Edit Artikel' : 'Tulis Artikel Baru'}
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
                  Judul <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 text-sm font-sans focus:border-[#0200B5] focus:outline-none"
                  placeholder="Judul artikel"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-sans font-medium text-white/60 uppercase tracking-wider mb-1.5">
                  Excerpt / Ringkasan
                </label>
                <textarea
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 text-sm font-sans focus:border-[#0200B5] focus:outline-none resize-none"
                  placeholder="Ringkasan singkat untuk preview..."
                />
              </div>

              <div>
                <label className="block text-xs font-sans font-medium text-white/60 uppercase tracking-wider mb-1.5">
                  Konten (HTML)
                </label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  rows={8}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 text-sm font-sans focus:border-[#0200B5] focus:outline-none resize-y font-mono"
                  placeholder="<p>Konten artikel...</p>"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans font-medium text-white/60 uppercase tracking-wider mb-1.5">Kategori</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm font-sans focus:border-[#0200B5] focus:outline-none cursor-pointer"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-sans font-medium text-white/60 uppercase tracking-wider mb-1.5">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm font-sans focus:border-[#0200B5] focus:outline-none cursor-pointer"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-sans font-medium text-white/60 uppercase tracking-wider mb-1.5">URL Cover Image</label>
                <input
                  type="url"
                  value={form.cover_image_url}
                  onChange={(e) => setForm({ ...form, cover_image_url: e.target.value })}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 text-sm font-sans focus:border-[#0200B5] focus:outline-none"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-xs font-sans font-medium text-white/60 uppercase tracking-wider mb-1.5">Tags (pisah koma)</label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 text-sm font-sans focus:border-[#0200B5] focus:outline-none"
                  placeholder="tag1, tag2, tag3"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={form.is_featured}
                  onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                  className="w-4 h-4 accent-[#0200B5]"
                />
                <label htmlFor="featured" className="text-sm text-white/60 font-sans">
                  Tandai sebagai Featured Article
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
                  {editingId ? 'Update' : 'Publikasikan'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
