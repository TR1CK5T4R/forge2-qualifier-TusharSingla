import React from 'react';
import moment from 'moment';
import { Draggable } from '@hello-pangea/dnd';

function CardComponent({ card, index }) {
  const isPastDue = card.due_date ? moment(card.due_date).isBefore(moment()) : false;
  return (
    <Draggable draggableId={card.id.toString()} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{ border: '1px solid #ccc', padding: '8px', marginBottom: '8px', backgroundColor: 'white', borderRadius: '4px', display: 'flex', flexDirection: 'column', gap: '4px', ...provided.draggableProps.style }}
        >
          <h4>{card.title}</h4>
          {card.description && <p style={{ margin: '0' }}>{card.description}</p>}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
            {card.tags && card.tags.map(tag => (
              <span key={tag.id} style={{ backgroundColor: tag.color || '#cccccc', color: 'white', padding: '2px 6px', borderRadius: '3px', fontSize: '0.75em' }}>
                {tag.name}
              </span>
            ))}
          </div>
          {card.members && card.members.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px', alignItems: 'center' }}>
              <span>Members:</span>
              <div style={{ display: 'flex', gap: '2px' }}>
                {card.members.map(member => (
                  <span key={member.id} style={{ backgroundColor: '#007bff', color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '0.7em', fontWeight: 'bold' }}>
                    {member.name.charAt(0).toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          )}
          {card.due_date && (
            <div style={{ fontSize: '0.8em', color: isPastDue ? 'red' : 'black', fontWeight: isPastDue ? 'bold' : 'normal', marginTop: '4px' }}>
              Due: {moment(card.due_date).format('YYYY-MM-DD')}
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}

export default CardComponent;
