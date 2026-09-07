<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('work_programs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('period_id')
                  ->constrained('periods')
                  ->cascadeOnDelete();
            $table->foreignId('department_id')
                  ->constrained('departments')
                  ->cascadeOnDelete();
            $table->string('name', 200);
            $table->string('slug', 220)->unique();
            $table->text('description')->nullable();
            $table->text('objectives')->nullable();             // Tujuan & target
            $table->enum('status', [
                'planned',
                'in_progress',
                'completed',
                'postponed',
                'cancelled',
            ])->default('planned')->index();
            $table->date('planned_date')->nullable();           // Rencana mulai
            $table->date('actual_date')->nullable();            // Realisasi mulai
            $table->date('planned_end_date')->nullable();       // Estimasi selesai
            $table->date('actual_end_date')->nullable();        // Realisasi selesai
            $table->decimal('budget_allocation', 12, 2)->nullable();
            $table->decimal('budget_used', 12, 2)->nullable();
            $table->unsignedInteger('participant_count')->default(0);
            $table->string('cover_image_url', 500)->nullable(); // Cloudinary
            $table->boolean('is_highlight')->default(false)->index(); // Tampil di homepage
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['period_id', 'department_id']);
            $table->index(['period_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('work_programs');
    }
};
