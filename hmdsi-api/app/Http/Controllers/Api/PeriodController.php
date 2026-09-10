<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PeriodResource;
use App\Models\Period;
use App\Services\PeriodService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PeriodController extends Controller
{
    public function __construct(private PeriodService $periods)
    {
    }

    public function index(): JsonResponse
    {
        return $this->success(PeriodResource::collection($this->periods->list()));
    }

    public function active(): JsonResponse
    {
        $period = $this->periods->active();

        if (! $period) {
            return $this->error('No active period found.', 404);
        }

        return $this->success(new PeriodResource($period));
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:50'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after:start_date'],
            'is_active' => ['sometimes', 'boolean'],
            'theme' => ['nullable', 'string', 'max:255'],
        ]);

        return $this->created(new PeriodResource($this->periods->create($data)));
    }

    public function update(Request $request, Period $period): JsonResponse
    {
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:50'],
            'start_date' => ['sometimes', 'date'],
            'end_date' => ['sometimes', 'date'],
            'is_active' => ['sometimes', 'boolean'],
            'theme' => ['nullable', 'string', 'max:255'],
        ]);

        $period = $this->periods->update($period, $data);

        return $this->success(new PeriodResource($period));
    }

    public function destroy(Period $period): JsonResponse
    {
        $this->periods->delete($period);

        return $this->success(null, 'Period deleted successfully.');
    }
}
