<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Gallery\StoreGalleryEventRequest;
use App\Http\Requests\Gallery\StoreGalleryItemRequest;
use App\Http\Resources\GalleryEventResource;
use App\Http\Resources\GalleryItemResource;
use App\Models\GalleryEvent;
use App\Models\GalleryItem;
use App\Services\GalleryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GalleryController extends Controller
{
    public function __construct(private GalleryService $gallery)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $paginator = $this->gallery->paginatePublished(
            $request->only(['period_id']),
            $request->integer('per_page', 12)
        );

        return $this->paginated($paginator, 'OK', GalleryEventResource::class);
    }

    public function adminIndex(Request $request): JsonResponse
    {
        $paginator = $this->gallery->adminPaginate(
            $request->only(['period_id', 'search']),
            $request->integer('per_page', 20)
        );

        return $this->paginated($paginator, 'OK', GalleryEventResource::class);
    }

    public function show(string $slug): JsonResponse
    {
        return $this->success(new GalleryEventResource($this->gallery->findPublishedBySlug($slug)));
    }

    public function store(StoreGalleryEventRequest $request): JsonResponse
    {
        return $this->created(new GalleryEventResource($this->gallery->createEvent($request->validated())));
    }

    public function update(StoreGalleryEventRequest $request, GalleryEvent $galleryEvent): JsonResponse
    {
        return $this->success(new GalleryEventResource($this->gallery->updateEvent($galleryEvent, $request->validated())));
    }

    public function destroy(GalleryEvent $galleryEvent): JsonResponse
    {
        $this->gallery->deleteEvent($galleryEvent);

        return $this->success(null, 'Gallery event deleted.');
    }

    public function storeItem(StoreGalleryItemRequest $request, GalleryEvent $galleryEvent): JsonResponse
    {
        $item = $this->gallery->addItem($galleryEvent, $request->validated(), $request->file('file'));

        return $this->created(new GalleryItemResource($item));
    }

    public function destroyItem(GalleryItem $galleryItem): JsonResponse
    {
        $this->gallery->deleteItem($galleryItem);

        return $this->success(null, 'Gallery item deleted.');
    }
}
