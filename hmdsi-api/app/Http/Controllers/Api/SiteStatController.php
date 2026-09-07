<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SiteStatResource;
use App\Services\SiteStatService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SiteStatController extends Controller
{
    public function __construct(private SiteStatService $stats)
    {
    }

    public function index(): JsonResponse
    {
        return $this->success(SiteStatResource::collection($this->stats->list()));
    }

    public function upsert(Request $request): JsonResponse
    {
        $data = $request->validate([
            'key' => ['required', 'string', 'max:80'],
            'label' => ['required', 'string', 'max:120'],
            'value' => ['required', 'string', 'max:50'],
            'icon' => ['nullable', 'string', 'max:50'],
            'sort_order' => ['sometimes', 'integer'],
        ]);

        $stat = $this->stats->upsert($data['key'], $data);

        return $this->success(new SiteStatResource($stat));
    }

    public function batchUpsert(Request $request): JsonResponse
    {
        $items = $request->validate([
            'stats' => ['required', 'array', 'min:1'],
            'stats.*.key' => ['required', 'string', 'max:80'],
            'stats.*.value' => ['required', 'string', 'max:50'],
        ]);

        $updated = [];
        foreach ($items['stats'] as $item) {
            $stat = $this->stats->upsert($item['key'], ['value' => $item['value']]);
            $updated[] = new SiteStatResource($stat);
        }

        return $this->success($updated);
    }
}
