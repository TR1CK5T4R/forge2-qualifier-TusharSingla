<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Card;
use App\Models\KanbanList;
use App\Models\Tag;
use App\Models\Member;
use Illuminate\Http\Request;

class CardController extends Controller
{
    public function index(KanbanList $kanbanList)
    {
        return response()->json($kanbanList->cards()->with(['tags', 'members'])->orderBy('position')->get());
    }

    public function store(Request $request, KanbanList $kanbanList)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
        ]);
        $validated['list_id'] = $kanbanList->id;
        $validated['position'] = ($kanbanList->cards()->max('position') ?? -1) + 1;
        return response()->json(Card::create($validated), 201);
    }

    public function show(KanbanList $kanbanList, Card $card)
    {
        if ($kanbanList->id !== $card->list_id) return response()->json(['message' => 'Not found.'], 404);
        return response()->json($card->load(['tags', 'members']));
    }

    public function update(Request $request, KanbanList $kanbanList, Card $card)
    {
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|nullable|string',
            'position' => 'sometimes|integer',
            'due_date' => 'sometimes|nullable|date',
            'list_id' => 'sometimes|exists:kanban_lists,id',
        ]);
        $card->update($validated);
        return response()->json($card->load(['tags', 'members']));
    }

    public function destroy(KanbanList $kanbanList, Card $card)
    {
        if ($kanbanList->id !== $card->list_id) return response()->json(['message' => 'Not found.'], 404);
        $card->delete();
        return response()->json(null, 204);
    }

    public function attachTag(Request $request, Card $card, Tag $tag)
    {
        if ($card->tags->contains($tag->id)) return response()->json(['message' => 'Already attached.'], 400);
        $card->tags()->attach($tag->id);
        return response()->json($card->load('tags'));
    }

    public function detachTag(Card $card, Tag $tag)
    {
        $card->tags()->detach($tag->id);
        return response()->json($card->load('tags'));
    }

    public function assignMember(Request $request, Card $card, Member $member)
    {
        if ($card->members->contains($member->id)) return response()->json(['message' => 'Already assigned.'], 400);
        $card->members()->attach($member->id);
        return response()->json($card->load('members'));
    }

    public function unassignMember(Card $card, Member $member)
    {
        $card->members()->detach($member->id);
        return response()->json($card->load('members'));
    }
}
