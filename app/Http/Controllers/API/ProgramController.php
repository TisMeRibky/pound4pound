<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Program;
use Illuminate\Http\Request;

class ProgramController extends Controller
{
    public function index()
    {
        return response()->json([
            'data' => Program::all()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string'
        ]);

        $program = Program::create($request->only('name', 'description'));

        return response()->json([
            'message' => 'Program created successfully!',
            'data' => $program
        ], 201);
    }

    public function show($id)
    {
        $program = Program::findOrFail($id);

        return response()->json(['data' => $program]);
    }

    public function update(Request $request, $id)
    {
        $program = Program::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string'
        ]);

        $program->update($request->only('name', 'description'));

        return response()->json([
            'message' => 'Program updated successfully!',
            'data' => $program
        ]);
    }

    public function destroy($id)
    {
        $program = Program::findOrFail($id);
        $program->delete();

        return response()->json([
            'message' => 'Program deleted successfully!'
        ]);
    }
}