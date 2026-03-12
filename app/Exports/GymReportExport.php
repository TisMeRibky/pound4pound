<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class GymReportExport implements WithMultipleSheets
{
    protected $dashboardStats;
    protected $members;

    public function __construct($dashboardStats, $members)
    {
        $this->dashboardStats = $dashboardStats;
        $this->members = $members;
    }

    public function sheets(): array
    {
        return [
            new DashboardSheet($this->dashboardStats),
            new MembersSheet($this->members),
        ];
    }
}