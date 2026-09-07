import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, Search, X, ChevronDown, ChevronUp, Link as LinkIcon } from 'lucide-react';
import { apiClient } from '../../config/axios';
import type { ApiResponse, Member, PaginatedData, Department, ManagementRole, ManagementStructure } from '../../services/api.types';

export default function AdminMembersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  useEffect(() => {
    document.title = 'Members · HMDSI Admin';
  }, []);

  const { data: members, isLoading } = useQuery({
    queryKey: ['admin-members', selectedDepartment],
    queryFn: () =>
      apiClient.get<ApiResponse<PaginatedData<Member>>>('/admin/members', {
        params: { department_id: selectedDepartment || undefined },
      }).then((r) => r.data.data),
  });

  const { data: departments } = useQuery({
    queryKey: ['admin-departments'],
    queryFn: () =>
      apiClient.get<ApiResponse<any[]>>('/admin/departments').then((r) => r.data.data),
  });

  const { data: roles } = useQuery({
    queryKey: ['admin-roles'],
    queryFn: () =>
      apiClient.get<ApiResponse<ManagementRole[]>>('/admin/roles').then((r) => r.data.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiClient.delete(`/admin/members/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-members'] }),
  });

  const filteredMembers = members?.items?.filter((m) =>
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
          onClick={() => {
            setEditingMember(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#0200B5] to-[#0000F0] hover:from-[#0000B0] text-white text-sm font-sans font-medium rounded-lg transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          Tambah Member
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Cari nama, NIM, atau program studi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:border-[#0200B5] focus:outline-none text-sm font-sans"
          />
        </div>
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm font-sans focus:border-[#0200B5] focus:outline-none cursor-pointer min-w-[180px]"
        >
          <option value="">Semua Departemen</option>
          {departments?.map((d: any) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
      </div>

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
                <th className="px-4 py-3 text-left text-xs font-sans font-bold text-white/40 uppercase tracking-wider">Jabatan</th>
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
              ) : filteredMembers && filteredMembers.length > 0 ? (
                filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={member.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.full_name)}&background=3B82F6&color=fff&size=64`}
                          alt={member.full_name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-white text-sm font-sans font-medium">{member.full_name}</p>
                          {member.email && <p className="text-white/40 text-xs font-sans">{member.email}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white/60 text-sm font-sans font-mono">{member.student_id}</td>
                    <td className="px-4 py-3 text-white/60 text-sm font-sans">{member.study_program}</td>
                    <td className="px-4 py-3 text-white/60 text-sm font-sans">{member.batch_year}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-[#0200B5]/20 text-[#0200B5] text-xs font-sans font-medium rounded capitalize">
                        {member.role || 'Member'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {member.linkedin_url && (
                          <a
                            href={member.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-white/40 hover:text-white hover:bg-white/10 rounded transition-colors"
                          >
                            <LinkIcon className="w-4 h-4" />
                          </a>
                        )}
                        <button
                          onClick={() => {
                            setEditingMember(member);
                            setShowModal(true);
                          }}
                          className="p-1.5 text-white/40 hover:text-[#0200B5] hover:bg-white/10 rounded transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Hapus member ini?')) deleteMutation.mutate(member.id);
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
                    {search || selectedDepartment
                      ? 'Tidak ada member yang cocok dengan pencarian'
                      : 'Belum ada data member'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {members?.pagination && members.pagination.last_page > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/10">
            <p className="text-white/40 text-xs font-sans">
              Halaman {members.pagination.current_page} dari {members.pagination.last_page}
            </p>
            <div className="flex gap-2">
              <button
                disabled={members.pagination.current_page === 1}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-xs font-sans rounded disabled:opacity-30 transition-colors"
              >
                ← Prev
              </button>
              <button
                disabled={members.pagination.current_page === members.pagination.last_page}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-xs font-sans rounded disabled:opacity-30 transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal (simplified - would need full form in production) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowModal(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-[#0a0a1a] border border-white/10 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-sans font-bold text-lg">
                {editingMember ? 'Edit Member' : 'Tambah Member'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-white/40 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-xs font-sans font-medium text-white/60 uppercase tracking-wider mb-1.5">Nama Lengkap</label>
                <input
                  type="text"
                  defaultValue={editingMember?.full_name}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm font-sans focus:border-[#0200B5] focus:outline-none"
                  placeholder="Nama lengkap"
                />
              </div>
              <div>
                <label className="block text-xs font-sans font-medium text-white/60 uppercase tracking-wider mb-1.5">NIM</label>
                <input
                  type="text"
                  defaultValue={editingMember?.student_id}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm font-sans font-mono focus:border-[#0200B5] focus:outline-none"
                  placeholder="xxxxxxxx"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans font-medium text-white/60 uppercase tracking-wider mb-1.5">Program Studi</label>
                  <input
                    type="text"
                    defaultValue={editingMember?.study_program}
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm font-sans focus:border-[#0200B5] focus:outline-none"
                    placeholder="D3 Sistem Informasi"
                  />
                </div>
                <div>
                  <label className="block text-xs font-sans font-medium text-white/60 uppercase tracking-wider mb-1.5">Angkatan</label>
                  <input
                    type="number"
                    defaultValue={editingMember?.batch_year}
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm font-sans focus:border-[#0200B5] focus:outline-none"
                    placeholder="2024"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-sans font-medium text-white/60 uppercase tracking-wider mb-1.5">Email</label>
                <input
                  type="email"
                  defaultValue={editingMember?.email || ''}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm font-sans focus:border-[#0200B5] focus:outline-none"
                  placeholder="email@telkomuniversity.ac.id"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white/60 text-sm font-sans font-medium rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#0200B5] to-[#0000F0] text-white text-sm font-sans font-medium rounded-lg transition-all"
                >
                  {editingMember ? 'Update' : 'Simpan'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
