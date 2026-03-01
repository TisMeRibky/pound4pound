<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function index()
    {
        $payments = Payment::with('member')->get();
        return response()->json(['data' => $payments]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'member_id' => 'required|exists:members,id',
            'amount' => 'required|numeric',
            'payment_date' => 'required|date',
            'proof' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'payment_method' => 'nullable|string'
        ]);

        $proofPath = $request->hasFile('proof') ? $request->file('proof')->store('payments') : null;

        $payment = Payment::create([
            'member_id' => $validated['member_id'],
            'amount' => $validated['amount'],
            'payment_date' => $validated['payment_date'],
            'proof' => $proofPath,
            'payment_method' => $validated['payment_method'] ?? null,
        ]);

        return response()->json(['data' => $payment], 201);
    }

    public function show(Payment $payment)
    {
        $payment->load('member');
        return response()->json($payment);
    }

    public function destroy(Payment $payment)
    {
        $payment->delete();
        return response()->json(null, 204);
    }
}