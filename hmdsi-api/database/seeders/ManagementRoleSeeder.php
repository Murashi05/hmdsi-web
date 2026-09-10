<?php

namespace Database\Seeders;

use App\Models\ManagementRole;
use Illuminate\Database\Seeder;

class ManagementRoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            ['name' => 'Ketua Himpunan',        'name_en' => 'Association Chairman',    'level' => 1],
            ['name' => 'Wakil Ketua Himpunan',  'name_en' => 'Vice Chairman',           'level' => 2],
            ['name' => 'Sekretaris Umum',       'name_en' => 'Secretary General',       'level' => 3],
            ['name' => 'Staff Sekretaris',      'name_en' => 'Secretary Staff',         'level' => 4],
            ['name' => 'Bendahara Umum',        'name_en' => 'Treasurer General',       'level' => 3],
            ['name' => 'Staff Bendahara',       'name_en' => 'Treasurer Staff',         'level' => 4],
            ['name' => 'Ketua Departemen',      'name_en' => 'Department Head',          'level' => 5],
            ['name' => 'Wakil Ketua Departemen','name_en' => 'Deputy Department Head',  'level' => 6],
            ['name' => 'Staff',                 'name_en' => 'Staff',                   'level' => 7],
            ['name' => 'Anggota',               'name_en' => 'Member',                  'level' => 8],
        ];

        foreach ($roles as $role) {
            ManagementRole::firstOrCreate(['name' => $role['name']], $role);
        }
    }
}
