import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Filter, CheckCircle, Clock, XCircle, AlertCircle, X } from 'lucide-react';
import { apiClient } from '../../config/axios';
import type { ApiResponse, WorkProgram, PaginatedData, Department } from '../../services/api.types';

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

  useEffect(() => {
    document.title = 'Work Programs · HMDSI Admin';
  }, []);

  const { data: programs, isLoading } = useQuery({
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
    queryKey: ['admin-departments'],
    queryFn: () =>
      apiClient.get<ApiResponse<any[]>>('/admin/departments').then((r) => r.data.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiClient.delete(`/admin/work-programs/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-programs'] }),
  });

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
        <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#0200B5] to-[#0000F0] text-white text-sm font-sans font-medium rounded-lg transition-all shrink-0">
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

      {/* Grid View */}
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
            const status = STATUS_CONFIG[program.status];
            const StatusIcon = status.icon;
            return (
              <div
                key={program.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-[#0200B5]/20 to-[#0000F0]/20 flex items-center justify-center ${status.color.split(' ')[0]}`}>
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <button
                    onClick={() => {
                      if (confirm('Hapus proker ini?')) deleteMutation.mutate(program.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-red-400 hover:bg-red-500/10 rounded transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="text-white font-sans font-bold text-sm mb-1 line-clamp-2">{program.name}</h3>
                <p className="text-white/40 text-xs font-sans mb-4">
                  {program.department?.name || '-'}
                </p>
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-sans font-medium capitalize ${status.color}`}>
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
    </div>
  );
}
