<?php

namespace App\Services;

use App\Models\Period;
use App\Repositories\PeriodRepository;
use Illuminate\Database\Eloquent\Collection;

class PeriodService
{
    public function __construct(private PeriodRepository $periods)
    {
    }

    public function list(): Collection
    {
        return $this->periods->allOrdered();
    }

    public function active(): ?Period
    {
        return $this->periods->findActive();
    }

    public function create(array $data): Period
    {
        /** @var Period $period */
        $period = $this->periods->create($data);

        if (! empty($data['is_active'])) {
            $period->setAsActive();
        }

        return $period;
    }

    public function update(Period $period, array $data): Period
    {
        $period = $this->periods->update($period, $data);

        if (! empty($data['is_active'])) {
            $period->setAsActive();
        }

        return $period;
    }

    public function delete(Period $period): void
    {
        $this->periods->delete($period);
    }
}
