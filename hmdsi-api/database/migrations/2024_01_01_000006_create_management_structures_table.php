<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('management_structures', function (Blueprint $table) {
            $table->id();
            $table->foreignId('period_id')
                  ->constrained('periods')
                  ->cascadeOnDelete();
            $table->foreignId('member_id')
                  ->constrained('members')
                  ->cascadeOnDelete();
            $table->foreignId('department_id')
                  ->constrained('departments')
                  ->cascadeOnDelete();
            $table->foreignId('role_id')
                  ->constrained('management_roles')
                  ->restrictOnDelete();
            $table->boolean('is_active')->default(true);
            $table->date('joined_at')->nullable();
            $table->date('ended_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            // One member can only hold one specific role in one department per period
            $table->unique(
                ['period_id', 'member_id', 'department_id', 'role_id'],
                'unique_management_assignment'
            );

            $table->index(['period_id', 'department_id']);
            $table->index(['period_id', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('management_structures');
    }
};
