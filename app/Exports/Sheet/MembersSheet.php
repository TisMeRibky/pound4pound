<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithTitle;

class MembersSheet implements FromArray, WithTitle
{
    protected $members;

    public function __construct($members)
    {
        $this->members = $members;
    }

    public function array(): array
    {
        $rows = [
            ['ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Status']
        ];

        foreach ($this->members as $m) {
            $rows[] = [
                $m->id,
                $m->first_name,
                $m->last_name,
                $m->email,
                $m->phone,
                $m->status,
            ];
        }

        return $rows;
    }

    public function title(): string
    {
        return 'Members';
    }
}