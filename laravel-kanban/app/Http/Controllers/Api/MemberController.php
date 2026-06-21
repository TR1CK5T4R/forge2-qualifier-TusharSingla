<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Member; // Import Member model
use Illuminate\Http\Request;

class MemberController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Member::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:members,email',
            'avatar_url' => 'nullable|url',
        ]);

        $member = Member::create($validated);

        return response()->json($member, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Member $member) // Use route model binding
    {
        return response()->json($member);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Member $member) // Use route model binding
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:members,email,' . $member->id, // Ignore current member's email for uniqueness check
            'avatar_url' => 'sometimes|nullable|url',
        ]);

        $member->update($validated);

        return response()->json($member);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Member $member) // Use route model binding
    {
        $member->delete();

        return response()->json(null, 204);
    }
}
