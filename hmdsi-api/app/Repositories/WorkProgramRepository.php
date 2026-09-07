<?php

namespace App\Repositories;

use App\Models\WorkProgram;
use Illuminate\Database\Eloquent\Builder;

class WorkProgramRepository extends BaseRepository
{
    public function __construct(WorkProgram $model)
    {
        parent::__construct($model);
    }

    public function filteredQuery(array $filters): Builder
    {
        return $this->query()
            ->with(['department', 'tags'])
            ->when($filters['period_id'] ?? null, fn ($q, $id) => $q->where('period_id', $id))
            ->when($filters['department_slug'] ?? null, function ($q, $slug) {
                $q->whereHas('department', fn ($d) => $d->where('slug', $slug));
            })
            ->when($filters['status'] ?? null, fn ($q, $status) => $q->byStatus($status))
            ->when(isset($filters['is_highlight']), function ($q) use ($filters) {
                $q->where('is_highlight', filter_var($filters['is_highlight'], FILTER_VALIDATE_BOOLEAN));
            })
            ->ordered();
    }

    public function findBySlug(string $slug): ?WorkProgram
    {
        return $this->query()->with(['department', 'tags', 'period'])->where('slug', $slug)->first();
    }
}
