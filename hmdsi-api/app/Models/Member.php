<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Member extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'full_name',
        'student_id',
        'study_program',
        'batch_year',
        'email',
        'phone',
        'photo_url',
        'linkedin_url',
        'instagram_handle',
        'bio',
    ];

    protected $hidden = [
        'phone',
        'email',  // Hidden from public API; exposed only for admin
    ];

    protected $casts = [
        'batch_year' => 'integer',
    ];

    // ─── Relationships ────────────────────────────────────────────────────────

    public function managementStructures(): HasMany
    {
        return $this->hasMany(ManagementStructure::class);
    }

    // ─── Scopes ───────────────────────────────────────────────────────────────

    public function scopeByBatch($query, int $year)
    {
        return $query->where('batch_year', $year);
    }

    // ─── Accessors ────────────────────────────────────────────────────────────

    /**
     * Returns the photo URL or a default avatar placeholder.
     */
    public function getPhotoAttribute(): string
    {
        return $this->photo_url
            ?? "https://ui-avatars.com/api/?name={$this->full_name}&background=3B82F6&color=fff&size=256";
    }
}
