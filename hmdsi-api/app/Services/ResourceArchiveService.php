<?php

namespace App\Services;

use App\Models\Resource as ArchiveResource;
use App\Repositories\ResourceArchiveRepository;
use Illuminate\Pagination\LengthAwarePaginator;

class ResourceArchiveService
{
    public function __construct(private ResourceArchiveRepository $resources)
    {
    }

    public function paginatePublished(array $filters, int $perPage = 12): LengthAwarePaginator
    {
        return $this->resources->paginate(
            $this->resources->publishedQuery($filters),
            $perPage
        );
    }

    public function findPublished(int $id): ArchiveResource
    {
        /** @var ArchiveResource $resource */
        $resource = $this->resources->findOrFail($id);

        abort_unless($resource->is_published, 404, 'Resource not found.');

        return $resource;
    }

    public function recordDownload(ArchiveResource $resource): ArchiveResource
    {
        $resource->incrementDownloadCount();

        return $resource->fresh();
    }

    public function create(array $data): ArchiveResource
    {
        return $this->resources->create($data);
    }

    public function update(ArchiveResource $resource, array $data): ArchiveResource
    {
        return $this->resources->update($resource, $data);
    }

    public function delete(ArchiveResource $resource): bool
    {
        return $this->resources->delete($resource);
    }
}
