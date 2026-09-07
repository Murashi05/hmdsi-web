import { useEffect, useState, type FormEvent } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { Plus, Search, CheckCircle, Clock, XCircle, AlertCircle, X, Loader2, AlertTriangle } from 'lucide-react';
import { apiClient } from '../../config/axios';
import type { ApiResponse, WorkProgram, PaginatedData, Department } from '../../services/api.types';

interface ProgramForm {
  name: string;
  description: string;
  department_id: string;
  status: string;
  planned_date: string;
  is_highlight: boolean;
  tags: string;
}

const EMPTY_FORM: ProgramForm = {
  name: '',
  description: '',
  department_id: '',
  status: 'planned',
  planned_date: '',
  is_highlight: false,
  tags: '',
};

const STATUS_CONFIG = {
  planned: { label: 'Planned', icon: Clock, color: 'text-blue-400 bg-blue-400/10' },
  in_progress: { label: 'In Progress', icon: AlertCircle, color: 'text-amber-400 bg-amber-400/10' },
  completed: { label: 'Completed', icon: CheckCircle, color: 'text-emerald-400 bg-emerald-400/10' },
  postponed: { label: 'Postponed', icon: Clock, color: 'text-orange-400 bg-orange-400/10' },
  cancelled: { label: 'Cancelled', icon: XCircle, color: 'text-red-400 bg-red-400/10' },
} as const;

export default function AdminProgramsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ProgramForm>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Work Programs · HMDSI Admin';
  }, []);

  const { data: programs, isLoading, error } = useQuery({
    queryKey: ['admin-programs', statusFilter, departmentFilter, page],
    queryFn: () =>
      apiClient
        .get<ApiResponse<PaginatedData<WorkProgram>>>('/admin/work-programs', {
          params: {
            status: statusFilter || undefined,
            department_id: departmentFilter || undefined,
            page,
            per_page: 12,
          },
        })
        .then((r) => r.data.data),
  });

  const { data: departments } = useQuery({
    queryKey: ['admin-departments-list'],
    queryFn: () =>
      apiClient.get<ApiResponse<Department[]>>('/admin/departments').then((r) => r.data.data),
  });

  const saveMutation = useMutation({
    mutationFn: () => {
      const tags = form.tags.split(',').map((t) => t.trim()).filter(Boolean);
      const body = {
        name: form.name,
        description: form.description || null,
        department_id: form.department_id ? Number(form.department_id) : null,
        status: form.status,
        planned_date: form.planned_date || null,
        is_highlight: form.is_highlight,
        tags,
      };
      if (editingId) {
        return apiClient.put(`/admin/work-programs/${editingId}`, body);
      }
      return apiClient.post('/admin/work-programs', body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-programs'] });
      closeModal();
    },
    onError: (err: any) => {
      setFormError(err?.response?.data?.message || 'Gagal menyimpan program kerja');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiClient.delete(`/admin/work-programs/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-programs'] }),
  });

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setShowModal(true);
  };

  const openEdit = (program: WorkProgram) => {
    setEditingId(program.id);
    setForm({
      name: program.name,
      description: program.description || '',
      department_id: String(program.department_id || ''),
      status: program.status,
      planned_date: program.planned_date?.split('T')[0] || '',
      is_highlight: program.is_highlight,
      tags: (program.tags || []).join(', '),
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
    if (!form.name.trim()) {
      setFormError('Nama program kerja wajib diisi');
      return;
    }
    saveMutation.mutate();
  };

  const filteredPrograms = programs?.items?.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-white font-sans font-bold text-xl">Program Kerja</h2>
          <p className="text-white/40 text-sm font-sans mt-1">
            Kelola program kerja departemen
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#0200B5] to-[#0000F0] text-white text-sm font-sans font-medium rounded-lg transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          Tambah Proker
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Cari proker..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:border-[#0200B5] focus:outline-none text-sm font-sans"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm font-sans focus:border-[#0200B5] focus:outline-none cursor-pointer"
        >
          <option value="">Semua Status</option>
          {Object.entries(STATUS_CONFIG).map(([value, config]) => (
            <option key={value} value={value}>{config.label}</option>
          ))}
        </select>
        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm font-sans focus:border-[#0200B5] focus:outline-none cursor-pointer"
        >
          <option value="">Semua Dept</option>
          {departments?.map((d: any) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-red-300 text-sm font-sans font-medium">Gagal memuat data</p>
            <p className="text-red-300/70 text-xs font-sans mt-1">{(error as any)?.message || 'Periksa koneksi Anda'}</p>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 animate-pulse">
              <div className="w-12 h-12 bg-white/10 rounded-xl mb-4" />
              <div className="h-5 bg-white/10 rounded w-3/4 mb-2" />
              <div className="h-4 bg-white/10 rounded w-1/2 mb-4" />
              <div className="h-8 bg-white/10 rounded" />
            </div>
          ))
        ) : filteredPrograms && filteredPrograms.length > 0 ? (
          filteredPrograms.map((program) => {
            const status = STATUS_CONFIG[program.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.planned;
            const StatusIcon = status.icon;
            return (
              <div
                key={program.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${status.color.split(' ')[0]}`}>
                    <StatusIcon className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEdit(program)}
                      className="p-1.5 text-white/40 hover:text-[#0200B5] hover:bg-white/10 rounded transition-colors"
                      title="Edit"
                    >
                      <Plus className="w-4 h-4 rotate-45" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Hapus "${program.name}"?`)) deleteMutation.mutate(program.id);
                      }}
                      className="p-1.5 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                      title="Hapus"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <h3 className="text-white font-sans font-bold text-sm mb-1 line-clamp-2">{program.name}</h3>
                <p className="text-white/40 text-xs font-sans mb-4">
                  {program.department?.name || '-'}
                </p>
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-sans font-medium ${status.color}`}>
                    <StatusIcon className="w-3 h-3" />
                    {status.label}
                  </span>
                  {program.is_highlight && (
                    <span className="px-2 py-1 bg-amber-500/10 text-amber-400 text-xs font-sans font-medium rounded-full">
                      ⭐ Highlight
                    </span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-12 text-center text-white/40 text-sm font-sans">
            {search || statusFilter || departmentFilter
              ? 'Tidak ada proker yang cocok'
              : 'Belum ada data proker'}
          </div>
        )}
      </div>

      {/* Pagination */}
      {programs?.pagination && programs.pagination.last_page > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-sm font-sans rounded-lg disabled:opacity-30 transition-colors"
          >
            ← Prev
          </button>
          <span className="text-white/40 text-sm font-sans px-3">
            {programs.pagination.current_page} / {programs.pagination.last_page}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page === programs.pagination.last_page}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-sm font-sans rounded-lg disabled:opacity-30 transition-colors"
          >
            Next →
          </button>
        </div>
      )}

      {/* Create/Edit Modal */}
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
                {editingId ? 'Edit Program Kerja' : 'Tambah Program Kerja'}
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
                  Nama Program <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 text-sm font-sans focus:border-[#0200B5] focus:outline-none"
                  placeholder="Nama program kerja"
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
                  rows={3}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 text-sm font-sans focus:border-[#0200B5] focus:outline-none resize-none"
                  placeholder="Deskripsi program..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans font-medium text-white/60 uppercase tracking-wider mb-1.5">Departemen</label>
                  <select
                    value={form.department_id}
                    onChange={(e) => setForm({ ...form, department_id: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm font-sans focus:border-[#0200B5] focus:outline-none cursor-pointer"
                  >
                    <option value="">Pilih departemen</option>
                    {departments?.map((d: any) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
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
                    {Object.entries(STATUS_CONFIG).map(([value, config]) => (
                      <option key={value} value={value}>{config.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-sans font-medium text-white/60 uppercase tracking-wider mb-1.5">
                  Tanggal Rencana
                </label>
                <input
                  type="date"
                  value={form.planned_date}
                  onChange={(e) => setForm({ ...form, planned_date: e.target.value })}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm font-sans focus:border-[#0200B5] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-sans font-medium text-white/60 uppercase tracking-wider mb-1.5">
                  Tags (pisah koma)
                </label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 text-sm font-sans focus:border-[#0200B5] focus:outline-none"
                  placeholder="kegiatan, seminar, workshop"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="highlight"
                  checked={form.is_highlight}
                  onChange={(e) => setForm({ ...form, is_highlight: e.target.checked })}
                  className="w-4 h-4 accent-[#0200B5]"
                />
                <label htmlFor="highlight" className="text-sm text-white/60 font-sans">
                  Tandai sebagai Program Unggulan
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
