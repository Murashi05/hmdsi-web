<?php

namespace Database\Seeders;

use App\Models\AboutContent;
use App\Models\Department;
use App\Models\ManagementRole;
use App\Models\ManagementStructure;
use App\Models\Member;
use App\Models\Period;
use App\Models\WorkProgram;
use App\Models\WorkProgramTag;
use Illuminate\Database\Seeder;

class PeriodSeeder extends Seeder
{
    public function run(): void
    {
        // ── 1. Create the active period ──────────────────────────────────────
        $period = Period::firstOrCreate(
            ['name' => '2026'],
            [
                'start_date' => '2026-09-01',
                'end_date'   => '2027-08-31',
                'is_active'  => true,
                'theme'      => 'Kabinet Narakarsa',
            ]
        );

        $period->setAsActive();

        // ── 2. Seed departments (mirroring existing structure.ts data) ────────
        $departments = $this->seedDepartments($period->id);

        // ── 3. Seed About Content ─────────────────────────────────────────────
        $this->seedAboutContent($period->id);

        // ── 4. Seed sample Work Programs ─────────────────────────────────────
        $this->seedWorkPrograms($period->id, $departments);

        // Pengurus Kabinet Narakarsa diimpor oleh NarakarsaManagementSeeder.
        // Data contoh lama sengaja tidak dibuat agar production tidak tercampur data dummy.
    }

    // ─────────────────────────────────────────────────────────────────────────

    private function seedDepartments(int $periodId): array
    {
        $departmentData = [
            ['name' => 'Ketua',                    'name_en' => 'Chairman',                'slug' => 'chairman',                   'type' => 'leader',     'icon' => 'Crown',            'sort_order' => 1],
            ['name' => 'Wakil Ketua',               'name_en' => 'Vice Chairman',           'slug' => 'vice-chairman',              'type' => 'leader',     'icon' => 'Star',             'sort_order' => 2],
            ['name' => 'Sekretaris',                'name_en' => 'Secretary',               'slug' => 'secretary',                  'type' => 'core',       'icon' => 'FileText',         'sort_order' => 3],
            ['name' => 'Bendahara',                 'name_en' => 'Treasurer',               'slug' => 'treasurer',                  'type' => 'core',       'icon' => 'Wallet',           'sort_order' => 4],
            ['name' => 'Kaderisasi',                'name_en' => 'Cadre Development',       'slug' => 'cadre-development',          'type' => 'department', 'icon' => 'Users',            'sort_order' => 5],
            ['name' => 'Dalam Negeri',              'name_en' => 'Internal Affairs',        'slug' => 'internal-affairs',           'type' => 'department', 'icon' => 'Home',             'sort_order' => 6],
            ['name' => 'Luar Negeri',               'name_en' => 'External Affairs',        'slug' => 'external-affairs',           'type' => 'department', 'icon' => 'Globe',            'sort_order' => 7],
            ['name' => 'Sosial Masyarakat',         'name_en' => 'Social & Community',      'slug' => 'social-community',           'type' => 'department', 'icon' => 'Heart',            'sort_order' => 8],
            ['name' => 'Olahraga, Seni & Budaya',   'name_en' => 'Sports, Arts & Culture',  'slug' => 'sports-arts-culture',        'type' => 'department', 'icon' => 'Trophy',           'sort_order' => 9],
            ['name' => 'Komunikasi & Informasi',    'name_en' => 'Communication & Info',    'slug' => 'communication-information',  'type' => 'department', 'icon' => 'Megaphone',        'sort_order' => 10],
            ['name' => 'Ekonomi Kreatif',           'name_en' => 'Creative Economy',        'slug' => 'creative-economy',           'type' => 'department', 'icon' => 'Lightbulb',        'sort_order' => 11],
            ['name' => 'Akademik & Riset',          'name_en' => 'Academic & Research',     'slug' => 'academic-research',          'type' => 'department', 'icon' => 'BookOpen',         'sort_order' => 12],
        ];

        $result = [];
        foreach ($departmentData as $data) {
            $dept = Department::firstOrCreate(
                ['slug' => $data['slug'], 'period_id' => $periodId],
                array_merge($data, ['period_id' => $periodId, 'description' => ''])
            );
            $result[$data['slug']] = $dept;
        }

        return $result;
    }

    // ─────────────────────────────────────────────────────────────────────────

    private function seedAboutContent(int $periodId): void
    {
        AboutContent::firstOrCreate(
            ['period_id' => $periodId],
            [
                'vision'    => 'Menjadi himpunan mahasiswa yang unggul, inovatif, dan berdedikasi dalam mewujudkan ekosistem akademik dan organisasi yang inklusif.',
                'mission'   => [
                    'Meningkatkan kualitas akademik dan profesionalisme anggota melalui program pengembangan diri.',
                    'Membangun komunikasi yang efektif dan harmonis antar anggota, alumni, dan stakeholder.',
                    'Mengembangkan kreativitas dan inovasi dalam setiap program kerja.',
                    'Menjalin kerjasama yang sinergis dengan organisasi internal maupun eksternal kampus.',
                    'Menjaga dan melestarikan nilai-nilai kebersamaan, integritas, dan profesionalisme organisasi.',
                ],
                'values'    => [
                    ['title' => 'Integritas',      'description' => 'Menjunjung tinggi kejujuran dan transparansi dalam setiap tindakan.'],
                    ['title' => 'Kolaborasi',      'description' => 'Bekerja bersama dengan semangat gotong royong untuk mencapai tujuan bersama.'],
                    ['title' => 'Inovasi',         'description' => 'Mendorong kreativitas dan pemikiran kritis dalam menghadapi tantangan.'],
                    ['title' => 'Inklusivitas',    'description' => 'Menyambut keberagaman dan memastikan setiap anggota merasa dihargai.'],
                    ['title' => 'Profesionalisme', 'description' => 'Mengedepankan standar kerja yang tinggi dalam setiap program dan kegiatan.'],
                ],
                'is_active' => true,
            ]
        );
    }

    // ─────────────────────────────────────────────────────────────────────────

    private function seedWorkPrograms(int $periodId, array $departments): void
    {
        $programs = [
            [
                'slug'        => 'ospek-jurusan-2025',
                'dept_slug'   => 'cadre-development',
                'name'        => 'Orientasi Studi dan Pengenalan Jurusan 2025',
                'description' => 'Program penyambutan mahasiswa baru dan pengenalan lingkungan jurusan.',
                'status'      => WorkProgram::STATUS_COMPLETED,
                'planned_date'=> '2025-09-10',
                'actual_date' => '2025-09-15',
                'is_highlight'=> true,
                'tags'        => ['orientasi', 'maba', 'kaderisasi'],
            ],
            [
                'slug'        => 'seminar-karir-nasional',
                'dept_slug'   => 'academic-research',
                'name'        => 'Seminar Karir & Industri Nasional',
                'description' => 'Seminar nasional dengan pembicara dari industri teknologi terkemuka.',
                'status'      => WorkProgram::STATUS_PLANNED,
                'planned_date'=> '2026-02-15',
                'is_highlight'=> true,
                'tags'        => ['seminar', 'karir', 'nasional'],
            ],
            [
                'slug'        => 'hmdsi-cup-2025',
                'dept_slug'   => 'sports-arts-culture',
                'name'        => 'HMDSI Cup 2025 — Turnamen Olahraga Internal',
                'description' => 'Turnamen olahraga tahunan antar angkatan untuk mempererat kebersamaan.',
                'status'      => WorkProgram::STATUS_IN_PROGRESS,
                'planned_date'=> '2025-11-01',
                'is_highlight'=> true,
                'tags'        => ['olahraga', 'turnamen', 'internal'],
            ],
            [
                'slug'        => 'bakti-sosial-2025',
                'dept_slug'   => 'social-community',
                'name'        => 'Bakti Sosial Masyarakat 2025',
                'description' => 'Kegiatan pengabdian masyarakat ke desa binaan.',
                'status'      => WorkProgram::STATUS_COMPLETED,
                'planned_date'=> '2025-10-20',
                'tags'        => ['sosial', 'pengabdian', 'masyarakat'],
            ],
            [
                'slug'        => 'pelatihan-desain-grafis',
                'dept_slug'   => 'creative-economy',
                'name'        => 'Workshop Desain Grafis & Personal Branding',
                'description' => 'Pelatihan intensif desain grafis menggunakan tools industri terkini.',
                'status'      => WorkProgram::STATUS_PLANNED,
                'planned_date'=> '2026-03-10',
                'tags'        => ['desain', 'workshop', 'kreativitas'],
            ],
        ];

        foreach ($programs as $data) {
            $dept = $departments[$data['dept_slug']] ?? null;
            if (! $dept) continue;

            $program = WorkProgram::firstOrCreate(
                ['slug' => $data['slug']],
                [
                    'period_id'     => $periodId,
                    'department_id' => $dept->id,
                    'name'          => $data['name'],
                    'description'   => $data['description'],
                    'status'        => $data['status'],
                    'planned_date'  => $data['planned_date'],
                    'actual_date'   => $data['actual_date'] ?? null,
                    'is_highlight'  => $data['is_highlight'] ?? false,
                ]
            );

            foreach ($data['tags'] as $tag) {
                WorkProgramTag::firstOrCreate([
                    'work_program_id' => $program->id,
                    'tag'             => $tag,
                ]);
            }
        }
    }

}
