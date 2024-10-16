import React from 'react';
import PdfUpload from './PdfUpload';  // Assuming PdfUpload is in the same directory
import Chatbot from './Chatbot';      // Assuming Chatbot is in the same directory
import '../Style/CombinedLayout.css';        // Combined styles

function App() {
  return (
    <div className="main-container">
      <div className="left-container">
        <PdfUpload />
      </div>
      <div className="right-container">
        <Chatbot />
      </div>
    </div>
  );
}

export default App;
