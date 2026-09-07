<?php

namespace App\Repositories;

use App\Models\AboutContent;

class AboutContentRepository extends BaseRepository
{
    public function __construct(AboutContent $model)
    {
        parent::__construct($model);
    }

    public function findActive(): ?AboutContent
    {
        return $this->query()->active()->with('period')->first();
    }
}
