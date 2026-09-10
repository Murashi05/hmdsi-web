<?php

namespace App\Services;

use App\Models\Department;
use App\Repositories\DepartmentRepository;
use App\Repositories\PeriodRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class DepartmentService
{
    public function __construct(
        private DepartmentRepository $departments,
        private PeriodRepository $periods,
    ) {
    }

    public function list(?int $periodId = null): Collection
    {
        $periodId ??= $this->periods->findActive()?->id;

        return $this->departments->listForPeriod($periodId);
    }

    public function findBySlug(string $slug, ?int $periodId = null): Department
    {
        $periodId ??= $this->periods->findActive()?->id;
        $department = $this->departments->findBySlug($slug, $periodId);

        if (! $department) {
            throw (new ModelNotFoundException)->setModel(Department::class);
        }

        return $department;
    }

    public function create(array $data): Department
    {
        $data['period_id'] ??= $this->periods->findActive()?->id;
        return $this->departments->create($data);
    }

    public function update(Department $department, array $data): Department
    {
        return $this->departments->update($department, $data);
    }

    public function delete(Department $department): bool
    {
        return $this->departments->delete($department);
    }
}
