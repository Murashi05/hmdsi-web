<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('periods', function (Blueprint $table) {
            $table->id();
            $table->string('name', 50);           // e.g. "2025/2026"
            $table->date('start_date');
            $table->date('end_date');
            $table->boolean('is_active')->default(false)->index();
            $table->string('theme', 255)->nullable(); // Motto/tema periode
            $table->timestamps();
            $table->softDeletes();                // Historical periods must be recoverable

            // Ensure only one active period via app-level logic
            // Index for fast active-period lookups
            $table->index(['is_active', 'start_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('periods');
    }
};
