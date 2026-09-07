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

    public function findPublishedBySlug(string $slug): ?GalleryEvent
    {
        return $this->query()->with('items')->published()->where('slug', $slug)->first();
    }
}
