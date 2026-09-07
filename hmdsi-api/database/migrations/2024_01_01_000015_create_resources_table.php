<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('resources', function (Blueprint $table) {
            $table->id();
            $table->string('title', 200);
            $table->text('description')->nullable();
            $table->enum('category', [
                'syllabus',
                'exam_bank',
                'module',
                'org_template',
                'other',
            ])->index();
            $table->string('file_url', 500);                     // Cloudinary / Drive link
            $table->string('file_type', 10)->nullable();         // "pdf", "docx", "pptx"
            $table->unsignedInteger('file_size_kb')->nullable();
            $table->string('academic_year', 10)->nullable();     // "2025/2026"
            $table->unsignedTinyInteger('semester')->nullable(); // 1 or 2
            $table->string('subject', 100)->nullable();          // Mata kuliah
            $table->unsignedInteger('download_count')->default(0);
            $table->boolean('is_published')->default(true)->index();
            $table->foreignId('uploaded_by')
                  ->constrained('users')
                  ->restrictOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['category', 'is_published']);
            $table->index(['academic_year', 'semester']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('resources');
    }
};
