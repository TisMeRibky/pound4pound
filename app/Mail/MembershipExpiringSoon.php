<?php

namespace App\Mail;

use App\Models\Membership;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class MembershipExpiringSoon extends Mailable
{
    public function __construct(public Membership $membership) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Your Membership is Expiring Soon');
    }

    public function content(): Content
    {
        return new Content(view: 'emails.membership-expiring');
    }
}