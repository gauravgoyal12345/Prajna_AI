import React, { useState, useEffect } from 'react';
import ChatCard from './ChatCard';
import axios from 'axios';
import UserAvatar from '../Assets/UserAvatar.png';

function UserProfile() {
    const [chats, setChats] = useState([]);
    const [username, setUsername] = useState('');
    const [pdfLinks, setPdfLinks] = useState([]);
    const [userImage, setUserImage] = useState('https://via.placeholder.com/100'); // Placeholder image

    useEffect(() => {
        // Fetch user email from local storage
        const user = JSON.parse(localStorage.getItem('userDetails'));
        const userEmail = user ? user.email : null; // Retrieve email or set to null
        console.log(userEmail);
        
        if (userEmail) {
            // Fetch data from the API on page load
            axios.post('http://localhost:5000/dashboard', {
                email: userEmail // Send email in the request body
            })
                .then(response => {
                    const data = response.data;

                    // Assuming the last object contains username
                    if (data.length > 0) {
                        setUsername(data[data.length - 1].chat_title); // Update this according to your API response

                        // Separate out the chat details and pdf links
                        const chatsData = data.map(item => ({
                            sessionId: item.session_id,  // Assuming this is how the session ID is named
                            title: item.chat_title,
                            summary: item.summary,
                            timestamp: item.timestamp,
                            pdfs: item.pdf_links,
                            names: item.pdf_names
                        }));

                        setChats(chatsData);

                        // Extract PDF links from the data
                        const pdfLinksData = chatsData.flatMap(chat => chat.pdfs); // Changed to flatMap to get all PDF links
                        setPdfLinks(pdfLinksData);

                        // Optionally update the user image if it comes from the API
                        // setUserImage(data[data.length - 1].profileImage || 'https://via.placeholder.com/100');
                    }
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        } else {
            console.error('User email not found in local storage.');
        }
    }, []);

    const handleChatClick = async (sessionId) => {
        setLoadingState(true);
        const response = await axios.post('http://localhost:5000/user_chat', { session_id: sessionId })
            .then(response => {
                const chatMessages = response.data.chatMessages;
                
                // Store chatMessages in localStorage
                localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
                
                // Optionally, you can also navigate to a different route or update UI here
                console.log('Chat messages stored in localStorage', chatMessages);
            })
            .catch(error => {
                console.error('Error fetching chat messages:', error);
            });
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            {/* User Profile Section */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                {/* Profile Picture */}
                <img 
                    src={UserAvatar} 
                    alt="User Profile" 
                    style={{
                        borderRadius: '50%',
                        width: '100px',
                        height: '100px',
                        objectFit: 'cover',
                        marginRight: '20px'
                    }} 
                />
                {/* Username */}
                <h2>{username || 'No Username Available'}</h2>
            </div>

            {/* PDF Links Strip */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#b0b0b0',  // Darker gray background
                padding: '10px',
                marginBottom: '20px',
                flexWrap: 'wrap'
            }}>
                {pdfLinks.length > 0 ? (
                    pdfLinks.map((pdf, index) => (
                        <a 
                            key={index} 
                            href={pdf['file_url']} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            style={{ margin: '0 10px', textDecoration: 'none', color: '#1976d2' }}
                        >
                            PDF {index + 1}
                        </a>
                    ))
                ) : (
                    <p>No PDF links available</p>
                )}
            </div>

            {/* Chat Cards Section */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
                {chats.map((chat) => (
                    <ChatCard
                        key={chat.sessionId}  // Use session ID as the key
                        title={chat.title}
                        summary={chat.summary}
                        timestamp={chat.timestamp}
                        redirectUrl={`/chat/${chat.title.replace(/\s+/g, '-').toLowerCase()}`}
                        onClick={() => handleChatClick(chat.sessionId)} 
                    />
                ))}
            </div>
        </div>
    );
}

export default UserProfile;
