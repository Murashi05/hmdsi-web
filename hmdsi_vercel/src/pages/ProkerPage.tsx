import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import { useWorkPrograms } from '../hooks/useWorkPrograms';
import { useDepartments } from '../hooks/useDepartments';

const STATUS_CONFIG = {
  planned: { label: 'Planned', icon: Clock, color: 'text-blue-400 bg-blue-400/10', borderColor: 'border-blue-400/20' },
  in_progress: { label: 'In Progress', icon: AlertCircle, color: 'text-amber-400 bg-amber-400/10', borderColor: 'border-amber-400/20' },
  completed: { label: 'Completed', icon: CheckCircle, color: 'text-emerald-400 bg-emerald-400/10', borderColor: 'border-emerald-400/20' },
  postponed: { label: 'Postponed', icon: Clock, color: 'text-orange-400 bg-orange-400/10', borderColor: 'border-orange-400/20' },
  cancelled: { label: 'Cancelled', icon: XCircle, color: 'text-red-400 bg-red-400/10', borderColor: 'border-red-400/20' },
} as const;

const Section = ({ children, className = '', id = '' }: { children: React.ReactNode; className?: string; id?: string }) => (
  <section id={id} className={`py-20 md:py-32 ${className}`}>{children}</section>
);

const ProgramCard = ({ program }: { program: any }) => {
  const status = STATUS_CONFIG[program.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.planned;
  const StatusIcon = status.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      className="group bg-white rounded-2xl overflow-hidden border border-[#0a0a1a]/5 hover:border-[#0200B5]/20 hover:shadow-xl hover:shadow-[#0200B5]/5 transition-all duration-500"
    >
      <div className="aspect-[16/9] bg-gradient-to-br from-[#0200B5]/10 to-[#0000F0]/10 relative overflow-hidden">
        {program.cover_image_url ? (
          <img src={program.cover_image_url} alt={program.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-[#0200B5]/10 flex items-center justify-center">
              <span className="text-3xl font-black text-[#0200B5]/30">{program.name.charAt(0)}</span>
            </div>
          </div>
        )}
        {program.is_highlight && (
          <span className="absolute top-3 right-3 px-2 py-1 bg-amber-500 text-white text-[10px] font-bold rounded-full">
            ⭐ Highlight
          </span>
        )}
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#0200B5]">
            {program.department?.name || '-'}
          </span>
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium ${status.color}`}>
            <StatusIcon className="w-3 h-3" />
            {status.label}
          </span>
        </div>
        <h3 className="text-lg font-sans font-bold text-[#0a0a1a] mb-2 line-clamp-2 group-hover:text-[#0200B5] transition-colors">
          {program.name}
        </h3>
        {program.description && (
          <p className="text-[#0a0a1a]/60 text-sm font-light leading-relaxed line-clamp-3 mb-4">
            {program.description}
          </p>
        )}
        {program.tags && program.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {program.tags.slice(0, 3).map((tag: string, i: number) => (
              <span key={i} className="px-2 py-0.5 bg-[#0200B5]/5 text-[#0200B5] text-[10px] font-medium rounded">
                {tag}
              </span>
            ))}
          </div>
        )}
        {program.actual_date && (
          <p className="text-[#0a0a1a]/40 text-xs">
            📅 {new Date(program.actual_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default function ProkerPage() {
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [deptFilter, setDeptFilter] = useState<string>('');

  const { data: programs, isLoading } = useWorkPrograms({
    status: statusFilter || undefined,
    department_slug: deptFilter || undefined,
    is_highlight: false,
    per_page: 12,
  });

  const { data: departments } = useDepartments();

  const highlights = programs?.items?.filter((p: any) => p.is_highlight) || [];

  return (
    <>
      <Helmet>
        <title>Program Kerja | HMDSI FIT Telkom University</title>
        <meta name="description" content="Program Kerja HMDSI - Lihat berbagai program kerja dari setiap departemen HMDSI." />
        <meta property="og:title" content="Program Kerja | HMDSI" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hmdsi.com/proker" />
        <link rel="canonical" href="https://hmdsi.com/proker" />
      </Helmet>

      {/* Hero */}
      <section className="pt-32 md:pt-44 pb-16 md:pb-24 bg-[#050014] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,#0200B515,transparent)]" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="editorial-container relative z-10">
          <SectionHeader
            label="Program Kerja"
            title="Program Kerja "
            titleAccent="HMDSI"
            description="Berbagai program kerja dari setiap departemen untuk melayani dan memberdayakan mahasiswa."
          />
        </div>
      </section>

      {/* Filters */}
      <Section className="bg-[#f4f0e6]">
        <div className="editorial-container">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-10">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setStatusFilter('')}
                className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider transition-all ${
                  !statusFilter ? 'bg-[#0200B5] text-white' : 'bg-white text-[#0a0a1a]/60 hover:bg-white/80'
                }`}
              >
                Semua
              </button>
              {Object.entries(STATUS_CONFIG).map(([value, config]) => (
                <button
                  key={value}
                  onClick={() => setStatusFilter(statusFilter === value ? '' : value)}
                  className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider transition-all ${
                    statusFilter === value ? `${config.color}` : 'bg-white text-[#0a0a1a]/60 hover:bg-white/80'
                  }`}
                >
                  {config.label}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                  <div className="aspect-[16/9] bg-gray-200" />
                  <div className="p-6 space-y-3">
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                    <div className="h-5 bg-gray-200 rounded w-2/3" />
                    <div className="h-12 bg-gray-100 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : programs?.items && programs.items.length > 0 ? (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {programs.items.map((program: any) => (
                  <ProgramCard key={program.id} program={program} />
                ))}
              </div>
              {programs.pagination && programs.pagination.last_page > 1 && (
                <div className="text-center mt-12">
                  <p className="text-[#0a0a1a]/40 text-sm mb-4">
                    Menampilkan {programs.items.length} dari {programs.pagination.total} program kerja
                  </p>
                  <button className="px-6 py-3 border-2 border-[#0200B5] text-[#0200B5] hover:bg-[#0200B5] hover:text-white text-sm font-bold rounded-full transition-all">
                    Lihat Lebih Banyak
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl">
              <p className="text-[#0a0a1a]/40">Tidak ada program kerja yang ditemukan</p>
            </div>
          )}
        </div>
      </Section>

      {/* CTA */}
      <Section className="bg-[#050014]">
        <div className="editorial-container text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-sans font-black text-white mb-6">
              Punya Aspirasi atau Ide?
            </h2>
            <p className="max-w-xl mx-auto text-white/60 font-light mb-8">
              Sampaikan gagasan dan aspirasimu untuk pengembangan HMDSI dan mahasiswa Sistem Informasi.
            </p>
            <Link to="/aspiration" className="btn-editorial btn-editorial-primary group">
              Sampaikan Aspirasi
              <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </Section>
    </>
  );
}
