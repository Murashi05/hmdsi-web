<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('gallery_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('gallery_event_id')
                  ->constrained('gallery_events')
                  ->cascadeOnDelete();
            $table->string('file_url', 500);                             // Cloudinary full URL
            $table->string('thumbnail_url', 500)->nullable();            // Cloudinary transform URL
            $table->enum('type', ['photo', 'video'])->default('photo');
            $table->string('caption', 300)->nullable();
            $table->string('cloudinary_public_id', 200)->nullable();     // For API deletion
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamp('created_at')->useCurrent();

            $table->index(['gallery_event_id', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gallery_items');
    }
};
