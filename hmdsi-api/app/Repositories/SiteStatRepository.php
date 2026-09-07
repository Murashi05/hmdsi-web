<?php

namespace App\Repositories;

use App\Models\SiteStat;
use Illuminate\Database\Eloquent\Collection;

class SiteStatRepository extends BaseRepository
{
    public function __construct(SiteStat $model)
    {
        parent::__construct($model);
    }

    public function allOrdered(): Collection
    {
        return $this->query()->ordered()->get();
    }
}
