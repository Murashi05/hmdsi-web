<?php

namespace Database\Seeders;

use App\Models\ManagementRole;
use Illuminate\Database\Seeder;

class ManagementRoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            // Level 1: Ketua Umum
            ['name' => 'Ketua',           'name_en' => 'Chairman',              'level' => 1],
            ['name' => 'Wakil Ketua',      'name_en' => 'Vice Chairman',         'level' => 2],
            // Level 3: Inti
            ['name' => 'Sekretaris Umum', 'name_en' => 'Secretary General',     'level' => 3],
            ['name' => 'Wakil Sekretaris','name_en' => 'Vice Secretary',         'level' => 4],
            ['name' => 'Bendahara Umum',  'name_en' => 'Treasurer General',     'level' => 3],
            ['name' => 'Wakil Bendahara', 'name_en' => 'Vice Treasurer',        'level' => 4],
            // Level 5: Kepala Departemen
            ['name' => 'Kepala Departemen','name_en' => 'Department Head',      'level' => 5],
            ['name' => 'Wakil Kepala',    'name_en' => 'Deputy Department Head','level' => 6],
            // Level 7: Staf
            ['name' => 'Staf Ahli',       'name_en' => 'Expert Staff',          'level' => 7],
            ['name' => 'Anggota',         'name_en' => 'Member',                'level' => 8],
        ];

        foreach ($roles as $role) {
            ManagementRole::firstOrCreate(['name' => $role['name']], $role);
        }
    }
}
