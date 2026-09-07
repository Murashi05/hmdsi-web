<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AboutContent extends Model
{
    protected $fillable = [
        'period_id',
        'organization_history',
        'vision',
        'mission',
        'values',
        'logo_url',
        'logo_description',
        'is_active',
    ];

    protected $casts = [
        'mission'   => 'array',  // JSON → PHP array automatically
        'values'    => 'array',  // JSON → PHP array automatically
        'is_active' => 'boolean',
    ];

    public function period(): BelongsTo
    {
        return $this->belongsTo(Period::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
