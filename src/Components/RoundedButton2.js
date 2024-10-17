import React from 'react';
import '../Style/RoundedButton2.css'; // External CSS file for styling

const RoundedButton2 = ({ label, onClick, disabled }) => {
  return (
    <button 
      className="rounded-button" 
      onClick={onClick} 
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default RoundedButton2;
