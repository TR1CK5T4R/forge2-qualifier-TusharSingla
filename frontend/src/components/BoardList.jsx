import React, { useState, useEffect } from 'react';
import { fetchBoards, createBoard } from '../services/api';
import { Link } from 'react-router-dom';

function BoardList() {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newBoardName, setNewBoardName] = useState('');
  const [newBoardDesc, setNewBoardDesc] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadBoards();
  }, []);

  const loadBoards = async () => {
    try {
      const data = await fetchBoards();
      setBoards(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newBoardName.trim()) return;
    setCreating(true);
    try {
      await createBoard({ name: newBoardName, description: newBoardDesc });
      setNewBoardName('');
      setNewBoardDesc('');
      await loadBoards();
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <p>Loading boards...</p>;
  if (error) return <p>Error loading boards: {error}</p>;

  return (
    <div>
      <h2>Your Boards</h2>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Board name"
          value={newBoardName}
          onChange={e => setNewBoardName(e.target.value)}
          style={{ marginRight: '8px' }}
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={newBoardDesc}
          onChange={e => setNewBoardDesc(e.target.value)}
          style={{ marginRight: '8px' }}
        />
        <button onClick={handleCreate} disabled={creating}>
          {creating ? 'Creating...' : 'Create Board'}
        </button>
      </div>
      {boards.length === 0 ? (
        <p>No boards found. Create one above!</p>
      ) : (
        <ul>
          {boards.map(board => (
            <li key={board.id}>
              <Link to={`/boards/${board.id}`}>{board.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default BoardList;
