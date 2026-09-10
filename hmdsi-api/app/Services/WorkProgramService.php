<?php

namespace App\Services;

use App\Models\WorkProgram;
use App\Models\Period;
use App\Models\Department;
use App\Repositories\WorkProgramRepository;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Validation\ValidationException;

class WorkProgramService
{
    public function __construct(private WorkProgramRepository $workPrograms)
    {
    }

    public function paginate(array $filters, int $perPage = 12): LengthAwarePaginator
    {
        return $this->workPrograms->paginate(
            $this->workPrograms->filteredQuery($filters),
            $perPage
        );
    }

    public function highlighted(array $filters = []): \Illuminate\Database\Eloquent\Collection
    {
        $filters['is_highlight'] = true;

        return $this->workPrograms->filteredQuery($filters)->limit(6)->get();
    }

    public function findBySlug(string $slug): WorkProgram
    {
        $program = $this->workPrograms->findBySlug($slug);

        abort_unless($program, 404, 'Work program not found.');

        return $program;
    }

    public function create(array $data): WorkProgram
    {
        $data['period_id'] ??= Period::active()->value('id');
        $this->assertDepartmentMatchesPeriod($data['department_id'] ?? null, $data['period_id'] ?? null);
        $tags = $data['tags'] ?? [];
        unset($data['tags']);

        /** @var WorkProgram $program */
        $program = $this->workPrograms->create($data);
        $this->syncTags($program, $tags);

        return $program->load(['department', 'tags']);
    }

    public function update(WorkProgram $program, array $data): WorkProgram
    {
        $tags = $data['tags'] ?? null;
        unset($data['tags']);

        if (array_key_exists('department_id', $data)) {
            $this->assertDepartmentMatchesPeriod($data['department_id'] ?? null, $data['period_id'] ?? $program->period_id);
        }
        $program = $this->workPrograms->update($program, $data);

        if (is_array($tags)) {
            $this->syncTags($program, $tags);
        }

        return $program->load(['department', 'tags']);
    }

    public function delete(WorkProgram $program): bool
    {
        return $this->workPrograms->delete($program);
    }

    private function assertDepartmentMatchesPeriod(?int $departmentId, ?int $periodId): void
    {
        if (!$departmentId || !$periodId) {
            throw ValidationException::withMessages(['department_id' => 'Departemen dan periode wajib ditentukan.']);
        }
        $department = Department::find($departmentId);
        if (!$department || (int) $department->period_id !== (int) $periodId) {
            throw ValidationException::withMessages(['department_id' => 'Departemen harus berasal dari periode yang dipilih.']);
        }
    }

    private function syncTags(WorkProgram $program, array $tags): void
    {
        $program->tags()->delete();

        foreach (array_filter($tags) as $tag) {
            $program->tags()->create(['tag' => $tag]);
        }
    }
}
