<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class NewsCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'color',
        'description',
    ];

    protected $casts = [
        'color' => 'string',
    ];

    // ─── Relationships ────────────────────────────────────────────────

    public function articles(): BelongsToMany
    {
        return $this->belongsToMany(NewsArticle::class, 'news_category_article')
            ->withTimestamps();
    }
}
