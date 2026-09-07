export interface DepartmentRole {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  type: 'leader' | 'core' | 'department';
}

export const organizationStructure: DepartmentRole[] = [
  {
    id: 'ketua',
    title: 'Ketua',
    titleEn: 'Chairman',
    description: 'Memimpin dan mengkoordinasikan seluruh kegiatan organisasi HMDSI.',
    type: 'leader',
  },
  {
    id: 'wakil-ketua',
    title: 'Wakil Ketua',
    titleEn: 'Vice Chairman',
    description: 'Mendampingi ketua dan membantu mengkoordinasikan kegiatan organisasi.',
    type: 'leader',
  },
  {
    id: 'sekretaris',
    title: 'Sekretaris',
    titleEn: 'Secretary',
    description: 'Mengelola administrasi, dokumen, dan korespondensi organisasi.',
    type: 'core',
  },
  {
    id: 'bendahara',
    title: 'Bendahara',
    titleEn: 'Treasurer',
    description: 'Mengelola keuangan dan anggaran organisasi.',
    type: 'core',
  },
  {
    id: 'kaderisasi',
    title: 'Kaderisasi',
    titleEn: 'Cadre Development',
    description: 'Membina dan mengembangkan kader-kader baru organisasi.',
    type: 'department',
  },
  {
    id: 'dalam-negeri',
    title: 'Dalam Negeri',
    titleEn: 'Internal Affairs',
    description: 'Mengelola hubungan internal antar anggota dan kegiatan dalam kampus.',
    type: 'department',
  },
  {
    id: 'luar-negeri',
    title: 'Luar Negeri',
    titleEn: 'External Affairs',
    description: 'Menjalin relasi dan kerjasama dengan organisasi dan pihak eksternal.',
    type: 'department',
  },
  {
    id: 'sosial-masyarakat',
    title: 'Sosial Masyarakat',
    titleEn: 'Social & Community',
    description: 'Mengadakan kegiatan pengabdian masyarakat dan program sosial.',
    type: 'department',
  },
  {
    id: 'olahraga-seni-budaya',
    title: 'Olahraga, Seni & Budaya',
    titleEn: 'Sports, Arts & Culture',
    description: 'Mengembangkan minat dan bakat anggota di bidang olahraga, seni, dan budaya.',
    type: 'department',
  },
  {
    id: 'komunikasi-informasi',
    title: 'Komunikasi & Informasi',
    titleEn: 'Communication & Information',
    description: 'Mengelola media sosial, publikasi, dan penyebaran informasi organisasi.',
    type: 'department',
  },
  {
    id: 'ekonomi-kreatif',
    title: 'Ekonomi Kreatif',
    titleEn: 'Creative Economy',
    description: 'Mengembangkan potensi ekonomi kreatif dan kewirausahaan anggota.',
    type: 'department',
  },
  {
    id: 'akademik-riset',
    title: 'Akademik & Riset',
    titleEn: 'Academic & Research',
    description: 'Mendukung pengembangan akademik dan kegiatan riset anggota.',
    type: 'department',
  },
];
