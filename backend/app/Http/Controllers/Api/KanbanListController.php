<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Board;
use App\Models\KanbanList;
use Illuminate\Http\Request;

class KanbanListController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Board $board) // Implicitly injected by route model binding
    {
        return response()->json($board->kanbanLists()->orderBy('position')->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Board $board) // Implicitly injected
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $validated['board_id'] = $board->id;
        // Position should be handled carefully - e.g., setting it to the last position
        // For simplicity now, let's set a default, assuming position will be handled by frontend or advanced logic later.
        // A common approach is to get the max current position and add 1.
        $maxPosition = $board->kanbanLists()->max('position') ?? -1;
        $validated['position'] = $maxPosition + 1;

        $kanbanList = KanbanList::create($validated);

        return response()->json($kanbanList, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Board $board, KanbanList $kanbanList) // Implicitly injected
    {
        // Route model binding ensures kanbanList belongs to the board
        return response()->json($kanbanList);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Board $board, KanbanList $kanbanList) // Implicitly injected
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'position' => 'sometimes|integer', // Allow position updates
        ]);

        $kanbanList->update($validated);

        return response()->json($kanbanList);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Board $board, KanbanList $kanbanList) // Implicitly injected
    {
        $kanbanList->delete();

        return response()->json(null, 204);
    }
}
