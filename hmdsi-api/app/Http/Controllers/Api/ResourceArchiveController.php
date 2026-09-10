<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Archive\StoreArchiveResourceRequest;
use App\Http\Resources\ArchiveResourceResource;
use App\Models\Resource as ArchiveResource;
use App\Services\ResourceArchiveService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ResourceArchiveController extends Controller
{
    public function __construct(private ResourceArchiveService $resources)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $paginator = $this->resources->paginatePublished(
            $request->only(['category', 'academic_year', 'search']),
            $request->integer('per_page', 12)
        );

        return $this->paginated($paginator, 'OK', ArchiveResourceResource::class);
    }

    public function adminIndex(Request $request): JsonResponse
    {
        $paginator = $this->resources->adminPaginate(
            $request->only(['category', 'academic_year', 'search']),
            $request->integer('per_page', 20)
        );

        return $this->paginated($paginator, 'OK', ArchiveResourceResource::class);
    }

    public function download(int $id): JsonResponse
    {
        $resource = $this->resources->findPublished($id);
        $this->resources->recordDownload($resource);

        return $this->success([
            'file_url' => $resource->file_url,
            'download_count' => $resource->download_count + 1,
        ]);
    }

    public function store(StoreArchiveResourceRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['uploaded_by'] = $request->user()->id;

        return $this->created(new ArchiveResourceResource($this->resources->create($data)));
    }

    public function update(StoreArchiveResourceRequest $request, ArchiveResource $resource): JsonResponse
    {
        return $this->success(new ArchiveResourceResource($this->resources->update($resource, $request->validated())));
    }

    public function destroy(ArchiveResource $resource): JsonResponse
    {
        $this->resources->delete($resource);

        return $this->success(null, 'Resource deleted.');
    }
}
