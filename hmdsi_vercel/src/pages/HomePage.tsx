import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Users, Lightbulb, Heart, Target } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import { useSiteStats } from '../hooks/useSiteStats';

const heroWords = ['Kata', 'Hati', 'Tujuan'];

const Hero = () => {
  const containerRef = useRef(null);
  const [wordIndex, setWordIndex] = useState(0);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % heroWords.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const yText = useTransform(scrollYProgress, [0, 1], ['0%', '80%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[90svh] lg:h-screen lg:min-h-[700px] max-h-[1100px] overflow-hidden flex items-center pt-24 lg:pt-20"
      id="hero"
    >
      <div className="absolute inset-0 bg-[#050014]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,#0200B520,transparent)]" />
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#050014] to-transparent" />
    
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
        <motion.div
          animate={{ y: [0, -30, 0], x: [0, 15, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 right-1/4 w-72 h-72 md:w-96 md:h-96 bg-[#0200B5]/10 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-1/4 left-1/4 w-64 h-64 md:w-80 md:h-80 bg-[#0000F0]/8 rounded-full blur-[100px]"
        />
      </div>

      <motion.div
        style={{ y: yText, opacity }}
        className="relative z-10 w-full editorial-container"
      >
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-20 items-center w-full pb-10 lg:pb-0">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center gap-3 md:gap-4 mb-8 md:mb-12"
            >
              <div className="w-10 md:w-16 h-[2px] bg-gradient-to-r from-[#0200B5] to-[#0000F0]" />
              <span className="text-[10px] md:text-xs font-sans font-bold tracking-[0.25em] uppercase text-white/50">
                Himpunan Mahasiswa Diploma Sistem Informasi
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-[5.5rem] md:text-7xl lg:text-[7rem] font-sans font-black leading-[0.9] tracking-tight mb-8 md:mb-10"
            >
              <span className="block text-white">Satu</span>
              <span className="block mt-1 h-[1.2em] overflow-hidden relative">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={wordIndex}
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -40, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
                    className="block text-white font-light italic"
                  >
                    {heroWords[wordIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="max-w-md font-sans text-base md:text-lg font-light text-white/50 leading-relaxed mb-10"
            >
              Satu Kata, Satu Hati, Satu Tujuan — Membangun komunitas mahasiswa yang inovatif, kolaboratif, dan berdampak.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Link to="/about" className="btn-editorial btn-editorial-primary group shrink-0">
                Tentang Kami
                <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/structure" className="btn-editorial btn-editorial-outline shrink-0">
                Struktur
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="hidden lg:flex items-center justify-end w-full"
          >
            <div className="relative w-40 h-40 md:w-72 md:h-72 xl:w-96 xl:h-96">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0200B5]/20 to-[#0000F0]/10 rounded-full blur-[40px] md:blur-[60px]" />
              <img
                src="/images/hmdsi.svg"
                alt="HMDSI Logo"
                className="relative z-10 w-full h-full object-contain drop-shadow-2xl"
              />
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-20 text-white/30 flex flex-col items-center"
      >
        <span className="text-[9px] uppercase font-bold tracking-[0.2em] mb-3">Scroll</span>
        <div className="w-[1px] h-12 bg-white/20 relative overflow-hidden">
          <motion.div
            animate={{ y: ['-100%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            className="w-full h-1/2 bg-[#0200B5] absolute top-0"
          />
        </div>
      </motion.div>
    </section>
  );
};

const AboutPreview = () => {
  const { data: stats } = useSiteStats();
  const departmentStat = stats?.find((item) => item.key === 'total_departments');
  const memberStat = stats?.find((item) => item.key === 'total_members');

  return (
    <section className="py-20 md:py-32 bg-[#f4f0e6] text-[#0a0a1a]" id="about-preview">
      <div className="editorial-container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[4/5] md:aspect-[3/4] bg-gradient-to-br from-[#0200B5] to-[#0000F0] rounded-2xl overflow-hidden relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src="/images/hmdsi.svg"
                  alt="HMDSI Logo"
                  className="w-3/5 h-3/5 object-contain"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#0200B5] to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <p className="font-sans text-3xl md:text-4xl font-bold text-white leading-tight">
                  Lebih dari sekadar himpunan.
                </p>
              </div>
            </div>
            <div className="absolute -z-10 -bottom-4 -right-4 w-full h-full border-2 border-[#0200B5]/20 rounded-2xl hidden md:block" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <SectionHeader
              label="Siapa Kami"
              title="Wadah Aspirasi "
              titleAccent="Mahasiswa"
              light
            />

            <div className="space-y-5 text-[#0a0a1a]/70 font-sans text-base md:text-lg font-light leading-relaxed mt-8 mb-10">
              <p>
                HMDSI adalah organisasi kemahasiswaan tingkat program studi Diploma Sistem Informasi di Fakultas Ilmu Terapan, Telkom University.
              </p>
              <p>
                Kami berkomitmen untuk menciptakan lingkungan belajar yang kolaboratif, memberdayakan mahasiswa, dan membangun jaringan yang kuat di dunia teknologi informasi.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 md:gap-12 border-t border-[#0a0a1a]/10 pt-8 mb-10">
              <div>
                <div className="text-4xl md:text-5xl font-sans font-black bg-gradient-to-r from-[#0200B5] to-[#0000F0] bg-clip-text text-transparent mb-2">
                  {departmentStat?.value ?? '—'}
                </div>
                <div className="text-[10px] md:text-xs font-sans font-bold uppercase tracking-wider text-[#0a0a1a]/50">
                  {departmentStat?.label ?? 'Departemen'}
                </div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-sans font-black bg-gradient-to-r from-[#0200B5] to-[#0000F0] bg-clip-text text-transparent mb-2">
                  {memberStat?.value ?? '—'}
                </div>
                <div className="text-[10px] md:text-xs font-sans font-bold uppercase tracking-wider text-[#0a0a1a]/50">
                  {memberStat?.label ?? 'Anggota Aktif'}
                </div>
              </div>
            </div>

            <Link to="/about" className="btn-editorial btn-editorial-primary group">
              Selengkapnya
              <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const ValuesSection = () => {
  const values = [
    {
      title: 'Kolaborasi',
      desc: 'Membangun sinergi yang kuat antar anggota untuk mencapai tujuan bersama.',
      icon: Users,
    },
    {
      title: 'Inovasi',
      desc: 'Mendorong kreativitas dan pemikiran baru di bidang teknologi informasi.',
      icon: Lightbulb,
    },
    {
      title: 'Dedikasi',
      desc: 'Berkomitmen penuh dalam setiap program kerja dan kegiatan organisasi.',
      icon: Heart,
    },
    {
      title: 'Integritas',
      desc: 'Menjunjung tinggi kejujuran dan tanggung jawab dalam setiap tindakan.',
      icon: Target,
    },
  ];

  return (
    <section className="py-20 md:py-32 bg-[#050014] relative overflow-hidden" id="values">
      <div className="absolute top-8 md:top-16 left-1/2 -translate-x-1/2 w-full text-center pointer-events-none select-none">
        <span className="text-[4rem] md:text-[8rem] lg:text-[10rem] font-sans font-black text-white/[0.02] leading-none tracking-tighter uppercase">
          VALUES
        </span>
      </div>

      <div className="editorial-container relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-24">
          <SectionHeader
            label="Nilai Kami"
            title="Fondasi yang "
            titleAccent="Kokoh"
            centered
            description="Setiap langkah kami dipandu oleh nilai-nilai yang membentuk karakter organisasi dan anggota."
          />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 rounded-2xl overflow-hidden">
          {values.map((value, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-[#050014] p-8 md:p-10 lg:p-12 group hover:bg-[#0a0a2a] transition-colors duration-500"
            >
              <value.icon className="w-8 h-8 md:w-10 md:h-10 text-[#0200B5] mb-8 md:mb-10 group-hover:scale-110 transition-transform duration-500" />
              <h4 className="text-xl md:text-2xl font-sans font-bold text-white mb-4 relative inline-block">
                {value.title}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-[#0200B5] to-[#0000F0] group-hover:w-full transition-all duration-500" />
              </h4>
              <p className="text-white/50 font-sans text-sm md:text-base font-light leading-relaxed">
                {value.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTASection = () => {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-[#0200B5] to-[#0000F0] relative overflow-hidden" id="cta">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="editorial-container relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <img
            src="/images/hmdsi.svg"
            alt="HMDSI"
            className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-8"
          />
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-sans font-black text-white leading-tight mb-6">
            Satu Kata, Satu Hati, Satu Tujuan.
          </h2>
          <p className="max-w-xl mx-auto font-sans text-base md:text-lg text-white/80 font-light leading-relaxed mb-10">
            Kembangkan potensi dirimu bersama HMDSI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/structure"
              className="btn-editorial bg-white text-[#0200B5] hover:bg-white/90 font-bold group"
            >
              Lihat Struktur
              <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="https://www.instagram.com/officialhmdsi"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-editorial border-white/30 text-white hover:bg-white/10"
            >
              Follow Instagram
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>HMDSI | Himpunan Mahasiswa Diploma Sistem Informasi FIT Telkom University</title>
        {/*
        <meta
          name="description"
          content="Unofficial Website of HMDSI — Himpunan Mahasiswa Diploma Sistem Informasi, Fakultas Ilmu Terapan, Telkom University. Powered by xerme."
        />
        */}
        <meta
          name="description"
          content="Unofficial Website of HMDSI — Himpunan Mahasiswa Diploma Sistem Informasi, Powered by xerme."
        />
        <meta property="og:title" content="HMDSI | Himpunan Mahasiswa Diploma Sistem Informasi" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hmdsi.com" />
        <meta property="og:site_name" content="HMDSI" />
        <meta
          property="og:description"
          content="Website resmi HMDSI — Himpunan Mahasiswa Diploma Sistem Informasi, Fakultas Ilmu Terapan, Telkom University."
        />
        <link rel="canonical" href="https://hmdsi.com" />
      </Helmet>

      <Hero />
      <AboutPreview />
      <ValuesSection />
      <CTASection />
    </>
  );
}
