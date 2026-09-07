<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ManagementStructure extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'period_id',
        'member_id',
        'department_id',
        'role_id',
        'is_active',
        'joined_at',
        'ended_at',
    ];

    protected $casts = [
        'is_active'  => 'boolean',
        'joined_at'  => 'date',
        'ended_at'   => 'date',
    ];

    // ─── Relationships ────────────────────────────────────────────────────────

    public function period(): BelongsTo
    {
        return $this->belongsTo(Period::class);
    }

    public function member(): BelongsTo
    {
        return $this->belongsTo(Member::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function role(): BelongsTo
    {
        return $this->belongsTo(ManagementRole::class, 'role_id');
    }

    // ─── Scopes ───────────────────────────────────────────────────────────────

    public function scopeActive($query)
    {
        return $query->where('is_active', true)->whereNull('deleted_at');
    }

    public function scopeForPeriod($query, int $periodId)
    {
        return $query->where('period_id', $periodId);
    }

    public function scopeForDepartment($query, int $departmentId)
    {
        return $query->where('department_id', $departmentId);
    }
}
