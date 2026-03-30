<?php

namespace App\Console\Commands;

use App\Mail\MembershipExpiringSoon;
use App\Models\Membership;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class SendMembershipExpiryReminders extends Command
{
    protected $signature   = 'memberships:send-expiry-reminders';
    protected $description = 'Send reminders to members whose membership expires in 10 days';

    public function handle()
    {
        $targetDate = Carbon::today()->addDays(10)->toDateString();

        $memberships = Membership::with('member')
            ->whereDate('end_date', $targetDate)
            ->get();

        foreach ($memberships as $membership) {
            Mail::to($membership->member->email)
                ->send(new MembershipExpiringSoon($membership));
        }

        $this->info("Sent {$memberships->count()} reminder(s).");
    }
}