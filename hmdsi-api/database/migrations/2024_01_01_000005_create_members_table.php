<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('members', function (Blueprint $table) {
            $table->id();
            $table->string('full_name', 150);
            $table->string('student_id', 20)->unique(); // NIM
            $table->string('study_program', 100);
            $table->year('batch_year');                  // Angkatan: 2023
            $table->string('email', 150)->nullable();
            $table->string('phone', 20)->nullable();
            $table->string('photo_url', 500)->nullable();        // Cloudinary URL
            $table->string('linkedin_url', 255)->nullable();
            $table->string('instagram_handle', 50)->nullable();  // @username
            $table->text('bio')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('batch_year');
            $table->index('study_program');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('members');
    }
};
