<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Super admin — change password immediately after first deploy!
        User::firstOrCreate(
            ['email' => 'superadmin@hmdsi.ac.id'],
            [
                'name'     => 'Super Admin HMDSI',
                'password' => Hash::make('hmdsi@superadmin2025'),
                'role'     => User::ROLE_SUPER_ADMIN,
            ]
        );

        // Default admin account for cabinet management
        User::firstOrCreate(
            ['email' => 'admin@hmdsi.ac.id'],
            [
                'name'     => 'Admin HMDSI',
                'password' => Hash::make('hmdsi@admin2025'),
                'role'     => User::ROLE_ADMIN,
            ]
        );

        // Editor — for news/content publishing only
        User::firstOrCreate(
            ['email' => 'editor@hmdsi.ac.id'],
            [
                'name'     => 'Editor HMDSI',
                'password' => Hash::make('hmdsi@editor2025'),
                'role'     => User::ROLE_EDITOR,
            ]
        );
    }
}
