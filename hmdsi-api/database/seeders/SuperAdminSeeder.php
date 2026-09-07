<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'superadmin@hmdsi.or.id'],
            [
                'name' => 'Super Administrator',
                'email' => 'superadmin@hmdsi.or.id',
                'password' => Hash::make('HMDSI@2026Super'),
                'role' => 'super_admin',
            ]
        );

        $this->command->info('Super Admin created/updated:');
        $this->command->info('  Email:    superadmin@hmdsi.or.id');
        $this->command->info('  Password: HMDSI@2026Super');
        $this->command->warn('  ⚠️  Ganti password ini segera setelah deployment!');
    }
}
