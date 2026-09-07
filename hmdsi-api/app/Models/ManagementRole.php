<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ManagementRole extends Model
{
    // No timestamps on this lookup table
    public $timestamps = false;

    protected $fillable = [
        'name',
        'name_en',
        'level',
    ];

    protected $casts = [
        'level' => 'integer',
    ];

    // ─── Relationships ────────────────────────────────────────────────────────

    public function managementStructures(): HasMany
    {
        return $this->hasMany(ManagementStructure::class, 'role_id');
    }

    // ─── Scopes ───────────────────────────────────────────────────────────────

    public function scopeOrdered($query)
    {
        return $query->orderBy('level');
    }
}
