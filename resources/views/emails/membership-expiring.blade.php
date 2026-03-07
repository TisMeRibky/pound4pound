
<p>Hi {{ $membership->member->first_name }},</p>

<p>
  Your <strong>{{ ucfirst($membership->type) }}</strong> membership will expire on
  <strong>{{ $membership->end_date->format('F j, Y') }}</strong>.
</p>

<p>Please renew soon to avoid any interruption.</p>

<p>— Your Gym Team</p>