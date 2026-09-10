<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('period_id')
                  ->nullable()
                  ->constrained('periods')
                  ->nullOnDelete();
            $table->foreignId('department_id')
                  ->nullable()
                  ->constrained('departments')
                  ->nullOnDelete();
            $table->foreignId('uploaded_by')
                  ->nullable()
                  ->constrained('users')
                  ->nullOnDelete();
            $table->string('title', 200);
            $table->string('slug', 220)->unique();
            $table->text('description')->nullable();
            $table->string('file_url', 500);
            $table->string('file_type', 10)->nullable(); // pdf, docx, pptx, jpg, png
            $table->unsignedInteger('file_size_kb')->nullable();
            $table->string('category', 50); // proposal, surat, laporan, dokumen_kepengurusan, dll
            $table->string('document_type', 50)->nullable(); // himpunan, proposal, surat, dll
            $table->boolean('is_published')->default(true);
            $table->integer('download_count')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['period_id', 'category']);
            $table->index(['department_id', 'category']);
            $table->index(['is_published', 'category']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};