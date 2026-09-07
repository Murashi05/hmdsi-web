import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';
import { siteStatService } from '../../services/site-stat.service';
import { aspirationService } from '../../services/aspiration.service';
import { workProgramService } from '../../services/work-program.service';
import { newsService } from '../../services/news.service';
import { structureService } from '../../services/structure.service';
import {
  Users,
  Briefcase,
  FileText,
  Image,
  MessageSquare,
  ArrowUpRight,
  TrendingUp,
  Clock,
} from 'lucide-react';

interface StatCard {
  icon: typeof Users;
  label: string;
  value: string | number;
  change?: string;
  color: string;
  href: string;
}

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Dashboard · HMDSI Admin';
  }, []);

  const { data: stats } = useQuery({
    queryKey: ['admin-stats-overview'],
    queryFn: siteStatService.getStats,
  });

  const { data: aspirations } = useQuery({
    queryKey: ['admin-aspirations-stats'],
    queryFn: aspirationService.getStats,
  });

  const { data: prokerList } = useQuery({
    queryKey: ['admin-proker-recent'],
    queryFn: () => workProgramService.getWorkPrograms({ per_page: 5 }),
  });

  const { data: newsList } = useQuery({
    queryKey: ['admin-news-recent'],
    queryFn: () => newsService.getNews({ per_page: 4 }),
  });

  const { data: structures } = useQuery({
    queryKey: ['admin-structures-count'],
    queryFn: () => structureService.getStructures(),
  });

  const totalMembers = stats?.find((s) => s.key === 'total_members')?.value || '0';
  const totalProker = prokerList?.pagination?.total || 0;
  const totalNews = newsList?.pagination?.total || 0;
  const totalStructures = structures?.length || 0;
  const pendingAspirations =
    (aspirations?.submitted || 0) + (aspirations?.under_review || 0) + (aspirations?.in_progress || 0);

  const statCards: StatCard[] = [
    {
      icon: Users,
      label: 'Pengurus',
      value: totalMembers,
      change: '+12%',
      color: 'from-blue-500 to-blue-600',
      href: '/admin/members',
    },
    {
      icon: Briefcase,
      label: 'Proker',
      value: totalProker,
      change: '+3',
      color: 'from-purple-500 to-purple-600',
      href: '/admin/programs',
    },
    {
      icon: FileText,
      label: 'Artikel',
      value: totalNews,
      color: 'from-emerald-500 to-emerald-600',
      href: '/admin/news',
    },
    {
      icon: MessageSquare,
      label: 'Aspirasi Pending',
      value: pendingAspirations,
      change: 'Aksi perlu',
      color: 'from-amber-500 to-amber-600',
      href: '/admin/aspirations',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#0200B5] to-[#0000F0] rounded-2xl p-6 md:p-8"
      >
        <p className="text-white/70 text-sm font-sans">Selamat datang kembali,</p>
        <h2 className="text-white text-2xl md:text-3xl font-sans font-black mt-1 mb-2">
          {user?.name || 'Admin'} 👋
        </h2>
        <p className="text-white/80 text-sm font-sans">
          Kelola konten website HMDSI dari satu tempat. Anda memiliki <strong>{totalStructures}</strong> struktur aktif.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <motion.button
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => navigate(card.href)}
            className="group bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-5 text-left transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-white/30 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
            <p className="text-2xl md:text-3xl font-sans font-black text-white mb-1">{card.value}</p>
            <p className="text-white/40 text-xs font-sans uppercase tracking-wider">{card.label}</p>
            {card.change && (
              <p className="text-emerald-400 text-xs font-sans font-medium mt-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {card.change}
              </p>
            )}
          </motion.button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Recent Proker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-sans font-bold text-lg">Proker Terbaru</h3>
            <button
              onClick={() => navigate('/admin/programs')}
              className="text-[#0200B5] hover:text-white text-xs font-sans font-medium"
            >
              Lihat semua →
            </button>
          </div>
          {prokerList?.items && prokerList.items.length > 0 ? (
            <div className="space-y-3">
              {prokerList.items.slice(0, 5).map((p) => (
                <div key={p.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0200B5] to-[#0000F0] flex items-center justify-center text-white font-bold text-xs shrink-0">
                    {p.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-sans font-medium truncate">{p.name}</p>
                    <p className="text-white/40 text-xs font-sans capitalize">
                      {p.status.replace('_', ' ')} · {p.department?.name || '-'}
                    </p>
                  </div>
                  <Clock className="w-4 h-4 text-white/30 shrink-0" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white/40 text-sm font-sans py-4 text-center">Belum ada data proker</p>
          )}
        </motion.div>

        {/* Recent News */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-sans font-bold text-lg">Artikel Terbaru</h3>
            <button
              onClick={() => navigate('/admin/news')}
              className="text-[#0200B5] hover:text-white text-xs font-sans font-medium"
            >
              Lihat semua →
            </button>
          </div>
          {newsList?.items && newsList.items.length > 0 ? (
            <div className="space-y-3">
              {newsList.items.slice(0, 4).map((n) => (
                <div key={n.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-sans font-medium truncate">{n.title}</p>
                    <p className="text-white/40 text-xs font-sans capitalize">
                      {n.category} · {n.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white/40 text-sm font-sans py-4 text-center">Belum ada artikel</p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
