<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('site_stats', function (Blueprint $table) {
            $table->id();
            $table->string('key', 50)->unique();      // "total_members", "total_programs"
            $table->string('label', 100);             // "Total Anggota"
            $table->string('value', 50);              // "120+", "15"
            $table->string('icon', 50)->nullable();   // Lucide icon name
            $table->unsignedTinyInteger('sort_order')->default(0);
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('site_stats');
    }
};
