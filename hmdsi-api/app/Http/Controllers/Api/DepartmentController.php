<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Department\StoreDepartmentRequest;
use App\Http\Resources\DepartmentResource;
use App\Http\Resources\ManagementStructureResource;
use App\Models\Department;
use App\Services\DepartmentService;
use App\Services\ManagementStructureService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    public function __construct(
        private DepartmentService $departments,
        private ManagementStructureService $structures,
    ) {
    }

    public function index(Request $request): JsonResponse
    {
        $items = $this->departments->list($request->integer('period_id') ?: null);

        return $this->success(DepartmentResource::collection($items));
    }

    public function show(Request $request, string $slug): JsonResponse
    {
        $department = $this->departments->findBySlug($slug, $request->integer('period_id') ?: null);

        return $this->success(new DepartmentResource($department));
    }

    public function structure(Request $request, string $slug): JsonResponse
    {
        $department = $this->departments->findBySlug($slug, $request->integer('period_id') ?: null);
        $items = $this->structures->list([
            'department_id' => $department->id,
            'period_id' => $department->period_id,
        ]);

        return $this->success(ManagementStructureResource::collection($items));
    }

    public function store(StoreDepartmentRequest $request): JsonResponse
    {
        return $this->created(new DepartmentResource($this->departments->create($request->validated())));
    }

    public function update(StoreDepartmentRequest $request, Department $department): JsonResponse
    {
        return $this->success(new DepartmentResource($this->departments->update($department, $request->validated())));
    }

    public function destroy(Department $department): JsonResponse
    {
        $this->departments->delete($department);

        return $this->success(null, 'Department deleted.');
    }
}
