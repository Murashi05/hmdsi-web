<?php

namespace App\Repositories;

use App\Models\Aspiration;
use Illuminate\Database\Eloquent\Builder;

class AspirationRepository extends BaseRepository
{
    public function __construct(Aspiration $model)
    {
        parent::__construct($model);
    }

    public function findByTrackingCode(string $code): ?Aspiration
    {
        return $this->query()
            ->with(['publicResponses.respondedBy'])
            ->where('tracking_code', strtoupper($code))
            ->first();
    }

    public function publicQuery(array $filters): Builder
    {
        return $this->query()
            ->public()
            ->when($filters['category'] ?? null, fn ($q, $c) => $q->byCategory($c))
            ->when($filters['status'] ?? null, fn ($q, $s) => $q->byStatus($s))
            ->latest();
    }

    public function statusCounts(): array
    {
        return $this->query()
            ->selectRaw('status, COUNT(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status')
            ->toArray();
    }
}
