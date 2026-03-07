<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class TrainingSubscriptionController extends Controller
{
    public function index()
    {
        $subscriptions = TrainingSubscription::with(['member', 'plan.program'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($sub) {
                return [
                    'id' => $sub->id,
                    'member' => $sub->member ? [
                        'first_name' => $sub->member->first_name,
                        'last_name' => $sub->member->last_name,
                    ] : null,
                    'plan' => $sub->plan ? [
                        'name' => $sub->plan->name,
                        'price' => $sub->plan->price,
                    ] : null,
                    'start_date' => $sub->start_date?->format('Y-m-d') ?? null,
                    'end_date' => $sub->end_date?->format('Y-m-d') ?? null,
                    'status' => $sub->status ?? 'active',
                ];
            });

        return response()->json([
            'data' => $subscriptions
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'member_id' => 'required|exists:members,id',
            'plan_id' => 'required|exists:plans,id',
        ]);

        $member = Member::findOrFail($validated['member_id']);
        $plan = Plan::findOrFail($validated['plan_id']);

        // Check active membership
        if (!$member->membership || $member->membership->status !== 'active') {
            return response()->json([
                'message' => 'Member does not have an active membership.'
            ], 400);
        }

        if (!$plan->is_active) {
            return response()->json([
                'message' => 'Selected plan is not active.'
            ], 400);
        }

        $startDate = now();
        $endDate = now()->addDays($plan->duration_days);

        $subscription = TrainingSubscription::create([
            'member_id' => $member->id,
            'plan_id' => $plan->id,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'status' => 'active',
        ]);

        return response()->json([
            'message' => 'Training subscription created successfully.',
            'data' => $subscription->load('member', 'plan')
        ], 201);
    }
}
