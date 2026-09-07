<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\About\UpdateAboutContentRequest;
use App\Http\Resources\AboutContentResource;
use App\Models\AboutContent;
use App\Services\AboutContentService;
use Illuminate\Http\JsonResponse;

class AboutController extends Controller
{
    public function __construct(private AboutContentService $about)
    {
    }

    public function show(): JsonResponse
    {
        $content = $this->about->active();

        if (! $content) {
            return $this->error('About content is not available.', 404);
        }

        return $this->success(new AboutContentResource($content));
    }

    public function update(UpdateAboutContentRequest $request, AboutContent $aboutContent): JsonResponse
    {
        return $this->success(new AboutContentResource($this->about->update($aboutContent, $request->validated())));
    }

    public function updateActive(UpdateAboutContentRequest $request): JsonResponse
    {
        $content = $this->about->active();

        if (! $content) {
            return $this->error('No active about content found.', 404);
        }

        return $this->success(new AboutContentResource($this->about->update($content, $request->validated())));
    }
}
