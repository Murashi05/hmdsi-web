<?php

namespace App\Repositories;

use App\Models\Member;

class MemberRepository extends BaseRepository
{
    public function __construct(Member $model)
    {
        parent::__construct($model);
    }

    public function findByStudentId(string $studentId): ?Member
    {
        return $this->query()->where('student_id', $studentId)->first();
    }
}
