
import React from 'react';
import { Card, CardActionArea, CardMedia, CardContent, Typography, IconButton, Tooltip, Box } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import { useNavigate } from 'react-router-dom';
import ChatUI from '../Assets/ChatAvator.jpg';

const ChatCard = ({ title, image, summary, onClick }) => {
  const handleCardClick = () => {
    if (onClick) {
      onClick(); // Call the onClick prop if provided
    }
  };


  return (
    <Card sx={{ width: 300, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      {/* Clickable card area */}
      <CardActionArea onClick={handleCardClick}>
        {/* Image at the top */}
        <CardMedia
          component="img"
          height="140"
          image={ChatUI}
          alt={title}
        />

        {/* Card title with grey background */}
        <CardContent sx={{ backgroundColor: 'lightgrey', padding: '10px', borderRadius: '5px', minHeight: '50px', position: 'relative' }}>
          <Typography 
            gutterBottom 
            variant="h6" 
            component="div" 
            sx={{ fontSize: '16px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', paddingRight: '30px' }} // Added padding to the right
          >
            {title}
          </Typography>
        </CardContent>
      </CardActionArea>

      {/* Info icon at the bottom-right with tooltip */}
      <Box sx={{ position: 'absolute', bottom: 10, right: 10 }}>
        <Tooltip title={summary} placement="top" arrow>
          <IconButton aria-label="More info about the chat summary">
            <ReceiptOutlinedIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Card>
  );
};

export default ChatCard;
