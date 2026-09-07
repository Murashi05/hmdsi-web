<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('departments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('period_id')->constrained('periods')->cascadeOnDelete();
            $table->string('name', 100);                    // Nama bahasa Indonesia
            $table->string('name_en', 100);                 // English name
            $table->string('slug', 120)->unique();           // URL-friendly: "academic-research"
            $table->enum('type', ['leader', 'core', 'department'])->index();
            $table->text('description')->nullable();
            $table->string('icon', 50)->nullable();          // Lucide icon name
            $table->unsignedTinyInteger('sort_order')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['period_id', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('departments');
    }
};
