<?php

namespace App\Repositories;

use App\Models\GalleryEvent;
use Illuminate\Database\Eloquent\Builder;

class GalleryEventRepository extends BaseRepository
{
    public function __construct(GalleryEvent $model)
    {
        parent::__construct($model);
    }

    public function publishedQuery(array $filters): Builder
    {
        return $this->query()
            ->withCount('items')
            ->published()
            ->when($filters['period_id'] ?? null, fn ($q, $id) => $q->where('period_id', $id))
            ->ordered();
    }


    public function adminQuery(array $filters): Builder
    {
        return $this->query()
            ->withCount('items')
            ->with(['period'])
            ->when($filters['period_id'] ?? null, fn ($q, $id) => $q->where('period_id', (int) $id))
            ->when($filters['search'] ?? null, function ($q, $term) {
                $q->where(function ($inner) use ($term) {
                    $inner->where('title', 'like', "%{$term}%")
                        ->orWhere('description', 'like', "%{$term}%");
                });
            })
            ->latest('event_date')
            ->latest('created_at');
    }

    public function findPublishedBySlug(string $slug): ?GalleryEvent
    {
        return $this->query()->with('items')->published()->where('slug', $slug)->first();
    }
}
