<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Aspiration\RespondAspirationRequest;
use App\Http\Requests\Aspiration\StoreAspirationRequest;
use App\Http\Resources\AspirationResource;
use App\Http\Resources\AspirationResponseResource;
use App\Models\Aspiration;
use App\Services\AspirationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AspirationController extends Controller
{
    public function __construct(private AspirationService $aspirations)
    {
    }

    public function store(StoreAspirationRequest $request): JsonResponse
    {
        $aspiration = $this->aspirations->submit($request->validated());

        return $this->created(new AspirationResource($aspiration), 'Aspiration submitted. Keep your tracking code.');
    }

    public function track(string $code): JsonResponse
    {
        return $this->success(new AspirationResource($this->aspirations->track($code)));
    }

    public function stats(): JsonResponse
    {
        return $this->success($this->aspirations->stats());
    }

    public function index(Request $request): JsonResponse
    {
        $paginator = $this->aspirations->publicPaginate(
            $request->only(['category', 'status']),
            $request->integer('per_page', 10)
        );

        return $this->paginated($paginator, 'OK', AspirationResource::class);
    }

    public function adminIndex(Request $request): JsonResponse
    {
        $paginator = $this->aspirations->adminPaginate(
            $request->only(['category', 'status']),
            $request->integer('per_page', 15)
        );

        return $this->paginated($paginator, 'OK', AspirationResource::class);
    }

    public function respond(RespondAspirationRequest $request, Aspiration $aspiration): JsonResponse
    {
        if ($request->filled('status')) {
            $this->aspirations->updateStatus($aspiration, $request->validated('status'));
        }

        $response = $this->aspirations->respond(
            $aspiration,
            $request->user(),
            $request->validated('message'),
            $request->boolean('is_public', true),
        );

        return $this->created(new AspirationResponseResource($response->load('respondedBy')));
    }
}
