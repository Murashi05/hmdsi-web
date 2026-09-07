<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('management_roles', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);         // "Kepala Departemen"
            $table->string('name_en', 100);      // "Department Head"
            $table->unsignedTinyInteger('level'); // 1=Ketua, 2=Wakil, 3=Sekum, 4=Kabid, 5=Staff
            $table->timestamp('created_at')->useCurrent();

            $table->index('level');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('management_roles');
    }
};
