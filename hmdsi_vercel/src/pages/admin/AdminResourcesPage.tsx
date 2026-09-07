import { useEffect, useState, type FormEvent } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { Plus, Search, FileText, X, Trash2, Edit2, Download, Loader2, AlertCircle } from 'lucide-react';
import { apiClient } from '../../config/axios';
import type { ApiResponse, ArchiveResource, PaginatedData } from '../../services/api.types';

interface ResourceForm {
  title: string;
  description: string;
  category: string;
  file_url: string;
  file_type: string;
  file_size_kb: string;
  academic_year: string;
  semester: string;
  subject: string;
}

const EMPTY_FORM: ResourceForm = {
  title: '',
  description: '',
  category: 'other',
  file_url: '',
  file_type: '',
  file_size_kb: '',
  academic_year: '',
  semester: '',
  subject: '',
};

const CATEGORIES = [
  { value: 'syllabus', label: 'Syllabus' },
  { value: 'exam_bank', label: 'Bank Soal' },
  { value: 'module', label: 'Modul' },
  { value: 'org_template', label: 'Template Organisasi' },
  { value: 'other', label: 'Lainnya' },
];

export default function AdminResourcesPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ResourceForm>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Resources · HMDSI Admin';
  }, []);

  const { data: resources, isLoading, error } = useQuery({
    queryKey: ['admin-resources', categoryFilter],
    queryFn: () =>
      apiClient
        .get<ApiResponse<PaginatedData<ArchiveResource>>>('/admin/resources', {
          params: { category: categoryFilter || undefined, per_page: 20 },
        })
        .then((r) => r.data.data),
  });

  const saveMutation = useMutation({
    mutationFn: () => {
      const body = {
        title: form.title,
        description: form.description || null,
        category: form.category,
        file_url: form.file_url,
        file_type: form.file_type || null,
        file_size_kb: form.file_size_kb ? Number(form.file_size_kb) : null,
        academic_year: form.academic_year || null,
        semester: form.semester ? Number(form.semester) : null,
        subject: form.subject || null,
      };
      if (editingId) {
        return apiClient.put(`/admin/resources/${editingId}`, body);
      }
      return apiClient.post('/admin/resources', body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-resources'] });
      closeModal();
    },
    onError: (err: any) => {
      setFormError(err?.response?.data?.message || 'Gagal menyimpan dokumen');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiClient.delete(`/admin/resources/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-resources'] }),
  });

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setShowModal(true);
  };

  const openEdit = (resource: ArchiveResource) => {
    setEditingId(resource.id);
    setForm({
      title: resource.title,
      description: resource.description || '',
      category: resource.category,
      file_url: resource.file_url,
      file_type: resource.file_type || '',
      file_size_kb: resource.file_size_kb ? String(resource.file_size_kb) : '',
      academic_year: resource.academic_year || '',
      semester: resource.semester ? String(resource.semester) : '',
      subject: resource.subject || '',
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
    if (!form.title.trim() || !form.file_url.trim()) {
      setFormError('Judul dan URL file wajib diisi');
      return;
    }
    saveMutation.mutate();
  };

  const filteredResources = resources?.items?.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.subject?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-white font-sans font-bold text-xl">Resources / Archive</h2>
          <p className="text-white/40 text-sm font-sans mt-1">
            Kelola dokumen & arsip himpunan
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#0200B5] to-[#0000F0] text-white text-sm font-sans font-medium rounded-lg transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          Tambah Dokumen
        </button>
      </div>

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
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
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

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 animate-pulse">
              <div className="h-5 bg-white/10 rounded w-3/4 mb-3" />
              <div className="h-4 bg-white/10 rounded w-1/2" />
            </div>
          ))
        ) : filteredResources && filteredResources.length > 0 ? (
          filteredResources.map((resource) => (
            <div
              key={resource.id}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#0200B5]/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#0200B5]" />
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEdit(resource)}
                    className="p-1.5 text-white/40 hover:text-[#0200B5] hover:bg-white/10 rounded transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Hapus dokumen ini?')) deleteMutation.mutate(resource.id);
                    }}
                    className="p-1.5 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="text-white font-sans font-bold text-sm line-clamp-2 mb-1">{resource.title}</h3>
              {resource.subject && (
                <p className="text-white/40 text-xs font-sans mb-2">{resource.subject}</p>
              )}
              <div className="flex items-center gap-2 text-xs font-sans text-white/30 flex-wrap">
                <span className="px-2 py-0.5 bg-white/5 rounded-full capitalize">
                  {CATEGORIES.find((c) => c.value === resource.category)?.label || resource.category}
                </span>
                {resource.academic_year && <span>· {resource.academic_year}</span>}
                {resource.file_size_kb && <span>· {Math.round(resource.file_size_kb / 1024 * 10) / 10} MB</span>}
              </div>
              <div className="flex items-center gap-2 mt-3 text-white/30 text-xs font-sans">
                <Download className="w-3 h-3" /> {resource.download_count || 0} unduhan
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-white/40 text-sm font-sans">
            {search || categoryFilter ? 'Tidak ada dokumen yang cocok' : 'Belum ada dokumen'}
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
                {editingId ? 'Edit Dokumen' : 'Dokumen Baru'}
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
                  placeholder="Judul dokumen"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-sans font-medium text-white/60 uppercase tracking-wider mb-1.5">
                  URL File <span className="text-red-400">*</span>
                </label>
                <input
                  type="url"
                  value={form.file_url}
                  onChange={(e) => setForm({ ...form, file_url: e.target.value })}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 text-sm font-sans focus:border-[#0200B5] focus:outline-none"
                  placeholder="https://drive.google.com/..."
                  required
                />
              </div>

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
                <label className="block text-xs font-sans font-medium text-white/60 uppercase tracking-wider mb-1.5">
                  Mata Kuliah
                </label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 text-sm font-sans focus:border-[#0200B5] focus:outline-none"
                  placeholder="Sistem Informasi Manajemen"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-sans font-medium text-white/60 uppercase tracking-wider mb-1.5">Tahun</label>
                  <input
                    type="text"
                    value={form.academic_year}
                    onChange={(e) => setForm({ ...form, academic_year: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 text-sm font-sans focus:border-[#0200B5] focus:outline-none"
                    placeholder="2024/2025"
                  />
                </div>
                <div>
                  <label className="block text-xs font-sans font-medium text-white/60 uppercase tracking-wider mb-1.5">Smt</label>
                  <input
                    type="number"
                    min="1"
                    max="14"
                    value={form.semester}
                    onChange={(e) => setForm({ ...form, semester: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm font-sans focus:border-[#0200B5] focus:outline-none"
                    placeholder="1-14"
                  />
                </div>
                <div>
                  <label className="block text-xs font-sans font-medium text-white/60 uppercase tracking-wider mb-1.5">Size (KB)</label>
                  <input
                    type="number"
                    value={form.file_size_kb}
                    onChange={(e) => setForm({ ...form, file_size_kb: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm font-sans focus:border-[#0200B5] focus:outline-none"
                    placeholder="1024"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-sans font-medium text-white/60 uppercase tracking-wider mb-1.5">
                  Tipe File
                </label>
                <input
                  type="text"
                  value={form.file_type}
                  onChange={(e) => setForm({ ...form, file_type: e.target.value })}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 text-sm font-sans focus:border-[#0200B5] focus:outline-none"
                  placeholder="pdf, docx, xlsx, ..."
                />
              </div>

              <div>
                <label className="block text-xs font-sans font-medium text-white/60 uppercase tracking-wider mb-1.5">Deskripsi</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 text-sm font-sans focus:border-[#0200B5] focus:outline-none resize-none"
                  placeholder="Catatan tambahan..."
                />
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
