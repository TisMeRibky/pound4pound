<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Member;
use App\Models\Membership;
use App\Models\Payment;
use App\Models\Plan;
use App\Models\TrainingSubscription;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();
        $endOfMonth   = $now->copy()->endOfMonth();
        $expiryWindow = $now->copy()->addDays(10);
        $startOfYear  = $now->copy()->startOfYear();

        // ── 1. Member counts ────────────────────────────────────────────────
        $totalActive = Member::where('status', 'Active')->count();

        $annualMembers = Membership::where('type', 'annual')
            ->whereHas('member', fn($q) => $q->where('status', 'Active'))
            ->count();

        $walkInMembers = Membership::where('type', 'walk-in')
            ->whereHas('member', fn($q) => $q->where('status', 'Active'))
            ->count();

        // ── 2. New members this month ───────────────────────────────────────
        $newMembersThisMonth = Member::whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->count();

        // ── 3. Revenue ──────────────────────────────────────────────────────
        $monthlyRevenue = Payment::whereBetween('payment_date', [$startOfMonth, $endOfMonth])
            ->sum('amount');

        $annualRevenue = Payment::whereBetween('payment_date', [$startOfYear, $now])
            ->sum('amount');

        // Revenue by month for current year (Jan–Dec)
        $revenueByMonth = Payment::selectRaw('MONTH(payment_date) as month, SUM(amount) as total')
            ->whereYear('payment_date', $now->year)
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->keyBy('month');

        $months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        $revenueChart = collect(range(1, 12))->map(fn($m) => [
            'name'  => $months[$m - 1],
            'value' => isset($revenueByMonth[$m]) ? (float) $revenueByMonth[$m]->total : 0,
        ])->values();

        // ── 4. Expiring memberships (within 10 days, not already expired) ──
        $expiringMemberships = Membership::with('member')
            ->whereNotNull('end_date')
            ->whereBetween('end_date', [$now->toDateString(), $expiryWindow->toDateString()])
            ->get()
            ->map(fn($m) => [
                'member_name' => $m->member ? $m->member->first_name . ' ' . $m->member->last_name : 'Unknown',
                'type'        => $m->type,
                'end_date'    => $m->end_date?->format('Y-m-d'),
                'days_left'   => $now->diffInDays($m->end_date, false),
            ]);

        // ── 5. Expiring training subscriptions (within 10 days) ─────────────
        $expiringSubscriptions = TrainingSubscription::with(['member', 'plan'])
            ->where('status', 'active')
            ->whereBetween('end_date', [$now->toDateString(), $expiryWindow->toDateString()])
            ->get()
            ->map(fn($s) => [
                'member_name' => $s->member ? $s->member->first_name . ' ' . $s->member->last_name : 'Unknown',
                'plan_name'   => $s->plan?->name ?? 'Unknown Plan',
                'end_date'    => $s->end_date?->format('Y-m-d'),
                'days_left'   => $now->diffInDays($s->end_date, false),
            ]);

        // ── 6. Recent payments (last 5) ─────────────────────────────────────
        $recentPayments = Payment::with('member')
            ->orderBy('payment_date', 'desc')
            ->limit(5)
            ->get()
            ->map(fn($p) => [
                'member_name'    => $p->member ? $p->member->first_name . ' ' . $p->member->last_name : 'Deleted Member',
                'amount'         => (float) $p->amount,
                'payment_date'   => $p->payment_date?->format('Y-m-d'),
                'payment_method' => $p->payment_method,
            ]);

        // ── 7. Promo plan slots ──────────────────────────────────────────────
        $promoPlans = Plan::with('trainingSubscriptions')
            ->where('is_promo', true)
            ->where('is_active', true)
            ->whereNotNull('max_slots')
            ->get()
            ->map(fn($p) => [
                'name'       => $p->name,
                'max_slots'  => $p->max_slots,
                'used_slots' => $p->trainingSubscriptions->count(),
                'slots_left' => max(0, $p->max_slots - $p->trainingSubscriptions->count()),
            ]);

        return response()->json([
            'data' => [
                'members' => [
                    'total_active'         => $totalActive,
                    'annual'               => $annualMembers,
                    'walk_in'              => $walkInMembers,
                    'new_this_month'       => $newMembersThisMonth,
                ],
                'revenue' => [
                    'monthly_total'        => (float) $monthlyRevenue,
                    'annual_total'         => (float) $annualRevenue,
                    'chart'                => $revenueChart,
                ],
                'expiring_memberships'     => $expiringMemberships,
                'expiring_subscriptions'   => $expiringSubscriptions,
                'recent_payments'          => $recentPayments,
                'promo_plans'              => $promoPlans,
            ]
        ]);
    }
}