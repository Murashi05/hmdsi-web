<?php

namespace App\Services;

use App\Models\GalleryEvent;
use App\Models\Period;
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

    public function adminPaginate(array $filters, int $perPage = 20): LengthAwarePaginator
    {
        return $this->events->paginate($this->events->adminQuery($filters), $perPage);
    }

    public function findPublishedBySlug(string $slug): GalleryEvent
    {
        $event = $this->events->findPublishedBySlug($slug);

        abort_unless($event, 404, 'Gallery event not found.');

        return $event;
    }

    public function createEvent(array $data): GalleryEvent
    {
        $data['period_id'] ??= Period::active()->value('id');
        return $this->events->create($data);
    }

    public function updateEvent(GalleryEvent $event, array $data): GalleryEvent
    {
        unset($data['period_id']);
        return $this->events->update($event, $data);
    }

    public function deleteEvent(GalleryEvent $event): bool
    {
        return $this->events->delete($event);
    }

    public function addItem(GalleryEvent $event, array $data, $file = null): GalleryItem
    {
        if ($file) {
            $path = $file->store('gallery/'.$event->period_id.'/'.$event->id, 'public');
            $data['file_url'] = asset('storage/'.$path);
            $data['type'] = $data['type'] ?? 'photo';
        }
        return $event->items()->create($data);
    }

    public function deleteItem(GalleryItem $item): bool
    {
        return (bool) $item->delete();
    }
}
