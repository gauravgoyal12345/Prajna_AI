import React, { useState, useEffect, useRef } from 'react';
import '../Style/Chatbot.css';
import axios from 'axios';
import { Alert } from "antd";
import { TypeAnimation } from 'react-type-animation'; // Import TypeAnimation

function Chatbot() {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
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

    try {
      const newMessages = [...messages, { sender: "user", text: input }];
      setMessages(newMessages);
      setInput('');
      setIsTyping(true);

      // Simulate a delay for bot response
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2 seconds delay

      // Simulated bot response
      const responseText = "I am here to help"; 
      setBotResponse(responseText);

      // Update messages state
      const updatedMessages = [
        ...newMessages, 
        { sender: "bot", text: responseText }
      ];
      setMessages(updatedMessages);
      setIsTyping(false);
    } catch (error) {
      console.log(error);
    }
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
          {isTyping && (
            <div className="message bot-message">
              <p><i>Typing...</i></p>
            </div>
          )}
          {/* Display the bot's response with type animation */}
          {botResponse && !isTyping && (
            <div className="message bot-message">
              <TypeAnimation
                sequence={[
                  botResponse,   // String to display
                  2000,          // Delay in ms before next action (stay on message for 2 seconds)
                ]}
                wrapper="span"
                speed={50}      // Animation speed (ms per character)
                repeat={0}      // Repeat the animation
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
