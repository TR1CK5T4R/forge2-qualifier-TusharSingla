// frontend/src/components/CardComponent.jsx
import React from 'react';
import moment from 'moment';

function CardComponent({ card }) {
  const isPastDue = card.due_date ? moment(card.due_date).isBefore(moment()) : false;

  return (
    <div style={{ border: '1px solid #ccc', padding: '8px', marginBottom: '8px', backgroundColor: 'white', borderRadius: '4px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <h4>{card.title}</h4>
      {card.description && <p style={{ margin: '0' }}>{card.description}</p>}
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
        {/* Tags */}
        {card.tags && card.tags.map(tag => (
          <span 
            key={tag.id} 
            style={{ 
              backgroundColor: tag.color || '#cccccc', // Default to grey if no color
              color: 'white', 
              padding: '2px 6px', 
              borderRadius: '3px', 
              fontSize: '0.75em' 
            }}
          >
            {tag.name}
          </span>
        ))}
      </div>

      {/* Member Assignment */}
      {card.members && card.members.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px', alignItems: 'center' }}>
           <span>Members:</span>
           <div style={{ display: 'flex', gap: '2px' }}>
             {card.members.map(member => (
               <span 
                 key={member.id}
                 // Placeholder for member avatar/initials
                 style={{ 
                   backgroundColor: '#007bff', // Blue placeholder
                   color: 'white', 
                   borderRadius: '50%', 
                   width: '24px', 
                   height: '24px', 
                   display: 'flex', 
                   justifyContent: 'center', 
                   alignItems: 'center', 
                   fontSize: '0.7em',
                   fontWeight: 'bold' 
                 }}
               >
                 {member.name.charAt(0).toUpperCase()} {/* Display first initial */}
               </span>
             ))}
           </div>
        </div>
      )}

      {card.due_date && (
        <div style={{ 
          fontSize: '0.8em', 
          color: isPastDue ? 'red' : 'black',
          fontWeight: isPastDue ? 'bold' : 'normal',
          marginTop: '4px'
        }}>
          Due: {moment(card.due_date).format('YYYY-MM-DD')}
        </div>
      )}
    </div>
  );
}

export default CardComponent;
