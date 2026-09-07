import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, FileText, Download, Trash2, ExternalLink } from 'lucide-react';
import { apiClient } from '../../config/axios';
import type { ApiResponse, ArchiveResource, PaginatedData } from '../../services/api.types';

const CATEGORY_LABELS: Record<string, string> = {
  syllabus: 'Silabus',
  exam_bank: 'Bank Soal',
  module: 'Modul',
  org_template: 'Template',
  other: 'Lainnya',
};

const CATEGORY_COLORS: Record<string, string> = {
  syllabus: 'bg-blue-500/10 text-blue-400',
  exam_bank: 'bg-amber-500/10 text-amber-400',
  module: 'bg-emerald-500/10 text-emerald-400',
  org_template: 'bg-purple-500/10 text-purple-400',
  other: 'bg-gray-500/10 text-gray-400',
};

export default function AdminResourcesPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    document.title = 'Resources · HMDSI Admin';
  }, []);

  const { data: resources, isLoading } = useQuery({
    queryKey: ['admin-resources', categoryFilter],
    queryFn: () =>
      apiClient
        .get<ApiResponse<PaginatedData<ArchiveResource>>>('/admin/resources', {
          params: {
            category: categoryFilter || undefined,
            per_page: 30,
          },
        })
        .then((r) => r.data.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiClient.delete(`/admin/resources/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-resources'] }),
  });

  const filteredResources = resources?.items?.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.subject?.toLowerCase().includes(search.toLowerCase())
  );

  const formatSize = (kb: number | null) => {
    if (!kb) return 'Unknown';
    if (kb < 1024) return `${kb} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-white font-sans font-bold text-xl">Resources & Arsip</h2>
          <p className="text-white/40 text-sm font-sans mt-1">
            Kelola dokumen, silabus, dan bank soal
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#0200B5] to-[#0000F0] text-white text-sm font-sans font-medium rounded-lg transition-all shrink-0">
          <Plus className="w-4 h-4" />
          Upload Dokumen
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Cari dokumen..."
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
          {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {/* List */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-4 py-3 text-left text-xs font-sans font-bold text-white/40 uppercase tracking-wider">Dokumen</th>
                <th className="px-4 py-3 text-left text-xs font-sans font-bold text-white/40 uppercase tracking-wider">Kategori</th>
                <th className="px-4 py-3 text-left text-xs font-sans font-bold text-white/40 uppercase tracking-wider">Subject</th>
                <th className="px-4 py-3 text-left text-xs font-sans font-bold text-white/40 uppercase tracking-wider">Size</th>
                <th className="px-4 py-3 text-left text-xs font-sans font-bold text-white/40 uppercase tracking-wider">Downloads</th>
                <th className="px-4 py-3 text-right text-xs font-sans font-bold text-white/40 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <div className="flex justify-center">
                      <div className="w-8 h-8 border-2 border-[#0200B5] border-t-transparent rounded-full animate-spin" />
                    </div>
                  </td>
                </tr>
              ) : filteredResources && filteredResources.length > 0 ? (
                filteredResources.map((resource) => (
                  <tr key={resource.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#0200B5]/20 to-[#0000F0]/20 flex items-center justify-center">
                          <FileText className="w-4 h-4 text-[#0200B5]" />
                        </div>
                        <div>
                          <p className="text-white text-sm font-sans font-medium">{resource.title}</p>
                          {resource.academic_year && (
                            <p className="text-white/40 text-xs font-sans">
                              {resource.academic_year} {resource.semester ? `· Semester ${resource.semester}` : ''}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-sans font-medium ${CATEGORY_COLORS[resource.category] || CATEGORY_COLORS.other}`}>
                        {CATEGORY_LABELS[resource.category] || resource.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white/60 text-sm font-sans">{resource.subject || '-'}</td>
                    <td className="px-4 py-3 text-white/60 text-sm font-sans">{formatSize(resource.file_size_kb)}</td>
                    <td className="px-4 py-3 text-white/60 text-sm font-sans">{resource.download_count || 0}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <a
                          href={resource.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-white/40 hover:text-[#0200B5] hover:bg-white/10 rounded transition-colors"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => {
                            if (confirm('Hapus dokumen ini?')) deleteMutation.mutate(resource.id);
                          }}
                          className="p-1.5 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-white/40 text-sm font-sans">
                    {search || categoryFilter
                      ? 'Tidak ada dokumen yang cocok'
                      : 'Belum ada dokumen. Upload dokumen pertama!'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
