<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Management\StoreManagementStructureRequest;
use App\Http\Requests\Member\StoreMemberRequest;
use App\Http\Resources\ManagementStructureResource;
use App\Http\Resources\MemberResource;
use App\Models\ManagementRole;
use App\Models\ManagementStructure;
use App\Models\Member;
use App\Services\ManagementStructureService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ManagementStructureController extends Controller
{
    public function __construct(private ManagementStructureService $structures)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $items = $this->structures->list($request->only(['period_id', 'department_id', 'department_slug']));

        return $this->success(ManagementStructureResource::collection($items));
    }

    public function roles(): JsonResponse
    {
        return $this->success(ManagementRole::orderBy('level')->get());
    }

    public function storeMember(StoreMemberRequest $request): JsonResponse
    {
        return $this->created(new MemberResource($this->structures->createMember($request->validated())));
    }

    public function updateMember(Request $request, Member $member): JsonResponse
    {
        $data = $request->validate([
            'full_name' => ['sometimes', 'string', 'max:150'],
            'student_id' => ['sometimes', 'string', 'max:20', 'unique:members,student_id,'.$member->id],
            'study_program' => ['sometimes', 'string', 'max:100'],
            'batch_year' => ['sometimes', 'integer', 'min:2000'],
            'email' => ['nullable', 'email', 'max:150'],
            'phone' => ['nullable', 'string', 'max:30'],
            'photo_url' => ['nullable', 'url', 'max:500'],
            'linkedin_url' => ['nullable', 'url', 'max:255'],
            'instagram_handle' => ['nullable', 'string', 'max:80'],
            'bio' => ['nullable', 'string'],
        ]);

        return $this->success(new MemberResource($this->structures->updateMember($member, $data)));
    }

    public function destroyMember(Member $member): JsonResponse
    {
        $this->structures->deleteMember($member);

        return $this->success(null, 'Member deleted.');
    }

    public function store(StoreManagementStructureRequest $request): JsonResponse
    {
        $structure = $this->structures->assign($request->validated())->load(['member', 'role', 'department']);

        return $this->created(new ManagementStructureResource($structure));
    }

    public function update(StoreManagementStructureRequest $request, ManagementStructure $managementStructure): JsonResponse
    {
        $structure = $this->structures
            ->updateAssignment($managementStructure, $request->validated())
            ->load(['member', 'role', 'department']);

        return $this->success(new ManagementStructureResource($structure));
    }

    public function destroy(ManagementStructure $managementStructure): JsonResponse
    {
        $this->structures->removeAssignment($managementStructure);

        return $this->success(null, 'Assignment removed.');
    }
}
