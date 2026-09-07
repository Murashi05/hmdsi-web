import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, RefreshCw, Globe, Palette, Image } from 'lucide-react';
import { apiClient } from '../../config/axios';
import type { ApiResponse, Period, SiteStat, AboutContent } from '../../services/api.types';

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

  return (
    <div className="space-y-6">
      {/* Header */}
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
              <Image className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-sans font-bold">Tentang Kami</h3>
              <p className="text-white/40 text-xs font-sans">Edit konten halaman About</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-sans font-medium text-white/60 uppercase tracking-wider mb-1.5">Visi</label>
              <textarea
                defaultValue={about?.vision || ''}
                rows={3}
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm font-sans focus:border-[#0200B5] focus:outline-none resize-none"
                placeholder="Tulis visi organisasi..."
              />
            </div>
            <div>
              <label className="block text-xs font-sans font-medium text-white/60 uppercase tracking-wider mb-1.5">Sejarah</label>
              <textarea
                defaultValue={about?.organization_history || ''}
                rows={5}
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm font-sans focus:border-[#0200B5] focus:outline-none resize-none"
                placeholder="Sejarah organisasi..."
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#0200B5] to-[#0000F0] text-white text-sm font-sans font-medium rounded-lg transition-all">
              <Save className="w-4 h-4" />
              Simpan Perubahan
            </button>
          </div>
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
          <div className="space-y-4">
            {stats?.map((stat) => (
              <div key={stat.id}>
                <label className="block text-xs font-sans font-medium text-white/60 uppercase tracking-wider mb-1.5">{stat.label}</label>
                <input
                  type="text"
                  defaultValue={stat.value}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm font-sans focus:border-[#0200B5] focus:outline-none"
                  placeholder="Value"
                />
              </div>
            ))}
            <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-sans font-medium rounded-lg transition-all">
              <RefreshCw className="w-4 h-4" />
              Update Statistik
            </button>
          </div>
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
            {periods?.map((period) => (
              <div
                key={period.id}
                className={`p-4 rounded-xl border transition-all ${
                  period.is_active
                    ? 'bg-[#0200B5]/10 border-[#0200B5]/30'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-sans font-bold text-sm">{period.name}</p>
                    <p className="text-white/40 text-xs font-sans mt-1">
                      {new Date(period.start_date).toLocaleDateString('id-ID')} - {new Date(period.end_date).toLocaleDateString('id-ID')}
                    </p>
                    {period.theme && (
                      <p className="text-white/30 text-xs font-sans italic mt-1">"{period.theme}"</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {period.is_active && (
                      <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-sans font-medium rounded">
                        Active
                      </span>
                    )}
                    <button className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-sans rounded transition-colors">
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-dashed border-white/20 hover:border-white/40 text-white/60 hover:text-white text-sm font-sans rounded-xl transition-all">
              + Tambah Periode Baru
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
            <button className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors text-left">
              <span className="text-white text-sm font-sans">Export Data</span>
              <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
            <button className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors text-left">
              <span className="text-white text-sm font-sans">Refresh Cache</span>
              <RefreshCw className="w-4 h-4 text-white/40" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
