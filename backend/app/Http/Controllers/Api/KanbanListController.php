<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\KanbanList;
use App\Models\Board;
use Illuminate\Http\Request;

class KanbanListController extends Controller
{
    public function index(Board $board)
    {
        return response()->json($board->kanbanLists()->orderBy('position')->get());
    }

    public function store(Request $request, Board $board)
    {
        $validated = $request->validate(['name' => 'required|string|max:255']);
        $validated['board_id'] = $board->id;
        $validated['position'] = ($board->kanbanLists()->max('position') ?? -1) + 1;
        return response()->json(KanbanList::create($validated), 201);
    }

    public function show(Board $board, KanbanList $kanbanList)
    {
        return response()->json($kanbanList);
    }

    public function update(Request $request, Board $board, KanbanList $kanbanList)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'position' => 'sometimes|integer',
        ]);
        $kanbanList->update($validated);
        return response()->json($kanbanList);
    }

    public function destroy(Board $board, KanbanList $kanbanList)
    {
        $kanbanList->delete();
        return response()->json(null, 204);
    }
}
