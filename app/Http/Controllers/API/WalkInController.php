<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\WalkIn;
use App\Models\Member;
use App\Models\Payment;
use Illuminate\Http\Request;

class WalkInController extends Controller
{
    const RATE_NO_MEMBERSHIP   = 200;
    const RATE_WITH_MEMBERSHIP = 150;

    public function index()
    {
        $walkIns = WalkIn::with('member')
            ->orderBy('date', 'desc')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn ($w) => $this->format($w));

        return response()->json(['data' => $walkIns]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'member_id'      => 'nullable|exists:members,id',
            'guest_name'     => 'nullable|string|max:255',
            'has_membership' => 'required|boolean',
            'date'           => 'required|date',
            'notes'          => 'nullable|string|max:500',
        ]);

        $hasMembership = (bool) $validated['has_membership'];

        if ($hasMembership && empty($validated['member_id'])) {
            return response()->json(['message' => 'A member must be selected when has_membership is true.'], 422);
        }

        if (!$hasMembership && empty($validated['guest_name'])) {
            return response()->json(['message' => 'A guest name is required for non-members.'], 422);
        }

        if ($hasMembership) {
            $member     = Member::findOrFail($validated['member_id']);
            $membership = $member->membership()->first();

            if (!$membership) {
                return response()->json(['message' => 'This member does not have an active membership. The non-member rate applies.'], 422);
            }

            if ($membership->type === 'annual' && $membership->end_date && $membership->end_date->lt(now())) {
                return response()->json(['message' => 'This member\'s annual membership has expired. The non-member rate applies.'], 422);
            }
        }

        $amount = $hasMembership ? self::RATE_WITH_MEMBERSHIP : self::RATE_NO_MEMBERSHIP;

        $walkIn = WalkIn::create([
            'member_id'      => $hasMembership ? $validated['member_id'] : null,
            'guest_name'     => !$hasMembership ? $validated['guest_name'] : null,
            'has_membership' => $hasMembership,
            'amount'         => $amount,
            'date'           => $validated['date'],
            'notes'          => $validated['notes'] ?? null,
        ]);

        Payment::create([
            'member_id'      => $hasMembership ? $validated['member_id'] : null,
            'amount'         => $amount,
            'payment_date'   => $validated['date'],
            'payment_type'   => 'walk_in',
            'payment_method' => null,
            'proof'          => null,
        ]);

        return response()->json([
            'message' => 'Walk-in logged successfully.',
            'data'    => $this->format($walkIn->load('member')),
        ], 201);
    }

    public function show(WalkIn $walkIn)
    {
        return response()->json(['data' => $this->format($walkIn->load('member'))]);
    }

    public function update(Request $request, WalkIn $walkIn)
    {
        $validated = $request->validate([
            'date'   => 'required|date',
            'amount' => 'required|numeric|min:0',
            'notes'  => 'nullable|string|max:500',
        ]);

        $walkIn->update($validated);

        return response()->json([
            'message' => 'Walk-in updated successfully.',
            'data'    => $this->format($walkIn),
        ]);
    }

    public function destroy(WalkIn $walkIn)
    {
        
        $walkIn->delete();
        return response()->json(null, 204);
    }

    private function format(WalkIn $w): array
    {
        return [
            'id'             => $w->id,
            'member_id'      => $w->member_id,
            'member_name'    => $w->member
                                    ? $w->member->first_name . ' ' . $w->member->last_name
                                    : ($w->guest_name ?? 'Guest'),
            'has_membership' => $w->has_membership,
            'amount'         => $w->amount,
            'date'           => $w->date?->format('Y-m-d'),
            'notes'          => $w->notes,
            'created_at'     => $w->created_at?->format('Y-m-d'),
        ];
    }
}