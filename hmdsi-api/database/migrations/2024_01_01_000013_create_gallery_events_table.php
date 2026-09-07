<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('gallery_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('period_id')
                  ->nullable()
                  ->constrained('periods')
                  ->nullOnDelete();
            $table->string('title', 200);
            $table->string('slug', 220)->unique()->index();
            $table->text('description')->nullable();
            $table->date('event_date')->nullable();
            $table->string('cover_image_url', 500)->nullable(); // Auto-set from first item if null
            $table->boolean('is_published')->default(false)->index();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['period_id', 'is_published']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gallery_events');
    }
};
