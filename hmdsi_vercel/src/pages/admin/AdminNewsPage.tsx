import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, Search, Eye, FileText, X } from 'lucide-react';
import { apiClient } from '../../config/axios';
import type { ApiResponse, NewsArticle, PaginatedData } from '../../services/api.types';

const CATEGORY_COLORS: Record<string, string> = {
  news: 'bg-blue-500/10 text-blue-400',
  announcement: 'bg-red-500/10 text-red-400',
  achievement: 'bg-amber-500/10 text-amber-400',
  academic: 'bg-emerald-500/10 text-emerald-400',
  event: 'bg-purple-500/10 text-purple-400',
};

export default function AdminNewsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    document.title = 'News · HMDSI Admin';
  }, []);

  const { data: news, isLoading } = useQuery({
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

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiClient.delete(`/admin/news/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-news'] }),
  });

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
        <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#0200B5] to-[#0000F0] text-white text-sm font-sans font-medium rounded-lg transition-all shrink-0">
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
          <option value="news">News</option>
          <option value="announcement">Announcement</option>
          <option value="achievement">Achievement</option>
          <option value="academic">Academic</option>
          <option value="event">Event</option>
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
                    <span className={`px-2 py-0.5 rounded-full text-xs font-sans font-medium capitalize ${
                      article.status === 'published' ? 'bg-emerald-500/10 text-emerald-400' :
                      article.status === 'draft' ? 'bg-amber-500/10 text-amber-400' :
                      'bg-gray-500/10 text-gray-400'
                    }`}>
                      {article.status}
                    </span>
                    {article.is_featured && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-sans font-medium bg-amber-500/10 text-amber-400">
                        ⭐ Featured
                      </span>
                    )}
                  </div>
                  <h3 className="text-white font-sans font-bold text-sm line-clamp-1 mb-1">
                    {article.title}
                  </h3>
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
                  <button className="p-2 text-white/40 hover:text-[#0200B5] hover:bg-white/10 rounded transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Hapus artikel ini?')) deleteMutation.mutate(article.id);
                    }}
                    className="p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
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
    </div>
  );
}
