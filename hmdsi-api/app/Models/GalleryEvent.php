<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class GalleryEvent extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'period_id',
        'title',
        'slug',
        'description',
        'event_date',
        'cover_image_url',
        'is_published',
        'sort_order',
    ];

    protected $casts = [
        'event_date'   => 'date',
        'is_published' => 'boolean',
        'sort_order'   => 'integer',
    ];

    // ─── Model Events ─────────────────────────────────────────────────────────

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (self $model) {
            if (empty($model->slug)) {
                $model->slug = Str::slug($model->title);
            }
        });
    }

    // ─── Relationships ────────────────────────────────────────────────────────

    public function period(): BelongsTo
    {
        return $this->belongsTo(Period::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(GalleryItem::class)->orderBy('sort_order');
    }

    public function photos(): HasMany
    {
        return $this->hasMany(GalleryItem::class)->where('type', 'photo')->orderBy('sort_order');
    }

    // ─── Scopes ───────────────────────────────────────────────────────────────

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderByDesc('event_date');
    }

    // ─── Accessors ────────────────────────────────────────────────────────────

    /**
     * Falls back to the first photo in the album if no cover is set.
     */
    public function getCoverAttribute(): ?string
    {
        return $this->cover_image_url
            ?? $this->items()->where('type', 'photo')->value('file_url');
    }

    /**
     * Count of photos in this event.
     */
    public function getPhotoCountAttribute(): int
    {
        return $this->items()->where('type', 'photo')->count();
    }
}
