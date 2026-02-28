<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Membership;
use Illuminate\Http\Request;
use Carbon\Carbon;

class MembershipController extends Controller
{
    public function index()
    {
        $memberships = Membership::with('member') // eager load related member
            ->get()
            ->map(function ($membership) {
                return [
                    'id' => $membership->id,
                    'member_id' => $membership->member->id,
                    'member_name' => $membership->member->first_name . ' ' . $membership->member->last_name,
                    'type' => $membership->type,
                    'status' => $membership->member->status,
                    'start_date' => $membership->start_date?->format('Y-m-d'),
                    'end_date' => $membership->end_date?->format('Y-m-d'),
                    'created_at' => $membership->created_at->format('Y-m-d'),
                ];
            });

        return response()->json(['data' => $memberships]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'member_id' => 'required|exists:members,id',
            'type' => 'required|in:annual,walk-in',
            'start_date' => 'required|date',
        ]);

        $endDate = null;

        if ($validated['type'] === 'annual') {
            $endDate = Carbon::parse($validated['start_date'])->addYear()->format('Y-m-d');
        }

        Membership::create([
            'member_id' => $validated['member_id'],
            'type' => $validated['type'],
            'start_date' => $validated['start_date'],
            'end_date' => $endDate,
        ]);

        return response()->json(['message' => 'Membership created']);
    }
}