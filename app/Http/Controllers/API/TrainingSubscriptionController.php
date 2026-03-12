<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\TrainingSubscription;
use App\Models\Member;
use App\Models\Plan;
use App\Models\Payment;
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
            'plan_id'   => 'required|exists:plans,id',
        ]);

        $member = Member::findOrFail($validated['member_id']);
        $plan = Plan::findOrFail($validated['plan_id']);

        // Fixed membership check — same pattern as WalkInController
        $membership = $member->membership()->first();

        if (!$membership) {
            return response()->json([
                'message' => 'Member does not have an active membership.'
            ], 400);
        }

        // Only check expiry for annual memberships
        if ($membership->type === 'annual' && $membership->end_date && $membership->end_date->lt(now())) {
            return response()->json([
                'message' => 'Member\'s annual membership has expired.'
            ], 400);
        }

        if (!$plan->is_active) {
            return response()->json([
                'message' => 'Selected plan is not active.'
            ], 400);
        }

        if ($plan->is_promo && $plan->max_slots !== null) {
            $currentCount = TrainingSubscription::where('plan_id', $plan->id)->count();

            if ($currentCount >= $plan->max_slots) {
                return response()->json([
                    'message' => 'This plan has reached its maximum number of slots.'
                ], 422);
            }
        }

        $existingSubscription = TrainingSubscription::where('member_id', $member->id)
            ->where('plan_id', $plan->id)
            ->first();

        if ($existingSubscription) {
            return response()->json([
                'message' => 'Member is already subscribed to this plan.'
            ], 400);
        }

        $startDate = now();
        $endDate = now()->addDays($plan->duration_days);

        $subscription = TrainingSubscription::create([
            'member_id'  => $member->id,
            'plan_id'    => $plan->id,
            'start_date' => $startDate,
            'end_date'   => $endDate,
            'status'     => 'active',
        ]);

        // Auto-create payment record for the training subscription fee
        Payment::create([
            'member_id'      => $member->id,
            'amount'         => $plan->price,
            'payment_date'   => $startDate->format('Y-m-d'),
            'payment_method' => 'training-subscription',
            'proof'          => null,
        ]);

        return response()->json([
            'message' => 'Training subscription created successfully.',
            'data' => $subscription->load('member', 'plan')
        ], 201);
    }
}