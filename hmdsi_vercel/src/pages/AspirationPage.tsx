import { useEffect, useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { Send, Search, CheckCircle, Clock, AlertCircle, XCircle, MessageSquare, User, Hash, Mail, FileText } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import { useAspirationStats, useSubmitAspiration, useTrackAspiration } from '../hooks/useAspirations';
import type { Aspiration, AspirationStats } from '../services/api.types';

const CATEGORIES: { value: Aspiration['category']; label: string; desc: string }[] = [
  { value: 'academic', label: 'Akademik', desc: 'Perkuliahan, nilai, tugas, dosen' },
  { value: 'facility', label: 'Fasilitas', desc: 'Ruang kelas, lab, WiFi, kantin' },
  { value: 'internal', label: 'Internal', desc: 'Organisasi & kegiatan internal' },
  { value: 'general', label: 'Umum', desc: 'Lainnya / saran umum' },
];

const STATUS_CONFIG: Record<string, { label: string; icon: any; color: string; bg: string }> = {
  submitted: { label: 'Submitted', icon: Clock, color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/30' },
  under_review: { label: 'Under Review', icon: AlertCircle, color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/30' },
  in_progress: { label: 'In Progress', icon: AlertCircle, color: 'text-orange-400', bg: 'bg-orange-400/10 border-orange-400/30' },
  resolved: { label: 'Resolved', icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/30' },
  rejected: { label: 'Rejected', icon: XCircle, color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/30' },
};

const Section = ({ children, className = '', id = '' }: { children: React.ReactNode; className?: string; id?: string }) => (
  <section id={id} className={`py-20 md:py-32 ${className}`}>{children}</section>
);

export default function AspirationPage() {
  const [tab, setTab] = useState<'submit' | 'track'>('submit');
  const [submittedTrackingCode, setSubmittedTrackingCode] = useState<string | null>(null);

  // Submit form state
  const [category, setCategory] = useState<Aspiration['category']>('general');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [senderStudentId, setSenderStudentId] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { data: stats } = useAspirationStats();
  const submitMutation = useSubmitAspiration();

  // Track state
  const [trackCode, setTrackCode] = useState('');
  const [trackedAspiration, setTrackedAspiration] = useState<Aspiration | null>(null);
  const trackQuery = useTrackAspiration(trackedAspiration?.tracking_code || '');

  useEffect(() => {
    document.title = 'Kotak Aspirasi | HMDSI';
  }, []);

  useEffect(() => {
    if (trackQuery.data) {
      setTrackedAspiration(trackQuery.data as Aspiration);
    }
  }, [trackQuery.data]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const result = await submitMutation.mutateAsync({
        category,
        subject,
        message,
        is_anonymous: isAnonymous,
        is_public: false,
        sender_name: isAnonymous ? undefined : senderName,
        sender_email: isAnonymous ? undefined : senderEmail,
        sender_student_id: isAnonymous ? undefined : senderStudentId,
      });
      setSubmittedTrackingCode(result.tracking_code);
      // Reset form
      setSubject('');
      setMessage('');
      setSenderName('');
      setSenderEmail('');
      setSenderStudentId('');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Gagal mengirim aspirasi. Coba lagi.');
    }
  };

  const handleTrack = (e: FormEvent) => {
    e.preventDefault();
    if (!trackCode.trim()) return;
    setTrackedAspiration({ ...({} as Aspiration), tracking_code: trackCode.trim() });
  };

  return (
    <>
      <Helmet>
        <title>Kotak Aspirasi | HMDSI FIT Telkom University</title>
        <meta name="description" content="Sampaikan aspirasi dan lihat status penanganannya secara transparan." />
        <meta property="og:title" content="Kotak Aspirasi | HMDSI" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hmdsi.com/aspiration" />
        <link rel="canonical" href="https://hmdsi.com/aspiration" />
      </Helmet>

      {/* Hero */}
      <section className="pt-32 md:pt-44 pb-16 md:pb-24 bg-[#050014] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,#0200B515,transparent)]" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="editorial-container relative z-10">
          <SectionHeader
            label="Kotak Aspirasi"
            title="Sampaikan "
            titleAccent="Aspirasimu"
            description="Suara Anda penting bagi kami. Sampaikan aspirasi secara anonim atau terbuka, dan lacak status penanganannya."
          />
        </div>
      </section>

      {/* Stats */}
      {stats && (
        <section className="bg-[#050014] -mt-12 relative z-10 pb-0">
          <div className="editorial-container">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <p className="text-3xl md:text-4xl font-sans font-black text-white">{(stats as AspirationStats).total}</p>
                <p className="text-white/40 text-xs font-sans uppercase tracking-wider mt-1">Total</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-sans font-black text-blue-400">{(stats as AspirationStats).submitted}</p>
                <p className="text-white/40 text-xs font-sans uppercase tracking-wider mt-1">Submitted</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-sans font-black text-amber-400">{(stats as AspirationStats).under_review}</p>
                <p className="text-white/40 text-xs font-sans uppercase tracking-wider mt-1">Review</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-sans font-black text-emerald-400">{(stats as AspirationStats).resolved}</p>
                <p className="text-white/40 text-xs font-sans uppercase tracking-wider mt-1">Resolved</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-sans font-black text-[#0200B5]">{Math.round(((stats as AspirationStats).resolved / Math.max((stats as AspirationStats).total, 1)) * 100)}%</p>
                <p className="text-white/40 text-xs font-sans uppercase tracking-wider mt-1">Response Rate</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Tabs */}
      <Section className="bg-[#f4f0e6]">
        <div className="editorial-container max-w-3xl">
          <div className="flex bg-white rounded-full p-1 mb-8 max-w-sm mx-auto border border-[#0a0a1a]/5">
            <button
              onClick={() => setTab('submit')}
              className={`flex-1 py-2.5 px-4 rounded-full text-sm font-bold transition-all ${
                tab === 'submit' ? 'bg-[#0200B5] text-white' : 'text-[#0a0a1a]/60'
              }`}
            >
              Kirim Aspirasi
            </button>
            <button
              onClick={() => setTab('track')}
              className={`flex-1 py-2.5 px-4 rounded-full text-sm font-bold transition-all ${
                tab === 'track' ? 'bg-[#0200B5] text-white' : 'text-[#0a0a1a]/60'
              }`}
            >
              Lacak Status
            </button>
          </div>

          <AnimatePresence mode="wait">
            {tab === 'submit' ? (
              <motion.div
                key="submit"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl p-6 md:p-8 border border-[#0a0a1a]/5"
              >
                {submittedTrackingCode ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-emerald-500/10 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-emerald-500" />
                    </div>
                    <h3 className="text-2xl font-sans font-black text-[#0a0a1a] mb-2">Aspirasi Terkirim!</h3>
                    <p className="text-[#0a0a1a]/60 font-light mb-6">
                      Simpan kode tracking ini untuk memantau status aspirasi Anda:
                    </p>
                    <div className="bg-[#0200B5]/5 border border-[#0200B5]/20 rounded-xl p-4 mb-6">
                      <p className="font-mono text-2xl font-bold text-[#0200B5] tracking-wider">
                        {submittedTrackingCode}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button
                        onClick={() => {
                          setSubmittedTrackingCode(null);
                          setTab('track');
                          setTrackCode(submittedTrackingCode);
                        }}
                        className="px-5 py-2.5 border border-[#0200B5] text-[#0200B5] hover:bg-[#0200B5] hover:text-white text-sm font-bold rounded-full transition-all"
                      >
                        Lacak Sekarang
                      </button>
                      <button
                        onClick={() => setSubmittedTrackingCode(null)}
                        className="px-5 py-2.5 bg-[#0200B5] hover:bg-[#0000F0] text-white text-sm font-bold rounded-full transition-all"
                      >
                        Kirim Lagi
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                        {error}
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold text-[#0a0a1a]/60 uppercase tracking-wider mb-2">
                        Kategori <span className="text-red-500">*</span>
                      </label>
                      <div className="grid sm:grid-cols-2 gap-2">
                        {CATEGORIES.map((c) => (
                          <button
                            key={c.value}
                            type="button"
                            onClick={() => setCategory(c.value)}
                            className={`text-left p-3 rounded-lg border-2 transition-all ${
                              category === c.value
                                ? 'border-[#0200B5] bg-[#0200B5]/5'
                                : 'border-[#0a0a1a]/10 hover:border-[#0200B5]/30'
                            }`}
                          >
                            <p className="font-bold text-sm text-[#0a0a1a]">{c.label}</p>
                            <p className="text-xs text-[#0a0a1a]/50 mt-0.5">{c.desc}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0a0a1a]/60 uppercase tracking-wider mb-2">
                        Subjek <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0a0a1a]/40" />
                        <input
                          type="text"
                          required
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          className="w-full pl-10 pr-3 py-3 border border-[#0a0a1a]/10 rounded-lg text-[#0a0a1a] text-sm focus:border-[#0200B5] focus:outline-none"
                          placeholder="Ringkasan singkat"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0a0a1a]/60 uppercase tracking-wider mb-2">
                        Isi Aspirasi <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full px-3 py-3 border border-[#0a0a1a]/10 rounded-lg text-[#0a0a1a] text-sm focus:border-[#0200B5] focus:outline-none resize-none"
                        placeholder="Jelaskan aspirasi, saran, atau keluhan Anda secara detail..."
                      />
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-[#0200B5]/5 rounded-lg">
                      <input
                        type="checkbox"
                        id="anon"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                        className="w-4 h-4 accent-[#0200B5]"
                      />
                      <label htmlFor="anon" className="text-sm text-[#0a0a1a] font-medium cursor-pointer">
                        Kirim secara anonim (identitas tidak akan ditampilkan ke publik)
                      </label>
                    </div>

                    {!isAnonymous && (
                      <div className="space-y-3 p-4 bg-[#f4f0e6] rounded-lg">
                        <div>
                          <label className="block text-xs font-bold text-[#0a0a1a]/60 uppercase tracking-wider mb-1.5">
                            Nama
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0a0a1a]/40" />
                            <input
                              type="text"
                              value={senderName}
                              onChange={(e) => setSenderName(e.target.value)}
                              className="w-full pl-10 pr-3 py-2.5 bg-white border border-[#0a0a1a]/10 rounded-lg text-[#0a0a1a] text-sm focus:border-[#0200B5] focus:outline-none"
                              placeholder="Nama Anda"
                            />
                          </div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-[#0a0a1a]/60 uppercase tracking-wider mb-1.5">
                              Email
                            </label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0a0a1a]/40" />
                              <input
                                type="email"
                                value={senderEmail}
                                onChange={(e) => setSenderEmail(e.target.value)}
                                className="w-full pl-10 pr-3 py-2.5 bg-white border border-[#0a0a1a]/10 rounded-lg text-[#0a0a1a] text-sm focus:border-[#0200B5] focus:outline-none"
                                placeholder="email@..."
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-[#0a0a1a]/60 uppercase tracking-wider mb-1.5">
                              NIM (opsional)
                            </label>
                            <div className="relative">
                              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0a0a1a]/40" />
                              <input
                                type="text"
                                value={senderStudentId}
                                onChange={(e) => setSenderStudentId(e.target.value)}
                                className="w-full pl-10 pr-3 py-2.5 bg-white border border-[#0a0a1a]/10 rounded-lg text-[#0a0a1a] text-sm focus:border-[#0200B5] focus:outline-none"
                                placeholder="xxxxxxxx"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={submitMutation.isPending}
                      className="w-full py-3 bg-gradient-to-r from-[#0200B5] to-[#0000F0] hover:from-[#0000B0] hover:to-[#0000D0] text-white font-bold rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      {submitMutation.isPending ? 'Mengirim...' : 'Kirim Aspirasi'}
                    </button>
                  </form>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="track"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl p-6 md:p-8 border border-[#0a0a1a]/5"
              >
                <form onSubmit={handleTrack} className="mb-6">
                  <label className="block text-xs font-bold text-[#0a0a1a]/60 uppercase tracking-wider mb-2">
                    Kode Tracking
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0a0a1a]/40" />
                      <input
                        type="text"
                        value={trackCode}
                        onChange={(e) => setTrackCode(e.target.value.toUpperCase())}
                        className="w-full pl-10 pr-3 py-3 border border-[#0a0a1a]/10 rounded-lg text-[#0a0a1a] font-mono text-sm focus:border-[#0200B5] focus:outline-none"
                        placeholder="ASP-2026-XXXXX"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!trackCode.trim() || trackQuery.isFetching}
                      className="px-5 py-3 bg-[#0200B5] hover:bg-[#0000F0] text-white text-sm font-bold rounded-lg transition-all disabled:opacity-50"
                    >
                      {trackQuery.isFetching ? 'Mencari...' : 'Lacak'}
                    </button>
                  </div>
                  <p className="text-xs text-[#0a0a1a]/40 mt-2">
                    Masukkan kode yang Anda terima saat mengirim aspirasi
                  </p>
                </form>

                {trackQuery.error && (
                  <div className="text-center py-8 text-[#0a0a1a]/60">
                    <XCircle className="w-12 h-12 mx-auto mb-2 text-red-300" />
                    <p>Aspirasi tidak ditemukan. Periksa kembali kode Anda.</p>
                  </div>
                )}

                {trackedAspiration && trackedAspiration.id && (
                  <div className="space-y-4 border-t border-[#0a0a1a]/10 pt-6">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <p className="text-xs text-[#0a0a1a]/40 font-mono">{trackedAspiration.tracking_code}</p>
                        <h3 className="text-lg font-sans font-bold text-[#0a0a1a] mt-1">{trackedAspiration.subject}</h3>
                        <p className="text-xs text-[#0a0a1a]/40 mt-1">
                          {new Date(trackedAspiration.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      {(() => {
                        const cfg = STATUS_CONFIG[trackedAspiration.status] || STATUS_CONFIG.submitted;
                        const StatusIcon = cfg.icon;
                        return (
                          <span className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border ${cfg.bg} ${cfg.color}`}>
                            <StatusIcon className="w-3.5 h-3.5" />
                            {cfg.label}
                          </span>
                        );
                      })()}
                    </div>

                    <div className="bg-[#f4f0e6] rounded-lg p-4">
                      <p className="text-xs font-bold text-[#0a0a1a]/60 uppercase tracking-wider mb-2">Pesan Anda</p>
                      <p className="text-[#0a0a1a] text-sm font-light leading-relaxed">{trackedAspiration.message}</p>
                    </div>

                    {trackedAspiration.responses && trackedAspiration.responses.length > 0 && (
                      <div>
                        <p className="text-xs font-bold text-[#0a0a1a]/60 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <MessageSquare className="w-3.5 h-3.5" /> Tanggapan ({trackedAspiration.responses.length})
                        </p>
                        <div className="space-y-3">
                          {trackedAspiration.responses.map((r: any) => (
                            <div key={r.id} className="bg-[#0200B5]/5 border border-[#0200B5]/20 rounded-lg p-4">
                              <p className="text-[#0a0a1a] text-sm font-light leading-relaxed">{r.message}</p>
                              <p className="text-xs text-[#0a0a1a]/40 mt-2">
                                {new Date(r.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Section>
    </>
  );
}
