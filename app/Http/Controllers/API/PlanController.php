<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use Illuminate\Http\Request;

class PlanController extends Controller
{
    /**
     * Display a listing of plans
     */
    public function index()
    {
        $plans = Plan::with('program')->get();

        return response()->json([
            'data' => $plans
        ]);
    }

    /**
     * Store a newly created plan
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'program_id' => 'required|exists:programs,program_id',
            'name' => 'required|string|max:255',
            'duration_days' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
            'is_promo' => 'required|boolean',
            'promo_start_date' => 'nullable|date|required_if:is_promo,1',
            'promo_end_date' => 'nullable|date|after:promo_start_date|required_if:is_promo,1',
            'max_slots' => 'nullable|integer|min:1',
            'is_active' => 'required|boolean',
        ]);

        // If not promo, clear promo fields
        if (!$validated['is_promo']) {
            $validated['promo_start_date'] = null;
            $validated['promo_end_date'] = null;
            $validated['max_slots'] = null;
        }

        $plan = Plan::create($validated);

        return response()->json([
            'message' => 'Plan created successfully.',
            'data' => $plan->load('program')
        ], 201);
    }

    /**
     * Display a specific plan
     */
    public function show($id)
    {
        $plan = Plan::with('program')->findOrFail($id);

        return response()->json($plan);
    }

    /**
     * Update a plan
     */
    public function update(Request $request, $id)
    {
        $plan = Plan::findOrFail($id);

        $validated = $request->validate([
            'program_id' => 'required|exists:programs,program_id',
            'name' => 'required|string|max:255',
            'duration_days' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
            'is_promo' => 'required|boolean',
            'promo_start_date' => 'nullable|date|required_if:is_promo,1',
            'promo_end_date' => 'nullable|date|after:promo_start_date|required_if:is_promo,1',
            'max_slots' => 'nullable|integer|min:1',
            'is_active' => 'required|boolean',
        ]);

        if (!$validated['is_promo']) {
            $validated['promo_start_date'] = null;
            $validated['promo_end_date'] = null;
            $validated['max_slots'] = null;
        }

        $plan->update($validated);

        return response()->json([
            'message' => 'Plan updated successfully.',
            'data' => $plan->load('program')
        ]);
    }

    /**
     * Delete a plan
     */
    public function destroy($id)
    {
        $plan = Plan::findOrFail($id);
        $plan->delete();

        return response()->json([
            'message' => 'Plan deleted successfully.'
        ]);
    }
}