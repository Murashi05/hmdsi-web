<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\ManagementRole;
use App\Models\ManagementStructure;
use App\Models\Member;
use App\Models\Period;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Imports the Kabinet Narakarsa 2026/2027 management roster.
 * Source: DATA PENGURUS HIMPUNAN KABINET NARAKARSA.xlsx
 */
class NarakarsaManagementSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function () {
            $period = Period::firstOrCreate(
                ['name' => '2026'],
                [
                    'start_date' => '2026-09-01',
                    'end_date' => '2027-08-31',
                    'is_active' => true,
                    'theme' => 'Kabinet Narakarsa',
                ]
            );
            $period->update([
                'start_date' => '2026-09-01',
                'end_date' => '2027-08-31',
                'is_active' => true,
                'theme' => 'Kabinet Narakarsa',
            ]);
            $period->setAsActive();

            $departments = [
                'MASTAKA' => 'chairman',
                'SEKRETARIS' => 'secretary',
                'BENDAHARA' => 'treasurer',
                'KADERISASI' => 'cadre-development',
                'DALAM NEGERI' => 'internal-affairs',
                'LUAR NEGERI' => 'external-affairs',
                'SOSIAL MASYARAKAT' => 'social-community',
                'OLAHRAGA, SENI DAN BUDAYA' => 'sports-arts-culture',
                'KOMUNIKASI DAN INFORMASI' => 'communication-information',
                'EKONOMI KREATIF' => 'creative-economy',
                'AKADEMIK DAN RISET' => 'academic-research',
            ];

            $roles = [
                'Ketua Himpunan', 'Wakil Ketua Himpunan', 'Sekretaris Umum',
                'Staff Sekretaris', 'Bendahara Umum', 'Staff Bendahara',
                'Ketua Departemen', 'Wakil Ketua Departemen', 'Staff', 'Anggota',
            ];
            foreach ($roles as $roleName) {
                ManagementRole::firstOrCreate(
                    ['name' => $roleName],
                    $this->roleDefaults($roleName)
                );
            }

            // The Excel roster is the source of truth for the active period.
            ManagementStructure::where('period_id', $period->id)->delete();

            $positionByDepartment = [];
            foreach ($this->roster() as $person) {
                [$name, $studentId, $class, $departmentName] = $person;
                $departmentSlug = $departments[$departmentName] ?? null;
                if (!$departmentSlug) {
                    throw new \RuntimeException("Departemen Excel tidak dikenali: {$departmentName}");
                }

                $department = Department::where('period_id', $period->id)
                    ->where('slug', $departmentSlug)
                    ->first();
                if (!$department) {
                    throw new \RuntimeException("Departemen belum tersedia: {$departmentSlug}");
                }

                $position = $positionByDepartment[$departmentName] ?? 0;
                $positionByDepartment[$departmentName] = $position + 1;
                $roleName = $this->roleFor($departmentName, $position);
                $role = ManagementRole::where('name', $roleName)->firstOrFail();

                $batchYear = str_starts_with($studentId, '6070124') ? 2024 : 2025;

                $member = Member::withTrashed()->updateOrCreate(
                    ['student_id' => $studentId],
                    [
                        'full_name' => $name,
                        'study_program' => 'D3 Sistem Informasi',
                        'batch_year' => $batchYear,
                        'deleted_at' => null,
                    ]
                );
                $member->restore();

                ManagementStructure::create([
                    'period_id' => $period->id,
                    'member_id' => $member->id,
                    'department_id' => $department->id,
                    'role_id' => $role->id,
                    'is_active' => true,
                    'joined_at' => '2026-09-01',
                ]);
            }
        });
    }

    private function roleFor(string $department, int $position): string
    {
        return match ($department) {
            'MASTAKA' => ['Ketua Himpunan', 'Wakil Ketua Himpunan'][$position] ?? 'Anggota',
            'SEKRETARIS' => ['Sekretaris Umum', 'Staff Sekretaris'][$position] ?? 'Staff',
            'BENDAHARA' => ['Bendahara Umum', 'Staff Bendahara', 'Staff'][$position] ?? 'Staff',
            default => $position === 0
                ? 'Ketua Departemen'
                : ($position === 1 ? 'Wakil Ketua Departemen' : 'Staff'),
        };
    }

    private function roleDefaults(string $name): array
    {
        return match ($name) {
            'Ketua Himpunan' => ['name_en' => 'Association Chairman', 'level' => 1],
            'Wakil Ketua Himpunan' => ['name_en' => 'Vice Chairman', 'level' => 2],
            'Sekretaris Umum' => ['name_en' => 'Secretary General', 'level' => 3],
            'Staff Sekretaris' => ['name_en' => 'Secretary Staff', 'level' => 4],
            'Bendahara Umum' => ['name_en' => 'Treasurer General', 'level' => 3],
            'Staff Bendahara' => ['name_en' => 'Treasurer Staff', 'level' => 4],
            'Ketua Departemen' => ['name_en' => 'Department Head', 'level' => 5],
            'Wakil Ketua Departemen' => ['name_en' => 'Deputy Department Head', 'level' => 6],
            'Staff' => ['name_en' => 'Staff', 'level' => 7],
            default => ['name_en' => 'Member', 'level' => 8],
        };
    }

    private function roster(): array
    {
        return [
            [
                        "MUHAMMAD RAFI SHIDQI",
                        "607012400014",
                        "48-04",
                        "MASTAKA"
            ],
            [
                        "MOCHAMAD YOGA NOFAN N",
                        "607012400024",
                        "48-04",
                        "MASTAKA"
            ],
            [
                        "DZAIFA ZAHRA HUMAIROOH",
                        "607012500073",
                        "49-02",
                        "SEKRETARIS"
            ],
            [
                        "AL NAZIRA SUDIRMAN",
                        "607012500093",
                        "49-04",
                        "SEKRETARIS"
            ],
            [
                        "GRACE OLIVIA MANURUNG",
                        "607012400040",
                        "48-02",
                        "BENDAHARA"
            ],
            [
                        "DEANDRA RAMADHANI",
                        "607012500060",
                        "49-04",
                        "BENDAHARA"
            ],
            [
                        "AZZAHRA AULIA RAHMAH",
                        "607012500084",
                        "49-04",
                        "BENDAHARA"
            ],
            [
                        "MARDINI DWI PUTRI",
                        "607012430015",
                        "48-02",
                        "KADERISASI"
            ],
            [
                        "MAULANA ZAKARIA",
                        "607012400097",
                        "48-03",
                        "KADERISASI"
            ],
            [
                        "RANGGA",
                        "607012500004",
                        "49-04",
                        "KADERISASI"
            ],
            [
                        "TIARA MAILANI RUSWANDI",
                        "607012530004",
                        "49-01",
                        "KADERISASI"
            ],
            [
                        "PUJA RAHMA TIKA",
                        "607012500065",
                        "49-03",
                        "KADERISASI"
            ],
            [
                        "NURJIHAAN HASNA H",
                        "607012500071",
                        "49-04",
                        "KADERISASI"
            ],
            [
                        "DAVA ARYADHINATA",
                        "607012500035",
                        "49-04",
                        "KADERISASI"
            ],
            [
                        "MUHAMMAD ZAKHWAN ABBYASA",
                        "607012400062",
                        "48-03",
                        "DALAM NEGERI"
            ],
            [
                        "ZAIDAN GUSTIAWAN RABBANI",
                        "607012400046",
                        "48-04",
                        "DALAM NEGERI"
            ],
            [
                        "NAYLA OLIVIA KAWAHARA",
                        "607012500029",
                        "49-02",
                        "DALAM NEGERI"
            ],
            [
                        "LISKA ANINDYA PRATISTA",
                        "607012500107",
                        "49-03",
                        "DALAM NEGERI"
            ],
            [
                        "RAJIEL JIBRAN ZIYA ZIDNA FANN",
                        "607012500099",
                        "49-04",
                        "DALAM NEGERI"
            ],
            [
                        "DELIA SAHLA NURFADILAH",
                        "607012500096",
                        "49-04",
                        "DALAM NEGERI"
            ],
            [
                        "MUHAMMAD DIO PUTRA SUN",
                        "607012500112",
                        "49-03",
                        "DALAM NEGERI"
            ],
            [
                        "MOCHAMAD HAFIZH HAKWAN",
                        "607012500109",
                        "49-04",
                        "DALAM NEGERI"
            ],
            [
                        "LAILATUL BADRIAH",
                        "607012400033",
                        "48-01",
                        "LUAR NEGERI"
            ],
            [
                        "AGHNA KHAIRA ADHYASTA",
                        "607012400028",
                        "48-05",
                        "LUAR NEGERI"
            ],
            [
                        "KHAIRUNNISA HIDAYATI",
                        "607012500022",
                        "49-01",
                        "LUAR NEGERI"
            ],
            [
                        "MAHENDRA DINATA",
                        "607012500041",
                        "49-03",
                        "LUAR NEGERI"
            ],
            [
                        "BAGJA AHMAD DZULFFADHLI",
                        "607012500016",
                        "49-03",
                        "LUAR NEGERI"
            ],
            [
                        "ALIF ALFATAN",
                        "607012500031",
                        "49-03",
                        "LUAR NEGERI"
            ],
            [
                        "HARITS",
                        "607012500069",
                        "49-02",
                        "LUAR NEGERI"
            ],
            [
                        "YAZIED ISLAMI ZIDANE",
                        "607012400095",
                        "48-04",
                        "OLAHRAGA, SENI DAN BUDAYA"
            ],
            [
                        "MUHAMMAD NAILUL AZHQIYA RAHMAN",
                        "607012400022",
                        "48-01",
                        "OLAHRAGA, SENI DAN BUDAYA"
            ],
            [
                        "VITO MAYSHAND",
                        "607012500094",
                        "49-04",
                        "OLAHRAGA, SENI DAN BUDAYA"
            ],
            [
                        "APRIANO TRISVAN YULISTIRA",
                        "607012500077",
                        "49-04",
                        "OLAHRAGA, SENI DAN BUDAYA"
            ],
            [
                        "MUHAMMAD FADHIL ABDILLAH",
                        "607012500087",
                        "49-04",
                        "OLAHRAGA, SENI DAN BUDAYA"
            ],
            [
                        "MUHAMMAD NAUFAL ALFARISY",
                        "607012500032",
                        "49-03",
                        "OLAHRAGA, SENI DAN BUDAYA"
            ],
            [
                        "MARCELLO PIRDAUS SITANGGANG",
                        "607012500091",
                        "49-03",
                        "OLAHRAGA, SENI DAN BUDAYA"
            ],
            [
                        "ANINDA IRFANI",
                        "607012430019",
                        "48-01",
                        "SOSIAL MASYARAKAT"
            ],
            [
                        "ABDUL FIKRI HUSAINI",
                        "607012400104",
                        "48-03",
                        "SOSIAL MASYARAKAT"
            ],
            [
                        "REVAN SYAIKAL LABIB",
                        "607012400009",
                        "48-03",
                        "SOSIAL MASYARAKAT"
            ],
            [
                        "ARKAN GHAISAN HAMAMMI",
                        "607012500070",
                        "49-03",
                        "SOSIAL MASYARAKAT"
            ],
            [
                        "MUHAMMAD FATIH AHNAF",
                        "607012500030",
                        "49-02",
                        "SOSIAL MASYARAKAT"
            ],
            [
                        "NEVI SURYANI",
                        "607012500008",
                        "49-04",
                        "SOSIAL MASYARAKAT"
            ],
            [
                        "DINDA REVALINA RAHMAN",
                        "607012500002",
                        "49-04",
                        "SOSIAL MASYARAKAT"
            ],
            [
                        "MUHAMMAD DAFFA ZAINUL",
                        "607012400026",
                        "48-03",
                        "EKONOMI KREATIF"
            ],
            [
                        "MALVIN JORDY",
                        "607012400138",
                        "48-05",
                        "EKONOMI KREATIF"
            ],
            [
                        "NISRINA HANIFAH",
                        "607012500083",
                        "49-01",
                        "EKONOMI KREATIF"
            ],
            [
                        "BAGGAS SCHEFTIADI SAMPURNA",
                        "607012500062",
                        "49-03",
                        "EKONOMI KREATIF"
            ],
            [
                        "SITI ZAHRA AULIA",
                        "607012500009",
                        "49-03",
                        "EKONOMI KREATIF"
            ],
            [
                        "ANGEL JUNIFA",
                        "607012500014",
                        "49-04",
                        "EKONOMI KREATIF"
            ],
            [
                        "ANDI BAYU HANGGORO",
                        "607012400019",
                        "48-01",
                        "AKADEMIK DAN RISET"
            ],
            [
                        "MUHAMMAD TAQI IZDIHAR",
                        "607012430006",
                        "48-01",
                        "AKADEMIK DAN RISET"
            ],
            [
                        "PURBO JATMIKO",
                        "607012500013",
                        "49-02",
                        "AKADEMIK DAN RISET"
            ],
            [
                        "ISTIGHFAROH HAYATI",
                        "607012500017",
                        "49-02",
                        "AKADEMIK DAN RISET"
            ],
            [
                        "ALMIRA KALILA HATIBIE",
                        "607012500059",
                        "49-04",
                        "AKADEMIK DAN RISET"
            ],
            [
                        "BUNGA DESVITA SANDI",
                        "607012500080",
                        "49-01",
                        "AKADEMIK DAN RISET"
            ],
            [
                        "DENISSA RAHMA PUTRI",
                        "607012500052",
                        "49-04",
                        "AKADEMIK DAN RISET"
            ],
            [
                        "ARSYAD DEFIRA MAULANA",
                        "607012400094",
                        "48-03",
                        "KOMUNIKASI DAN INFORMASI"
            ],
            [
                        "M. FAZHEL OLWHENDRA",
                        "607012400080",
                        "48-05",
                        "KOMUNIKASI DAN INFORMASI"
            ],
            [
                        "MUHAMAD RAKA FAUZAN ADHIMA",
                        "607012500057",
                        "49-03",
                        "KOMUNIKASI DAN INFORMASI"
            ],
            [
                        "NATANEILA SALVIA SUDIRMAN",
                        "6070125607012",
                        "49-01",
                        "KOMUNIKASI DAN INFORMASI"
            ],
            [
                        "RIKO YUSUF SEPTIANO",
                        "607012500072",
                        "49-02",
                        "KOMUNIKASI DAN INFORMASI"
            ],
            [
                        "NABILA RAUDHATUL HANAN",
                        "607012500003",
                        "49-02",
                        "KOMUNIKASI DAN INFORMASI"
            ],
            [
                        "HASBI JUWADI",
                        "607012500090",
                        "49-01",
                        "KOMUNIKASI DAN INFORMASI"
            ]
];
    }
}
