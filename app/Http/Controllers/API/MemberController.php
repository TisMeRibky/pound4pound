<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Member;
use Illuminate\Http\Request;

class MemberController extends Controller
{
    public function index()
    {
        return response()->json(['data' => Member::all()]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string',
            'last_name'  => 'required|string',
            'email'      => 'required|email|unique:members,email',
            'phone'      => 'nullable|string',
            'status'     => 'required|string',
        ]);

        $member = Member::create($validated);

        return response()->json(['data' => $member], 201);
    }

    public function show(Member $member)
    {
        return response()->json($member);
    }

    public function update(Request $request, Member $member)
    {
        $member->update($request->all());
        return response()->json($member);
    }

    public function destroy(Member $member)
    {
        $member->delete();
        return response()->json(null, 204);
    }

    //MEMBERSHIPS

public function indexMembership(Request $request)
{
    $members = Member::where('status', 'Active')
        ->whereDoesntHave('membership')
        ->get(['id', 'first_name', 'last_name', 'status']);

    \Log::info('Members without membership:', $members->toArray()); // <-- logs to storage/logs/laravel.log

    return response()->json(['data' => $members]);
}
}