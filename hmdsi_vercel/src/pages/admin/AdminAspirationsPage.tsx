import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, CheckCircle, Clock, AlertCircle, XCircle, MessageSquare, Reply, X } from 'lucide-react';
import { apiClient } from '../../config/axios';
import { aspirationService } from '../../services/aspiration.service';
import type { ApiResponse, Aspiration, AspirationStats, PaginatedData } from '../../services/api.types';

const STATUS_CONFIG = {
  submitted: { label: 'Submitted', icon: Clock, color: 'text-blue-400 bg-blue-400/10', bgColor: 'border-blue-400/20' },
  under_review: { label: 'Under Review', icon: AlertCircle, color: 'text-amber-400 bg-amber-400/10', bgColor: 'border-amber-400/20' },
  in_progress: { label: 'In Progress', icon: AlertCircle, color: 'text-orange-400 bg-orange-400/10', bgColor: 'border-orange-400/20' },
  resolved: { label: 'Resolved', icon: CheckCircle, color: 'text-emerald-400 bg-emerald-400/10', bgColor: 'border-emerald-400/20' },
  rejected: { label: 'Rejected', icon: XCircle, color: 'text-red-400 bg-red-400/10', bgColor: 'border-red-400/20' },
} as const;

export default function AdminAspirationsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedAspiration, setSelectedAspiration] = useState<Aspiration | null>(null);
  const [responseText, setResponseText] = useState('');

  useEffect(() => {
    document.title = 'Aspirations · HMDSI Admin';
  }, []);

  const { data: aspirations, isLoading } = useQuery({
    queryKey: ['admin-aspirations', statusFilter],
    queryFn: () =>
      apiClient
        .get<ApiResponse<PaginatedData<Aspiration>>>('/admin/aspirations', {
          params: {
            status: statusFilter || undefined,
            per_page: 20,
          },
        })
        .then((r) => r.data.data),
  });

  const { data: stats } = useQuery({
    queryKey: ['admin-aspirations-stats'],
    queryFn: aspirationService.getStats,
  });

  const respondMutation = useMutation({
    mutationFn: ({ id, message }: { id: number; message: string }) =>
      apiClient.post(`/admin/aspirations/${id}/respond`, { message }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-aspirations'] });
      setSelectedAspiration(null);
      setResponseText('');
    },
  });

  const filteredAspirations = aspirations?.items?.filter((a) =>
    a.subject.toLowerCase().includes(search.toLowerCase()) ||
    a.tracking_code.toLowerCase().includes(search.toLowerCase()) ||
    a.message.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-white font-sans font-bold text-xl">Kotak Aspirasi</h2>
          <p className="text-white/40 text-sm font-sans mt-1">
            Kelola & tanggapi aspirasi mahasiswa
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {Object.entries(STATUS_CONFIG).map(([key, config]) => {
            const count = key === 'submitted' ? stats.submitted :
              key === 'under_review' ? stats.under_review :
              key === 'in_progress' ? stats.in_progress :
              key === 'resolved' ? stats.resolved :
              key === 'rejected' ? stats.rejected : 0;
            return (
              <button
                key={key}
                onClick={() => setStatusFilter(statusFilter === key ? '' : key)}
                className={`p-4 rounded-xl border transition-all ${
                  statusFilter === key ? `${config.bgColor} bg-white/10` : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <config.icon className={`w-5 h-5 mb-2 ${config.color}`} />
                <p className="text-white text-xl font-sans font-black">{count}</p>
                <p className={`text-xs font-sans ${config.color}`}>{config.label}</p>
              </button>
            );
          })}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Cari aspirasi..."
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
      </div>

      {/* List */}
      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 animate-pulse">
              <div className="h-5 bg-white/10 rounded w-1/4 mb-3" />
              <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
              <div className="h-3 bg-white/10 rounded w-1/2" />
            </div>
          ))
        ) : filteredAspirations && filteredAspirations.length > 0 ? (
          filteredAspirations.map((aspiration) => {
            const status = STATUS_CONFIG[aspiration.status];
            const StatusIcon = status.icon;
            return (
              <div
                key={aspiration.id}
                className={`bg-white/5 border rounded-2xl p-4 hover:bg-white/10 transition-colors cursor-pointer ${status.bgColor}`}
                onClick={() => setSelectedAspiration(aspiration)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-white/30 text-xs font-sans font-mono">{aspiration.tracking_code}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-sans font-medium ${status.color} ${status.bgColor}`}>
                        <StatusIcon className="w-3 h-3 inline mr-1" />
                        {status.label}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-sans font-medium bg-white/5 text-white/40 capitalize">
                        {aspiration.category}
                      </span>
                      {aspiration.is_anonymous && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-sans font-medium bg-white/5 text-white/40">
                          👤 Anonim
                        </span>
                      )}
                    </div>
                    <h3 className="text-white font-sans font-bold text-sm mb-1">{aspiration.subject}</h3>
                    <p className="text-white/50 text-xs font-sans line-clamp-2">{aspiration.message}</p>
                    <div className="flex items-center gap-3 mt-3 text-white/30 text-xs font-sans">
                      <span>{aspiration.is_anonymous ? 'Anonim' : aspiration.display_name}</span>
                      <span>·</span>
                      <span>{new Date(aspiration.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      {aspiration.responses && aspiration.responses.length > 0 && (
                        <>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            {aspiration.responses.length} tanggapan
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedAspiration(aspiration);
                    }}
                    className="shrink-0 p-2 bg-[#0200B5]/10 text-[#0200B5] hover:bg-[#0200B5]/20 rounded-lg transition-colors"
                  >
                    <Reply className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center text-white/40 text-sm font-sans">
            {search || statusFilter
              ? 'Tidak ada aspirasi yang cocok'
              : 'Belum ada aspirasi masuk'}
          </div>
        )}
      </div>

      {/* Response Modal */}
      {selectedAspiration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSelectedAspiration(null)} />
          <div className="relative bg-[#0a0a1a] border border-white/10 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-sans font-bold text-lg">Detail Aspirasi</h3>
              <button onClick={() => setSelectedAspiration(null)} className="text-white/40 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-white/40 text-xs font-sans uppercase tracking-wider">Kode</label>
                <p className="text-white font-sans font-mono">{selectedAspiration.tracking_code}</p>
              </div>
              <div>
                <label className="text-white/40 text-xs font-sans uppercase tracking-wider">Subjek</label>
                <p className="text-white font-sans font-bold">{selectedAspiration.subject}</p>
              </div>
              <div>
                <label className="text-white/40 text-xs font-sans uppercase tracking-wider">Pesan</label>
                <p className="text-white/70 font-sans text-sm">{selectedAspiration.message}</p>
              </div>
              <div>
                <label className="text-white/40 text-xs font-sans uppercase tracking-wider">Pengirim</label>
                <p className="text-white font-sans">
                  {selectedAspiration.is_anonymous ? 'Anonim' : selectedAspiration.display_name}
                  {selectedAspiration.sender_email && ` (${selectedAspiration.sender_email})`}
                </p>
              </div>
              {selectedAspiration.responses && selectedAspiration.responses.length > 0 && (
                <div>
                  <label className="text-white/40 text-xs font-sans uppercase tracking-wider">Tanggapan Sebelumnya</label>
                  <div className="space-y-2 mt-2">
                    {selectedAspiration.responses.map((r) => (
                      <div key={r.id} className="p-3 bg-white/5 rounded-lg">
                        <p className="text-white/70 text-sm">{r.message}</p>
                        <p className="text-white/30 text-xs mt-2">
                          {new Date(r.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <label className="text-white/40 text-xs font-sans uppercase tracking-wider mb-2 block">Balas Aspirasi</label>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Tulis tanggapan..."
                  rows={4}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:border-[#0200B5] focus:outline-none text-sm font-sans resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedAspiration(null)}
                  className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white/60 text-sm font-sans font-medium rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={() => respondMutation.mutate({ id: selectedAspiration.id, message: responseText })}
                  disabled={!responseText.trim() || respondMutation.isPending}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#0200B5] to-[#0000F0] text-white text-sm font-sans font-medium rounded-lg transition-all disabled:opacity-50"
                >
                  {respondMutation.isPending ? 'Mengirim...' : 'Kirim Tanggapan'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
