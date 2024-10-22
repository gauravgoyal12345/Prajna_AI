// TeamMember.js
import React from 'react';
import './TeamMember.css'; // Assuming you have a separate CSS file for styling

function TeamMember({ member }) {
  return (
    <div className="team-member">
      <img src={member.image} alt={member.name} className="member-image" />
      <h3>{member.name}</h3>
      <p>{member.position}</p>
      <p>{member.bio}</p>
    </div>
  );
}

export default TeamMember;
