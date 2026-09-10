import { motion } from 'motion/react';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, Instagram, Linkedin, RefreshCw } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import { usePeriods } from '../hooks/usePeriod';
import { useManagementStructures } from '../hooks/useManagementStructures';
import type { ManagementStructure } from '../services/api.types';

const LEADER_ROLES = new Set(['Ketua Himpunan', 'Wakil Ketua Himpunan']);

export default function StructurePage() {
  const {
    data: periods = [],
    isLoading: periodLoading,
    isError: periodError,
    refetch: refetchPeriods,
  } = usePeriods();

  const activePeriod = periods.find((period) => period.is_active) ?? periods[0];
  const [selected, setSelected] = useState<number | undefined>();

  useEffect(() => {
    if (activePeriod?.id && selected === undefined) {
      setSelected(activePeriod.id);
    }
  }, [activePeriod?.id, selected]);

  const period = periods.find((item) => item.id === selected) ?? activePeriod;

  const {
    data: structures = [],
    isLoading: structureLoading,
    isError: structureError,
    refetch: refetchStructures,
  } = useManagementStructures(
    period?.id ? { period_id: period.id } : undefined
  );

  const leaders = useMemo(
    () => structures.filter((item) => LEADER_ROLES.has(item.role?.name ?? '')),
    [structures]
  );

  const departmentGroups = useMemo(() => {
    const groups = new Map<number, { id: number; name: string; sortOrder: number; members: ManagementStructure[] }>();

    structures.forEach((item) => {
      const department = item.department;
      if (!department || department.type !== 'department') return;

      const existing = groups.get(department.id);
      if (existing) {
        existing.members.push(item);
      } else {
        groups.set(department.id, {
          id: department.id,
          name: department.name,
          sortOrder: department.sort_order,
          members: [item],
        });
      }
    });

    return [...groups.values()]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((group) => ({
        ...group,
        members: [...group.members].sort(
          (a, b) => (a.role?.level ?? 99) - (b.role?.level ?? 99)
        ),
      }));
  }, [structures]);

  const core = useMemo(
    () =>
      structures
        .filter(
          (item) =>
            !LEADER_ROLES.has(item.role?.name ?? '') &&
            item.department?.type !== 'department'
        )
        .sort((a, b) => (a.role?.level ?? 99) - (b.role?.level ?? 99)),
    [structures]
  );

  const loading = periodLoading || (Boolean(period?.id) && structureLoading);
  const hasError = periodError || structureError;

  const retry = () => {
    if (periodError) {
      refetchPeriods();
    } else {
      refetchStructures();
    }
  };

  return (
    <>
      <Helmet>
        <title>Struktur Kepengurusan HMDSI</title>
        <meta
          name="description"
          content="Struktur pengurus HMDSI berdasarkan periode kepengurusan."
        />
      </Helmet>

      <section className="pt-32 md:pt-44 pb-16 bg-[#050014]">
        <div className="editorial-container">
          <SectionHeader
            label="Struktur Kepengurusan"
            title="Kabinet "
            titleAccent={period?.theme || 'HMDSI'}
            description={
              period
                ? `Periode ${period.name} — ${period.theme || 'Kabinet HMDSI'}.`
                : 'Pilih periode kepengurusan untuk melihat struktur organisasi.'
            }
          />

          {periods.length > 0 && (
            <div className="mt-8 max-w-sm">
              <label
                htmlFor="structure-period"
                className="block text-xs uppercase tracking-wider text-white/50 mb-2"
              >
                Lihat Periode
              </label>
              <select
                id="structure-period"
                value={selected ?? activePeriod?.id ?? ''}
                onChange={(event) => setSelected(Number(event.target.value))}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#0200B5]/60"
              >
                {periods.map((item) => (
                  <option key={item.id} value={item.id} className="bg-[#050014]">
                    {item.theme || 'Kabinet'} · {item.name}
                    {item.is_active ? ' (Aktif)' : ''}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </section>

      <section className="py-20 md:py-28 bg-[#f4f0e6] text-[#0a0a1a]">
        <div className="editorial-container">
          {loading ? (
            <LoadingState />
          ) : hasError ? (
            <ErrorState onRetry={retry} />
          ) : !period ? (
            <EmptyState text="Belum ada periode kepengurusan." />
          ) : structures.length === 0 ? (
            <EmptyState text={`Belum ada data pengurus untuk periode ${period.name}.`} />
          ) : (
            <>
              {leaders.length > 0 && (
                <Block title="Pimpinan Himpunan">
                  <div className="grid md:grid-cols-2 gap-5 max-w-4xl">
                    {leaders.map((item) => (
                      <Person key={item.id} structure={item} featured />
                    ))}
                  </div>
                </Block>
              )}

              {core.length > 0 && (
                <Block title="Badan Inti">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {core.map((item) => (
                      <Person key={item.id} structure={item} />
                    ))}
                  </div>
                </Block>
              )}

              {departmentGroups.length > 0 && (
                <Block title="Departemen">
                  <div className="space-y-8">
                    {departmentGroups.map((department) => (
                      <div
                        key={department.id}
                        className="bg-white rounded-2xl p-6 md:p-8"
                      >
                        <div className="text-xs font-bold tracking-[0.18em] uppercase text-[#0200B5]">
                          Departemen
                        </div>
                        <h3 className="text-2xl font-bold mt-1 mb-6">
                          {department.name}
                        </h3>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {department.members.map((item) => (
                            <Person key={item.id} structure={item} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </Block>
              )}
            </>
          )}
        </div>
      </section>

      <section className="py-16 bg-[#050014] text-center">
        <div className="editorial-container">
          <h3 className="text-2xl md:text-4xl font-bold text-white mb-4">
            Ingin tahu lebih lanjut?
          </h3>
          <p className="text-white/50 mb-8">
            Kunjungi media sosial HMDSI.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/about" className="btn-editorial btn-editorial-primary">
              Tentang Kami <ArrowRight className="w-4 h-4 ml-3" />
            </Link>
            <a
              href="https://www.instagram.com/officialhmdsi"
              target="_blank"
              rel="noreferrer"
              className="btn-editorial btn-editorial-outline"
            >
              Instagram
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function Block({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-16">
      <div className="flex items-center gap-3 mb-7">
        <div className="w-8 h-[2px] bg-[#0200B5]" />
        <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#0200B5]">
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

function Person({
  structure,
  featured = false,
}: {
  structure: ManagementStructure;
  featured?: boolean;
}) {
  const member = structure.member;

  if (!member) return null;

  const photo =
    member.photo_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      member.full_name
    )}&size=256&background=f4f0e6&color=0a0a1a`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl overflow-hidden border border-[#0a0a1a]/5"
    >
      <div className="flex gap-4 p-5 md:p-6">
        <img
          src={photo}
          alt={member.full_name}
          loading="lazy"
          className={`${featured ? 'w-24 h-24' : 'w-20 h-20'} rounded-xl object-cover shrink-0 bg-[#f4f0e6]`}
        />
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-[0.12em] text-[#0200B5] font-bold">
            {structure.role?.name || 'Pengurus'}
          </div>
          <h4 className="text-lg font-bold mt-1">{member.full_name}</h4>
          <p className="text-sm text-[#0a0a1a]/50 mt-1">
            {member.study_program || 'D3 Sistem Informasi'} · {member.batch_year}
          </p>
          {member.bio && (
            <p className="text-sm text-[#0a0a1a]/60 mt-3 line-clamp-4">
              {member.bio}
            </p>
          )}
          <div className="flex gap-3 mt-3">
            {member.instagram_handle && (
              <a
                href={`https://instagram.com/${member.instagram_handle.replace(/^@/, '')}`}
                target="_blank"
                rel="noreferrer"
                aria-label={`Instagram ${member.full_name}`}
              >
                <Instagram className="w-4 h-4" />
              </a>
            )}
            {member.linkedin_url && (
              <a
                href={member.linkedin_url}
                target="_blank"
                rel="noreferrer"
                aria-label={`LinkedIn ${member.full_name}`}
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function LoadingState() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 py-12">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="h-36 rounded-2xl bg-white/70 animate-pulse"
        />
      ))}
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return <div className="py-20 text-center text-[#0a0a1a]/50">{text}</div>;
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="py-20 text-center">
      <p className="text-[#0a0a1a]/60">
        Data struktur belum dapat dimuat. Pastikan API HMDSI aktif dan coba lagi.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-6 inline-flex items-center gap-2 btn-editorial btn-editorial-primary"
      >
        <RefreshCw className="w-4 h-4" />
        Coba Lagi
      </button>
    </div>
  );
}
