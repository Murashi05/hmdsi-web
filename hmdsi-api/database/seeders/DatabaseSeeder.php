<?php

namespace Database\Seeders;

use App\Models\AboutContent;
use App\Models\Aspiration;
use App\Models\Department;
use App\Models\GalleryEvent;
use App\Models\GalleryItem;
use App\Models\ManagementRole;
use App\Models\ManagementStructure;
use App\Models\Member;
use App\Models\NewsArticle;
use App\Models\Period;
use App\Models\SiteStat;
use App\Models\User;
use App\Models\WorkProgram;
use App\Models\WorkProgramTag;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            ManagementRoleSeeder::class,
            UserSeeder::class,
            PeriodSeeder::class,
            SiteStatSeeder::class,
            NewsCategorySeeder::class,
        ]);
    }
}
