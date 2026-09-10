<?php

namespace App\Services;

use App\Models\Department;
use App\Models\ManagementRole;
use App\Models\ManagementStructure;
use App\Models\Member;
use App\Models\Period;
use App\Repositories\ManagementStructureRepository;
use App\Repositories\MemberRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ManagementStructureService
{
    public function __construct(
        private ManagementStructureRepository $structures,
        private MemberRepository $members,
    ) {
    }

    public function list(array $filters = []): Collection
    {
        return $this->structures->listPublic($filters);
    }

    public function listMembersForAdmin(?int $periodId = null): Collection
    {
        $periodId ??= Period::active()->value('id');

        return Member::query()
            ->with(['managementStructures' => fn ($q) => $q->where('period_id', $periodId)->where('is_active', true)->with(['role', 'department'])])
            ->orderBy('full_name')
            ->get();
    }

    public function createMember(array $data): Member
    {
        return DB::transaction(function () use ($data) {
            $assignment = [
                'period_id' => $data['period_id'] ?? null,
                'management_role_id' => $data['management_role_id'] ?? null,
                'department_id' => $data['department_id'] ?? null,
            ];
            unset($data['period_id'], $data['management_role_id'], $data['department_id']);
            $data['study_program'] = 'D3 Sistem Informasi';

            $member = $this->members->create($data);
            $this->syncAssignment($member, $assignment);

            return $member->load(['managementStructures.role', 'managementStructures.department']);
        });
    }

    public function updateMember(Member $member, array $data): Member
    {
        unset($data['period_id'], $data['management_role_id'], $data['department_id']);
        $data['study_program'] = 'D3 Sistem Informasi';

        return $this->members->update($member, $data);
    }

    public function updateMemberWithAssignment(Member $member, array $data): Member
    {
        return DB::transaction(function () use ($member, $data) {
            $assignment = [
                'period_id' => $data['period_id'] ?? null,
                'management_role_id' => $data['management_role_id'] ?? null,
                'department_id' => $data['department_id'] ?? null,
            ];
            unset($data['period_id'], $data['management_role_id'], $data['department_id']);
            $data['study_program'] = 'D3 Sistem Informasi';
            $member = $this->members->update($member, $data);
            $this->syncAssignment($member, $assignment);
            return $member->fresh(['managementStructures.role', 'managementStructures.department']);
        });
    }

    public function deleteMember(Member $member): bool
    {
        return $this->members->delete($member);
    }

    public function assign(array $data): ManagementStructure
    {
        return DB::transaction(fn () => $this->createAssignment($data));
    }

    public function updateAssignment(ManagementStructure $structure, array $data): ManagementStructure
    {
        return DB::transaction(function () use ($structure, $data) {
            $this->assertAssignmentAllowed($data, $structure);
            return $this->structures->update($structure, $data);
        });
    }

    public function removeAssignment(ManagementStructure $structure): bool
    {
        return $this->structures->delete($structure);
    }

    private function syncAssignment(Member $member, array $assignment): void
    {
        $provided = collect($assignment)->filter(fn ($value) => $value !== null && $value !== '')->isNotEmpty();
        if (!$provided) return;
        if (!$assignment['period_id'] || !$assignment['management_role_id'] || !$assignment['department_id']) {
            throw ValidationException::withMessages(['management_role_id' => 'Periode, jabatan, dan departemen harus dipilih bersama.']);
        }

        $existing = ManagementStructure::query()
            ->where('member_id', $member->id)
            ->where('period_id', $assignment['period_id'])
            ->where('is_active', true)
            ->first();

        if ($existing) {
            $this->assertAssignmentAllowed($assignment, $existing);
            $existing->update([
                'role_id' => $assignment['management_role_id'],
                'department_id' => $assignment['department_id'],
            ]);
            return;
        }

        $this->createAssignment([
            'period_id' => $assignment['period_id'],
            'member_id' => $member->id,
            'department_id' => $assignment['department_id'],
            'role_id' => $assignment['management_role_id'],
            'is_active' => true,
        ]);
    }

    private function createAssignment(array $data): ManagementStructure
    {
        $this->assertAssignmentAllowed($data);

        return $this->structures->create($data);
    }

    private function assertAssignmentAllowed(array $data, ?ManagementStructure $ignore = null): void
    {
        $period = Period::query()->lockForUpdate()->find($data['period_id'] ?? null);
        $role = ManagementRole::find($data['role_id'] ?? $data['management_role_id'] ?? null);
        $department = Department::find($data['department_id'] ?? null);

        if (!$period || !$role || !$department) {
            throw ValidationException::withMessages(['management_role_id' => 'Periode, jabatan, atau departemen tidak ditemukan.']);
        }

        if ((int) $department->period_id !== (int) $period->id) {
            throw ValidationException::withMessages(['department_id' => 'Departemen harus berasal dari periode yang dipilih.']);
        }

        $name = strtolower(trim($role->name));
        $topLevel = in_array($name, ['ketua himpunan', 'wakil ketua himpunan', 'sekretaris umum', 'staff sekretaris', 'bendahara umum', 'staff bendahara'], true);
        $deptLevel = in_array($name, ['ketua departemen', 'wakil ketua departemen', 'staff'], true);

        if ($topLevel && $department->type === 'department') {
            throw ValidationException::withMessages(['department_id' => 'Jabatan inti himpunan hanya boleh ditempatkan pada struktur inti.']);
        }
        if ($deptLevel && $department->type !== 'department') {
            throw ValidationException::withMessages(['department_id' => 'Jabatan departemen hanya boleh ditempatkan pada departemen kerja.']);
        }
        if ($name === 'ketua departemen' && $department->type !== 'department') {
            throw ValidationException::withMessages(['department_id' => 'Ketua Departemen harus berada pada departemen kerja.']);
        }
        if ($name === 'wakil ketua departemen' && $department->type !== 'department') {
            throw ValidationException::withMessages(['department_id' => 'Wakil Ketua Departemen harus berada pada departemen kerja.']);
        }
        if ($name === 'staff sekretaris' && $department->slug !== 'secretary') {
            throw ValidationException::withMessages(['department_id' => 'Staff Sekretaris hanya boleh berada di Departemen Sekretaris.']);
        }
        if ($name === 'staff bendahara' && $department->slug !== 'treasurer') {
            throw ValidationException::withMessages(['department_id' => 'Staff Bendahara hanya boleh berada di Departemen Bendahara.']);
        }
        if ($name === 'sekretaris umum' && $department->slug !== 'secretary') {
            throw ValidationException::withMessages(['department_id' => 'Sekretaris Umum hanya boleh berada di Departemen Sekretaris.']);
        }
        if ($name === 'bendahara umum' && $department->slug !== 'treasurer') {
            throw ValidationException::withMessages(['department_id' => 'Bendahara Umum hanya boleh berada di Departemen Bendahara.']);
        }
        if (in_array($name, ['ketua himpunan', 'wakil ketua himpunan', 'sekretaris umum', 'bendahara umum', 'ketua departemen', 'wakil ketua departemen'], true)) {
            $query = ManagementStructure::query()
                ->where('period_id', $period->id)
                ->where('role_id', $role->id)
                ->where('is_active', true);
            if ($name === 'ketua departemen' || $name === 'wakil ketua departemen') {
                $query->where('department_id', $department->id);
            }
            if ($ignore) $query->where('id', '!=', $ignore->id);
            if ($query->exists()) {
                throw ValidationException::withMessages(['management_role_id' => $role->name.' hanya dapat diisi 1 orang pada '. $period->name . (($name === 'ketua departemen' || $name === 'wakil ketua departemen') ? ' untuk departemen tersebut.' : '.')]);
            }
        }

        // One active assignment per member per period.
        $memberId = $data['member_id'] ?? $ignore?->member_id;
        if ($memberId) {
            $memberQuery = ManagementStructure::query()
                ->where('period_id', $period->id)
                ->where('member_id', $memberId)
                ->where('is_active', true);
            if ($ignore) $memberQuery->where('id', '!=', $ignore->id);
            if ($memberQuery->exists()) {
                throw ValidationException::withMessages(['member_id' => 'Satu anggota hanya dapat memiliki satu jabatan aktif dalam satu periode.']);
            }
        }
    }
}
