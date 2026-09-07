<?php

namespace Database\Seeders;

use App\Models\SiteStat;
use Illuminate\Database\Seeder;

class SiteStatSeeder extends Seeder
{
    public function run(): void
    {
        $stats = [
            ['key' => 'total_members',       'label' => 'Total Anggota',         'value' => '120+',  'icon' => 'Users',         'sort_order' => 1],
            ['key' => 'total_programs',      'label' => 'Program Kerja',         'value' => '24',    'icon' => 'ClipboardList', 'sort_order' => 2],
            ['key' => 'total_departments',   'label' => 'Departemen Aktif',      'value' => '10',    'icon' => 'LayoutGrid',    'sort_order' => 3],
            ['key' => 'years_established',   'label' => 'Tahun Berdiri',         'value' => '2010',  'icon' => 'Calendar',      'sort_order' => 4],
            ['key' => 'total_events',        'label' => 'Kegiatan Terlaksana',   'value' => '48+',   'icon' => 'CalendarCheck', 'sort_order' => 5],
        ];

        foreach ($stats as $stat) {
            SiteStat::updateOrCreate(['key' => $stat['key']], $stat);
        }
    }
}
