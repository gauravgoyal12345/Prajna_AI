import React, { useState, useRef } from 'react';
import '../Style/Chatbot.css';
import axios from 'axios';
import { Alert } from "antd";
import { TypeAnimation } from 'react-type-animation'; // Import TypeAnimation

function Chatbot() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [botResponse, setBotResponse] = useState('');
  const chatWindowRef = useRef(null);
  const [emptyFieldAlert, setEmptyFieldAlert] = useState(false);

  const handleTextInputChange = (e) => {
    setInput(e.target.value);
    setEmptyFieldAlert(false);
  };

  const formatResponse = (response) => {
    return response
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italics
      .replace(/\n/g, '<br/>'); // New lines to <br/>
  };

  const handleSendMessage = async () => {
    if (input.trim() === '') {
      setEmptyFieldAlert(true);
      return;
    }

    // User's message is added to the messages array
    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput('');

    // Simulate a delay for bot response
    await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay

    // Simulated bot response
    const responseText = "I am here to help"; 
    setBotResponse(responseText);
  };

  // Function to add bot response to messages after animation finishes
  const addBotResponseToMessages = () => {
    const updatedMessages = [
      ...messages,
      { sender: "bot", text: botResponse }
    ];
    setMessages(updatedMessages);
    setBotResponse(''); // Clear botResponse after it's added to messages
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className='external-chatbot-container'>
      <div className="chatbot-container">
        <div className="chat-window" ref={chatWindowRef}>
          {messages && messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.sender === "user" ? "user-message" : "bot-message"}`}
            >
              {msg.sender === "bot" ? (
                <p dangerouslySetInnerHTML={{ __html: formatResponse(msg.text) }} />
              ) : (
                <p>{msg.text}</p>
              )}
            </div>
          ))}
          {/* Display the bot's response with TypeAnimation */}
          {botResponse && (
            <div className="message bot-message">
              <TypeAnimation
                sequence={[
                  botResponse,   // String to display
                  2000,          // Stay on the message for 2 seconds
                  () => {
                    // After animation, add the message to the state
                    addBotResponseToMessages();
                  },
                ]}
                wrapper="span"
                speed={10}       // Instant display (no typing effect)
                repeat={0}      // Don't repeat the animation
              />
            </div>
          )}
        </div>
        {emptyFieldAlert && <Alert message={"Please input a valid Message"} type="warning" />}
        <div className="input-container">
          <textarea
            value={input}
            onChange={handleTextInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            rows={1}
          />
          <button className='chat-button' onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
