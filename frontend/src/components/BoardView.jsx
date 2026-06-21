import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchBoardDetails, updateCardList } from '../services/api';
import KanbanList from './KanbanList';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';

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

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    const updatedBoard = { ...board };
    const lists = updatedBoard.kanban_lists;
    const sourceList = lists.find(l => l.id.toString() === source.droppableId);
    const destList = lists.find(l => l.id.toString() === destination.droppableId);
    const card = sourceList.cards.find(c => c.id.toString() === draggableId);
    if (!card) return;

    sourceList.cards = sourceList.cards.filter(c => c.id.toString() !== draggableId);
    destList.cards.splice(destination.index, 0, card);
    setBoard(updatedBoard);

    try {
      await updateCardList(draggableId, destination.droppableId, destination.index);
    } catch (err) {
      console.error('Failed to move card:', err);
    }
  };

  if (loading) return <p>Loading board...</p>;
  if (error) return <p>Error loading board: {error}</p>;
  if (!board) return <p>Board not found.</p>;

  const lists = (board.kanban_lists || []).map(l => ({ ...l, cards: l.cards || [] }));

  return (
    <div>
      <h1>{board.name}</h1>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId={boardId.toString()} direction="horizontal" type="LIST">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}
              style={{ display: 'flex', overflowX: 'auto', gap: '16px', padding: '8px' }}>
              {lists.map((list, index) => (
                <KanbanList key={list.id} list={list} index={index} />
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
