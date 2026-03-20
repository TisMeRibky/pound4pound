<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Membership;
use App\Models\Payment;
use Illuminate\Http\Request;
use Carbon\Carbon;

class MembershipController extends Controller
{
    public function index()
    {
        $memberships = Membership::with('member')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($membership) {
                return [
                    'id'         => $membership->id,
                    'member_id'  => $membership->member->id,
                    'member_name'=> $membership->member->first_name . ' ' . $membership->member->last_name,
                    'type'       => $membership->type,
                    'status'     => $membership->member->status,
                    'start_date' => $membership->start_date?->format('Y-m-d'),
                    'end_date'   => $membership->end_date?->format('Y-m-d'),
                    'created_at' => $membership->created_at->format('Y-m-d'),
                ];
            });

        return response()->json(['data' => $memberships]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'member_id'  => 'required|exists:members,id',
            'start_date' => 'required|date',
        ]);

        $endDate = Carbon::parse($validated['start_date'])->addYear()->format('Y-m-d');

        Membership::create([
            'member_id'  => $validated['member_id'],
            'type'       => 'annual',
            'start_date' => $validated['start_date'],
            'end_date'   => $endDate,
        ]);

        Payment::create([
            'member_id'      => $validated['member_id'],
            'amount'         => 500,
            'payment_date'   => $validated['start_date'],
            'payment_type'   => 'annual_membership',
            'payment_method' => null,
            'proof'          => null,
        ]);

        return response()->json(['message' => 'Membership created successfully!']);
    }
}