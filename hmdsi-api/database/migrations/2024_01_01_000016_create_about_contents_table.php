<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('about_contents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('period_id')
                  ->nullable()
                  ->constrained('periods')
                  ->nullOnDelete();
            $table->longText('organization_history')->nullable(); // HTML narrative
            $table->text('vision')->nullable();
            $table->json('mission')->nullable();    // ["Misi 1", "Misi 2", ...]
            $table->json('values')->nullable();     // [{"title":"", "description":""}, ...]
            $table->string('logo_url', 500)->nullable();
            $table->text('logo_description')->nullable();
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('about_contents');
    }
};
