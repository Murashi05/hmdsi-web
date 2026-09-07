<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('work_program_tags', function (Blueprint $table) {
            $table->id();
            $table->foreignId('work_program_id')
                  ->constrained('work_programs')
                  ->cascadeOnDelete();
            $table->string('tag', 50);

            $table->index('tag');
            $table->unique(['work_program_id', 'tag']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('work_program_tags');
    }
};
