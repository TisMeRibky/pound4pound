<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class PaymentController extends Controller
{
    public function index()
    {
        $payments = Payment::with('member')
            ->orderBy('payment_date', 'desc')
            ->get()
            ->map(fn($p) => $this->format($p));

        return response()->json(['data' => $payments]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'member_id'      => 'required|exists:members,id',
            'amount'         => 'required|numeric|min:0',
            'payment_date'   => 'required|date',
            'payment_method' => 'required|in:GCash,Bank Transfer,Cash',
            'payment_type'   => 'required|in:annual_membership,walk_in,training_subscription',
            'notes'          => 'nullable|string|max:500',
            'proof'          => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120',
        ]);

        $payment = new Payment();
        $payment->member_id      = $request->member_id;
        $payment->amount         = $request->amount;
        $payment->payment_date   = $request->payment_date;
        $payment->payment_method = $request->payment_method;
        $payment->payment_type   = $request->payment_type;
        $payment->notes          = $request->notes;

        if ($request->hasFile('proof')) {
            $file     = $request->file('proof');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('proof'), $filename);
            $payment->proof = $filename;
        }

        $payment->save();

        return response()->json([
            'message' => 'Payment added successfully',
            'data'    => $this->format($payment->load('member')),
        ], 201);
    }

    public function show(Payment $payment)
    {
        return response()->json($this->format($payment->load('member')));
    }

    public function update(Request $request, Payment $payment)
    {
        $request->validate([
            'amount'         => 'required|numeric|min:0',
            'payment_date'   => 'required|date',
            'payment_method' => 'nullable|in:GCash,Bank Transfer,Cash',
            'payment_type'   => 'required|in:annual_membership,walk_in,training_subscription',
            'notes'          => 'nullable|string|max:500',
            'proof'          => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120',
        ]);

        $payment->amount         = $request->amount;
        $payment->payment_date   = $request->payment_date;
        $payment->payment_method = $request->payment_method;
        $payment->payment_type   = $request->payment_type;
        $payment->notes          = $request->notes;

        if ($request->hasFile('proof')) {
            if ($payment->proof) {
                $oldPath = public_path('proof/' . $payment->proof);
                if (File::exists($oldPath)) File::delete($oldPath);
            }
            $file     = $request->file('proof');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('proof'), $filename);
            $payment->proof = $filename;
        }

        $payment->save();

        return response()->json([
            'message' => 'Payment updated successfully',
            'data'    => $this->format($payment->load('member')),
        ]);
    }

    public function destroy(Payment $payment)
    {
        if ($payment->proof) {
            $path = public_path('proof/' . $payment->proof);
            if (File::exists($path)) File::delete($path);
        }
        $payment->delete();
        return response()->json(null, 204);
    }

    private function format(Payment $p): array
    {
        return [
            'id'             => $p->id,
            'member_id'      => $p->member?->id,
            'member_name'    => $p->member
                                    ? $p->member->first_name . ' ' . $p->member->last_name
                                    : 'Guest',
            'amount'         => $p->amount,
            'payment_date'   => $p->payment_date?->format('Y-m-d'),
            'payment_method' => $p->payment_method,
            'payment_type'   => $p->payment_type,
            'notes'          => $p->notes,
            'proof'          => $p->proof,
            'created_at'     => $p->created_at?->format('Y-m-d'),
        ];
    }
}