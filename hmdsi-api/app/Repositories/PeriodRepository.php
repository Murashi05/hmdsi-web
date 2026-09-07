<?php

namespace App\Repositories;

use App\Models\Period;

class PeriodRepository extends BaseRepository
{
    public function __construct(Period $model)
    {
        parent::__construct($model);
    }

    public function allOrdered()
    {
        return $this->query()->orderByDesc('start_date')->get();
    }

    public function findActive(): ?Period
    {
        return $this->query()->active()->first();
    }
}
