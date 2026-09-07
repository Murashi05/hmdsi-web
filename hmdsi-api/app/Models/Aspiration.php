<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Aspiration extends Model
{
    use HasFactory;

    protected $fillable = [
        'tracking_code',
        'category',
        'subject',
        'message',
        'status',
        'is_anonymous',
        'sender_name',
        'sender_email',
        'sender_student_id',
        'is_public',
        'resolved_at',
    ];

    protected $casts = [
        'is_anonymous'  => 'boolean',
        'is_public'     => 'boolean',
        'resolved_at'   => 'datetime',
    ];

    // Status constants
    const STATUS_SUBMITTED    = 'submitted';
    const STATUS_UNDER_REVIEW = 'under_review';
    const STATUS_IN_PROGRESS  = 'in_progress';
    const STATUS_RESOLVED     = 'resolved';
    const STATUS_REJECTED     = 'rejected';

    // ─── Model Events ─────────────────────────────────────────────────────────

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (self $model) {
            // Auto-generate tracking code: ASP-YYYY-XXXXX
            $model->tracking_code = 'ASP-' . now()->year . '-' . strtoupper(Str::random(5));
        });
    }

    // ─── Relationships ────────────────────────────────────────────────────────

    public function responses(): HasMany
    {
        return $this->hasMany(AspirationResponse::class);
    }

    public function publicResponses(): HasMany
    {
        return $this->hasMany(AspirationResponse::class)->where('is_public', true);
    }

    // ─── Scopes ───────────────────────────────────────────────────────────────

    public function scopePublic($query)
    {
        return $query->where('is_public', true);
    }

    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    // ─── Accessors ────────────────────────────────────────────────────────────

    /**
     * For anonymous aspirations, mask the sender name in public responses.
     */
    public function getDisplayNameAttribute(): string
    {
        if ($this->is_anonymous) {
            return 'Anonim';
        }
        return $this->sender_name ?? 'Tidak Diketahui';
    }
}
