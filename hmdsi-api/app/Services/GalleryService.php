<?php

namespace App\Services;

use App\Models\GalleryEvent;
use App\Models\GalleryItem;
use App\Repositories\GalleryEventRepository;
use Illuminate\Pagination\LengthAwarePaginator;

class GalleryService
{
    public function __construct(private GalleryEventRepository $events)
    {
    }

    public function paginatePublished(array $filters, int $perPage = 12): LengthAwarePaginator
    {
        return $this->events->paginate(
            $this->events->publishedQuery($filters),
            $perPage
        );
    }

    public function findPublishedBySlug(string $slug): GalleryEvent
    {
        $event = $this->events->findPublishedBySlug($slug);

        abort_unless($event, 404, 'Gallery event not found.');

        return $event;
    }

    public function createEvent(array $data): GalleryEvent
    {
        return $this->events->create($data);
    }

    public function updateEvent(GalleryEvent $event, array $data): GalleryEvent
    {
        return $this->events->update($event, $data);
    }

    public function deleteEvent(GalleryEvent $event): bool
    {
        return $this->events->delete($event);
    }

    public function addItem(GalleryEvent $event, array $data): GalleryItem
    {
        return $event->items()->create($data);
    }

    public function deleteItem(GalleryItem $item): bool
    {
        return (bool) $item->delete();
    }
}
