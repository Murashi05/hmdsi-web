<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Period extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'start_date',
        'end_date',
        'is_active',
        'theme',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date'   => 'date',
        'is_active'  => 'boolean',
    ];

    // ─── Relationships ────────────────────────────────────────────────────────

    public function departments(): HasMany
    {
        return $this->hasMany(Department::class);
    }

    public function members(): HasMany
    {
        // Members who have a management structure in this period
        return $this->hasManyThrough(Member::class, ManagementStructure::class, 'period_id', 'id', 'id', 'member_id');
    }

    public function managementStructures(): HasMany
    {
        return $this->hasMany(ManagementStructure::class);
    }

    public function workPrograms(): HasMany
    {
        return $this->hasMany(WorkProgram::class);
    }

    public function galleryEvents(): HasMany
    {
        return $this->hasMany(GalleryEvent::class);
    }

    public function aboutContent(): HasOne
    {
        return $this->hasOne(AboutContent::class)->where('is_active', true);
    }

    // ─── Scopes ───────────────────────────────────────────────────────────────

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    /**
     * Deactivate all other periods and activate this one.
     * Called whenever a new period is set as active.
     */
    public function setAsActive(): void
    {
        static::where('id', '!=', $this->id)->update(['is_active' => false]);
        $this->update(['is_active' => true]);
    }
}
