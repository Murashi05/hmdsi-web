<?php

namespace App\Repositories;

use App\Models\Department;
use Illuminate\Database\Eloquent\Collection;

class DepartmentRepository extends BaseRepository
{
    public function __construct(Department $model)
    {
        parent::__construct($model);
    }

    public function listForPeriod(?int $periodId): Collection
    {
        return $this->query()
            ->when($periodId, fn ($q) => $q->where('period_id', $periodId))
            ->ordered()
            ->get();
    }

    public function findBySlug(string $slug, ?int $periodId = null): ?Department
    {
        return $this->query()
            ->where('slug', $slug)
            ->when($periodId, fn ($q) => $q->where('period_id', $periodId))
            ->first();
    }
}
