import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { X, Calendar, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import { useGalleryEvents, useGalleryEvent } from '../hooks/useGallery';

const Section = ({ children, className = '', id = '' }: { children: React.ReactNode; className?: string; id?: string }) => (
  <section id={id} className={`py-20 md:py-32 ${className}`}>{children}</section>
);

export default function GalleryPage() {
  const { data: events, isLoading } = useGalleryEvents();
  const [selectedEventSlug, setSelectedEventSlug] = useState<string | null>(null);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const { data: selectedEvent } = useGalleryEvent(selectedEventSlug || '');

  const openEvent = (slug: string) => {
    setSelectedEventSlug(slug);
    setLightboxIdx(null);
  };

  const closeModal = () => {
    setSelectedEventSlug(null);
    setLightboxIdx(null);
  };

  const items = (selectedEvent as any)?.items || [];
  const lightboxItem = lightboxIdx !== null ? items[lightboxIdx] : null;

  return (
    <>
      <Helmet>
        <title>Galeri Dokumentasi | HMDSI FIT Telkom University</title>
        <meta name="description" content="Galeri dokumentasi kegiatan dan program kerja HMDSI." />
        <meta property="og:title" content="Galeri | HMDSI" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hmdsi.com/gallery" />
        <link rel="canonical" href="https://hmdsi.com/gallery" />
      </Helmet>

      {/* Hero */}
      <section className="pt-32 md:pt-44 pb-16 md:pb-24 bg-[#050014] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,#0200B515,transparent)]" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="editorial-container relative z-10">
          <SectionHeader
            label="Galeri"
            title="Dokumentasi "
            titleAccent="Kami"
            description="Momen-momen berharga dari berbagai kegiatan dan program kerja HMDSI."
          />
        </div>
      </section>

      {/* Albums Grid */}
      <Section className="bg-[#f4f0e6]">
        <div className="editorial-container">
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-square bg-gray-300 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : events?.items && events.items.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {events.items.map((event: any, i: number) => (
                <motion.button
                  key={event.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  onClick={() => openEvent(event.slug)}
                  className="group aspect-square bg-white rounded-2xl overflow-hidden border border-[#0a0a1a]/5 hover:border-[#0200B5]/20 hover:shadow-lg transition-all text-left"
                >
                  {event.cover_image_url ? (
                    <img
                      src={event.cover_image_url}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#0200B5]/10 to-[#0000F0]/10 flex items-center justify-center">
                      <ImageIcon className="w-16 h-16 text-[#0200B5]/30" />
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-b-2xl">
                    <p className="text-white font-sans font-bold text-sm line-clamp-1">{event.title}</p>
                    <p className="text-white/70 text-xs mt-1">
                      {event.items_count || 0} foto
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl">
              <p className="text-[#0a0a1a]/40">Belum ada album galeri</p>
            </div>
          )}
        </div>
      </Section>

      {/* Event Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm overflow-y-auto"
            onClick={closeModal}
          >
            <div className="min-h-screen p-4 md:p-8" onClick={(e) => e.stopPropagation()}>
              <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 sticky top-4 z-10">
                  <div className="bg-[#050014] border border-white/10 rounded-2xl p-4 backdrop-blur-xl flex-1 mr-4">
                    <h2 className="text-white font-sans font-bold text-xl md:text-2xl">{(selectedEvent as any).title}</h2>
                    <div className="flex items-center gap-4 mt-2 text-white/40 text-xs">
                      {(selectedEvent as any).event_date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date((selectedEvent as any).event_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <ImageIcon className="w-3 h-3" />
                        {items.length} foto
                      </span>
                    </div>
                    {(selectedEvent as any).description && (
                      <p className="text-white/60 text-sm mt-3 font-light">{(selectedEvent as any).description}</p>
                    )}
                  </div>
                  <button
                    onClick={closeModal}
                    className="w-12 h-12 bg-[#050014] hover:bg-[#0200B5] text-white rounded-full flex items-center justify-center transition-colors shrink-0"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Gallery Grid */}
                {items.length > 0 ? (
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {items.map((item: any, i: number) => (
                      <button
                        key={item.id}
                        onClick={() => setLightboxIdx(i)}
                        className="aspect-square bg-white/5 rounded-xl overflow-hidden hover:ring-2 hover:ring-[#0200B5] transition-all"
                      >
                        <img
                          src={item.thumbnail_url || item.file_url}
                          alt={item.caption || ''}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-white/60 py-12">Tidak ada foto di album ini</div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxIdx(null)}
            className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4"
          >
            <button
              onClick={() => setLightboxIdx(null)}
              className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
            {lightboxIdx > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIdx(lightboxIdx - 1);
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            {lightboxIdx < items.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIdx(lightboxIdx + 1);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
            <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
              <img
                src={lightboxItem.file_url}
                alt={lightboxItem.caption || ''}
                className="w-full h-auto max-h-[85vh] object-contain rounded-2xl"
              />
              {lightboxItem.caption && (
                <p className="text-white text-center mt-4 font-light">{lightboxItem.caption}</p>
              )}
              <p className="text-white/40 text-center text-xs mt-2">
                {lightboxIdx + 1} / {items.length}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
