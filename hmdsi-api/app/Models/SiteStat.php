<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteStat extends Model
{
    // Only has updated_at
    public $timestamps    = false;
    const UPDATED_AT      = 'updated_at';

    protected $fillable = [
        'key',
        'label',
        'value',
        'icon',
        'sort_order',
    ];

    protected $casts = [
        'sort_order' => 'integer',
    ];

    // ─── Static Helpers ───────────────────────────────────────────────────────

    /**
     * Get a stat value by key.
     */
    public static function getValue(string $key): ?string
    {
        return static::where('key', $key)->value('value');
    }

    /**
     * Update or create a stat by key.
     */
    public static function set(string $key, string $value): void
    {
        static::updateOrCreate(['key' => $key], ['value' => $value]);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order');
    }
}
