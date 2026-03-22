<?php

namespace App\Http\Controllers\API;

use App\Models\Expense;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{
    public function index()
    {
        return response()->json(['data' => Expense::all()]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'description' => 'required|string',
            'exp_date' => 'required|date',
            'exp_type' => 'required|string',
            'exp_amount' => 'required|numeric|min:0',
        ]);

        $expense = Expense::create($validated);

        return response()->json(['message' => 'Expense added successfully', 'data' => $expense], 201);
    }

    public function show(Expense $expense)
    {
        return response()->json(['data' => $expense]);
    }

    public function update(Request $request, Expense $expense)
    {
        $validated = $request->validate([
            'description' => 'required|string',
            'exp_date' => 'required|date',
            'exp_type' => 'required|string',
            'exp_amount' => 'required|numeric|min:0',
        ]);

        $expense->update($validated);

        return response()->json(['message' => 'Expense updated successfully', 'data' => $expense]);
    }
}

