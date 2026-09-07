<?php

namespace App\Services;

use App\Models\ManagementStructure;
use App\Models\Member;
use App\Repositories\ManagementStructureRepository;
use App\Repositories\MemberRepository;
use Illuminate\Database\Eloquent\Collection;

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

    public function createMember(array $data): Member
    {
        return $this->members->create($data);
    }

    public function updateMember(Member $member, array $data): Member
    {
        return $this->members->update($member, $data);
    }

    public function deleteMember(Member $member): bool
    {
        return $this->members->delete($member);
    }

    public function assign(array $data): ManagementStructure
    {
        return $this->structures->create($data);
    }

    public function updateAssignment(ManagementStructure $structure, array $data): ManagementStructure
    {
        return $this->structures->update($structure, $data);
    }

    public function removeAssignment(ManagementStructure $structure): bool
    {
        return $this->structures->delete($structure);
    }
}
