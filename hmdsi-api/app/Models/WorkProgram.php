<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class WorkProgram extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'period_id',
        'department_id',
        'name',
        'slug',
        'description',
        'objectives',
        'status',
        'planned_date',
        'actual_date',
        'planned_end_date',
        'actual_end_date',
        'budget_allocation',
        'budget_used',
        'participant_count',
        'cover_image_url',
        'is_highlight',
        'sort_order',
    ];

    protected $casts = [
        'planned_date'       => 'date',
        'actual_date'        => 'date',
        'planned_end_date'   => 'date',
        'actual_end_date'    => 'date',
        'budget_allocation'  => 'decimal:2',
        'budget_used'        => 'decimal:2',
        'participant_count'  => 'integer',
        'is_highlight'       => 'boolean',
        'sort_order'         => 'integer',
    ];

    // Status constants — use these instead of magic strings
    const STATUS_PLANNED     = 'planned';
    const STATUS_IN_PROGRESS = 'in_progress';
    const STATUS_COMPLETED   = 'completed';
    const STATUS_POSTPONED   = 'postponed';
    const STATUS_CANCELLED   = 'cancelled';

    // ─── Model Events ────────────────────────────────────────────────────────

    protected static function boot(): void
    {
        parent::boot();

        // Auto-generate slug from name on creation
        static::creating(function (self $model) {
            if (empty($model->slug)) {
                $model->slug = Str::slug($model->name);
            }
        });
    }

    // ─── Relationships ────────────────────────────────────────────────────────

    public function period(): BelongsTo
    {
        return $this->belongsTo(Period::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function tags(): HasMany
    {
        return $this->hasMany(WorkProgramTag::class);
    }

    // ─── Scopes ───────────────────────────────────────────────────────────────

    public function scopeHighlighted($query)
    {
        return $query->where('is_highlight', true);
    }

    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('planned_date');
    }
}
