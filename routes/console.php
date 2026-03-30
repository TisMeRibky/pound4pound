<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');




use Illuminate\Support\Facades\Schedule;

//Membership Expiry Reminder Command **IMPORTANT** RUN THIS IN LIVE SERVERS - * * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1" BUT FOR NOW RUN "php artisan schedule:work" in terminal to test it out

Schedule::command('memberships:send-expiry-reminders')->dailyAt('08:00');

//Training Subscription Expiry Reminder Command
Schedule::command('training-subs:send-expiry-reminders')->dailyAt('08:00');
