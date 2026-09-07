<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Resource extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'description',
        'category',
        'file_url',
        'file_type',
        'file_size_kb',
        'academic_year',
        'semester',
        'subject',
        'download_count',
        'is_published',
        'uploaded_by',
    ];

    protected $casts = [
        'file_size_kb'   => 'integer',
        'semester'       => 'integer',
        'download_count' => 'integer',
        'is_published'   => 'boolean',
    ];

    public function uploadedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    public function incrementDownloadCount(): void
    {
        $this->increment('download_count');
    }
}
