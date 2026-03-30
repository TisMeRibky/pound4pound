<p>Hi {{ $subscription->member->first_name }},</p>

<p>
  Your <strong>{{ $subscription->plan->name }}</strong> training subscription will expire on
  <strong>{{ $subscription->end_date->format('F j, Y') }}</strong>.
</p>

<p>Please renew soon to keep your training going!</p>

<p>— Pound For Pound Team</p>