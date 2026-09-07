<?php

namespace App\Services;

use App\Models\SiteStat;
use App\Repositories\SiteStatRepository;
use Illuminate\Database\Eloquent\Collection;

class SiteStatService
{
    public function __construct(private SiteStatRepository $stats)
    {
    }

    public function list(): Collection
    {
        return $this->stats->allOrdered();
    }

    public function upsert(string $key, array $data): SiteStat
    {
        return SiteStat::updateOrCreate(['key' => $key], $data);
    }
}
