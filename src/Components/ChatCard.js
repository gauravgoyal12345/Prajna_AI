import React from 'react';
import { Card, CardActionArea, CardMedia, CardContent, Typography, IconButton, Tooltip, Box } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useNavigate } from 'react-router-dom';

const ChatCard = ({ title, image, summary, redirectUrl }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(redirectUrl);
  };

  return (
    <Card sx={{ width: 300, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      {/* Clickable card area */}
      <CardActionArea onClick={handleCardClick}>
        {/* Image at the top */}
        <CardMedia
          component="img"
          height="140"
          image={image}
          alt={title}
        />

        {/* Card title */}
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
        </CardContent>
      </CardActionArea>

      {/* Question mark icon at the bottom-right with tooltip */}
      <Box sx={{ position: 'absolute', bottom: 10, right: 10 }}>
        <Tooltip title={summary} placement="top" arrow>
          <IconButton>
            <HelpOutlineIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Card>
  );
};

export default ChatCard;
