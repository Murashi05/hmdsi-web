<?php

namespace App\Repositories;

use App\Models\Resource as ArchiveResource;
use Illuminate\Database\Eloquent\Builder;

class ResourceArchiveRepository extends BaseRepository
{
    public function __construct(ArchiveResource $model)
    {
        parent::__construct($model);
    }

    public function adminQuery(array $filters): Builder
    {
        return $this->query()
            ->when($filters['category'] ?? null, fn ($q, $c) => $q->byCategory($c))
            ->when($filters['academic_year'] ?? null, fn ($q, $y) => $q->where('academic_year', $y))
            ->when($filters['search'] ?? null, function ($q, $term) {
                $q->where(function ($inner) use ($term) {
                    $inner->where('title', 'like', "%{$term}%")
                        ->orWhere('subject', 'like', "%{$term}%");
                });
            })
            ->latest();
    }

    public function publishedQuery(array $filters): Builder
    {
        return $this->query()
            ->published()
            ->when($filters['category'] ?? null, fn ($q, $c) => $q->byCategory($c))
            ->when($filters['academic_year'] ?? null, fn ($q, $y) => $q->where('academic_year', $y))
            ->when($filters['search'] ?? null, function ($q, $term) {
                $q->where(function ($inner) use ($term) {
                    $inner->where('title', 'like', "%{$term}%")
                        ->orWhere('subject', 'like', "%{$term}%");
                });
            })
            ->latest();
    }
}
