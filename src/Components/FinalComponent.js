import React, { useState, useRef, useEffect } from 'react';
import PdfUpload from './PdfUpload';  // Assuming PdfUpload is in the same directory
import Chatbot from './Chatbot';      // Assuming Chatbot is in the same directory
import '../Style/CombinedLayout.css'; // Combined styles
import axios from 'axios';
import { Alert } from "antd";
import { TypeAnimation } from 'react-type-animation';
import { IconButton, Avatar, Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material'; // Import Button from Material-UI
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import PdfViewer from './PdfViewer';
import { getDocument } from 'pdfjs-dist/build/pdf';
import ReactDOM from 'react-dom';
import { Popconfirm } from "antd"; 
import { v4 as uuidv4 } from 'uuid';

function FinalComponents() {

  <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.12.313/pdf.min.js"></script>

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [citation, setSitation] = useState([]);
  const [botResponse, setBotResponse] = useState('');
  const chatWindowRef = useRef(null);
  const [userChatMessages, setUserChatMessages] = useState([]);
  const [emptyFieldAlert, setEmptyFieldAlert] = useState(false);
  const [userQuestions, setUserQuestions] = useState([]);
  const [userData, setUserData] = useState([]);
  const [responseQuestions, setResponseQuestions] = useState([]); // New state for response questions
  const [sessionID, setSessionID] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openLogOut, setOpenLogOut] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  

  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const openPdfInNewTab = (pdfUrl, pageNum) => {
    // Create a panel for the PDF
    const pdfPanel = document.createElement('div');
    pdfPanel.style.position = 'fixed';
    pdfPanel.style.left = '0';
    pdfPanel.style.top = '0';
    pdfPanel.style.width = '400px'; // Set your desired width
    pdfPanel.style.height = '100%';
    pdfPanel.style.backgroundColor = 'white';
    pdfPanel.style.boxShadow = '2px 0 5px rgba(0,0,0,0.5)';
    pdfPanel.style.zIndex = '9999';
    pdfPanel.style.display = 'flex';
    pdfPanel.style.flexDirection = 'column';
    pdfPanel.style.alignItems = 'center';
    pdfPanel.style.overflowY = 'auto'; // Allow scrolling if content overflows

    // Create a close button
    const closeButton = document.createElement('button');
    closeButton.innerText = '✖'; // Cross symbol
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.fontSize = '20px';
    closeButton.style.border = 'none';
    closeButton.style.backgroundColor = 'transparent';
    closeButton.style.cursor = 'pointer';

    // Append the close button to the panel
    pdfPanel.appendChild(closeButton);

    // Add event listener to close the panel
    closeButton.addEventListener('click', () => {
        document.body.removeChild(pdfPanel); // Remove the panel from the body
    });

    document.body.appendChild(pdfPanel); // Append the panel to the body

    // Create a canvas to render the PDF page
    const canvas = document.createElement('canvas');
    pdfPanel.appendChild(canvas); // Append the canvas to the panel

    // Load the PDF document
    getDocument(pdfUrl).promise.then(pdf => {
        console.log('PDF loaded successfully');

        pdf.getPage(pageNum).then(page => {
            console.log(`Page ${pageNum} loaded successfully`);
            const scale = 1.5; // Adjust scale as needed
            const viewport = page.getViewport({ scale });

            canvas.height = viewport.height;
            canvas.width = viewport.width;

            const renderContext = {
                canvasContext: canvas.getContext('2d'),
                viewport: viewport,
            };

            // Render the page into the canvas context
            page.render(renderContext).promise.then(() => {
                console.log('Page rendered successfully');
            }).catch(error => {
                console.error('Error rendering page: ', error);
                displayErrorMessage(pdfPanel, 'Error rendering PDF page.');
            });
        }).catch(error => {
            console.error('Error getting PDF page: ', error);
            displayErrorMessage(pdfPanel, 'Error getting PDF page.');
        });
    }).catch(error => {
        console.error('Error loading PDF: ', error);
        displayErrorMessage(pdfPanel, 'Error loading PDF document.');
    });
};

// Function to display error message in the panel
const displayErrorMessage = (panel, message) => {
    const errorMessage = document.createElement('div');
    errorMessage.innerText = message;
    errorMessage.style.color = 'red';
    errorMessage.style.marginTop = '20px';
    errorMessage.style.textAlign = 'center'; // Center the error message
    panel.appendChild(errorMessage);
};

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userDetails'));
    const storedMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];
    if(storedMessages){
      setMessages(storedMessages);
    }
      if (user) {
      setSessionID(user.uid);
    }
  }, []);

  
  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));

    if (userDetails) {
      // Only generate a new UID if it doesn't exist
      if (!userDetails.uid) {
        const newUID = uuidv4(); // Generate a new UID
        setSessionID(newUID);
        console.log(newUID);

        // Create a new object with the same details but updated UID
        const updatedUserDetails = {
          ...userDetails,
          uid: newUID // Overwrite only the UID
        };

        // Store the updated user details back in localStorage
        localStorage.setItem("userDetails", JSON.stringify(updatedUserDetails));
      }
    }
  }, []);  // Empty dependency array ensures this runs on mount


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
        const response = await axios.post('https://prajna-ai-f6r7.onrender.com/upload', formData, {
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
    if (messages !== null) { // Only store messages if they've been initialized
      localStorage.setItem('chatMessages', JSON.stringify(messages));
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const userChat = JSON.parse(localStorage.getItem('chatMessages'));
    const user = JSON.parse(localStorage.getItem('userDetails'));
    setUserData(user);
    if (userChat && userChat.length > 0) {
      setUserChatMessages(userChat);
      setMessages(userChat);  // Load previous chat messages if available
    } 
    if (user && !(userChat)) {
      // If there are no chat messages, set the welcome message
      // setUserData(user);
      setMessages([ 
        { sender: "bot", text: `Hi ${user.name}! I am PDF-Genie, your personal guide to interact with your documents?` }
      ]);
    }

  }, []);  // Dependency array to watch changes in userQuestions

  useEffect(() => {
    if (messages !== null) { // Only store messages if they've been initialized
      localStorage.setItem('chatMessages', JSON.stringify(messages));
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  const handleTextInputChange = (e) => {
    setInput(e.target.value);
    setEmptyFieldAlert(false);
  };

  const convertChatDataToPairs = (chatData) => {
    const result = [];
    let userMessage = "";
    let botMessage = "";
  
    for (let i = 1; i < chatData.length; i++) {
        const entry = chatData[i];
        if (entry.sender === "user") {
            userMessage = entry.text;
        } 
        else if (entry.sender === "bot") {
            botMessage = entry.text;
            if (userMessage) {
                result.push(`${userMessage}: ${botMessage}`);
                userMessage = ""; 
            }
        }
    }
    return result;
  };

  const convertChatDataToLogOut = (chatData) => {
    const result = [];
    let userMessage = "";
    let botMessage = "";
    
    for (let i = 1; i < chatData.length; i++) {
      const entry = chatData[i];
      
      if (entry.sender === "user") {
        userMessage = entry.text;
      } else if (entry.sender === "bot") {
        botMessage = entry.text;
        
        if (userMessage) {
          result.push({
            sender: userMessage,  // User message
            bot: botMessage       // Bot message
          });
          userMessage = "";  // Reset after storing
        }
      }
    }
    
    return result;
  };

  
  const showPopconfirm = () => {
    setOpenLogOut(true);
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpenLogOut(false);
  };
   // Handle LogOut and API call
   const handleOk = async () => {
    const chatPairs = convertChatDataToLogOut(userChatMessages);
    const logOutData = {
      email: userData.email,
      chat_history: chatPairs,
      session_id: sessionID
    };

    try {
      console.log(logOutData);
      const response = await axios.post("https://prajna-ai-f6r7.onrender.com/logout", logOutData);

      if (response.status === 201) {
        localStorage.removeItem("chatMessages");
        localStorage.removeItem("userDetails");
        setTimeout(() => {
          navigate('/');
          window.location.reload();
        }, 100);

      }
    } catch (error) {
      console.error("LogOut failed: ", error);
    }
    setConfirmLoading(false);
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
      setUserChatMessages(newMessages);
      setInput('');  // Clear input only for manual input case

      // Simulate a delay for bot response
      const chatPairs = convertChatDataToPairs(newMessages); 
      const userRagChatData = { email: userData.email, question: message, session_id: userData.uid };
      const response = await axios.post("https://prajna-ai-f6r7.onrender.com/handle_query", userRagChatData);

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
            {/* <MenuItem onClick={() => { handleMenuClose(); navigate("/logout"); }}>Logout</MenuItem> */}
            <Popconfirm
                placement="bottom"
                title="LogOut Confirm"
                content={"Are You Sure You Want to LogOut"}  // Updated prop
                open={openLogOut}
                onConfirm={handleOk}
                okButtonProps={{
                  loading: confirmLoading,
                }}
                onCancel={handleCancel}
            >
              <MenuItem onClick={showPopconfirm}>Logout</MenuItem>
            </Popconfirm>
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
                    <p>{msg.text}</p>
                      {/* <TypeAnimation
                        sequence={[
                          msg.text,  // The bot's response
                        ]}
                        wrapper="p"  // The wrapper element
                        speed={-100}    // Typing speed
                        repeat={0}   // Don't repeat
                      /> */}

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
                                <button key={index} onClick={() => openPdfInNewTab(citation.source_pdf, citation.page_num)}>
                                Open Citation {index + 1} (Page {citation.page_num})
                              </button>
                              return (
                              <li key={index}>
                              {`Page ${parsedCitation.page_num}, Paragraph ${parsedCitation.paragraph_num}, Source: `}
                              <a 
                                href = {parsedCitation.source_link}
                                target="_blank" 
                                rel="noopener noreferrer" 
                                onClick={(e) => {
                                  e.preventDefault();
                                  openPdfInNewTab(parsedCitation.source_link, parsedCitation.page_num); 
                                }}
                              >
                                {source}
                              </a>
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
              <Button
                className="mic-button"
                onClick={handleMicClick}
                variant="contained" // Use Material-UI variant for a raised button effect
                startIcon={isListening ? <StopIcon /> : <MicIcon />} // Use icons from MUI
              >
                {isListening ? 'Stop Listening' : 'Start Listening'}
              </Button>
              <button className='chat-button' onClick={() => handleSendMessage()}>Send</button>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}

export default FinalComponents;
