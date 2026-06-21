// frontend/src/components/CardComponent.jsx
import React from 'react';

function CardComponent({ card }) {
  return (
    <div style={{ border: '1px solid #ccc', padding: '8px', marginBottom: '8px', backgroundColor: 'white' }}>
      <h4>{card.title}</h4>
      <p>{card.description}</p>
      {/* Add tags, members, due date here later */}
    </div>
  );
}

export default CardComponent;
