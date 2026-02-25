<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Membership;
use Illuminate\Http\Request;

class MembershipController extends Controller
{
    public function index()
    {
        $memberships = Membership::with('member') // eager load related member
            ->get()
            ->map(function ($membership) {
                return [
                    'id' => $membership->id,
                    'member_name' => $membership->member->first_name . ' ' . $membership->member->last_name,
                    'type' => $membership->type,
                    'status' => $membership->member->status,
                    'created_at' => $membership->created_at->format('Y-m-d'),
                ];
            });

        return response()->json(['data' => $memberships]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'member_id' => 'required|exists:members,id|unique:memberships,member_id',
            'type' => 'required|in:Annual,Walk-in',
        ]);

        $membership = Membership::create([
            'member_id' => $request->member_id,
            'type' => $request->type,
        ]);

        return response()->json([
            'message' => 'Membership created successfully!',
            'data' => $membership
        ]);
    }
}