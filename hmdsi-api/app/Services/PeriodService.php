<?php

namespace App\Services;

use App\Models\Period;
use App\Repositories\PeriodRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class PeriodService
{
    public function __construct(private PeriodRepository $periods) {}

    public function list(): Collection { return $this->periods->allOrdered(); }
    public function active(): ?Period { return $this->periods->findActive(); }

    public function create(array $data): Period
    {
        return DB::transaction(function () use ($data) {
            $year = (int) date('Y', strtotime($data['start_date']));
            if (Period::query()->whereYear('start_date', $year)->exists()) {
                throw ValidationException::withMessages(['start_date' => "Periode tahun {$year} sudah ada. Pembuatan kabinet hanya dapat dilakukan satu kali per tahun."]);
            }
            $data['name'] = (string) $year;
            $period = $this->periods->create($data);
            if (!empty($data['is_active'])) $period->setAsActive();
            return $period->refresh();
        });
    }

    public function update(Period $period, array $data): Period
    {
        return DB::transaction(function () use ($period, $data) {
            if (isset($data['start_date'])) {
                $year = (int) date('Y', strtotime($data['start_date']));
                $currentYear = (int) date('Y', strtotime($period->start_date));
                if ($year !== $currentYear) {
                    throw ValidationException::withMessages(['start_date' => 'Tahun periode tidak dapat diubah. Buat kabinet baru untuk tahun berikutnya.']);
                }
                $data['name'] = (string) $year;
            }
            $period = $this->periods->update($period, $data);
            if (!empty($data['is_active'])) $period->setAsActive();
            return $period->refresh();
        });
    }

    public function delete(Period $period): void
    {
        if ($period->is_active) {
            throw ValidationException::withMessages(['period' => 'Periode aktif tidak dapat dihapus.']);
        }
        $this->periods->delete($period);
    }
}
