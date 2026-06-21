// frontend/src/components/KanbanList.jsx
import React from 'react';
import CardComponent from './CardComponent';
import { Droppable, Draggable } from 'react-beautiful-dnd';

function KanbanList({ list, index }) { // Receive index for droppable prop
  return (
    <Draggable draggableId={list.id.toString()} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{ border: '1px solid black', padding: '8px', minWidth: '200px', backgroundColor: '#f0f0f0', display: 'flex', flexDirection: 'column' }}
        >
          <h3>{list.name}</h3>
          <Droppable droppableId={list.id.toString()} type="CARD">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  backgroundColor: snapshot.isDraggingOver ? 'lightblue' : 'transparent',
                  padding: '8px',
                  minHeight: '100px', // Ensure there's space to drop
                  flexGrow: 1, // Allow list to expand
                }}
              >
                {list.cards && list.cards.map((card, cardIndex) => (
                  <CardComponent key={card.id} card={card} index={cardIndex} />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          {/* Add functionality to add new cards later */}
        </div>
      )}
    </Draggable>
  );
}

export default KanbanList;
