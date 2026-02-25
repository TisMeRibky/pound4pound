<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Membership extends Model
{

    protected $fillable = [
        'member_id',
        'type',
    ];

    const TYPE_ANNUAL = 'Annual';
    const TYPE_WALKIN = 'Walk-ins';

    public function member()
    {
        return $this->belongsTo(Member::class);
    }
}
