<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Member;
use App\Models\Payment;
use App\Exports\GymReportExport;
use Maatwebsite\Excel\Facades\Excel;
use Carbon\Carbon;

use Illuminate\Http\Request;

class MemberController extends Controller
{
    public function index()
    {
        return response()->json(['data' => Member::all()]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string',
            'last_name'  => 'required|string',
            'email'      => 'required|email|unique:members,email',
            'phone'      => 'nullable|string',
            'status'     => 'required|string',
        ]);

        $member = Member::create($validated);

        return response()->json(['data' => $member], 201);
    }

    public function show(Member $member)
    {
        $member->load([
            'membership',
            'trainingSubscriptions.plan.program'
        ]);

        return response()->json([
            'id' => $member->id,
            'first_name' => $member->first_name,
            'last_name' => $member->last_name,
            'email' => $member->email,
            'phone' => $member->phone,
            'status' => $member->status,
            'membership' => $member->membership ? [
                'type' => $member->membership->type,
                'start_date' => $member->membership->start_date,
                'end_date' => $member->membership->end_date,
            ] : null,
            'training_subscriptions' => $member->trainingSubscriptions->map(function($sub) {
                return [
                    'id' => $sub->id,
                    'status' => $sub->status,
                    'start_date' => $sub->start_date,
                    'end_date' => $sub->end_date,
                    'plan' => $sub->plan ? [
                        'id' => $sub->plan->id,
                        'name' => $sub->plan->name,
                        'duration_days' => $sub->plan->duration_days,
                        'price' => $sub->plan->price,
                        'program' => $sub->plan->program ? [
                            'id' => $sub->plan->program->id,
                            'name' => $sub->plan->program->name,
                        ] : null,
                    ] : null,
                ];
            }),
        ]);

        return response()->json(['message' => 'Member created']);
    }

    public function update(Request $request, Member $member)
    {
        $member->update($request->all());
        return response()->json($member);
    }

    public function destroy(Member $member)
    {
        $member->delete();
        return response()->json(null, 204);
    }

    //MEMBERSHIPS

    public function withoutMembership(Request $request)
    {
        $members = Member::where('status', 'Active')
            ->whereDoesntHave('membership')
            ->get(['id', 'first_name', 'last_name', 'status']);

        \Log::info('Members without membership:', $members->toArray()); // <-- logs to storage/logs/laravel.log

        return response()->json(['data' => $members]);
    }

    public function withMembership()
    {
        $members = Member::where('status', 'Active')
            ->whereHas('membership')
            ->get(['id', 'first_name', 'last_name']);

        return response()->json([
            'data' => $members
        ]);
    }


    public function exportReport()
    {
        // MEMBER DATA
        $members = Member::all();

        // DASHBOARD DATA (simplified example)
        $now = Carbon::now();

        $monthlyRevenue = Payment::whereMonth('payment_date', $now->month)
            ->whereYear('payment_date', $now->year)
            ->sum('amount');

        $annualRevenue = Payment::whereYear('payment_date', $now->year)
            ->sum('amount');

        $dashboardStats = [
            'members' => [
                'total_active' => Member::where('status', 'active')->count(),
                'annual' => Member::where('type', 'annual')->count(),
                'walk_in' => Member::where('type', 'walk-in')->count(),
                'new_this_month' => Member::whereMonth('created_at', $now->month)->count(),
            ],
            'revenue' => [
                'monthly_total' => $monthlyRevenue,
                'annual_total' => $annualRevenue,
            ]
        ];

        return Excel::download(
            new GymReportExport($dashboardStats, $members),
            'gym_report.xlsx'
        );
    }
}