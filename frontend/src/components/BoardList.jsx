// frontend/src/components/BoardList.jsx
import React, { useState, useEffect } from 'react';
import { fetchBoards } from '../services/api';
import { Link } from 'react-router-dom'; // Assuming we'll use react-router-dom for navigation

function BoardList() {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getBoards = async () => {
      try {
        const data = await fetchBoards();
        setBoards(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getBoards();
  }, []);

  if (loading) return <p>Loading boards...</p>;
  if (error) return <p>Error loading boards: {error}</p>;

  return (
    <div>
      <h2>Your Boards</h2>
      {boards.length === 0 ? (
        <p>No boards found. Create one!</p>
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
