<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $renames = [
            'Ketua' => 'Ketua Himpunan',
            'Wakil Ketua' => 'Wakil Ketua Himpunan',
            'Kepala Departemen' => 'Ketua Departemen',
        ];

        foreach ($renames as $old => $new) {
            $oldRole = DB::table('management_roles')->where('name', $old)->first();
            if (!$oldRole) {
                continue;
            }

            $newRole = DB::table('management_roles')->where('name', $new)->first();
            if (!$newRole) {
                DB::table('management_roles')->where('id', $oldRole->id)->update([
                    'name' => $new,
                    'updated_at' => now(),
                ]);
                continue;
            }

            if ((int) $oldRole->id === (int) $newRole->id) {
                continue;
            }

            $oldAssignments = DB::table('management_structures')
                ->where('role_id', $oldRole->id)
                ->get();

            foreach ($oldAssignments as $assignment) {
                $duplicate = DB::table('management_structures')
                    ->where('period_id', $assignment->period_id)
                    ->where('member_id', $assignment->member_id)
                    ->where('department_id', $assignment->department_id)
                    ->where('role_id', $newRole->id)
                    ->first();

                if ($duplicate) {
                    DB::table('management_structures')->where('id', $assignment->id)->delete();
                } else {
                    DB::table('management_structures')->where('id', $assignment->id)->update([
                        'role_id' => $newRole->id,
                        'updated_at' => now(),
                    ]);
                }
            }

            DB::table('management_roles')->where('id', $oldRole->id)->delete();
        }
    }

    public function down(): void
    {
        // Intentionally non-destructive. Historical role assignments should not be rewritten back.
    }
};
