<?php

namespace App\Repositories;

use App\Models\ManagementStructure;
use Illuminate\Database\Eloquent\Collection;

class ManagementStructureRepository extends BaseRepository
{
    public function __construct(ManagementStructure $model)
    {
        parent::__construct($model);
    }

    public function listPublic(array $filters): Collection
    {
        return $this->query()
            ->with(['member', 'role', 'department'])
            ->active()
            ->when($filters['period_id'] ?? null, fn ($q, $id) => $q->forPeriod((int) $id))
            ->when($filters['department_id'] ?? null, fn ($q, $id) => $q->forDepartment((int) $id))
            ->when($filters['department_slug'] ?? null, function ($q, $slug) {
                $q->whereHas('department', fn ($d) => $d->where('slug', $slug));
            })
            ->get();
    }
}
