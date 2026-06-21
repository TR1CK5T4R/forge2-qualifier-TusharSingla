// frontend/src/components/BoardView.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchBoardDetails } from '../services/api';
import KanbanList from './KanbanList';

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

  if (loading) return <p>Loading board...</p>;
  if (error) return <p>Error loading board: {error}</p>;
  if (!board) return <p>Board not found.</p>;

  return (
    <div>
      <h1>{board.name}</h1>
      <div style={{ display: 'flex', overflowX: 'auto', gap: '16px' }}>
        {board.lists && board.lists.map(list => (
          <KanbanList key={list.id} list={list} />
        ))}
      </div>
    </div>
  );
}

export default BoardView;
