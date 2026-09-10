import { useEffect, useState, type FormEvent } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, RefreshCw, Globe, Palette, Plus, Image as ImageIcon, Loader2, X } from 'lucide-react';
import { motion } from 'motion/react';
import { apiClient } from '../../config/axios';
import type { ApiResponse, Period, SiteStat, AboutContent } from '../../services/api.types';

interface PeriodForm {
  name: string;
  theme: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

const EMPTY_PERIOD: PeriodForm = {
  name: '',
  theme: '',
  start_date: '',
  end_date: '',
  is_active: false,
};

export default function AdminSettingsPage() {
  const queryClient = useQueryClient();

  useEffect(() => {
    document.title = 'Settings · HMDSI Admin';
  }, []);

  const { data: about } = useQuery({
    queryKey: ['admin-about'],
    queryFn: () => apiClient.get<ApiResponse<AboutContent>>('/admin/about').then((r) => r.data.data),
  });

  const { data: periods } = useQuery({
    queryKey: ['admin-periods'],
    queryFn: () => apiClient.get<ApiResponse<Period[]>>('/admin/periods').then((r) => r.data.data),
  });

  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => apiClient.get<ApiResponse<any[]>>('/admin/stats').then((r) => r.data.data),
  });

  // About form state
  const [aboutForm, setAboutForm] = useState({ vision: '', history: '' });
  useEffect(() => {
    if (about) {
      setAboutForm({
        vision: about.vision || '',
        history: about.organization_history || '',
      });
    }
  }, [about]);

  // Stats form state (key -> value)
  const [statsForm, setStatsForm] = useState<Record<string, string>>({});
  useEffect(() => {
    if (stats) {
      const next: Record<string, string> = {};
      stats.forEach((s: any) => { next[s.key] = String(s.value ?? ''); });
      setStatsForm(next);
    }
  }, [stats]);

  // Period modal state
  const [showPeriodModal, setShowPeriodModal] = useState(false);
  const [editingPeriodId, setEditingPeriodId] = useState<number | null>(null);
  const [periodForm, setPeriodForm] = useState<PeriodForm>(EMPTY_PERIOD);

  const aboutMutation = useMutation({
    mutationFn: () => {
      const body = {
        vision: aboutForm.vision || null,
        organization_history: aboutForm.history || null,
      };
      if (about?.id) {
        return apiClient.put(`/admin/about/${about.id}`, body);
      }
      return apiClient.put('/admin/about', body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-about'] });
      queryClient.invalidateQueries({ queryKey: ['public-about'] });
    },
  });

  const statsMutation = useMutation({
    mutationFn: () => {
      const stats = Object.entries(statsForm).map(([key, value]) => ({ key, value }));
      return apiClient.put('/admin/stats', { stats });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      queryClient.invalidateQueries({ queryKey: ['public-stats'] });
    },
  });

  const periodMutation = useMutation({
    mutationFn: () => {
      const body = {
        name: periodForm.name,
        theme: periodForm.theme || null,
        start_date: periodForm.start_date,
        end_date: periodForm.end_date,
        is_active: periodForm.is_active,
      };
      if (editingPeriodId) {
        return apiClient.put(`/admin/periods/${editingPeriodId}`, body);
      }
      return apiClient.post('/admin/periods', body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-periods'] });
      closePeriodModal();
    },
  });

  const deletePeriodMutation = useMutation({
    mutationFn: (id: number) => apiClient.delete(`/admin/periods/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-periods'] }),
  });

  const openCreatePeriod = () => {
    setEditingPeriodId(null);
    setPeriodForm(EMPTY_PERIOD);
    setShowPeriodModal(true);
  };

  const openEditPeriod = (period: Period) => {
    setEditingPeriodId(period.id);
    setPeriodForm({
      name: period.name,
      theme: period.theme || '',
      start_date: period.start_date?.split('T')[0] || '',
      end_date: period.end_date?.split('T')[0] || '',
      is_active: period.is_active,
    });
    setShowPeriodModal(true);
  };

  const closePeriodModal = () => {
    setShowPeriodModal(false);
    setEditingPeriodId(null);
    setPeriodForm(EMPTY_PERIOD);
  };

  const handlePeriodSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!periodForm.start_date || !periodForm.end_date || !periodForm.theme.trim()) {
      return;
    }
    periodMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-white font-sans font-bold text-xl">Pengaturan</h2>
        <p className="text-white/40 text-sm font-sans mt-1">
          Konfigurasi website dan konten utama
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* About Content */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0200B5] to-[#0000F0] flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-sans font-bold">Tentang Kami</h3>
              <p className="text-white/40 text-xs font-sans">Edit konten halaman About</p>
            </div>
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); aboutMutation.mutate(); }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-sans font-medium text-white/60 uppercase tracking-wider mb-1.5">Visi</label>
              <textarea
                value={aboutForm.vision}
                onChange={(e) => setAboutForm({ ...aboutForm, vision: e.target.value })}
                rows={3}
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm font-sans focus:border-[#0200B5] focus:outline-none resize-none"
                placeholder="Tulis visi organisasi..."
              />
            </div>
            <div>
              <label className="block text-xs font-sans font-medium text-white/60 uppercase tracking-wider mb-1.5">Sejarah</label>
              <textarea
                value={aboutForm.history}
                onChange={(e) => setAboutForm({ ...aboutForm, history: e.target.value })}
                rows={5}
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm font-sans focus:border-[#0200B5] focus:outline-none resize-none"
                placeholder="Sejarah organisasi..."
              />
            </div>
            <button
              type="submit"
              disabled={aboutMutation.isPending}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#0200B5] to-[#0000F0] text-white text-sm font-sans font-medium rounded-lg transition-all disabled:opacity-50"
            >
              {aboutMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {aboutMutation.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
            {aboutMutation.isSuccess && (
              <p className="text-emerald-400 text-xs font-sans">✓ Tersimpan</p>
            )}
          </form>
        </div>

        {/* Site Stats */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-sans font-bold">Statistik Website</h3>
              <p className="text-white/40 text-xs font-sans">Angka yang tampil di homepage</p>
            </div>
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); statsMutation.mutate(); }}
            className="space-y-4"
          >
            {stats && stats.length > 0 ? (
              stats.map((stat: any) => (
                <div key={stat.id}>
                  <label className="block text-xs font-sans font-medium text-white/60 uppercase tracking-wider mb-1.5">
                    {stat.label} <span className="text-white/30">({stat.key})</span>
                  </label>
                  <input
                    type="text"
                    value={statsForm[stat.key] ?? ''}
                    onChange={(e) => setStatsForm({ ...statsForm, [stat.key]: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm font-sans focus:border-[#0200B5] focus:outline-none"
                    placeholder="Value"
                  />
                </div>
              ))
            ) : (
              <p className="text-white/40 text-sm font-sans">Belum ada statistik</p>
            )}
            <button
              type="submit"
              disabled={statsMutation.isPending || !stats?.length}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-sans font-medium rounded-lg transition-all disabled:opacity-50"
            >
              {statsMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              {statsMutation.isPending ? 'Memperbarui...' : 'Update Statistik'}
            </button>
            {statsMutation.isSuccess && (
              <p className="text-emerald-400 text-xs font-sans">✓ Tersimpan</p>
            )}
          </form>
        </div>

        {/* Period Management */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-sans font-bold">Periode Kepengurusan</h3>
              <p className="text-white/40 text-xs font-sans">Atur periode yang aktif</p>
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-white/35 text-xs font-sans">Nama kabinet diisi melalui Tema. Satu tahun hanya boleh memiliki satu kabinet; periode aktif tidak dapat dihapus.</p>
            {periods?.map((period) => (
              <div
                key={period.id}
                className={`p-4 rounded-xl border transition-all ${
                  period.is_active
                    ? 'bg-[#0200B5]/10 border-[#0200B5]/30'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-white font-sans font-bold text-sm">{period.name}</p>
                    <p className="text-white/40 text-xs font-sans mt-1">
                      {new Date(period.start_date).toLocaleDateString('id-ID')} - {new Date(period.end_date).toLocaleDateString('id-ID')}
                    </p>
                    {period.theme && (
                      <p className="text-white/30 text-xs font-sans italic mt-1">"{period.theme}"</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {period.is_active && (
                      <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-sans font-medium rounded">
                        Active
                      </span>
                    )}
                    <button
                      onClick={() => openEditPeriod(period)}
                      className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-sans rounded transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Hapus periode "${period.name}"?`)) deletePeriodMutation.mutate(period.id);
                      }}
                      className="px-2 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-sans rounded transition-colors"
                      title="Hapus"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={openCreatePeriod}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-dashed border-white/20 hover:border-white/40 text-white/60 hover:text-white text-sm font-sans rounded-xl transition-all"
            >
              <Plus className="w-4 h-4" />
              Tambah Periode Baru
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-sans font-bold">Aksi Cepat</h3>
              <p className="text-white/40 text-xs font-sans">Fitur berguna</p>
            </div>
          </div>
          <div className="space-y-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors"
            >
              <span className="text-white text-sm font-sans">Lihat Website</span>
              <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            <button
              onClick={() => queryClient.invalidateQueries()}
              className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors text-left"
            >
              <span className="text-white text-sm font-sans">Refresh Cache</span>
              <RefreshCw className="w-4 h-4 text-white/40" />
            </button>
          </div>
        </div>
      </div>

      {/* Period Modal */}
      {showPeriodModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closePeriodModal} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative bg-[#0a0a1a] border border-white/10 rounded-2xl p-6 w-full max-w-lg"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-sans font-bold text-lg">
                {editingPeriodId ? 'Edit Periode' : 'Periode Baru'}
              </h3>
              <button onClick={closePeriodModal} className="text-white/40 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePeriodSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-sans font-medium text-white/60 uppercase tracking-wider mb-1.5">
                  Nama Periode <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={periodForm.name}
                  onChange={(e) => setPeriodForm({ ...periodForm, name: e.target.value })}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm font-sans focus:border-[#0200B5] focus:outline-none"
                  placeholder="Contoh: Periode 2024/2025"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-sans font-medium text-white/60 uppercase tracking-wider mb-1.5">
                  Tema
                </label>
                <input
                  type="text"
                  value={periodForm.theme}
                  onChange={(e) => setPeriodForm({ ...periodForm, theme: e.target.value })}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm font-sans focus:border-[#0200B5] focus:outline-none"
                  placeholder="Satu Kata, Satu Hati, Satu Tujuan"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-sans font-medium text-white/60 uppercase tracking-wider mb-1.5">
                    Mulai <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    value={periodForm.start_date}
                    onChange={(e) => setPeriodForm({ ...periodForm, start_date: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm font-sans focus:border-[#0200B5] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-sans font-medium text-white/60 uppercase tracking-wider mb-1.5">
                    Selesai <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    value={periodForm.end_date}
                    onChange={(e) => setPeriodForm({ ...periodForm, end_date: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm font-sans focus:border-[#0200B5] focus:outline-none"
                    required
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={periodForm.is_active}
                  onChange={(e) => setPeriodForm({ ...periodForm, is_active: e.target.checked })}
                  className="w-4 h-4 accent-[#0200B5]"
                />
                <label htmlFor="active" className="text-sm text-white/60 font-sans">
                  Jadikan periode aktif
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closePeriodModal}
                  className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white/70 text-sm font-sans font-medium rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={periodMutation.isPending}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#0200B5] to-[#0000F0] text-white text-sm font-sans font-medium rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {periodMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingPeriodId ? 'Update' : 'Simpan'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
