<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class WalkIn extends Model
{
    use HasFactory;

    protected $fillable = [
        'member_id',
        'guest_name',
        'has_membership',
        'amount',
        'date',
        'notes',
    ];

    protected $casts = [
        'date' => 'date',
        'has_membership' => 'boolean',
        'amount' => 'float',
    ];

    public function member()
    {
        return $this->belongsTo(Member::class);
    }
}
