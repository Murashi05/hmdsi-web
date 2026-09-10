<?php

namespace App\Repositories;

use App\Models\NewsArticle;
use Illuminate\Database\Eloquent\Builder;

class NewsArticleRepository extends BaseRepository
{
    public function __construct(NewsArticle $model)
    {
        parent::__construct($model);
    }

    public function publishedQuery(array $filters): Builder
    {
        return $this->query()
            ->with(['author', 'tags'])
            ->published()
            ->when($filters['category'] ?? null, fn ($q, $c) => $q->byCategory($c))
            ->when($filters['search'] ?? null, function ($q, $term) {
                $q->where(function ($inner) use ($term) {
                    $inner->where('title', 'like', "%{$term}%")
                        ->orWhere('excerpt', 'like', "%{$term}%")
                        ->orWhereHas('tags', fn ($t) => $t->where('tag', 'like', "%{$term}%"));
                });
            })
            ->when(isset($filters['is_featured']), function ($q) use ($filters) {
                $q->where('is_featured', filter_var($filters['is_featured'], FILTER_VALIDATE_BOOLEAN));
            })
            ->latest();
    }

    public function adminQuery(array $filters): Builder
    {
        return $this->query()->with(['author','tags'])
            ->when($filters['category'] ?? null, fn($q,$c) => $q->byCategory($c))
            ->when($filters['status'] ?? null, fn($q,$v) => $q->where('status',$v))
            ->latest('created_at');
    }

    public function findPublishedBySlug(string $slug): ?NewsArticle
    {
        return $this->query()->with(['author', 'tags'])->published()->where('slug', $slug)->first();
    }
}
