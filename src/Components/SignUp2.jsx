import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import bgImg from "../Assets/bg3.avif"; // Make sure the path to the image is correct

export default function SignUpForm() {
  const [signUpData, setSignUpData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [emptyField, setEmptyFieldAlert] = useState(false);
  const [incorrectField, setIncorrectFieldAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleSignUpChange = (e) => {
    const { name, value } = e.target;
    setSignUpData((prevState) => ({
      ...prevState,
      [name]: value // Store value as-is
    }));

    // Reset alerts
    if (emptyField) {
      setEmptyFieldAlert(false);
    }
    if (incorrectField) {
      setIncorrectFieldAlert(false);
    }
    if (alertMessage) {
      setAlertMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    if (Object.values(signUpData).some(field => field === '')) {
      setEmptyFieldAlert(true);
      return;
    }

    if (signUpData.password !== signUpData.confirmPassword) {
      setIncorrectFieldAlert(true);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/signup', signUpData);
      console.log('Success:', response.data);
      // Handle successful signup, e.g., show a success message or redirect
    } catch (error) {
      console.error('Error:', error);
      setIncorrectFieldAlert(true); // Handle errors, e.g., show an error message
    }
  };

  return (
    <Grid
      container
      justifyContent="center" // Center items horizontally
      alignItems="center" // Center items vertically
      style={{
        minHeight: '100vh',
        backgroundImage: `url(${bgImg})`, // Correct syntax for backgroundImage
        backgroundSize: 'cover', // Ensures the background covers the whole viewport
        backgroundPosition: 'center', // Centers the background image
        backgroundRepeat: 'no-repeat' // Prevents image repetition
      }}
    >
      <Grid item>
        <Box
          component="form"
          onSubmit={handleSubmit} // Handle form submission
          sx={{
            width: 350,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            padding: 3,
            boxShadow: 3,
            borderRadius: 2,
            backgroundColor: 'rgba(18, 18, 18, 0.8)', // Semi-transparent background for the form
            border: '2px solid #567350', // Green border
          }}
        >
          <Typography variant="h5" component="h1" align="center" sx={{ mb: 2, color: '#ffffff' }}>
            Employee Signup Form
          </Typography>

          <TextField
            name='name'
            label='Name'
            variant='outlined'
            value={signUpData.name}
            onChange={handleSignUpChange}
            error={emptyField}
            helperText={emptyField && "This field cannot be empty"}
            sx={{ input: { color: '#e6f4e4' }, fieldset: { borderColor: '#567350' } }} // Text input color and border
          />

          <TextField
            name='email'
            type='email'
            label='Email Address'
            variant='outlined'
            value={signUpData.email}
            onChange={handleSignUpChange}
            error={emptyField}
            helperText={emptyField && "This field cannot be empty"}
            sx={{ input: { color: '#e6f4e4' }, fieldset: { borderColor: '#567350' } }}
          />

          <TextField
            name='password'
            type='password'
            label='Password'
            variant='outlined'
            value={signUpData.password}
            onChange={handleSignUpChange}
            error={emptyField}
            helperText={emptyField && "This field cannot be empty"}
            sx={{ input: { color: '#e6f4e4' }, fieldset: { borderColor: '#567350' } }}
          />

          <TextField
            name='confirmPassword'
            type='password'
            label='Confirm Password'
            variant='outlined'
            value={signUpData.confirmPassword}
            onChange={handleSignUpChange}
            error={emptyField || incorrectField}
            helperText={(emptyField && "This field cannot be empty") || (incorrectField && "Passwords do not match")}
            sx={{ input: { color: '#e6f4e4' }, fieldset: { borderColor: '#567350' } }}
          />

          <Button 
            variant="contained" 
            type="submit" 
            sx={{
              backgroundColor: '#567350', // Button background color
              color: '#e6f4e4', // Button text color
              '&:hover': {
                backgroundColor: '#4a6d44' // Darker green on hover
              }
            }}
          >
            Submit
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
}
