import React from 'react';
import { TypeAnimation } from 'react-type-animation';
import '../Style/LandingPage.css'; // Import the CSS for styling
import MainRagCard from './RagCard/MainRagCard';
import Navbar from './NavBar';
const LandingPage = () => {
  return (
    <div>
      <Navbar/>
      <div className="landing-container">
        {/* First H1 with type animation for the descriptive words */}
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
            style={{ fontSize: '100px' }} 
          />
        </h1>

      </div>
    </div>
  );
};

export default LandingPage;
