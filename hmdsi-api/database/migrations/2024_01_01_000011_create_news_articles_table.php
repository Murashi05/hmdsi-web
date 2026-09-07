<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('news_articles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('author_id')
                  ->constrained('users')
                  ->restrictOnDelete();
            $table->string('title', 255);
            $table->string('slug', 280)->unique()->index();
            $table->string('excerpt', 500)->nullable();
            $table->longText('content');                         // HTML / Markdown
            $table->string('cover_image_url', 500)->nullable();  // Cloudinary
            $table->enum('category', [
                'news',
                'announcement',
                'achievement',
                'academic',
                'event',
            ])->index();
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft')->index();
            $table->boolean('is_featured')->default(false)->index(); // Headline / homepage
            $table->unsignedInteger('view_count')->default(0);
            $table->timestamp('published_at')->nullable()->index();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'published_at']);
            $table->index(['category', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('news_articles');
    }
};
