<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\WorkProgram\StoreWorkProgramRequest;
use App\Http\Resources\WorkProgramResource;
use App\Models\WorkProgram;
use App\Services\WorkProgramService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WorkProgramController extends Controller
{
    public function __construct(private WorkProgramService $workPrograms)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $paginator = $this->workPrograms->paginate(
            $request->only(['period_id', 'department_slug', 'status', 'is_highlight']),
            $request->integer('per_page', 12)
        );

        return $this->paginated($paginator, 'OK', WorkProgramResource::class);
    }

    public function highlights(Request $request): JsonResponse
    {
        $items = $this->workPrograms->highlighted($request->only(['period_id']));

        return $this->success(WorkProgramResource::collection($items));
    }

    public function show(string $slug): JsonResponse
    {
        return $this->success(new WorkProgramResource($this->workPrograms->findBySlug($slug)));
    }

    public function store(StoreWorkProgramRequest $request): JsonResponse
    {
        return $this->created(new WorkProgramResource($this->workPrograms->create($request->validated())));
    }

    public function update(StoreWorkProgramRequest $request, WorkProgram $workProgram): JsonResponse
    {
        return $this->success(new WorkProgramResource($this->workPrograms->update($workProgram, $request->validated())));
    }

    public function destroy(WorkProgram $workProgram): JsonResponse
    {
        $this->workPrograms->delete($workProgram);

        return $this->success(null, 'Work program deleted.');
    }
}
