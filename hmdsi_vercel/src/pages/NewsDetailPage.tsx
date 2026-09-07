import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Calendar, Eye, User, Tag } from 'lucide-react';
import { useNewsArticles, useNewsArticle } from '../hooks/useNews';

export default function NewsDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: article, isLoading, error } = useNewsArticle(slug || '');

  useEffect(() => {
    if (article) {
      document.title = `${article.title} | HMDSI`;
    } else {
      document.title = 'Article | HMDSI';
    }
    window.scrollTo(0, 0);
  }, [article]);

  const { data: relatedNews } = useNewsArticles({
    category: article?.category,
    status: 'published',
    per_page: 3,
  } as any);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 bg-[#050014] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#0200B5] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-[#050014] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-sans font-black text-white mb-4">Artikel Tidak Ditemukan</h1>
          <p className="text-white/60 mb-8">Artikel yang Anda cari tidak tersedia.</p>
          <Link to="/news" className="btn-editorial btn-editorial-primary group">
            <ArrowLeft className="w-4 h-4 mr-3 group-hover:-translate-x-1 transition-transform" />
            Kembali ke Daftar Artikel
          </Link>
        </div>
      </div>
    );
  }

  const related = relatedNews?.items?.filter((n: any) => n.id !== article.id).slice(0, 3) || [];

  return (
    <>
      <Helmet>
        <title>{article.title} | HMDSI</title>
        <meta name="description" content={article.excerpt || ''} />
        <meta property="og:title" content={article.title} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://hmdsi.com/news/${article.slug}`} />
        {article.cover_image_url && <meta property="og:image" content={article.cover_image_url} />}
        <link rel="canonical" href={`https://hmdsi.com/news/${article.slug}`} />
      </Helmet>

      {/* Hero / Cover */}
      <article className="bg-[#050014]">
        <header className="pt-32 md:pt-44 pb-12 md:pb-16 relative overflow-hidden">
          {article.cover_image_url && (
            <>
              <div className="absolute inset-0 opacity-20">
                <img src={article.cover_image_url} alt={article.title} className="w-full h-full object-cover" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-[#050014]/60 via-[#050014]/80 to-[#050014]" />
            </>
          )}
          <div className="editorial-container relative z-10">
            <Link
              to="/news"
              className="inline-flex items-center gap-2 text-white/60 hover:text-white text-xs font-sans uppercase tracking-wider mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </Link>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-6 flex-wrap">
                <span className="px-3 py-1 bg-[#0200B5]/20 text-[#0200B5] text-xs font-bold rounded-full capitalize">
                  {article.category}
                </span>
                {article.is_featured && (
                  <span className="px-3 py-1 bg-amber-500/20 text-amber-400 text-xs font-bold rounded-full">
                    ⭐ Featured
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-sans font-black text-white leading-tight mb-6 max-w-4xl">
                {article.title}
              </h1>
              <div className="flex items-center gap-4 text-white/40 text-sm flex-wrap">
                {article.published_at && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {new Date(article.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                )}
                {article.author?.name && (
                  <span className="flex items-center gap-1.5">
                    <User className="w-4 h-4" />
                    {article.author.name}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  {article.view_count || 0} views
                </span>
              </div>
            </motion.div>
          </div>
        </header>

        {/* Cover Image */}
        {article.cover_image_url && (
          <div className="editorial-container -mt-4 mb-12">
            <img
              src={article.cover_image_url}
              alt={article.title}
              className="w-full aspect-[21/9] object-cover rounded-2xl"
            />
          </div>
        )}

        {/* Content */}
        <div className="editorial-container max-w-4xl pb-20">
          {article.excerpt && (
            <p className="text-xl text-white/70 font-light italic leading-relaxed mb-8 border-l-4 border-[#0200B5] pl-6">
              {article.excerpt}
            </p>
          )}

          <div
            className="prose prose-invert prose-lg max-w-none
              prose-headings:font-sans prose-headings:font-black prose-headings:text-white
              prose-p:text-white/70 prose-p:font-light prose-p:leading-relaxed
              prose-a:text-[#0200B5] prose-a:no-underline hover:prose-a:underline
              prose-strong:text-white
              prose-ul:text-white/70 prose-ol:text-white/70
              prose-blockquote:border-l-[#0200B5] prose-blockquote:text-white/60 prose-blockquote:font-light
              prose-code:text-[#0200B5] prose-code:bg-[#0200B5]/10 prose-code:px-1 prose-code:rounded
            "
            dangerouslySetInnerHTML={{ __html: article.content || '' }}
          />

          {article.tags && article.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-white/10">
              <p className="text-white/40 text-xs font-sans uppercase tracking-wider mb-3 flex items-center gap-2">
                <Tag className="w-3 h-3" /> Tags
              </p>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-[#0200B5]/10 text-[#0200B5] text-xs font-medium rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section className="py-20 md:py-32 bg-[#f4f0e6]">
          <div className="editorial-container">
            <h2 className="text-2xl md:text-3xl font-sans font-black text-[#0a0a1a] mb-10">
              Artikel Terkait
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((item: any) => (
                <Link
                  key={item.id}
                  to={`/news/${item.slug}`}
                  className="group bg-white rounded-xl overflow-hidden border border-[#0a0a1a]/5 hover:border-[#0200B5]/20 hover:shadow-lg transition-all"
                >
                  <div className="aspect-[16/9] bg-gradient-to-br from-[#0200B5]/5 to-[#0000F0]/5 relative overflow-hidden">
                    {item.cover_image_url && (
                      <img src={item.cover_image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-base font-sans font-bold text-[#0a0a1a] mb-2 line-clamp-2 group-hover:text-[#0200B5] transition-colors">
                      {item.title}
                    </h3>
                    {item.excerpt && (
                      <p className="text-[#0a0a1a]/50 text-sm font-light line-clamp-2">
                        {item.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
