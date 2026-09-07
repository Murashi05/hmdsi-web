<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('action', 50);              // create, update, delete, publish, respond
            $table->string('entity_type', 50);         // news_articles, work_programs, aspirations, etc.
            $table->unsignedBigInteger('entity_id');    // ID of affected record
            $table->json('old_values')->nullable();     // Snapshot before change
            $table->json('new_values')->nullable();     // Snapshot after change
            $table->string('ip_address', 45)->nullable(); // IPv4/IPv6 support
            $table->timestamp('created_at')->useCurrent();

            // Indexes for fast lookups
            $table->index(['user_id', 'created_at']);
            $table->index(['entity_type', 'entity_id']);
            $table->index('action');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
    }
};
