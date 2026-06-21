// frontend/src/components/BoardView.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchBoardDetails, updateCardList } from '../services/api'; // Assuming updateCardList will be added
import KanbanList from './KanbanList';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function BoardView() {
  const { boardId } = useParams();
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getBoard = async () => {
      try {
        const data = await fetchBoardDetails(boardId);
        setBoard(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getBoard();
  }, [boardId]);

  // Function to reorder lists and cards after drag end
  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    // Dropped outside the list
    if (!destination) {
      return;
    }

    // Dropped in the same list
    if (destination.droppableId === source.droppableId) {
      // Implement reordering within the same list if needed
      // For now, focus on moving between lists
      return;
    }

    // Moved to a different list
    const updatedBoard = { ...board };
    const sourceListId = source.droppableId;
    const destinationListId = destination.droppableId;

    // Find the card being dragged
    const cardId = draggableId; // This assumes draggableId is the card ID

    // Find the card object
    const cardBeingMoved = updatedBoard.lists.find(list => list.id.toString() === sourceListId).cards.find(card => card.id.toString() === cardId);

    if (!cardBeingMoved) return;

    // Remove card from source list
    updatedBoard.lists.find(list => list.id.toString() === sourceListId).cards = updatedBoard.lists.find(list => list.id.toString() === sourceListId).cards.filter(card => card.id.toString() !== cardId);

    // Add card to destination list and update its list_id
    const destinationList = updatedBoard.lists.find(list => list.id.toString() === destinationListId);
    // Insert the card at the correct position in the destination list
    destinationList.cards.splice(destination.index, 0, { ...cardBeingMoved, id: cardId }); // Keep original ID, update list context

    setBoard(updatedBoard); // Optimistic UI update

    // Call API to update card's list_id and order
    try {
      // You'll need to provide a way to update the card's list_id and potentially its order in the API
      // For now, we're just moving it conceptually. The backend needs to handle this.
      await updateCardList(cardId.toString(), destinationListId.toString(), destination.index); // Assuming this API call exists
      console.log('Card moved successfully');
    } catch (err) {
      console.error('Failed to move card:', err);
      // Revert UI if API call fails (optional but good practice)
      // For simplicity, skipping revert here
    }
  };

  if (loading) return <p>Loading board...</p>;
  if (error) return <p>Error loading board: {error}</p>;
  if (!board) return <p>Board not found.</p>;

  // Ensure board.lists and lists.cards are initialized if they don't exist
  const boardWithDefaults = {
    ...board,
    lists: board.lists || [],
  };
  boardWithDefaults.lists.forEach((list, index) => {
    list.cards = list.cards || [];
  });


  return (
    <div>
      <h1>{board.name}</h1>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId={boardId.toString()} direction="horizontal" type="LIST">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} style={{ display: 'flex', overflowX: 'auto', gap: '16px', padding: '8px' }}>
              {boardWithDefaults.lists.map((list, index) => (
                <KanbanList
                  key={list.id}
                  list={list}
                  index={index} // Pass index for Droppable in KanbanList
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default BoardView;
