import React from 'react';
import { TypeAnimation } from 'react-type-animation';
import '../Style/LandingPage.css'; // Import the CSS for styling

const LandingPage = () => {
  return (
    <div className="landing-container">
      <h1 className="typing-effect">
        <TypeAnimation
          sequence={[
            'Innovative.', 1000, 
            'Creative.', 1000, 
            'Reliable.', 1000, 
            'Efficient.', 1000, 
            'Future-ready.', 1000,
          ]}
          wrapper="span"
          cursor={true}
          repeat={0}
          style={{ fontSize: '48px' }}
        />
      </h1>
    </div>
  );
};

export default LandingPage;
