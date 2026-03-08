<?php

namespace App\Mail;

use App\Models\TrainingSubscription;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class TrainingSubExpiringSoon extends Mailable
{
    public function __construct(public TrainingSubscription $subscription) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Your Training Subscription is Expiring Soon');
    }

    public function content(): Content
    {
        return new Content(view: 'emails.training-sub-expiring');
    }
}