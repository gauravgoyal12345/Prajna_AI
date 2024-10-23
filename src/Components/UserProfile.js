import React, { useState, useEffect } from 'react';
import ChatCard from './ChatCard';
import "../Style/UserProfile.css"
import axios from 'axios';
import UserAvatar from '../Assets/UserAvatar.png';
import { useNavigate } from 'react-router-dom';

function UserProfile() {
    const [chats, setChats] = useState([]);
    const [username, setUsername] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [pdfLinks, setPdfLinks] = useState([]);
    const [userImage, setUserImage] = useState('https://via.placeholder.com/100'); // Placeholder image
    const navigate = useNavigate('');
    // useEffect(() => {
    //     // Fetch user email from local storage
    //     const user = JSON.parse(localStorage.getItem('userDetails'));
    //     const userEmail = user ? user.email : null; // Retrieve email or set to null
    //     console.log(userEmail);
        
    //     if (userEmail) {
    //         // Fetch data from the API on page load
    //         axios.post('https://prajna-ai-f6r7.onrender.com/dashboard', {
    //             email: userEmail // Send email in the request body
    //         })
    //             .then(response => {
    //                 const data = response.data;

    //                 // Assuming the last object contains username
    //                 if (data.length > 0) {
    //                     setUsername(data[data.length - 1].chat_title); // Update this according to your API response

    //                     // Separate out the chat details and pdf links
    //                     const chatsData = data.map(item => ({
    //                         sessionId: item.session_id,  // Assuming this is how the session ID is named
    //                         title: item.chat_title,
    //                         summary: item.summary,
    //                         timestamp: item.timestamp,
    //                         pdfs: item.pdf_links,
    //                         names: item.pdf_names
    //                     }));

    //                     setChats(chatsData);

    //                     // Extract PDF links from the data
    //                     const pdfLinksData = chatsData.flatMap(chat => chat.pdfs); // Changed to flatMap to get all PDF links
    //                     setPdfLinks(pdfLinksData);

    //                     // Optionally update the user image if it comes from the API
    //                     // setUserImage(data[data.length - 1].profileImage || 'https://via.placeholder.com/100');
    //                 }
    //             })
    //             .catch(error => {
    //                 console.error('Error fetching data:', error);
    //             });
    //     } else {
    //         console.error('User email not found in local storage.');
    //     }
    // }, []);

    
    useEffect(() => {
        // Fetch user details from local storage
        const user = JSON.parse(localStorage.getItem('userDetails'));
        const userEmail = user ? user.email : null; // Retrieve email or set to null
        const userName = user ? user.name : 'No Username Available'; // Retrieve username

        // Set username from local storage
        setUsername(userName);

        if (userEmail) {
            // Fetch data from the API on page load
            axios.post('https://prajna-ai-f6r7.onrender.com/dashboard', {
                email: userEmail // Send email in the request body
            })
                .then(response => {
                    const data = response.data;

                    // Separate out the chat details and pdf links
                    const chatsData = data.map(item => {
                        return {
                            sessionId: item.session_id,  // Assuming this is how the session ID is named
                            title: `Chat with ${item.pdf_names[0]}`, // Use the first PDF name for the title
                            summary: item.summary,
                            timestamp: item.timestamp,
                            pdfs: item.pdf_links,
                            names: item.pdf_names // Fetch PDF names
                        };
                    });

                    setChats(chatsData);

                    // Create an array of objects containing PDF links and their corresponding names
                    const pdfLinksData = chatsData.flatMap(chat => 
                        chat.pdfs.map((pdf, index) => ({
                            url: pdf.file_url,
                            name: chat.names[index] // Get the corresponding name
                        }))
                    );

                    setPdfLinks(pdfLinksData);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        } else {
            console.error('User email not found in local storage.');
        }
    }, []);

    const handleChatClick = async (sessionId) => {
        // setLoadingState(true); // Uncomment if using loading state management
        try {
            const response = await axios.post('https://prajna-ai-f6r7.onrender.com/user_chat', { session_id: sessionId });
            // const chatMessages = response.data.chat_history;
            setChatMessages(response.data[0].chat_history)
            console.log(response);
            const newChat = (response.data[0].chat_history);
            console.log(newChat);
            // console.log(chatMessages);
            // const formattedMessages = {
            //     chat_history: chatMessages.map((message) => ({
            //         bot: message.sender === 'bot' ? message.text : null,
            //         sender: message.sender === 'user' ? message.text : null
            //     })).reduce((acc, curr) => {
            //         const lastMessage = acc[acc.length - 1];
    
            //         // Combine bot and user messages into the same chat_history entry
            //         if (lastMessage && lastMessage.bot && curr.sender) {
            //             lastMessage.sender = curr.sender;
            //         } else {
            //             acc.push(curr);
            //         }
    
            //         return acc;
            //     }, [])
            // };


            // const formattedMessages = newChat.map((message) => {
            //     const entries = Object.entries(message); // Get key-value pairs as an array
            //     const sender = entries[0]; // First entry key (sender)
            //     const text = entries[1]; // First entry value (text)
            //     return {
            //         [sender]: text // Return as key-value pair
            //     };
            // });
            // const formattedMessages = newChat.map((message) => {
            //     const entries = Object.entries(message); // Get key-value pairs
            //     const sender = entries[0][0]; // First entry key (sender)
            //     const text = entries[0][1]; // First entry value (text)
            //     return {
            //         sender: sender, // Add sender to the new object
            //         text: text      // Add text to the new object
            //     };
            // });
            // 
            

            const formattedMessages = [];

            // // Iterate over each message in newChat
            // newChat.forEach((message) => {
            //     const entries = Object.entries(message); // Get key-value pairs
            //     const sender = entries[0][0]; // First entry key (sender)
            //     const text = entries[0][1]; // First entry value (text)
                
            //     // Push formatted message to the list
            //     formattedMessages.push({
            //         sender: sender === 'sender' ? 'sender' : 'bot', // Ensure sender is labeled correctly
            //         text: text
            //     });
            // });

            newChat.forEach((message) => {
                const entries = Object.entries(message); // Get key-value pairs
                const sender = entries[0][0]; // First entry key (sender)
                const text = entries[0][1]; // First entry value (text)
                console.log("Entries -->",entries)
                // Push formatted message to the list
                formattedMessages.push({
                    // sender: s === 'sender' ? 'sender' : 'bot', // Ensure sender is labeled correctly
                    sender:"user",
                    text: entries[1][1]
                });
                formattedMessages.push({
                    sender: entries[0][0], // Ensure sender is labeled correctly
                    text: entries[0][1]
                });
            });
            
            console.log(formattedMessages);

            // Store chatMessages in localStorage
            localStorage.setItem('chatMessages', JSON.stringify(formattedMessages));
            const userDetails = JSON.parse(localStorage.getItem('userDetails')) || {};
            userDetails.uid = sessionId;
            localStorage.setItem('userDetails', JSON.stringify(userDetails));
    
            // Navigate to the "/upload" route
            navigate('/upload');
        } catch (error) {
            console.error('Error fetching chat messages:', error);
            // Optional: Provide user feedback about the error
            alert('Failed to fetch chat messages. Please try again later.');
        } finally {
            // setLoadingState(false); // Uncomment if using loading state management
        }
    };
    

    return (
        // <div style={{ padding: '20px', textAlign: 'center' }}>
        //     {/* User Profile Section */}
        //     <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
        //         {/* Profile Picture */}
        //         <img 
        //             src={UserAvatar} 
        //             alt="User Profile" 
        //             style={{
        //                 borderRadius: '50%',
        //                 width: '100px',
        //                 height: '100px',
        //                 objectFit: 'cover',
        //                 marginRight: '20px'
        //             }} 
        //         />
        //         {/* Username */}
        //         <h2>{username || 'No Username Available'}</h2>
        //     </div>

        //     {/* PDF Links Strip */}
        //     <div style={{
        //         display: 'flex',
        //         justifyContent: 'center',
        //         alignItems: 'center',
        //         backgroundColor: '#b0b0b0',  // Darker gray background
        //         padding: '10px',
        //         marginBottom: '20px',
        //         flexWrap: 'wrap'
        //     }}>
        //         {pdfLinks.length > 0 ? (
        //             pdfLinks.map((pdf, index) => (
        //                 <a 
        //                     key={index} 
        //                     href={pdf['file_url']} 
        //                     target="_blank" 
        //                     rel="noopener noreferrer" 
        //                     style={{ margin: '0 10px', textDecoration: 'none', color: '#1976d2' }}
        //                 >
        //                     PDF {index + 1}
        //                 </a>
        //             ))
        //         ) : (
        //             <p>No PDF links available</p>
        //         )}
        //     </div>

        //     {/* Chat Cards Section */}
        //     <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
        //         {chats.map((chat) => (
        //             <ChatCard
        //                 key={chat.sessionId}  // Use session ID as the key
        //                 title={chat.title}
        //                 summary={chat.summary}
        //                 timestamp={chat.timestamp}
        //                 // redirectUrl={`/chat/${chat.title.replace(/\s+/g, '-').toLowerCase()}`}
        //                 onClick={() => handleChatClick(chat.sessionId)} 
        //             />
        //         ))}
        //     </div>
        // </div>

        <div className="user-profile-container">
            {/* Sidebar PDF Links */}
            <div className="pdf-links-sidebar">
                <h3>Your PDFs</h3> {/* Heading for the PDF bar */}
                {pdfLinks.length > 0 ? (
                    pdfLinks.map((pdf, index) => (
                        <a 
                            key={index} 
                            href={pdf.url} // Use the URL
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="pdf-link"
                        >
                            {pdf.name} {/* Display the actual PDF name */}
                        </a>
                    ))
                ) : (
                    <p>No PDF links available</p>
                )}
            </div>

            {/* Main Content */}
            <div className="main-content">
                {/* User Profile Section */}
                <div className="profile-section">
                    {/* Profile Picture */}
                    <img 
                        src={UserAvatar} 
                        alt="User Profile" 
                        className="profile-avatar"
                    />
                    {/* Username */}
                    <h2>{username || 'No Username Available'}</h2>
                </div>

                {/* Chat Cards Section */}
                <div className="chat-cards-container">
                    {chats.map((chat) => (
                        <ChatCard
                            key={chat.sessionId}  // Use session ID as the key
                            title={chat.title} // Title formatted as 'Chat with [PDF Name]'
                            summary={chat.summary}
                            timestamp={chat.timestamp}
                            className="chat-card"
                            onClick={() => handleChatClick(chat.sessionId)} 
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default UserProfile;
