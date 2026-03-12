<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithTitle;

class DashboardSheet implements FromArray, WithTitle
{
    protected $stats;

    public function __construct($stats)
    {
        $this->stats = $stats;
    }

    public function array(): array
    {
        return [
            ['Metric', 'Value'],
            ['Active Members', $this->stats['members']['total_active'] ?? 0],
            ['Annual Members', $this->stats['members']['annual'] ?? 0],
            ['Walk-in Members', $this->stats['members']['walk_in'] ?? 0],
            ['New Members This Month', $this->stats['members']['new_this_month'] ?? 0],
            [],
            ['Monthly Revenue', $this->stats['revenue']['monthly_total'] ?? 0],
            ['Annual Revenue', $this->stats['revenue']['annual_total'] ?? 0],
        ];
    }

    public function title(): string
    {
        return 'Dashboard';
    }
}