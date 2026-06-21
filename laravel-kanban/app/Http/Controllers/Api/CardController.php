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
    /**
     * Display a listing of the resource.
     * Scopes to a specific KanbanList due to route model binding.
     */
    public function index(KanbanList $kanbanList)
    {
        // Return cards for the specific list, eager loading tags and members
        return response()->json($kanbanList->cards()->with(['tags', 'members'])->orderBy('position')->get());
    }

    /**
     * Store a newly created resource in storage.
     * Scopes to a specific KanbanList.
     */
    public function store(Request $request, KanbanList $kanbanList)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
        ]);

        $validated['list_id'] = $kanbanList->id;
        // Handle position similar to KanbanList: get max current position and add 1
        $maxPosition = $kanbanList->cards()->max('position') ?? -1;
        $validated['position'] = $maxPosition + 1;

        $card = Card::create($validated);

        return response()->json($card, 201);
    }

    /**
     * Display the specified resource.
     * Includes eager loading for tags and members.
     */
    public function show(KanbanList $kanbanList, Card $card)
    {
        // Ensure the card belongs to the specified list
        if ($kanbanList->id !== $card->list_id) {
            return response()->json(['message' => 'Card not found in this list.'], 404);
        }
        $card->load(['tags', 'members']); // Eager load tags and members
        return response()->json($card);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, KanbanList $kanbanList, Card $card)
    {
        // Ensure the card belongs to the specified list
        if ($kanbanList->id !== $card->list_id) {
            return response()->json(['message' => 'Card not found in this list.'], 404);
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|nullable|string',
            'position' => 'sometimes|integer', // Allow position updates
            'due_date' => 'sometimes|nullable|date',
            'list_id' => 'sometimes|exists:kanban_lists,id', // Allow moving card between lists
        ]);

        // If list_id is being changed, update the card's list_id
        if (isset($validated['list_id']) && $validated['list_id'] != $kanbanList->id) {
            // Need to re-parent the card and potentially re-order positions
            // For simplicity, we'll just update the list_id. Position reordering might be complex.
            $card->list_id = $validated['list_id'];
            // Consider re-ordering positions in both source and destination lists
        }


        $card->update($validated);

        // Reload relationships for the response
        $card->load(['tags', 'members']);

        return response()->json($card);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(KanbanList $kanbanList, Card $card)
    {
        // Ensure the card belongs to the specified list
        if ($kanbanList->id !== $card->list_id) {
            return response()->json(['message' => 'Card not found in this list.'], 404);
        }
        $card->delete();

        return response()->json(null, 204);
    }

    /**
     * Attach a tag to a card.
     */
    public function attachTag(Request $request, Card $card, Tag $tag)
    {
        // Validate that the tag exists and the card exists (implicit via route model binding)
        // The route is POST /cards/{card}/tags
        // The request might contain the tag_id, or we can use route model binding as done here.

        // Check if the card and tag are already associated
        if ($card->tags->contains($tag->id)) {
            return response()->json(['message' => 'Tag already attached to this card.'], 400);
        }

        $card->tags()->attach($tag->id);
        $card->load('tags'); // Reload tags for response

        return response()->json(['message' => 'Tag attached successfully.', 'card' => $card]);
    }

    /**
     * Detach a tag from a card.
     */
    public function detachTag(Card $card, Tag $tag)
    {
        // Route is DELETE /cards/{card}/tags/{tag}
        // Check if the tag is actually attached
        if (!$card->tags->contains($tag->id)) {
            return response()->json(['message' => 'Tag is not attached to this card.'], 400);
        }

        $card->tags()->detach($tag->id);
        $card->load('tags'); // Reload tags for response

        return response()->json(['message' => 'Tag detached successfully.', 'card' => $card]);
    }

    /**
     * Assign a member to a card.
     */
    public function assignMember(Request $request, Card $card, Member $member)
    {
        // Route is POST /cards/{card}/members
        // Check if the member is already assigned
        if ($card->members->contains($member->id)) {
            return response()->json(['message' => 'Member already assigned to this card.'], 400);
        }

        $card->members()->attach($member->id);
        $card->load('members'); // Reload members for response

        return response()->json(['message' => 'Member assigned successfully.', 'card' => $card]);
    }

    /**
     * Unassign a member from a card.
     */
    public function unassignMember(Card $card, Member $member)
    {
        // Route is DELETE /cards/{card}/members/{member}
        // Check if the member is actually assigned
        if (!$card->members->contains($member->id)) {
            return response()->json(['message' => 'Member is not assigned to this card.'], 400);
        }

        $card->members()->detach($member->id);
        $card->load('members'); // Reload members for response

        return response()->json(['message' => 'Member unassigned successfully.', 'card' => $card]);
    }
}
