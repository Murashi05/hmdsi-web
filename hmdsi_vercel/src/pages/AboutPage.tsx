import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, BookOpen, Zap, Globe, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
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

const AboutContent = () => {
  return (
    <section className="py-20 md:py-32 bg-[#f4f0e6] text-[#0a0a1a]" id="about-content">
      <div className="editorial-container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-[2px] bg-[#0200B5]" />
                <span className="text-xs font-sans font-bold tracking-[0.2em] uppercase text-[#0200B5]">
                  Visi
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-sans font-bold text-[#0a0a1a] leading-snug mb-6">
                Mewujudkan HMDSI sebagai poros utama pengembangan mahasiswa yang inklusif, dan sinergis melalui sistem kerja yang terstruktur serta keterlibatan seluruh elemen keluarga besar Diploma Sistem Informasi, guna menciptakan kebermanfaatan yang nyata dan merata.
              </h3>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mt-12"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-[2px] bg-[#0200B5]" />
                <span className="text-xs font-sans font-bold tracking-[0.2em] uppercase text-[#0200B5]">
                  Misi
                </span>
              </div>
              <ul className="space-y-4">
                {[
                  'Membangun budaya organisasi yang inklusif, egaliter, dan kolaboratif.',
                  'Mengukuhkan himpunan sebagai pusat pelayanan yang responsif, transparan, dan aksesibel bagi seluruh mahasiswa D3SI.',
                  'Mengoptimalkan fungsi setiap departemen melalui sistem tata kelola yang efisien, adaptif, terstruktur, dan terstandarisasi.',
                  'Menghadirkan program kerja yang relevan, berdampak, dan berorientasi pada kebutuhan nyata mahasiswa.',
                  'Mewujudkan budaya organisasi yang berkelanjutan dan progresif.',

                ].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                    className="flex gap-4 text-[#0a0a1a]/70 font-sans text-base font-light leading-relaxed"
                  >
                    <span className="mt-1.5 w-2 h-2 rounded-full bg-gradient-to-r from-[#0200B5] to-[#0000F0] shrink-0" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-[#0200B5] to-[#0000F0] rounded-2xl p-8 md:p-12 text-white mb-8"
            >
              <img
                src="/images/hmdsi.svg"
                alt="HMDSI"
                className="w-16 h-16 mb-8"
              />
              <h3 className="text-2xl md:text-3xl font-sans font-bold mb-4">
                Himpunan Mahasiswa Diploma Sistem Informasi
              </h3>
              <p className="text-white/80 font-sans text-base font-light leading-relaxed mb-6">
                Organisasi kemahasiswaan tingkat program studi di bawah Fakultas Ilmu Terapan, Telkom University. Didirikan untuk mewadahi aspirasi dan kreativitas mahasiswa Diploma Sistem Informasi.
              </p>
              <div className="flex items-center gap-3 text-white/60 text-sm font-sans">
                <Globe className="w-4 h-4" />
                <span>Telkom University, Bandung</span>
              </div>
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { number: '9', label: 'Departemen', icon: BookOpen },
                { number: '???+', label: 'Anggota Aktif', icon: Users },
                { number: '??+', label: 'Program Kerja', icon: Zap },
                { number: '??+', label: 'Event per Tahun', icon: Globe },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-white rounded-xl p-6 border border-[#0a0a1a]/5 hover:border-[#0200B5]/20 hover:shadow-lg hover:shadow-[#0200B5]/5 transition-all duration-300 group"
                >
                  <stat.icon className="w-5 h-5 text-[#0200B5] mb-3 group-hover:scale-110 transition-transform" />
                  <div className="text-2xl md:text-3xl font-sans font-black bg-gradient-to-r from-[#0200B5] to-[#0000F0] bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-[10px] md:text-xs font-sans font-bold uppercase tracking-wider text-[#0a0a1a]/40 mt-1">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const HistorySection = () => {
  return (
    <section className="py-20 md:py-32 bg-[#050014]" id="history">
      <div className="editorial-container">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <SectionHeader
            label="Perjalanan Kami"
            title="Bertumbuh "
            titleAccent="Bersama"
            centered
            description="Dari awal berdiri hingga saat ini, HMDSI terus bertransformasi untuk memberikan yang terbaik bagi anggotanya."
          />
        </div>

        <div className="max-w-2xl mx-auto space-y-0">
          {[
            {
              year: 'Apa Itu HIMA?',
              title: 'Himpunan Mahasiswa',
              desc: 'Himpunan Mahasiswa (HIMA) merupakan salah satu organisasi mahasiswa yang berada di tingkat jurusan dan termasuk organisasi intra kampus. HIMA menjadi media bagi para anggotanya agar mampu mengembangkan pola pikir, kepribadian, serta potensi yang dimiliki oleh setiap mahasiswa.',
            },
            {
              year: '16 Juni 2009',
              title: 'Berdirinya HMMI',
              desc: 'Dikarenakan oleh desakan dari berbagai pihak, baik mahasiswa, Prodi Sistem Informasi maupun Badan Eksekutif Mahasiswa untuk membentuk sebuah himpunan mahasiswa. Terbentuklah Himpunan Mahasiswa Manajemen Informatika (HMMI) pada tanggal 16 Juni 2009.',
            },
            {
              year: '30 Januari 2019',
              title: 'HMMI Menjadi HMDSI',
              desc: 'Berdasarkan Keputusan Menteri Riset, Teknologi, dan Pendidikan Tinggi RI Nomor 747/KPT/I/2018 tentang Perubahan Nama Program Studi pada Universitas Telkom, dan hasil Musyawarah Besar, disepakati bahwa HMMI berganti nama menjadi Himpunan Mahasiswa Diploma Sistem Informasi (HMDSI).',
            },
            {
              year: 'Sekarang',
              title: 'HMDSI Hari Ini',
              desc: 'Terus berinovasi dan berkolaborasi dengan 9 departemen aktif, membawa dampak positif bagi anggota dan masyarakat luas melalui berbagai program kerja.',
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="flex gap-6 md:gap-8 group"
            >
              <div className="flex flex-col items-center shrink-0">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#0200B5] to-[#0000F0] ring-4 ring-[#0200B5]/10 transition-all" />
                {i < 3 && <div className="w-px flex-1 bg-white/10 min-h-[80px]" />}
              </div>

              <div className="pb-10 md:pb-14">
                <span className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-[#0200B5]">
                  {item.year}
                </span>
                <h4 className="text-xl md:text-2xl font-sans font-bold text-white mt-2 mb-2">
                  {item.title}
                </h4>
                <p className="text-white/50 font-sans text-sm md:text-base font-light leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link to="/structure" className="btn-editorial btn-editorial-primary group">
            Lihat Struktur Organisasi
            <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default function AboutPage() {
  return (
    <>
      <Helmet>
        <title>Tentang HMDSI | Himpunan Mahasiswa Diploma Sistem Informasi FIT Telkom University</title>
        <meta
          name="description"
          content="Tentang HMDSI — Himpunan Mahasiswa Diploma Sistem Informasi, Fakultas Ilmu Terapan, Telkom University. Visi, misi, dan sejarah organisasi."
        />
        <meta property="og:title" content="Tentang HMDSI" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hmdsi.com/about" />
        <meta property="og:site_name" content="HMDSI" />
        <meta
          property="og:description"
          content="Tentang HMDSI — Himpunan Mahasiswa Diploma Sistem Informasi, Fakultas Ilmu Terapan, Telkom University."
        />
        <link rel="canonical" href="https://hmdsi.com/about" />
      </Helmet>

      <PageHero
        label="Tentang Kami"
        title="Mengenal "
        titleAccent="HMDSI"
        description="Organisasi kemahasiswaan yang bergerak di bidang sistem informasi, membangun karakter dan kompetensi mahasiswa."
      />
      <AboutContent />
      <HistorySection />
    </>
  );
}
