<?php

namespace App\Console\Commands;

use App\Mail\TrainingSubExpiringSoon;
use App\Models\TrainingSubscription;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class SendTrainingSubExpiryReminders extends Command
{
    protected $signature   = 'training-subs:send-expiry-reminders';
    protected $description = 'Send reminders to members whose training subscription expires in 10 days';

    public function handle()
    {
        $targetDate = Carbon::today()->addDays(10)->toDateString();

        $subscriptions = TrainingSubscription::with(['member', 'plan'])
            ->whereDate('end_date', $targetDate)
            ->where('status', 'active')
            ->get();

        foreach ($subscriptions as $subscription) {
            Mail::to($subscription->member->email)
                ->send(new TrainingSubExpiringSoon($subscription));
        }

        $this->info("Sent {$subscriptions->count()} reminder(s).");
    }
}
