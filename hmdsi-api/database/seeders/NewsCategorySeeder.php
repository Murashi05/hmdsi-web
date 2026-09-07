<?php

namespace Database\Seeders;

use App\Models\NewsCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class NewsCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name'        => 'Akademik',
                'slug'        => 'academic',
                'color'       => '#3B82F6',
                'description' => 'Berita terkait kegiatan akademik, perkuliahan, dan prestasi akademik.',
            ],
            [
                'name'        => 'Prestasi',
                'slug'        => 'achievement',
                'color'       => '#F59E0B',
                'description' => 'Pencapaian mahasiswa dan himpunan di berbagai kompetisi/lomba.',
            ],
            [
                'name'        => 'Pengumuman',
                'slug'        => 'announcement',
                'color'       => '#EF4444',
                'description' => 'Pengumuman resmi penting untuk seluruh mahasiswa.',
            ],
            [
                'name'        => 'Event',
                'slug'        => 'event',
                'color'       => '#10B981',
                'description' => 'Liputan dan dokumentasi event/kegiatan himpunan.',
            ],
            [
                'name'        => 'Opini',
                'slug'        => 'opinion',
                'color'       => '#8B5CF6',
                'description' => 'Artikel opini dan tulisan-tulisan kritis anggota.',
            ],
        ];

        foreach ($categories as $category) {
            $category['slug'] = $category['slug'] ?? Str::slug($category['name']);
            NewsCategory::firstOrCreate(['slug' => $category['slug']], $category);
        }
    }
}
