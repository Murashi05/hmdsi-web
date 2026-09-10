<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::transaction(function () {
            $period = DB::table('periods')
                ->whereDate('start_date', '2026-09-01')
                ->first();

            if (!$period) {
                $periodId = DB::table('periods')->insertGetId([
                    'name' => '2026',
                    'start_date' => '2026-09-01',
                    'end_date' => '2027-08-31',
                    'is_active' => true,
                    'theme' => 'Kabinet Narakarsa',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
                $period = DB::table('periods')->where('id', $periodId)->first();
            } else {
                DB::table('periods')->where('id', $period->id)->update([
                    'name' => '2026',
                    'end_date' => '2027-08-31',
                    'theme' => 'Kabinet Narakarsa',
                    'is_active' => true,
                    'updated_at' => now(),
                ]);
            }

            DB::table('periods')
                ->where('id', '!=', $period->id)
                ->update(['is_active' => false, 'updated_at' => now()]);

            $hasDepartments = DB::table('departments')
                ->where('period_id', $period->id)
                ->whereNull('deleted_at')
                ->exists();

            if (!$hasDepartments) {
                $sourcePeriodId = DB::table('departments')
                    ->whereNull('deleted_at')
                    ->where('period_id', '!=', $period->id)
                    ->orderByDesc('period_id')
                    ->value('period_id');

                if ($sourcePeriodId) {
                    $departments = DB::table('departments')
                        ->where('period_id', $sourcePeriodId)
                        ->whereNull('deleted_at')
                        ->get();

                    foreach ($departments as $department) {
                        DB::table('departments')->insert([
                            'period_id' => $period->id,
                            'name' => $department->name,
                            'name_en' => $department->name_en,
                            'slug' => $department->slug,
                            'type' => $department->type,
                            'description' => $department->description,
                            'icon' => $department->icon,
                            'sort_order' => $department->sort_order,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }
                }
            }
        });
    }

    public function down(): void
    {
        // Intentionally non-destructive: the 2026 period is live organizational data.
    }
};
