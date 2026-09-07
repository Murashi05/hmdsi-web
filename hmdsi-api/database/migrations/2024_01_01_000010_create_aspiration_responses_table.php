<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('aspiration_responses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('aspiration_id')
                  ->constrained('aspirations')
                  ->cascadeOnDelete();
            $table->foreignId('responded_by')
                  ->constrained('users')
                  ->restrictOnDelete();
            $table->text('message');
            $table->boolean('is_public')->default(false); // Show to sender/public
            $table->timestamp('created_at')->useCurrent();

            $table->index('aspiration_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('aspiration_responses');
    }
};
