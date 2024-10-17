import React, { useState, useRef, useEffect } from 'react';
import PdfUpload from './PdfUpload';  // Assuming PdfUpload is in the same directory
import Chatbot from './Chatbot';      // Assuming Chatbot is in the same directory
import '../Style/CombinedLayout.css'; // Combined styles
import axios from 'axios';
import { Alert } from "antd";
import { TypeAnimation } from 'react-type-animation';

function FinalComponents() {

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [botResponse, setBotResponse] = useState('');
  const chatWindowRef = useRef(null);
  const [emptyFieldAlert, setEmptyFieldAlert] = useState(false);
  const [userQuestions, setUserQuestions] = useState([]);
  const [userData, setUserData] = useState([]);
  const [responseQuestions, setResponseQuestions] = useState([]); // New state for response questions
  const [sessionID, setSessionID] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userDetails'));
    if (user) {
      setSessionID(user.uid);
    }
  }, []);

  const handleFileUpload = async (event) => {

    const files = event.target.files;

    if (files.length > 0) {
      const formData = new FormData();
      // Append session ID to form data
      formData.append('session_id', sessionID);

      for (let i = 0; i < files.length; i++) {
        formData.append('pdfs', files[i]);
      }

      try {
        const response = await axios.post('https://prajna-ai.onrender.com/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.status === 200) {
            debugger;
          setIsSubmitted(true);
          const questions = response.data.message
            .split('\n')
            .filter(question => question.trim() !== '');
            
            setUserQuestions(questions);
        }

        console.log('Upload success:', response.data);
      } catch (error) {
        console.error('Error uploading files:', error);
      }
    }
  };

  useEffect(() => {
    // Map userQuestions to responseQuestions when userQuestions changes
    if (userQuestions.length > 0) {
      setResponseQuestions(userQuestions.map((question, index) => ({ id: index, text: question })));
    }
  }, [userQuestions]);  // Dependency array to watch changes in userQuestions

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userDetails'));
    if (user) {
        setUserData(user)
    }
  }, []);  // Dependency array to watch changes in userQuestions

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

  const handleSendMessage = async (messageToSend) => {
    const message = messageToSend || input;  // Use clicked question or user input

    if (message.trim() === '') {
      setEmptyFieldAlert(true);
      return;
    }
    try{
        // User's message is added to the messages array
        const newMessages = [...messages, { sender: "user", text: message }];
        setMessages(newMessages);
        setInput('');  // Clear input only for manual input case

        // Simulate a delay for bot response
        const userRagChatData = {'email' : userData.email, 'question' : message, 'session_id' : userData.uid };

        const response = await axios.post("https://prajna-ai.onrender.com/handle_query", userRagChatData);

        let botResponse = '';
        if (response.status === 200) {
        botResponse = response.data.answer;
        }
        const updatedMessages = [
            ...newMessages, 
            { sender: "bot", text: botResponse }
        ];
        setMessages(updatedMessages);  // Update messages state with bot response
    }
    catch(error){
        console.log(error);
      }
  };

  const handleQuestionClick = (question) => {
    handleSendMessage(question.text);  // Send the clicked question
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
    <div className="main-container">
      <div className="left-container">
        <div className="upload-container">
          <label htmlFor="file-upload" className="custom-file-upload">
            <i className="upload-icon">&#8682;</i>  {/* Simple upload icon */}
            {!isSubmitted ? 'Upload PDF files' : 'PDF Files Uploaded'}
          </label>
          <input
            id="file-upload"
            type="file"
            onChange={handleFileUpload}
            multiple
            accept="application/pdf"
          />

          {isSubmitted && <p className='pdf-p'>The PDF has been uploaded</p>}
          <div className="recommended-questions">
            <h3>Recommended Questions</h3>
            {responseQuestions.length > 0 && <ul>
                {responseQuestions.map((question, index) => (
                <li key={index} onClick={() => handleQuestionClick({ text: question.text })}>
                    {question.text}  
                </li>
                ))}
            </ul>}
        </div>
        </div>
      </div>
      <div className="right-container">
        <div className='external-chatbot-container'>
          <div className="chatbot-container">
            <div className="chat-window" ref={chatWindowRef}>
            {messages && messages.map((msg, index) => (
                <div
                    key={index}
                    className={`message ${msg.sender === "user" ? "user-message" : "bot-message"}`}
                >
                    {msg.sender === "bot" ? (
                    <TypeAnimation
                        sequence={[
                            msg.text,   // The bot's response
                        10,  // Optional delay after typing
                        ]}
                        wrapper="p"     // The wrapper element
                        speed={1}      // Typing speed
                        repeat={0}      // Don't repeat
                    />
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
                    speed={1}       // Instant display (no typing effect)
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
              <button className='chat-button' onClick={() => handleSendMessage()}>Send</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FinalComponents;
