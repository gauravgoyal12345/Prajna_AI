import React from 'react';
import './RagCard.css';

function RagCard(props) {
  const { image, title} = props; // 'routerLink' is the path to navigate to

  return (
      <div className="venue-card">
        <div className="card-image">
          <img src={image} alt={title} />
        </div>
        <div className="card-details">
          <h2>{title}</h2>
        </div>
      </div>
  );
}

export default RagCard;
