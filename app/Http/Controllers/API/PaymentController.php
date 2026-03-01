<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function index()
    {
        $payments = Payment::with('member')
        ->get()
        ->map(function ($payment) {
            return [
                'id' => $payment->id,
                'member_id' => $payment->member?->id,
                'member_name' => $payment->member->first_name . ' ' . $payment->member->last_name,
                'amount' => $payment->amount,
                'payment_date' => $payment->payment_date ? $payment->payment_date->format('Y-m-d') : null,
                'payment_method' => $payment->payment_method,
                'proof' => $payment->proof,
                'created_at' => $payment->created_at ? $payment->created_at->format('Y-m-d') : null,
            ];
        });

        return response()->json(['data' => $payments]);
    }

    public function store(Request $request)
    {
        // Validate everything EXCEPT the file
        $validated = $request->validate([
            'member_id' => 'required|exists:members,id',
            'amount' => 'required|numeric',
            'payment_date' => 'required|date',
        ]);

        $payment = new Payment();
        $payment->member_id = $validated['member_id'];
        $payment->amount = $validated['amount'];
        $payment->payment_date = $validated['payment_date'];

        // Handle the file separately
        if ($request->hasFile('proof')) {
            $file = $request->file('proof');

            $filename = time() . '_' . $file->getClientOriginalName();

            $file->move(public_path('payments'), $filename);

            $payment->proof = $filename;
        }   

        $payment->save();

        return response()->json([
            'message' => 'Payment added successfully',
            'data' => $payment->load('member')
        ], 201);
    }

    public function show(Payment $payment)
    {
        $payment->load('member');
        
        return response()->json([
            'id' => $payment->id,
            'member_id' => $payment->member?->id,
            'member_name' => $payment->member ? ($payment->member->first_name . ' ' . $payment->member->last_name) : 'Deleted Member',
            'amount' => $payment->amount,
            'payment_date' => $payment->payment_date ? $payment->payment_date->format('Y-m-d') : null,
            'payment_method' => $payment->payment_method,
            'proof' => $payment->proof,
            'created_at' => $payment->created_at ? $payment->created_at->format('Y-m-d') : null,
        ]);
    }

    public function destroy(Payment $payment)
    {
        $payment->delete();
        return response()->json(null, 204);
    }
}