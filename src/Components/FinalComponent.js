import React, { useState, useRef, useEffect } from 'react';
import PdfUpload from './PdfUpload';  // Assuming PdfUpload is in the same directory
import Chatbot from './Chatbot';      // Assuming Chatbot is in the same directory
import '../Style/CombinedLayout.css'; // Combined styles
import axios from 'axios';
import { Alert } from "antd";
import { TypeAnimation } from 'react-type-animation';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import { IconButton, Avatar, Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function FinalComponents() {

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [citation, setSitation] = useState([]);
  const [botResponse, setBotResponse] = useState('');
  const chatWindowRef = useRef(null);
  const [emptyFieldAlert, setEmptyFieldAlert] = useState(false);
  const [userQuestions, setUserQuestions] = useState([]);
  const [userData, setUserData] = useState([]);
  const [responseQuestions, setResponseQuestions] = useState([]); // New state for response questions
  const [sessionID, setSessionID] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

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
        const response = await axios.post('http://localhost:5000/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.status === 200) {
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

    try {
      const newMessages = [...messages, { sender: "user", text: message }];
      setMessages(newMessages);
      setInput('');  // Clear input only for manual input case

      // Simulate a delay for bot response
      const userRagChatData = { email: userData.email, question: message, session_id: userData.uid };
      const response = await axios.post("http://localhost:5000/handle_query", userRagChatData);

      if (response.status === 200) {
        const botResponse = response.data.answer;
        const botCitations = response.data.citations;

        const updatedMessages = [
          ...newMessages,
          { sender: "bot", text: botResponse, citations: botCitations }  // Include citations
        ];

        setMessages(updatedMessages);  // Update messages state with bot response and citations
      }
    } catch (error) {
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
  // Voice Input!!
  const handleMicClick = () => {
    if (isListening) {
      recognition.stop(); // Stop listening if it's already listening
      setIsListening(false);
    } else {
      recognition.start(); // Start listening for voice input
      setIsListening(true);
    }
  };

  // Web Speech API setup for voice recognition
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';

  recognition.onresult = (event) => {
    let interimTranscript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      interimTranscript += transcript;
    }
    setInput(interimTranscript);
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    setIsListening(false);
  };

  return (
    <div className="main-container" style={{
      margin: 0,
      padding: 0,
      backgroundColor: 'white',  // White background to ensure no black strip
      minHeight: '100vh',        // Full viewport height
      display: 'flex',           // Use flexbox to align left and right containers
      flexDirection: 'row',      // Align children in a row (left-right layout)
      width: '100vw',            // Full viewport width
    }}>
      <div className="left-container" style={{
        flex: 0.5,                   // Take up available space
                   // Add padding as necessary
      }}>
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
      <div
        className="right-container"
        style={{
          flex: 2,                   // Right container takes up more space
          margin: 0,
          padding: 0,
          backgroundColor: 'transparent', // Remove any background color
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',            // Full height of the viewport
          overflow: 'hidden',         // Ensure content doesn't overflow
        }}
      >
        <div className="profile-menu-container" style={{ textAlign: 'right', margin: 0 }}>
          <IconButton onClick={handleMenuClick} style={{ float: 'right', background: 'transparent' }}>
            <Avatar alt="Profile" />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            slotProps={{
              style: {
                backgroundColor: 'white', // Ensure no black background
              }
            }}
          >
            <MenuItem onClick={() => { handleMenuClose(); navigate("/profile"); }}>Profile</MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); navigate("/"); }}>Home</MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); navigate("/logout"); }}>Logout</MenuItem>
          </Menu>
        </div>

        <div className='external-chatbot-container'>
          <div className="chatbot-container">

            <div className="chat-window" ref={chatWindowRef}>
              {messages && messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message ${msg.sender === "user" ? "user-message" : "bot-message"}`}
                >
                  {msg.sender === "bot" ? (
                    <>
                      <TypeAnimation
                        sequence={[
                          msg.text,  // The bot's response
                        ]}
                        wrapper="p"  // The wrapper element
                        speed={0.1}    // Typing speed
                        repeat={0}   // Don't repeat
                      />
                      {/* {msg.citations && msg.citations.length > 0 && (
                        <div className="citations">
                          <h4>Citations:</h4>
                          <ul>
                            {msg.citations.map((citation, index) => (
                              <li key={index}>
                                {`Page ${citation.page_num}, Paragraph ${citation.paragraph_num}, Source: ${citation.source_pdf}`}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )} */}
                      {msg.citations && msg.citations.length > 0 && (
                        <div className="citations">
                          <h4>Citations:</h4>
                          <ul>
                            {[...new Set(
                              msg.citations
                                .filter(citation => citation.source_pdf.endsWith('.pdf'))  // Exclude sources not ending with '.pdf'
                                .map(JSON.stringify)  // Stringify for unique set filtering
                            )].map((citation, index) => {
                              const parsedCitation = JSON.parse(citation);
                              const source = parsedCitation.source_pdf !== 'pdfs'
                                ? parsedCitation.source_pdf
                                : 'PDF File';  // Handle 'pdfs' as 'Unknown Source'
                              return (
                                <li key={index}>
                                  {`Page ${parsedCitation.page_num}, Paragraph ${parsedCitation.paragraph_num}, Source: ${source}`}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}

                    </>
                  ) : (
                    <p>{msg.text}</p>
                  )}
                </div>
              ))}
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
              <button className="mic-button" onClick={handleMicClick}>
                {isListening ? <StopIcon /> : <MicIcon />}
              </button>
              <button className='chat-button' onClick={() => handleSendMessage()}>Send</button>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}

export default FinalComponents;
