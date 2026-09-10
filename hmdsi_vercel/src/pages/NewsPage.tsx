import type { ReactNode } from 'react';
import type { CSSProperties } from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Calendar, Eye, FileText } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import { useNewsArticles } from '../hooks/useNews';

const CATEGORY_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  news: { bg: 'bg-blue-100', text: 'text-blue-600', label: 'News' },
  announcement: { bg: 'bg-red-100', text: 'text-red-600', label: 'Pengumuman' },
  achievement: { bg: 'bg-amber-100', text: 'text-amber-600', label: 'Prestasi' },
  academic: { bg: 'bg-emerald-100', text: 'text-emerald-600', label: 'Akademik' },
  event: { bg: 'bg-purple-100', text: 'text-purple-600', label: 'Event' },
};

const Section = ({ children, className = '', id = '' }: { children: ReactNode; className?: string; id?: string }) => (
  <section id={id} className={`py-20 md:py-32 ${className}`}>{children}</section>
);

const ArticleCard = ({ article, featured = false }: { article: any; featured?: boolean }) => {
  const category = CATEGORY_COLORS[article.category] || CATEGORY_COLORS.news;

  if (featured) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="group bg-[#050014] rounded-2xl overflow-hidden relative"
      >
        <div className="grid lg:grid-cols-2">
          <div className="aspect-[4/3] lg:aspect-auto relative">
            {article.cover_image_url ? (
              <img src={article.cover_image_url} alt={article.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#0200B5]/20 to-[#0000F0]/20 flex items-center justify-center">
                <FileText className="w-20 h-20 text-white/20" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050014] via-transparent to-transparent lg:bg-gradient-to-r" />
          </div>
          <div className="p-8 lg:p-12 flex flex-col justify-center relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${category.bg} ${category.text}`}>
                {category.label}
              </span>
              <span className="text-white/40 text-xs flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {article.published_at
                  ? new Date(article.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                  : '-'}
              </span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-sans font-black text-white mb-4 leading-tight group-hover:text-[#0200B5] transition-colors">
              {article.title}
            </h2>
            {article.excerpt && (
              <p className="text-white/60 font-light leading-relaxed mb-6 line-clamp-3">
                {article.excerpt}
              </p>
            )}
            <div className="flex items-center gap-2 text-[#0200B5] font-bold text-sm">
              Baca Selengkapnya <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group bg-white rounded-xl overflow-hidden border border-[#0a0a1a]/5 hover:border-[#0200B5]/20 hover:shadow-lg transition-all"
    >
      <div className="aspect-[16/9] relative overflow-hidden">
        {article.cover_image_url ? (
          <img src={article.cover_image_url} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#0200B5]/5 to-[#0000F0]/5 flex items-center justify-center">
            <FileText className="w-12 h-12 text-[#0200B5]/20" />
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-center gap-3 mb-3">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${category.bg} ${category.text}`}>
            {category.label}
          </span>
          <span className="text-[#0a0a1a]/30 text-xs flex items-center gap-1">
            <Eye className="w-3 h-3" /> {article.view_count || 0}
          </span>
        </div>
        <h3 className="text-base font-sans font-bold text-[#0a0a1a] mb-2 line-clamp-2 group-hover:text-[#0200B5] transition-colors">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="text-[#0a0a1a]/50 text-sm font-light line-clamp-2 mb-3">
            {article.excerpt}
          </p>
        )}
        <div className="text-[#0a0a1a]/30 text-xs">
          {article.published_at
            ? new Date(article.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
            : '-'}
        </div>
      </div>
    </motion.div>
  );
};

export default function NewsPage() {
  const [categoryFilter, setCategoryFilter] = useState<string>('');

  const { data: news, isLoading } = useNewsArticles({
    category: categoryFilter || undefined,
    status: 'published',
    per_page: 12,
  } as any);

  const featuredArticle = news?.items?.find((n: any) => n.is_featured) || news?.items?.[0];
  const otherArticles = news?.items?.filter((n: any) => n.id !== featuredArticle?.id) || [];

  return (
    <>
      <Helmet>
        <title>Berita & Artikel | HMDSI FIT Telkom University</title>
        <meta name="description" content="Berita, pengumuman, dan artikel dari HMDSI - Tetap terkini dengan informasi seputar kegiatan dan prestasi mahasiswa." />
        <meta property="og:title" content="Berita & Artikel | HMDSI" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hmdsi.com/news" />
        <link rel="canonical" href="https://hmdsi.com/news" />
      </Helmet>

      {/* Hero */}
      <section className="pt-32 md:pt-44 pb-16 md:pb-24 bg-[#050014] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,#0200B515,transparent)]" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="editorial-container relative z-10">
          <SectionHeader
            label="Berita & Artikel"
            title="Berita & "
            titleAccent="Artikel"
            description="Tetap terkini dengan informasi seputar kegiatan, prestasi, dan pengumuman dari HMDSI."
          />
        </div>
      </section>

      {/* Featured Article */}
      {featuredArticle && !categoryFilter && (
        <Section className="bg-[#050014] -mt-20 relative z-10">
          <div className="editorial-container">
            <Link to={`/news/${featuredArticle.slug}`}>
              <ArticleCard article={featuredArticle} featured />
            </Link>
          </div>
        </Section>
      )}

      {/* Articles Grid */}
      <Section className="bg-[#f4f0e6]">
        <div className="editorial-container">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-10">
            <button
              onClick={() => setCategoryFilter('')}
              className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider transition-all ${
                !categoryFilter ? 'bg-[#0200B5] text-white' : 'bg-white text-[#0a0a1a]/60 hover:bg-white/80'
              }`}
            >
              Semua
            </button>
            {Object.entries(CATEGORY_COLORS).map(([value, config]) => (
              <button
                key={value}
                onClick={() => setCategoryFilter(categoryFilter === value ? '' : value)}
                className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider transition-all ${
                  categoryFilter === value ? `${config.bg} ${config.text}` : 'bg-white text-[#0a0a1a]/60 hover:bg-white/80'
                }`}
              >
                {config.label}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden animate-pulse">
                  <div className="aspect-[16/9] bg-gray-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                    <div className="h-5 bg-gray-200 rounded w-2/3" />
                    <div className="h-10 bg-gray-100 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : otherArticles.length > 0 || (categoryFilter && news?.items) ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(categoryFilter ? news?.items : otherArticles)?.map((article: any) => (
                <Link key={article.id} to={`/news/${article.slug}`}>
                  <ArticleCard article={article} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl">
              <p className="text-[#0a0a1a]/40">Tidak ada artikel yang ditemukan</p>
            </div>
          )}
        </div>
      </Section>
    </>
  );
}
