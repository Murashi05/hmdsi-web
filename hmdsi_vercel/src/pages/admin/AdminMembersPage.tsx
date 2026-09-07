import { useEffect, useState, type FormEvent } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { Plus, Edit2, Trash2, Search, X, UserCircle, AlertCircle, Loader2 } from 'lucide-react';
import { apiClient } from '../../config/axios';
import type { ApiResponse, Member, PaginatedData, ManagementRole } from '../../services/api.types';

interface MemberForm {
  full_name: string;
  student_id: string;
  study_program: string;
  batch_year: number;
  photo_url: string;
  linkedin_url: string;
  instagram_handle: string;
  bio: string;
  management_role_id: string;
  department_id: string;
}

const EMPTY_FORM: MemberForm = {
  full_name: '',
  student_id: '',
  study_program: '',
  batch_year: new Date().getFullYear(),
  photo_url: '',
  linkedin_url: '',
  instagram_handle: '',
  bio: '',
  management_role_id: '',
  department_id: '',
};

export default function AdminMembersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<MemberForm>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Members · HMDSI Admin';
  }, []);

  const { data: membersData, isLoading, error } = useQuery({
    queryKey: ['admin-members'],
    queryFn: () =>
      apiClient.get<ApiResponse<PaginatedData<Member>>>('/admin/members').then((r) => r.data.data),
  });

  const { data: roles } = useQuery({
    queryKey: ['admin-roles'],
    queryFn: () =>
      apiClient.get<ApiResponse<ManagementRole[]>>('/admin/roles').then((r) => r.data.data),
  });

  const { data: departments } = useQuery({
    queryKey: ['admin-departments-list'],
    queryFn: () =>
      apiClient.get<ApiResponse<any[]>>('/admin/departments').then((r) => r.data.data),
  });

  const saveMutation = useMutation({
    mutationFn: (payload: MemberForm) => {
      const body = {
        full_name: payload.full_name,
        student_id: payload.student_id,
        study_program: payload.study_program,
        batch_year: Number(payload.batch_year),
        photo_url: payload.photo_url || null,
        linkedin_url: payload.linkedin_url || null,
        instagram_handle: payload.instagram_handle || null,
        bio: payload.bio || null,
      };
      if (editingId) {
        return apiClient.put(`/admin/members/${editingId}`, body);
      }
      return apiClient.post('/admin/members', body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-members'] });
      closeModal();
    },
    onError: (err: any) => {
      setFormError(err?.response?.data?.message || 'Gagal menyimpan member');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiClient.delete(`/admin/members/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-members'] }),
  });

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setShowModal(true);
  };

  const openEdit = (member: Member) => {
    setEditingId(member.id);
    setForm({
      full_name: member.full_name,
      student_id: member.student_id,
      study_program: member.study_program,
      batch_year: member.batch_year,
      photo_url: member.photo_url || '',
      linkedin_url: member.linkedin_url || '',
      instagram_handle: member.instagram_handle || '',
      bio: member.bio || '',
      management_role_id: '',
      department_id: '',
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
    if (!form.full_name.trim() || !form.student_id.trim() || !form.study_program.trim()) {
      setFormError('Nama, NIM, dan Program Studi wajib diisi');
      return;
    }
    saveMutation.mutate(form);
  };

  const filteredMembers = membersData?.items?.filter((m) =>
    m.full_name.toLowerCase().includes(search.toLowerCase()) ||
    m.student_id.toLowerCase().includes(search.toLowerCase()) ||
    m.study_program.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-white font-sans font-bold text-xl">Manajemen Members</h2>
          <p className="text-white/40 text-sm font-sans mt-1">
            Kelola data anggota & struktur organisasi
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#0200B5] to-[#0000F0] hover:from-[#0000B0] text-white text-sm font-sans font-medium rounded-lg transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          Tambah Member
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        <input
          type="text"
          placeholder="Cari nama, NIM, atau program studi..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:border-[#0200B5] focus:outline-none text-sm font-sans"
        />
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-red-300 text-sm font-sans font-medium">Gagal memuat data</p>
            <p className="text-red-300/70 text-xs font-sans mt-1">{(error as any)?.message || 'Periksa koneksi Anda'}</p>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-4 py-3 text-left text-xs font-sans font-bold text-white/40 uppercase tracking-wider">Nama</th>
                <th className="px-4 py-3 text-left text-xs font-sans font-bold text-white/40 uppercase tracking-wider">NIM</th>
                <th className="px-4 py-3 text-left text-xs font-sans font-bold text-white/40 uppercase tracking-wider">Program Studi</th>
                <th className="px-4 py-3 text-left text-xs font-sans font-bold text-white/40 uppercase tracking-wider">Angkatan</th>
                <th className="px-4 py-3 text-right text-xs font-sans font-bold text-white/40 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <div className="flex justify-center">
                      <Loader2 className="w-6 h-6 text-[#0200B5] animate-spin" />
                    </div>
                  </td>
                </tr>
              ) : filteredMembers && filteredMembers.length > 0 ? (
                filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {member.photo_url ? (
                          <img
                            src={member.photo_url}
                            alt={member.full_name}
                            className="w-9 h-9 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0200B5] to-[#0000F0] flex items-center justify-center text-white font-bold text-sm shrink-0">
                            {member.full_name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <p className="text-white text-sm font-sans font-medium">{member.full_name}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white/60 text-sm font-sans font-mono">{member.student_id}</td>
                    <td className="px-4 py-3 text-white/60 text-sm font-sans">{member.study_program}</td>
                    <td className="px-4 py-3 text-white/60 text-sm font-sans">{member.batch_year}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(member)}
                          className="p-2 text-white/40 hover:text-[#0200B5] hover:bg-white/10 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Hapus member "${member.full_name}"?`)) {
                              deleteMutation.mutate(member.id);
                            }
                          }}
                          disabled={deleteMutation.isPending}
                          className="p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors disabled:opacity-50"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-16 text-center">
                    <UserCircle className="w-12 h-12 text-white/10 mx-auto mb-3" />
                    <p className="text-white/40 text-sm font-sans">
                      {search ? 'Tidak ada member yang cocok' : 'Belum ada data member'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
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
                {editingId ? 'Edit Member' : 'Tambah Member'}
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

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans font-medium text-white/60 uppercase tracking-wider mb-1.5">
                    Nama Lengkap <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.full_name}
                    onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 text-sm font-sans focus:border-[#0200B5] focus:outline-none"
                    placeholder="Nama lengkap"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-sans font-medium text-white/60 uppercase tracking-wider mb-1.5">
                    NIM <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.student_id}
                    onChange={(e) => setForm({ ...form, student_id: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 text-sm font-sans font-mono focus:border-[#0200B5] focus:outline-none"
                    placeholder="xxxxxxxx"
                    required
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans font-medium text-white/60 uppercase tracking-wider mb-1.5">
                    Program Studi <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.study_program}
                    onChange={(e) => setForm({ ...form, study_program: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 text-sm font-sans focus:border-[#0200B5] focus:outline-none"
                    placeholder="D3 Sistem Informasi"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-sans font-medium text-white/60 uppercase tracking-wider mb-1.5">
                    Angkatan
                  </label>
                  <input
                    type="number"
                    value={form.batch_year}
                    onChange={(e) => setForm({ ...form, batch_year: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm font-sans focus:border-[#0200B5] focus:outline-none"
                    min="2000"
                    max={new Date().getFullYear() + 1}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-sans font-medium text-white/60 uppercase tracking-wider mb-1.5">
                  URL Foto
                </label>
                <input
                  type="url"
                  value={form.photo_url}
                  onChange={(e) => setForm({ ...form, photo_url: e.target.value })}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 text-sm font-sans focus:border-[#0200B5] focus:outline-none"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-xs font-sans font-medium text-white/60 uppercase tracking-wider mb-1.5">
                  Bio
                </label>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 text-sm font-sans focus:border-[#0200B5] focus:outline-none resize-none"
                  placeholder="Deskripsi singkat..."
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans font-medium text-white/60 uppercase tracking-wider mb-1.5">
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    value={form.linkedin_url}
                    onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 text-sm font-sans focus:border-[#0200B5] focus:outline-none"
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-sans font-medium text-white/60 uppercase tracking-wider mb-1.5">
                    Instagram
                  </label>
                  <input
                    type="text"
                    value={form.instagram_handle}
                    onChange={(e) => setForm({ ...form, instagram_handle: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 text-sm font-sans focus:border-[#0200B5] focus:outline-none"
                    placeholder="@username"
                  />
                </div>
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
