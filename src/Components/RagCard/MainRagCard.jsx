import React from 'react';
import RagCard from './RagCard';
import './MainRagCard.css';
import team from "../../Assets/team.jpg"
const cardItems = [
  {
    image: team,
    title: 'Abhinav Aggarwal',
  },
  {
    image: team,
    title: 'Abhinav Aggarwal',
  },
  {
    image: team,
    title: 'Abhinav Aggarwal',
  },
  {
    image: team,
    title: 'Abhinav Aggarwal',
  },
  {
    image: team,
    title: 'Abhinav Aggarwal',
  }
];

function MainRagCard() {

  return (
    <div>
      <div className="Main-Card">
        <div className="Main-Card-container">
          {cardItems.map((item, index) => (
            <RagCard
              key={index}
              image={item.image}
              title={item.title}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default MainRagCard;
