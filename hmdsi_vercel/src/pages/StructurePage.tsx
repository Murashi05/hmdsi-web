import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { organizationStructure } from '../data/structure';
import SectionHeader from '../components/SectionHeader';

const PageHero = ({
  label,
  title,
  titleAccent,
  description,
}: {
  label: string;
  title: string;
  titleAccent: string;
  description: string;
}) => (
  <section className="pt-32 md:pt-44 pb-16 md:pb-24 bg-[#050014] relative overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,#0200B515,transparent)]" />
    <div
      className="absolute inset-0 opacity-[0.02]"
      style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }}
    />
    <div className="editorial-container relative z-10">
      <SectionHeader label={label} title={title} titleAccent={titleAccent} description={description} />
    </div>
  </section>
);

const OrgChart = () => {
  const leaders = organizationStructure.filter((r) => r.type === 'leader');
  const core = organizationStructure.filter((r) => r.type === 'core');
  const departments = organizationStructure.filter((r) => r.type === 'department');

  return (
    <section className="py-20 md:py-32 bg-[#f4f0e6] text-[#0a0a1a]" id="org-chart">
      <div className="editorial-container">

        <div className="mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-8 h-[2px] bg-[#0200B5]" />
            <span className="text-xs font-sans font-bold tracking-[0.2em] uppercase text-[#0200B5]">
              Mastaka
            </span>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-4 md:gap-6 max-w-2xl">
            {leaders.map((role, i) => (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group bg-gradient-to-br from-[#0200B5] to-[#0000F0] rounded-2xl p-6 md:p-8 text-white relative overflow-hidden transition-shadow duration-500"
              >
                <div className="text-xs font-sans font-bold tracking-[0.15em] uppercase text-white/60 mb-2">
                  {role.titleEn}
                </div>
                <h3 className="text-2xl md:text-3xl font-sans font-bold mb-3">
                  {role.title}
                </h3>
                <p className="text-white/70 font-sans text-sm font-light leading-relaxed">
                  {role.description}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center my-6 md:my-8">
            <div className="w-px h-12 bg-[#0200B5]/30 relative">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#0200B5]/30" />
            </div>
          </div>
        </div>

        <div className="mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-8 h-[2px] bg-[#0200B5]" />
            <span className="text-xs font-sans font-bold tracking-[0.2em] uppercase text-[#0200B5]">
              Departemen
            </span>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-4 md:gap-6 max-w-2xl">
            {core.map((role, i) => (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group bg-white rounded-2xl p-6 md:p-8 border border-[#0a0a1a]/5 transition-all duration-500"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-[10px] font-sans font-bold tracking-[0.15em] uppercase text-[#0200B5]">
                    {role.titleEn}
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-sans font-bold text-[#0a0a1a] mb-2">
                  {role.title}
                </h3>
                <p className="text-[#0a0a1a]/60 font-sans text-sm font-light leading-relaxed">
                  {role.description}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center my-6 md:my-8">
            <div className="w-px h-12 bg-[#0200B5]/30 relative">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#0200B5]/30" />
            </div>
          </div>
        </div>

        <div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {departments.map((dept, i) => (
              <motion.div
                key={dept.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group bg-white rounded-xl p-5 md:p-6 border border-[#0a0a1a]/5 transition-all duration-400 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0200B5] to-[#0000F0] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="mb-3">
                  <span className="text-[9px] font-sans font-bold tracking-[0.15em] uppercase text-[#0200B5]">
                    {dept.titleEn}
                  </span>
                </div>
                <h4 className="text-lg font-sans font-bold text-[#0a0a1a] mb-2 leading-snug">
                  {dept.title}
                </h4>
                <p className="text-[#0a0a1a]/50 font-sans text-xs md:text-sm font-light leading-relaxed">
                  {dept.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const ContactCTA = () => (
  <section className="py-16 md:py-24 bg-[#050014]" id="structure-cta">
    <div className="editorial-container text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h3 className="text-2xl md:text-4xl font-sans font-bold text-white mb-4">
          Ingin tahu lebih lanjut?
        </h3>
        <p className="text-white/50 font-sans text-base font-light mb-8 max-w-md mx-auto">
          Kunjungi media sosial kami untuk informasi terbaru seputar kegiatan HMDSI.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/about" className="btn-editorial btn-editorial-primary group">
            Tentang Kami
            <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="https://www.instagram.com/officialhmdsi"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-editorial btn-editorial-outline"
          >
            Follow Instagram
          </a>
        </div>
      </motion.div>
    </div>
  </section>
);

export default function StructurePage() {
  return (
    <>
      <Helmet>
        <title>Struktur Departemen | HMDSI FIT Telkom University</title>
        <meta
          name="description"
          content="Struktur Departemen HMDSI — Ketua, Wakil Ketua, Sekretaris, Bendahara, dan 9 departemen yang mengelola berbagai aspek kehidupan mahasiswa."
        />
        <meta property="og:title" content="Struktur Departemen HMDSI" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hmdsi.com/structure" />
        <meta property="og:site_name" content="HMDSI" />
        <meta
          property="og:description"
          content="Struktur Departemen HMDSI"
        />
        <link rel="canonical" href="https://hmdsi.com/structure" />
      </Helmet>

      <PageHero
        label="Struktur Departemen"
        title="Struktur "
        titleAccent="HMDSI"
        description="Mengenal jajaran pengurus dan departemen yang menggerakkan roda HMDSI."
      />
      <OrgChart />
      <ContactCTA />
    </>
  );
}
