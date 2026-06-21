// frontend/src/components/KanbanList.jsx
import React from 'react';
import CardComponent from './CardComponent';

function KanbanList({ list }) {
  return (
    <div style={{ border: '1px solid black', padding: '8px', minWidth: '200px' }}>
      <h3>{list.name}</h3>
      <div>
        {list.cards && list.cards.map(card => (
          <CardComponent key={card.id} card={card} />
        ))}
      </div>
      {/* Add functionality to add new cards later */}
    </div>
  );
}

export default KanbanList;
