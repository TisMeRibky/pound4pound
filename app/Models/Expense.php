<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    use HasFactory;

    protected $fillable = [
        'description',
        'exp_date',
        'exp_type',
        'exp_amount',
    ];

    protected $casts = [
        'exp_date'   => 'date',
        'exp_amount' => 'float',
    ];
}